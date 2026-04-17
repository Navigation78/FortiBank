'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Topbar from '@/components/layout/Topbar'
import PageWrapper from '@/components/layout/PageWrapper'
import AssignRoleForm from '@/components/admin/AssignRoleForm'
import { createClient } from '@/lib/supabase'
import { ROLE_LABELS } from '@/constants/roles'

export default function UserDetailPage() {
  const { userId }        = useParams()
  const supabase          = createClient()
  const [user, setUser]   = useState(null)
  const [scores, setScores] = useState([])
  const [attempts, setAttempts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [toggling, setToggling] = useState(false)

  useEffect(() => { if (userId) fetchUser() }, [userId])

  async function fetchUser() {
    setLoading(true)
    const [userRes, scoresRes, attemptsRes] = await Promise.all([
      supabase.from('users_with_roles').select('*').eq('id', userId).single(),
      supabase.from('risk_scores').select('*').eq('user_id', userId).order('calculated_at', { ascending: false }).limit(5),
      supabase.from('quiz_attempts').select('*, quizzes(title, modules(title))').eq('user_id', userId).order('submitted_at', { ascending: false }).limit(5),
    ])
    setUser(userRes.data)
    setScores(scoresRes.data || [])
    setAttempts(attemptsRes.data || [])
    setLoading(false)
  }

  async function toggleActive() {
    setToggling(true)
    await supabase.from('users').update({ is_active: !user.is_active }).eq('id', userId)
    await fetchUser()
    setToggling(false)
  }

  if (loading) {
    return (
      <>
        <Topbar title="Employee Details" />
        <PageWrapper>
          <div className="animate-pulse space-y-4 max-w-3xl">
            <div className="h-32 bg-slate-900 border border-slate-800 rounded-xl" />
          </div>
        </PageWrapper>
      </>
    )
  }

  if (!user) {
    return (
      <>
        <Topbar title="Not Found" />
        <PageWrapper>
          <p className="text-slate-400">User not found.</p>
        </PageWrapper>
      </>
    )
  }

  const latestScore = scores[0]

  return (
    <>
      <Topbar title={user.full_name} />
      <PageWrapper>

        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/admin/users" className="hover:text-slate-300">Users</Link>
          <span>/</span>
          <span className="text-slate-300">{user.full_name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl">

          {/* Profile card */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                    <span className="text-blue-400 text-xl font-bold">{user.full_name?.charAt(0)}</span>
                  </div>
                  <div>
                    <h2 className="text-white text-lg font-bold">{user.full_name}</h2>
                    <p className="text-slate-400 text-sm">{user.email}</p>
                    <p className="text-slate-500 text-xs">{user.role_display_name} · {user.department || 'No department'}</p>
                  </div>
                </div>
                <button
                  onClick={toggleActive}
                  disabled={toggling}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                    user.is_active
                      ? 'bg-red-500/15 text-red-400 hover:bg-red-500/25'
                      : 'bg-green-500/15 text-green-400 hover:bg-green-500/25'
                  }`}
                >
                  {toggling ? '...' : user.is_active ? 'Deactivate' : 'Activate'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm border-t border-slate-800 pt-4">
                <div>
                  <p className="text-slate-500 text-xs">Employee ID</p>
                  <p className="text-slate-300 mt-0.5">{user.employee_id || '—'}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Member since</p>
                  <p className="text-slate-300 mt-0.5">{new Date(user.created_at).toLocaleDateString('en-KE', { dateStyle: 'medium' })}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Risk score</p>
                  <p className={`font-semibold mt-0.5 ${latestScore?.is_critical ? 'text-red-400' : latestScore?.is_warning ? 'text-orange-400' : 'text-green-400'}`}>
                    {latestScore ? Math.round(latestScore.composite_score) : '—'}/100
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Status</p>
                  <p className={`font-medium mt-0.5 ${user.is_active ? 'text-green-400' : 'text-red-400'}`}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>
            </div>

            {/* Recent quiz attempts */}
            {attempts.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <h3 className="text-white font-semibold mb-3">Recent Quiz Attempts</h3>
                <div className="space-y-2">
                  {attempts.map(a => (
                    <div key={a.id} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                      <div>
                        <p className="text-slate-300 text-sm">{a.quizzes?.modules?.title}</p>
                        <p className="text-slate-500 text-xs">{new Date(a.submitted_at).toLocaleDateString('en-KE')}</p>
                      </div>
                      <span className={`text-sm font-bold ${a.passed ? 'text-green-400' : 'text-red-400'}`}>
                        {a.score_pct}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Assign role */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h3 className="text-white font-semibold mb-4">Change Role</h3>
              <AssignRoleForm
                userId={userId}
                currentRole={user.role}
                onSuccess={fetchUser}
              />
            </div>

            {/* Risk score history */}
            {scores.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <h3 className="text-white font-semibold mb-3">Risk Score History</h3>
                <div className="space-y-2">
                  {scores.map(s => (
                    <div key={s.id} className="flex items-center justify-between">
                      <span className="text-slate-500 text-xs">{new Date(s.calculated_at).toLocaleDateString('en-KE')}</span>
                      <span className={`text-sm font-semibold ${s.is_critical ? 'text-red-400' : s.is_warning ? 'text-orange-400' : 'text-green-400'}`}>
                        {Math.round(s.composite_score)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </PageWrapper>
    </>
  )
}