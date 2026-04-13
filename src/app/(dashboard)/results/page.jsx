'use client'

// src/app/(dashboard)/results/page.jsx
// Full history of quiz attempts and phishing tests

import { useState, useEffect } from 'react'
import Topbar from '@/components/layout/Topbar'
import PageWrapper from '@/components/layout/PageWrapper'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'

const TABS = ['Quiz Results', 'Phishing Tests']

export default function ResultsPage() {
  const supabase      = createClient()
  const { user }      = useAuth()
  const [tab, setTab] = useState(0)

  const [quizAttempts, setQuizAttempts]   = useState([])
  const [phishingTargets, setPhishingTargets] = useState([])
  const [loading, setLoading]             = useState(true)

  useEffect(() => {
    if (user) fetchAll()
  }, [user])

  async function fetchAll() {
    setLoading(true)
    const [quizRes, phishRes] = await Promise.all([
      supabase
        .from('quiz_attempts')
        .select(`
          id, score_pct, passed, attempt_number, submitted_at, time_taken_secs,
          quizzes ( title, pass_score, modules ( title ) )
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
    ])

    setQuizAttempts(quizRes.data || [])
    setPhishingTargets(phishRes.data || [])
    setLoading(false)
  }

  function formatDuration(secs) {
    if (!secs) return '—'
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}m ${s}s`
  }

  return (
    <>
      <Topbar title="My Results" />
      <PageWrapper>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-800">
          {TABS.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                tab === i
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Quiz Results Tab */}
        {tab === 0 && (
          <div>
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-slate-900 border border-slate-800 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : quizAttempts.length > 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="text-left text-slate-500 text-xs font-medium px-5 py-3">Module / Quiz</th>
                      <th className="text-left text-slate-500 text-xs font-medium px-5 py-3 hidden sm:table-cell">Attempt</th>
                      <th className="text-left text-slate-500 text-xs font-medium px-5 py-3">Score</th>
                      <th className="text-left text-slate-500 text-xs font-medium px-5 py-3 hidden md:table-cell">Duration</th>
                      <th className="text-left text-slate-500 text-xs font-medium px-5 py-3 hidden lg:table-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizAttempts.map((attempt, i) => (
                      <tr key={attempt.id} className={`border-b border-slate-800 last:border-0 ${i % 2 === 0 ? '' : 'bg-slate-900/50'}`}>
                        <td className="px-5 py-3">
                          <p className="text-white text-sm font-medium truncate max-w-48">
                            {attempt.quizzes?.modules?.title || 'Unknown Module'}
                          </p>
                          <p className="text-slate-500 text-xs truncate">
                            {attempt.quizzes?.title}
                          </p>
                        </td>
                        <td className="px-5 py-3 hidden sm:table-cell">
                          <span className="text-slate-400 text-sm">#{attempt.attempt_number}</span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <span className={`font-bold text-sm ${attempt.passed ? 'text-green-400' : 'text-red-400'}`}>
                              {attempt.score_pct}%
                            </span>
                            <span className={`text-xs px-1.5 py-0.5 rounded ${
                              attempt.passed ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'
                            }`}>
                              {attempt.passed ? 'Pass' : 'Fail'}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3 hidden md:table-cell">
                          <span className="text-slate-400 text-sm">{formatDuration(attempt.time_taken_secs)}</span>
                        </td>
                        <td className="px-5 py-3 hidden lg:table-cell">
                          <span className="text-slate-400 text-sm">
                            {new Date(attempt.submitted_at).toLocaleDateString('en-KE', { dateStyle: 'medium' })}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-slate-400 font-medium">No quiz attempts yet</p>
                <Link href="/modules" className="text-blue-400 text-sm hover:text-blue-300 mt-2 inline-block">
                  Start a module →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Phishing Tests Tab */}
        {tab === 1 && (
          <div>
            {loading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-16 bg-slate-900 border border-slate-800 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : phishingTargets.length > 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="text-left text-slate-500 text-xs font-medium px-5 py-3">Campaign</th>
                      <th className="text-left text-slate-500 text-xs font-medium px-5 py-3">Result</th>
                      <th className="text-left text-slate-500 text-xs font-medium px-5 py-3 hidden sm:table-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {phishingTargets.map((target, i) => (
                      <tr key={target.id} className={`border-b border-slate-800 last:border-0 ${i % 2 === 0 ? '' : 'bg-slate-900/50'}`}>
                        <td className="px-5 py-3">
                          <p className="text-white text-sm font-medium truncate max-w-48">
                            {target.phishing_campaigns?.name || 'Simulation'}
                          </p>
                          <p className="text-slate-500 text-xs truncate">
                            {target.phishing_campaigns?.email_subject}
                          </p>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
                            target.result === 'clicked'
                              ? 'bg-red-500/15 text-red-400'
                              : target.result === 'reported'
                                ? 'bg-green-500/15 text-green-400'
                                : target.result === 'opened'
                                  ? 'bg-yellow-500/15 text-yellow-400'
                                  : 'bg-slate-700 text-slate-400'
                          }`}>
                            {target.result === 'clicked'  ? '⚠ Clicked' :
                             target.result === 'reported' ? '✓ Reported' :
                             target.result === 'opened'   ? 'Opened' :
                             target.result === 'sent'     ? 'Received' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-5 py-3 hidden sm:table-cell">
                          <span className="text-slate-400 text-sm">
                            {target.sent_at
                              ? new Date(target.sent_at).toLocaleDateString('en-KE', { dateStyle: 'medium' })
                              : '—'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-slate-400 font-medium">No phishing tests yet</p>
                <p className="text-slate-600 text-sm mt-1">Your organization has not sent any simulations yet.</p>
              </div>
            )}
          </div>
        )}

      </PageWrapper>
    </>
  )
}