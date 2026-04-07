
// src/components/dashboard/ProgressChart.jsx
// Module completion progress display

import Link from 'next/link'

export default function ProgressChart({ modules = [], loading = false }) {
  const total = modules.length
  const completed = modules.filter(m => m.status === 'completed').length
  const inProgress = modules.filter(m => m.status === 'in_progress').length
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-slate-800 rounded w-1/3" />
          <div className="h-2 bg-slate-800 rounded" />
          <div className="h-4 bg-slate-800 rounded w-1/2" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Training Progress</h3>
        <Link href="/modules" className="text-blue-400 hover:text-blue-300 text-xs transition-colors">
          View all →
        </Link>
      </div>

      {/* Overall progress */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 text-sm">Overall completion</span>
          <span className="text-white font-semibold text-sm">{pct}%</span>
        </div>
        <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex items-center gap-4 mt-2">
          <span className="text-slate-500 text-xs">{completed}/{total} modules completed</span>
          {inProgress > 0 && (
            <span className="text-yellow-400 text-xs">{inProgress} in progress</span>
          )}
        </div>
      </div>

      {/* Module list */}
      {modules.length > 0 ? (
        <div className="space-y-2.5">
          {modules.slice(0, 5).map((module) => (
            <div key={module.id} className="flex items-center gap-3">
              {/* Status dot */}
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                module.status === 'completed' ? 'bg-green-400' :
                module.status === 'in_progress' ? 'bg-yellow-400' :
                'bg-slate-600'
              }`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-slate-300 text-xs truncate">{module.title}</p>
                  <span className="text-slate-500 text-xs flex-shrink-0">
                    {module.progress_pct || 0}%
                  </span>
                </div>
                <div className="h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      module.status === 'completed' ? 'bg-green-500' :
                      module.status === 'in_progress' ? 'bg-yellow-500' :
                      'bg-slate-700'
                    }`}
                    style={{ width: `${module.progress_pct || 0}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-slate-500 text-sm">No modules assigned yet.</p>
          <Link href="/modules" className="text-blue-400 text-xs hover:text-blue-300 mt-1 inline-block">
            Browse modules
          </Link>
        </div>
      )}
    </div>
  )
}