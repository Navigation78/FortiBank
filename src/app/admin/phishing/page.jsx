'use client'
//src/app/admin/phishing/page.jsx
import { useState, useEffect } from 'react'
import { ArrowRight, Plus } from 'lucide-react'
import Link from 'next/link'
import PageWrapper from '@/components/layout/PageWrapper'

const STATUS_COLORS = {
  draft:     'bg-white/[0.06] text-slate-300',
  active:    'bg-blue-500/15 text-blue-400',
  completed: 'bg-green-500/15 text-green-400',
  cancelled: 'bg-red-500/15 text-red-400',
}

export default function AdminPhishingPage() {
  const [campaigns, setCampaigns]   = useState([])
  const [loading, setLoading]       = useState(true)
  const [resending, setResending]   = useState({})

  useEffect(() => { fetchCampaigns() }, [])

  async function fetchCampaigns() {
    setLoading(true)
    const res  = await fetch('/api/admin/campaigns')
    const data = await res.json()
    setCampaigns(data.campaigns || [])
    setLoading(false)
  }

  async function handleResend(campaignId) {
    setResending(prev => ({ ...prev, [campaignId]: true }))
    const res  = await fetch(`/api/admin/campaigns/${campaignId}/resend`, { method: 'POST' })
    const data = await res.json()
    setResending(prev => ({ ...prev, [campaignId]: false }))
    alert(data.message || (res.ok ? 'Resend complete.' : 'Resend failed.'))
    if (res.ok) fetchCampaigns()
  }

  return (
    <>
      <PageWrapper>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="text-white text-xl font-bold">Phishing Campaigns</h4>
            <p className="text-slate-400 text-sm mt-0.5">{campaigns.length} total campaigns</p>
          </div>
          <Link
            href="/admin/phishing/create"
            className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-medium transition-all duration-150"
          >
            <Plus className="w-4 h-4" />
            New Campaign
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-800 border border-white/[0.06] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : campaigns.length > 0 ? (
          <div className="bg-slate-800 border border-white/[0.08] rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left text-slate-400 text-xs font-medium px-5 py-3">Campaign</th>
                  <th className="text-left text-slate-400 text-xs font-medium px-5 py-3 hidden sm:table-cell">Status</th>
                  <th className="text-left text-slate-400 text-xs font-medium px-5 py-3 hidden md:table-cell">Targets</th>
                  <th className="text-left text-slate-400 text-xs font-medium px-5 py-3 hidden lg:table-cell">Click Rate</th>
                  <th className="text-left text-slate-400 text-xs font-medium px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map(c => (
                  <tr key={c.campaign_id} className="border-b border-white/[0.06] last:border-0 hover:bg-white/[0.04] transition-all duration-150">
                    <td className="px-5 py-3">
                      <p className="text-white text-sm font-medium">{c.campaign_name}</p>
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell">
                      <span className={`text-xs font-medium px-2 py-1 rounded-lg capitalize ${STATUS_COLORS[c.status]}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <span className="text-slate-400 text-sm">{c.total_targets || 0}</span>
                    </td>
                    <td className="px-5 py-3 hidden lg:table-cell">
                      <span className={`text-sm font-semibold ${
                        c.click_rate_pct > 30 ? 'text-red-400' :
                        c.click_rate_pct > 10 ? 'text-orange-400' : 'text-green-400'
                      }`}>
                        {c.click_rate_pct ?? '-'}%
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Link href={`/admin/phishing/${c.campaign_id}`} className="text-blue-400 hover:text-blue-300 text-xs font-medium flex items-center gap-1">
                          View
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                        {c.status !== 'draft' && (
                          <button
                            onClick={() => handleResend(c.campaign_id)}
                            disabled={resending[c.campaign_id]}
                            className="text-green-400 hover:text-green-300 disabled:opacity-50 text-xs font-medium transition-all duration-150"
                          >
                            {resending[c.campaign_id] ? 'Sending...' : 'Resend'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-800 border border-white/[0.08] rounded-xl">
            <p className="text-slate-400 font-medium">No campaigns yet</p>
            <Link href="/admin/phishing/create" className="text-blue-400 text-sm hover:text-blue-300 mt-2 inline-flex items-center gap-1">
              Create your first campaign
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}
      </PageWrapper>
    </>
  )
}