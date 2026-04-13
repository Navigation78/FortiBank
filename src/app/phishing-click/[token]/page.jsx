'use client'

// src/app/phishing-click/[token]/page.jsx
// Landing page shown when an employee clicks a phishing link.
// Records the click, updates risk score, shows awareness message.
// No auth required — accessible via the email link.

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function PhishingClickPage() {
  const { token }         = useParams()
  const [status, setStatus] = useState('recording') // recording | done | error

  useEffect(() => {
    if (token) recordClick()
  }, [token])

  async function recordClick() {
    try {
      const res = await fetch(`/api/phishing/click`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ token }),
      })
      setStatus(res.ok ? 'done' : 'error')
    } catch {
      setStatus('done') // Still show the awareness message even if recording fails
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">

        {status === 'recording' && (
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        )}

        {(status === 'done' || status === 'error') && (
          <div className="bg-slate-900 border border-orange-500/30 rounded-2xl overflow-hidden">
            {/* Warning header */}
            <div className="bg-orange-500/10 border-b border-orange-500/30 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-orange-400 font-bold text-sm">SIMULATED PHISHING ATTACK</p>
                  <p className="text-slate-300 font-semibold">You clicked a phishing link</p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              <p className="text-slate-300 text-sm leading-relaxed">
                This was a <strong className="text-white">simulated phishing test</strong> conducted
                by your organization as part of the FortiBank cybersecurity training program.
                The email you received was not real — but a real attacker could have used the
                same technique to compromise your account or steal sensitive information.
              </p>

              <div className="bg-slate-800 rounded-xl p-4 space-y-2">
                <p className="text-white text-sm font-semibold">What you should have done:</p>
                <ul className="text-slate-400 text-sm space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">✓</span>
                    Check the sender email address carefully for misspellings
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">✓</span>
                    Hover over links to preview the actual URL before clicking
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">✓</span>
                    Be suspicious of urgency — legitimate systems don't demand immediate action
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">✓</span>
                    Report suspicious emails to IT security immediately
                  </li>
                </ul>
              </div>

              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <p className="text-red-400 text-sm font-semibold mb-1">Impact on your risk score</p>
                <p className="text-slate-400 text-sm">
                  This click has been recorded and will affect your cybersecurity risk score.
                  Complete your training modules to bring your score down.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 pb-6 flex flex-col sm:flex-row gap-3">
              <Link
                href="/modules"
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg py-2.5 text-sm transition-colors text-center"
              >
                Complete Training Modules
              </Link>
              <Link
                href="/login"
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg py-2.5 text-sm transition-colors text-center"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}

        <p className="text-center text-slate-600 text-xs mt-6">
          FortiBank Cybersecurity Training Program · This test was authorized by your organization
        </p>
      </div>
    </div>
  )
}