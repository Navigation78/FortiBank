'use client'

// src/components/admin/CreateModuleForm.jsx
// Form to create a new training module with content blocks and role access assignment

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const CONTENT_TYPES = [
  { value: 'text',   label: 'Text / HTML',      placeholder: 'Paste HTML content or plain text...' },
  { value: 'video',  label: 'YouTube Video URL', placeholder: 'https://youtube.com/watch?v=...' },
  { value: 'pdf',    label: 'PDF URL',           placeholder: 'Supabase Storage URL or external PDF link' },
  { value: 'image',  label: 'Image URL',         placeholder: 'Supabase Storage URL or external image link' },
  { value: 'slides', label: 'Slides Embed URL',  placeholder: 'Google Slides embed URL' },
]

export default function CreateModuleForm({ existingModule }) {
  const router   = useRouter()
  const supabase = createClient()

  const [roles, setRoles]         = useState([])
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState(false)

  const [form, setForm] = useState({
    title:        existingModule?.title        || '',
    description:  existingModule?.description  || '',
    duration_mins: existingModule?.duration_mins || '',
    status:       existingModule?.status       || 'draft',
  })

  const [selectedRoles, setSelectedRoles]   = useState([])
  const [contentBlocks, setContentBlocks]   = useState(
    existingModule?.content || [{ title: '', content_type: 'text', content_url: '', content_body: '' }]
  )

  useEffect(() => { fetchRoles() }, [])

  async function fetchRoles() {
    const { data } = await supabase
      .from('roles')
      .select('id, name, display_name, category')
      .eq('has_modules', true)
      .order('id')
    setRoles(data || [])
  }

  function handleFormChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleBlockChange(idx, field, value) {
    setContentBlocks(prev => prev.map((b, i) => i === idx ? { ...b, [field]: value } : b))
  }

  function addBlock() {
    setContentBlocks(prev => [...prev, { title: '', content_type: 'text', content_url: '', content_body: '' }])
  }

  function removeBlock(idx) {
    setContentBlocks(prev => prev.filter((_, i) => i !== idx))
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

    const res = await fetch('/api/admin/modules', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        ...form,
        duration_mins: form.duration_mins ? parseInt(form.duration_mins) : null,
        content_blocks: contentBlocks.map((b, i) => ({ ...b, order_index: i })),
        role_ids: selectedRoles,
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Failed to create module')
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
    setTimeout(() => router.push('/admin/modules'), 1500)
  }

  const rolesByCategory = roles.reduce((acc, role) => {
    if (!acc[role.category]) acc[role.category] = []
    acc[role.category].push(role)
    return acc
  }, {})

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-white font-semibold">Module created successfully!</p>
        <p className="text-slate-400 text-sm mt-1">Redirecting to modules list...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Module details */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-white font-semibold">Module Details</h3>
        <div>
          <label className="block text-slate-300 text-sm font-medium mb-1.5">Title *</label>
          <input name="title" value={form.title} onChange={handleFormChange} required
            placeholder="e.g. Introduction to Cybersecurity"
            className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-slate-300 text-sm font-medium mb-1.5">Description</label>
          <textarea name="description" value={form.description} onChange={handleFormChange} rows={3}
            placeholder="Brief description of what this module covers..."
            className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">Duration (minutes)</label>
            <input name="duration_mins" type="number" value={form.duration_mins} onChange={handleFormChange}
              placeholder="e.g. 30"
              className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">Status</label>
            <select name="status" value={form.status} onChange={handleFormChange}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
      </div>

      {/* Role access */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4">Role Access</h3>
        <p className="text-slate-400 text-sm mb-4">Select which roles can see this module.</p>
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
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
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

      {/* Content blocks */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Content Sections</h3>
          <button
            type="button"
            onClick={addBlock}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/30 text-blue-400 rounded-lg text-xs font-medium transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Section
          </button>
        </div>

        <div className="space-y-4">
          {contentBlocks.map((block, idx) => (
            <div key={idx} className="bg-slate-800 border border-slate-700 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs font-medium">Section {idx + 1}</span>
                {contentBlocks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeBlock(idx)}
                    className="text-red-400 hover:text-red-300 text-xs"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 text-xs mb-1">Section Title *</label>
                  <input
                    value={block.title}
                    onChange={e => handleBlockChange(idx, 'title', e.target.value)}
                    required
                    placeholder="e.g. What is Phishing?"
                    className="w-full bg-slate-900 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs mb-1">Content Type</label>
                  <select
                    value={block.content_type}
                    onChange={e => handleBlockChange(idx, 'content_type', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    {CONTENT_TYPES.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {block.content_type === 'text' ? (
                <div>
                  <label className="block text-slate-400 text-xs mb-1">Content (HTML supported)</label>
                  <textarea
                    value={block.content_body}
                    onChange={e => handleBlockChange(idx, 'content_body', e.target.value)}
                    rows={5}
                    placeholder="Type your content here. You can use basic HTML tags."
                    className="w-full bg-slate-900 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors resize-y"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-slate-400 text-xs mb-1">
                    {CONTENT_TYPES.find(t => t.value === block.content_type)?.label}
                  </label>
                  <input
                    value={block.content_url}
                    onChange={e => handleBlockChange(idx, 'content_url', e.target.value)}
                    placeholder={CONTENT_TYPES.find(t => t.value === block.content_type)?.placeholder}
                    className="w-full bg-slate-900 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {loading ? 'Creating...' : existingModule ? 'Update Module' : 'Create Module'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}