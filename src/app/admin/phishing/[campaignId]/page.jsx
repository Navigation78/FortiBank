'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Topbar from '@/components/layout/Topbar'
import PageWrapper from '@/components/layout/PageWrapper'
import supabaseAdmin from '@/lib/supabaseAdmin'
import { createClient } from '@/lib/supabase'

export default function CampaignDetailAdminPage() {
  const { campaignId }        = useParams()
  const supabase              = createClient()
  const [campaign, setCampaign] = useState(null)
  const [targets, setTargets]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [sending, setSending]   = useState(false)

  useEffect(() => { if (campaignId) fetchCampaign() }, [campaignId])

  async function fetchCampaign() {
    setLoading(true)
    const [campaignRes, targetsRes] = await Promise.all([
      supabase.from('phishing_campaigns').select('*').eq('id', campaignId).single(),
      supabase.from('phishing_targets')
        .select('*, users(full_name, email)')
        .eq('campaign_id', campaignId)
        .order('sent_at', { ascending: false }),
    ])
    setCampaign(campaignRes.data)
    setTargets(targetsRes.data || [])
    setLoading(false)
  }

  async function handleSend() {
    setSending(true)
    const res = await fetch('/api/phishing/send', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ campaignId }),
    })
    const data = await res.json()
    alert(data.message)
    setSending(false)
    fetchCampaign()
  }

  const stats = {
    total:    targets.length,
    sent:     targets.filter(t => t.result !== 'not_sent').length,
    clicked:  targets.filter(t => t.result === 'clicked').length,
    reported: targets.filter(t => t.result === 'reported').length,
    clickRate: targets.filter(t => t.result !== 'not_sent').length > 0
      ? Math.round((targets.filter(t => t.result === 'clicked').length / targets.filter(t => t.result !== 'not_sent').length) * 100)
      : 0,
  }

  if (loading) {
    return (
      <>
        <Topbar title="Campaign Details" />
        <PageWrapper>
          <div className="animate-pulse space-y-4"><div className="h-32 bg-slate-900 border border-slate-800 rounded-xl" /></div>
        </PageWrapper>
      </>
    )
  }

  return (
    <>
      <Topbar title={campaign?.name || 'Campaign'} />
      <PageWrapper>
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/admin/phishing" className="hover:text-slate-300">Phishing</Link>
          <span>/</span>
          <span className="text-slate-300 truncate">{campaign?.name}</span>
        </div>

        <div className="space-y-6 max-w-4xl">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Targets', value: stats.total,    color: 'text-white' },
              { label: 'Emails Sent',   value: stats.sent,     color: 'text-blue-400' },
              { label: 'Links Clicked', value: stats.clicked,  color: 'text-red-400' },
              { label: 'Click Rate',    value: `${stats.clickRate}%`, color: stats.clickRate > 30 ? 'text-red-400' : 'text-green-400' },
            ].map((s, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-slate-500 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Campaign info + send button */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-start justify-between gap-4">
            <div className="space-y-2 text-sm">
              <div><span className="text-slate-500">Subject: </span><span className="text-slate-300">{campaign?.email_subject}</span></div>
              <div><span className="text-slate-500">Sender: </span><span className="text-slate-300">{campaign?.email_sender_name} &lt;{campaign?.email_sender_addr}&gt;</span></div>
              <div><span className="text-slate-500">Status: </span><span className="text-slate-300 capitalize">{campaign?.status}</span></div>
            </div>
            {campaign?.status === 'draft' && (
              <button
                onClick={handleSend}
                disabled={sending}
                className="flex-shrink-0 px-4 py-2 bg-red-600 hover:bg-red-500 disabled:bg-red-600/50 text-white rounded-lg text-sm font-medium transition-colors"
              >
                {sending ? 'Sending...' : '🚀 Send Now'}
              </button>
            )}
          </div>

          {/* Targets table */}
          {targets.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-800">
                <h3 className="text-white font-semibold">Target Employees</h3>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left text-slate-500 text-xs font-medium px-5 py-3">Employee</th>
                    <th className="text-left text-slate-500 text-xs font-medium px-5 py-3">Result</th>
                    <th className="text-left text-slate-500 text-xs font-medium px-5 py-3 hidden sm:table-cell">Sent</th>
                  </tr>
                </thead>
                <tbody>
                  {targets.map(t => (
                    <tr key={t.id} className="border-b border-slate-800 last:border-0">
                      <td className="px-5 py-3">
                        <p className="text-white text-sm">{t.users?.full_name}</p>
                        <p className="text-slate-500 text-xs">{t.users?.email}</p>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
                          t.result === 'clicked'  ? 'bg-red-500/15 text-red-400' :
                          t.result === 'reported' ? 'bg-green-500/15 text-green-400' :
                          t.result === 'opened'   ? 'bg-yellow-500/15 text-yellow-400' :
                          t.result === 'sent'     ? 'bg-blue-500/15 text-blue-400' :
                          'bg-slate-700 text-slate-400'
                        }`}>
                          {t.result}
                        </span>
                      </td>
                      <td className="px-5 py-3 hidden sm:table-cell">
                        <span className="text-slate-400 text-xs">
                          {t.sent_at ? new Date(t.sent_at).toLocaleDateString('en-KE') : '—'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </PageWrapper>
    </>
  )
}