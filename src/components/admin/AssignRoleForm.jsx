'use client'

// src/components/admin/AssignRoleForm.jsx
// Reassigns a role to an existing employee

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

export default function AssignRoleForm({ userId, currentRole, onSuccess }) {
  const supabase      = createClient()
  const [roles, setRoles]     = useState([])
  const [roleId, setRoleId]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => { fetchRoles() }, [])

  async function fetchRoles() {
    const { data } = await supabase
      .from('roles')
      .select('id, name, display_name, category')
      .order('id')
    setRoles(data || [])
    // Pre-select current role
    const current = data?.find(r => r.name === currentRole)
    if (current) setRoleId(String(current.id))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch(`/api/admin/users/${userId}/role`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ role_id: parseInt(roleId) }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Failed to update role')
    } else {
      onSuccess?.()
    }
    setLoading(false)
  }

  const rolesByCategory = roles.reduce((acc, role) => {
    if (!acc[role.category]) acc[role.category] = []
    acc[role.category].push(role)
    return acc
  }, {})

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
      <div>
        <label className="block text-slate-300 text-sm font-medium mb-1.5">Assign Role</label>
        <select
          value={roleId}
          onChange={e => setRoleId(e.target.value)}
          required
          className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
        >
          <option value="">Select role...</option>
          {Object.entries(rolesByCategory).map(([category, categoryRoles]) => (
            <optgroup key={category} label={category}>
              {categoryRoles.map(role => (
                <option key={role.id} value={role.id}>{role.display_name}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={loading || !roleId}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white rounded-lg text-sm font-medium transition-colors"
      >
        {loading ? 'Updating...' : 'Update Role'}
      </button>
    </form>
  )
}