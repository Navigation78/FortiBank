'use client'
// src/app/admin/analytics/page.jsx
// Admin analytics dashboard with charts and risk overview

import { useState, useEffect } from 'react'
import PageWrapper from '@/components/layout/PageWrapper'
import CompletionRateChart from '@/components/analytics/CompletionRateChart'
import DepartmentRiskChart from '@/components/analytics/DepartmentRiskChart'
import PhishingTrendChart from '@/components/analytics/PhishingTrendChart'
import UserRiskTable from '@/components/analytics/UserRiskTable'
import ModulePerformanceTable from '@/components/analytics/ModulePerformanceTable'
import { createClient } from '@/lib/supabase'
import { formatTimestamp } from '@/lib/csvDownload'

export default function AnalyticsPage() {
  const supabase          = createClient()
  const [loading, setLoading]     = useState(true)
  const [fetchedAt, setFetchedAt] = useState(null)
  const [data, setData]           = useState({
    completionData:    [],
    riskByCategory:    [],
    phishingTrend:     [],
    usersWithScores:   [],
    modulePerformance: [],
    summary:           null,
  })

  useEffect(() => { fetchAnalytics() }, [])

  async function fetchAnalytics() {
    setLoading(true)

    const [progressRes, scoresRes, campaignsJson, usersRes, userRolesRes, modulesRes, mraRes] = await Promise.all([
      supabase.from('user_module_progress').select('user_id, module_id, status'),
      supabase.from('risk_scores')
        .select('user_id, composite_score, phishing_clicks, phishing_attempts, quizzes_passed, quizzes_assigned, is_warning, is_critical, calculated_at')
        .order('calculated_at', { ascending: false }),
      fetch('/api/admin/campaigns').then(r => r.json()),
      supabase.from('users_with_roles').select('id, full_name, email, role, role_display_name, role_category, is_active'),
      supabase.from('user_roles').select('user_id, role_id'),
      supabase.from('modules').select('id, title').eq('status', 'published').order('order_index', { ascending: true }),
      supabase.from('module_role_access').select('module_id, role_id'),
    ])

    const progress  = progressRes.data        || []
    const scores    = scoresRes.data          || []
    const campaigns = campaignsJson.campaigns || []
    const users     = usersRes.data           || []
    const userRoles = userRolesRes.data       || []
    const modules   = modulesRes.data         || []
    const mra       = mraRes.data             || []

    // ── Latest score per user ─────────────────────────────────────────────────
    const latestScores = {}
    scores.forEach(s => {
      if (!latestScores[s.user_id] || s.calculated_at > latestScores[s.user_id].calculated_at) {
        latestScores[s.user_id] = s
      }
    })

    // ── Lookup maps ───────────────────────────────────────────────────────────
    const userRoleIdMap = {}
    userRoles.forEach(ur => { userRoleIdMap[ur.user_id] = ur.role_id })

    const roleModuleMap = {}
    mra.forEach(m => {
      if (!roleModuleMap[m.role_id]) roleModuleMap[m.role_id] = []
      roleModuleMap[m.role_id].push(m.module_id)
    })

    const userProgressMap = {}
    progress.forEach(p => {
      if (!userProgressMap[p.user_id]) userProgressMap[p.user_id] = {}
      userProgressMap[p.user_id][p.module_id] = p.status
    })

    // ── Completion rate by role ────────────────────────────────────────────────
    // Denominator: every (user × module) combination the user is assigned to.
    // Numerator: those where status = 'completed'.
    const roleCompletionMap = {}
    users.filter(u => u.is_active).forEach(u => {
      const roleId    = userRoleIdMap[u.id]
      const moduleIds = roleModuleMap[roleId] || []
      if (!roleId || moduleIds.length === 0) return
      const label = u.role_display_name || 'Unknown'
      if (!roleCompletionMap[label]) roleCompletionMap[label] = { total: 0, completed: 0 }
      moduleIds.forEach(mid => {
        roleCompletionMap[label].total++
        if (userProgressMap[u.id]?.[mid] === 'completed') roleCompletionMap[label].completed++
      })
    })

    const completionData = Object.entries(roleCompletionMap).map(([role, d]) => ({
      role:           role.split(' ')[0],
      completionRate: d.total > 0 ? Math.round((d.completed / d.total) * 100) : 0,
    }))

    // ── Average risk score by category ────────────────────────────────────────
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

    // ── Phishing trend (server-side data, same source as admin phishing page) ──
    const phishingTrend = campaigns
      .filter(c => c.sent_count > 0)
      .map(c => ({
        campaign:   c.name?.length > 15 ? c.name.substring(0, 15) + '…' : (c.name || 'Campaign'),
        clickRate:  Math.round((c.clicked_count / c.sent_count) * 100),
        reportRate: Math.round((c.reported_count / c.sent_count) * 100),
      }))

    // ── Users with latest risk scores ─────────────────────────────────────────
    const usersWithScores = users.map(u => ({
      ...u,
      latest_score:      latestScores[u.id]?.composite_score   || 0,
      phishing_clicks:   latestScores[u.id]?.phishing_clicks   || 0,
      phishing_attempts: latestScores[u.id]?.phishing_attempts || 0,
      quizzes_passed:    latestScores[u.id]?.quizzes_passed    || 0,
      quizzes_assigned:  latestScores[u.id]?.quizzes_assigned  || 0,
      is_warning:        latestScores[u.id]?.is_warning        || false,
      is_critical:       latestScores[u.id]?.is_critical       || false,
    }))

    // ── Module performance ────────────────────────────────────────────────────
    const modulePerformance = modules.map(mod => {
      const roleIds      = mra.filter(m => m.module_id === mod.id).map(m => m.role_id)
      const assignedUids = new Set(userRoles.filter(ur => roleIds.includes(ur.role_id)).map(ur => ur.user_id))
      const modProgress  = progress.filter(p => p.module_id === mod.id && assignedUids.has(p.user_id))
      const completed    = modProgress.filter(p => p.status === 'completed').length
      const started      = modProgress.length
      return {
        id:             mod.id,
        title:          mod.title,
        assigned:       assignedUids.size,
        started,
        completed,
        completionRate: assignedUids.size > 0 ? Math.round((completed / assignedUids.size) * 100) : 0,
      }
    }).filter(m => m.assigned > 0)

    // ── Summary cards ─────────────────────────────────────────────────────────
    const activeUsers   = users.filter(u => u.is_active).length
    const scoredUsers   = Object.keys(latestScores).length
    const criticalUsers = Object.values(latestScores).filter(s => s.is_critical).length
    const avgScore      = scoredUsers > 0
      ? Math.round(Object.values(latestScores).reduce((sum, s) => sum + s.composite_score, 0) / scoredUsers)
      : 0

    setData({
      completionData,
      riskByCategory,
      phishingTrend,
      usersWithScores,
      modulePerformance,
      summary: { activeUsers, scoredUsers, criticalUsers, avgScore },
    })
    setFetchedAt(new Date())
    setLoading(false)
  }

  return (
    <>
      <PageWrapper>

        <div className="flex flex-wrap items-start justify-between gap-2 mb-6">
          <div>
            <h4 className="text-th-txt text-xl font-bold">Platform Analytics</h4>
            <p className="text-th-txt2 text-sm mt-1">Overview of training progress and cybersecurity risk across the branch.</p>
          </div>
          {fetchedAt && (
            <span className="text-th-muted text-xs mt-1">
              Data as of {formatTimestamp(fetchedAt)}
            </span>
          )}
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Employees',  value: loading ? '-' : data.summary?.activeUsers,  color: 'text-th-txt' },
            { label: 'With Risk Scores',  value: loading ? '-' : data.summary?.scoredUsers,  color: 'text-blue-600 dark:text-blue-400' },
            { label: 'At Critical Risk',  value: loading ? '-' : data.summary?.criticalUsers, color: 'text-red-600 dark:text-red-400' },
            { label: 'Avg Risk Score',    value: loading ? '-' : data.summary?.avgScore,      color: 'text-yellow-600 dark:text-yellow-400' },
          ].map((s, i) => (
            <div key={i} className="bg-th-srf border border-th-brd rounded-xl p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-th-muted text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <CompletionRateChart data={data.completionData} loading={loading} fetchedAt={fetchedAt} />
          <DepartmentRiskChart data={data.riskByCategory} loading={loading} fetchedAt={fetchedAt} />
        </div>

        <div className="mb-6">
          <PhishingTrendChart data={data.phishingTrend} loading={loading} fetchedAt={fetchedAt} />
        </div>

        {/* Module performance */}
        <div className="mb-6">
          <ModulePerformanceTable modules={data.modulePerformance} loading={loading} fetchedAt={fetchedAt} />
        </div>

        {/* Employee risk table */}
        <UserRiskTable users={data.usersWithScores} loading={loading} fetchedAt={fetchedAt} />

      </PageWrapper>
    </>
  )
}
