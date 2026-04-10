// src/app/api/progress/route.js
// POST /api/progress — upserts user module progress.
// Called as the user moves through module content.

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

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
  const { module_id, status, progress_pct } = body

  if (!module_id || !status) {
    return NextResponse.json({ error: 'module_id and status are required' }, { status: 400 })
  }

  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from('user_module_progress')
    .upsert(
      {
        user_id:      user.id,
        module_id,
        status,
        progress_pct: Math.min(progress_pct || 0, 100),
        started_at:   status === 'in_progress' ? now : undefined,
        completed_at: status === 'completed'   ? now : undefined,
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