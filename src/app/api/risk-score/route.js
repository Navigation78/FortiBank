// src/app/api/risk-score/route.js
// GET  - returns latest risk score for current user
// POST - triggers recalculation via Postgres function

import { NextResponse } from 'next/server'
import supabaseAdmin from '@/lib/supabaseAdmin'
import { sendRiskAlertEmail } from '@/lib/email'
import { getRouteUser, unauthorizedResponse } from '@/lib/supabaseRoute'
import { createNotification, NOTIFICATION_TYPES } from '@/lib/notificationService'
import { withApiHandler } from '@/lib/apiHandler'

export const GET = withApiHandler(async (request) => {
  const { user, supabase, networkError } = await getRouteUser(request)
  if (!user) return unauthorizedResponse(networkError)

  const { data, error } = await supabase
    .from('risk_scores')
    .select('*')
    .eq('user_id', user.id)
    .order('calculated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ score: data || null })
})

export const POST = withApiHandler(async (request) => {
  const { user, networkError } = await getRouteUser(request)
  if (!user) return unauthorizedResponse(networkError)

  const { data: newScore, error: calcError } = await supabaseAdmin
    .rpc('calculate_user_risk_score', { p_user_id: user.id })

  if (calcError) {
    return NextResponse.json({ error: calcError.message }, { status: 500 })
  }

  if (newScore?.is_warning || newScore?.is_critical) {
    const severity = newScore.is_critical ? 'critical' : 'warning'

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
      const alertMessage = `Your risk score of ${Math.round(newScore.composite_score)} has exceeded the ${severity} threshold.`

      const { data: alert } = await supabaseAdmin
        .from('risk_alerts')
        .insert({
          user_id:       user.id,
          risk_score_id: newScore.id,
          severity,
          status:        'active',
          message:       alertMessage,
        })
        .select()
        .single()

      await createNotification({
        userId:  user.id,
        title:   severity === 'critical' ? 'Critical risk alert' : 'Risk score warning',
        message: alertMessage + ' Please complete your training modules to reduce your risk score.',
        type:    NOTIFICATION_TYPES.RISK_ALERT,
        link:    '/risk-score',
      })

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
})
