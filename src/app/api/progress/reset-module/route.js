// src/app/api/progress/reset-module/route.js
// POST /api/progress/reset-module
// Called when a user exhausts all exam attempts and chooses to redo the module.
// Resets module progress and topic progress, and clears exam attempts so the
// user gets 3 fresh attempts after completing the module content again.

import { NextResponse } from 'next/server'
import supabaseAdmin from '@/lib/supabaseAdmin'
import { getRouteUser, unauthorizedResponse } from '@/lib/supabaseRoute'

export async function POST(request) {
  const { user, networkError } = await getRouteUser(request)
  if (!user) return unauthorizedResponse(networkError)

  const { module_id, quiz_id } = await request.json()
  if (!module_id || !quiz_id) {
    return NextResponse.json({ error: 'module_id and quiz_id are required' }, { status: 400 })
  }

  // 1. Reset module progress to the beginning
  await supabaseAdmin
    .from('user_module_progress')
    .upsert(
      {
        user_id:      user.id,
        module_id,
        status:       'in_progress',
        progress_pct: 0,
        completed_at: null,
        updated_at:   new Date().toISOString(),
      },
      { onConflict: 'user_id,module_id', ignoreDuplicates: false }
    )

  // 2. Clear topic-level progress for this module
  await supabaseAdmin
    .from('user_topic_progress')
    .delete()
    .eq('user_id', user.id)
    .eq('module_id', module_id)

  // 3. Delete exam attempts so the user gets 3 fresh attempts
  await supabaseAdmin
    .from('quiz_attempts')
    .delete()
    .eq('user_id', user.id)
    .eq('quiz_id', quiz_id)

  return NextResponse.json({ ok: true })
}
