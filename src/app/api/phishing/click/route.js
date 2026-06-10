// src/app/api/phishing/click/route.js
// POST - records when an employee clicks a phishing link.
// No auth required - token identifies the target.
//
// Every click, regardless of whether it is the first per campaign:
//   1. Marks the phishing target as 'clicked'
//   2. Resets the Phishing Awareness module entirely (progress, quiz attempts,
//      knowledge checks, topic progress, certificate) so the user must redo it
//   3. Recalculates the risk score
//   4. Notifies the user
// Risk alerts (manager email etc.) are fired only on the first click per campaign
// to avoid flooding managers with duplicate notifications.

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

  // Track whether this transitions from sent/opened → clicked (first click per campaign)
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

  // ── Reset Phishing Awareness module (order_index = 2) ────────────────────
  // The user must start the module completely from scratch every time they
  // click a simulated phishing link. This clears progress, quiz attempts,
  // knowledge checks, topic progress, and the module certificate.
  const { data: phishingModule } = await supabaseAdmin
    .from('modules')
    .select('id')
    .eq('order_index', 2)
    .single()

  if (phishingModule) {
    const moduleId = phishingModule.id

    // Fetch quiz IDs for this module so we can delete their attempts
    const { data: quizRows } = await supabaseAdmin
      .from('quizzes')
      .select('id')
      .eq('module_id', moduleId)

    const quizIds = (quizRows || []).map(q => q.id)

    await Promise.all([
      // Delete all quiz attempts for this module (quiz_attempt_answers cascade)
      quizIds.length > 0
        ? supabaseAdmin
            .from('quiz_attempts')
            .delete()
            .eq('user_id', target.user_id)
            .in('quiz_id', quizIds)
        : Promise.resolve(),

      // Delete knowledge check attempts
      supabaseAdmin
        .from('knowledge_check_attempts')
        .delete()
        .eq('user_id', target.user_id)
        .eq('module_id', moduleId),

      // Delete topic-level progress records
      supabaseAdmin
        .from('user_topic_progress')
        .delete()
        .eq('user_id', target.user_id)
        .eq('module_id', moduleId),

      // Revoke the module certificate so it must be re-earned
      supabaseAdmin
        .from('certificates')
        .delete()
        .eq('user_id', target.user_id)
        .eq('module_id', moduleId),

      // Reset module-level progress to not_started
      supabaseAdmin
        .from('user_module_progress')
        .upsert(
          {
            user_id:      target.user_id,
            module_id:    moduleId,
            status:       'not_started',
            progress_pct: 0,
            started_at:   null,
            completed_at: null,
            updated_at:   now,
          },
          { onConflict: 'user_id,module_id' }
        ),
    ])

    logger.info('phishing_module_reset', {
      user_id:   target.user_id,
      module_id: moduleId,
    })
  }

  // Recalculate risk score after the module reset (quiz passes have changed)
  const { data: newScore } = await supabaseAdmin
    .rpc('calculate_user_risk_score', { p_user_id: target.user_id })

  await createNotification({
    userId:  target.user_id,
    title:   'Phishing simulation — module reset',
    message: 'You clicked a simulated phishing link. Your Phishing Awareness module has been reset and you must complete it again before your risk score can improve. Review the module carefully to learn how to spot suspicious emails.',
    type:    NOTIFICATION_TYPES.PHISHING,
    link:    '/modules',
  })

  // Fire warning/critical alert + email on first click per campaign only
  if (newScore && isFirstClick) {
    await triggerRiskAlerts(newScore, target.user_id)
  }

  return NextResponse.json({ recorded: true })
})
