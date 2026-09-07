// src/hooks/useRiskScore.js
// Fetches risk score history and latest score for current user.


import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useRole } from '@/hooks/useRole'
import { getRiskLevel, formatScoreHistory } from '@/lib/riskCalculator'
import { logger } from '@/lib/logger'

export function useRiskScore() {
  const supabase        = createClient()
  const { user }        = useAuth()
  const { role }        = useRole()

  const [latest, setLatest]       = useState(null)
  const [history, setHistory]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [recalculating, setRecalculating] = useState(false)

  useEffect(() => {
    if (!user) return
    loadRiskScore()
  }, [user])

  async function fetchFromDB() {
    try {
      const { data: latestData, error: latestError } = await supabase
        .from('risk_scores')
        .select('*')
        .eq('user_id', user.id)
        .order('calculated_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (latestError && latestError.code !== 'PGRST116') {
        logger.error(latestError, { hook: 'useRiskScore', action: 'fetchFromDB' })
        setError(latestError.message)
      }

      return latestData || null
    } catch (err) {
      logger.error(err, { hook: 'useRiskScore', action: 'fetchFromDB' })
      setError('Network error loading risk score')
      return null
    }
  }

  async function fetchHistory() {
    try {
      const { data: historyData, error: historyError } = await supabase
        .from('risk_scores')
        .select('composite_score, phishing_score, quiz_score, calculated_at')
        .eq('user_id', user.id)
        .order('calculated_at', { ascending: false })
        .limit(10)

      if (historyError) {
        logger.error(historyError, { hook: 'useRiskScore', action: 'fetchHistory' })
        return
      }

      if (historyData) {
        setHistory(formatScoreHistory(historyData.reverse()))
      }
    } catch (err) {
      logger.error(err, { hook: 'useRiskScore', action: 'fetchHistory' })
    }
  }

  function applyLatest(latestData) {
    if (latestData) {
      setLatest({
        ...latestData,
        composite_score: Math.round(latestData.composite_score),
        phishing_score:  Math.round(latestData.phishing_score),
        quiz_score:      Math.round(latestData.quiz_score),
        riskLevel:       getRiskLevel(Math.round(latestData.composite_score), role),
      })
    }
  }

  async function loadRiskScore() {
    setLoading(true)
    setError(null)

    let latestData = await fetchFromDB()

    // No score yet — calculate from real data now
    if (!latestData) {
      try {
        const res = await fetch('/api/risk-score', { method: 'POST' })
        if (res.ok) {
          latestData = await fetchFromDB()
        }
      } catch (err) {
        logger.error(err, { hook: 'useRiskScore', action: 'calculate' })
        setError('Network error calculating risk score')
      }
    }

    applyLatest(latestData)
    await fetchHistory()

    setLoading(false)
  }

  async function fetchRiskScore() {
    setLoading(true)
    setError(null)

    const latestData = await fetchFromDB()
    applyLatest(latestData)
    await fetchHistory()

    setLoading(false)
  }

  // Trigger a fresh risk score calculation
  async function recalculate() {
    setRecalculating(true)
    try {
      const res = await fetch('/api/risk-score', { method: 'POST' })
      if (res.ok) {
        await fetchRiskScore()
      } else {
        setError('Failed to recalculate risk score')
      }
    } catch (err) {
      logger.error(err, { hook: 'useRiskScore', action: 'recalculate' })
      setError('Network error recalculating risk score')
    } finally {
      setRecalculating(false)
    }
  }

  return {
    latest,
    history,
    loading,
    error,
    recalculating,
    refetch: fetchRiskScore,
    recalculate,
    score:        latest != null ? Math.round(latest.composite_score) : null,
    phishingScore: latest != null ? Math.round(latest.phishing_score) : null,
    quizScore:    latest != null ? Math.round(latest.quiz_score) : null,
    isWarning:    latest?.is_warning ?? false,
    isCritical:   latest?.is_critical ?? false,
    riskLevel:    latest?.riskLevel ?? null,
  }
}

export default useRiskScore
