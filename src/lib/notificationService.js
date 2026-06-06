// src/lib/notificationService.js
// Central service for creating in-app notifications.
// Always uses supabaseAdmin so it bypasses RLS and can write for any user.

import supabaseAdmin from '@/lib/supabaseAdmin'
import { logger } from '@/lib/logger'

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
 * Returns the created row or null on error (non-critical path — never throws).
 */
export async function createNotification({ userId, title, message, type = NOTIFICATION_TYPES.SYSTEM, link = null }) {
  try {
    const { data, error } = await supabaseAdmin
      .from('notifications')
      .insert({ user_id: userId, title, message, type, link })
      .select()
      .single()

    if (error) {
      logger.error(error, { context: 'createNotification', userId, type })
      return null
    }
    return data
  } catch (err) {
    logger.error(err, { context: 'createNotification', userId, type, title })
    return null
  }
}

/**
 * Create the same notification for multiple users at once.
 * Returns the count of created rows.
 */
export async function createNotificationForMany(userIds, { title, message, type = NOTIFICATION_TYPES.SYSTEM, link = null }) {
  if (!userIds?.length) return 0

  const unique = [...new Set(userIds)]
  const rows = unique.map(userId => ({ user_id: userId, title, message, type, link }))

  try {
    const { data, error } = await supabaseAdmin
      .from('notifications')
      .insert(rows)
      .select('id')

    if (error) {
      logger.error(error, { context: 'createNotificationForMany', userCount: unique.length, type })
      return 0
    }
    return data?.length ?? 0
  } catch (err) {
    logger.error(err, { context: 'createNotificationForMany', userCount: unique.length, type })
    return 0
  }
}

/**
 * Notify all users assigned to a set of role IDs.
 */
export async function notifyUsersWithRoles(roleIds, { title, message, type, link }) {
  if (!roleIds?.length) return 0

  try {
    const { data: users, error } = await supabaseAdmin
      .from('user_roles')
      .select('user_id')
      .in('role_id', roleIds)

    if (error) {
      logger.error(error, { context: 'notifyUsersWithRoles', roleIds })
      return 0
    }
    if (!users?.length) return 0

    const userIds = users.map(u => u.user_id)
    return createNotificationForMany(userIds, { title, message, type, link })
  } catch (err) {
    logger.error(err, { context: 'notifyUsersWithRoles', roleIds })
    return 0
  }
}
