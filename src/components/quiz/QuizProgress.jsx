// src/components/quiz/QuizProgress.jsx
// Shows which questions have been answered

export default function QuizProgress({
  total,
  current,
  answered,
  onJump,
}) {
  return (
    <div className="bg-th-srf border border-th-brd rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-th-txt2 text-sm">
          Question {current + 1} of {total}
        </span>
        <span className="text-th-txt2 text-sm">
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
                ? 'bg-blue-600 text-white ring-2 ring-blue-400 ring-offset-2 ring-offset-th-bg'
                : answered > i || (answered === total)
                  ? 'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30'
                  : 'bg-th-hov text-th-txt2 hover:bg-th-act'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  )
}
