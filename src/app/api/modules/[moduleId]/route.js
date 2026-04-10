// src/app/api/modules/[moduleId]/route.js
// GET /api/modules/:moduleId — returns a single module with
// all content blocks, progress, and quiz info.


import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  const { moduleId } = await params
  const cookieStore  = await cookies()

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

  const { data, error } = await supabase
    .from('modules')
    .select(`
      id,
      title,
      description,
      thumbnail_url,
      duration_mins,
      order_index,
      module_content (
        id,
        title,
        content_type,
        content_url,
        content_body,
        order_index
      ),
      user_module_progress (
        status,
        progress_pct,
        started_at,
        completed_at
      ),
      quizzes (
        id,
        title,
        pass_score,
        max_attempts,
        time_limit_mins
      )
    `)
    .eq('id', moduleId)
    .eq('status', 'published')
    .order('order_index', { foreignTable: 'module_content', ascending: true })
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }

  return NextResponse.json({
    module: {
      ...data,
      content:  data.module_content || [],
      progress: data.user_module_progress?.[0] || {
        status: 'not_started',
        progress_pct: 0,
      },
      quiz: data.quizzes?.[0] || null,
    },
  })
}