'use client'
//src/app/admin/users/page.jsx
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Topbar from '@/components/layout/Topbar'
import PageWrapper from '@/components/layout/PageWrapper'
import UserTable from '@/components/admin/UserTable'

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => { fetchUsers() }, [])

  async function fetchUsers() {
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/users')
    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Failed to load employees')
      setUsers([])
      setLoading(false)
      return
    }

    setUsers(data.users || [])
    setLoading(false)
  }

  return (
    <>
      <Topbar title="Employees" />
      <PageWrapper>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white text-xl font-bold">All Employees</h2>
            <p className="text-slate-400 text-sm mt-0.5">{users.length} total employees</p>
          </div>
          <Link
            href="/admin/users/create"
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Employee
          </Link>
        </div>
        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        <UserTable users={users} loading={loading} onRefresh={fetchUsers} />
      </PageWrapper>
    </>
  )
}
