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
          <h4 className="text-white text-2xl font-bold">
            Welcome, {adminDisplayName}
          </h4>
          <p className="text-slate-400 text-sm mt-1">Here's what's happening across the platform.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard title="Active Employees" value={loading ? '-' : stats?.totalUsers}        icon={Users}      color="blue"   />
          <StatsCard title="Published Modules" value={loading ? '-' : stats?.publishedModules} icon={BookOpen}  color="green"  />
          <StatsCard title="Active Phishing Campaigns"  value={loading ? '-' : stats?.activeCampaigns}  icon={Fish}      color="yellow" />
          <StatsCard title="Critical Risk Users" value={loading ? '-' : stats?.criticalUsers}  icon={AlertOctagon} color="red"  />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Quick actions */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 border border-white/[0.08] rounded-xl p-5 shadow-sm shadow-black/30 transition-all duration-150 hover:border-white/[0.14] hover:shadow-md hover:shadow-black/40">
              <h3 className="text-slate-100 font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {quickActions.map(action => {
                  const Icon = action.icon
                  return (
                    <Link
                      key={action.href}
                      href={action.href}
                      className="flex items-center gap-3 px-4 py-3 bg-white/[0.04] hover:bg-white/[0.08] rounded-lg transition-all duration-150"
                    >
                      <Icon className="w-5 h-5 text-slate-300" />
                      <span className="text-slate-200 text-sm font-medium">{action.label}</span>
                      <ChevronRight className="w-4 h-4 text-slate-500 ml-auto" />
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Platform summary */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800 border border-white/[0.08] rounded-xl p-5 shadow-sm shadow-black/30 transition-all duration-150 hover:border-white/[0.14] hover:shadow-md hover:shadow-black/40">
              <h3 className="text-slate-100 font-semibold mb-4">Platform Summary</h3>
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
                    { label: 'Total phishing campaigns',        value: stats?.totalCampaigns,  sub: `${stats?.activeCampaigns} active` },
                    { label: 'Average risk score',     value: stats?.avgRiskScore,    sub: 'across all employees' },
                    { label: 'Employees at critical',  value: stats?.criticalUsers,   sub: 'require immediate attention', alert: stats?.criticalUsers > 0, href: '/admin/notifications' },
                  ].map((item, i) => {
                    const rowClass = `flex items-center justify-between px-4 py-3 rounded-lg ${item.alert ? 'bg-red-500/10 border border-red-500/20' : 'bg-white/[0.04]'}`
                    const inner = (
                      <>
                        <div>
                          <p className="text-slate-200 text-sm font-medium">{item.label}</p>
                          <p className="text-slate-400 text-xs">{item.sub}</p>
                        </div>
                        <span className={`font-bold text-xl ${item.alert ? 'text-red-400' : 'text-slate-100'}`}>
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
