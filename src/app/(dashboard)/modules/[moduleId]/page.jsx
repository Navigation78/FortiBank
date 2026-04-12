'use client'

// ============================================================
// src/app/(dashboard)/modules/[moduleId]/page.jsx
// Individual module viewer page — NetAcad style.
// Passes nextModule to viewer so it can show "Next Module" button.
// ============================================================

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Topbar from '@/components/layout/Topbar'
import PageWrapper from '@/components/layout/PageWrapper'
import ModuleViewer from '@/components/modules/ModuleViewer'
import { useModules } from '@/hooks/useModules'

export default function ModuleViewerPage() {
  const { moduleId }        = useParams()
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

  // Find the next module in sequence
  const nextModule = (() => {
    if (!module || modules.length === 0) return null
    const currentOrder = module.order_index
    return modules
      .filter(m => m.order_index > currentOrder)
      .sort((a, b) => a.order_index - b.order_index)[0] || null
  })()

  if (loading) {
    return (
      <>
        <Topbar title="Loading..." />
        <PageWrapper>
          <div className="animate-pulse space-y-4 max-w-3xl">
            <div className="h-5 bg-slate-800 rounded w-1/3" />
            <div className="h-64 bg-slate-800 rounded-xl" />
          </div>
        </PageWrapper>
      </>
    )
  }

  if (error || !module) {
    return (
      <>
        <Topbar title="Module not found" />
        <PageWrapper>
          <div className="text-center py-16">
            <p className="text-slate-400 mb-4">
              {error || 'This module could not be found or you do not have access.'}
            </p>
            <Link href="/modules" className="text-blue-400 hover:text-blue-300 text-sm">
              ← Back to modules
            </Link>
          </div>
        </PageWrapper>
      </>
    )
  }

  return (
    <>
      <Topbar title={module.title} />
      <PageWrapper>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/modules" className="hover:text-slate-300 transition-colors">
            Modules
          </Link>
          <span>/</span>
          <span className="text-slate-300 truncate">{module.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main viewer — 2 columns */}
          <div className="lg:col-span-2">
            <ModuleViewer module={module} nextModule={nextModule} />
          </div>

          {/* Sidebar — 1 column */}
          <div className="space-y-4">
            {/* Module info */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h3 className="text-white font-semibold mb-3">About this module</h3>
              {module.description && (
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  {module.description}
                </p>
              )}
              <div className="space-y-2 text-sm text-slate-500">
                {module.duration_mins && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {module.duration_mins} minutes
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  {module.content?.length || 0} sections
                </div>
                {module.quiz && (
                  <div className="flex items-center gap-2 text-blue-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    Quiz included · Pass {module.quiz.pass_score}%
                  </div>
                )}
              </div>
            </div>

            {/* Next module preview */}
            {nextModule && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <p className="text-slate-500 text-xs mb-2">Up next</p>
                <p className="text-white text-sm font-medium">{nextModule.title}</p>
                {nextModule.duration_mins && (
                  <p className="text-slate-500 text-xs mt-1">{nextModule.duration_mins} min</p>
                )}
              </div>
            )}

            <Link
              href="/modules"
              className="flex items-center gap-2 text-slate-500 hover:text-slate-300 text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to all modules
            </Link>
          </div>
        </div>

      </PageWrapper>
    </>
  )
}