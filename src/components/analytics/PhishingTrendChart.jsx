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
      <div className="bg-th-srf border border-th-brd rounded-xl p-6">
        <div className="h-4 bg-th-track rounded w-1/3 mb-4 animate-pulse" />
        <div className="h-48 bg-th-track rounded animate-pulse" />
      </div>
    )
  }

  return (
    <div className="bg-th-srf border border-th-brd rounded-xl p-6">
      <h3 className="text-th-txt font-semibold mb-4">Phishing Click Rate Trend</h3>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--th-track)" />
            <XAxis
              dataKey="campaign"
              tick={{ fill: 'var(--th-muted)', fontSize: 10 }}
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
              wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
              formatter={value => value === 'clickRate' ? 'Click Rate' : 'Report Rate'}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-48 flex items-center justify-center">
          <p className="text-th-muted text-sm">No phishing campaigns sent yet</p>
        </div>
      )}
    </div>
  )
}
