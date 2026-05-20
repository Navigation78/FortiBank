// src/lib/notificationService.js
// Central service for creating in-app notifications.
// Always use supabaseAdmin so it bypasses RLS and can write for any user.
// All other modules (quiz, phishing, risk-score, etc.) must call these
// helpers instead of writing to the notifications table directly.

import supabaseAdmin from '@/lib/supabaseAdmin'

export const NOTIFICATION_TYPES = {
  MODULE:       'module',
  QUIZ:         'quiz',
  PHISHING:     'phishing',
  RISK_ALERT:   'risk_alert',
  CERTIFICATE:  'certificate',
  ANNOUNCEMENT: 'announcement',
  SYSTEM:       'system',
}

/**
 * Create a single notification for one user.
 * Returns the created row or null on error.
 */
export async function createNotification({ userId, title, message, type = NOTIFICATION_TYPES.SYSTEM, link = null }) {
  const { data, error } = await supabaseAdmin
    .from('notifications')
    .insert({ user_id: userId, title, message, type, link })
    .select()
    .single()

  if (error) {
    console.error('[notificationService] insert error:', error.message)
    return null
  }
  return data
}

/**
 * Create the same notification for multiple users at once.
 * Returns the count of created rows.
 */
export async function createNotificationForMany(userIds, { title, message, type = NOTIFICATION_TYPES.SYSTEM, link = null }) {
  if (!userIds?.length) return 0

  // Deduplicate
  const unique = [...new Set(userIds)]

  const rows = unique.map(userId => ({ user_id: userId, title, message, type, link }))
  const { data, error } = await supabaseAdmin
    .from('notifications')
    .insert(rows)
    .select('id')

  if (error) {
    console.error('[notificationService] bulk insert error:', error.message)
    return 0
  }
  return data?.length ?? 0
}

/**
 * Notify all users assigned to a set of role IDs.
 * Used when admin publishes a module or sends an announcement.
 */
export async function notifyUsersWithRoles(roleIds, { title, message, type, link }) {
  if (!roleIds?.length) return 0

  const { data: users, error } = await supabaseAdmin
    .from('user_roles')
    .select('user_id')
    .in('role_id', roleIds)

  if (error || !users?.length) return 0

  const userIds = users.map(u => u.user_id)
  return createNotificationForMany(userIds, { title, message, type, link })
}
