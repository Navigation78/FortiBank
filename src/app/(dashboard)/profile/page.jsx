'use client'

// src/app/(dashboard)/profile/page.jsx

import { useState } from 'react'
import Topbar from '@/components/layout/Topbar'
import PageWrapper from '@/components/layout/PageWrapper'
import { useAuth } from '@/hooks/useAuth'
import { useRole } from '@/hooks/useRole'
import { ROLE_LABELS } from '@/constants/roles'

const CATEGORY_COLORS = {
  'Leadership':         'bg-purple-500/15 text-purple-400 border-purple-500/20',
  'Departmental Heads': 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  'Professional Staff': 'bg-green-500/15 text-green-400 border-green-500/20',
  'Frontline Staff':    'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  'System':             'bg-red-500/15 text-red-400 border-red-500/20',
}

export default function ProfilePage() {
  const { profile, updatePassword } = useAuth()
  const { role } = useRole()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword]         = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwLoading, setPwLoading]             = useState(false)
  const [pwError, setPwError]                 = useState('')
  const [pwSuccess, setPwSuccess]             = useState(false)

  const roleLabel    = ROLE_LABELS[role] || role
  const categoryColor = CATEGORY_COLORS[profile?.role_category] || CATEGORY_COLORS['Frontline Staff']

  async function handlePasswordChange(e) {
    e.preventDefault()
    setPwError('')
    setPwSuccess(false)

    if (newPassword.length < 8) {
      setPwError('New password must be at least 8 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPwError('Passwords do not match.')
      return
    }

    setPwLoading(true)
    const { error } = await updatePassword(newPassword)
    if (error) {
      setPwError(error.message)
    } else {
      setPwSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }
    setPwLoading(false)
  }

  return (
    <>
      <Topbar title="My Profile" />
      <PageWrapper>
        <div className="max-w-2xl mx-auto space-y-6">

          {/* Profile card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-start gap-5">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-400 text-2xl font-bold">
                  {profile?.full_name?.charAt(0) || 'U'}
                </span>
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <h2 className="text-white text-xl font-bold">{profile?.full_name || '—'}</h2>
                <p className="text-slate-400 text-sm mt-0.5">{profile?.email}</p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-lg border ${categoryColor}`}>
                    {roleLabel}
                  </span>
                  {profile?.employee_id && (
                    <span className="text-xs text-slate-500 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                      ID: {profile.employee_id}
                    </span>
                  )}
                  {profile?.department && (
                    <span className="text-xs text-slate-500 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                      {profile.department}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-800">
              <div>
                <p className="text-slate-500 text-xs">Role category</p>
                <p className="text-slate-300 text-sm mt-1">{profile?.role_category || '—'}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs">Account status</p>
                <p className={`text-sm mt-1 font-medium ${profile?.is_active ? 'text-green-400' : 'text-red-400'}`}>
                  {profile?.is_active ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div>
                <p className="text-slate-500 text-xs">Member since</p>
                <p className="text-slate-300 text-sm mt-1">
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString('en-KE', { dateStyle: 'medium' })
                    : '—'}
                </p>
              </div>
              <div>
                <p className="text-slate-500 text-xs">Risk thresholds</p>
                <p className="text-slate-300 text-sm mt-1">
                  Warning: {profile?.risk_warning_threshold} · Critical: {profile?.risk_critical_threshold}
                </p>
              </div>
            </div>
          </div>

          {/* Change password */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">Change Password</h3>

            {pwSuccess && (
              <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-green-400 text-sm">Password updated successfully.</p>
              </div>
            )}

            {pwError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm">{pwError}</p>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">
                  New password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                  minLength={8}
                  className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">
                  Confirm new password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  required
                  className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={pwLoading}
                className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-medium rounded-lg px-5 py-2.5 text-sm transition-colors flex items-center gap-2"
              >
                {pwLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Updating...
                  </>
                ) : 'Update password'}
              </button>
            </form>
          </div>

        </div>
      </PageWrapper>
    </>
  )
}