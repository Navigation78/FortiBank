'use client'

// src/app/admin/error.jsx
// Error boundary for admin routes.

import { useEffect } from 'react'
import Link from 'next/link'

export default function AdminError({ error, reset }) {
  useEffect(() => {
    console.error('[AdminError]', {
      message:   error?.message,
      digest:    error?.digest,
      timestamp: new Date().toISOString(),
    })
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
      <div className="w-full max-w-md rounded-xl border border-red-500/20 bg-th-srf p-8 shadow-lg">
        <div className="mb-4 text-4xl">⚠</div>
        <h2 className="mb-2 text-lg font-bold text-th-txt">Admin page error</h2>
        <p className="mb-6 text-sm text-th-muted">
          An error occurred in the admin panel.
          {error?.digest && (
            <span className="mt-1 block font-mono text-xs text-th-muted/60">
              Ref: {error.digest}
            </span>
          )}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => reset()}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/admin"
            className="rounded-lg border border-th-brd px-4 py-2 text-sm font-semibold text-th-muted hover:bg-th-bg transition-colors"
          >
            Admin home
          </Link>
        </div>
      </div>
    </div>
  )
}
