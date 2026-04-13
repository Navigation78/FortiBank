// src/lib/riskCalculator.js
// Client-side risk score helpers.
// The actual calculation happens in the database via
// calculate_user_risk_score() — this file handles UI logic.

import { ROLE_THRESHOLDS } from '@/constants/roles'

/**
 * Returns risk level label and color based on score and role
 */
export function getRiskLevel(score, role) {
  const thresholds = ROLE_THRESHOLDS[role] || { warning: 55, critical: 70 }

  if (score >= thresholds.critical) {
    return {
      level:       'critical',
      label:       'Critical Risk',
      color:       'red',
      textColor:   'text-red-400',
      bgColor:     'bg-red-500/10',
      borderColor: 'border-red-500/30',
      barColor:    'bg-red-500',
    }
  }
  if (score >= thresholds.warning) {
    return {
      level:       'warning',
      label:       'High Risk',
      color:       'orange',
      textColor:   'text-orange-400',
      bgColor:     'bg-orange-500/10',
      borderColor: 'border-orange-500/30',
      barColor:    'bg-orange-500',
    }
  }
  if (score >= 30) {
    return {
      level:       'medium',
      label:       'Medium Risk',
      color:       'yellow',
      textColor:   'text-yellow-400',
      bgColor:     'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
      barColor:    'bg-yellow-500',
    }
  }
  return {
    level:       'low',
    label:       'Low Risk',
    color:       'green',
    textColor:   'text-green-400',
    bgColor:     'bg-green-500/10',
    borderColor: 'border-green-500/30',
    barColor:    'bg-green-500',
  }
}

/**
 * Returns a human-readable recommendation based on risk level
 */
export function getRiskRecommendation(level) {
  const recommendations = {
    critical: 'Immediate action required. Complete all outstanding training modules and retake any failed quizzes. Your manager has been notified.',
    warning:  'Your risk score is elevated. Focus on completing remaining training modules and improving quiz scores to bring your score down.',
    medium:   'You are making progress. Continue completing modules and aim to pass all quizzes on first attempt.',
    low:      'Well done! Keep completing your training on schedule to maintain your low risk score.',
  }
  return recommendations[level] || recommendations.low
}

/**
 * Calculates what percentage of the threshold bar is filled
 * Used for the gauge visualization
 */
export function getGaugePercentage(score) {
  return Math.min(Math.max(score, 0), 100)
}

/**
 * Formats a risk score history array into chart data
 */
export function formatScoreHistory(scores) {
  if (!scores || scores.length === 0) return []
  return scores
    .slice(-10) // last 10 snapshots
    .map(s => ({
      date:      new Date(s.calculated_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' }),
      score:     Math.round(s.composite_score),
      phishing:  Math.round(s.phishing_score),
      quiz:      Math.round(s.quiz_score),
    }))
}