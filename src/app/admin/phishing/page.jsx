'use client'
//src/app/admin/phishing/page.jsx
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Topbar from '@/components/layout/Topbar'
import PageWrapper from '@/components/layout/PageWrapper'

const STATUS_COLORS = {
  draft:     'bg-slate-700 text-slate-400',
  active:    'bg-blue-500/15 text-blue-400',
  completed: 'bg-green-500/15 text-green-400',
  cancelled: 'bg-red-500/15 text-red-400',
}

export default function AdminPhishingPage() {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => { fetchCampaigns() }, [])

  async function fetchCampaigns() {
    setLoading(true)
    const res  = await fetch('/api/admin/campaigns')
    const data = await res.json()
    setCampaigns(data.campaigns || [])
    setLoading(false)
  }

  return (
    <>
      <Topbar title="Phishing Campaigns" />
      <PageWrapper>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white text-xl font-bold">Phishing Campaigns</h2>
            <p className="text-slate-400 text-sm mt-0.5">{campaigns.length} total campaigns</p>
          </div>
          <Link
            href="/admin/phishing/create"
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Campaign
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-900 border border-slate-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : campaigns.length > 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left text-slate-500 text-xs font-medium px-5 py-3">Campaign</th>
                  <th className="text-left text-slate-500 text-xs font-medium px-5 py-3 hidden sm:table-cell">Status</th>
                  <th className="text-left text-slate-500 text-xs font-medium px-5 py-3 hidden md:table-cell">Targets</th>
                  <th className="text-left text-slate-500 text-xs font-medium px-5 py-3 hidden lg:table-cell">Click Rate</th>
                  <th className="text-left text-slate-500 text-xs font-medium px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map(c => (
                  <tr key={c.campaign_id} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/50 transition-colors">
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
                        {c.click_rate_pct ?? '—'}%
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <Link href={`/admin/phishing/${c.campaign_id}`} className="text-blue-400 hover:text-blue-300 text-xs font-medium">
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-xl">
            <p className="text-slate-400 font-medium">No campaigns yet</p>
            <Link href="/admin/phishing/create" className="text-blue-400 text-sm hover:text-blue-300 mt-2 inline-block">
              Create your first campaign →
            </Link>
          </div>
        )}
      </PageWrapper>
    </>
  )
}