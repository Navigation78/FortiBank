// src/app/api/quiz/route.js
// GET /api/quiz?quizId=xxx - returns quiz with all questions, options, and attempt count.

import { NextResponse } from 'next/server'
import { getRouteUser, unauthorizedResponse } from '@/lib/supabaseRoute'
import { withApiHandler } from '@/lib/apiHandler'
import { ValidationError } from '@/lib/errors'

export const GET = withApiHandler(async (request) => {
  const { searchParams } = new URL(request.url)
  const quizId = searchParams.get('quizId')

  if (!quizId) {
    throw new ValidationError('quizId is required', { field: 'quizId' })
  }

  const { user, supabase, networkError } = await getRouteUser(request)
  if (!user) return unauthorizedResponse(networkError)

  const { data: quiz, error: quizError } = await supabase
    .from('quizzes')
    .select(`
      id,
      title,
      description,
      pass_score,
      max_attempts,
      time_limit_mins,
      quiz_questions (
        id,
        question_text,
        question_type,
        explanation,
        order_index,
        points,
        quiz_options (
          id,
          option_text,
          order_index
        )
      )
    `)
    .eq('id', quizId)
    .order('order_index', { foreignTable: 'quiz_questions', ascending: true })
    .order('order_index', { foreignTable: 'quiz_questions.quiz_options', ascending: true })
    .single()

  if (quizError) {
    return NextResponse.json({ error: quizError.message }, { status: 404 })
  }

  const { count } = await supabase
    .from('quiz_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('quiz_id', quizId)
    .eq('user_id', user.id)

  const { data: bestAttempt } = await supabase
    .from('quiz_attempts')
    .select('score_pct, passed, submitted_at')
    .eq('quiz_id', quizId)
    .eq('user_id', user.id)
    .order('score_pct', { ascending: false })
    .limit(1)
    .single()

  const questions = [...quiz.quiz_questions].sort((a, b) => a.order_index - b.order_index)

  return NextResponse.json({
    quiz: {
      id:              quiz.id,
      title:           quiz.title,
      description:     quiz.description,
      pass_score:      quiz.pass_score,
      max_attempts:    quiz.max_attempts,
      time_limit_mins: quiz.time_limit_mins,
    },
    questions,
    attemptCount: count || 0,
    bestAttempt:  bestAttempt || null,
  })
})
