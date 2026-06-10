'use client'
// src/components/analytics/CompletionRateChart.jsx
// Bar chart showing module completion rates per role category

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { downloadCSV, csvFilename } from '@/lib/csvDownload'

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6']

export default function CompletionRateChart({ data = [], loading = false, fetchedAt = null }) {
  function handleDownload() {
    const date = fetchedAt || new Date()
    downloadCSV(
      csvFilename('completion-rate-by-role', date),
      ['Role', 'Completion Rate %'],
      data.map(d => [d.role, d.completionRate])
    )
  }
  if (loading) {
    return (
      <div className="bg-th-srf border border-th-brd rounded-xl p-6">
        <div className="h-4 bg-th-track rounded w-1/3 mb-4 animate-pulse" />
        <div className="h-48 bg-th-track rounded animate-pulse" />
      </div>
    )
  }

  return (
    <div className="bg-th-srf border border-th-brd rounded-xl p-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h3 className="text-th-txt font-semibold">Module Completion Rate by Role</h3>
        {data.length > 0 && (
          <button
            onClick={handleDownload}
            className="text-th-txt2 hover:text-th-txt text-xs px-2 py-1.5 bg-th-hov hover:bg-th-act border border-th-brd rounded-lg transition-all duration-150"
          >
            ↓ CSV
          </button>
        )}
      </div>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--th-track)" />
            <XAxis
              dataKey="role"
              tick={{ fill: 'var(--th-muted)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'var(--th-muted)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
              tickFormatter={v => `${v}%`}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--th-elv)',
                border: '1px solid var(--th-brd)',
                borderRadius: '8px',
                color: 'var(--th-txt)',
                fontSize: '12px',
              }}
              formatter={v => [`${v}%`, 'Completion Rate']}
            />
            <Bar dataKey="completionRate" radius={[4, 4, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-48 flex items-center justify-center">
          <p className="text-th-muted text-sm">No data available yet</p>
        </div>
      )}
    </div>
  )
}
