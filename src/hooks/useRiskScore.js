// src/hooks/useRiskScore.js
// Fetches risk score history and latest score for current user.


import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useRole } from '@/hooks/useRole'
import { getRiskLevel, formatScoreHistory } from '@/lib/riskCalculator'

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
    fetchRiskScore()
  }, [user])

  async function fetchRiskScore() {
    setLoading(true)
    setError(null)

    // Latest score
    const { data: latestData, error: latestError } = await supabase
      .from('risk_scores')
      .select('*')
      .eq('user_id', user.id)
      .order('calculated_at', { ascending: false })
      .limit(1)
      .single()

    if (latestError && latestError.code !== 'PGRST116') {
      // PGRST116 = no rows found — that's fine for new users
      setError(latestError.message)
    }

    if (latestData) {
      setLatest({
        ...latestData,
        composite_score: Math.round(latestData.composite_score),
        phishing_score:  Math.round(latestData.phishing_score),
        quiz_score:      Math.round(latestData.quiz_score),
        riskLevel:       getRiskLevel(Math.round(latestData.composite_score), role),
      })
    }

    // Score history (last 10)
    const { data: historyData } = await supabase
      .from('risk_scores')
      .select('composite_score, phishing_score, quiz_score, calculated_at')
      .eq('user_id', user.id)
      .order('calculated_at', { ascending: false })
      .limit(10)

    if (historyData) {
      setHistory(formatScoreHistory(historyData.reverse()))
    }

    setLoading(false)
  }

  // Trigger a fresh risk score calculation
  async function recalculate() {
    setRecalculating(true)
    const res = await fetch('/api/risk-score', { method: 'POST' })
    if (res.ok) {
      await fetchRiskScore()
    }
    setRecalculating(false)
  }

  return {
    latest,
    history,
    loading,
    error,
    recalculating,
    refetch: fetchRiskScore,
    recalculate,
    score:        latest?.composite_score ?? 0,
    phishingScore: latest?.phishing_score ?? 0,
    quizScore:    latest?.quiz_score ?? 0,
    isWarning:    latest?.is_warning ?? false,
    isCritical:   latest?.is_critical ?? false,
    riskLevel:    latest?.riskLevel ?? getRiskLevel(0, role),
  }
}

export default useRiskScore