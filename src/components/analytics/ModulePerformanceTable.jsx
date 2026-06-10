'use client'
// src/components/analytics/ModulePerformanceTable.jsx
// Per-module completion stats for admin analytics

import { downloadCSV, csvFilename } from '@/lib/csvDownload'

export default function ModulePerformanceTable({ modules = [], loading = false, fetchedAt = null }) {
  function handleDownload() {
    const date = fetchedAt || new Date()
    downloadCSV(
      csvFilename('module-performance', date),
      ['Module', 'Assigned', 'Started', 'Completed', 'Completion Rate %'],
      modules.map(m => [m.title, m.assigned, m.started, m.completed, m.completionRate])
    )
  }
  if (loading) {
    return (
      <div className="bg-th-srf border border-th-brd rounded-xl p-6">
        <div className="h-4 bg-th-track rounded w-1/3 mb-4 animate-pulse" />
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-th-track rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-th-srf border border-th-brd rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-th-brd flex items-center justify-between gap-3">
        <div>
          <h3 className="text-th-txt font-semibold">Module Completion Performance</h3>
          <p className="text-th-muted text-xs mt-0.5">Completion rate per module across all assigned employees</p>
        </div>
        {modules.length > 0 && (
          <button
            onClick={handleDownload}
            className="text-th-txt2 hover:text-th-txt text-xs px-2 py-1.5 bg-th-hov hover:bg-th-act border border-th-brd rounded-lg transition-all duration-150 flex-shrink-0"
          >
            ↓ CSV
          </button>
        )}
      </div>

      {modules.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-th-brd">
                <th className="text-left text-th-muted text-xs font-medium px-5 py-3">Module</th>
                <th className="text-left text-th-muted text-xs font-medium px-5 py-3">Assigned</th>
                <th className="text-left text-th-muted text-xs font-medium px-5 py-3 hidden sm:table-cell">Started</th>
                <th className="text-left text-th-muted text-xs font-medium px-5 py-3">Completed</th>
                <th className="text-left text-th-muted text-xs font-medium px-5 py-3">Progress</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((mod, i) => {
                const rate      = mod.completionRate
                const barColor  = rate >= 80 ? 'bg-green-500' : rate >= 50 ? 'bg-yellow-500' : rate > 0 ? 'bg-orange-500' : 'bg-th-track'
                const rateColor = rate >= 80 ? 'text-green-400' : rate >= 50 ? 'text-yellow-400' : rate > 0 ? 'text-orange-400' : 'text-th-muted'

                return (
                  <tr key={mod.id} className={`border-b border-th-brd last:border-0 ${i % 2 === 0 ? '' : 'bg-th-hov/50'}`}>
                    <td className="px-5 py-3">
                      <p className="text-th-txt text-sm font-medium truncate max-w-[180px] sm:max-w-xs">{mod.title}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-th-txt2 text-sm">{mod.assigned}</span>
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell">
                      <span className="text-th-txt2 text-sm">
                        {mod.started}
                        <span className="text-th-muted text-xs ml-1">
                          ({mod.assigned > 0 ? Math.round((mod.started / mod.assigned) * 100) : 0}%)
                        </span>
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-th-txt2 text-sm">
                        {mod.completed}
                        <span className={`text-xs ml-1 font-semibold ${rateColor}`}>
                          ({rate}%)
                        </span>
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="w-24 h-1.5 bg-th-track rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                          style={{ width: `${rate}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-6 py-10 text-center">
          <p className="text-th-muted text-sm">No module data available yet</p>
        </div>
      )}
    </div>
  )
}
