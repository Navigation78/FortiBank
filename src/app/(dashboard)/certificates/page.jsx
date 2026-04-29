'use client'

// src/app/(dashboard)/certificates/page.jsx
// Shows employee's earned certificates with download links

import { useState, useEffect } from 'react'
import Topbar from '@/components/layout/Topbar'
import PageWrapper from '@/components/layout/PageWrapper'
import { useModules } from '@/hooks/useModules'

export default function CertificatesPage() {
  const { stats } = useModules()
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading]           = useState(true)
  const [checking, setChecking]         = useState(false)
  const [message, setMessage]           = useState(null)

  useEffect(() => { fetchCertificates() }, [])

  async function fetchCertificates() {
    setLoading(true)
    const res  = await fetch('/api/certificates')
    const data = await res.json()
    setCertificates(data.certificates || [])
    setLoading(false)
  }

  async function checkEligibility() {
    setChecking(true)
    setMessage(null)
    const res  = await fetch('/api/certificates', { method: 'POST' })
    const data = await res.json()

    if (data.eligible) {
      setMessage({ type: 'success', text: data.message })
      fetchCertificates()
    } else if (data.alreadyAwarded) {
      setMessage({ type: 'info', text: 'You have already earned your certificate.' })
    } else {
      setMessage({ type: 'warning', text: data.message })
    }
    setChecking(false)
  }

  return (
    <>
      <Topbar title="My Certificates" />
      <PageWrapper>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-white text-xl font-bold">My Certificates</h2>
            <p className="text-slate-400 text-sm mt-1">
              Certificates are awarded when you complete all modules and pass all quizzes.
            </p>
          </div>
          <button
            onClick={checkEligibility}
            disabled={checking}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {checking ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Checking...
              </>
            ) : 'Check Eligibility'}
          </button>
        </div>

        {/* Message banner */}
        {message && (
          <div className={`rounded-xl border p-4 mb-6 ${
            message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
            message.type === 'warning' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' :
            'bg-blue-500/10 border-blue-500/20 text-blue-400'
          }`}>
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}

        {/* Progress summary */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Modules Completed', value: `${stats.completed}/${stats.total}`, icon: '📚' },
            { label: 'Certificates Earned', value: certificates.length, icon: '🏅' },
            { label: 'Status', value: stats.completed === stats.total && stats.total > 0 ? 'Eligible!' : 'In Progress', icon: '📊' },
          ].map((s, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
              <p className="text-2xl mb-1">{s.icon}</p>
              <p className="text-white font-bold text-lg">{s.value}</p>
              <p className="text-slate-500 text-xs">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Certificates list */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-900 border border-slate-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : certificates.length > 0 ? (
          <div className="space-y-4">
            {certificates.map(cert => (
              <div key={cert.id} className="bg-slate-900 border border-green-500/20 rounded-xl p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🏅</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">
                        {cert.roles?.display_name} — Cybersecurity Certificate
                      </p>
                      <p className="text-slate-400 text-sm mt-0.5">
                        Certificate No: <span className="text-green-400 font-mono">{cert.certificate_no}</span>
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                        <span>Issued: {new Date(cert.issued_at).toLocaleDateString('en-KE', { dateStyle: 'long' })}</span>
                        <span>·</span>
                        <span>Valid until: {new Date(cert.valid_until).toLocaleDateString('en-KE', { dateStyle: 'long' })}</span>
                      </div>
                    </div>
                  </div>
                  {cert.pdf_url && (
                    <a
                      href={cert.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-400 rounded-lg text-sm font-medium transition-colors flex-shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download PDF
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-xl">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🏅</span>
            </div>
            <p className="text-white font-semibold">No certificates yet</p>
            <p className="text-slate-400 text-sm mt-2 max-w-sm mx-auto">
              Complete all your assigned training modules and pass all quizzes to earn your certificate.
            </p>
          </div>
        )}

      </PageWrapper>
    </>
  )
}