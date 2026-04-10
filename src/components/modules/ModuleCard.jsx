// src/components/modules/ModuleCard.jsx
// Displays a single module with progress and status badge


import Link from 'next/link'

const STATUS_CONFIG = {
  completed:   { label: 'Completed',   classes: 'bg-green-500/15 text-green-400 border-green-500/20' },
  in_progress: { label: 'In Progress', classes: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20' },
  not_started: { label: 'Not Started', classes: 'bg-slate-700/50 text-slate-400 border-slate-600/20' },
}

export default function ModuleCard({ module }) {
  const status = module.progress?.status || 'not_started'
  const pct    = module.progress?.progress_pct || 0
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.not_started

  return (
    <Link
      href={`/modules/${module.id}`}
      className="group bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-xl p-5 flex flex-col gap-4 transition-all hover:shadow-lg hover:shadow-black/20"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-md border mb-2 ${config.classes}`}>
            {config.label}
          </span>
          <h3 className="text-white font-semibold text-sm leading-snug group-hover:text-blue-400 transition-colors">
            {module.title}
          </h3>
        </div>
        {/* Arrow icon */}
        <svg className="w-4 h-4 text-slate-600 group-hover:text-blue-400 flex-shrink-0 mt-1 transition-colors"
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>

      {/* Description */}
      {module.description && (
        <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
          {module.description}
        </p>
      )}

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-slate-500 text-xs">Progress</span>
          <span className="text-slate-400 text-xs font-medium">{pct}%</span>
        </div>
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              status === 'completed' ? 'bg-green-500' :
              status === 'in_progress' ? 'bg-blue-500' :
              'bg-slate-700'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-3 text-xs text-slate-500">
        {module.duration_mins && (
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {module.duration_mins} min
          </span>
        )}
        {status === 'completed' && module.progress?.completed_at && (
          <span className="text-green-500">
            ✓ Done {new Date(module.progress.completed_at).toLocaleDateString('en-KE')}
          </span>
        )}
      </div>
    </Link>
  )
}