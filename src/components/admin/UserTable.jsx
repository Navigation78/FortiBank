'use client'

// src/components/admin/UserTable.jsx
// Displays all employees with search, filter by role/category

import { useState } from 'react'
import Link from 'next/link'
import { ROLE_LABELS } from '@/constants/roles'

const CATEGORY_COLORS = {
  'Leadership':         'bg-purple-500/15 text-purple-400 border-purple-500/20',
  'Departmental Heads': 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  'Professional Staff': 'bg-green-500/15 text-green-400 border-green-500/20',
  'Frontline Staff':    'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  'System':             'bg-red-500/15 text-red-400 border-red-500/20',
}

export default function UserTable({ users = [], loading = false, onRefresh }) {
  const [search, setSearch]         = useState('')
  const [categoryFilter, setFilter] = useState('all')

  const categories = ['all', ...new Set(users.map(u => u.role_category).filter(Boolean))]

  const filtered = users.filter(u => {
    const matchSearch = !search ||
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.employee_id?.toLowerCase().includes(search.toLowerCase())
    const matchCat = categoryFilter === 'all' || u.role_category === categoryFilter
    return matchSearch && matchCat
  })

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-14 bg-slate-900 border border-slate-800 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <svg className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, email or employee ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-white placeholder-slate-500 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all capitalize ${
                categoryFilter === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left text-slate-500 text-xs font-medium px-5 py-3">Employee</th>
                <th className="text-left text-slate-500 text-xs font-medium px-5 py-3 hidden sm:table-cell">Role</th>
                <th className="text-left text-slate-500 text-xs font-medium px-5 py-3 hidden md:table-cell">Department</th>
                <th className="text-left text-slate-500 text-xs font-medium px-5 py-3 hidden lg:table-cell">Status</th>
                <th className="text-left text-slate-500 text-xs font-medium px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? filtered.map((user, i) => (
                <tr key={user.id} className={`border-b border-slate-800 last:border-0 hover:bg-slate-800/50 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-900/50'}`}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-400 text-xs font-semibold">
                          {user.full_name?.charAt(0) || '?'}
                        </span>
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{user.full_name}</p>
                        <p className="text-slate-500 text-xs">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    <span className={`text-xs font-medium px-2 py-1 rounded-lg border ${CATEGORY_COLORS[user.role_category] || 'bg-slate-700 text-slate-400 border-slate-600'}`}>
                      {user.role_display_name || user.role || '—'}
                    </span>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <span className="text-slate-400 text-sm">{user.department || '—'}</span>
                  </td>
                  <td className="px-5 py-3 hidden lg:table-cell">
                    <span className={`text-xs font-medium px-2 py-1 rounded-lg ${user.is_active ? 'bg-green-500/15 text-green-400' : 'bg-slate-700 text-slate-500'}`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-500 text-sm">
                    {search ? `No employees found matching "${search}"` : 'No employees yet.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-slate-600 text-xs mt-3 text-right">
        Showing {filtered.length} of {users.length} employees
      </p>
    </div>
  )
}