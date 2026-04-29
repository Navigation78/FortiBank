'use client'

// src/components/admin/CreateUserForm.jsx
// Form to create a new employee account and assign their role

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateUserForm() {
  const router = useRouter()

  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(false)
  const [rolesLoading, setRolesLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password:    '',
    employee_id: '',
    department: '',
    role_id: '',
  })

  useEffect(() => { fetchRoles() }, [])

  async function fetchRoles() {
    setRolesLoading(true)

    const res = await fetch('/api/admin/roles')
    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Failed to load roles')
      setRoles([])
      setRolesLoading(false)
      return
    }

    setRoles(data.roles || [])
    setRolesLoading(false)
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
        <div className="relative">
          <input
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={handleChange}
            required
            minLength={8}
            placeholder="Min. 8 characters"
            className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
            aria-label={showPassword ? 'Hide temporary password' : 'Show temporary password'}
          >
            {showPassword ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
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
          <select name="role_id" value={form.role_id} onChange={handleChange} required disabled={rolesLoading}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="">
              {rolesLoading ? 'Loading roles...' : 'Select a role...'}
            </option>
            {Object.entries(rolesByCategory).map(([category, categoryRoles]) => (
              <optgroup key={category} label={category}>
                {categoryRoles.map(role => (
                  <option key={role.id} value={role.id}>{role.display_name}</option>
                ))}
              </optgroup>
            ))}
          </select>
          {!rolesLoading && roles.length === 0 && (
            <p className="text-red-400 text-xs mt-1">No roles are available yet.</p>
          )}
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
