// src/components/modules/ModuleProgress.jsx
// Shows progress through module content blocks

export default function ModuleProgress({
  current,
  total,
  completedPct,
}) {
  return (
    <div className="bg-th-srf border border-th-brd rounded-xl px-5 py-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-th-txt2 text-sm">
          Section {current} of {total}
        </span>
        <span className="text-th-txt font-semibold text-sm">{completedPct}%</span>
      </div>
      <div className="h-2 bg-th-track rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-500"
          style={{ width: `${completedPct}%` }}
        />
      </div>
      {/* Section dots */}
      <div className="flex items-center gap-1.5 mt-3">
        {[...Array(total)].map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all ${
              i < current - 1 ? 'bg-blue-500' :
              i === current - 1 ? 'bg-blue-400' :
              'bg-th-track'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
