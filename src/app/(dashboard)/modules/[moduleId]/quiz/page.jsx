'use client'

// src/app/(dashboard)/modules/[moduleId]/quiz/page.jsx
// Full quiz experience — question flow, timer, submission

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Topbar from '@/components/layout/Topbar'
import PageWrapper from '@/components/layout/PageWrapper'
import QuizCard from '@/components/quiz/QuizCard'
import QuizProgress from '@/components/quiz/QuizProgress'
import QuizTimer from '@/components/quiz/QuizTimer'
import QuizResults from '@/components/quiz/QuizResults'
import { useQuiz } from '@/hooks/useQuiz'
import { useModules } from '@/hooks/useModules'

export default function QuizPage() {
  const { moduleId } = useParams()
  const { fetchModuleById } = useModules()

  // We need the quizId from the module
  const [quizId, setQuizId] = useState(null)
  const [moduleTitle, setModuleTitle] = useState('')
  const [loadingModule, setLoadingModule] = useState(true)

  useEffect(() => {
    async function getQuizId() {
      const { data } = await fetchModuleById(moduleId)
      if (data?.quiz?.id) {
        setQuizId(data.quiz.id)
        setModuleTitle(data.title)
      }
      setLoadingModule(false)
    }
    getQuizId()
  }, [moduleId])

  const {
    quiz,
    questions,
    currentQuestion,
    currentIndex,
    answers,
    loading,
    submitting,
    result,
    error,
    timeLeft,
    timerActive,
    attemptCount,
    isLastQuestion,
    isFirstQuestion,
    answeredCount,
    allAnswered,
    canRetake,
    selectAnswer,
    goToNext,
    goToPrev,
    goToQuestion,
    startTimer,
    handleSubmit,
    resetQuiz,
  } = useQuiz(quizId)

  // Start timer when quiz loads
  useEffect(() => {
    if (quiz && !timerActive && !result) {
      startTimer()
    }
  }, [quiz])

  if (loadingModule || loading) {
    return (
      <>
        <Topbar title="Loading quiz..." />
        <PageWrapper>
          <div className="max-w-2xl mx-auto space-y-4 animate-pulse">
            <div className="h-6 bg-slate-800 rounded w-1/3" />
            <div className="h-48 bg-slate-800 rounded-xl" />
          </div>
        </PageWrapper>
      </>
    )
  }

  if (!quizId || (!loading && questions.length === 0)) {
    return (
      <>
        <Topbar title="Quiz not available" />
        <PageWrapper>
          <div className="text-center py-16 max-w-md mx-auto">
            <p className="text-slate-400 mb-4">
              No quiz is available for this module yet.
            </p>
            <Link href={`/modules/${moduleId}`} className="text-blue-400 hover:text-blue-300 text-sm">
              ← Back to module
            </Link>
          </div>
        </PageWrapper>
      </>
    )
  }

  if (attemptCount >= quiz?.max_attempts && !result) {
    return (
      <>
        <Topbar title={quiz?.title || 'Quiz'} />
        <PageWrapper>
          <div className="text-center py-16 max-w-md mx-auto">
            <div className="w-14 h-14 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-white text-xl font-bold mb-2">Maximum attempts reached</h2>
            <p className="text-slate-400 text-sm mb-6">
              You have used all {quiz.max_attempts} attempts for this quiz.
            </p>
            <Link
              href={`/modules/${moduleId}`}
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg px-5 py-2.5 text-sm transition-colors inline-block"
            >
              Back to module
            </Link>
          </div>
        </PageWrapper>
      </>
    )
  }

  // Show results
  if (result) {
    return (
      <>
        <Topbar title="Quiz Results" />
        <PageWrapper>
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
              <Link href="/modules" className="hover:text-slate-300 transition-colors">Modules</Link>
              <span>/</span>
              <Link href={`/modules/${moduleId}`} className="hover:text-slate-300 transition-colors truncate">
                {moduleTitle}
              </Link>
              <span>/</span>
              <span className="text-slate-300">Results</span>
            </div>
            <QuizResults
              result={result}
              moduleId={moduleId}
              onRetake={resetQuiz}
              questions={questions}
            />
          </div>
        </PageWrapper>
      </>
    )
  }

  return (
    <>
      <Topbar title={quiz?.title || 'Quiz'} />
      <PageWrapper>
        <div className="max-w-2xl mx-auto">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/modules" className="hover:text-slate-300 transition-colors">Modules</Link>
            <span>/</span>
            <Link href={`/modules/${moduleId}`} className="hover:text-slate-300 transition-colors truncate">
              {moduleTitle}
            </Link>
            <span>/</span>
            <span className="text-slate-300">Quiz</span>
          </div>

          {/* Quiz header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-white font-bold text-xl">{quiz?.title}</h1>
              <p className="text-slate-400 text-sm mt-0.5">
                Pass mark: {quiz?.pass_score}% · Attempt {attemptCount + 1} of {quiz?.max_attempts}
              </p>
            </div>
            <QuizTimer timeLeft={timeLeft} />
          </div>

          {/* Progress tracker */}
          <div className="mb-6">
            <QuizProgress
              total={questions.length}
              current={currentIndex}
              answered={answeredCount}
              onJump={goToQuestion}
            />
          </div>

          {/* Current question */}
          {currentQuestion && (
            <div className="mb-6">
              <QuizCard
                question={currentQuestion}
                selectedIds={answers[currentQuestion.id] || []}
                onSelect={selectAnswer}
              />
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={goToPrev}
              disabled={isFirstQuestion}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 rounded-lg text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                disabled={submitting || !allAnswered}
                className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
              >
                {submitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Submitting...
                  </>
                ) : allAnswered ? 'Submit Quiz ✓' : `Answer all questions (${answeredCount}/${questions.length})`}
              </button>
            ) : (
              <button
                onClick={goToNext}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Next
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

        </div>
      </PageWrapper>
    </>
  )
}

