'use client'

// src/app/(dashboard)/phishing/page.jsx
// Employee view of their phishing test history


import { useState, useEffect } from 'react'
import Topbar from '@/components/layout/Topbar'
import PageWrapper from '@/components/layout/PageWrapper'
import PhishingStats from '@/components/phishing/PhishingStats'
import CampaignCard from '@/components/phishing/CampaignCard'
import SimulationBadge from '@/components/phishing/SimulationBadge'
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
    <>
      <Topbar title="Phishing Tests" />
      <PageWrapper>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-white text-xl font-bold">My Phishing Test History</h2>
            <p className="text-slate-400 text-sm mt-1">
              These are simulated phishing tests conducted by your organization.
            </p>
          </div>
          <SimulationBadge />
        </div>

        {/* Stats */}
        <div className="mb-6">
          <PhishingStats targets={targets} />
        </div>

        {/* Info banner */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
          <p className="text-blue-400 text-sm font-semibold mb-1">About phishing simulations</p>
          <p className="text-slate-400 text-sm">
            Your organization regularly sends simulated phishing emails to test your awareness.
            These are not real attacks — they are training exercises. Clicking a link in a
            simulation is recorded and affects your risk score. The goal is to help you
            recognise and avoid real phishing attacks.
          </p>
        </div>

        {/* Campaign list */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5 animate-pulse">
                <div className="h-4 bg-slate-800 rounded w-3/4 mb-3" />
                <div className="h-3 bg-slate-800 rounded w-1/2" />
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
            <div className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-slate-400 font-medium">No phishing tests yet</p>
            <p className="text-slate-600 text-sm mt-1">
              Your organization has not sent any simulations yet. Check back later.
            </p>
          </div>
        )}

      </PageWrapper>
    </>
  )
}