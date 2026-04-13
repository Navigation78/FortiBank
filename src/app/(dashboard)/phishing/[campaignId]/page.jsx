'use client'

// src/app/(dashboard)/phishing/[campaignId]/page.jsx
// Employee view of a single phishing campaign result


import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Topbar from '@/components/layout/Topbar'
import PageWrapper from '@/components/layout/PageWrapper'
import SimulationBadge from '@/components/phishing/SimulationBadge'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

export default function CampaignDetailPage() {
  const { campaignId }    = useParams()
  const supabase          = createClient()
  const { user }          = useAuth()
  const [target, setTarget] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && campaignId) fetchTarget()
  }, [user, campaignId])

  async function fetchTarget() {
    const { data } = await supabase
      .from('phishing_targets')
      .select(`
        id, result, sent_at, opened_at, clicked_at, reported_at,
        phishing_campaigns (
          id, name, email_subject, email_sender_name,
          email_sender_addr, started_at, status
        )
      `)
      .eq('user_id', user.id)
      .eq('campaign_id', campaignId)
      .single()

    setTarget(data)
    setLoading(false)
  }

  if (loading) {
    return (
      <>
        <Topbar title="Phishing Test Detail" />
        <PageWrapper>
          <div className="animate-pulse space-y-4 max-w-2xl">
            <div className="h-5 bg-slate-800 rounded w-1/3" />
            <div className="h-32 bg-slate-800 rounded-xl" />
          </div>
        </PageWrapper>
      </>
    )
  }

  if (!target) {
    return (
      <>
        <Topbar title="Not Found" />
        <PageWrapper>
          <div className="text-center py-16">
            <p className="text-slate-400 mb-4">Campaign not found.</p>
            <Link href="/phishing" className="text-blue-400 text-sm">← Back to phishing tests</Link>
          </div>
        </PageWrapper>
      </>
    )
  }

  const campaign  = target.phishing_campaigns
  const clicked   = target.result === 'clicked'
  const reported  = target.result === 'reported'

  return (
    <>
      <Topbar title="Phishing Test Detail" />
      <PageWrapper>
        <div className="max-w-2xl mx-auto">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/phishing" className="hover:text-slate-300">Phishing Tests</Link>
            <span>/</span>
            <span className="text-slate-300 truncate">{campaign?.name}</span>
          </div>

          {/* Result banner */}
          <div className={`rounded-xl border p-6 mb-6 ${
            clicked
              ? 'bg-red-500/10 border-red-500/30'
              : reported
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-blue-500/10 border-blue-500/30'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                clicked ? 'bg-red-500/20' : reported ? 'bg-green-500/20' : 'bg-blue-500/20'
              }`}>
                {clicked ? '⚠️' : reported ? '✓' : '📧'}
              </div>
              <div>
                <p className={`font-bold ${clicked ? 'text-red-400' : reported ? 'text-green-400' : 'text-blue-400'}`}>
                  {clicked ? 'You clicked this phishing link' : reported ? 'You correctly reported this' : 'Email received'}
                </p>
                <SimulationBadge />
              </div>
            </div>
            {clicked && (
              <p className="text-slate-300 text-sm">
                This was a simulated phishing test. In a real attack, clicking this link
                could have resulted in credential theft or malware installation.
              </p>
            )}
            {reported && (
              <p className="text-slate-300 text-sm">
                Excellent security awareness! Reporting phishing attempts protects the entire organization.
              </p>
            )}
          </div>

          {/* Campaign details */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
            <h3 className="text-white font-semibold mb-4">Email Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex gap-3">
                <span className="text-slate-500 w-24 flex-shrink-0">Campaign</span>
                <span className="text-slate-300">{campaign?.name}</span>
              </div>
              <div className="flex gap-3">
                <span className="text-slate-500 w-24 flex-shrink-0">Subject</span>
                <span className="text-slate-300">{campaign?.email_subject}</span>
              </div>
              <div className="flex gap-3">
                <span className="text-slate-500 w-24 flex-shrink-0">Sender name</span>
                <span className="text-red-400">{campaign?.email_sender_name} ← fake sender</span>
              </div>
              <div className="flex gap-3">
                <span className="text-slate-500 w-24 flex-shrink-0">Sender email</span>
                <span className="text-red-400">{campaign?.email_sender_addr} ← not a real address</span>
              </div>
            </div>
          </div>

          {/* What to look for */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
            <h3 className="text-white font-semibold mb-4">Red Flags in This Email</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5 flex-shrink-0">⚠</span>
                The sender domain does not match your organization's official domain
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5 flex-shrink-0">⚠</span>
                The email created urgency to pressure you into acting quickly
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5 flex-shrink-0">⚠</span>
                The link URL did not match a legitimate organizational domain
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5 flex-shrink-0">⚠</span>
                Legitimate IT systems never ask for credentials via email links
              </li>
            </ul>
          </div>

          <Link
            href="/phishing"
            className="flex items-center gap-2 text-slate-500 hover:text-slate-300 text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to all phishing tests
          </Link>

        </div>
      </PageWrapper>
    </>
  )
}