'use client'

// src/components/admin/CreateUserForm.jsx
// Form to create a new employee account and assign their role

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function CreateUserForm() {
  const router    = useRouter()
  const supabase  = createClient()

  const [roles, setRoles]         = useState([])
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState(false)

  const [form, setForm] = useState({
    full_name:   '',
    email:       '',
    password:    '',
    employee_id: '',
    department:  '',
    role_id:     '',
  })

  useEffect(() => { fetchRoles() }, [])

  async function fetchRoles() {
    const { data } = await supabase
      .from('roles')
      .select('id, name, display_name, category')
      .order('id')
    setRoles(data || [])
  }

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/admin/users', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(form),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Failed to create user')
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
    setTimeout(() => router.push('/admin/users'), 1500)
  }

  // Group roles by category for the select
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
        <p className="text-white font-semibold">Employee created successfully!</p>
        <p className="text-slate-400 text-sm mt-1">Redirecting to users list...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-slate-300 text-sm font-medium mb-1.5">Full Name *</label>
          <input name="full_name" value={form.full_name} onChange={handleChange} required
            placeholder="e.g. James Kamau"
            className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-slate-300 text-sm font-medium mb-1.5">Employee ID</label>
          <input name="employee_id" value={form.employee_id} onChange={handleChange}
            placeholder="e.g. FB012"
            className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-slate-300 text-sm font-medium mb-1.5">Email Address *</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} required
          placeholder="employee@fortibank.com"
          className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      <div>
        <label className="block text-slate-300 text-sm font-medium mb-1.5">
          Temporary Password *
          <span className="text-slate-500 font-normal ml-2 text-xs">Employee can change this after first login</span>
        </label>
        <input name="password" type="password" value={form.password} onChange={handleChange} required minLength={8}
          placeholder="Min. 8 characters"
          className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-slate-300 text-sm font-medium mb-1.5">Department</label>
          <input name="department" value={form.department} onChange={handleChange}
            placeholder="e.g. Credit, Operations"
            className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-slate-300 text-sm font-medium mb-1.5">Role *</label>
          <select name="role_id" value={form.role_id} onChange={handleChange} required
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="">Select a role...</option>
            {Object.entries(rolesByCategory).map(([category, categoryRoles]) => (
              <optgroup key={category} label={category}>
                {categoryRoles.map(role => (
                  <option key={role.id} value={role.id}>{role.display_name}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Creating...
            </>
          ) : 'Create Employee'}
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