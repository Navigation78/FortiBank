// src/components/modules/ModuleCard.jsx
// Displays a single module with progress and status badge

import { Check, ChevronRight, Clock } from 'lucide-react'
import Link from 'next/link'

const STATUS_CONFIG = {
  completed:   { label: 'Completed',   classes: 'bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/20' },
  in_progress: { label: 'In Progress', classes: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/20' },
  not_started: { label: 'Not Started', classes: 'bg-th-hov text-th-muted border-th-brd' },
}

export default function ModuleCard({ module }) {
  const status = module.progress?.status || 'not_started'
  const pct    = module.progress?.progress_pct || 0
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.not_started

  return (
    <Link
      href={`/modules/${module.id}`}
      className="group bg-th-srf border border-th-brd hover:border-blue-500/40 rounded-xl p-5 flex flex-col gap-4 transition-all hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-black/30"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-md border mb-2 ${config.classes}`}>
            {config.label}
          </span>
          <h3 className="text-th-txt font-semibold text-sm leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-150">
            {module.title}
          </h3>
        </div>
        <ChevronRight className="w-4 h-4 text-th-muted group-hover:text-blue-500 dark:group-hover:text-blue-400 flex-shrink-0 mt-1 transition-all duration-150" />
      </div>

      {/* Description */}
      {module.description && (
        <p className="text-th-muted text-xs leading-relaxed line-clamp-2">
          {module.description}
        </p>
      )}

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-th-muted text-xs">Progress</span>
          <span className="text-th-txt2 text-xs font-medium">{pct}%</span>
        </div>
        <div className="h-1.5 bg-th-track rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              status === 'completed' ? 'bg-green-500' :
              status === 'in_progress' ? 'bg-blue-500' :
              'bg-th-muted'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-3 text-xs text-th-muted">
        {module.duration_mins && (
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {module.duration_mins} min
          </span>
        )}
        {status === 'completed' && module.progress?.completed_at && (
          <span className="text-green-600 dark:text-green-500 flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            Done {new Date(module.progress.completed_at).toLocaleDateString('en-KE')}
          </span>
        )}
      </div>
    </Link>
  )
}
