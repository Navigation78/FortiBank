'use client'
// src/components/analytics/UserRiskTable.jsx
// Sortable table of all employees sorted by risk score

import { useState } from 'react'
import Link from 'next/link'
import { downloadCSV, csvFilename } from '@/lib/csvDownload'

export default function UserRiskTable({ users = [], loading = false, fetchedAt = null }) {
  const [sortDir, setSortDir] = useState('desc')
  const [search, setSearch]   = useState('')

  function handleDownload() {
    const date = fetchedAt || new Date()
    downloadCSV(
      csvFilename('employee-risk-scores', date),
      ['Name', 'Email', 'Role', 'Risk Score', 'Status', 'Phishing Clicks', 'Phishing Attempts', 'Quizzes Passed', 'Quizzes Assigned'],
      users.map(u => [
        u.full_name,
        u.email,
        u.role_display_name || '',
        Math.round(u.latest_score || 0),
        u.is_critical ? 'Critical' : u.is_warning ? 'Warning' : 'Low',
        u.phishing_clicks || 0,
        u.phishing_attempts || 0,
        u.quizzes_passed || 0,
        u.quizzes_assigned || 0,
      ])
    )
  }

  const filtered = users
    .filter(u =>
      !search ||
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.role_display_name?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sortDir === 'desc'
        ? (b.latest_score || 0) - (a.latest_score || 0)
        : (a.latest_score || 0) - (b.latest_score || 0)
    )

  if (loading) {
    return (
      <div className="bg-th-srf border border-th-brd rounded-xl p-6">
        <div className="h-4 bg-th-track rounded w-1/3 mb-4 animate-pulse" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-th-track rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-th-srf border border-th-brd rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-th-brd flex items-center justify-between gap-3">
        <h3 className="text-th-txt font-semibold">Employee Risk Scores</h3>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-th-ibg border border-th-ibrd text-th-txt placeholder:text-th-muted rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500/70 transition-all duration-150 w-40"
          />
          <button
            onClick={() => setSortDir(d => d === 'desc' ? 'asc' : 'desc')}
            className="text-th-txt2 hover:text-th-txt text-xs px-2 py-1.5 bg-th-hov hover:bg-th-act border border-th-brd rounded-lg transition-all duration-150"
          >
            Score {sortDir === 'desc' ? '↓' : '↑'}
          </button>
          <button
            onClick={handleDownload}
            className="text-th-txt2 hover:text-th-txt text-xs px-2 py-1.5 bg-th-hov hover:bg-th-act border border-th-brd rounded-lg transition-all duration-150"
          >
            ↓ CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-th-brd">
              <th className="text-left text-th-muted text-xs font-medium px-5 py-3">Employee</th>
              <th className="text-left text-th-muted text-xs font-medium px-5 py-3 hidden sm:table-cell">Role</th>
              <th className="text-left text-th-muted text-xs font-medium px-5 py-3">Risk Score</th>
              <th className="text-left text-th-muted text-xs font-medium px-5 py-3 hidden md:table-cell">Phishing</th>
              <th className="text-left text-th-muted text-xs font-medium px-5 py-3 hidden md:table-cell">Quizzes</th>
              <th className="text-left text-th-muted text-xs font-medium px-5 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? filtered.map((user, i) => {
              const score     = Math.round(user.latest_score || 0)
              const isCrit    = user.is_critical
              const isWarn    = user.is_warning
              const scoreColor = isCrit ? 'text-red-600 dark:text-red-400' : isWarn ? 'text-orange-600 dark:text-orange-400' : score > 0 ? 'text-green-600 dark:text-green-400' : 'text-th-muted'

              return (
                <tr key={user.id} className={`border-b border-th-brd last:border-0 ${i % 2 === 0 ? '' : 'bg-th-hov/50'}`}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      {isCrit && <span className="text-xs text-red-500">!</span>}
                      <div>
                        <p className="text-th-txt text-sm font-medium">{user.full_name}</p>
                        <p className="text-th-muted text-xs hidden sm:block">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    <span className="text-th-txt2 text-xs">{user.role_display_name || '-'}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-sm ${scoreColor}`}>{score}</span>
                      <div className="w-16 h-1.5 bg-th-track rounded-full overflow-hidden hidden sm:block">
                        <div
                          className={`h-full rounded-full ${isCrit ? 'bg-red-500' : isWarn ? 'bg-orange-500' : 'bg-green-500'}`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <span className="text-th-muted text-xs">
                      {user.phishing_clicks || 0}/{user.phishing_attempts || 0} clicked
                    </span>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <span className="text-th-muted text-xs">
                      {user.quizzes_passed || 0}/{user.quizzes_assigned || 0} passed
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-xs font-medium transition-all duration-150"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              )
            }) : (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-th-muted text-sm">
                  {search ? `No employees matching "${search}"` : 'No risk score data yet'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
