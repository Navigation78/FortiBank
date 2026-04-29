'use client'

// src/app/admin/analytics/page.jsx
// Admin analytics dashboard with charts and risk overview

import { useState, useEffect } from 'react'
import Topbar from '@/components/layout/Topbar'
import PageWrapper from '@/components/layout/PageWrapper'
import CompletionRateChart from '@/components/analytics/CompletionRateChart'
import DepartmentRiskChart from '@/components/analytics/DepartmentRiskChart'
import PhishingTrendChart from '@/components/analytics/PhishingTrendChart'
import UserRiskTable from '@/components/analytics/UserRiskTable'
import { createClient } from '@/lib/supabase'

export default function AnalyticsPage() {
  const supabase      = createClient()
  const [loading, setLoading] = useState(true)
  const [data, setData]       = useState({
    completionData:  [],
    riskByCategory:  [],
    phishingTrend:   [],
    usersWithScores: [],
    summary:         null,
  })

  useEffect(() => { fetchAnalytics() }, [])

  async function fetchAnalytics() {
    setLoading(true)

    const [progressRes, scoresRes, campaignsRes, usersRes] = await Promise.all([
      // Module progress per role
      supabase.from('user_module_progress')
        .select('status, users!inner(user_roles!inner(roles(name, display_name, category)))'),

      // Latest risk scores per user
      supabase.from('risk_scores')
        .select('user_id, composite_score, phishing_score, quiz_score, phishing_clicks, phishing_attempts, quizzes_taken, quizzes_passed, is_warning, is_critical, calculated_at')
        .order('calculated_at', { ascending: false }),

      // Campaign stats view
      supabase.from('campaign_stats').select('*'),

      // Users with roles
      supabase.from('users_with_roles').select('id, full_name, email, role, role_display_name, role_category, is_active'),
    ])

    const progress  = progressRes.data  || []
    const scores    = scoresRes.data    || []
    const campaigns = campaignsRes.data || []
    const users     = usersRes.data     || []

    // Get latest score per user
    const latestScores = {}
    scores.forEach(s => {
      if (!latestScores[s.user_id] || s.calculated_at > latestScores[s.user_id].calculated_at) {
        latestScores[s.user_id] = s
      }
    })

    // Completion rate by role (simplified)
    const roleCompletion = {}
    progress.forEach(p => {
      const role = p.users?.user_roles?.[0]?.roles?.display_name || 'Unknown'
      if (!roleCompletion[role]) roleCompletion[role] = { total: 0, completed: 0 }
      roleCompletion[role].total++
      if (p.status === 'completed') roleCompletion[role].completed++
    })

    const completionData = Object.entries(roleCompletion).map(([role, d]) => ({
      role: role.split(' ')[0], // short name
      completionRate: d.total > 0 ? Math.round((d.completed / d.total) * 100) : 0,
    }))

    // Risk by category
    const categoryScores = {}
    users.forEach(u => {
      const cat   = u.role_category || 'Unknown'
      const score = latestScores[u.id]?.composite_score || 0
      if (!categoryScores[cat]) categoryScores[cat] = { total: 0, count: 0 }
      categoryScores[cat].total += score
      categoryScores[cat].count++
    })

    const riskByCategory = Object.entries(categoryScores).map(([category, d]) => ({
      category: category.split(' ')[0],
      avgScore: d.count > 0 ? Math.round((d.total / d.count) * 10) / 10 : 0,
    }))

    // Phishing trend per campaign
    const phishingTrend = campaigns.map(c => ({
      campaign:   c.campaign_name?.substring(0, 15) + '...',
      clickRate:  Number(c.click_rate_pct) || 0,
      reportRate: c.total_targets > 0
        ? Math.round((c.reported_count / c.total_targets) * 100)
        : 0,
    }))

    // Users with latest scores
    const usersWithScores = users.map(u => ({
      ...u,
      latest_score:      latestScores[u.id]?.composite_score || 0,
      phishing_clicks:   latestScores[u.id]?.phishing_clicks || 0,
      phishing_attempts: latestScores[u.id]?.phishing_attempts || 0,
      quizzes_taken:     latestScores[u.id]?.quizzes_taken || 0,
      quizzes_passed:    latestScores[u.id]?.quizzes_passed || 0,
      is_warning:        latestScores[u.id]?.is_warning || false,
      is_critical:       latestScores[u.id]?.is_critical || false,
    }))

    // Summary stats
    const activeUsers    = users.filter(u => u.is_active).length
    const scoredUsers    = Object.keys(latestScores).length
    const criticalUsers  = Object.values(latestScores).filter(s => s.is_critical).length
    const avgScore       = scoredUsers > 0
      ? Math.round(Object.values(latestScores).reduce((sum, s) => sum + s.composite_score, 0) / scoredUsers)
      : 0

    setData({
      completionData,
      riskByCategory,
      phishingTrend,
      usersWithScores,
      summary: { activeUsers, scoredUsers, criticalUsers, avgScore },
    })

    setLoading(false)
  }

  return (
    <>
      <Topbar title="Analytics" />
      <PageWrapper>

        <div className="mb-6">
          <h2 className="text-white text-xl font-bold">Platform Analytics</h2>
          <p className="text-slate-400 text-sm mt-1">Overview of training progress and cybersecurity risk across the branch.</p>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Employees',   value: loading ? '—' : data.summary?.activeUsers,   color: 'text-white' },
            { label: 'With Risk Scores',   value: loading ? '—' : data.summary?.scoredUsers,   color: 'text-blue-400' },
            { label: 'At Critical Risk',   value: loading ? '—' : data.summary?.criticalUsers,  color: 'text-red-400' },
            { label: 'Avg Risk Score',     value: loading ? '—' : data.summary?.avgScore,       color: 'text-yellow-400' },
          ].map((s, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-slate-500 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <CompletionRateChart data={data.completionData} loading={loading} />
          <DepartmentRiskChart data={data.riskByCategory} loading={loading} />
        </div>

        <div className="mb-6">
          <PhishingTrendChart data={data.phishingTrend} loading={loading} />
        </div>

        {/* User risk table */}
        <UserRiskTable users={data.usersWithScores} loading={loading} />

      </PageWrapper>
    </>
  )
}