// src/hooks/useModules.js
// Fetches modules assigned to the current user's role via the API route.
// Uses the server-side API so RLS never blocks the query.

'use client'

import { useState, useEffect } from 'react'

export function useModules() {
  const [modules, setModules]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  useEffect(() => {
    fetchModules()
  }, [])

  async function fetchModules() {
    setLoading(true)
    setError(null)

    try {
      const res  = await fetch('/api/modules')
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to load modules')
        setLoading(false)
        return
      }

      setModules(data.modules || [])
    } catch (err) {
      setError('Network error loading modules')
    } finally {
      setLoading(false)
    }
  }

  async function fetchModuleById(moduleId) {
    try {
      const res  = await fetch(`/api/modules/${moduleId}`)
      const data = await res.json()

      if (!res.ok) return { data: null, error: data.error || 'Failed to load module' }

      return { data: data.module, error: null }
    } catch (err) {
      return { data: null, error: 'Network error' }
    }
  }

  // Stats for dashboard widgets
  const completedCount = modules.filter(m => m.progress?.status === 'completed').length
  const stats = {
    total:      modules.length,
    completed:  completedCount,
    inProgress: modules.filter(m => m.progress?.status === 'in_progress').length,
    notStarted: modules.filter(m => m.progress?.status === 'not_started' || !m.progress).length,
    // Percentage of modules fully completed — matches the ProgressChart calculation
    overallPct: modules.length > 0 ? Math.round((completedCount / modules.length) * 100) : 0,
  }

  return {
    modules,
    loading,
    error,
    stats,
    refetch:         fetchModules,
    fetchModuleById,
  }
}

export default useModules