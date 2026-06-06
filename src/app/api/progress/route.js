// src/app/api/progress/route.js
// POST /api/progress - upserts user module progress.

import { NextResponse } from 'next/server'
import { getRouteUser, unauthorizedResponse } from '@/lib/supabaseRoute'
import { withApiHandler } from '@/lib/apiHandler'
import { ValidationError } from '@/lib/errors'

export const POST = withApiHandler(async (request) => {
  const { user, supabase, networkError } = await getRouteUser(request)
  if (!user) return unauthorizedResponse(networkError)

  const body = await request.json()
  const { module_id, status, progress_pct } = body

  if (!module_id || !status) {
    throw new ValidationError('module_id and status are required', { fields: ['module_id', 'status'] })
  }

  const now = new Date().toISOString()

  const { data: existing } = await supabase
    .from('user_module_progress')
    .select('progress_pct, status, started_at, completed_at')
    .eq('user_id', user.id)
    .eq('module_id', module_id)
    .maybeSingle()

  const existingPct    = existing?.progress_pct ?? 0
  const existingStatus = existing?.status

  const safePct      = Math.max(Math.min(progress_pct ?? 0, 100), existingPct)
  const safeStatus   = existingStatus === 'completed' ? 'completed' : status
  const startedAt    = existing?.started_at ?? (status === 'in_progress' ? now : null)
  const completedAt  = existing?.completed_at ?? (safeStatus === 'completed' ? now : null)

  const { data, error } = await supabase
    .from('user_module_progress')
    .upsert(
      {
        user_id:      user.id,
        module_id,
        status:       safeStatus,
        progress_pct: safePct,
        started_at:   startedAt,
        completed_at: completedAt,
        updated_at:   now,
      },
      { onConflict: 'user_id,module_id', ignoreDuplicates: false }
    )
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ progress: data })
})
