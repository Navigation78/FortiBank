// ============================================================
// src/app/api/modules/route.js
// GET /api/modules — returns all published modules for the
// current user's role, with their progress included.
// ============================================================

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
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

  // Verify auth
  const { data: { user }, error: authError } = await supabase.auth.getUser()
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