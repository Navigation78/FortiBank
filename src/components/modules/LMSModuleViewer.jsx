'use client'
// src/components/modules/LMSModuleViewer.jsx
// Professional, Cisco NetAcad-style LMS viewer.
// Enforced flow: subtopic content → 3-MCQ quiz → next subtopic → topic checkpoint → final exam

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, ChevronDown, ChevronRight, Check, Lock,
  Loader2, Target, BookOpen, AlertCircle,
} from 'lucide-react'
import VideoPlayer from '@/components/modules/VideoPlayer'
import QuizTimer from '@/components/quiz/QuizTimer'
import SafeExamBrowser from '@/components/quiz/SafeExamBrowser'
import QuizResultsCard from '@/components/quiz/QuizResultsCard'
import { useProgress } from '@/hooks/useProgress'
import { useAuth } from '@/hooks/useAuth'

// ─── Data helpers ─────────────────────────────────────────────────────────────

function groupTopics(content) {
  const sorted = [...content].sort((a, b) => a.order_index - b.order_index)
  if (!sorted.some(s => s.section_number)) {
    return [{ number: '1.0', title: 'Module Content', learningObjectives: [], pages: sorted }]
  }
  const topics = []
  let cur = null
  for (const sec of sorted) {
    const n = (sec.section_number || '').trim()
    if (/^\d+\.0$/.test(n)) {
      cur = { number: n, title: sec.title, learningObjectives: sec.learning_objectives || [], pages: [sec] }
      topics.push(cur)
    } else {
      if (!cur) { cur = { number: '1.0', title: 'Introduction', learningObjectives: [], pages: [] }; topics.push(cur) }
      cur.pages.push(sec)
    }
  }
  return topics.filter(t => t.pages.length > 0)
}

function buildNavPages(topics, checkpointQuizzes = [], finalExam = null) {
  const pages = []
  for (const topic of topics) {
    for (const section of topic.pages) {
      const sn = (section.section_number || '').trim()
      const isHeader = /^\d+\.0$/.test(sn)
      pages.push({
        type:           isHeader ? 'topic_header'
                      : section.content_type === 'knowledge_check' ? 'subtopic_quiz'
                      : 'subtopic',
        section,
        topicNumber:    topic.number,
        topicTitle:     topic.title,
        topicObjectives: topic.learningObjectives,
      })
    }
    const cp = checkpointQuizzes.find(q => q.section_number === topic.number)
    if (cp) pages.push({ type: 'checkpoint', quiz: cp, topicNumber: topic.number, topicTitle: topic.title })
  }
  if (finalExam) pages.push({ type: 'final_exam', quiz: finalExam })
  return pages
}

