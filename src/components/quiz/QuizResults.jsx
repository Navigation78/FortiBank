// src/components/quiz/QuizResults.jsx
// Shows score, pass/fail status and question breakdown

import Link from 'next/link'

export default function QuizResults({
  result,
  moduleId,
  onRetake,
  questions = [],
}) {
  if (!result) return null

  const { score_pct, passed, pass_score, attempt_number, max_attempts, can_retake } = result

  return (
    <div className="space-y-6">
      {/* Score card */}
      <div className={`rounded-xl border p-8 text-center ${
        passed
          ? 'bg-green-500/10 border-green-500/30'
          : 'bg-red-500/10 border-red-500/30'
      }`}>
        {/* Icon */}
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
          passed ? 'bg-green-500/20' : 'bg-red-500/20'
        }`}>
          {passed ? (
            <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>

        <h2 className={`text-3xl font-bold mb-1 ${passed ? 'text-green-400' : 'text-red-400'}`}>
          {score_pct}%
        </h2>
        <p className={`font-semibold text-lg mb-2 ${passed ? 'text-green-300' : 'text-red-300'}`}>
          {passed ? 'Congratulations! You passed.' : 'Not quite — keep trying.'}
        </p>
        <p className="text-slate-400 text-sm">
          Pass mark: {pass_score}% · Attempt {attempt_number} of {max_attempts}
        </p>
      </div>

      {/* Question breakdown */}
      {result.questions && result.questions.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Question Breakdown</h3>
          <div className="space-y-2">
            {result.questions.map((q, i) => (
              <div key={q.id} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  q.isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}>
                  {q.isCorrect ? (
                    <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <span className="text-slate-400 text-sm">Question {i + 1}</span>
                <span className={`text-xs font-medium ml-auto ${
                  q.isCorrect ? 'text-green-400' : 'text-red-400'
                }`}>
                  {q.isCorrect ? 'Correct' : 'Incorrect'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        {can_retake && !passed && (
          <button
            onClick={onRetake}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg py-2.5 text-sm transition-colors"
          >
            Retake Quiz
          </button>
        )}
        <Link
          href={`/modules/${moduleId}`}
          className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg py-2.5 text-sm transition-colors text-center"
        >
          Back to Module
        </Link>
        <Link
          href="/modules"
          className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg py-2.5 text-sm transition-colors text-center"
        >
          All Modules
        </Link>
      </div>
    </div>
  )
}