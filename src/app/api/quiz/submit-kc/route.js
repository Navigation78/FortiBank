// src/app/api/quiz/submit-kc/route.js
// POST /api/quiz/submit-kc
// Saves the result of a subtopic inline knowledge-check quiz.
// These are the 3-MCQ panels embedded at the end of each subtopic page.

import { NextResponse } from 'next/server'
import supabaseAdmin from '@/lib/supabaseAdmin'
import { getRouteUser, unauthorizedResponse } from '@/lib/supabaseRoute'

export async function POST(request) {
  const { user, networkError } = await getRouteUser(request)
  if (!user) return unauthorizedResponse(networkError)

  const body = await request.json()
  const { module_id, content_id, section_number, content_title, correct_count, total_count } = body

  if (!module_id || total_count == null || correct_count == null) {
    return NextResponse.json(
      { error: 'module_id, correct_count, and total_count are required' },
      { status: 400 }
    )
  }

  const score_pct = total_count > 0
    ? Math.round((correct_count / total_count) * 100)
    : 0

  const { error } = await supabaseAdmin
    .from('knowledge_check_attempts')
    .insert({
      user_id:        user.id,
      module_id,
      content_id:     content_id   || null,
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
}
