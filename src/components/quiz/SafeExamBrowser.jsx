'use client'

// src/components/quiz/SafeExamBrowser.jsx
// Wraps the final exam with fullscreen enforcement and violation tracking.
// Tab switches, window blur, and fullscreen exits are counted as violations.
// At MAX_VIOLATIONS the exam is auto-submitted.

import { useState, useEffect, useRef, useCallback } from 'react'
import { Shield, AlertTriangle, Monitor, Maximize } from 'lucide-react'

const MAX_VIOLATIONS = 3

export default function SafeExamBrowser({ children, onForceSubmit }) {
  const [phase, setPhase] = useState('pre') // pre | active
  const [violations, setViolations] = useState(0)
  const [lastViolation, setLastViolation] = useState(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  // Track whether force-submit has been triggered to avoid double calls
  const forcedRef = useRef(false)

  // ── Fullscreen change ────────────────────────────────────────
  useEffect(() => {
    function onFsChange() {
      const inFs = !!document.fullscreenElement
      setIsFullscreen(inFs)
      if (!inFs && phase === 'active') {
        addViolation('Exited fullscreen mode')
      }
    }
    document.addEventListener('fullscreenchange', onFsChange)
    return () => document.removeEventListener('fullscreenchange', onFsChange)
  }, [phase])

  // ── Tab visibility ───────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'active') return
    function onVisible() {
      if (document.hidden) addViolation('Switched to another tab')
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [phase])

  // ── Window blur (switching apps) ─────────────────────────────
  useEffect(() => {
    if (phase !== 'active') return
    function onBlur() { addViolation('Window lost focus') }
    window.addEventListener('blur', onBlur)
    return () => window.removeEventListener('blur', onBlur)
  }, [phase])

  // ── Block right-click + dev-tool shortcuts ───────────────────
  useEffect(() => {
    if (phase !== 'active') return
    function onCtxMenu(e) { e.preventDefault() }
    function onKey(e) {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && e.key.toLowerCase() === 'u')
      ) {
        e.preventDefault()
      }
    }
    document.addEventListener('contextmenu', onCtxMenu)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('contextmenu', onCtxMenu)
      document.removeEventListener('keydown', onKey)
    }
  }, [phase])

  const addViolation = useCallback((reason) => {
    setLastViolation(reason)
    setViolations(prev => {
      const next = prev + 1
      if (next >= MAX_VIOLATIONS && !forcedRef.current) {
        forcedRef.current = true
        onForceSubmit?.()
      }
      return next
    })
  }, [onForceSubmit])

  async function enterExam() {
    try {
      await document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } catch {
      // Fullscreen blocked by browser — proceed anyway
    }
    setPhase('active')
  }

  // ── Pre-exam rules screen ────────────────────────────────────
  if (phase === 'pre') {
    return (
      <div className="max-w-lg mx-auto py-6 space-y-5">
        <div className="rounded-xl border border-blue-500/30 bg-blue-500/[0.05] p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-base">Safe Exam Mode</h3>
              <p className="text-blue-400 text-xs mt-0.5">Monitored assessment environment</p>
            </div>
          </div>

          <ul className="space-y-3">
            {[
              ['The exam will run in fullscreen — do not exit.', 'text-slate-300'],
              ['Switching tabs or windows counts as a violation.', 'text-slate-300'],
              ['Right-click and browser shortcuts are disabled.', 'text-slate-300'],
              [`${MAX_VIOLATIONS} violations will auto-submit your exam.`, 'text-amber-300'],
              ['Pass mark: 80% — you have 3 attempts before the module resets.', 'text-slate-300'],
            ].map(([text, color], i) => (
              <li key={i} className="flex items-start gap-3">
                <span className={`w-5 h-5 rounded-full bg-slate-800 text-xs flex items-center justify-center flex-shrink-0 mt-0.5 ${color}`}>
                  {i + 1}
                </span>
                <span className={`text-sm ${color}`}>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={enterExam}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <Monitor className="w-4 h-4" />
          I Understand.Enter Exam Mode
        </button>
      </div>
    )
  }

  // ── Active exam wrapper ──────────────────────────────────────
  return (
    <div>
      {/* Status bar */}
      <div className="mb-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800">
        <Shield className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
        <span className="text-green-400 text-xs font-medium">Safe Exam Mode Active</span>
        {violations > 0 && (
          <span className="ml-2 text-amber-400 text-xs">
            {violations}/{MAX_VIOLATIONS} violations
          </span>
        )}
        {!isFullscreen && (
          <button
            onClick={() => document.documentElement.requestFullscreen().catch(() => {})}
            className="ml-auto flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            <Maximize className="w-3 h-3" />
            Fullscreen
          </button>
        )}
      </div>

      {/* Violation banner */}
      {lastViolation && violations < MAX_VIOLATIONS && (
        <div className="mb-4 flex items-start gap-3 rounded-lg border border-amber-500/40 bg-amber-500/[0.07] px-4 py-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-300 text-sm font-medium">Violation: {lastViolation}</p>
            <p className="text-amber-500/80 text-xs mt-0.5">
              {violations}/{MAX_VIOLATIONS}  exam auto-submits at {MAX_VIOLATIONS}.
            </p>
          </div>
        </div>
      )}

      {children}
    </div>
  )
}
