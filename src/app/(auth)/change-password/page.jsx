'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function ChangePasswordPage() {
  const router = useRouter()
  const { updatePassword, signOut } = useAuth()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const { error: updateError } = await updatePassword(password)

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)

    await signOut()
    router.replace('/login')
  }

  const passwordChecks = [
    {
      label: 'At least 8 characters',
      met: password.length >= 8,
    },
    {
      label: 'Add upper and lowercase letters',
      met: /[A-Z]/.test(password) && /[a-z]/.test(password),
    },
    {
      label: 'Include a number or symbol',
      met: /[\d\W_]/.test(password),
    },
  ]

  if (success) {
    return (
      <main className="min-h-screen bg-th-bg flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-th-srf border border-th-brd rounded-2xl p-8 shadow-xl shadow-black/5 dark:shadow-black/40 text-center">
          <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-green-500 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-th-txt text-xl font-bold mb-2">Password updated</h1>
          <p className="text-th-txt2 text-sm">
            Your new password is saved. Redirecting you to sign in...
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-th-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-th-srf border border-th-brd rounded-2xl p-8 shadow-xl shadow-black/5 dark:shadow-black/40">
        <div className="mb-6">
          <h1 className="text-th-txt text-2xl font-bold">Set your new password</h1>
          <p className="text-th-txt2 text-sm mt-1">
            Your temporary password only works once. Choose a new one to continue.
          </p>
          <div className="mt-3 space-y-1">
            {passwordChecks.map(check => (
              <p
                key={check.label}
                className={`text-xs ${check.met ? 'text-green-600 dark:text-green-400' : 'text-th-muted'}`}
              >
                {check.met ? 'OK' : 'TIP'} {check.label}
              </p>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-th-txt text-sm font-medium mb-1.5">
              New password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                minLength={8}
                className="w-full bg-th-ibg border border-th-ibrd text-th-txt placeholder:text-th-muted rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:border-blue-500/70 focus:ring-1 focus:ring-blue-500/20 transition-all duration-150"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-th-muted hover:text-th-txt2"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {password && password.length < 8 && (
              <p className="text-red-600 dark:text-red-400 text-xs mt-1">
                Password must be at least 8 characters.
              </p>
            )}
          </div>

          <div>
            <label className="block text-th-txt text-sm font-medium mb-1.5">
              Confirm password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Repeat your new password"
              required
              className={`w-full bg-th-ibg border text-th-txt placeholder:text-th-muted rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 transition-all duration-150 ${
                confirmPassword && password !== confirmPassword
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/40'
                  : 'border-th-ibrd focus:border-blue-500/70 focus:ring-blue-500/20'
              }`}
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="text-red-600 dark:text-red-400 text-xs mt-1">Passwords do not match</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || Boolean(confirmPassword && password !== confirmPassword)}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-medium rounded-lg py-2.5 text-sm transition-all duration-150 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Updating...
              </>
            ) : (
              'Save new password'
            )}
          </button>
        </form>
      </div>
    </main>
  )
}
