// src/app/api/progress/route.js
// POST /api/progress - upserts user module progress.
// Called as the user moves through module content.

import { NextResponse } from 'next/server'
import { getRouteUser } from '@/lib/supabaseRoute'

export async function POST(request) {
  const { user, error: authError, supabase } = await getRouteUser(request)
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { module_id, status, progress_pct } = body

  if (!module_id || !status) {
    return NextResponse.json({ error: 'module_id and status are required' }, { status: 400 })
  }

  const now = new Date().toISOString()

  // Fetch the existing record so we can enforce forward-only progress
  const { data: existing } = await supabase
    .from('user_module_progress')
    .select('progress_pct, status, started_at, completed_at')
    .eq('user_id', user.id)
    .eq('module_id', module_id)
    .maybeSingle()

  const existingPct    = existing?.progress_pct ?? 0
  const existingStatus = existing?.status

  // Progress can only move forward
  const safePct = Math.max(Math.min(progress_pct ?? 0, 100), existingPct)
  // Never downgrade a completed module
  const safeStatus = existingStatus === 'completed' ? 'completed' : status
  // Preserve the original started_at rather than resetting it on every save
  const startedAt = existing?.started_at ?? (status === 'in_progress' ? now : null)
  // Preserve completed_at once set
  const completedAt = existing?.completed_at ?? (safeStatus === 'completed' ? now : null)

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
      {
        onConflict:        'user_id,module_id',
        ignoreDuplicates:  false,
      }
    )
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ progress: data })
}
