// src/app/api/reports/route.js
// GET — generates CSV reports for admin export
// Query params: type = 'users' | 'risk' | 'phishing' | 'completion'

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import supabaseAdmin from '@/lib/supabaseAdmin'

async function verifyAdmin(cookieStore) {
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
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabaseAdmin
    .from('user_roles').select('roles(name)').eq('user_id', user.id).single()
  if (data?.roles?.name !== 'system_admin') return null
  return user
}

function toCSV(headers, rows) {
  const escape = val => {
    if (val === null || val === undefined) return ''
    const str = String(val)
    return str.includes(',') || str.includes('"') || str.includes('\n')
      ? `"${str.replace(/"/g, '""')}"`
      : str
  }
  const headerRow = headers.join(',')
  const dataRows  = rows.map(row => headers.map(h => escape(row[h])).join(','))
  return [headerRow, ...dataRows].join('\n')
}

export async function GET(request) {
  const cookieStore = await cookies()
  const admin = await verifyAdmin(cookieStore)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || 'users'

  let csv = ''
  let filename = ''
  const date = new Date().toISOString().split('T')[0]

  if (type === 'users') {
    const { data } = await supabaseAdmin
      .from('users_with_roles')
      .select('full_name, email, employee_id, department, role_display_name, role_category, is_active, created_at')
      .order('created_at')

    filename = `fortibank-employees-${date}.csv`
    csv = toCSV(
      ['full_name', 'email', 'employee_id', 'department', 'role_display_name', 'role_category', 'is_active', 'created_at'],
      data || []
    )
  }

  else if (type === 'risk') {
    const { data: users } = await supabaseAdmin
      .from('users_with_roles')
      .select('id, full_name, email, role_display_name, role_category')

    const { data: scores } = await supabaseAdmin
      .from('risk_scores')
      .select('user_id, composite_score, phishing_score, quiz_score, phishing_clicks, phishing_attempts, quizzes_taken, quizzes_passed, is_warning, is_critical, calculated_at')
      .order('calculated_at', { ascending: false })

    // Latest per user
    const latest = {}
    scores?.forEach(s => { if (!latest[s.user_id]) latest[s.user_id] = s })

    const rows = (users || []).map(u => ({
      full_name:         u.full_name,
      email:             u.email,
      role:              u.role_display_name,
      category:          u.role_category,
      composite_score:   Math.round(latest[u.id]?.composite_score || 0),
      phishing_score:    Math.round(latest[u.id]?.phishing_score || 0),
      quiz_score:        Math.round(latest[u.id]?.quiz_score || 0),
      phishing_clicks:   latest[u.id]?.phishing_clicks || 0,
      phishing_attempts: latest[u.id]?.phishing_attempts || 0,
      quizzes_passed:    latest[u.id]?.quizzes_passed || 0,
      quizzes_taken:     latest[u.id]?.quizzes_taken || 0,
      is_critical:       latest[u.id]?.is_critical ? 'Yes' : 'No',
      last_calculated:   latest[u.id]?.calculated_at?.split('T')[0] || 'Never',
    }))

    filename = `fortibank-risk-scores-${date}.csv`
    csv = toCSV(
      ['full_name', 'email', 'role', 'category', 'composite_score', 'phishing_score', 'quiz_score', 'phishing_clicks', 'phishing_attempts', 'quizzes_passed', 'quizzes_taken', 'is_critical', 'last_calculated'],
      rows
    )
  }

  else if (type === 'phishing') {
    const { data } = await supabaseAdmin
      .from('phishing_targets')
      .select(`
        result, sent_at, clicked_at, reported_at,
        users ( full_name, email ),
        phishing_campaigns ( name, email_subject, started_at )
      `)
      .order('sent_at', { ascending: false })

    const rows = (data || []).map(t => ({
      employee_name:  t.users?.full_name,
      email:          t.users?.email,
      campaign:       t.phishing_campaigns?.name,
      subject:        t.phishing_campaigns?.email_subject,
      result:         t.result,
      sent_at:        t.sent_at?.split('T')[0] || '',
      clicked_at:     t.clicked_at?.split('T')[0] || '',
      reported_at:    t.reported_at?.split('T')[0] || '',
    }))

    filename = `fortibank-phishing-results-${date}.csv`
    csv = toCSV(
      ['employee_name', 'email', 'campaign', 'subject', 'result', 'sent_at', 'clicked_at', 'reported_at'],
      rows
    )
  }

  else if (type === 'completion') {
    const { data } = await supabaseAdmin
      .from('user_module_progress')
      .select(`
        status, progress_pct, started_at, completed_at,
        users ( full_name, email ),
        modules ( title )
      `)
      .order('updated_at', { ascending: false })

    const rows = (data || []).map(p => ({
      employee:    p.users?.full_name,
      email:       p.users?.email,
      module:      p.modules?.title,
      status:      p.status,
      progress:    `${p.progress_pct}%`,
      started_at:  p.started_at?.split('T')[0] || '',
      completed_at: p.completed_at?.split('T')[0] || '',
    }))

    filename = `fortibank-module-completion-${date}.csv`
    csv = toCSV(
      ['employee', 'email', 'module', 'status', 'progress', 'started_at', 'completed_at'],
      rows
    )
  }

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type':        'text/csv',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}