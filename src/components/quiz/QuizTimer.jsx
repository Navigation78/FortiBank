'use client'

// src/components/quiz/QuizTimer.jsx
// Countdown timer displayed during a quiz

export default function QuizTimer({ timeLeft }) {
  if (timeLeft === null || timeLeft === undefined) return null

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const isLow   = timeLeft <= 60   // last minute
  const isUrgent = timeLeft <= 30  // last 30 seconds

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-mono font-semibold ${
      isUrgent ? 'bg-red-500/15 border-red-500/30 text-red-400 animate-pulse' :
      isLow    ? 'bg-orange-500/15 border-orange-500/30 text-orange-400' :
                 'bg-slate-800 border-slate-700 text-slate-300'
    }`}>
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  )
}