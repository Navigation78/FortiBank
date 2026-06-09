// src/app/api/phishing/click/route.js
// POST - records when an employee clicks a phishing link.
// No auth required - token identifies the target.

import { NextResponse } from 'next/server'
import supabaseAdmin from '@/lib/supabaseAdmin'
import { createNotification, NOTIFICATION_TYPES } from '@/lib/notificationService'
import { triggerRiskAlerts } from '@/lib/riskAlertService'
import { withApiHandler } from '@/lib/apiHandler'
import { ValidationError } from '@/lib/errors'
import { logger } from '@/lib/logger'

export const POST = withApiHandler(async (request) => {
  const body = await request.json()
  const { token } = body

  if (!token) {
    throw new ValidationError('Token required', { field: 'token' })
  }

  const { data: target, error: targetError } = await supabaseAdmin
    .from('phishing_targets')
    .select('id, user_id, result, campaign_id')
    .eq('tracking_token', token)
    .single()

  if (targetError || !target) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 404 })
  }

  const now = new Date().toISOString()

  // Track whether this is a new click (transitioning from sent/opened → clicked)
  const isFirstClick = target.result === 'sent' || target.result === 'opened'

  if (target.result !== 'reported') {
    await supabaseAdmin
      .from('phishing_targets')
      .update({ result: 'clicked', clicked_at: now })
      .eq('id', target.id)
  }

  // Always log the raw click event for audit purposes
  await supabaseAdmin
    .from('phishing_click_events')
    .insert({ target_id: target.id, event_type: 'clicked', occurred_at: now })

  // Only recalculate risk and notify on the first click — repeat clicks must not inflate scores
  // or spam the employee with duplicate notifications
  if (isFirstClick) {
    const { data: newScore } = await supabaseAdmin.rpc('calculate_user_risk_score', { p_user_id: target.user_id })

    await createNotification({
      userId:  target.user_id,
      title:   'Phishing simulation alert',
      message: 'You clicked a simulated phishing link. This was a security awareness test. Please review the phishing awareness module to learn how to spot suspicious emails.',
      type:    NOTIFICATION_TYPES.PHISHING,
      link:    '/results',
    })

    // Fire warning/critical alert + email if the click pushed the score over the threshold
    if (newScore) await triggerRiskAlerts(newScore, target.user_id)
  }

  return NextResponse.json({ recorded: true })
})
