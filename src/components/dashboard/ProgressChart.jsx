
// src/components/dashboard/ProgressChart.jsx
// Module completion progress display

import Link from 'next/link'

export default function ProgressChart({ modules = [], loading = false }) {
  const total = modules.length
  const completed = modules.filter(m => (m.progress?.status ?? m.status) === 'completed').length
  const inProgress = modules.filter(m => (m.progress?.status ?? m.status) === 'in_progress').length
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  if (loading) {
    return (
      <div className="bg-th-srf border border-th-brd rounded-xl p-6 shadow-sm shadow-black/5 dark:shadow-black/30">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-th-track rounded w-1/3" />
          <div className="h-2 bg-th-track rounded" />
          <div className="h-4 bg-th-track rounded w-1/2" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-th-srf border border-th-brd rounded-xl p-6 shadow-sm shadow-black/5 dark:shadow-black/30 transition-all duration-150 hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/40">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-th-txt font-semibold">Training Progress</h3>
        <Link href="/modules" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-xs transition-all duration-150">
          View all →
        </Link>
      </div>

      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-th-txt2 text-sm">Overall completion</span>
          <span className="text-th-txt font-semibold text-sm">{pct}%</span>
        </div>
        <div className="h-2 bg-th-track rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex items-center gap-4 mt-2">
          <span className="text-th-muted text-xs">{completed}/{total} modules completed</span>
          {inProgress > 0 && (
            <span className="text-yellow-600 dark:text-yellow-400 text-xs">{inProgress} in progress</span>
          )}
        </div>
      </div>

      {modules.length > 0 ? (
        <div className="space-y-2.5">
          {modules.slice(0, 5).map((module) => {
            const status = module.progress?.status ?? module.status
            const progressPct = module.progress?.progress_pct ?? module.progress_pct ?? 0
            return (
              <div key={module.id} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  status === 'completed'   ? 'bg-green-500' :
                  status === 'in_progress' ? 'bg-yellow-500' :
                  'bg-th-muted'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-th-txt2 text-xs truncate">{module.title}</p>
                    <span className="text-th-muted text-xs flex-shrink-0">{progressPct}%</span>
                  </div>
                  <div className="h-1 bg-th-track rounded-full mt-1 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        status === 'completed'   ? 'bg-green-500' :
                        status === 'in_progress' ? 'bg-yellow-500' :
                        'bg-th-muted'
                      }`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-th-txt2 text-sm">No modules assigned yet.</p>
          <Link href="/modules" className="text-blue-600 dark:text-blue-400 text-xs hover:text-blue-700 dark:hover:text-blue-300 mt-1 inline-block transition-all duration-150">
            Browse modules
          </Link>
        </div>
      )}
    </div>
  )
}
