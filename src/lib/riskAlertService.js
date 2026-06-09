// src/lib/riskAlertService.js
// Shared: given a freshly-calculated risk_scores record, check whether the
// warning/critical threshold was just crossed and fire in-app + email alerts.
// Called from both the risk-score POST route and the phishing click route so
// the logic lives in one place.

import supabaseAdmin from '@/lib/supabaseAdmin'
import { sendRiskAlertEmail } from '@/lib/email'
import { createNotification, NOTIFICATION_TYPES } from '@/lib/notificationService'

export async function triggerRiskAlerts(newScore, userId) {
  if (!newScore?.is_warning && !newScore?.is_critical) return

  const severity = newScore.is_critical ? 'critical' : 'warning'

  // One alert per severity per 24 hours — don't spam the employee
  const { data: recentAlert } = await supabaseAdmin
    .from('risk_alerts')
    .select('id')
    .eq('user_id', userId)
    .eq('severity', severity)
    .eq('status', 'active')
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    .limit(1)
    .maybeSingle()

  if (recentAlert) return

  const alertMessage =
    `Your risk score of ${Math.round(newScore.composite_score)} has exceeded the ${severity} threshold.`

  const { data: alert } = await supabaseAdmin
    .from('risk_alerts')
    .insert({
      user_id:       userId,
      risk_score_id: newScore.id,
      severity,
      status:        'active',
      message:       alertMessage,
    })
    .select()
    .single()

  await createNotification({
    userId,
    title:   severity === 'critical' ? 'Critical risk alert' : 'Risk score warning',
    message: alertMessage + ' Please complete your training modules to reduce your risk score.',
    type:    NOTIFICATION_TYPES.RISK_ALERT,
    link:    '/risk-score',
  })

  const { data: profile } = await supabaseAdmin
    .from('users_with_roles')
    .select('email, full_name, role_display_name')
    .eq('id', userId)
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
