'use client'

// src/app/error.jsx
// Global Next.js error boundary page. Catches unhandled errors in the entire app tree.

import { useEffect } from 'react'

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('[GlobalError] Unhandled application error:', {
      message:   error?.message,
      name:      error?.name,
      digest:    error?.digest,
      timestamp: new Date().toISOString(),
    })
  }, [error])

  return (
    <html>
      <body className="flex min-h-screen items-center justify-center bg-[#0f172a] font-sans">
        <div className="w-full max-w-md rounded-xl border border-red-500/20 bg-[#1e293b] p-8 text-center shadow-xl">
          <div className="mb-4 text-5xl">⚠</div>
          <h1 className="mb-2 text-xl font-bold text-white">Something went wrong</h1>
          <p className="mb-6 text-sm text-slate-400">
            An unexpected error occurred. Our team has been notified.
            {error?.digest && (
              <span className="mt-1 block font-mono text-xs text-slate-600">
                Error ID: {error.digest}
              </span>
            )}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => reset()}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              Try again
            </button>
            <a
              href="/login"
              className="rounded-lg border border-slate-600 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
            >
              Go to login
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}
