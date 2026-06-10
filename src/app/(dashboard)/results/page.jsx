'use client'

// src/app/(dashboard)/results/page.jsx

import { useState, useEffect } from 'react'
import PageWrapper from '@/components/layout/PageWrapper'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useRole } from '@/hooks/useRole'
import { getRiskLevel } from '@/lib/riskCalculator'
import Link from 'next/link'
import {
  ChevronDown, Check, X, Minus,
  BookOpen, Target, Trophy, AlertCircle,
} from 'lucide-react'

const TABS = ['Learning Results', 'Phishing Tests']

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-KE', { dateStyle: 'medium' })
}

function PassBadge({ passed, notAttempted = false, small = false }) {
  const sz = small ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5'
  if (notAttempted) return (
    <span className={`${sz} rounded font-medium bg-th-hov text-th-muted`}>
      Not attempted
    </span>
  )
  return passed ? (
    <span className={`${sz} rounded font-medium bg-green-500/15 text-green-700 dark:text-green-400`}>Pass</span>
  ) : (
    <span className={`${sz} rounded font-medium bg-red-500/15 text-red-700 dark:text-red-400`}>Fail</span>
  )
}

function ResultDot({ passed, notAttempted = false }) {
  if (notAttempted) return (
    <div className="w-5 h-5 rounded-full border border-th-brd flex items-center justify-center flex-shrink-0">
      <Minus className="w-2.5 h-2.5 text-th-muted" />
    </div>
  )
  return passed ? (
    <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center flex-shrink-0">
      <Check className="w-3 h-3 text-green-400" strokeWidth={3} />
    </div>
  ) : (
    <div className="w-5 h-5 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center flex-shrink-0">
      <X className="w-3 h-3 text-red-400" strokeWidth={3} />
    </div>
  )
}

// ─── Row components ───────────────────────────────────────────────────────────

function SubtopicRow({ subtopic }) {
  const r = subtopic.kc_result
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 border-b border-th-brd/50 last:border-0 hover:bg-th-hov/30 transition-colors">
      <ResultDot passed={r?.passed} notAttempted={!r} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          {subtopic.section_number && (
            <span className="font-mono text-[10px] text-blue-400 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded flex-shrink-0">
              {subtopic.section_number}
            </span>
          )}
          <span className="text-th-txt2 text-xs truncate">{subtopic.title}</span>
          <span className="text-[10px] bg-th-hov text-th-muted px-1.5 py-0.5 rounded flex-shrink-0">KC</span>
        </div>
      </div>
      {r ? (
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className={`text-xs font-semibold tabular-nums ${r.passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {r.correct_count}/{r.total_count}
            <span className="font-normal text-th-muted ml-1">({r.score_pct}%)</span>
          </span>
          <PassBadge passed={r.passed} small />
          <span className="text-th-muted text-[11px] hidden sm:block">{fmtDate(r.submitted_at)}</span>
        </div>
      ) : (
        <PassBadge notAttempted small />
      )}
    </div>
  )
}

function CheckpointRow({ quiz, result, attemptCount }) {
  const r = result
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-th-hov/20 border-b border-th-brd/50 last:border-0">
      <ResultDot passed={r?.passed} notAttempted={!r} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-th-txt2 text-xs font-medium">{quiz?.title || 'Topic Checkpoint'}</span>
          <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded flex-shrink-0">
            Checkpoint
          </span>
        </div>
        {r && attemptCount > 0 && (
          <p className="text-th-muted text-[11px] mt-0.5">
            {attemptCount} attempt{attemptCount > 1 ? 's' : ''} · pass mark {quiz?.pass_score ?? 70}%
          </p>
        )}
      </div>
      {r ? (
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className={`text-xs font-semibold tabular-nums ${r.passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {r.score_pct}%
          </span>
          <PassBadge passed={r.passed} small />
          <span className="text-th-muted text-[11px] hidden sm:block">{fmtDate(r.submitted_at)}</span>
        </div>
      ) : (
        <PassBadge notAttempted small />
      )}
    </div>
  )
}

function FinalExamRow({ quiz, result, attemptCount }) {
  const r = result
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-th-hov/10 border-t border-th-brd">
      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
        <Target className={`w-4 h-4 ${r ? (r.passed ? 'text-green-400' : 'text-red-400') : 'text-th-muted'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-th-txt text-sm font-semibold">Final Exam</span>
          <span className="text-[10px] bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 px-1.5 py-0.5 rounded flex-shrink-0">
            Exam
          </span>
        </div>
        <p className="text-th-muted text-[11px] mt-0.5">
          {r
            ? `${attemptCount} attempt${attemptCount > 1 ? 's' : ''} · pass mark ${quiz?.pass_score ?? r.pass_score ?? 80}%`
            : `Pass mark: ${quiz?.pass_score ?? 80}% · ${quiz?.max_attempts ?? 3} attempts allowed`}
        </p>
      </div>
      {r ? (
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className={`text-sm font-bold tabular-nums ${r.passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {r.score_pct}%
          </span>
          <PassBadge passed={r.passed} />
          <span className="text-th-muted text-xs hidden sm:block">{fmtDate(r.submitted_at)}</span>
        </div>
      ) : (
        <PassBadge notAttempted />
      )}
    </div>
  )
}

