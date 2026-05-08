// ============================================================
// src/app/api/modules/route.js
// GET /api/modules — returns all published modules for the
// current user's role, with their progress included.
// ============================================================

import { NextResponse } from 'next/server'
import { getRouteUser } from '@/lib/supabaseRoute'

export async function GET(request) {
  const { user, error: authError, supabase } = await getRouteUser(request)
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // RLS handles role filtering automatically
  const { data, error } = await supabase
    .from('modules')
    .select(`
      id,
      title,
      description,
      thumbnail_url,
      duration_mins,
      order_index,
      user_module_progress (
        status,
        progress_pct,
        started_at,
        completed_at
      )
    `)
    .eq('status', 'published')
    .order('order_index', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const modules = data.map(m => ({
    ...m,
    progress: m.user_module_progress?.[0] || {
      status: 'not_started',
      progress_pct: 0,
    },
  }))

  return NextResponse.json({ modules })
}
