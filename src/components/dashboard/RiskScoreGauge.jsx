'use client'

// src/components/dashboard/RiskScoreGauge.jsx
// Full 360° donut ring chart for risk score display

import Link from 'next/link'
import { useRole } from '@/hooks/useRole'

export default function RiskScoreGauge({ score = null, loading = false }) {
  const { warningThreshold, criticalThreshold } = useRole()

  function getRiskLevel(s) {
    if (s === null) return { label: 'No Score Yet', color: 'text-th-muted',                  stroke: 'var(--th-track)' }
    if (s >= criticalThreshold) return { label: 'Critical Risk', color: 'text-red-500 dark:text-red-400',    stroke: '#ef4444' }
    if (s >= warningThreshold)  return { label: 'High Risk',     color: 'text-orange-500 dark:text-orange-400', stroke: '#f97316' }
    if (s >= 40)                return { label: 'Medium Risk',   color: 'text-yellow-600 dark:text-yellow-400', stroke: '#eab308' }
    return                             { label: 'Low Risk',      color: 'text-green-600 dark:text-green-400',  stroke: '#22c55e' }
  }

  const risk        = getRiskLevel(score)

  const cx          = 96
  const cy          = 96
  const radius      = 70
  const strokeWidth = 13

  if (loading) {
    return (
      <div className="bg-th-srf border border-th-brd rounded-xl p-6 flex items-center justify-center min-h-[288px]">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="bg-th-srf border border-th-brd rounded-xl p-6 shadow-sm shadow-black/5 dark:shadow-black/30 transition-all duration-150 hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/40">

      <div className="flex items-center justify-between mb-5">
        <h3 className="text-th-txt font-semibold">Risk Score</h3>
        <Link href="/risk-score" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-xs transition-all duration-150">
          View details →
        </Link>
      </div>

      {/* Donut ring */}
      <div className="flex flex-col items-center">
        <div className="relative w-48 h-48">
          <svg width="192" height="192" viewBox="0 0 192 192">
            <circle
              cx={cx} cy={cy} r={radius}
              fill="none"
              stroke={risk.stroke}
              strokeWidth={strokeWidth}
              className="transition-all duration-500"
            />
          </svg>

          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-bold leading-none ${risk.color}`}>
              {score !== null ? score : '—'}
            </span>
            <span className="text-th-muted text-xs mt-1">out of 100</span>
          </div>
        </div>

        {/* Risk level label */}
        <p className={`font-semibold text-base mt-2 ${risk.color}`}>{risk.label}</p>

        {/* Threshold cards */}
        <div className="grid grid-cols-2 gap-3 mt-4 w-full">
          <div className="bg-th-hov rounded-lg px-3 py-2.5 text-center">
            <p className="text-th-txt2 text-xs mb-1">Warning at</p>
            <p className="text-yellow-600 dark:text-yellow-400 font-bold text-base">{warningThreshold}</p>
          </div>
          <div className="bg-th-hov rounded-lg px-3 py-2.5 text-center">
            <p className="text-th-txt2 text-xs mb-1">Critical at</p>
            <p className="text-red-500 dark:text-red-400 font-bold text-base">{criticalThreshold}</p>
          </div>
        </div>
      </div>

    </div>
  )
}
