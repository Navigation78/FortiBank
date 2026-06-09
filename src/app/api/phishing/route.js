// src/app/api/phishing/route.js
// GET - employee: their own phishing results

import { NextResponse } from 'next/server'
import { getRouteUser, unauthorizedResponse } from '@/lib/supabaseRoute'
import { withApiHandler } from '@/lib/apiHandler'

export const GET = withApiHandler(async (request) => {
  const { user, supabase, networkError } = await getRouteUser(request)
  if (!user) return unauthorizedResponse(networkError)

  const { data: targets, error } = await supabase
    .from('phishing_targets')
    .select(`
      id,
      result,
      sent_at,
      opened_at,
      clicked_at,
      phishing_campaigns (
        id,
        name,
        email_subject,
        started_at,
        status
      )
    `)
    .eq('user_id', user.id)
    .order('sent_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ targets: targets || [] })
})
