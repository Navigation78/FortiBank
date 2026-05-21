'use client'
// src/app/(dashboard)/modules/[moduleId]/page.jsx
// Full-screen LMS viewer – no PageWrapper; uses LMSModuleViewer's own layout.

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import LMSModuleViewer from '@/components/modules/LMSModuleViewer'
import { useModules } from '@/hooks/useModules'

export default function ModuleViewerPage() {
  const { moduleId }            = useParams()
  const { modules, fetchModuleById } = useModules()

  const [module, setModule]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    if (moduleId) loadModule()
  }, [moduleId])

  async function loadModule() {
    setLoading(true)
    const { data, error } = await fetchModuleById(moduleId)
    if (error) setError(error)
    else setModule(data)
    setLoading(false)
  }

  // Find next module in sequence
  const nextModule = (() => {
    if (!module || modules.length === 0) return null
    return modules
      .filter(m => m.order_index > module.order_index)
      .sort((a, b) => a.order_index - b.order_index)[0] || null
  })()

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-full">
        {/* Sidebar skeleton */}
        <div className="w-72 flex-shrink-0 bg-slate-900 border-r border-white/[0.06] p-4 animate-pulse space-y-3">
          <div className="h-3 bg-slate-800 rounded w-1/3 mb-5" />
          <div className="h-4 bg-slate-800 rounded w-4/5" />
          <div className="h-1.5 bg-slate-800 rounded mt-3" />
          <div className="mt-6 space-y-2">
            {[...Array(4)].map((_, i) => <div key={i} className="h-8 bg-slate-800 rounded-lg" />)}
          </div>
        </div>
        {/* Content skeleton */}
        <div className="flex-1 p-8 animate-pulse space-y-4">
          <div className="h-4 bg-slate-800 rounded w-20 mb-6" />
          <div className="h-7 bg-slate-800 rounded w-2/3" />
          <div className="h-3 bg-slate-800 rounded w-1/3 mt-2" />
          <div className="h-48 bg-slate-800 rounded-xl mt-6" />
          <div className="space-y-2 mt-4">
            <div className="h-3 bg-slate-800 rounded w-full" />
            <div className="h-3 bg-slate-800 rounded w-5/6" />
            <div className="h-3 bg-slate-800 rounded w-4/6" />
          </div>
        </div>
      </div>
    )
  }

  // ── Error / not found ─────────────────────────────────────────────────────
  if (error || !module) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <div className="text-center py-16">
          <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5C3.312 18.333 4.274 20 5.814 20z" />
            </svg>
          </div>
          <p className="text-slate-400 mb-4">
            {error || 'This module could not be found or you do not have access.'}
          </p>
          <Link href="/modules" className="text-blue-400 hover:text-blue-300 text-sm">
            ← Back to modules
          </Link>
        </div>
      </div>
    )
  }

  // ── LMS viewer ────────────────────────────────────────────────────────────
  return <LMSModuleViewer module={module} nextModule={nextModule} />
}
