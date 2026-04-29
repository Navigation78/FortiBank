// src/utils/formatScore.js

export function formatScore(score) {
  if (score === null || score === undefined) return '—'
  return `${Math.round(score)}/100`
}

export function formatPercent(value, total) {
  if (!total || total === 0) return '0%'
  return `${Math.round((value / total) * 100)}%`
}

export function getRiskColor(score, warningThreshold = 55, criticalThreshold = 70) {
  if (score >= criticalThreshold) return 'text-red-400'
  if (score >= warningThreshold)  return 'text-orange-400'
  if (score >= 30)                return 'text-yellow-400'
  return 'text-green-400'
}

export function getRiskBgColor(score, warningThreshold = 55, criticalThreshold = 70) {
  if (score >= criticalThreshold) return 'bg-red-500'
  if (score >= warningThreshold)  return 'bg-orange-500'
  if (score >= 30)                return 'bg-yellow-500'
  return 'bg-green-500'
}