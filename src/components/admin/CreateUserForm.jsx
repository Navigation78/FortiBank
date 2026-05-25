'use client'

// src/components/admin/CreateUserForm.jsx
// Form to create a new employee account and assign their role

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Input  from '@/components/ui/Input'
import Alert  from '@/components/ui/Alert'

export default function CreateUserForm() {
  const router = useRouter()

  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(false)
  const [rolesLoading, setRolesLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

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
    setRolesLoading(true)

    const res  = await fetch('/api/admin/roles')
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

    const res  = await fetch('/api/admin/users', {
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

  const rolesByCategory = roles.reduce((acc, role) => {
    if (!acc[role.category]) acc[role.category] = []
    acc[role.category].push(role)
    return acc
  }, {})

  const EyeToggle = (
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="text-th-muted hover:text-th-txt2"
      aria-label={showPassword ? 'Hide password' : 'Show password'}
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
  )

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-th-txt font-semibold">Employee created successfully!</p>
        <p className="text-th-txt2 text-sm mt-1">Redirecting to users list...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
      {error && <Alert variant="error">{error}</Alert>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Full Name *"
          name="full_name"
          value={form.full_name}
          onChange={handleChange}
          required
          placeholder="e.g. James Kamau"
        />
        <Input
          label="Employee ID"
          name="employee_id"
          value={form.employee_id}
          onChange={handleChange}
          placeholder="e.g. FB012"
        />
      </div>

      <Input
        label="Email Address *"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        required
        placeholder="employee@fortibank.com"
      />

      <Input
        label="Temporary Password *"
        hint="Employee can change this after first login"
        name="password"
        type={showPassword ? 'text' : 'password'}
        value={form.password}
        onChange={handleChange}
        required
        minLength={8}
        placeholder="Min. 8 characters"
        rightElement={EyeToggle}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Department"
          name="department"
          value={form.department}
          onChange={handleChange}
          placeholder="e.g. Credit, Operations"
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-th-txt text-sm font-medium">Role *</label>
          <select
            name="role_id"
            value={form.role_id}
            onChange={handleChange}
            required
            disabled={rolesLoading}
            className="w-full bg-th-ibg border border-th-ibrd text-th-txt rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/70 transition-all duration-150"
          >
            <option value="">{rolesLoading ? 'Loading roles...' : 'Select a role...'}</option>
            {Object.entries(rolesByCategory).map(([category, categoryRoles]) => (
              <optgroup key={category} label={category}>
                {categoryRoles.map(role => (
                  <option key={role.id} value={role.id}>{role.display_name}</option>
                ))}
              </optgroup>
            ))}
          </select>
          {!rolesLoading && roles.length === 0 && (
            <p className="text-red-400 text-xs">No roles are available yet.</p>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={loading}>
          {loading ? 'Creating...' : 'Create Employee'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
