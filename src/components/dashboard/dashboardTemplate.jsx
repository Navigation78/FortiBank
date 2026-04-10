'use client'
// src/components/dashboard/DashboardTemplate.jsx
// Shared template used by all 11 role dashboard pages.
// Now uses real data from useModules and useRiskScore hooks.


import { useEffect, useState } from 'react'
import Topbar from '@/components/layout/Topbar'
import PageWrapper from '@/components/layout/PageWrapper'
import StatsCard from '@/components/dashboard/StatsCard'
import RiskScoreGauge from '@/components/dashboard/RiskScoreGauge'
import AlertBanner from '@/components/dashboard/AlertBanner'
import ProgressChart from '@/components/dashboard/ProgressChart'
import RecentActivity from '@/components/dashboard/RecentActivity'
import { useAuth } from '@/hooks/useAuth'
import { useModules } from '@/hooks/useModules'
import { createClient } from '@/lib/supabase'

export default function DashboardTemplate({
  title,
  focusAreas,
}) {
  const supabase                    = createClient()
  const { profile, user }           = useAuth()
  const { modules, loading: modulesLoading, stats } = useModules()

  const [riskScore, setRiskScore]   = useState(0)
  const [alert, setAlert]           = useState(null)
  const [activities, setActivities] = useState([])
  const [riskLoading, setRiskLoading] = useState(true)

  const firstName = profile?.full_name?.split(' ')[0] || 'there'

  // Fetch latest risk score and alerts
  useEffect(() => {
    if (!user) return
    fetchRiskData()
    fetchRecentActivity()
  }, [user])

  async function fetchRiskData() {
    setRiskLoading(true)

    // Latest risk score
    const { data: scoreData } = await supabase
      .from('risk_scores')
      .select('composite_score, is_warning, is_critical, calculated_at')
      .eq('user_id', user.id)
      .order('calculated_at', { ascending: false })
      .limit(1)
      .single()

    if (scoreData) {
      setRiskScore(Math.round(scoreData.composite_score))

      // Check for active alert
      if (scoreData.is_critical) {
        setAlert({ severity: 'critical', riskScore: Math.round(scoreData.composite_score) })
      } else if (scoreData.is_warning) {
        setAlert({ severity: 'warning', riskScore: Math.round(scoreData.composite_score) })
      }
    }

    setRiskLoading(false)
  }

  async function fetchRecentActivity() {
    // Fetch recent quiz attempts
    const { data: attempts } = await supabase
      .from('quiz_attempts')
      .select(`
        id,
        score_pct,
        passed,
        submitted_at,
        quizzes (
          title,
          modules ( title )
        )
      `)
      .eq('user_id', user.id)
      .order('submitted_at', { ascending: false })
      .limit(5)

    if (attempts) {
      const mapped = attempts.map(a => ({
        type:  a.passed ? 'quiz_passed' : 'quiz_failed',
        title: `Quiz: ${a.quizzes?.title || 'Unknown'}`,
        score: a.score_pct,
        date:  a.submitted_at,
      }))
      setActivities(mapped)
    }
  }

  // Build real stats from module data
  const realStats = [
    {
      title:    'Modules Assigned',
      value:    modulesLoading ? '—' : stats.total,
      subtitle: modulesLoading ? 'Loading...' : `${stats.notStarted} not started`,
      icon:     '📚',
      color:    'blue',
    },
    {
      title:    'Modules Completed',
      value:    modulesLoading ? '—' : stats.completed,
      subtitle: modulesLoading ? 'Loading...' : `${stats.inProgress} in progress`,
      icon:     '✅',
      color:    'green',
    },
    {
      title:    'Risk Score',
      value:    riskLoading ? '—' : riskScore,
      subtitle: riskLoading ? 'Loading...' : getRiskLabel(riskScore),
      icon:     '🛡️',
      color:    riskScore >= 63 ? 'red' : riskScore >= 45 ? 'yellow' : 'green',
    },
    {
      title:    'Overall Progress',
      value:    modulesLoading ? '—' : `${stats.overallPct}%`,
      subtitle: 'Training completion',
      icon:     '📊',
      color:    'purple',
    },
  ]

  return (
    <>
      <Topbar title={title} />
      <PageWrapper>

        {/* Alert banner */}
        {alert && (
          <AlertBanner
            severity={alert.severity}
            riskScore={alert.riskScore}
          />
        )}

        {/* Welcome */}
        <div className="mb-6">
          <h2 className="text-white text-2xl font-bold">
            Good {getTimeOfDay()}, {firstName} 👋
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Here's your security training overview for today.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {realStats.map((stat, i) => (
            <StatsCard key={i} {...stat} />
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-1">
            <RiskScoreGauge score={riskScore} loading={riskLoading} />
          </div>
          <div className="lg:col-span-2">
            <ProgressChart modules={modules} loading={modulesLoading} />
          </div>
        </div>

        {/* Bottom grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentActivity activities={activities} />
          </div>

          {/* Threat focus areas */}
          {focusAreas && (
            <div className="lg:col-span-1">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Your Risk Focus Areas</h3>
                <div className="space-y-3">
                  {focusAreas.map((area, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${area.iconBg}`}>
                        <span className="text-sm">{area.icon}</span>
                      </div>
                      <div>
                        <p className="text-slate-300 text-sm font-medium">{area.title}</p>
                        <p className="text-slate-500 text-xs mt-0.5">{area.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

      </PageWrapper>
    </>
  )
}

function getTimeOfDay() {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  return 'evening'
}

function getRiskLabel(score) {
  if (score >= 63) return 'High risk — take action'
  if (score >= 45) return 'Medium risk'
  if (score > 0)   return 'Low risk — well done'
  return 'No data yet'
}