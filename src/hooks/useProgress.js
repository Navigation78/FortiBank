
// src/hooks/useProgress.js
// Tracks and updates module progress for the current user.


import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { logger } from '@/lib/logger'

export function useProgress() {
  const { user } = useAuth()
  const [updating, setUpdating] = useState(false)

  async function postProgress(body) {
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        return { error: data.error || 'Failed to update progress' }
      }

      return { error: null }
    } catch (err) {
      logger.error(err, { hook: 'useProgress', body })
      return { error: 'Network error updating progress' }
    }
  }

  // Start a module - sets status to in_progress
  async function startModule(moduleId) {
    if (!user) return { error: 'Not authenticated' }
    setUpdating(true)
    const result = await postProgress({ module_id: moduleId, status: 'in_progress', progress_pct: 0 })
    setUpdating(false)
    return result
  }

  // Update progress percentage as user scrolls through content
  async function updateProgress(moduleId, progressPct) {
    if (!user) return { error: 'Not authenticated' }
    return postProgress({
      module_id:    moduleId,
      status:       progressPct >= 100 ? 'completed' : 'in_progress',
      progress_pct: Math.min(progressPct, 100),
    })
  }

  // Mark module as fully completed
  async function completeModule(moduleId) {
    if (!user) return { error: 'Not authenticated' }
    setUpdating(true)
    const result = await postProgress({ module_id: moduleId, status: 'completed', progress_pct: 100 })
    setUpdating(false)
    return result
  }

  return {
    updating,
    startModule,
    updateProgress,
    completeModule,
  }
}

export default useProgress