'use client'

// src/app/(dashboard)/risk-score/page.jsx
// Full risk score breakdown with history and recommendations

import Topbar from '@/components/layout/Topbar'
import PageWrapper from '@/components/layout/PageWrapper'
import RiskScoreGauge from '@/components/dashboard/RiskScoreGauge'
import { useRiskScore } from '@/hooks/useRiskScore'
import { useRole } from '@/hooks/useRole'
import { getRiskRecommendation } from '@/lib/riskCalculator'
import { ROLE_THRESHOLDS, ROLE_LABELS } from '@/constants/roles'

export default function RiskScorePage() {
  const { latest, history, loading, recalculating, recalculate, score, phishingScore, quizScore, riskLevel } = useRiskScore()
  const { role } = useRole()

  const thresholds    = ROLE_THRESHOLDS[role] || { warning: 55, critical: 70 }
  const recommendation = getRiskRecommendation(riskLevel?.level || 'low')

  return (
    <>
      <Topbar title="My Risk Score" />
      <PageWrapper>

        <div className="max-w-4xl mx-auto space-y-6">

          {/* Main gauge + breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RiskScoreGauge score={score} loading={loading} />

            {/* Score breakdown */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Score Breakdown</h3>
              {loading ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 bg-slate-800 rounded" />
                  <div className="h-4 bg-slate-800 rounded w-3/4" />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Phishing component */}
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-slate-400 text-sm">Phishing Tests (60%)</span>
                      <span className="text-white font-semibold text-sm">{phishingScore}/100</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 rounded-full transition-all"
                        style={{ width: `${phishingScore}%` }}
                      />
                    </div>
                    <p className="text-slate-600 text-xs mt-1">
                      Based on % of phishing emails you clicked
                    </p>
                  </div>

                  {/* Quiz component */}
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-slate-400 text-sm">Quiz Performance (40%)</span>
                      <span className="text-white font-semibold text-sm">{quizScore}/100</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${quizScore}%` }}
                      />
                    </div>
                    <p className="text-slate-600 text-xs mt-1">
                      Based on % of quizzes you failed
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-slate-800 pt-4">
                    <div className="flex justify-between">
                      <span className="text-slate-300 font-medium text-sm">Composite Score</span>
                      <span className={`font-bold text-sm ${riskLevel?.textColor}`}>{score}/100</span>
                    </div>
                    <p className="text-slate-600 text-xs mt-1">
                      = (Phishing × 0.6) + (Quiz × 0.4)
                    </p>
                  </div>

                  {/* Context stats */}
                  {latest && (
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="bg-slate-800 rounded-lg p-3 text-center">
                        <p className="text-white font-bold">{latest.phishing_clicks}/{latest.phishing_attempts}</p>
                        <p className="text-slate-500 text-xs">Phishing clicks</p>
                      </div>
                      <div className="bg-slate-800 rounded-lg p-3 text-center">
                        <p className="text-white font-bold">{latest.quizzes_passed}/{latest.quizzes_taken}</p>
                        <p className="text-slate-500 text-xs">Quizzes passed</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Thresholds */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">
              Your Thresholds — {ROLE_LABELS[role]}
            </h3>
            <div className="relative h-8 bg-slate-800 rounded-full overflow-hidden">
              {/* Green zone */}
              <div
                className="absolute left-0 top-0 h-full bg-green-500/30 rounded-l-full"
                style={{ width: `${thresholds.warning}%` }}
              />
              {/* Orange zone */}
              <div
                className="absolute top-0 h-full bg-orange-500/30"
                style={{ left: `${thresholds.warning}%`, width: `${thresholds.critical - thresholds.warning}%` }}
              />
              {/* Red zone */}
              <div
                className="absolute top-0 right-0 h-full bg-red-500/30 rounded-r-full"
                style={{ left: `${thresholds.critical}%` }}
              />
              {/* Current score marker */}
              <div
                className={`absolute top-1 h-6 w-1.5 rounded-full ${riskLevel?.barColor || 'bg-white'} transition-all`}
                style={{ left: `calc(${Math.min(score, 98)}% - 3px)` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>0 — Low Risk</span>
              <span className="text-yellow-400">Warning: {thresholds.warning}</span>
              <span className="text-red-400">Critical: {thresholds.critical}</span>
              <span>100</span>
            </div>
          </div>

          {/* Recommendation */}
          <div className={`rounded-xl border p-5 ${riskLevel?.bgColor} ${riskLevel?.borderColor}`}>
            <h3 className={`font-semibold mb-2 ${riskLevel?.textColor}`}>Recommendation</h3>
            <p className="text-slate-300 text-sm leading-relaxed">{recommendation}</p>
          </div>

          {/* Score history */}
          {history.length > 1 && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Score History</h3>
              <div className="space-y-2">
                {history.map((h, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-slate-500 text-xs w-20 flex-shrink-0">{h.date}</span>
                    <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${h.score}%` }}
                      />
                    </div>
                    <span className="text-slate-300 text-xs w-8 text-right">{h.score}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recalculate button */}
          <div className="text-center">
            <button
              onClick={recalculate}
              disabled={recalculating}
              className="text-slate-500 hover:text-slate-300 text-sm transition-colors disabled:cursor-not-allowed"
            >
              {recalculating ? 'Recalculating...' : 'Refresh risk score'}
            </button>
            {latest?.calculated_at && (
              <p className="text-slate-700 text-xs mt-1">
                Last calculated: {new Date(latest.calculated_at).toLocaleString('en-KE')}
              </p>
            )}
          </div>

        </div>
      </PageWrapper>
    </>
  )
}