'use client'

// src/components/admin/CreateCampaignForm.jsx
// Form to create a phishing simulation campaign


import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function CreateCampaignForm() {
  const router   = useRouter()
  const supabase = createClient()

  const [roles, setRoles]       = useState([])
  const [loading, setLoading]   = useState(false)
  const [sending, setSending]   = useState(false)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState(false)
  const [createdId, setCreatedId] = useState(null)

  const [form, setForm] = useState({
    name:               '',
    description:        '',
    email_subject:      '',
    email_sender_name:  'IT Helpdesk',
    email_sender_addr:  'helpdesk@fortibank-it.com',
    email_body_html:    DEFAULT_EMAIL_TEMPLATE,
  })

  const [selectedRoles, setSelectedRoles] = useState([])

  useEffect(() => { fetchRoles() }, [])

  async function fetchRoles() {
    const { data } = await supabase
      .from('roles')
      .select('id, name, display_name, category')
      .eq('has_modules', true)
      .order('id')
    setRoles(data || [])
  }

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function toggleRole(roleId) {
    setSelectedRoles(prev =>
      prev.includes(roleId) ? prev.filter(id => id !== roleId) : [...prev, roleId]
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/admin/campaigns', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ ...form, role_ids: selectedRoles }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Failed to create campaign')
      setLoading(false)
      return
    }

    setCreatedId(data.campaign.id)
    setSuccess(true)
    setLoading(false)
  }

  async function handleSendNow() {
    if (!createdId) return
    setSending(true)
    const res = await fetch('/api/phishing/send', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ campaignId: createdId }),
    })
    const data = await res.json()
    setSending(false)
    router.push(`/admin/phishing/${createdId}`)
  }

  const rolesByCategory = roles.reduce((acc, role) => {
    if (!acc[role.category]) acc[role.category] = []
    acc[role.category].push(role)
    return acc
  }, {})

  if (success) {
    return (
      <div className="text-center py-12 max-w-md mx-auto">
        <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-white font-semibold text-lg">Campaign created!</p>
        <p className="text-slate-400 text-sm mt-1 mb-6">
          Ready to send to {selectedRoles.length > 0 ? 'selected roles' : 'all employees'}.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={handleSendNow}
            disabled={sending}
            className="w-full bg-red-600 hover:bg-red-500 disabled:bg-red-600/50 text-white font-medium rounded-lg py-2.5 text-sm transition-colors"
          >
            {sending ? 'Sending emails...' : '🚀 Send Campaign Now'}
          </button>
          <button
            onClick={() => router.push('/admin/phishing')}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg py-2.5 text-sm transition-colors"
          >
            Save as Draft — Send Later
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Campaign details */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-white font-semibold">Campaign Details</h3>
        <div>
          <label className="block text-slate-300 text-sm font-medium mb-1.5">Campaign Name *</label>
          <input name="name" value={form.name} onChange={handleChange} required
            placeholder="e.g. Q2 IT Password Reset Phishing Test"
            className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-slate-300 text-sm font-medium mb-1.5">Description</label>
          <input name="description" value={form.description} onChange={handleChange}
            placeholder="Internal note about this campaign"
            className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Email template */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div>
          <h3 className="text-white font-semibold">Email Template</h3>
          <p className="text-slate-500 text-xs mt-1">
            Use <code className="bg-slate-800 px-1 rounded">{'{{name}}'}</code> for recipient name and{' '}
            <code className="bg-slate-800 px-1 rounded">{'{{phishing_link}}'}</code> for the tracking link.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">Email Subject *</label>
            <input name="email_subject" value={form.email_subject} onChange={handleChange} required
              placeholder="URGENT: Action required"
              className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">Sender Name</label>
            <input name="email_sender_name" value={form.email_sender_name} onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">Sender Address</label>
            <input name="email_sender_addr" value={form.email_sender_addr} onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
        <div>
          <label className="block text-slate-300 text-sm font-medium mb-1.5">Email Body (HTML) *</label>
          <textarea name="email_body_html" value={form.email_body_html} onChange={handleChange} required rows={10}
            className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-blue-500 transition-colors resize-y"
          />
        </div>
      </div>

      {/* Target roles */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-1">Target Roles</h3>
        <p className="text-slate-400 text-sm mb-4">
          {selectedRoles.length === 0 ? 'No roles selected — campaign will target ALL employees.' : `${selectedRoles.length} role(s) selected.`}
        </p>
        <div className="space-y-4">
          {Object.entries(rolesByCategory).map(([category, categoryRoles]) => (
            <div key={category}>
              <p className="text-slate-500 text-xs font-medium mb-2 uppercase tracking-wider">{category}</p>
              <div className="flex flex-wrap gap-2">
                {categoryRoles.map(role => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => toggleRole(role.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      selectedRoles.includes(role.id)
                        ? 'bg-red-600/20 border-red-500/40 text-red-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {role.display_name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={loading}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {loading ? 'Creating...' : 'Create Campaign'}
        </button>
        <button type="button" onClick={() => router.back()}
          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

const DEFAULT_EMAIL_TEMPLATE = `<p>Dear {{name}},</p>

<p>Our security system has detected that your password will expire in <strong>24 hours</strong>.</p>

<p>To avoid losing access to FortiBank systems, please reset your password immediately by clicking the link below:</p>

<p><a href="{{phishing_link}}">Reset My Password Now</a></p>

<p>If you do not reset within 24 hours, your account will be locked and you will need to contact IT support to regain access.</p>

<p>IT Helpdesk Team<br>FortiBank</p>`