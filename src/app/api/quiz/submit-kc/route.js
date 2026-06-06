// src/app/api/quiz/submit-kc/route.js
// POST /api/quiz/submit-kc
// Saves the result of a subtopic inline knowledge-check quiz.

import { NextResponse } from 'next/server'
import supabaseAdmin from '@/lib/supabaseAdmin'
import { getRouteUser, unauthorizedResponse } from '@/lib/supabaseRoute'
import { withApiHandler } from '@/lib/apiHandler'
import { ValidationError } from '@/lib/errors'

export const POST = withApiHandler(async (request) => {
  const { user, networkError } = await getRouteUser(request)
  if (!user) return unauthorizedResponse(networkError)

  const body = await request.json()
  const { module_id, content_id, section_number, content_title, correct_count, total_count } = body

  if (!module_id || total_count == null || correct_count == null) {
    throw new ValidationError('module_id, correct_count, and total_count are required', {
      fields: ['module_id', 'correct_count', 'total_count'],
    })
  }

  const score_pct = total_count > 0
    ? Math.round((correct_count / total_count) * 100)
    : 0

  const { error } = await supabaseAdmin
    .from('knowledge_check_attempts')
    .insert({
      user_id:        user.id,
      module_id,
      content_id:     content_id    || null,
      section_number: section_number || null,
      content_title:  content_title  || null,
      correct_count,
      total_count,
      score_pct,
    })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, score_pct })
})
