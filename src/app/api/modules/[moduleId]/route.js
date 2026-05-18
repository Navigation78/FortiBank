// src/app/api/modules/[moduleId]/route.js
// GET /api/modules/:moduleId - returns a single module with
// all content blocks, progress, and quiz info.


import { NextResponse } from 'next/server'
import supabaseAdmin from '@/lib/supabaseAdmin'
import { getRouteUser } from '@/lib/supabaseRoute'

export async function GET(request, { params }) {
  const { moduleId } = await params
  const { user, error: authError } = await getRouteUser(request)
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: userRole, error: roleError } = await supabaseAdmin
    .from('user_roles')
    .select('role_id')
    .eq('user_id', user.id)
    .single()

  if (roleError || !userRole) {
    return NextResponse.json({ error: 'No role assigned to this user' }, { status: 403 })
  }

  const { data: module, error: moduleError } = await supabaseAdmin
    .from('modules')
    .select(`
      id,
      title,
      description,
      thumbnail_url,
      duration_mins,
      order_index,
      module_role_access!inner (
        role_id
      ),
      module_content (
        id,
        title,
        content_type,
        content_url,
        content_body,
        order_index
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
    .eq('module_role_access.role_id', userRole.role_id)
    .order('order_index', { foreignTable: 'module_content', ascending: true })
    .maybeSingle()

  if (moduleError) {
    return NextResponse.json({ error: moduleError.message }, { status: 500 })
  }

  if (!module) {
    return NextResponse.json(
      { error: 'This module could not be found or you do not have access.' },
      { status: 404 }
    )
  }

  const { data: progress } = await supabaseAdmin
    .from('user_module_progress')
    .select('status, progress_pct, started_at, completed_at')
    .eq('user_id', user.id)
    .eq('module_id', moduleId)
    .maybeSingle()

  return NextResponse.json({
    module: {
      id:             module.id,
      title:          module.title,
      description:    module.description,
      thumbnail_url:  module.thumbnail_url,
      duration_mins:  module.duration_mins,
      order_index:    module.order_index,
      content:  module.module_content || [],
      progress: progress || {
        status: 'not_started',
        progress_pct: 0,
      },
      quiz: module.quizzes?.[0] || null,
    },
  })
}
