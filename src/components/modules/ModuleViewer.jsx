'use client'
// src/components/modules/ModuleViewer.jsx
// Renders module content blocks — handles video, PDF,
// image, text and slides. Tracks reading progress.

import { useState, useEffect, useCallback } from 'react'
import VideoPlayer from '@/components/modules/VideoPlayer'
import ModuleProgress from '@/components/modules/ModuleProgress'
import { useProgress } from '@/hooks/useProgress'
import Link from 'next/link'

export default function ModuleViewer({ module }) {
  const { startModule, updateProgress, completeModule } = useProgress()
  const [currentIdx, setCurrentIdx] = useState(0)
  const [viewed, setViewed]         = useState(new Set())
  const [completing, setCompleting] = useState(false)
  const [completed, setCompleted]   = useState(
    module.progress?.status === 'completed'
  )

  const content = module.content || []
  const total   = content.length
  const current = content[currentIdx]

  // Start module on mount
  useEffect(() => {
    if (module.progress?.status === 'not_started') {
      startModule(module.id)
    }
    // Mark first content as viewed
    setViewed(new Set([0]))
  }, [])

  // Update progress when viewed set changes
  useEffect(() => {
    if (total === 0) return
    const pct = Math.round((viewed.size / total) * 100)
    updateProgress(module.id, pct)
  }, [viewed])

  function goToContent(idx) {
    setCurrentIdx(idx)
    setViewed(prev => new Set([...prev, idx]))
  }

  function goNext() {
    if (currentIdx < total - 1) {
      goToContent(currentIdx + 1)
    }
  }

  function goPrev() {
    if (currentIdx > 0) {
      goToContent(currentIdx - 1)
    }
  }

  async function handleComplete() {
    setCompleting(true)
    await completeModule(module.id)
    setCompleted(true)
    setCompleting(false)
  }

  const progressPct = total > 0
    ? Math.round((viewed.size / total) * 100)
    : 0

  const isLastContent  = currentIdx === total - 1
  const allViewed      = viewed.size >= total

  if (total === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-400">No content available for this module yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress tracker */}
      <ModuleProgress
        current={currentIdx + 1}
        total={total}
        completedPct={progressPct}
      />

      {/* Content area */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {/* Content header */}
        <div className="px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="capitalize">{current?.content_type?.replace('_', ' ')}</span>
            <span>·</span>
            <span>Section {currentIdx + 1} of {total}</span>
          </div>
          <h2 className="text-white font-semibold">{current?.title}</h2>
        </div>

        {/* Content body */}
        <div className="p-6">
          {current?.content_type === 'video' && (
            <VideoPlayer url={current.content_url} title={current.title} />
          )}

          {current?.content_type === 'pdf' && (
            <div className="space-y-4">
              <div className="aspect-[4/3] bg-slate-800 rounded-xl overflow-hidden">
                <iframe
                  src={`${current.content_url}#toolbar=0&navpanes=0`}
                  className="w-full h-full"
                  title={current.title}
                />
              </div>
              <a
                href={current.content_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Open PDF in new tab
              </a>
            </div>
          )}

          {current?.content_type === 'image' && (
            <div className="flex justify-center">
              <img
                src={current.content_url}
                alt={current.title}
                className="max-w-full rounded-xl border border-slate-700"
              />
            </div>
          )}

          {current?.content_type === 'text' && (
            <div
              className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: current.content_body }}
            />
          )}

          {current?.content_type === 'slides' && (
            <div className="aspect-[16/9] bg-slate-800 rounded-xl overflow-hidden">
              <iframe
                src={current.content_url}
                className="w-full h-full"
                title={current.title}
                allowFullScreen
              />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={goPrev}
            disabled={currentIdx === 0}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 rounded-lg text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>

          {/* Content dots */}
          <div className="hidden sm:flex items-center gap-1.5">
            {content.map((_, i) => (
              <button
                key={i}
                onClick={() => goToContent(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentIdx    ? 'bg-blue-400 scale-125' :
                  viewed.has(i)       ? 'bg-blue-600' :
                  'bg-slate-700 hover:bg-slate-600'
                }`}
              />
            ))}
          </div>

          {isLastContent ? (
            completed ? (
              // Module done — go to quiz if available
              module.quiz ? (
                <Link
                  href={`/modules/${module.id}/quiz`}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Take Quiz
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <Link
                  href="/modules"
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Back to Modules
                </Link>
              )
            ) : (
              <button
                onClick={handleComplete}
                disabled={completing || !allViewed}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
              >
                {completing ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    {allViewed ? 'Complete Module ✓' : 'View all sections first'}
                  </>
                )}
              </button>
            )
          ) : (
            <button
              onClick={goNext}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Next
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}