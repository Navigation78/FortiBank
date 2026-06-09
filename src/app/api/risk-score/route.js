// src/app/api/risk-score/route.js
// GET  - returns latest risk score for current user
// POST - triggers recalculation via Postgres function

import { NextResponse } from 'next/server'
import supabaseAdmin from '@/lib/supabaseAdmin'
import { getRouteUser, unauthorizedResponse } from '@/lib/supabaseRoute'
import { triggerRiskAlerts } from '@/lib/riskAlertService'
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

  if (newScore) await triggerRiskAlerts(newScore, user.id)

  return NextResponse.json({ score: newScore })
})
