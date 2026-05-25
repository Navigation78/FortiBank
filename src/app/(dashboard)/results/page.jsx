'use client'

// src/app/(dashboard)/results/page.jsx
// Full history of quiz attempts and phishing tests, with risk score summary.

import { useState, useEffect } from 'react'
import PageWrapper from '@/components/layout/PageWrapper'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useRole } from '@/hooks/useRole'
import { getRiskLevel } from '@/lib/riskCalculator'
import Link from 'next/link'

const TABS = ['Quiz & Exam Results', 'Phishing Tests']

export default function ResultsPage() {
  const supabase      = createClient()
  const { user }      = useAuth()
  const { role }      = useRole()
  const [tab, setTab] = useState(0)

  const [quizAttempts, setQuizAttempts]       = useState([])
  const [phishingTargets, setPhishingTargets] = useState([])
  const [riskScore, setRiskScore]             = useState(null)
  const [loading, setLoading]                 = useState(true)

  useEffect(() => {
    if (user) fetchAll()
  }, [user])

  async function fetchAll() {
    setLoading(true)
    const [quizRes, phishRes, riskRes] = await Promise.all([
      supabase
        .from('quiz_attempts')
        .select(`
          id, score_pct, passed, attempt_number, submitted_at, time_taken_secs,
          quizzes ( title, pass_score, quiz_type, modules ( title ) ),
          quiz_attempt_answers ( is_correct )
        `)
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false }),

      supabase
        .from('phishing_targets')
        .select(`
          id, result, sent_at, clicked_at, reported_at,
          phishing_campaigns ( name, email_subject )
        `)
        .eq('user_id', user.id)
        .order('sent_at', { ascending: false }),

      supabase
        .from('risk_scores')
        .select('composite_score, phishing_score, quiz_score, phishing_attempts, phishing_clicks, quizzes_taken, quizzes_passed, is_warning, is_critical, calculated_at')
        .eq('user_id', user.id)
        .order('calculated_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
    ])

    setQuizAttempts(quizRes.data || [])
    setPhishingTargets(phishRes.data || [])
    setRiskScore(riskRes.data || null)
    setLoading(false)
  }

  function formatDuration(secs) {
    if (!secs) return '-'
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}m ${s}s`
  }

  const compositeScore  = riskScore ? Math.round(riskScore.composite_score) : null
  const phishingScore   = riskScore ? Math.round(riskScore.phishing_score)  : null
  const quizScore       = riskScore ? Math.round(riskScore.quiz_score)      : null
  const riskLevel       = compositeScore !== null ? getRiskLevel(compositeScore, role) : null

  const phishClickRate  = riskScore && riskScore.phishing_attempts > 0
    ? Math.round((riskScore.phishing_clicks / riskScore.phishing_attempts) * 100)
    : 0
  const quizPassRate    = riskScore && riskScore.quizzes_taken > 0
    ? Math.round((riskScore.quizzes_passed / riskScore.quizzes_taken) * 100)
    : null

  return (
    <PageWrapper>

      {/* ── Risk Score Summary ─────────────────────────────────── */}
      {loading ? (
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 bg-th-hov border border-th-brd rounded-xl animate-pulse" />
          ))}
        </div>
      ) : riskScore ? (
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* Composite risk score */}
          <div className={`rounded-xl border p-5 ${riskLevel?.bgColor || 'bg-th-srf'} ${riskLevel?.borderColor || 'border-th-brd'}`}>
            <p className="text-th-muted text-xs mb-2 font-medium uppercase tracking-wide">Overall Risk Score</p>
            <div className="flex items-baseline gap-1">
              <span className={`text-4xl font-bold ${riskLevel?.textColor || 'text-th-txt'}`}>{compositeScore}</span>
              <span className="text-th-muted text-sm">/100</span>
            </div>
            <p className={`text-xs mt-1.5 font-medium ${riskLevel?.textColor || 'text-th-txt2'}`}>{riskLevel?.label || 'No data'}</p>
            <p className="text-th-muted text-xs mt-0.5">= (Phishing × 60%) + (Quiz × 40%)</p>
          </div>

          {/* Quiz performance */}
          <div className="rounded-xl border border-th-brd bg-th-srf p-5">
            <p className="text-th-muted text-xs mb-2 font-medium uppercase tracking-wide">Quiz Performance <span className="text-th-muted normal-case">(40% of risk)</span></p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-th-txt">{riskScore.quizzes_passed}</span>
              <span className="text-th-muted text-sm">/ {riskScore.quizzes_taken} passed</span>
            </div>
            {riskScore.quizzes_taken > 0 && (
              <>
                <div className="mt-3 h-1.5 bg-th-track rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${quizPassRate}%` }}
                  />
                </div>
                <p className="text-th-muted text-xs mt-1">{quizPassRate}% pass rate · quiz risk component: <span className="text-th-txt2">{quizScore}/100</span></p>
              </>
            )}
            {riskScore.quizzes_taken === 0 && (
              <p className="text-th-muted text-xs mt-1">No quizzes taken yet</p>
            )}
          </div>

          {/* Phishing tests */}
          <div className="rounded-xl border border-th-brd bg-th-srf p-5">
            <p className="text-th-muted text-xs mb-2 font-medium uppercase tracking-wide">Phishing Tests <span className="text-th-muted normal-case">(60% of risk)</span></p>
            <div className="flex items-baseline gap-1">
              <span className={`text-4xl font-bold ${riskScore.phishing_clicks > 0 ? 'text-red-600 dark:text-red-400' : 'text-th-txt'}`}>
                {riskScore.phishing_clicks}
              </span>
              <span className="text-th-muted text-sm">/ {riskScore.phishing_attempts} clicked</span>
            </div>
            {riskScore.phishing_attempts > 0 && (
              <>
                <div className="mt-3 h-1.5 bg-th-track rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full transition-all"
                    style={{ width: `${phishClickRate}%` }}
                  />
                </div>
                <p className="text-th-muted text-xs mt-1">{phishClickRate}% click rate · phishing risk component: <span className="text-th-txt2">{phishingScore}/100</span></p>
              </>
            )}
            {riskScore.phishing_attempts === 0 && (
              <p className="text-th-muted text-xs mt-1">No phishing tests sent yet</p>
            )}
          </div>

        </div>
      ) : null}

      {/* ── Tabs ───────────────────────────────────────────────── */}
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
            {i === 0 && quizAttempts.length > 0 && (
              <span className="ml-2 text-xs bg-th-hov text-th-muted px-1.5 py-0.5 rounded-full">
                {quizAttempts.length}
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

      {/* ── Quiz Results Tab ────────────────────────────────────── */}
      {tab === 0 && (
        <div>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-th-hov border border-th-brd rounded-xl animate-pulse" />
              ))}
            </div>
          ) : quizAttempts.length > 0 ? (
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
                  {quizAttempts.map((attempt, i) => {
                    const answers     = attempt.quiz_attempt_answers || []
                    const correct     = answers.filter(a => a.is_correct).length
                    const total       = answers.length
                    const hasFraction = total > 0
                    const isExam      = attempt.quizzes?.quiz_type === 'final_exam'
                    const quizTitle   = attempt.quizzes?.title   || 'Unknown Quiz'
                    const moduleTitle = attempt.quizzes?.modules?.title || null
                    return (
                      <tr key={attempt.id} className={`border-b border-th-brd last:border-0 ${i % 2 === 0 ? '' : 'bg-th-hov/50'}`}>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <p className="text-th-txt text-sm font-medium truncate max-w-44">{quizTitle}</p>
                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded flex-shrink-0 ${
                              isExam
                                ? 'bg-purple-500/15 text-purple-700 dark:text-purple-400'
                                : 'bg-blue-500/15 text-blue-700 dark:text-blue-400'
                            }`}>
                              {isExam ? 'EXAM' : 'QUIZ'}
                            </span>
                          </div>
                          {moduleTitle && (
                            <p className="text-th-muted text-xs truncate mt-0.5">{moduleTitle}</p>
                          )}
                        </td>
                        <td className="px-5 py-3 hidden sm:table-cell">
                          <span className="text-th-txt2 text-sm">#{attempt.attempt_number}</span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <span className={`font-bold text-sm tabular-nums ${attempt.passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              {attempt.score_pct}%
                            </span>
                            {hasFraction && (
                              <span className="text-th-muted text-xs tabular-nums">{correct}/{total}</span>
                            )}
                            <span className={`text-xs px-1.5 py-0.5 rounded ${
                              attempt.passed ? 'bg-green-500/15 text-green-700 dark:text-green-400' : 'bg-red-500/15 text-red-700 dark:text-red-400'
                            }`}>
                              {attempt.passed ? 'Pass' : 'Fail'}
                            </span>
                            {attempt.quizzes?.pass_score && (
                              <span className="text-th-muted text-xs hidden sm:inline">
                                (pass: {attempt.quizzes.pass_score}%)
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3 hidden md:table-cell">
                          <span className="text-th-txt2 text-sm">{formatDuration(attempt.time_taken_secs)}</span>
                        </td>
                        <td className="px-5 py-3 hidden lg:table-cell">
                          <span className="text-th-txt2 text-sm">
                            {new Date(attempt.submitted_at).toLocaleDateString('en-KE', { dateStyle: 'medium' })}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-th-txt2 font-medium">No quiz attempts yet</p>
              <Link href="/modules" className="text-blue-600 dark:text-blue-400 text-sm hover:text-blue-700 dark:hover:text-blue-300 mt-2 inline-block">
                Start a module →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* ── Phishing Tests Tab ──────────────────────────────────── */}
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
                          target.result === 'clicked'
                            ? 'bg-red-500/15 text-red-700 dark:text-red-400'
                            : target.result === 'reported'
                              ? 'bg-green-500/15 text-green-700 dark:text-green-400'
                              : target.result === 'opened'
                                ? 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400'
                                : 'bg-th-hov text-th-txt2'
                        }`}>
                          {target.result === 'clicked'  ? 'Clicked' :
                           target.result === 'reported' ? 'Reported' :
                           target.result === 'opened'   ? 'Opened' :
                           target.result === 'sent'     ? 'Received' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-5 py-3 hidden sm:table-cell">
                        <span className="text-th-txt2 text-sm">
                          {target.sent_at
                            ? new Date(target.sent_at).toLocaleDateString('en-KE', { dateStyle: 'medium' })
                            : '-'}
                        </span>
                      </td>
                      <td className="px-5 py-3 hidden md:table-cell">
                        <span className={`text-xs ${target.result === 'clicked' ? 'text-red-600 dark:text-red-400' : target.result === 'reported' ? 'text-green-600 dark:text-green-400' : 'text-th-muted'}`}>
                          {target.result === 'clicked'
                            ? '+risk (counted as click)'
                            : target.result === 'reported'
                              ? 'No impact (reported)'
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
