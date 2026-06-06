'use client'

// src/components/admin/CreateModuleForm.jsx
// Create / edit a training module.
// Supports the full LMS content model:
//   · section_number  – e.g. "1.0", "1.1", "1.2" (organises topics & subtopics)
//   · learning_objectives – shown on topic-header (X.0) sections
//   · image_caption   – caption shown beneath image sections
//   · knowledge_check – inline MCQ stored as JSON in content_body

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const CONTENT_TYPES = [
  { value: 'text',            label: 'Text / HTML' },
  { value: 'video',           label: 'Video URL (YouTube / direct)' },
  { value: 'pdf',             label: 'PDF URL' },
  { value: 'image',           label: 'Image URL' },
  { value: 'slides',          label: 'Slides Embed URL' },
  { value: 'knowledge_check', label: 'Inline Knowledge Check (MCQ)' },
]

const BLANK_KC = JSON.stringify({
  question: '',
  options: [
    { id: 'a', text: '', correct: true,  explanation: '' },
    { id: 'b', text: '', correct: false, explanation: '' },
    { id: 'c', text: '', correct: false, explanation: '' },
    { id: 'd', text: '', correct: false, explanation: '' },
  ],
}, null, 2)

function isTopicHeader(sectionNumber) {
  return /^\d+\.0$/.test((sectionNumber || '').trim())
}

// ── Knowledge-check JSON editor ───────────────────────────────────────────────

