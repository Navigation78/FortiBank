// src/components/quiz/QuizResults.jsx
// Shown after a standalone quiz submission (used by the /quiz page route).

import QuizResultsCard from '@/components/quiz/QuizResultsCard'

export default function QuizResults({ result, moduleId, onRetake }) {
  if (!result) return null
  return (
    <QuizResultsCard
      result={result}
      isExam={false}
      moduleId={moduleId}
      onRetake={result.can_retake && !result.passed ? onRetake : null}
    />
  )
}
