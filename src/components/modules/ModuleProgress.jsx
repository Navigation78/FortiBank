// src/components/modules/ModuleProgress.jsx
// Shows progress through module content blocks

export default function ModuleProgress({
  current,
  total,
  completedPct,
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-400 text-sm">
          Section {current} of {total}
        </span>
        <span className="text-white font-semibold text-sm">{completedPct}%</span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
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
              'bg-slate-700'
            }`}
          />
        ))}
      </div>
    </div>
  )
}