function KCEditor({ value, onChange }) {
  let parsed = { question: '', options: [] }
  try { parsed = JSON.parse(value || BLANK_KC) } catch {}

  const setQuestion  = q  => onChange(JSON.stringify({ ...parsed, question: q }, null, 2))
  const setOptField  = (i, field, val) => {
    const opts = parsed.options.map((o, idx) => idx === i ? { ...o, [field]: val } : o)
    onChange(JSON.stringify({ ...parsed, options: opts }, null, 2))
  }
  const markCorrect  = i => {
    const opts = parsed.options.map((o, idx) => ({ ...o, correct: idx === i }))
    onChange(JSON.stringify({ ...parsed, options: opts }, null, 2))
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-th-muted text-xs mb-1">Question *</label>
        <input
          value={parsed.question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="e.g. What is a phishing email?"
          className="w-full bg-th-ibg border border-th-ibrd text-th-txt placeholder:text-th-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-all"
        />
      </div>

      <div>
        <label className="block text-th-muted text-xs mb-1">
          Answer Options&ensp;<span className="text-th-muted opacity-60">(click the circle to mark correct)</span>
        </label>
        <div className="space-y-2">
          {(parsed.options || []).map((opt, i) => (
            <div key={opt.id || i} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => markCorrect(i)}
                className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${opt.correct ? 'bg-green-500 border-green-500' : 'border-th-brds'}`}
              />
              <input
                value={opt.text}
                onChange={e => setOptField(i, 'text', e.target.value)}
                placeholder={`Option ${String.fromCharCode(65 + i)}`}
                className="flex-1 bg-th-ibg border border-th-ibrd text-th-txt placeholder:text-th-muted rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 transition-all"
              />
              <input
                value={opt.explanation}
                onChange={e => setOptField(i, 'explanation', e.target.value)}
                placeholder="Explanation (optional)"
                className="flex-1 bg-th-ibg border border-th-ibrd text-th-txt placeholder:text-th-muted rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Main form ─────────────────────────────────────────────────────────────────

export default function CreateModuleForm({ existingModule }) {
  const router   = useRouter()
  const supabase = createClient()

  const [roles, setRoles]     = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    title:        existingModule?.title        || '',
    description:  existingModule?.description  || '',
    duration_mins: existingModule?.duration_mins || '',
    status:       existingModule?.status       || 'draft',
  })

  const [selectedRoles, setSelectedRoles] = useState(
    existingModule?.module_role_access?.map(a => a.role_id) || []
  )

  const [contentBlocks, setContentBlocks] = useState(
    existingModule?.content?.length
      ? [...existingModule.content].sort((a, b) => a.order_index - b.order_index).map(b => ({
          title:               b.title || '',
          content_type:        b.content_type || 'text',
          content_url:         b.content_url || '',
          content_body:        b.content_body || '',
          section_number:      b.section_number || '',
          learning_objectives: b.learning_objectives || [],
          image_caption:       b.image_caption || '',
        }))
      : [{ title: '', content_type: 'text', content_url: '', content_body: '', section_number: '', learning_objectives: [], image_caption: '' }]
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

  function addObjective(idx) {
    setContentBlocks(prev => prev.map((b, i) =>
      i === idx ? { ...b, learning_objectives: [...(b.learning_objectives || []), ''] } : b
    ))
  }

  function updateObjective(blockIdx, objIdx, value) {
    setContentBlocks(prev => prev.map((b, i) => {
      if (i !== blockIdx) return b
      const objs = (b.learning_objectives || []).map((o, j) => j === objIdx ? value : o)
      return { ...b, learning_objectives: objs }
    }))
  }

  function removeObjective(blockIdx, objIdx) {
    setContentBlocks(prev => prev.map((b, i) => {
      if (i !== blockIdx) return b
      return { ...b, learning_objectives: (b.learning_objectives || []).filter((_, j) => j !== objIdx) }
    }))
  }

  function addBlock() {
    setContentBlocks(prev => [...prev, {
      title: '', content_type: 'text', content_url: '', content_body: '',
      section_number: '', learning_objectives: [], image_caption: '',
    }])
  }

  function removeBlock(idx) {
    setContentBlocks(prev => prev.filter((_, i) => i !== idx))
  }

  function moveBlock(idx, dir) {
    setContentBlocks(prev => {
      const next = [...prev]
      const target = idx + dir
      if (target < 0 || target >= next.length) return prev
      ;[next[idx], next[target]] = [next[target], next[idx]]
      return next
    })
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

    if (selectedRoles.length === 0) {
      setError('Select at least one role so this module appears on employee dashboards.')
      setLoading(false)
      return
    }

    const endpoint = existingModule?.id
      ? `/api/admin/modules/${existingModule.id}`
      : '/api/admin/modules'

    const res = await fetch(endpoint, {
      method:  existingModule?.id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        ...form,
        duration_mins:  form.duration_mins ? parseInt(form.duration_mins) : null,
        content_blocks: contentBlocks.map((b, i) => ({ ...b, order_index: i })),
        role_ids:       selectedRoles,
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error || `Failed to ${existingModule ? 'update' : 'create'} module`)
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
        <p className="text-th-txt font-semibold">Module {existingModule ? 'updated' : 'created'} successfully!</p>
        <p className="text-th-muted text-sm mt-1">Redirecting…</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* ── Module details ──────────────────────────────────────────────── */}
      <div className="bg-th-srf border border-th-brd rounded-xl p-6 space-y-4">
        <h3 className="text-th-txt font-semibold">Module Details</h3>

        <div>
          <label className="block text-th-txt2 text-sm font-medium mb-1.5">Title *</label>
          <input name="title" value={form.title} onChange={handleFormChange} required
            placeholder="e.g. Cybersecurity Fundamentals"
            className="w-full bg-th-ibg border border-th-ibrd text-th-txt placeholder:text-th-muted rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-th-txt2 text-sm font-medium mb-1.5">Description</label>
          <textarea name="description" value={form.description} onChange={handleFormChange} rows={3}
            placeholder="Brief summary of what this module covers…"
            className="w-full bg-th-ibg border border-th-ibrd text-th-txt placeholder:text-th-muted rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-th-txt2 text-sm font-medium mb-1.5">Duration (minutes)</label>
            <input name="duration_mins" type="number" value={form.duration_mins} onChange={handleFormChange}
              placeholder="e.g. 45"
              className="w-full bg-th-ibg border border-th-ibrd text-th-txt placeholder:text-th-muted rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-th-txt2 text-sm font-medium mb-1.5">Status</label>
            <select name="status" value={form.status} onChange={handleFormChange}
              className="w-full bg-th-ibg border border-th-ibrd text-th-txt rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Role access ─────────────────────────────────────────────────── */}
      <div className="bg-th-srf border border-th-brd rounded-xl p-6">
        <h3 className="text-th-txt font-semibold mb-2">Role Access</h3>
        <p className="text-th-muted text-sm mb-4">Select which roles can view this module.</p>
        <div className="space-y-4">
          {Object.entries(rolesByCategory).map(([category, categoryRoles]) => (
            <div key={category}>
              <p className="text-th-muted text-xs font-medium mb-2 uppercase tracking-wider">{category}</p>
              <div className="flex flex-wrap gap-2">
                {categoryRoles.map(role => (
                  <button
                    key={role.id} type="button" onClick={() => toggleRole(role.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      selectedRoles.includes(role.id)
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-th-hov border-th-brd text-th-txt2 hover:text-th-txt hover:border-th-brds'
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

      {/* ── Content sections ─────────────────────────────────────────────── */}
      <div className="bg-th-srf border border-th-brd rounded-xl p-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-th-txt font-semibold">Content Sections</h3>
            <p className="text-th-muted text-xs mt-0.5">
              Use <span className="font-mono text-th-txt2">1.0</span>, <span className="font-mono text-th-txt2">1.1</span>, <span className="font-mono text-th-txt2">2.0</span>… section numbers to organise topics (NetAcad style).
              Topic headers (<span className="font-mono text-th-txt2">X.0</span>) show learning objectives in the viewer.
            </p>
          </div>
          <button
            type="button" onClick={addBlock}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/30 text-blue-400 rounded-lg text-xs font-medium transition-all flex-shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Section
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {contentBlocks.map((block, idx) => {
            const isHeader = isTopicHeader(block.section_number)
            return (
              <div
                key={idx}
                className={`border rounded-xl p-4 space-y-3 ${
                  isHeader
                    ? 'bg-blue-500/[0.05] border-blue-500/20'
                    : 'bg-th-hov/50 border-th-brd'
                }`}
              >
                {/* Row 1: label + reorder + remove */}
                <div className="flex items-center justify-between">
                  <span className="text-th-muted text-xs font-medium">
                    Section {idx + 1}
                    {block.section_number && (
                      <span className={`ml-2 font-mono px-1.5 py-0.5 rounded text-[10px] ${
                        isHeader ? 'text-blue-400 bg-blue-500/10' : 'text-th-muted bg-th-hov'
                      }`}>
                        {block.section_number}
                        {isHeader ? ' (Topic Header)' : ''}
                      </span>
                    )}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button type="button" onClick={() => moveBlock(idx, -1)} disabled={idx === 0}
                      className="text-th-muted hover:text-th-txt2 disabled:opacity-30 px-1 text-xs transition-all" title="Move up">↑</button>
                    <button type="button" onClick={() => moveBlock(idx, 1)} disabled={idx === contentBlocks.length - 1}
                      className="text-th-muted hover:text-th-txt2 disabled:opacity-30 px-1 text-xs transition-all" title="Move down">↓</button>
                    {contentBlocks.length > 1 && (
                      <button type="button" onClick={() => removeBlock(idx)}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-xs transition-all ml-1">Remove</button>
                    )}
                  </div>
                </div>

                {/* Row 2: section number + title */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-th-muted text-xs mb-1">
                      Section Number
                      <span className="text-th-muted opacity-60 ml-1">(e.g. 1.0, 1.1)</span>
                    </label>
                    <input
                      value={block.section_number}
                      onChange={e => handleBlockChange(idx, 'section_number', e.target.value)}
                      placeholder="1.0"
                      className="w-full bg-th-ibg border border-th-ibrd text-th-txt placeholder:text-th-muted rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-th-muted text-xs mb-1">Section Title *</label>
                    <input
                      value={block.title}
                      onChange={e => handleBlockChange(idx, 'title', e.target.value)}
                      required
                      placeholder="e.g. What is Phishing?"
                      className="w-full bg-th-ibg border border-th-ibrd text-th-txt placeholder:text-th-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                {/* Row 3: content type selector */}
                <div>
                  <label className="block text-th-muted text-xs mb-1">Content Type</label>
                  <select
                    value={block.content_type}
                    onChange={e => handleBlockChange(idx, 'content_type', e.target.value)}
                    className="w-full bg-th-ibg border border-th-ibrd text-th-txt rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-all"
                  >
                    {CONTENT_TYPES.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                {/* Row 4: content input */}
                {block.content_type === 'text' ? (
                  <div>
                    <label className="block text-th-muted text-xs mb-1">Content (HTML supported)</label>
                    <textarea
                      value={block.content_body}
                      onChange={e => handleBlockChange(idx, 'content_body', e.target.value)}
                      rows={6}
                      placeholder="<h2>Introduction</h2><p>Your content here…</p>"
                      className="w-full bg-th-ibg border border-th-ibrd text-th-txt placeholder:text-th-muted rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-blue-500 transition-all resize-y"
                    />
                  </div>
                ) : block.content_type === 'knowledge_check' ? (
                  <KCEditor
                    value={block.content_body || BLANK_KC}
                    onChange={v => handleBlockChange(idx, 'content_body', v)}
                  />
                ) : (
                  <div>
                    <label className="block text-th-muted text-xs mb-1">
                      {CONTENT_TYPES.find(t => t.value === block.content_type)?.label} URL
                    </label>
                    <input
                      value={block.content_url}
                      onChange={e => handleBlockChange(idx, 'content_url', e.target.value)}
                      placeholder="https://…"
                      className="w-full bg-th-ibg border border-th-ibrd text-th-txt placeholder:text-th-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                )}

                {/* Image caption (image type only) */}
                {block.content_type === 'image' && (
                  <div>
                    <label className="block text-th-muted text-xs mb-1">Caption (optional)</label>
                    <input
                      value={block.image_caption}
                      onChange={e => handleBlockChange(idx, 'image_caption', e.target.value)}
                      placeholder="Figure 1: Network topology diagram"
                      className="w-full bg-th-ibg border border-th-ibrd text-th-txt placeholder:text-th-muted rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                )}

                {/* Learning objectives (topic-header sections only) */}
                {isHeader && (
                  <div className="border-t border-blue-500/20 pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-blue-400 text-xs font-semibold uppercase tracking-wide">
                        Learning Objectives
                      </label>
                      <button
                        type="button" onClick={() => addObjective(idx)}
                        className="text-blue-400 hover:text-blue-300 text-xs transition-all"
                      >
                        + Add objective
                      </button>
                    </div>
                    <p className="text-th-muted text-xs mb-2">
                      Shown to learners at the start of this topic.
                    </p>
                    <div className="space-y-2">
                      {(block.learning_objectives || []).map((obj, oi) => (
                        <div key={oi} className="flex items-center gap-2">
                          <span className="text-blue-400 text-xs flex-shrink-0">→</span>
                          <input
                            value={obj}
                            onChange={e => updateObjective(idx, oi, e.target.value)}
                            placeholder="e.g. Identify common phishing indicators"
                            className="flex-1 bg-th-ibg border border-th-ibrd text-th-txt placeholder:text-th-muted rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 transition-all"
                          />
                          <button type="button" onClick={() => removeObjective(idx, oi)}
                            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-xs transition-all">✕</button>
                        </div>
                      ))}
                      {(block.learning_objectives || []).length === 0 && (
                        <p className="text-th-muted text-xs italic">No objectives yet. Click "+ Add objective" above.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Submit ───────────────────────────────────────────────────────── */}
      <div className="flex gap-3">
        <button
          type="submit" disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white rounded-lg text-sm font-medium transition-all"
        >
          {loading
            ? (existingModule ? 'Updating…' : 'Creating…')
            : (existingModule ? 'Update Module' : 'Create Module')}
        </button>
        <button
          type="button" onClick={() => router.back()}
          className="px-5 py-2.5 bg-th-hov hover:bg-th-act text-th-txt2 border border-th-brd rounded-lg text-sm font-medium transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
