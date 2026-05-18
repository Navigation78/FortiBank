'use client'

// src/components/admin/UserTable.jsx
// Displays all employees with search, filter by role/category

import { useState } from 'react'
import Link  from 'next/link'
import { Table, Thead, Th, Tbody, Tr, Td } from '@/components/ui/Table'
import Badge  from '@/components/ui/Badge'
import Input  from '@/components/ui/Input'

const CATEGORY_VARIANTS = {
  'Leadership':         'purple',
  'Departmental Heads': 'blue',
  'Professional Staff': 'green',
  'Frontline Staff':    'yellow',
  'System':             'red',
}

const SearchIcon = (
  <svg className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

export default function UserTable({ users = [], loading = false, onRefresh: _onRefresh }) {
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
          <div key={i} className="h-14 bg-slate-800 border border-white/[0.06] rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          {SearchIcon}
          <Input
            placeholder="Search by name, email or employee ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all capitalize ${
                categoryFilter === cat
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                  : 'bg-white/[0.05] text-slate-300 hover:text-white hover:bg-white/[0.09] border border-white/[0.07]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <Table>
        <Thead>
          <Th>Employee</Th>
          <Th className="hidden sm:table-cell">Role</Th>
          <Th className="hidden md:table-cell">Department</Th>
          <Th className="hidden lg:table-cell">Status</Th>
          <Th>Actions</Th>
        </Thead>
        <Tbody>
          {filtered.length > 0 ? filtered.map(user => (
            <Tr key={user.id}>
              <Td>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-400 text-xs font-semibold">
                      {user.full_name?.charAt(0) || '?'}
                    </span>
                  </div>
                  <div>
                    <p className="text-slate-100 text-sm font-medium">{user.full_name}</p>
                    <p className="text-slate-400 text-xs">{user.email}</p>
                  </div>
                </div>
              </Td>
              <Td className="hidden sm:table-cell">
                <Badge variant={CATEGORY_VARIANTS[user.role_category] || 'slate'}>
                  {user.role_display_name || user.role || '—'}
                </Badge>
              </Td>
              <Td className="hidden md:table-cell">
                <span className="text-slate-300 text-sm">{user.department || '—'}</span>
              </Td>
              <Td className="hidden lg:table-cell">
                <Badge variant={user.is_active ? 'green' : 'slate'}>
                  {user.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </Td>
              <Td>
                <Link
                  href={`/admin/users/${user.id}`}
                  className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-all duration-150"
                >
                  View →
                </Link>
              </Td>
            </Tr>
          )) : (
            <Tr>
              <Td className="py-12 text-center text-slate-500 text-sm" colSpan={5}>
                {search ? `No employees found matching "${search}"` : 'No employees yet.'}
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>

      <p className="text-slate-500 text-xs mt-3 text-right">
        Showing {filtered.length} of {users.length} employees
      </p>
    </div>
  )
}
