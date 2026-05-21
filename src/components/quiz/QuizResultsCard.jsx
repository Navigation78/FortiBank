'use client'

// src/components/quiz/QuizResultsCard.jsx
// Colorful result card shown immediately after a quiz or exam submission.
// Shows score as a fraction (e.g. "4/5"), a score-based message, and action buttons.

import Link from 'next/link'
import { Trophy, RotateCcw, BookOpen, ChevronRight, AlertTriangle } from 'lucide-react'

// ── Score-based message helpers ──────────────────────────────────────────────

function quizMessage(pct, correct, total) {
  if (correct === total) return { headline: 'Awesome! Perfect Score!', sub: `You nailed every question.` }
  if (pct >= 80)         return { headline: 'Great Job!',             sub: `${correct} out of ${total} — impressive work.` }
  if (pct >= 60)         return { headline: 'Good Effort',            sub: `${correct} out of ${total} — review any you missed.` }
  return                        { headline: 'Keep Trying',            sub: `${correct} out of ${total} — review the material and retry.` }
}

function examMessage(pct, passed, attemptsLeft) {
  if (passed && pct === 100) return { headline: 'Perfect Exam!',        sub: 'Flawless — exceptional result.' }
  if (passed && pct >= 90)   return { headline: 'Excellent!',           sub: 'Passed with distinction.' }
  if (passed)                return { headline: 'Exam Passed!',         sub: 'Well done — module complete.' }
  if (attemptsLeft === 0)    return { headline: 'Attempts Exhausted',   sub: 'Redo the module to unlock 3 fresh attempts.' }
  if (pct >= 70)             return { headline: 'So Close!',            sub: `${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} left — you need 80% to pass.` }
  return                            { headline: 'Not Quite Yet',        sub: `${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} left — review the module material.` }
}

// ── Gradient ring colours ────────────────────────────────────────────────────

function ringColour(pct, passed) {
  if (passed)    return 'from-green-500 to-emerald-400'
  if (pct >= 70) return 'from-amber-500 to-yellow-400'
  return                'from-red-500 to-rose-400'
}

function cardColour(pct, passed) {
  if (passed)    return 'border-green-500/25  bg-green-500/[0.04]'
  if (pct >= 70) return 'border-amber-500/25  bg-amber-500/[0.04]'
  return                'border-red-500/25    bg-red-500/[0.04]'
}

function textColour(pct, passed) {
  if (passed)    return 'text-green-400'
  if (pct >= 70) return 'text-amber-400'
  return                'text-red-400'
}

// ── Main component ───────────────────────────────────────────────────────────

export default function QuizResultsCard({
  result,           // { score_pct, passed, pass_score, attempt_number, max_attempts, can_retake, questions }
  isExam = false,   // true for final_exam, false for checkpoint/standalone quiz
  moduleId,
  onRetake,
  onRedoModule,
  nextModule,
}) {
  if (!result) return null

  const { score_pct, passed, pass_score, attempt_number, max_attempts, can_retake } = result
  const questions    = result.questions || []
  const correctCount = questions.filter(q => q.isCorrect).length
  const totalCount   = questions.length
  const attemptsLeft = max_attempts - attempt_number

  const msg   = isExam
    ? examMessage(score_pct, passed, attemptsLeft)
    : quizMessage(score_pct, correctCount, totalCount)

  const ring  = ringColour(score_pct, passed)
  const card  = cardColour(score_pct, passed)
  const clr   = textColour(score_pct, passed)

  return (
    <div className="space-y-5">
      {/* ── Main score card ── */}
      <div className={`rounded-2xl border p-8 text-center space-y-4 ${card}`}>

        {/* Fraction ring */}
        {totalCount > 0 && (
          <div className="flex justify-center">
            <div className={`relative w-24 h-24 rounded-full p-0.5 bg-gradient-to-br ${ring}`}>
              <div className="w-full h-full rounded-full bg-slate-900 flex flex-col items-center justify-center">
                <span className={`text-2xl font-bold tabular-nums leading-none ${clr}`}>
                  {correctCount}/{totalCount}
                </span>
                <span className="text-slate-500 text-[10px] mt-0.5">correct</span>
              </div>
            </div>
          </div>
        )}

        {/* Percentage */}
        <div>
          <p className={`text-5xl font-bold tabular-nums ${clr}`}>{score_pct}%</p>
          {totalCount === 0 && (
            <p className="text-slate-500 text-xs mt-1">score</p>
          )}
        </div>

        {/* Message */}
        <div>
          <p className={`text-lg font-semibold ${clr}`}>{msg.headline}</p>
          <p className="text-slate-400 text-sm mt-1">{msg.sub}</p>
        </div>

        {/* Meta */}
        <p className="text-slate-600 text-xs">
          Pass mark: {pass_score}% · Attempt {attempt_number} of {max_attempts}
        </p>
      </div>

      {/* ── Question breakdown dots ── */}
      {questions.length > 0 && (
        <div className="rounded-xl border border-white/[0.06] bg-slate-800/60 p-5">
          <h4 className="text-white text-sm font-semibold mb-4">Question Breakdown</h4>
          <div className="flex flex-wrap gap-2">
            {questions.map((q, i) => (
              <div
                key={q.id || i}
                title={`Question ${i + 1}: ${q.isCorrect ? 'Correct' : 'Incorrect'}`}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold ${
                  q.isCorrect
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-red-500/20  text-red-400  border border-red-500/30'
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
          <p className="text-slate-500 text-xs mt-3">
            {correctCount} correct · {totalCount - correctCount} incorrect
          </p>
        </div>
      )}

      {/* ── Action buttons ── */}
      <div className="flex flex-col sm:flex-row gap-3">

        {/* Retake — shown when failed and attempts remain */}
        {!passed && can_retake && onRetake && (
          <button
            onClick={onRetake}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            {isExam ? 'Retake Exam' : 'Retake Quiz'}
          </button>
        )}

        {/* Redo module — shown when exam attempts are exhausted */}
        {isExam && !passed && !can_retake && onRedoModule && (
          <button
            onClick={onRedoModule}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium rounded-xl transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            Redo Module
          </button>
        )}

        {/* Next module — shown when exam passed and a next module exists */}
        {isExam && passed && nextModule && (
          <Link
            href={`/modules/${nextModule.id}`}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-700 hover:bg-green-600 text-white text-sm font-medium rounded-xl transition-colors text-center"
          >
            <ChevronRight className="w-4 h-4" />
            Next: {nextModule.title}
          </Link>
        )}

        {/* Certificate link for passed exam */}
        {isExam && passed && (
          <Link
            href="/certificates"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-xl transition-colors text-center"
          >
            <Trophy className="w-4 h-4" />
            View Certificate
          </Link>
        )}

        {/* Back to module */}
        {moduleId && (
          <Link
            href={`/modules/${moduleId}`}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 text-sm font-medium rounded-xl transition-colors text-center"
          >
            Back to Module
          </Link>
        )}

      </div>
    </div>
  )
}