function TopicSection({ topic }) {
  const hasContent = topic.subtopics.length > 0 || topic.checkpoint_quiz
  if (!hasContent) return null

  return (
    <div className="border-b border-th-brd last:border-0">
      <div className="flex items-center gap-2 px-4 py-2 bg-th-hov/40">
        <span className="font-mono text-[10px] text-th-muted bg-th-hov px-1.5 py-0.5 rounded border border-th-brd">
          {topic.number}
        </span>
        <span className="text-th-txt2 text-xs font-semibold uppercase tracking-wide truncate">{topic.title}</span>
      </div>
      {topic.subtopics.map(sub => (
        <SubtopicRow key={sub.content_id || sub.section_number} subtopic={sub} />
      ))}
      {topic.checkpoint_quiz && (
        <CheckpointRow
          quiz={topic.checkpoint_quiz}
          result={topic.checkpoint_result}
          attemptCount={topic.checkpoint_attempt_count}
        />
      )}
    </div>
  )
}

// ─── Module result card ───────────────────────────────────────────────────────

function ModuleResultCard({ module }) {
  const [expanded, setExpanded] = useState(true)

  const hasTopicContent = module.topics.some(t => t.subtopics.length > 0 || t.checkpoint_quiz)
  const hasAnyContent   = hasTopicContent || module.final_exam_quiz

  const statusLabel = module.status === 'completed' ? 'Completed'
    : module.status === 'in_progress'               ? 'In Progress'
    : 'Not Started'

  const statusClass = module.status === 'completed'
    ? 'bg-green-500/15 text-green-700 dark:text-green-400'
    : module.status === 'in_progress'
      ? 'bg-blue-500/15 text-blue-700 dark:text-blue-400'
      : 'bg-th-hov text-th-muted'

  return (
    <div className="bg-th-srf border border-th-brd rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-th-hov/30 transition-colors text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-th-txt font-semibold text-sm truncate">{module.title}</span>
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${statusClass}`}>{statusLabel}</span>
            {module.final_exam_result?.passed && (
              <span className="flex items-center gap-1 text-[10px] font-medium text-amber-600 dark:text-amber-400">
                <Trophy className="w-3 h-3" /> Passed
              </span>
            )}
          </div>
          <div className="mt-2 flex items-center gap-3">
            <div className="flex-1 max-w-48 h-1.5 bg-th-track rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${module.progress_pct >= 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                style={{ width: `${module.progress_pct}%` }}
              />
            </div>
            <span className="text-th-muted text-xs tabular-nums">{module.progress_pct}%</span>
            {module.final_exam_result && (
              <span className="text-th-muted text-xs">
                Final: <span className={`font-semibold ${module.final_exam_result.passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {module.final_exam_result.score_pct}%
                </span>
              </span>
            )}
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-th-muted flex-shrink-0 transition-transform duration-150 ${expanded ? '' : '-rotate-90'}`} />
      </button>

      {expanded && (
        <div className="border-t border-th-brd">
          {hasAnyContent ? (
            <>
              {module.topics.map(topic => (
                <TopicSection key={topic.number} topic={topic} />
              ))}
              {module.final_exam_quiz && (
                <FinalExamRow
                  quiz={module.final_exam_quiz}
                  result={module.final_exam_result}
                  attemptCount={module.final_exam_attempt_count}
                />
              )}
            </>
          ) : (
            <div className="px-5 py-5 text-th-muted text-sm">No quiz content found for this module.</div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Fallback flat table (shown when structured API returns nothing) ───────────

function FallbackAttemptsTable({ attempts }) {
  function formatDuration(secs) {
    if (!secs) return '-'
    return `${Math.floor(secs / 60)}m ${secs % 60}s`
  }

  return (
    <div>
      <div className="flex items-start gap-2 mb-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-sm">
        <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="text-th-txt2">
          <p className="font-medium">Showing raw quiz attempts</p>
          <p className="text-th-muted text-xs mt-0.5">
            Showing your checkpoint and exam quiz history. Subtopic knowledge check results
            will appear here once the system is updated and those quizzes are retaken.
          </p>
        </div>
      </div>
      <div className="bg-th-srf border border-th-brd rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-th-brd">
              <th className="text-left text-th-muted text-xs font-medium px-5 py-3">Quiz</th>
              <th className="text-left text-th-muted text-xs font-medium px-5 py-3 hidden sm:table-cell">Attempt</th>
              <th className="text-left text-th-muted text-xs font-medium px-5 py-3">Score</th>
              <th className="text-left text-th-muted text-xs font-medium px-5 py-3 hidden md:table-cell">Duration</th>
              <th className="text-left text-th-muted text-xs font-medium px-5 py-3 hidden lg:table-cell">Date</th>
            </tr>
          </thead>
          <tbody>
            {attempts.map((attempt, i) => {
              const answers   = attempt.quiz_attempt_answers || []
              const correct   = answers.filter(a => a.is_correct).length
              const total     = answers.length
              const isExam    = attempt.quizzes?.quiz_type === 'final_exam'
              const quizTitle = attempt.quizzes?.title    || 'Unknown Quiz'
              const modTitle  = attempt.quizzes?.modules?.title || null
              return (
                <tr key={attempt.id} className={`border-b border-th-brd last:border-0 ${i % 2 === 0 ? '' : 'bg-th-hov/50'}`}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <p className="text-th-txt text-sm font-medium truncate max-w-44">{quizTitle}</p>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded flex-shrink-0 ${
                        isExam ? 'bg-purple-500/15 text-purple-700 dark:text-purple-400'
                               : 'bg-blue-500/15 text-blue-700 dark:text-blue-400'
                      }`}>
                        {isExam ? 'EXAM' : 'QUIZ'}
                      </span>
                    </div>
                    {modTitle && <p className="text-th-muted text-xs truncate mt-0.5">{modTitle}</p>}
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    <span className="text-th-txt2 text-sm">#{attempt.attempt_number}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-sm tabular-nums ${attempt.passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {attempt.score_pct}%
                      </span>
                      {total > 0 && <span className="text-th-muted text-xs tabular-nums">{correct}/{total}</span>}
                      <PassBadge passed={attempt.passed} small />
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <span className="text-th-txt2 text-sm">{formatDuration(attempt.time_taken_secs)}</span>
                  </td>
                  <td className="px-5 py-3 hidden lg:table-cell">
                    <span className="text-th-txt2 text-sm">{fmtDate(attempt.submitted_at)}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ResultsPage() {
  const supabase = createClient()
  const { user } = useAuth()
  const { role } = useRole()

  const [tab,            setTab]            = useState(0)
  const [moduleResults,  setModuleResults]  = useState([])
  const [quizAttempts,   setQuizAttempts]   = useState([])
  const [phishingTargets,setPhishingTargets]= useState([])
  const [riskScore,      setRiskScore]      = useState(null)
  const [loading,        setLoading]        = useState(true)
  const [loadingModules, setLoadingModules] = useState(false)
  const [modulesError,   setModulesError]   = useState(null)
  const [attemptsError,  setAttemptsError]  = useState(null)

  useEffect(() => {
    if (user) fetchAll()
  }, [user])

  async function fetchAll() {
    setLoading(true)

    // Fetch phishing, risk score, AND raw quiz attempts in parallel
    const [phishRes, riskRes, attemptsRes] = await Promise.all([
      supabase
        .from('phishing_targets')
        .select(`id, result, sent_at, phishing_campaigns ( name, email_subject )`)
        .eq('user_id', user.id)
        .order('sent_at', { ascending: false }),

      supabase
        .from('risk_scores')
        .select('composite_score, phishing_score, quiz_score, phishing_attempts, phishing_clicks, quizzes_taken, quizzes_passed, quizzes_assigned, is_warning, is_critical, calculated_at')
        .eq('user_id', user.id)
        .order('calculated_at', { ascending: false })
        .limit(1)
        .maybeSingle(),

      supabase
        .from('quiz_attempts')
        .select(`
          id, score_pct, passed, attempt_number, submitted_at, time_taken_secs,
          quizzes ( title, pass_score, quiz_type, modules ( title ) ),
          quiz_attempt_answers ( is_correct )
        `)
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false }),
    ])

    setPhishingTargets(phishRes.data || [])
    setRiskScore(riskRes.data || null)
    setQuizAttempts(attemptsRes.data || [])
    if (attemptsRes.error) setAttemptsError(attemptsRes.error.message)
    setLoading(false)

    // Fetch structured module results (server-side API, uses admin client)
    setLoadingModules(true)
    setModulesError(null)
    try {
      const modRes = await fetch('/api/results/modules')
      if (modRes.ok) {
        const data = await modRes.json()
        setModuleResults(data.modules || [])
      } else {
        const errBody = await modRes.json().catch(() => ({}))
        setModulesError(errBody.error || `HTTP ${modRes.status}`)
      }
    } catch (err) {
      setModulesError(err.message || 'Network error')
    } finally {
      setLoadingModules(false)
    }
  }

  // Decide what to show in the Learning Results tab
  const showHierarchical  = moduleResults.length > 0
  const showFallbackTable = !showHierarchical && quizAttempts.length > 0
  const showEmpty         = !showHierarchical && !showFallbackTable

  const compositeScore = riskScore ? Math.round(riskScore.composite_score) : null
  const phishingScore  = riskScore ? Math.round(riskScore.phishing_score)  : null
  const quizScore      = riskScore ? Math.round(riskScore.quiz_score)      : null
  const riskLevel      = compositeScore !== null ? getRiskLevel(compositeScore, role) : null

  // Phishing: 3-strike system — max risk at 3 clicks
  const phishingStrikes    = riskScore ? Math.min(riskScore.phishing_clicks, 3) : 0
  const phishingStrikeRate = Math.round((phishingStrikes / 3) * 100)

  // Quiz: denominator is total quizzes assigned to the user's role
  const quizDenominator = riskScore
    ? (riskScore.quizzes_assigned > 0 ? riskScore.quizzes_assigned : riskScore.quizzes_taken)
    : 0
  const quizPassRate = riskScore && quizDenominator > 0
    ? Math.round((riskScore.quizzes_passed / quizDenominator) * 100) : null

  return (
    <PageWrapper>

      {/* Risk Score Summary */}
      {loading ? (
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 bg-th-hov border border-th-brd rounded-xl animate-pulse" />
          ))}
        </div>
      ) : riskScore ? (
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className={`rounded-xl border p-5 ${riskLevel?.bgColor || 'bg-th-srf'} ${riskLevel?.borderColor || 'border-th-brd'}`}>
            <p className="text-th-muted text-xs mb-2 font-medium uppercase tracking-wide">Overall Risk Score</p>
            <div className="flex items-baseline gap-1">
              <span className={`text-4xl font-bold ${riskLevel?.textColor || 'text-th-txt'}`}>{compositeScore}</span>
              <span className="text-th-muted text-sm">/100</span>
            </div>
            <p className={`text-xs mt-1.5 font-medium ${riskLevel?.textColor || 'text-th-txt2'}`}>{riskLevel?.label || 'No data'}</p>
            <p className="text-th-muted text-xs mt-0.5">= (Quiz x 60%) + (Phishing x 40%)</p>
          </div>

          <div className="rounded-xl border border-th-brd bg-th-srf p-5">
            <p className="text-th-muted text-xs mb-2 font-medium uppercase tracking-wide">Quiz Performance <span className="normal-case">(60% of risk)</span></p>
            <div className="flex items-baseline gap-1">
              <span className={`text-4xl font-bold ${quizPassRate !== null && quizPassRate < 70 ? 'text-red-600 dark:text-red-400' : 'text-th-txt'}`}>
                {riskScore.quizzes_passed}
              </span>
              <span className="text-th-muted text-sm">/ {quizDenominator} passed</span>
            </div>
            {quizDenominator > 0 && (
              <>
                <div className="mt-3 h-1.5 bg-th-track rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${quizPassRate !== null && quizPassRate >= 70 ? 'bg-green-500' : 'bg-blue-500'}`}
                    style={{ width: `${quizPassRate ?? 0}%` }}
                  />
                </div>
                <p className="text-th-muted text-xs mt-1">
                  {quizPassRate ?? 0}% pass rate
                  {quizPassRate !== null && quizPassRate < 70 && (
                    <span className="text-red-500 dark:text-red-400 ml-1">· below 70% target</span>
                  )}
                  {' · '}quiz risk: <span className="text-th-txt2">{quizScore}/100</span>
                </p>
              </>
            )}
            {quizDenominator === 0 && <p className="text-th-muted text-xs mt-1">No quizzes assigned yet</p>}
          </div>

          <div className="rounded-xl border border-th-brd bg-th-srf p-5">
            <p className="text-th-muted text-xs mb-2 font-medium uppercase tracking-wide">Phishing Tests <span className="normal-case">(40% of risk)</span></p>
            <div className="flex items-baseline gap-1">
              <span className={`text-4xl font-bold ${riskScore.phishing_clicks >= 3 ? 'text-red-600 dark:text-red-400' : riskScore.phishing_clicks > 0 ? 'text-orange-500 dark:text-orange-400' : 'text-th-txt'}`}>
                {riskScore.phishing_clicks}
              </span>
              <span className="text-th-muted text-sm">/ 3 strikes</span>
            </div>
            {riskScore.phishing_attempts > 0 ? (
              <>
                <div className="mt-3 flex gap-1.5">
                  {[1, 2, 3].map(n => (
                    <div
                      key={n}
                      className={`flex-1 h-1.5 rounded-full transition-all ${
                        riskScore.phishing_clicks >= n
                          ? riskScore.phishing_clicks >= 3 ? 'bg-red-500' : 'bg-orange-400'
                          : 'bg-th-track'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-th-muted text-xs mt-1">
                  {riskScore.phishing_clicks === 0 && 'No clicks — well done'}
                  {riskScore.phishing_clicks === 1 && '1 strike · Phishing module reset'}
                  {riskScore.phishing_clicks === 2 && '2 strikes · Phishing module reset'}
                  {riskScore.phishing_clicks >= 3 && 'Critical — 3 strikes reached'}
                  {' · '}phishing risk: <span className="text-th-txt2">{phishingScore}/100</span>
                </p>
              </>
            ) : (
              <p className="text-th-muted text-xs mt-1">No phishing tests sent yet</p>
            )}
          </div>
        </div>
      ) : null}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-th-brd">
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all duration-150 -mb-px ${
              tab === i
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-th-muted hover:text-th-txt2'
            }`}
          >
            {t}
            {i === 0 && (moduleResults.length > 0 || quizAttempts.length > 0) && (
              <span className="ml-2 text-xs bg-th-hov text-th-muted px-1.5 py-0.5 rounded-full">
                {moduleResults.length > 0 ? moduleResults.length : quizAttempts.length}
              </span>
            )}
            {i === 1 && phishingTargets.length > 0 && (
              <span className="ml-2 text-xs bg-th-hov text-th-muted px-1.5 py-0.5 rounded-full">
                {phishingTargets.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Learning Results tab */}
      {tab === 0 && (
        <div>
          {(loading || loadingModules) ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-th-hov border border-th-brd rounded-xl animate-pulse" />
              ))}
            </div>
          ) : showHierarchical ? (
            <div className="space-y-4">
              {/* Legend */}
              <div className="flex items-center gap-5 text-[11px] text-th-muted px-1 pb-1 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Pass
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Fail
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-th-brds inline-block" /> Not attempted
                </span>
                <span className="ml-auto text-[10px]">
                  <span className="bg-th-hov px-1.5 py-0.5 rounded">KC</span> = Knowledge Check (subtopic quiz)
                </span>
              </div>
              {moduleResults.map(mod => (
                <ModuleResultCard key={mod.id} module={mod} />
              ))}
            </div>
          ) : showFallbackTable ? (
            <FallbackAttemptsTable attempts={quizAttempts} />
          ) : (
            <div className="text-center py-16">
              <BookOpen className="w-8 h-8 text-th-muted mx-auto mb-3" />
              <p className="text-th-txt2 font-medium">No quiz results yet</p>
              <p className="text-th-muted text-sm mt-1 max-w-sm mx-auto">
                Complete a checkpoint quiz or the final exam inside a module to see your results here.
              </p>
              <Link href="/modules" className="text-blue-600 dark:text-blue-400 text-sm hover:underline mt-3 inline-block">
                Go to Modules
              </Link>
              {(modulesError || attemptsError) && (
                <div className="mt-5 text-left max-w-sm mx-auto space-y-1.5">
                  {modulesError && (
                    <p className="text-red-500 text-xs font-mono bg-red-500/10 px-3 py-2 rounded">
                      Results API: {modulesError}
                    </p>
                  )}
                  {attemptsError && (
                    <p className="text-red-500 text-xs font-mono bg-red-500/10 px-3 py-2 rounded">
                      Attempts query: {attemptsError}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Phishing Tests tab */}
      {tab === 1 && (
        <div>
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-th-hov border border-th-brd rounded-xl animate-pulse" />
              ))}
            </div>
          ) : phishingTargets.length > 0 ? (
            <div className="bg-th-srf border border-th-brd rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-th-brd">
                    <th className="text-left text-th-muted text-xs font-medium px-5 py-3">Campaign</th>
                    <th className="text-left text-th-muted text-xs font-medium px-5 py-3">Result</th>
                    <th className="text-left text-th-muted text-xs font-medium px-5 py-3 hidden sm:table-cell">Date</th>
                    <th className="text-left text-th-muted text-xs font-medium px-5 py-3 hidden md:table-cell">Impact on Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {phishingTargets.map((target, i) => (
                    <tr key={target.id} className={`border-b border-th-brd last:border-0 ${i % 2 === 0 ? '' : 'bg-th-hov/50'}`}>
                      <td className="px-5 py-3">
                        <p className="text-th-txt text-sm font-medium truncate max-w-48">
                          {target.phishing_campaigns?.name || 'Phishing Simulation'}
                        </p>
                        <p className="text-th-muted text-xs truncate">
                          {target.phishing_campaigns?.email_subject || 'Subject hidden'}
                        </p>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
                          target.result === 'clicked'  ? 'bg-red-500/15 text-red-700 dark:text-red-400'
                          : target.result === 'reported' ? 'bg-green-500/15 text-green-700 dark:text-green-400'
                          : target.result === 'opened'   ? 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400'
                          : 'bg-th-hov text-th-txt2'
                        }`}>
                          {target.result === 'clicked'  ? 'Clicked'
                          : target.result === 'reported' ? 'Reported'
                          : target.result === 'opened'   ? 'Opened'
                          : target.result === 'sent'     ? 'Received' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-5 py-3 hidden sm:table-cell">
                        <span className="text-th-txt2 text-sm">
                          {target.sent_at ? new Date(target.sent_at).toLocaleDateString('en-KE', { dateStyle: 'medium' }) : '-'}
                        </span>
                      </td>
                      <td className="px-5 py-3 hidden md:table-cell">
                        <span className={`text-xs ${target.result === 'clicked' ? 'text-red-600 dark:text-red-400' : target.result === 'reported' ? 'text-green-600 dark:text-green-400' : 'text-th-muted'}`}>
                          {target.result === 'clicked' ? '+risk · strike counted · module reset'
                          : target.result === 'reported' ? 'No impact (reported)'
                          : 'No impact'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-th-txt2 font-medium">No phishing tests yet</p>
              <p className="text-th-muted text-sm mt-1">Your organization has not sent any phishing tests yet.</p>
            </div>
          )}
        </div>
      )}

    </PageWrapper>
  )
}
