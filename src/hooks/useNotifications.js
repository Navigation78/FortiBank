'use client'

// src/hooks/useNotifications.js
// Polls /api/notifications and exposes helpers used by the bell and inbox page.

import { useState, useEffect, useCallback, useRef } from 'react'

const POLL_INTERVAL_MS = 30_000  // 30 s

export function useNotifications({ filter = 'all', type = null, page = 1, enabled = true } = {}) {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount]     = useState(0)
  const [total, setTotal]                 = useState(0)
  const [hasMore, setHasMore]             = useState(false)
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState(null)
  const timerRef = useRef(null)

  const fetchNotifications = useCallback(async (silent = false) => {
    if (!enabled) return
    if (!silent) setLoading(true)
    try {
      const params = new URLSearchParams({ filter, page: String(page) })
      if (type) params.set('type', type)

      const res  = await fetch(`/api/notifications?${params}`)
      const json = await res.json()

      if (!res.ok) throw new Error(json.error || 'Failed to load notifications')

      setNotifications(json.notifications || [])
      setTotal(json.total || 0)
      setHasMore(json.hasMore || false)
      setError(null)

      // Always refresh badge count with an unread-only query for accuracy
      if (filter !== 'unread') {
        const ubRes  = await fetch('/api/notifications?filter=unread&page=1')
        const ubJson = await ubRes.json()
        setUnreadCount(ubJson.total || 0)
      } else {
        setUnreadCount(json.total || 0)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [enabled, filter, type, page])

  // Initial load + polling
  useEffect(() => {
    fetchNotifications()
    timerRef.current = setInterval(() => fetchNotifications(true), POLL_INTERVAL_MS)
    return () => clearInterval(timerRef.current)
  }, [fetchNotifications])

  // Sync across hook instances when any instance marks all as read
  useEffect(() => {
    const handleAllRead = () => {
      setUnreadCount(0)
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    }
    window.addEventListener('notifications:all-read', handleAllRead)
    return () => window.removeEventListener('notifications:all-read', handleAllRead)
  }, [])

  const markAsRead = useCallback(async (id, isRead = true) => {
    // Optimistic update
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, is_read: isRead } : n)
    )
    setUnreadCount(prev => isRead ? Math.max(0, prev - 1) : prev + 1)

    await fetch(`/api/notifications/${id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ is_read: isRead }),
    })
  }, [])

  const markAllRead = useCallback(async () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    setUnreadCount(0)
    await fetch('/api/notifications/read-all', { method: 'PATCH' })
    window.dispatchEvent(new CustomEvent('notifications:all-read'))
  }, [])

  const deleteNotification = useCallback(async (id) => {
    const removed = notifications.find(n => n.id === id)
    setNotifications(prev => prev.filter(n => n.id !== id))
    setTotal(prev => Math.max(0, prev - 1))
    if (removed && !removed.is_read) setUnreadCount(prev => Math.max(0, prev - 1))

    await fetch(`/api/notifications/${id}`, { method: 'DELETE' })
  }, [notifications])

  const refresh = useCallback(() => fetchNotifications(), [fetchNotifications])

  return {
    notifications,
    unreadCount,
    total,
    hasMore,
    loading,
    error,
    markAsRead,
    markAllRead,
    deleteNotification,
    refresh,
  }
}
