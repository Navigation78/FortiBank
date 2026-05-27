// src/app/api/phishing/route.js
// GET  - employee: their own phishing results
//        admin: all campaigns


import { NextResponse } from 'next/server'
import { getRouteUser, unauthorizedResponse } from '@/lib/supabaseRoute'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const view = searchParams.get('view') // 'employee' or 'admin'

  const { user, supabase, networkError } = await getRouteUser(request)
  if (!user) return unauthorizedResponse(networkError)

  // Employee view - their own phishing results
  const { data: targets, error } = await supabase
    .from('phishing_targets')
    .select(`
      id,
      result,
      sent_at,
      opened_at,
      clicked_at,
      reported_at,
      phishing_campaigns (
        id,
        name,
        email_subject,
        started_at,
        completed_at,
        status
      )
    `)
    .eq('user_id', user.id)
    .order('sent_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ targets: targets || [] })
}
