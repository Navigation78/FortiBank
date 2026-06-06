'use client'

// src/app/admin/page.jsx
// Admin home - overview stats, quick actions

import { useState, useEffect } from 'react'
import { AlertOctagon, BarChart3, BookOpen, ChevronRight, Fish, Users, UserPlus } from 'lucide-react'
import Link from 'next/link'
import PageWrapper from '@/components/layout/PageWrapper'
import StatsCard from '@/components/dashboard/StatsCard'
import { useAuthContext } from '@/contexts/AuthContext'

export default function AdminHomePage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const { authenticatedFetch, profile } = useAuthContext()
  const adminDisplayName = profile?.full_name === 'New User'
    ? 'System Admin'
    : profile?.full_name || profile?.email || 'System Admin'

  useEffect(() => { fetchStats() }, [authenticatedFetch])

  async function fetchStats() {
    setLoading(true)
    setError('')

    try {
      const res = await authenticatedFetch('/api/admin/overview')
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to load admin overview')
        setStats(null)
        setLoading(false)
        return
      }

      setStats(data.stats || null)
    } catch (err) {
      setError('Network error: ' + err.message)
      setStats(null)
    }
    setLoading(false)
  }

  const quickActions = [
    { label: 'Add Employee',      href: '/admin/users/create',    icon: UserPlus, color: 'blue'   },
    { label: 'Create Module',     href: '/admin/modules/create',  icon: BookOpen, color: 'green'  },
    { label: 'Launch Phishing',   href: '/admin/phishing/create', icon: Fish,     color: 'orange' },
    { label: 'View Analytics',    href: '/admin/analytics',       icon: BarChart3, color: 'purple' },
  ]

  return (
    <>
      <PageWrapper>

        <div className="mb-6">
          <h4 className="text-th-txt text-2xl font-bold">
            Welcome, {adminDisplayName}
          </h4>
          <p className="text-th-txt2 text-sm mt-1">Here's what's happening across the platform.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard title="Active Employees" value={loading ? '-' : stats?.totalUsers}        icon={Users}      color="blue"   />
          <StatsCard title="Published Modules" value={loading ? '-' : stats?.publishedModules} icon={BookOpen}  color="green"  />
          <StatsCard title="Active Phishing Campaigns"  value={loading ? '-' : stats?.activeCampaigns}  icon={Fish}      color="yellow" />
          <StatsCard title="Critical Risk Users" value={loading ? '-' : stats?.criticalUsers}  icon={AlertOctagon} color="red"  />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

          {/* Quick actions */}
          <div className="lg:col-span-1 flex flex-col">
            <div className="bg-th-srf border border-th-brd rounded-xl p-5 shadow-sm shadow-black/5 dark:shadow-black/30 h-full flex flex-col transition-all duration-150 hover:shadow-md hover:shadow-black/10 dark:hover:shadow-black/40">
              <h3 className="text-th-txt font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2 overflow-y-auto">
                {quickActions.map(action => {
                  const Icon = action.icon
                  return (
                    <Link
                      key={action.href}
                      href={action.href}
                      className="flex items-center gap-3 px-4 py-3 bg-th-hov hover:bg-th-act rounded-lg transition-all duration-150"
                    >
                      <Icon className="w-5 h-5 text-th-txt2" />
                      <span className="text-th-txt text-sm font-medium">{action.label}</span>
                      <ChevronRight className="w-4 h-4 text-th-muted ml-auto" />
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Platform summary */}
          <div className="lg:col-span-2 flex flex-col">
            <div className="bg-th-srf border border-th-brd rounded-xl p-5 shadow-sm shadow-black/5 dark:shadow-black/30 h-full flex flex-col transition-all duration-150 hover:shadow-md hover:shadow-black/10 dark:hover:shadow-black/40">
              <h3 className="text-th-txt font-semibold mb-4">Platform Summary</h3>
              {loading ? (
                <div className="space-y-3 animate-pulse">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-10 bg-th-track rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3 overflow-y-auto">
                  {[
                    { label: 'Total modules',            value: stats?.totalModules,   sub: `${stats?.publishedModules} published` },
                    { label: 'Total phishing campaigns', value: stats?.totalCampaigns, sub: `${stats?.activeCampaigns} active` },
                    { label: 'Average risk score',       value: stats?.avgRiskScore,   sub: 'across all employees' },
                    { label: 'Employees at critical',    value: stats?.criticalUsers,  sub: 'require immediate attention', alert: stats?.criticalUsers > 0, href: '/admin/notifications' },
                  ].map((item, i) => {
                    const rowClass = `flex items-center justify-between px-4 py-3 rounded-lg ${item.alert ? 'bg-red-500/10 border border-red-500/20' : 'bg-th-hov'}`
                    const inner = (
                      <>
                        <div>
                          <p className="text-th-txt text-sm font-medium">{item.label}</p>
                          <p className="text-th-muted text-xs">{item.sub}</p>
                        </div>
                        <span className={`font-bold text-xl ${item.alert ? 'text-red-600 dark:text-red-400' : 'text-th-txt'}`}>
                          {item.value ?? '-'}
                        </span>
                      </>
                    )
                    return item.href ? (
                      <Link key={i} href={item.href} className={`${rowClass} hover:bg-red-500/15 transition-colors`}>
                        {inner}
                      </Link>
                    ) : (
                      <div key={i} className={rowClass}>
                        {inner}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

        </div>

      </PageWrapper>
    </>
  )
}
