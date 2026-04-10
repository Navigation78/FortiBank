// src/app/api/quiz/submit/route.js
// POST /api/quiz/submit — scores a quiz attempt, saves it,
// and triggers a risk score recalculation.


import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import supabaseAdmin from '@/lib/supabaseAdmin'

export async function POST(request) {
  const cookieStore = await cookies()

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

  const body = await request.json()
  const { quiz_id, answers, time_taken_secs } = body

  if (!quiz_id || !answers) {
    return NextResponse.json({ error: 'quiz_id and answers are required' }, { status: 400 })
  }

  // 1. Fetch quiz details + correct answers (use admin to bypass RLS on options)
  const { data: quiz, error: quizError } = await supabaseAdmin
    .from('quizzes')
    .select(`
      id,
      pass_score,
      max_attempts,
      quiz_questions (
        id,
        points,
        question_type,
        quiz_options (
          id,
          is_correct
        )
      )
    `)
    .eq('id', quiz_id)
    .single()

  if (quizError) {
    return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
  }

  // 2. Check attempt limit
  const { count: attemptCount } = await supabaseAdmin
    .from('quiz_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('quiz_id', quiz_id)
    .eq('user_id', user.id)

  if (attemptCount >= quiz.max_attempts) {
    return NextResponse.json(
      { error: `Maximum attempts (${quiz.max_attempts}) reached` },
      { status: 403 }
    )
  }

  // 3. Score each question
  let totalPoints  = 0
  let earnedPoints = 0
  const questionResults = []

  for (const question of quiz.quiz_questions) {
    totalPoints += question.points
    const correctOptionIds = question.quiz_options
      .filter(o => o.is_correct)
      .map(o => o.id)

    const userAnswers = answers[question.id] || []

    let isCorrect = false
    if (question.question_type === 'multi_select') {
      // All correct options selected and no wrong ones
      const allCorrectSelected = correctOptionIds.every(id => userAnswers.includes(id))
      const noWrongSelected    = userAnswers.every(id => correctOptionIds.includes(id))
      isCorrect = allCorrectSelected && noWrongSelected
    } else {
      // Single answer — check if selected option is correct
      isCorrect = userAnswers.length === 1 && correctOptionIds.includes(userAnswers[0])
    }

    if (isCorrect) earnedPoints += question.points

    questionResults.push({
      question_id:         question.id,
      selected_option_ids: userAnswers,
      is_correct:          isCorrect,
    })
  }

  // 4. Calculate score percentage
  const scorePct = totalPoints > 0
    ? Math.round((earnedPoints / totalPoints) * 100)
    : 0

  // 5. Get attempt number
  const attemptNumber = (attemptCount || 0) + 1

  // 6. Save the attempt (use admin client to ensure it saves regardless of RLS)
  const { data: attempt, error: attemptError } = await supabaseAdmin
    .from('quiz_attempts')
    .insert({
      user_id:         user.id,
      quiz_id,
      pass_score:      quiz.pass_score,
      score_pct:       scorePct,
      time_taken_secs: time_taken_secs || null,
      attempt_number:  attemptNumber,
    })
    .select()
    .single()

  if (attemptError) {
    return NextResponse.json({ error: attemptError.message }, { status: 500 })
  }

  // 7. Save individual answers
  if (questionResults.length > 0) {
    await supabaseAdmin
      .from('quiz_attempt_answers')
      .insert(
        questionResults.map(r => ({
          attempt_id:          attempt.id,
          question_id:         r.question_id,
          selected_option_ids: r.selected_option_ids,
          is_correct:          r.is_correct,
        }))
      )
  }

  // 8. Recalculate risk score
  await supabaseAdmin.rpc('calculate_user_risk_score', { p_user_id: user.id })

  // 9. Return results with correct answers revealed
  const questionsWithAnswers = quiz.quiz_questions.map(q => ({
    id:          q.id,
    correctIds:  q.quiz_options.filter(o => o.is_correct).map(o => o.id),
    userAnswers: answers[q.id] || [],
    isCorrect:   questionResults.find(r => r.question_id === q.id)?.is_correct || false,
  }))

  return NextResponse.json({
    attempt_id:     attempt.id,
    score_pct:      scorePct,
    passed:         attempt.passed,
    pass_score:     quiz.pass_score,
    attempt_number: attemptNumber,
    max_attempts:   quiz.max_attempts,
    can_retake:     attemptNumber < quiz.max_attempts && !attempt.passed,
    questions:      questionsWithAnswers,
  })
}