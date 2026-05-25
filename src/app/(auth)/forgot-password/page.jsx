'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function ForgotPasswordPage() {
  const { sendPasswordResetEmail } = useAuth()

  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)
  const [error, setError]     = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await sendPasswordResetEmail(email)

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="bg-th-srf border border-th-brd rounded-2xl p-8 shadow-xl shadow-black/5 dark:shadow-black/40 text-center">
        <div className="w-14 h-14 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/25 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h4 className="text-th-txt text-xl font-bold mb-2">Check your email</h4>
        <p className="text-th-txt2 text-sm mb-6">
          We sent a password reset link to <span className="text-th-txt font-medium">{email}</span>.
          The link expires in 1 hour.
        </p>
        <p className="text-th-muted text-xs mb-6">
          Didn&apos;t receive it? Check your spam folder or try again.
        </p>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setSent(false)}
            className="w-full bg-th-hov hover:bg-th-act text-th-txt2 hover:text-th-txt border border-th-brd font-medium rounded-lg py-2.5 text-sm transition-all duration-150"
          >
            Try a different email
          </button>
          <Link
            href="/login"
            className="w-full text-th-muted hover:text-th-txt2 font-medium rounded-lg py-2.5 text-sm transition-all duration-150 text-center"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-th-srf border border-th-brd rounded-2xl p-8 shadow-xl shadow-black/5 dark:shadow-black/40">
      <div className="mb-6">
        <h4 className="text-th-txt text-2xl font-bold">Reset your password</h4>
        <p className="text-th-txt2 text-sm mt-1">
          Enter your email and we'll send you a reset link.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-th-txt text-sm font-medium mb-1.5">
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@fortibank.com"
            required
            autoComplete="email"
            className="w-full bg-th-ibg border border-th-ibrd text-th-txt placeholder:text-th-muted rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/70 focus:ring-1 focus:ring-blue-500/20 transition-all duration-150"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-medium rounded-lg py-2.5 text-sm transition-all duration-150 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Sending...
            </>
          ) : (
            'Send reset link'
          )}
        </button>
      </form>

      <div className="mt-4 text-center">
        <Link href="/login" className="text-th-muted hover:text-th-txt2 text-sm transition-all duration-150">
          ← Back to sign in
        </Link>
      </div>
    </div>
  )
}
