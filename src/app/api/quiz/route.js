// ============================================================
// src/app/api/quiz/route.js
// GET /api/quiz?quizId=xxx — returns quiz with all questions,
// options, and the user's attempt count.
// ============================================================

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const quizId      = searchParams.get('quizId')
  const cookieStore = await cookies()

  if (!quizId) {
    return NextResponse.json({ error: 'quizId is required' }, { status: 400 })
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Fetch quiz with questions and options
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

  // Get attempt count for this user
  const { count } = await supabase
    .from('quiz_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('quiz_id', quizId)
    .eq('user_id', user.id)

  // Get best previous attempt
  const { data: bestAttempt } = await supabase
    .from('quiz_attempts')
    .select('score_pct, passed, submitted_at')
    .eq('quiz_id', quizId)
    .eq('user_id', user.id)
    .order('score_pct', { ascending: false })
    .limit(1)
    .single()

  // Shuffle questions order for security
  const questions = [...quiz.quiz_questions].sort(
    (a, b) => a.order_index - b.order_index
  )

  return NextResponse.json({
    quiz: {
      id:             quiz.id,
      title:          quiz.title,
      description:    quiz.description,
      pass_score:     quiz.pass_score,
      max_attempts:   quiz.max_attempts,
      time_limit_mins: quiz.time_limit_mins,
    },
    questions,
    attemptCount: count || 0,
    bestAttempt:  bestAttempt || null,
  })
}