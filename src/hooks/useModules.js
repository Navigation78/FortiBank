
// src/hooks/useModules.js
// Fetches modules assigned to the current user's role.

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

export function useModules() {
  const supabase = createClient()
  const { user } = useAuth()

  const [modules, setModules]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  useEffect(() => {
    if (!user) return
    fetchModules()
  }, [user])

  async function fetchModules() {
    setLoading(true)
    setError(null)

    const { data, error } = await supabase
      .from('modules')
      .select(`
        id,
        title,
        description,
        thumbnail_url,
        status,
        order_index,
        duration_mins,
        user_module_progress (
          status,
          progress_pct,
          started_at,
          completed_at
        )
      `)
      .eq('status', 'published')
      .order('order_index', { ascending: true })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Flatten progress into each module
    const modulesWithProgress = data.map(m => ({
      ...m,
      progress: m.user_module_progress?.[0] || {
        status: 'not_started',
        progress_pct: 0,
        started_at: null,
        completed_at: null,
      },
    }))

    setModules(modulesWithProgress)
    setLoading(false)
  }

  async function fetchModuleById(moduleId) {
    const { data, error } = await supabase
      .from('modules')
      .select(`
        id,
        title,
        description,
        thumbnail_url,
        duration_mins,
        order_index,
        module_content (
          id,
          title,
          content_type,
          content_url,
          content_body,
          order_index
        ),
        user_module_progress (
          status,
          progress_pct,
          started_at,
          completed_at
        ),
        quizzes (
          id,
          title,
          pass_score,
          max_attempts,
          time_limit_mins
        )
      `)
      .eq('id', moduleId)
      .eq('status', 'published')
      .order('order_index', { foreignTable: 'module_content', ascending: true })
      .single()

    if (error) return { data: null, error: error.message }

    return {
      data: {
        ...data,
        progress: data.user_module_progress?.[0] || {
          status: 'not_started',
          progress_pct: 0,
        },
        quiz: data.quizzes?.[0] || null,
        content: data.module_content || [],
      },
      error: null,
    }
  }

  // Stats for dashboard
  const stats = {
    total:     modules.length,
    completed: modules.filter(m => m.progress?.status === 'completed').length,
    inProgress: modules.filter(m => m.progress?.status === 'in_progress').length,
    notStarted: modules.filter(m => m.progress?.status === 'not_started').length,
    overallPct: modules.length > 0
      ? Math.round(
          modules.reduce((sum, m) => sum + (m.progress?.progress_pct || 0), 0)
          / modules.length
        )
      : 0,
  }

  return {
    modules,
    loading,
    error,
    stats,
    refetch: fetchModules,
    fetchModuleById,
  }
}

export default useModules