
// src/app/api/phishing/click/route.js
// POST — records when an employee clicks a phishing link.
// Updates phishing_targets, logs event, recalculates risk score.
// No auth required — token identifies the target.

import { NextResponse } from 'next/server'
import supabaseAdmin from '@/lib/supabaseAdmin'

export async function POST(request) {
  const body = await request.json()
  const { token } = body

  if (!token) {
    return NextResponse.json({ error: 'Token required' }, { status: 400 })
  }

  try {
    // Find target by tracking token
    const { data: target, error: targetError } = await supabaseAdmin
      .from('phishing_targets')
      .select('id, user_id, result, campaign_id')
      .eq('tracking_token', token)
      .single()

    if (targetError || !target) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 404 })
    }

    const now = new Date().toISOString()

    // Update result to clicked (only if not already reported)
    if (target.result !== 'reported') {
      await supabaseAdmin
        .from('phishing_targets')
        .update({
          result:     'clicked',
          clicked_at: now,
        })
        .eq('id', target.id)
    }

    // Log click event
    await supabaseAdmin
      .from('phishing_click_events')
      .insert({
        target_id:   target.id,
        event_type:  'clicked',
        occurred_at: now,
      })

    // Recalculate risk score for this user
    await supabaseAdmin.rpc('calculate_user_risk_score', {
      p_user_id: target.user_id,
    })

    return NextResponse.json({ recorded: true })
  } catch (err) {
    console.error('Click recording error:', err)
    return NextResponse.json({ error: 'Failed to record click' }, { status: 500 })
  }
}