// Parse knowledge-check JSON: supports both single-question and multi-question formats
function parseKC(section) {
  try {
    const d = JSON.parse(section?.content_body || '{}')
    if (Array.isArray(d.questions)) return d.questions
    if (d.question) return [{ id: 'q1', text: d.question, options: d.options || [] }]
    return []
  } catch { return [] }
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({ topics, pages, pageIdx, highWaterMark, moduleTitle, durationMins, overallPct, onNavigate }) {
  const [expanded, setExpanded] = useState(() => new Set(topics.map(t => t.number)))

  function toggle(n) {
    setExpanded(prev => { const s = new Set(prev); s.has(n) ? s.delete(n) : s.add(n); return s })
  }

  function topicStatus(topicNum) {
    const idxs = pages.reduce((a, p, i) => p.topicNumber === topicNum ? [...a, i] : a, [])
    if (!idxs.length) return 'locked'
    const allDone = idxs.every(i => i <= highWaterMark - 1)
    const anyDone = idxs.some(i => i <= highWaterMark - 1)
    const cpIdx = pages.findIndex(p => p.type === 'checkpoint' && p.topicNumber === topicNum)
    const cpPassed = cpIdx !== -1 && cpIdx < highWaterMark
    if (cpPassed || (allDone && cpIdx === -1)) return 'complete'
    if (anyDone) return 'in_progress'
    return idxs[0] <= highWaterMark ? 'unlocked' : 'locked'
  }

  return (
    <nav
      className="w-64 flex-shrink-0 flex flex-col bg-th-bar border-r border-th-brd sticky top-0 self-start overflow-y-auto"
      style={{ height: 'calc(100vh - 56px)' }}
    >
      {/* Header */}
      <div className="p-4 border-b border-th-brd flex-shrink-0">
        <Link href="/modules" className="inline-flex items-center gap-1.5 text-th-muted hover:text-th-txt2 text-xs mb-3 transition-colors">
          <ArrowLeft className="w-3 h-3" /> All Modules
        </Link>
        <h2 className="text-th-txt text-sm font-semibold leading-snug mb-3">{moduleTitle}</h2>
        {durationMins && (
          <p className="text-th-muted text-xs mb-3">{durationMins} min estimated</p>
        )}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-th-muted">Progress</span>
            <span className="text-th-txt2 tabular-nums">{overallPct}%</span>
          </div>
          <div className="h-1 bg-th-track rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${overallPct >= 100 ? 'bg-green-500' : 'bg-blue-500'}`}
              style={{ width: `${overallPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Topic tree */}
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-px">
        {topics.map(topic => {
          const status     = topicStatus(topic.number)
          const isExpanded = expanded.has(topic.number)
          const isCurTopic = pages[pageIdx]?.topicNumber === topic.number
          const topicPageIdxs = pages.reduce((a, p, i) => p.topicNumber === topic.number ? [...a, i] : a, [])

          return (
            <div key={topic.number}>
              <button
                onClick={() => toggle(topic.number)}
                className={`w-full flex items-center gap-2 px-2.5 py-2 rounded text-left transition-colors ${isCurTopic ? 'bg-th-hov' : 'hover:bg-th-hov/50'}`}
              >
                <StatusDot status={status} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] text-th-muted flex-shrink-0">{topic.number}</span>
                    <span className={`text-xs font-medium truncate ${isCurTopic ? 'text-th-txt' : status === 'complete' ? 'text-th-txt2' : 'text-th-txt2'}`}>
                      {topic.title}
                    </span>
                  </div>
                </div>
                {status === 'locked' && <Lock className="w-3 h-3 text-th-muted flex-shrink-0" />}
                {status !== 'locked' && <ChevronDown className={`w-3 h-3 text-th-muted flex-shrink-0 transition-transform ${isExpanded ? '' : '-rotate-90'}`} />}
              </button>

              {isExpanded && status !== 'locked' && (
                <div className="ml-3 pl-3 border-l border-th-brd py-0.5 space-y-px">
                  {topic.pages.map((sec, si) => {
                    const gi = topicPageIdxs[si]
                    const accessible = gi <= highWaterMark
                    const isCurrent  = pageIdx === gi
                    const isDone     = gi < highWaterMark
                    const isKC       = sec.content_type === 'knowledge_check'

                    return (
                      <button
                        key={sec.id || si}
                        onClick={() => accessible && onNavigate(gi)}
                        disabled={!accessible}
                        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-colors ${
                          isCurrent ? 'bg-blue-600/15 text-blue-400'
                          : accessible ? 'text-th-muted hover:text-th-txt2 hover:bg-th-hov/50'
                          : 'text-th-muted opacity-40 cursor-not-allowed'
                        }`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-px ${
                          isCurrent ? 'bg-blue-400'
                          : isDone ? 'bg-green-500'
                          : accessible ? 'bg-th-brds'
                          : 'bg-th-track'
                        }`} />
                        {sec.section_number && (
                          <span className="font-mono text-[10px] text-th-muted flex-shrink-0">{sec.section_number}</span>
                        )}
                        <span className="text-xs truncate">
                          {isKC ? 'Quiz' : sec.title}
                        </span>
                        {isDone && !isCurrent && <Check className="w-3 h-3 text-green-500 flex-shrink-0 ml-auto" strokeWidth={3} />}
                        {!accessible && <Lock className="w-2.5 h-2.5 flex-shrink-0 ml-auto" />}
                      </button>
                    )
                  })}

                  {/* Checkpoint entry in sidebar */}
                  {(() => {
                    const cpIdx = pages.findIndex(p => p.type === 'checkpoint' && p.topicNumber === topic.number)
                    if (cpIdx === -1) return null
                    const accessible = cpIdx <= highWaterMark
                    const isCurrent  = pageIdx === cpIdx
                    const isDone     = cpIdx < highWaterMark
                    return (
                      <button
                        key="checkpoint"
                        onClick={() => accessible && onNavigate(cpIdx)}
                        disabled={!accessible}
                        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-colors ${
                          isCurrent ? 'bg-blue-600/15 text-blue-400'
                          : accessible ? 'text-th-muted hover:text-th-txt2 hover:bg-th-hov/50'
                          : 'text-th-muted opacity-40 cursor-not-allowed'
                        }`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-px ${isCurrent ? 'bg-blue-400' : isDone ? 'bg-green-500' : 'bg-th-brds'}`} />
                        <span className="text-xs truncate">Topic Checkpoint</span>
                        {isDone && <Check className="w-3 h-3 text-green-500 flex-shrink-0 ml-auto" strokeWidth={3} />}
                        {!accessible && <Lock className="w-2.5 h-2.5 flex-shrink-0 ml-auto" />}
                      </button>
                    )
                  })()}
                </div>
              )}
            </div>
          )
        })}

        {/* Final Exam entry */}
        {(() => {
          const feIdx = pages.findIndex(p => p.type === 'final_exam')
          if (feIdx === -1) return null
          const accessible = feIdx <= highWaterMark
          const isCurrent  = pageIdx === feIdx
          const isDone     = feIdx < highWaterMark
          return (
            <div className="mt-2 pt-2 border-t border-th-brd">
              <button
                onClick={() => accessible && onNavigate(feIdx)}
                disabled={!accessible}
                className={`w-full flex items-center gap-2 px-2.5 py-2 rounded text-left transition-colors ${
                  isCurrent ? 'bg-blue-600/15 text-blue-400'
                  : accessible ? 'text-th-txt2 hover:text-th-txt hover:bg-th-hov/50'
                  : 'text-th-muted opacity-40 cursor-not-allowed'
                }`}
              >
                <Target className={`w-3.5 h-3.5 flex-shrink-0 ${accessible ? 'text-blue-400' : 'text-th-muted'}`} />
                <span className="text-xs font-medium">Final Exam</span>
                {isDone && <Check className="w-3 h-3 text-green-500 flex-shrink-0 ml-auto" strokeWidth={3} />}
                {!accessible && <Lock className="w-3 h-3 text-th-muted flex-shrink-0 ml-auto" />}
              </button>
            </div>
          )
        })()}
      </div>
    </nav>
  )
}

function StatusDot({ status, size = 'sm' }) {
  const sz = size === 'md' ? 'w-4 h-4' : 'w-3 h-3'
  if (status === 'complete') return (
    <div className={`${sz} rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0`}>
      <Check className="w-2 h-2 text-green-400" strokeWidth={3} />
    </div>
  )
  if (status === 'in_progress') return (
    <div className={`${sz} rounded-full border-2 border-blue-500 flex items-center justify-center flex-shrink-0`}>
      <div className="w-1 h-1 rounded-full bg-blue-500" />
    </div>
  )
  if (status === 'locked') return <div className={`${sz} rounded-full border border-th-track flex-shrink-0`} />
  return <div className={`${sz} rounded-full border border-th-brds flex-shrink-0`} />
}

// ─── Content renderer ─────────────────────────────────────────────────────────

function ContentRenderer({ section }) {
  if (!section) return null
  const { content_type, content_url, content_body, image_caption } = section

  if (content_type === 'video') return <VideoPlayer url={content_url} title={section.title} />

  if (content_type === 'pdf') return (
    <div className="space-y-3">
      <div className="aspect-[4/3] bg-th-hov rounded-lg overflow-hidden border border-th-brd">
        <iframe src={`${content_url}#toolbar=0&navpanes=0`} className="w-full h-full" title={section.title} />
      </div>
      <a href={content_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm transition-colors">
        Open PDF in new tab
      </a>
    </div>
  )

  if (content_type === 'image') return (
    <figure className="space-y-2">
      <div className="rounded-lg overflow-hidden border border-th-brd bg-th-hov flex items-center justify-center">
        <img src={content_url} alt={section.title} className="max-w-full object-contain" style={{ maxHeight: 480 }} />
      </div>
      {image_caption && <figcaption className="text-th-muted text-xs text-center italic">{image_caption}</figcaption>}
    </figure>
  )

  if (content_type === 'slides') return (
    <div className="aspect-video bg-th-hov rounded-lg overflow-hidden border border-th-brd">
      <iframe src={content_url} className="w-full h-full" title={section.title} allowFullScreen />
    </div>
  )

  if (content_type === 'text') return (
    <div
      className="prose prose-sm max-w-none text-th-txt2 leading-relaxed dark:prose-invert prose-headings:text-th-txt prose-headings:font-semibold prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-th-txt prose-code:bg-th-hov prose-code:text-blue-600 dark:prose-code:text-blue-300 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-ul:text-th-txt2 prose-ol:text-th-txt2 prose-blockquote:border-l-th-brds prose-blockquote:text-th-muted"
      dangerouslySetInnerHTML={{ __html: content_body }}
    />
  )

  return null
}

// ─── Subtopic quiz (3 embedded MCQs) ─────────────────────────────────────────

function SubtopicQuizPanel({ questions, onComplete }) {
  const [answers, setAnswers]   = useState({})
  const [revealed, setRevealed] = useState(false)
  const [done, setDone]         = useState(false)

  if (!questions?.length) {
    useEffect(() => { onComplete() }, [])
    return null
  }

  const allAnswered = questions.every(q => answers[q.id] !== undefined)

  function select(qId, optId) {
    if (revealed) return
    setAnswers(prev => ({ ...prev, [qId]: optId }))
  }

  function submit() {
    setRevealed(true)
    setDone(true)
    onComplete()
  }

  return (
    <div className="mt-10 border-t border-th-brd pt-8">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="w-4 h-4 text-th-muted" />
        <span className="text-th-muted text-xs font-semibold uppercase tracking-widest">Subtopic Quiz</span>
        <span className="text-th-muted text-xs opacity-60">— Answer all questions to continue</span>
      </div>

      <div className="space-y-8">
        {questions.map((q, qi) => {
          const sel = answers[q.id]
          const correct = q.options?.find(o => o.correct)

          return (
            <div key={q.id} className="space-y-3">
              <p className="text-th-txt text-sm font-medium leading-relaxed">
                <span className="text-th-muted font-mono mr-2">{qi + 1}.</span>{q.text || q.question}
              </p>
              <div className="space-y-2 pl-5">
                {(q.options || []).map(opt => {
                  const isSel = sel === opt.id
                  let cls = 'border-th-brd text-th-txt2 hover:border-th-brds hover:text-th-txt'
                  if (revealed) {
                    if (opt.correct)       cls = 'border-green-600/50 bg-green-500/[0.07] text-green-400'
                    else if (isSel)        cls = 'border-red-600/50 bg-red-500/[0.07] text-red-400'
                    else                   cls = 'border-th-brd text-th-muted opacity-50'
                  } else if (isSel) {
                    cls = 'border-blue-500/60 bg-blue-500/[0.08] text-th-txt'
                  }
                  return (
                    <button
                      key={opt.id}
                      onClick={() => select(q.id, opt.id)}
                      disabled={revealed}
                      className={`w-full text-left px-4 py-2.5 rounded border text-sm transition-colors ${cls} ${revealed ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      {opt.text}
                    </button>
                  )
                })}
              </div>
              {revealed && (
                <p className={`pl-5 text-xs leading-relaxed ${answers[q.id] === correct?.id ? 'text-green-400' : 'text-th-muted'}`}>
                  {answers[q.id] === correct?.id
                    ? 'Correct. '
                    : `Incorrect. The correct answer is: ${correct?.text}. `}
                  {correct?.explanation || ''}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {!revealed && (
        <button
          onClick={submit}
          disabled={!allAnswered}
          className="mt-6 px-5 py-2 bg-th-hov hover:bg-th-act disabled:opacity-40 disabled:cursor-not-allowed text-th-txt2 text-sm font-medium rounded border border-th-brd transition-colors"
        >
          {allAnswered ? 'Submit Quiz' : `Answer all questions (${Object.keys(answers).length}/${questions.length})`}
        </button>
      )}

      {revealed && done && (
        <div className="mt-6 flex items-center gap-2 text-green-400 text-sm">
          <Check className="w-4 h-4" strokeWidth={3} />
          Quiz complete. You may continue.
        </div>
      )}
    </div>
  )
}

// ─── Checkpoint quiz panel (loads from API) ───────────────────────────────────

function CheckpointQuizPanel({ quiz, onPass, onExhausted }) {
  const [state, setState] = useState('loading')
  const [questions, setQuestions]     = useState([])
  const [quizMeta, setQuizMeta]       = useState(null)
  const [currentQ, setCurrentQ]       = useState(0)
  const [answers, setAnswers]         = useState({})
  const [submitting, setSubmitting]   = useState(false)
  const [result, setResult]           = useState(null)
  const [attemptCount, setAttemptCount] = useState(0)

  useEffect(() => {
    fetch(`/api/quiz?quizId=${quiz.id}`)
      .then(r => r.json())
      .then(d => {
        setQuizMeta(d.quiz)
        setQuestions(d.questions || [])
        setState((d.attemptCount || 0) >= (d.quiz?.max_attempts || 3) ? 'exhausted' : 'ready')
      })
      .catch(() => setState('error'))
  }, [quiz.id])

  async function submit() {
    setSubmitting(true)
    const res  = await fetch('/api/quiz/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quiz_id: quiz.id, answers }),
    })
    const data = await res.json()
    setResult(data)
    setSubmitting(false)
    setState('submitted')
    if (data.passed) onPass()
    else if (!data.can_retake) onExhausted()
  }

  function retake() {
    setAnswers({})
    setCurrentQ(0)
    setResult(null)
    setAttemptCount(c => c + 1)
    setState('ready')
  }

  function select(qId, optId) {
    setAnswers(prev => ({ ...prev, [qId]: [optId] }))
  }

  const allAnswered = questions.every(q => answers[q.id]?.length > 0)

  if (state === 'loading') return (
    <div className="flex items-center gap-3 py-12 text-th-muted text-sm">
      <Loader2 className="w-4 h-4 animate-spin" /> Loading checkpoint…
    </div>
  )
  if (state === 'error') return (
    <div className="py-12 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
      <AlertCircle className="w-4 h-4" /> Failed to load checkpoint quiz.
    </div>
  )
  if (state === 'exhausted') return (
    <div className="py-8 space-y-4">
      <div className="flex items-center gap-2 text-amber-400 text-sm">
        <AlertCircle className="w-4 h-4" />
        Maximum attempts reached for this checkpoint.
      </div>
      <button onClick={onExhausted} className="px-5 py-2 bg-th-hov hover:bg-th-act text-th-txt2 border border-th-brd text-sm rounded transition-colors">
        Continue to next topic
      </button>
    </div>
  )

  if (state === 'submitted' && result) return (
    <div className="py-4">
      <QuizResultsCard
        result={{ ...result, max_attempts: quizMeta?.max_attempts || result.max_attempts }}
        isExam={false}
        onRetake={result.can_retake ? retake : null}
      />
      {result.passed && (
        <div className="mt-4 flex items-center gap-2 text-green-400 text-sm">
          <Check className="w-4 h-4" strokeWidth={3} />
          Next topic unlocked. Press Continue below.
        </div>
      )}
      {!result.passed && !result.can_retake && (
        <button
          onClick={onExhausted}
          className="mt-4 px-5 py-2 bg-th-hov hover:bg-th-act text-th-txt2 border border-th-brd text-sm rounded transition-colors"
        >
          Continue anyway
        </button>
      )}
    </div>
  )

  return (
    <div className="space-y-6 py-4">
      {/* Question nav dots */}
      <div className="flex items-center gap-1.5">
        {questions.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentQ(i)}
            className={`rounded-full transition-all ${
              i === currentQ ? 'w-5 h-1.5 bg-blue-400' : answers[questions[i]?.id] ? 'w-3 h-1.5 bg-green-500' : 'w-3 h-1.5 bg-th-track'
            }`}
          />
        ))}
        <span className="text-th-muted text-xs ml-auto tabular-nums">{Object.keys(answers).length}/{questions.length} answered</span>
      </div>

      {questions[currentQ] && (() => {
        const q = questions[currentQ]
        return (
          <div className="space-y-3">
            <p className="text-th-txt text-sm font-medium leading-relaxed">
              <span className="text-th-muted font-mono mr-2">{currentQ + 1}.</span>{q.question_text}
            </p>
            <div className="space-y-2">
              {(q.quiz_options || []).map(opt => {
                const isSel = answers[q.id]?.includes(opt.id)
                return (
                  <button
                    key={opt.id}
                    onClick={() => select(q.id, opt.id)}
                    className={`w-full text-left px-4 py-2.5 rounded border text-sm transition-colors ${
                      isSel ? 'border-blue-500/60 bg-blue-500/[0.08] text-th-txt'
                             : 'border-th-brd text-th-txt2 hover:border-th-brds hover:text-th-txt'
                    }`}
                  >
                    {opt.option_text}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })()}

      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setCurrentQ(p => Math.max(0, p - 1))}
          disabled={currentQ === 0}
          className="px-4 py-2 bg-th-hov hover:bg-th-act disabled:opacity-30 text-th-txt2 border border-th-brd rounded text-sm transition-colors"
        >
          Previous
        </button>
        {currentQ < questions.length - 1 ? (
          <button
            onClick={() => setCurrentQ(p => p + 1)}
            className="flex items-center gap-1.5 px-4 py-2 bg-th-hov hover:bg-th-act text-th-txt2 border border-th-brd rounded text-sm transition-colors"
          >
            Next <ChevronRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={submitting || !allAnswered}
            className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded text-sm font-medium transition-colors"
          >
            {submitting ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Submitting…</> : <><Check className="w-3.5 h-3.5" /> Submit Checkpoint</>}
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Final exam panel ─────────────────────────────────────────────────────────

function FinalExamPanel({ quiz, moduleId, onComplete, nextModule }) {
  const [state, setState]           = useState('loading')
  const [questions, setQuestions]   = useState([])
  const [meta, setMeta]             = useState(null)
  const [attemptCount, setAttemptCount] = useState(0)
  const [currentQ, setCurrentQ]     = useState(0)
  const [answers, setAnswers]       = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult]         = useState(null)
  const [timeLeft, setTimeLeft]     = useState(null)
  const [resetting, setResetting]   = useState(false)
  const timerRef   = useRef(null)
  const submittingRef = useRef(false)

  useEffect(() => {
    fetch(`/api/quiz?quizId=${quiz.id}`)
      .then(r => r.json())
      .then(d => {
        setMeta(d.quiz)
        setQuestions(d.questions || [])
        setAttemptCount(d.attemptCount || 0)
        if (d.quiz?.time_limit_mins) setTimeLeft(d.quiz.time_limit_mins * 60)
        setState((d.attemptCount || 0) >= (d.quiz?.max_attempts || 3) ? 'exhausted' : 'ready')
      })
      .catch(() => setState('error'))
  }, [quiz.id])

  useEffect(() => {
    if (state !== 'ready' || !timeLeft) return
    timerRef.current = setInterval(() => {
      setTimeLeft(p => {
        if (p <= 1) { clearInterval(timerRef.current); doSubmit(); return 0 }
        return p - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [state])

  const doSubmit = useCallback(async () => {
    if (submittingRef.current) return
    submittingRef.current = true
    setSubmitting(true)
    clearInterval(timerRef.current)
    const timeTaken = meta?.time_limit_mins ? (meta.time_limit_mins * 60) - (timeLeft || 0) : null
    const res = await fetch('/api/quiz/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quiz_id: quiz.id, answers, time_taken_secs: timeTaken }),
    })
    const data = await res.json()
    submittingRef.current = false
    setResult(data)
    setSubmitting(false)
    setState('submitted')
    if (data.passed) onComplete()
  }, [quiz.id, answers, meta, timeLeft, onComplete])

  function retake() {
    setAnswers({})
    setCurrentQ(0)
    setResult(null)
    if (meta?.time_limit_mins) setTimeLeft(meta.time_limit_mins * 60)
    setAttemptCount(c => c + 1)
    setState('ready')
  }

  async function handleRedoModule() {
    setResetting(true)
    await fetch('/api/progress/reset-module', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ module_id: moduleId, quiz_id: quiz.id }),
    })
    window.location.reload()
  }

  function select(qId, optId) {
    setAnswers(prev => ({ ...prev, [qId]: [optId] }))
  }

  const allAnswered = questions.every(q => answers[q.id]?.length > 0)

  if (state === 'loading') return (
    <div className="flex items-center gap-3 py-12 text-th-muted text-sm">
      <Loader2 className="w-4 h-4 animate-spin" /> Loading final exam…
    </div>
  )
  if (state === 'error') return (
    <div className="py-12 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
      <AlertCircle className="w-4 h-4" /> Failed to load exam.
    </div>
  )
  if (state === 'exhausted') return (
    <div className="py-8 space-y-4 max-w-md">
      <div className="flex items-center gap-2 text-amber-400 text-sm">
        <AlertCircle className="w-4 h-4" />
        All {meta?.max_attempts || 3} exam attempts used — you did not reach 80%.
      </div>
      <p className="text-th-muted text-sm">
        You need to redo the module content to unlock 3 fresh attempts.
      </p>
      <button
        onClick={handleRedoModule}
        disabled={resetting}
        className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
      >
        {resetting ? <Loader2 className="w-4 h-4 animate-spin" /> : <BookOpen className="w-4 h-4" />}
        {resetting ? 'Resetting…' : 'Redo Module'}
      </button>
    </div>
  )

  if (state === 'submitted' && result) return (
    <QuizResultsCard
      result={result}
      isExam={true}
      moduleId={moduleId}
      onRetake={result.can_retake ? retake : null}
      onRedoModule={!result.passed && !result.can_retake ? handleRedoModule : null}
      nextModule={nextModule}
    />
  )

  // ── Active exam (wrapped in safe browser) ────────────────────
  return (
    <SafeExamBrowser onForceSubmit={doSubmit}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-th-muted text-xs font-semibold uppercase tracking-widest mb-1">Final Exam</p>
            <h2 className="text-th-txt text-xl font-bold">{meta?.title}</h2>
            <p className="text-th-muted text-sm mt-1">
              Pass mark: {meta?.pass_score}% · Attempt {attemptCount + 1} of {meta?.max_attempts}
            </p>
          </div>
          <QuizTimer timeLeft={timeLeft} />
        </div>

        {/* Question dots */}
        <div className="flex items-center gap-1.5">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentQ(i)}
              className={`rounded-full transition-all ${
                i === currentQ ? 'w-5 h-1.5 bg-blue-400' : answers[questions[i]?.id] ? 'w-3 h-1.5 bg-green-500' : 'w-3 h-1.5 bg-th-track'
              }`}
            />
          ))}
          <span className="text-th-muted text-xs ml-auto tabular-nums">{Object.keys(answers).length}/{questions.length}</span>
        </div>

        {questions[currentQ] && (() => {
          const q = questions[currentQ]
          return (
            <div className="space-y-3">
              <p className="text-th-txt text-sm font-medium leading-relaxed">
                <span className="text-th-muted font-mono mr-2">{currentQ + 1}.</span>{q.question_text}
              </p>
              <div className="space-y-2">
                {(q.quiz_options || []).map(opt => {
                  const isSel = answers[q.id]?.includes(opt.id)
                  return (
                    <button
                      key={opt.id}
                      onClick={() => select(q.id, opt.id)}
                      className={`w-full text-left px-4 py-2.5 rounded border text-sm transition-colors ${
                        isSel ? 'border-blue-500/60 bg-blue-500/[0.08] text-th-txt'
                               : 'border-th-brd text-th-txt2 hover:border-th-brds hover:text-th-txt'
                      }`}
                    >
                      {opt.option_text}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })()}

        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => setCurrentQ(p => Math.max(0, p - 1))}
            disabled={currentQ === 0}
            className="px-4 py-2 bg-th-hov hover:bg-th-act disabled:opacity-30 text-th-txt2 border border-th-brd rounded text-sm transition-colors"
          >
            Previous
          </button>
          {currentQ < questions.length - 1 ? (
            <button
              onClick={() => setCurrentQ(p => p + 1)}
              className="flex items-center gap-1.5 px-4 py-2 bg-th-hov hover:bg-th-act text-th-txt2 border border-th-brd rounded text-sm transition-colors"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={doSubmit}
              disabled={submitting || !allAnswered}
              className="flex items-center gap-1.5 px-5 py-2 bg-green-700 hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded text-sm font-medium transition-colors"
            >
              {submitting ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Submitting…</> : <><Check className="w-3.5 h-3.5" /> Submit Exam</>}
            </button>
          )}
        </div>
      </div>
    </SafeExamBrowser>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function LMSModuleViewer({ module, nextModule }) {
  useAuth()
  const { startModule, updateProgress, completeModule } = useProgress()

  const topics     = useMemo(() => groupTopics(module.content || []), [module.content])
  const checkpoints = module.checkpointQuizzes || []
  const finalExam  = module.quiz || null
  const pages      = useMemo(() => buildNavPages(topics, checkpoints, finalExam), [topics, checkpoints, finalExam])

  const [pageIdx, setPageIdx]           = useState(0)
  const [highWaterMark, setHwm] = useState(() => {
    if (module.progress?.status === 'completed') return pages.length
    const savedPct = module.progress?.progress_pct || 0
    if (savedPct === 0) return 0
    return Math.max(0, Math.round((savedPct / 100) * pages.length))
  })
  const [kcComplete, setKcComplete]     = useState(() => new Set())
  const [moduleComplete, setModuleComplete] = useState(module.progress?.status === 'completed')
  const [sidebarOpen, setSidebarOpen]   = useState(true)
  const mainRef = useRef(null)
  const touchStartX = useRef(null)

  useEffect(() => {
    if (module.progress?.status === 'not_started') startModule(module.id)
  }, [])

  const savedPctRef = useRef(module.progress?.progress_pct || 0)
  useEffect(() => {
    if (!pages.length) return
    const pct = Math.round((Math.min(highWaterMark, pages.length) / pages.length) * 100)
    const effective = moduleComplete ? 100 : pct
    if (!moduleComplete && effective <= savedPctRef.current && effective !== 0) return
    updateProgress(module.id, effective)
    if (effective > savedPctRef.current) savedPctRef.current = effective
  }, [highWaterMark, moduleComplete])

  useEffect(() => { mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' }) }, [pageIdx])

  useEffect(() => {
    const page = pages[pageIdx]
    if (!page) return
    const isAutoUnlock = page.type === 'topic_header' || page.type === 'subtopic'
    if (isAutoUnlock) {
      setHwm(prev => Math.max(prev, pageIdx + 1))
    }
  }, [pageIdx, pages])

  const currentPage = pages[pageIdx]
  const overallPct  = pages.length > 0
    ? Math.round((Math.min(highWaterMark, pages.length) / pages.length) * 100)
    : moduleComplete ? 100 : 0

  const currentPageDone = (() => {
    if (!currentPage) return false
    const t = currentPage.type
    if (t === 'topic_header' || t === 'subtopic') return pageIdx < highWaterMark
    if (t === 'subtopic_quiz') return kcComplete.has(pageIdx)
    return pageIdx < highWaterMark
  })()

  function goToPage(idx) {
    if (idx < 0 || idx > highWaterMark) return
    setPageIdx(idx)
  }
  function goPrev() { goToPage(pageIdx - 1) }
  function goNext() {
    if (!currentPageDone) return
    if (pageIdx < pages.length - 1) goToPage(pageIdx + 1)
  }

  function onTouchStart(e) { touchStartX.current = e.touches[0].clientX }
  function onTouchEnd(e) {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 60) { diff > 0 ? goNext() : goPrev() }
    touchStartX.current = null
  }

  function onKcComplete() {
    setKcComplete(prev => new Set([...prev, pageIdx]))
    setHwm(prev => Math.max(prev, pageIdx + 1))
  }

  function onCheckpointPass() {
    setHwm(prev => Math.max(prev, pageIdx + 1))
  }

  function onCheckpointExhausted() {
    setHwm(prev => Math.max(prev, pageIdx + 1))
  }

  async function onFinalExamComplete() {
    await completeModule(module.id)
    setModuleComplete(true)
    setHwm(prev => Math.max(prev, pages.length))
  }

  if (pages.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-th-muted mb-2 text-sm">No content available.</p>
          <Link href="/modules" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm">Back to Modules</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-full bg-th-bg">

      {/* Sidebar */}
      {sidebarOpen && (
        <Sidebar
          topics={topics}
          pages={pages}
          pageIdx={pageIdx}
          highWaterMark={highWaterMark}
          moduleTitle={module.title}
          durationMins={module.duration_mins}
          overallPct={overallPct}
          onNavigate={goToPage}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-th-brd bg-th-bar sticky top-0 z-10 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(v => !v)}
            className="p-1.5 rounded text-th-muted hover:text-th-txt hover:bg-th-hov transition-colors flex-shrink-0"
            title={sidebarOpen ? 'Hide outline' : 'Show outline'}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </button>
          <span className="flex-1 text-th-txt text-sm font-medium truncate">{module.title}</span>
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <span className="text-th-muted text-xs tabular-nums hidden sm:block">{pageIdx + 1}/{pages.length}</span>
            <span className="text-th-muted text-xs tabular-nums hidden sm:block">{overallPct}%</span>
            <div className="w-20 h-1 bg-th-track rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${overallPct >= 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                style={{ width: `${overallPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content area */}
        <div
          ref={mainRef}
          className="flex-1 overflow-y-auto"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="max-w-3xl mx-auto px-6 py-10 pb-24">

            {/* ── Topic header / subtopic ─────────────────────────────────── */}
            {(currentPage.type === 'topic_header' || currentPage.type === 'subtopic') && (() => {
              const sec = currentPage.section
              return (
                <>
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-3">
                      {sec.section_number && (
                        <span className="font-mono text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
                          {sec.section_number}
                        </span>
                      )}
                      {currentPage.type === 'topic_header' && (
                        <span className="text-[11px] text-th-muted border border-th-brd px-2 py-0.5 rounded">
                          Topic Overview
                        </span>
                      )}
                    </div>
                    <h1 className="text-2xl font-bold text-th-txt leading-tight">{sec.title}</h1>
                    <p className="text-th-muted text-sm mt-1">{currentPage.topicNumber} · {currentPage.topicTitle}</p>
                  </div>

                  {currentPage.type === 'topic_header' && currentPage.topicObjectives?.length > 0 && (
                    <div className="mb-8 border border-th-brd rounded-lg p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="w-3.5 h-3.5 text-th-muted" />
                        <span className="text-th-muted text-xs font-semibold uppercase tracking-widest">Learning Objectives</span>
                      </div>
                      <p className="text-th-muted text-sm mb-3">After completing this topic you will be able to:</p>
                      <ul className="space-y-2">
                        {currentPage.topicObjectives.map((obj, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-th-txt2">
                            <span className="text-th-muted mt-0.5 flex-shrink-0">→</span>
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <ContentRenderer section={sec} />

                  <div className="flex items-center justify-between gap-3 mt-10 pt-6 border-t border-th-brd">
                    <button onClick={goPrev} disabled={pageIdx === 0} className="flex items-center gap-1.5 px-4 py-2 bg-th-hov hover:bg-th-act disabled:opacity-30 text-th-txt2 border border-th-brd rounded text-sm transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                      Previous
                    </button>
                    <button onClick={goNext} disabled={pageIdx >= pages.length - 1} className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white rounded text-sm font-medium transition-colors">
                      Continue <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              )
            })()}

            {/* ── Subtopic quiz ───────────────────────────────────────────── */}
            {currentPage.type === 'subtopic_quiz' && (() => {
              const questions = parseKC(currentPage.section)
              const isDone = kcComplete.has(pageIdx)
              return (
                <>
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      {currentPage.section.section_number && (
                        <span className="font-mono text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
                          {currentPage.section.section_number}
                        </span>
                      )}
                    </div>
                    <h1 className="text-2xl font-bold text-th-txt">{currentPage.section.title || 'Knowledge Check'}</h1>
                    <p className="text-th-muted text-sm mt-1">{currentPage.topicNumber} · {currentPage.topicTitle}</p>
                  </div>

                  <SubtopicQuizPanel
                    key={`kc-${pageIdx}`}
                    questions={questions}
                    onComplete={onKcComplete}
                  />

                  <div className="flex items-center justify-between gap-3 mt-10 pt-6 border-t border-th-brd">
                    <button onClick={goPrev} disabled={pageIdx === 0} className="flex items-center gap-1.5 px-4 py-2 bg-th-hov hover:bg-th-act disabled:opacity-30 text-th-txt2 border border-th-brd rounded text-sm transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                      Previous
                    </button>
                    <button
                      onClick={goNext}
                      disabled={!isDone || pageIdx >= pages.length - 1}
                      className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded text-sm font-medium transition-colors"
                    >
                      Continue <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              )
            })()}

            {/* ── Topic checkpoint ────────────────────────────────────────── */}
            {currentPage.type === 'checkpoint' && (
              <>
                <div className="mb-8">
                  <p className="text-th-muted text-xs font-semibold uppercase tracking-widest mb-2">Topic Checkpoint</p>
                  <h1 className="text-2xl font-bold text-th-txt">
                    {currentPage.topicNumber} · {currentPage.topicTitle}
                  </h1>
                  <p className="text-th-muted text-sm mt-2">
                    Complete this checkpoint to unlock the next topic. You must achieve the passing score to continue.
                  </p>
                </div>
                <CheckpointQuizPanel
                  key={`cp-${pageIdx}`}
                  quiz={currentPage.quiz}
                  onPass={() => { onCheckpointPass(); }}
                  onExhausted={onCheckpointExhausted}
                />
                <div className="flex items-center justify-between gap-3 mt-10 pt-6 border-t border-th-brd">
                  <button onClick={goPrev} disabled={pageIdx === 0} className="flex items-center gap-1.5 px-4 py-2 bg-th-hov hover:bg-th-act disabled:opacity-30 text-th-txt2 border border-th-brd rounded text-sm transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    Previous
                  </button>
                  <button
                    onClick={goNext}
                    disabled={pageIdx >= highWaterMark || pageIdx >= pages.length - 1}
                    className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded text-sm font-medium transition-colors"
                  >
                    Continue <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </>
            )}

            {/* ── Final exam ──────────────────────────────────────────────── */}
            {currentPage.type === 'final_exam' && (
              <>
                <div className="mb-8">
                  <p className="text-th-muted text-xs font-semibold uppercase tracking-widest mb-2">Final Exam</p>
                  <h1 className="text-2xl font-bold text-th-txt">{module.title}</h1>
                  <p className="text-th-muted text-sm mt-2">
                    This exam covers all topics in the module. You must pass to earn your completion certificate.
                  </p>
                </div>
                <FinalExamPanel
                  key={`fe-${pageIdx}`}
                  quiz={currentPage.quiz}
                  moduleId={module.id}
                  onComplete={onFinalExamComplete}
                  nextModule={nextModule}
                />
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
