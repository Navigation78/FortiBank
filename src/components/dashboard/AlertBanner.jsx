'use client'

// src/components/dashboard/RiskScoreGauge.jsx
// Visual risk score display with color-coded gauge


import Link from 'next/link'
import { useRole } from '@/hooks/useRole'

export default function RiskScoreGauge({ score = 0, loading = false }) {
  const { warningThreshold, criticalThreshold } = useRole()

  // Determine risk level and colors
  function getRiskLevel(score) {
    if (score >= criticalThreshold) return {
      label: 'Critical Risk',
      color: 'text-red-400',
      bg: 'bg-red-500',
      ring: 'ring-red-500/30',
      glow: 'shadow-red-500/20',
    }
    if (score >= warningThreshold) return {
      label: 'High Risk',
      color: 'text-orange-400',
      bg: 'bg-orange-500',
      ring: 'ring-orange-500/30',
      glow: 'shadow-orange-500/20',
    }
    if (score >= 40) return {
      label: 'Medium Risk',
      color: 'text-yellow-400',
      bg: 'bg-yellow-500',
      ring: 'ring-yellow-500/30',
      glow: 'shadow-yellow-500/20',
    }
    return {
      label: 'Low Risk',
      color: 'text-green-400',
      bg: 'bg-green-500',
      ring: 'ring-green-500/30',
      glow: 'shadow-green-500/20',
    }
  }

  const risk = getRiskLevel(score)

  // SVG gauge calculation
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const arc = circumference * 0.75 // 270 degree arc
  const offset = arc - (score / 100) * arc

  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center justify-center h-48">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Risk Score</h3>
        <Link
          href="/risk-score"
          className="text-blue-400 hover:text-blue-300 text-xs transition-colors"
        >
          View details →
        </Link>
      </div>

      <div className="flex items-center gap-6">
        {/* SVG Gauge */}
        <div className="relative flex-shrink-0">
          <svg width="140" height="100" viewBox="0 0 140 100">
            {/* Background arc */}
            <circle
              cx="70" cy="80" r={radius}
              fill="none"
              stroke="#1e293b"
              strokeWidth="10"
              strokeDasharray={`${arc} ${circumference}`}
              strokeLinecap="round"
              transform="rotate(135 70 80)"
            />
            {/* Score arc */}
            <circle
              cx="70" cy="80" r={radius}
              fill="none"
              stroke={
                score >= criticalThreshold ? '#ef4444' :
                score >= warningThreshold ? '#f97316' :
                score >= 40 ? '#eab308' : '#22c55e'
              }
              strokeWidth="10"
              strokeDasharray={`${arc - offset} ${circumference}`}
              strokeLinecap="round"
              transform="rotate(135 70 80)"
              className="transition-all duration-700"
            />
          </svg>
          {/* Score number overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pb-2">
            <span className={`text-3xl font-bold ${risk.color}`}>{score}</span>
            <span className="text-slate-500 text-xs">/100</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <p className={`font-semibold text-lg ${risk.color}`}>{risk.label}</p>
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Warning threshold</span>
              <span className="text-yellow-400 font-medium">{warningThreshold}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Critical threshold</span>
              <span className="text-red-400 font-medium">{criticalThreshold}</span>
            </div>
          </div>
          {score >= warningThreshold && (
            <p className="text-xs text-slate-400 mt-3">
              Complete more modules and pass quizzes to lower your score.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}