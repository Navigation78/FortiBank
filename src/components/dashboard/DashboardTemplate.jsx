'use client'
// src/components/dashboard/DashboardTemplate.jsx
// Shared template used by all 11 role dashboard pages.
// Now uses real data from useModules and useRiskScore hooks.


import { useEffect, useState } from 'react'
import PageWrapper from '@/components/layout/PageWrapper'
import StatsCard from '@/components/dashboard/StatsCard'
import RiskScoreGauge from '@/components/dashboard/RiskScoreGauge'
import AlertBanner from '@/components/dashboard/AlertBanner'
import ProgressChart from '@/components/dashboard/ProgressChart'
import RecentActivity from '@/components/dashboard/RecentActivity'
import { useAuthContext } from '@/contexts/AuthContext'
import { useModules } from '@/hooks/useModules'
import { BookOpen, CheckCircle2, Shield, BarChart3 } from 'lucide-react'

export default function DashboardTemplate({
  title,
  focusAreas,
}) {
  const { profile, user, supabase } = useAuthContext()
  const { modules, loading: modulesLoading, stats } = useModules()

  const [riskScore, setRiskScore]         = useState(null)
  const [alert, setAlert]                 = useState(null)
  const [phishingFail, setPhishingFail]   = useState(false)
  const [activities, setActivities]       = useState([])
  const [riskLoading, setRiskLoading]     = useState(true)
  const [lastActivityModule, setLastActivityModule] = useState(null)

  // Prefer an actively in-progress module; fall back to the last quiz-touched module.
  // When using the fallback, enrich it with real progress data if already loaded.
  const lastModule =
    modules.find(m => m.progress?.status === 'in_progress') ||
    (lastActivityModule
      ? (modules.find(m => m.id === lastActivityModule.id) || lastActivityModule)
      : null)

  const firstName = profile?.full_name?.split(' ')[0] || 'there'

  useEffect(() => {
    if (!user) return
    fetchRiskData()
    fetchRecentActivity()
  }, [user])

  async function fetchRiskData() {
    setRiskLoading(true)
    try {
      const res = await fetch('/api/risk-score')
      if (res.ok) {
        const { score } = await res.json()
        if (score) {
          const value = Math.round(score.composite_score)
          setRiskScore(value)
          if (score.phishing_clicks > 0) setPhishingFail(true)
          if (score.is_critical) {
            setAlert({ severity: 'critical', riskScore: value })
          } else if (score.is_warning) {
            setAlert({ severity: 'warning', riskScore: value })
          }
        }
      }
    } catch {
      // network error — leave riskScore as null
    }
    setRiskLoading(false)
  }

  async function fetchRecentActivity() {
    const { data: attempts } = await supabase
      .from('quiz_attempts')
      .select(`
        id,
        score_pct,
        passed,
        submitted_at,
        quizzes (
          title,
          modules ( id, title )
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

      // Use the most recent quiz's module as the fallback "continue" target
      const first = attempts.find(a => a.quizzes?.modules?.id)
      if (first) {
        setLastActivityModule({
          id:       first.quizzes.modules.id,
          title:    first.quizzes.modules.title,
          progress: null, // no progress_pct available from this path
        })
      }
    }
  }

  // Build real stats from module data
  const realStats = [
    {
      title:    'Modules Assigned',
      value:    modulesLoading ? '-' : stats.total,
      subtitle: modulesLoading ? 'Loading...' : `${stats.notStarted} not started`,
      icon:     BookOpen,
      color:    'blue',
    },
    {
      title:    'Modules Completed',
      value:    modulesLoading ? '-' : stats.completed,
      subtitle: modulesLoading ? 'Loading...' : `${stats.inProgress} in progress`,
      icon:     CheckCircle2,
      color:    'green',
    },
    {
      title:    'Risk Score',
      value:    riskLoading ? '-' : (riskScore ?? 'N/A'),
      subtitle: riskLoading ? '' : getRiskLabel(riskScore, profile?.risk_warning_threshold, profile?.risk_critical_threshold),
      icon:     Shield,
      color:    riskScore === null ? 'blue'
                  : riskScore >= (profile?.risk_critical_threshold ?? 70) ? 'red'
                  : riskScore >= (profile?.risk_warning_threshold  ?? 55) ? 'yellow'
                  : 'green',
    },
    {
      title:    'Overall Progress',
      value:    modulesLoading ? '-' : `${stats.overallPct}%`,
      subtitle: 'Training completion',
      icon:     BarChart3,
      color:    'purple',
    },
  ]

  return (
    <PageWrapper>

        {/* Phishing-fail banner — shown whenever the user has clicked at least one simulation */}
        {phishingFail && (
          <AlertBanner severity="phishing" />
        )}

        {/* Risk threshold alert banner */}
        {alert && (
          <AlertBanner
            severity={alert.severity}
            riskScore={alert.riskScore}
          />
        )}

        {/* Welcome */}
        <div className="mb-6">
          <h4 className="text-th-txt text-2xl font-bold">
            Good {getTimeOfDay()}, {firstName}
          </h4>
          <p className="text-th-txt2 text-sm mt-1">
            Here's your security training overview for today.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {realStats.map((stat, i) => (
            <StatsCard key={i} {...stat} />
          ))}
        </div>

        {/* Main grid — balanced 50/50 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 items-stretch">
          <div className="flex flex-col">
            <RiskScoreGauge score={riskScore} loading={riskLoading} />
          </div>
          <div className="flex flex-col">
            <ProgressChart modules={modules} loading={modulesLoading} />
          </div>
        </div>

        {/* Bottom grid — balanced 50/50 */}
        <div className={`grid grid-cols-1 gap-6 ${focusAreas ? 'lg:grid-cols-2' : ''}`}>
          <div>
            <RecentActivity
              activities={activities}
              lastModule={lastModule}
            />
          </div>

          {/* Threat focus areas */}
          {focusAreas && (
            <div>
              <div className="bg-th-srf border border-th-brd rounded-xl p-6 shadow-sm shadow-black/5 dark:shadow-black/30 transition-all duration-150 hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/40">
                <h3 className="text-th-txt font-semibold mb-4">Your Risk Focus Areas</h3>
                <div className="space-y-3">
                  {focusAreas.map((area, i) => {
                    const Icon = area.icon
                    return (
                      <div key={i} className="flex items-start gap-3">
                        {typeof area.icon === 'string' ? (
                          <span className="text-sm flex-shrink-0">{area.icon}</span>
                        ) : (
                          <Icon className="w-5 h-5 text-th-txt2 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="text-th-txt text-sm font-medium">{area.title}</p>
                          <p className="text-th-txt2 text-xs mt-0.5">{area.description}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

      </PageWrapper>
    )
}

function getTimeOfDay() {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  return 'evening'
}

function getRiskLabel(score, warningThreshold = 55, criticalThreshold = 70) {
  if (score === null || score === undefined) return 'No score yet'
  if (score >= criticalThreshold) return 'High risk. Take action.'
  if (score >= warningThreshold)  return 'Elevated risk. Review training.'
  if (score > 0)                  return 'Low risk. Well done.'
  return 'Score pending'
}
