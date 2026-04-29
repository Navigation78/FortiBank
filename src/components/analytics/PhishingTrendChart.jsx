'use client'
// src/components/analytics/PhishingTrendChart.jsx
// Line chart showing phishing click rate over time per campaign

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

export default function PhishingTrendChart({ data = [], loading = false }) {
  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="h-4 bg-slate-800 rounded w-1/3 mb-4 animate-pulse" />
        <div className="h-48 bg-slate-800 rounded animate-pulse" />
      </div>
    )
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h3 className="text-white font-semibold mb-4">Phishing Click Rate Trend</h3>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="campaign"
              tick={{ fill: '#64748b', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
              tickFormatter={v => `${v}%`}
            />
            <Tooltip
              contentStyle={{
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#f1f5f9',
                fontSize: '12px',
              }}
              formatter={v => [`${v}%`, 'Click Rate']}
            />
            <Line
              type="monotone"
              dataKey="clickRate"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ fill: '#ef4444', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="reportRate"
              stroke="#22c55e"
              strokeWidth={2}
              dot={{ fill: '#22c55e', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px', color: '#64748b', paddingTop: '8px' }}
              formatter={value => value === 'clickRate' ? 'Click Rate' : 'Report Rate'}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-48 flex items-center justify-center">
          <p className="text-slate-500 text-sm">No phishing campaigns sent yet</p>
        </div>
      )}
    </div>
  )
}