'use client'
// src/components/modules/ModuleViewer.jsx
// I have decided to adapt the netacad style of module viewer for this project.
// Phase 1: swipe/click through content sections.
// Phase 2: quiz slides in and replaces content panel.
// Phase 3: results with next module button.


import { useState, useEffect, useRef, useCallback } from 'react'
import VideoPlayer from '@/components/modules/VideoPlayer'
import QuizCard from '@/components/quiz/QuizCard'
import QuizTimer from '@/components/quiz/QuizTimer'
import { useProgress } from '@/hooks/useProgress'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'

// ── Phases ───────────────────────────────────────────────────
const PHASE = {
  CONTENT: 'content',
  QUIZ:    'quiz',
  RESULTS: 'results',
}

export default function ModuleViewer({ module, nextModule }) {
  const { user }                            = useAuth()
  const { startModule, updateProgress, completeModule } = useProgress()

  const content   = module.content  || []
  const quiz      = module.quiz     || null
  const totalSecs = content.length

  // ── Content state ─────────────────────────────────────────
  const [phase, setPhase]           = useState(PHASE.CONTENT)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [viewed, setViewed]         = useState(new Set([0]))
  const [completing, setCompleting] = useState(false)
  const [moduleComplete, setModuleComplete] = useState(
    module.progress?.status === 'completed'
  )

  // ── Quiz state ────────────────────────────────────────────
  const [questions, setQuestions]       = useState([])
  const [quizMeta, setQuizMeta]         = useState(null)
  const [quizLoading, setQuizLoading]   = useState(false)
  const [currentQ, setCurrentQ]         = useState(0)
  const [answers, setAnswers]           = useState({})
  const [submitting, setSubmitting]     = useState(false)
  const [result, setResult]             = useState(null)
  const [timeLeft, setTimeLeft]         = useState(null)
  const [attemptCount, setAttemptCount] = useState(0)
  const timerRef                        = useRef(null)

  // ── Touch swipe ───────────────────────────────────────────
  const touchStartX = useRef(null)

  // ── Panel slide animation ─────────────────────────────────
  const [sliding, setSliding] = useState(false)

  // Start module on mount
  useEffect(() => {
    if (module.progress?.status === 'not_started') {
      startModule(module.id)
    }
  }, [])

  // Update progress as sections are viewed
  useEffect(() => {
    if (totalSecs === 0) return
    const pct = Math.round((viewed.size / totalSecs) * 100)
    updateProgress(module.id, moduleComplete ? 100 : pct)
  }, [viewed])

  // Timer countdown
  useEffect(() => {
    if (phase === PHASE.QUIZ && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            submitQuiz()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [phase, timeLeft])

  // ── Content navigation ────────────────────────────────────
  function goToSection(idx) {
    if (idx < 0 || idx >= totalSecs) return
    setCurrentIdx(idx)
    setViewed(prev => new Set([...prev, idx]))
  }

  function goNext() { goToSection(currentIdx + 1) }
  function goPrev() { goToSection(currentIdx - 1) }

  // Touch swipe handlers
  function onTouchStart(e) { touchStartX.current = e.touches[0].clientX }
  function onTouchEnd(e) {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      diff > 0 ? goNext() : goPrev()
    }
    touchStartX.current = null
  }

  const allViewed   = viewed.size >= totalSecs
  const isLastSec   = currentIdx === totalSecs - 1
  const currentSec  = content[currentIdx]

  // ── Complete module & slide to quiz ───────────────────────
  async function handleCompleteAndStartQuiz() {
    setCompleting(true)
    await completeModule(module.id)
    setModuleComplete(true)
    setCompleting(false)

    if (quiz) {
      await loadQuiz()
    }
  }

  async function loadQuiz() {
    setQuizLoading(true)
    const res = await fetch(`/api/quiz?quizId=${quiz.id}`)
    if (!res.ok) { setQuizLoading(false); return }
    const data = await res.json()
    setQuizMeta(data.quiz)
    setQuestions(data.questions)
    setAttemptCount(data.attemptCount || 0)
    if (data.quiz?.time_limit_mins) {
      setTimeLeft(data.quiz.time_limit_mins * 60)
    }
    setQuizLoading(false)

    // Slide in quiz panel
    setSliding(true)
    setTimeout(() => {
      setPhase(PHASE.QUIZ)
      setSliding(false)
    }, 300)
  }

  // ── Quiz navigation ───────────────────────────────────────
  function selectAnswer(questionId, optionId, questionType) {
    setAnswers(prev => {
      const current = prev[questionId] || []
      if (questionType === 'multi_select') {
        const exists = current.includes(optionId)
        return {
          ...prev,
          [questionId]: exists
            ? current.filter(id => id !== optionId)
            : [...current, optionId],
        }
      }
      return { ...prev, [questionId]: [optionId] }
    })
  }

  const submitQuiz = useCallback(async () => {
    if (submitting) return
    setSubmitting(true)
    clearInterval(timerRef.current)

    const res = await fetch('/api/quiz/submit', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quiz_id:         quiz.id,
        answers,
        time_taken_secs: quizMeta?.time_limit_mins
          ? (quizMeta.time_limit_mins * 60) - (timeLeft || 0)
          : null,
      }),
    })

    const data = await res.json()
    setResult(data)
    setSubmitting(false)

    // Slide to results
    setSliding(true)
    setTimeout(() => {
      setPhase(PHASE.RESULTS)
      setSliding(false)
    }, 300)
  }, [quiz, answers, quizMeta, timeLeft, submitting])

  function retakeQuiz() {
    setAnswers({})
    setResult(null)
    setCurrentQ(0)
    if (quizMeta?.time_limit_mins) {
      setTimeLeft(quizMeta.time_limit_mins * 60)
    }
    setPhase(PHASE.QUIZ)
  }

  // ── Progress pct ──────────────────────────────────────────
  const progressPct = totalSecs > 0
    ? Math.round((viewed.size / totalSecs) * 100)
    : 100

  // ── No content fallback ───────────────────────────────────
  if (totalSecs === 0 && !quiz) {
    return (
      <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-xl">
        <p className="text-slate-400">No content available yet.</p>
        <p className="text-slate-600 text-sm mt-1">Check back after the admin adds content.</p>
      </div>
    )
  }

  return (
    <div className={`transition-all duration-300 ${sliding ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>

      {/* ── CONTENT PHASE ─────────────────────────────────── */}
      {phase === PHASE.CONTENT && (
        <div
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Section progress dots */}
          {totalSecs > 1 && (
            <div className="flex items-center gap-2 mb-5">
              {content.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSection(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentIdx
                      ? 'bg-blue-400 w-8'
                      : viewed.has(i)
                        ? 'bg-blue-600 w-4'
                        : 'bg-slate-700 w-4 hover:bg-slate-600'
                  }`}
                />
              ))}
              <span className="text-slate-500 text-xs ml-auto">
                {currentIdx + 1}/{totalSecs}
              </span>
            </div>
          )}

          {/* Content panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden mb-4">
            {/* Section header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-xs capitalize mb-0.5">
                  {currentSec?.content_type?.replace('_', ' ')}
                </p>
                <h3 className="text-white font-semibold">{currentSec?.title}</h3>
              </div>
              {/* Overall progress */}
              <div className="text-right">
                <p className="text-slate-500 text-xs mb-1">{progressPct}% read</p>
                <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Content body */}
            <div className="p-6">
              {currentSec?.content_type === 'video' && (
                <VideoPlayer url={currentSec.content_url} title={currentSec.title} />
              )}

              {currentSec?.content_type === 'pdf' && (
                <div className="space-y-4">
                  <div className="aspect-[4/3] bg-slate-800 rounded-xl overflow-hidden">
                    <iframe
                      src={`${currentSec.content_url}#toolbar=0&navpanes=0`}
                      className="w-full h-full"
                      title={currentSec.title}
                    />
                  </div>
                  <a
                    href={currentSec.content_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Open PDF in new tab
                  </a>
                </div>
              )}

              {currentSec?.content_type === 'image' && (
                <div className="flex justify-center">
                  <img
                    src={currentSec.content_url}
                    alt={currentSec.title}
                    className="max-w-full rounded-xl border border-slate-700"
                  />
                </div>
              )}

              {currentSec?.content_type === 'text' && (
                <div
                  className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: currentSec.content_body }}
                />
              )}

              {currentSec?.content_type === 'slides' && (
                <div className="aspect-video bg-slate-800 rounded-xl overflow-hidden">
                  <iframe
                    src={currentSec.content_url}
                    className="w-full h-full"
                    title={currentSec.title}
                    allowFullScreen
                  />
                </div>
              )}
            </div>

            {/* Navigation footer */}
            <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                onClick={goPrev}
                disabled={currentIdx === 0}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 rounded-lg text-sm font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              {isLastSec ? (
                // Last section — show complete / start quiz button
                moduleComplete ? (
                  quiz ? (
                    <button
                      onClick={loadQuiz}
                      disabled={quizLoading}
                      className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      {quizLoading ? 'Loading quiz...' : 'Start Quiz →'}
                    </button>
                  ) : (
                    <Link href="/modules" className="px-5 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-medium transition-colors">
                      Back to Modules ✓
                    </Link>
                  )
                ) : (
                  <button
                    onClick={handleCompleteAndStartQuiz}
                    disabled={completing || !allViewed}
                    className="flex items-center gap-2 px-5 py-2 bg-green-600 hover:bg-green-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    {completing
                      ? 'Saving...'
                      : allViewed
                        ? quiz ? 'Complete & Start Quiz →' : 'Complete Module ✓'
                        : `View all sections first (${viewed.size}/${totalSecs})`
                    }
                  </button>
                )
              ) : (
                <button
                  onClick={goNext}
                  className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
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
      )}

      {/* ── QUIZ PHASE ────────────────────────────────────── */}
      {phase === PHASE.QUIZ && (
        <div>
          {/* Quiz header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-blue-400 text-xs font-medium mb-0.5">Module Quiz</p>
              <h3 className="text-white font-semibold">{quizMeta?.title}</h3>
              <p className="text-slate-500 text-xs mt-0.5">
                Pass mark: {quizMeta?.pass_score}% · Attempt {attemptCount + 1} of {quizMeta?.max_attempts}
              </p>
            </div>
            <QuizTimer timeLeft={timeLeft} />
          </div>

          {/* Question progress dots */}
          <div className="flex items-center gap-2 mb-5">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQ(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentQ
                    ? 'bg-blue-400 w-8'
                    : answers[questions[i]?.id]
                      ? 'bg-green-500 w-4'
                      : 'bg-slate-700 w-4'
                }`}
              />
            ))}
            <span className="text-slate-500 text-xs ml-auto">
              {Object.keys(answers).length}/{questions.length} answered
            </span>
          </div>

          {/* Question card */}
          {questions[currentQ] && (
            <div className="mb-4">
              <QuizCard
                question={questions[currentQ]}
                selectedIds={answers[questions[currentQ].id] || []}
                onSelect={selectAnswer}
              />
            </div>
          )}

          {/* Quiz navigation */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setCurrentQ(prev => Math.max(0, prev - 1))}
              disabled={currentQ === 0}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 rounded-lg text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            {currentQ === questions.length - 1 ? (
              <button
                onClick={submitQuiz}
                disabled={submitting || Object.keys(answers).length < questions.length}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
              >
                {submitting
                  ? 'Submitting...'
                  : Object.keys(answers).length < questions.length
                    ? `Answer all (${Object.keys(answers).length}/${questions.length})`
                    : 'Submit Quiz ✓'
                }
              </button>
            ) : (
              <button
                onClick={() => setCurrentQ(prev => Math.min(questions.length - 1, prev + 1))}
                className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Next
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── RESULTS PHASE ─────────────────────────────────── */}
      {phase === PHASE.RESULTS && result && (
        <div className="space-y-5">
          {/* Score card */}
          <div className={`rounded-xl border p-8 text-center ${
            result.passed
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-red-500/10 border-red-500/30'
          }`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              result.passed ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}>
              {result.passed ? (
                <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <p className={`text-4xl font-bold mb-1 ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
              {result.score_pct}%
            </p>
            <p className={`font-semibold text-lg mb-2 ${result.passed ? 'text-green-300' : 'text-red-300'}`}>
              {result.passed ? 'You passed!' : 'Not quite — keep going.'}
            </p>
            <p className="text-slate-400 text-sm">
              Pass mark: {result.pass_score}% · Attempt {result.attempt_number} of {result.max_attempts}
            </p>
          </div>

          {/* Question breakdown */}
          {result.questions?.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h4 className="text-white font-semibold mb-3">Question Breakdown</h4>
              <div className="space-y-2">
                {result.questions.map((q, i) => (
                  <div key={q.id} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      q.isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}>
                      {q.isCorrect
                        ? <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        : <svg className="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                      }
                    </div>
                    <span className="text-slate-400 text-sm">Question {i + 1}</span>
                    <span className={`text-xs font-medium ml-auto ${q.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                      {q.isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            {result.can_retake && !result.passed && (
              <button
                onClick={retakeQuiz}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg py-2.5 text-sm transition-colors"
              >
                Retake Quiz
              </button>
            )}
            {result.passed && nextModule && (
              <Link
                href={`/modules/${nextModule.id}`}
                className="flex-1 bg-green-600 hover:bg-green-500 text-white font-medium rounded-lg py-2.5 text-sm transition-colors text-center"
              >
                Next Module: {nextModule.title} →
              </Link>
            )}
            <Link
              href="/modules"
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg py-2.5 text-sm transition-colors text-center"
            >
              All Modules
            </Link>
          </div>
        </div>
      )}

    </div>
  )
}