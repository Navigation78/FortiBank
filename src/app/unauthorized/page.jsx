'use client'


// src/app/unauthorized/page.jsx
// Shown when a user tries to access a route their role
// doesn't have permission for.

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { getDashboardUrl } from '@/utils/roleRedirect'

export default function UnauthorizedPage() {
  const { role, signOut } = useAuth()
  const dashboardUrl = getDashboardUrl(role)

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h1 className="text-white text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-slate-400 text-sm mb-8">
          You don't have permission to view this page.
          If you believe this is an error, please contact your system administrator.
        </p>
        <div className="flex flex-col gap-3">
          {role ? (
            <Link
              href={dashboardUrl}
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg py-2.5 text-sm transition-colors"
            >
              Go to my dashboard
            </Link>
          ) : null}
          <button
            onClick={signOut}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg py-2.5 text-sm transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}