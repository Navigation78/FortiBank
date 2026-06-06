// src/app/not-found.jsx
// Global 404 page for unmatched routes.

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f172a] font-sans">
      <div className="w-full max-w-md rounded-xl border border-slate-700 bg-[#1e293b] p-8 text-center shadow-xl">
        <div className="mb-2 text-6xl font-black text-slate-600">404</div>
        <h1 className="mb-2 text-xl font-bold text-white">Page not found</h1>
        <p className="mb-6 text-sm text-slate-400">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/login"
          className="inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  )
}
