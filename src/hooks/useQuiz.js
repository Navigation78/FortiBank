
// src/hooks/useQuiz.js
// Manages quiz state i.e fetching questions, tracking answers,
// handling timer, and submitting attempts.


import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'

export function useQuiz(quizId) {
  const { user } = useAuth()

  const [quiz, setQuiz]               = useState(null)
  const [questions, setQuestions]     = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers]         = useState({})  // { questionId: [optionId] }
  const [loading, setLoading]         = useState(true)
  const [submitting, setSubmitting]   = useState(false)
  const [result, setResult]           = useState(null)  // null until submitted
  const [error, setError]             = useState(null)
  const [timeLeft, setTimeLeft]       = useState(null)
  const [timerActive, setTimerActive] = useState(false)
  const [attemptCount, setAttemptCount] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    if (quizId) fetchQuiz()
    return () => clearInterval(timerRef.current)
  }, [quizId])

  // Start countdown timer
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            handleSubmit()  // Auto-submit when time runs out
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [timerActive])

  async function fetchQuiz() {
    setLoading(true)
    setError(null)

    const res = await fetch(`/api/quiz?quizId=${quizId}`)
    if (!res.ok) {
      setError('Failed to load quiz')
      setLoading(false)
      return
    }

    const data = await res.json()
    setQuiz(data.quiz)
    setQuestions(data.questions)
    setAttemptCount(data.attemptCount || 0)

    // Set timer if quiz has a time limit
    if (data.quiz?.time_limit_mins) {
      setTimeLeft(data.quiz.time_limit_mins * 60)
    }

    setLoading(false)
  }

  function startTimer() {
    if (quiz?.time_limit_mins) {
      setTimerActive(true)
    }
  }

  // Select an answer for a question
  function selectAnswer(questionId, optionId, questionType) {
    setAnswers(prev => {
      const current = prev[questionId] || []

      if (questionType === 'multi_select') {
        // Toggle selection for multi-select
        const exists = current.includes(optionId)
        return {
          ...prev,
          [questionId]: exists
            ? current.filter(id => id !== optionId)
            : [...current, optionId],
        }
      } else {
        // Single selection for multiple_choice and true_false
        return { ...prev, [questionId]: [optionId] }
      }
    })
  }

  function goToNext() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1)
    }
  }

  function goToPrev() {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
    }
  }

  function goToQuestion(index) {
    setCurrentIndex(index)
  }

  const handleSubmit = useCallback(async () => {
    if (!user || submitting) return
    setSubmitting(true)
    clearInterval(timerRef.current)
    setTimerActive(false)

    const res = await fetch('/api/quiz/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quiz_id:       quizId,
        answers,
        time_taken_secs: quiz?.time_limit_mins
          ? (quiz.time_limit_mins * 60) - (timeLeft || 0)
          : null,
      }),
    })

    if (!res.ok) {
      setError('Failed to submit quiz')
      setSubmitting(false)
      return
    }

    const data = await res.json()
    setResult(data)
    setSubmitting(false)
  }, [quizId, answers, quiz, timeLeft, user, submitting])

  function resetQuiz() {
    setCurrentIndex(0)
    setAnswers({})
    setResult(null)
    setError(null)
    clearInterval(timerRef.current)
    if (quiz?.time_limit_mins) {
      setTimeLeft(quiz.time_limit_mins * 60)
    }
    setTimerActive(false)
    fetchQuiz()
  }

  const currentQuestion    = questions[currentIndex]
  const isLastQuestion     = currentIndex === questions.length - 1
  const isFirstQuestion    = currentIndex === 0
  const answeredCount      = Object.keys(answers).length
  const allAnswered        = answeredCount === questions.length
  const canRetake          = quiz && attemptCount < quiz.max_attempts

  return {
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
  }
}

export default useQuiz