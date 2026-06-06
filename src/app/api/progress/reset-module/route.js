// src/app/api/progress/reset-module/route.js
// POST /api/progress/reset-module
// Resets module + topic progress and clears exam attempts so user can redo the module.

import { NextResponse } from 'next/server'
import supabaseAdmin from '@/lib/supabaseAdmin'
import { getRouteUser, unauthorizedResponse } from '@/lib/supabaseRoute'
import { withApiHandler } from '@/lib/apiHandler'
import { ValidationError } from '@/lib/errors'

export const POST = withApiHandler(async (request) => {
  const { user, networkError } = await getRouteUser(request)
  if (!user) return unauthorizedResponse(networkError)

  const { module_id, quiz_id } = await request.json()
  if (!module_id || !quiz_id) {
    throw new ValidationError('module_id and quiz_id are required', { fields: ['module_id', 'quiz_id'] })
  }

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

  await supabaseAdmin
    .from('user_topic_progress')
    .delete()
    .eq('user_id', user.id)
    .eq('module_id', module_id)

  await supabaseAdmin
    .from('quiz_attempts')
    .delete()
    .eq('user_id', user.id)
    .eq('quiz_id', quiz_id)

  return NextResponse.json({ ok: true })
})
