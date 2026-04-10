
// src/hooks/useProgress.js
// Tracks and updates module progress for the current user.


import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

export function useProgress() {
  const { user } = useAuth()
  const [updating, setUpdating] = useState(false)

  // Start a module — sets status to in_progress
  async function startModule(moduleId) {
    if (!user) return { error: 'Not authenticated' }
    setUpdating(true)

    const res = await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        module_id:    moduleId,
        status:       'in_progress',
        progress_pct: 0,
      }),
    })

    setUpdating(false)
    if (!res.ok) return { error: 'Failed to start module' }
    return { error: null }
  }

  // Update progress percentage as user scrolls through content
  async function updateProgress(moduleId, progressPct) {
    if (!user) return { error: 'Not authenticated' }

    const res = await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        module_id:    moduleId,
        status:       progressPct >= 100 ? 'completed' : 'in_progress',
        progress_pct: Math.min(progressPct, 100),
      }),
    })

    if (!res.ok) return { error: 'Failed to update progress' }
    return { error: null }
  }

  // Mark module as fully completed
  async function completeModule(moduleId) {
    if (!user) return { error: 'Not authenticated' }
    setUpdating(true)

    const res = await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        module_id:    moduleId,
        status:       'completed',
        progress_pct: 100,
      }),
    })

    setUpdating(false)
    if (!res.ok) return { error: 'Failed to complete module' }
    return { error: null }
  }

  return {
    updating,
    startModule,
    updateProgress,
    completeModule,
  }
}

export default useProgress