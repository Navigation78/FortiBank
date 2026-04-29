'use client'

// src/app/admin/page.jsx
// Admin home — overview stats, quick actions


import { useState, useEffect } from 'react'
import Link from 'next/link'
import Topbar from '@/components/layout/Topbar'
import PageWrapper from '@/components/layout/PageWrapper'
import StatsCard from '@/components/dashboard/StatsCard'

export default function AdminHomePage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => { fetchStats() }, [])

  async function fetchStats() {
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/overview')
    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Failed to load admin overview')
      setStats(null)
      setLoading(false)
      return
    }

    setStats(data.stats || null)
    setLoading(false)
  }

  const quickActions = [
    { label: 'Add Employee',      href: '/admin/users/create',    icon: '👤', color: 'blue'   },
    { label: 'Create Module',     href: '/admin/modules/create',  icon: '📚', color: 'green'  },
    { label: 'Launch Phishing',   href: '/admin/phishing/create', icon: '🎣', color: 'orange' },
    { label: 'View Analytics',    href: '/admin/analytics',       icon: '📊', color: 'purple' },
  ]

  return (
    <>
      <Topbar title="Admin Overview" />
      <PageWrapper>

        <div className="mb-6">
          <h2 className="text-white text-2xl font-bold">Welcome back, Admin</h2>
          <p className="text-slate-400 text-sm mt-1">Here's what's happening across the platform.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard title="Active Employees" value={loading ? '—' : stats?.totalUsers}        icon="👥" color="blue"   />
          <StatsCard title="Published Modules" value={loading ? '—' : stats?.publishedModules} icon="📚" color="green"  />
          <StatsCard title="Active Campaigns"  value={loading ? '—' : stats?.activeCampaigns}  icon="🎣" color="yellow" />
          <StatsCard title="Critical Risk Users" value={loading ? '—' : stats?.criticalUsers}  icon="🚨" color="red"    />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Quick actions */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {quickActions.map(action => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="flex items-center gap-3 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <span className="text-lg">{action.icon}</span>
                    <span className="text-slate-300 text-sm font-medium">{action.label}</span>
                    <svg className="w-4 h-4 text-slate-600 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Platform summary */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h3 className="text-white font-semibold mb-4">Platform Summary</h3>
              {loading ? (
                <div className="space-y-3 animate-pulse">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-10 bg-slate-800 rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {[
                    { label: 'Total modules',         value: stats?.totalModules,    sub: `${stats?.publishedModules} published` },
                    { label: 'Total campaigns',        value: stats?.totalCampaigns,  sub: `${stats?.activeCampaigns} active` },
                    { label: 'Average risk score',     value: stats?.avgRiskScore,    sub: 'across all employees' },
                    { label: 'Employees at critical',  value: stats?.criticalUsers,   sub: 'require immediate attention', alert: stats?.criticalUsers > 0 },
                  ].map((item, i) => (
                    <div key={i} className={`flex items-center justify-between px-4 py-3 rounded-lg ${item.alert ? 'bg-red-500/10 border border-red-500/20' : 'bg-slate-800'}`}>
                      <div>
                        <p className="text-slate-300 text-sm font-medium">{item.label}</p>
                        <p className="text-slate-500 text-xs">{item.sub}</p>
                      </div>
                      <span className={`font-bold text-xl ${item.alert ? 'text-red-400' : 'text-white'}`}>
                        {item.value ?? '—'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </PageWrapper>
    </>
  )
}
