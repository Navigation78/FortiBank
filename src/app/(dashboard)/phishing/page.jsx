'use client'

// src/app/(dashboard)/phishing/page.jsx
// Employee view of their phishing test history


import { useState, useEffect } from 'react'
import PageWrapper from '@/components/layout/PageWrapper'
import PhishingStats from '@/components/phishing/PhishingStats'
import CampaignCard from '@/components/phishing/CampaignCard'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

export default function PhishingPage() {
  const supabase        = createClient()
  const { user }        = useAuth()
  const [targets, setTargets]   = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    if (user) fetchTargets()
  }, [user])

  async function fetchTargets() {
    setLoading(true)
    const { data } = await supabase
      .from('phishing_targets')
      .select(`
        id, result, sent_at, opened_at, clicked_at, reported_at,
        phishing_campaigns ( id, name, email_subject, started_at, status )
      `)
      .eq('user_id', user.id)
      .order('sent_at', { ascending: false })

    setTargets(data || [])
    setLoading(false)
  }

  return (
    <PageWrapper>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h4 className="text-th-txt text-xl font-bold">My Phishing Test History</h4>
            <p className="text-th-txt2 text-sm mt-1">
              A record of phishing tests your organization has sent you.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6">
          <PhishingStats targets={targets} />
        </div>

        {/* Info banner */}
        <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-4 mb-6">
          <p className="text-blue-700 dark:text-blue-400 text-sm font-semibold mb-1">About phishing tests</p>
          <p className="text-blue-600/80 dark:text-blue-300/70 text-sm">
            Your organization regularly sends phishing tests to help you build security awareness.
            Clicking a link in a test is recorded and affects your risk score. The goal is to help you
            recognise and avoid real phishing attacks.
          </p>
        </div>

        {/* Campaign list */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-th-hov border border-th-brd rounded-xl p-5 animate-pulse">
                <div className="h-4 bg-th-track rounded w-3/4 mb-3" />
                <div className="h-3 bg-th-track rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : targets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {targets.map(target => (
              <CampaignCard key={target.id} target={target} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-14 h-14 bg-th-hov border border-th-brd rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-th-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-th-txt2 font-medium">No phishing tests yet</p>
            <p className="text-th-muted text-sm mt-1">
              Your organization has not sent any simulations yet. Check back later.
            </p>
          </div>
        )}

      </PageWrapper>
  )
}
