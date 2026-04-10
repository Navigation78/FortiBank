// src/components/quiz/QuizProgress.jsx
// Shows which questions have been answered

export default function QuizProgress({
  total,
  current,
  answered,
  onJump,
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-slate-400 text-sm">
          Question {current + 1} of {total}
        </span>
        <span className="text-slate-400 text-sm">
          {answered}/{total} answered
        </span>
      </div>

      {/* Question number grid */}
      <div className="flex flex-wrap gap-2">
        {[...Array(total)].map((_, i) => (
          <button
            key={i}
            onClick={() => onJump(i)}
            className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
              i === current
                ? 'bg-blue-600 text-white ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-900'
                : answered > i || (answered === total)
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  )
}