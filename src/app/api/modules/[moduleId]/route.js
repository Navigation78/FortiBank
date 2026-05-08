// src/app/api/modules/[moduleId]/route.js
// GET /api/modules/:moduleId — returns a single module with
// all content blocks, progress, and quiz info.


import { NextResponse } from 'next/server'
import { getRouteUser } from '@/lib/supabaseRoute'

export async function GET(request, { params }) {
  const { moduleId } = await params
  const { user, error: authError, supabase } = await getRouteUser(request)
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
