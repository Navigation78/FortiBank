// src/app/api/quiz/submit/route.js
// POST /api/quiz/submit - scores a quiz attempt, saves it, triggers risk score recalculation.

import { NextResponse } from 'next/server'
import supabaseAdmin from '@/lib/supabaseAdmin'
import { getRouteUser, unauthorizedResponse } from '@/lib/supabaseRoute'
import { createNotification, NOTIFICATION_TYPES } from '@/lib/notificationService'
import { withApiHandler } from '@/lib/apiHandler'
import { ValidationError, BusinessLogicError, ConflictError } from '@/lib/errors'
import { awardModuleCertificate } from '@/lib/certificateService'

export const POST = withApiHandler(async (request) => {
  const { user, networkError } = await getRouteUser(request)
  if (!user) return unauthorizedResponse(networkError)

  const body = await request.json()
  const { quiz_id, answers, time_taken_secs } = body

  if (!quiz_id || !answers) {
    throw new ValidationError('quiz_id and answers are required', { fields: ['quiz_id', 'answers'] })
  }

  const { data: quiz, error: quizError } = await supabaseAdmin
    .from('quizzes')
    .select(`
      id,
      module_id,
      pass_score,
      max_attempts,
      quiz_type,
      section_number,
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

  if (quiz.quiz_questions.length === 0) {
    throw new BusinessLogicError('This quiz has no questions and cannot be submitted')
  }

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
      const allCorrectSelected = correctOptionIds.every(id => userAnswers.includes(id))
      const noWrongSelected    = userAnswers.every(id => correctOptionIds.includes(id))
      isCorrect = allCorrectSelected && noWrongSelected
    } else {
      isCorrect = userAnswers.length === 1 && correctOptionIds.includes(userAnswers[0])
    }

    if (isCorrect) earnedPoints += question.points

    questionResults.push({
      question_id:         question.id,
      selected_option_ids: userAnswers,
      is_correct:          isCorrect,
    })
  }

  const scorePct      = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0
  const attemptNumber = (attemptCount || 0) + 1

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
    // 23505 = unique_violation: two concurrent submissions with the same attempt_number
    if (attemptError.code === '23505') {
      throw new ConflictError('Quiz attempt already submitted. Please check your results.')
    }
    return NextResponse.json({ error: attemptError.message }, { status: 500 })
  }

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

  if (quiz.quiz_type === 'checkpoint' && quiz.module_id && quiz.section_number) {
    await supabaseAdmin
      .from('user_topic_progress')
      .upsert(
        {
          user_id:           user.id,
          module_id:         quiz.module_id,
          section_number:    quiz.section_number,
          checkpoint_passed: attempt.passed,
          checkpoint_score:  scorePct,
          completed_at:      attempt.passed ? new Date().toISOString() : null,
          updated_at:        new Date().toISOString(),
        },
        { onConflict: 'user_id,module_id,section_number', ignoreDuplicates: false }
      )
  }

  await supabaseAdmin.rpc('calculate_user_risk_score', { p_user_id: user.id })

  // When the final exam is passed, mark the module as completed server-side.
  // The LMS viewer also calls completeModule() from the client, but doing it
  // here guarantees progress is recorded even if the client navigates away first.
  if (quiz.quiz_type === 'final_exam' && attempt.passed && quiz.module_id) {
    const completedAt = new Date().toISOString()
    await supabaseAdmin
      .from('user_module_progress')
      .upsert(
        {
          user_id:      user.id,
          module_id:    quiz.module_id,
          status:       'completed',
          progress_pct: 100,
          completed_at: completedAt,
          updated_at:   completedAt,
        },
        { onConflict: 'user_id,module_id', ignoreDuplicates: false }
      )

    awardModuleCertificate(user.id, quiz.module_id).catch(() => {})
  }

  const passed = attempt.passed
  await createNotification({
    userId:  user.id,
    title:   passed ? 'Quiz passed!' : 'Quiz submitted',
    message: passed
      ? `You scored ${scorePct}% — well done! You have passed this quiz.`
      : `You scored ${scorePct}%. The passing score is ${quiz.pass_score}%.${attemptNumber < quiz.max_attempts ? ' You may retake the quiz.' : ' No more attempts remaining.'}`,
    type:    NOTIFICATION_TYPES.QUIZ,
    link:    `/modules/${quiz.module_id}`,
  })

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
})
