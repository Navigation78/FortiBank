'use client'

// src/app/admin/reports/page.jsx
// Employee dashboard switcher for system administrators.

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, BriefcaseBusiness, Building2, Headphones, Landmark, ShieldCheck, UserRoundCog } from 'lucide-react'
import Topbar from '@/components/layout/Topbar'
import PageWrapper from '@/components/layout/PageWrapper'
import { createClient } from '@/lib/supabase'
import {
  DEPARTMENTAL_HEAD_ROLES,
  EMPLOYEE_ROLES,
  FRONTLINE_ROLES,
  LEADERSHIP_ROLES,
  PROFESSIONAL_STAFF_ROLES,
  ROLE_CATEGORIES,
  ROLE_LABELS,
} from '@/constants/roles'
import { ROLE_DASHBOARD_MAP } from '@/utils/roleRedirect'

const CATEGORY_CONFIG = [
  {
    title: ROLE_CATEGORIES.LEADERSHIP,
    roles: LEADERSHIP_ROLES,
    icon: Landmark,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
  {
    title: ROLE_CATEGORIES.DEPARTMENTAL_HEADS,
    roles: DEPARTMENTAL_HEAD_ROLES,
    icon: BriefcaseBusiness,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  {
    title: ROLE_CATEGORIES.PROFESSIONAL_STAFF,
    roles: PROFESSIONAL_STAFF_ROLES,
    icon: UserRoundCog,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
  },
  {
    title: ROLE_CATEGORIES.FRONTLINE_STAFF,
    roles: FRONTLINE_ROLES,
    icon: Headphones,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
]

export default function EmployeeDashboardsPage() {
  const supabase = createClient()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchEmployees()
  }, [])

  async function fetchEmployees() {
    setLoading(true)
    setError('')

    try {
      const { data, error: employeeError } = await supabase
        .from('users_with_roles')
        .select('id, role, is_active')
        .in('role', EMPLOYEE_ROLES)

      if (employeeError) {
        setError(employeeError.message || 'Failed to load employee dashboard data')
        setUsers([])
        return
      }

      setUsers(data || [])
    } catch (err) {
      setError(err?.message || 'Failed to load employee dashboard data')
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const countsByRole = useMemo(() => {
    return users.reduce((acc, user) => {
      if (!acc[user.role]) {
        acc[user.role] = { total: 0, active: 0 }
      }

      acc[user.role].total += 1
      if (user.is_active) acc[user.role].active += 1

      return acc
    }, {})
  }, [users])

  const totalDashboards = EMPLOYEE_ROLES.length
  const activeEmployees = users.filter(user => user.is_active).length

  return (
    <>
      <Topbar title="Employee Dashboards" />
      <PageWrapper>

        <div className="mb-6">
          <h2 className="text-white text-xl font-bold">Employee Dashboards</h2>
          <p className="text-slate-400 text-sm mt-1">Open the role-specific dashboard views used across FortiBank teams.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Dashboard Views', value: totalDashboards, color: 'text-white' },
            { label: 'Active Employees', value: loading ? '...' : activeEmployees, color: 'text-green-400' },
            { label: 'Role Groups', value: CATEGORY_CONFIG.length, color: 'text-blue-400' },
            { label: 'Employee Roles', value: EMPLOYEE_ROLES.length, color: 'text-amber-400' },
          ].map(item => (
            <div key={item.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
              <p className="text-slate-500 text-xs mt-1">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {CATEGORY_CONFIG.map(category => {
            const CategoryIcon = category.icon

            return (
              <section key={category.title}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-9 h-9 rounded-lg ${category.bg} ${category.border} border flex items-center justify-center`}>
                    <CategoryIcon className={`w-5 h-5 ${category.color}`} />
                  </div>
                  <h3 className="text-white font-semibold">{category.title}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {category.roles.map(role => {
                    const count = countsByRole[role] || { total: 0, active: 0 }

                    return (
                      <Link
                        key={role}
                        href={ROLE_DASHBOARD_MAP[role]}
                        className="group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <ShieldCheck className={`w-4 h-4 ${category.color} flex-shrink-0`} />
                              <h4 className="text-white font-semibold text-sm truncate">{ROLE_LABELS[role]}</h4>
                            </div>
                            <p className="text-slate-500 text-xs mt-2">
                              {loading ? 'Loading employees...' : `${count.active} active of ${count.total} employees`}
                            </p>
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors flex-shrink-0" />
                        </div>

                        <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                          <Building2 className="w-4 h-4" />
                          <span className="truncate">{ROLE_DASHBOARD_MAP[role]}</span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>

      </PageWrapper>
    </>
  )
}
