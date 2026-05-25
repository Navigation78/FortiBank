'use client'

import { useRef, useState } from 'react'
import PageWrapper from '@/components/layout/PageWrapper'
import { useAuth } from '@/hooks/useAuth'
import { useRole } from '@/hooks/useRole'
import { ROLE_LABELS } from '@/constants/roles'

const CATEGORY_COLORS = {
  'Leadership':         'bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/20',
  'Departmental Heads': 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20',
  'Professional Staff': 'bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/20',
  'Frontline Staff':    'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
  'System':             'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/20',
}

export default function ProfilePage() {
  const { profile, user, updatePassword, updateAvatarUrl } = useAuth()
  const { role } = useRole()

  const fileInputRef = useRef(null)

  const [avatarLoading, setAvatarLoading] = useState(false)
  const [avatarError,   setAvatarError]   = useState('')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword,     setNewPassword]      = useState('')
  const [confirmPassword, setConfirmPassword]  = useState('')
  const [pwLoading,       setPwLoading]        = useState(false)
  const [pwError,         setPwError]          = useState('')
  const [pwSuccess,       setPwSuccess]        = useState(false)

  const roleLabel     = ROLE_LABELS[role] || role
  const categoryColor = CATEGORY_COLORS[profile?.role_category] || CATEGORY_COLORS['Frontline Staff']
  const avatarUrl     = profile?.avatar_url || user?.user_metadata?.avatar_url || null
  const initial       = profile?.full_name?.charAt(0) || 'U'

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

    setAvatarError('')
    setAvatarLoading(true)

    const form = new FormData()
    form.append('file', file)

    try {
      const res  = await fetch('/api/profile/avatar', { method: 'POST', body: form })
      const data = await res.json()

      if (!res.ok) {
        setAvatarError(data.error || 'Upload failed.')
        return
      }

      const { error } = await updateAvatarUrl(data.url)
      if (error) setAvatarError(error.message)
    } catch {
      setAvatarError('Upload failed. Please try again.')
    } finally {
      setAvatarLoading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

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
    <PageWrapper>
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Profile card */}
        <div className="bg-th-srf border border-th-brd rounded-xl p-6">
          <div className="flex items-start gap-5">

            {/* Avatar - clickable upload zone */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarLoading}
                className="relative w-16 h-16 rounded-xl overflow-hidden group focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                title="Click to change profile picture"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Profile picture"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-500/15 border border-blue-500/25 flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 text-2xl font-bold">{initial}</span>
                  </div>
                )}

                {/* Hover / loading overlay */}
                <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-150 ${avatarLoading ? 'opacity-100 bg-black/60' : 'opacity-0 group-hover:opacity-100 bg-black/50'}`}>
                  {avatarLoading ? (
                    <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                    </svg>
                  )}
                </div>
              </button>

              <span className="text-th-muted text-[10px] leading-tight text-center">
                Click to upload
              </span>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-th-txt text-xl font-bold">{profile?.full_name || '-'}</h4>
              <p className="text-th-txt2 text-sm mt-0.5">{profile?.email}</p>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-lg border ${categoryColor}`}>
                  {roleLabel}
                </span>
                {profile?.employee_id && (
                  <span className="text-xs text-th-muted bg-th-hov px-2.5 py-1 rounded-lg border border-th-brd">
                    ID: {profile.employee_id}
                  </span>
                )}
                {profile?.department && (
                  <span className="text-xs text-th-muted bg-th-hov px-2.5 py-1 rounded-lg border border-th-brd">
                    {profile.department}
                  </span>
                )}
              </div>

              {avatarError && (
                <p className="text-red-600 dark:text-red-400 text-xs mt-2">{avatarError}</p>
              )}
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-th-brd">
            <div>
              <p className="text-th-muted text-xs">Role category</p>
              <p className="text-th-txt2 text-sm mt-1">{profile?.role_category || '-'}</p>
            </div>
            <div>
              <p className="text-th-muted text-xs">Account status</p>
              <p className={`text-sm mt-1 font-medium ${profile?.is_active ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {profile?.is_active ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div>
              <p className="text-th-muted text-xs">Member since</p>
              <p className="text-th-txt2 text-sm mt-1">
                {profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString('en-KE', { dateStyle: 'medium' })
                  : '-'}
              </p>
            </div>
            <div>
              <p className="text-th-muted text-xs">Risk thresholds</p>
              <p className="text-th-txt2 text-sm mt-1">
                Warning: {profile?.risk_warning_threshold} · Critical: {profile?.risk_critical_threshold}
              </p>
            </div>
          </div>
        </div>

        {/* Change password */}
        <div className="bg-th-srf border border-th-brd rounded-xl p-6">
          <h3 className="text-th-txt font-semibold mb-4">Change Password</h3>

          {pwSuccess && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg">
              <p className="text-green-700 dark:text-green-400 text-sm">Password updated successfully.</p>
            </div>
          )}

          {pwError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{pwError}</p>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-th-txt text-sm font-medium mb-1.5">
                New password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                minLength={8}
                className="w-full bg-th-ibg border border-th-ibrd text-th-txt placeholder:text-th-muted rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/70 focus:ring-1 focus:ring-blue-500/20 transition-all duration-150"
              />
            </div>
            <div>
              <label className="block text-th-txt text-sm font-medium mb-1.5">
                Confirm new password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                required
                className="w-full bg-th-ibg border border-th-ibrd text-th-txt placeholder:text-th-muted rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/70 focus:ring-1 focus:ring-blue-500/20 transition-all duration-150"
              />
            </div>
            <button
              type="submit"
              disabled={pwLoading}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-medium rounded-lg px-5 py-2.5 text-sm transition-all duration-150 flex items-center gap-2"
            >
              {pwLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Updating...
                </>
              ) : 'Update password'}
            </button>
          </form>
        </div>

      </div>
    </PageWrapper>
  )
}
