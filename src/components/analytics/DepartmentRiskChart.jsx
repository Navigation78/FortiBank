'use client'
// src/components/analytics/DepartmentRiskChart.jsx
// Bar chart showing average risk score by role category

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'

export default function DepartmentRiskChart({ data = [], loading = false }) {
  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="h-4 bg-slate-800 rounded w-1/3 mb-4 animate-pulse" />
        <div className="h-48 bg-slate-800 rounded animate-pulse" />
      </div>
    )
  }

  function getBarColor(score) {
    if (score >= 63) return '#ef4444'
    if (score >= 50) return '#f97316'
    if (score >= 35) return '#eab308'
    return '#22c55e'
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h3 className="text-white font-semibold mb-4">Average Risk Score by Category</h3>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="category"
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
            />
            <ReferenceLine y={55} stroke="#f97316" strokeDasharray="4 4" opacity={0.5} label={{ value: 'Warning', fill: '#f97316', fontSize: 10 }} />
            <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="4 4" opacity={0.5} label={{ value: 'Critical', fill: '#ef4444', fontSize: 10 }} />
            <Tooltip
              contentStyle={{
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#f1f5f9',
                fontSize: '12px',
              }}
              formatter={v => [v.toFixed(1), 'Avg Risk Score']}
            />
            <Bar
              dataKey="avgScore"
              radius={[4, 4, 0, 0]}
              fill="#3b82f6"
              label={false}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-48 flex items-center justify-center">
          <p className="text-slate-500 text-sm">No risk score data yet</p>
        </div>
      )}
    </div>
  )
}