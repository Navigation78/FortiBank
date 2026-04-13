// src/app/api/risk-score/route.js
// GET  — returns latest risk score for current user
// POST — triggers recalculation via Postgres function


import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import supabaseAdmin from '@/lib/supabaseAdmin'
import { sendRiskAlertEmail } from '@/lib/email'

export async function GET() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('risk_scores')
    .select('*')
    .eq('user_id', user.id)
    .order('calculated_at', { ascending: false })
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ score: data || null })
}

export async function POST() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Trigger recalculation via Postgres function
  const { data: newScore, error: calcError } = await supabaseAdmin
    .rpc('calculate_user_risk_score', { p_user_id: user.id })

  if (calcError) {
    return NextResponse.json({ error: calcError.message }, { status: 500 })
  }

  // Check if we need to create an alert and send email
  if (newScore?.is_warning || newScore?.is_critical) {
    const severity = newScore.is_critical ? 'critical' : 'warning'

    // Check if we already sent an alert for this severity recently (last 24h)
    const { data: recentAlert } = await supabaseAdmin
      .from('risk_alerts')
      .select('id')
      .eq('user_id', user.id)
      .eq('severity', severity)
      .eq('status', 'active')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .limit(1)
      .single()

    if (!recentAlert) {
      // Create alert record
      const { data: alert } = await supabaseAdmin
        .from('risk_alerts')
        .insert({
          user_id:       user.id,
          risk_score_id: newScore.id,
          severity,
          status:        'active',
          message:       `Your risk score of ${Math.round(newScore.composite_score)} has exceeded the ${severity} threshold.`,
        })
        .select()
        .single()

      // Send alert email
      const { data: profile } = await supabaseAdmin
        .from('users_with_roles')
        .select('email, full_name, role_display_name')
        .eq('id', user.id)
        .single()

      if (profile) {
        const emailResult = await sendRiskAlertEmail({
          to:            profile.email,
          recipientName: profile.full_name,
          severity,
          score:         Math.round(newScore.composite_score),
          roleName:      profile.role_display_name,
        })

        // Mark email as sent
        if (emailResult.success && alert) {
          await supabaseAdmin
            .from('risk_alerts')
            .update({ email_sent: true, email_sent_at: new Date().toISOString() })
            .eq('id', alert.id)
        }
      }
    }
  }

  return NextResponse.json({ score: newScore })
}