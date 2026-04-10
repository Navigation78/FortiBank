'use client'

// src/app/(dashboard)/modules/[moduleId]/page.jsx
// Individual module viewer page

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Topbar from '@/components/layout/Topbar'
import PageWrapper from '@/components/layout/PageWrapper'
import ModuleViewer from '@/components/modules/ModuleViewer'
import { useModules } from '@/hooks/useModules'

export default function ModuleViewerPage() {
  const { moduleId } = useParams()
  const { fetchModuleById } = useModules()

  const [module, setModule]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    if (moduleId) loadModule()
  }, [moduleId])

  async function loadModule() {
    setLoading(true)
    const { data, error } = await fetchModuleById(moduleId)
    if (error) {
      setError(error)
    } else {
      setModule(data)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <>
        <Topbar title="Loading module..." />
        <PageWrapper>
          <div className="space-y-4 animate-pulse">
            <div className="h-6 bg-slate-800 rounded w-1/3" />
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
              {error || 'This module could not be found or you do not have access to it.'}
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
          {/* Main content — 2 columns */}
          <div className="lg:col-span-2">
            <ModuleViewer module={module} />
          </div>

          {/* Sidebar info — 1 column */}
          <div className="space-y-4">
            {/* Module info */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h3 className="text-white font-semibold mb-3">About this module</h3>
              {module.description && (
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  {module.description}
                </p>
              )}
              <div className="space-y-2 text-sm">
                {module.duration_mins && (
                  <div className="flex items-center gap-2 text-slate-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {module.duration_mins} minutes
                  </div>
                )}
                <div className="flex items-center gap-2 text-slate-500">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {module.content?.length || 0} sections
                </div>
              </div>
            </div>

            {/* Quiz info */}
            {module.quiz && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <h3 className="text-white font-semibold mb-3">Module Quiz</h3>
                <div className="space-y-2 text-sm text-slate-500 mb-4">
                  <div className="flex justify-between">
                    <span>Pass mark</span>
                    <span className="text-white">{module.quiz.pass_score}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max attempts</span>
                    <span className="text-white">{module.quiz.max_attempts}</span>
                  </div>
                  {module.quiz.time_limit_mins && (
                    <div className="flex justify-between">
                      <span>Time limit</span>
                      <span className="text-white">{module.quiz.time_limit_mins} min</span>
                    </div>
                  )}
                </div>
                {module.progress?.status === 'completed' && (
                  <Link
                    href={`/modules/${moduleId}/quiz`}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg py-2 text-sm transition-colors block text-center"
                  >
                    Take Quiz
                  </Link>
                )}
              </div>
            )}

            {/* Back link */}
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