// src/app/api/modules/route.js
// GET - returns published modules assigned to the current user's role with progress

import { NextResponse } from 'next/server'
import supabaseAdmin from '@/lib/supabaseAdmin'
import { getRouteUser, unauthorizedResponse } from '@/lib/supabaseRoute'
import { withApiHandler } from '@/lib/apiHandler'

export const GET = withApiHandler(async (request) => {
  const { user, networkError } = await getRouteUser(request)
  if (!user) return unauthorizedResponse(networkError)

  const { data: userRole, error: roleError } = await supabaseAdmin
    .from('user_roles')
    .select('role_id')
    .eq('user_id', user.id)
    .single()

  if (roleError || !userRole) {
    return NextResponse.json({ modules: [] })
  }

  const roleId = userRole.role_id

  const { data: modules, error: modulesError } = await supabaseAdmin
    .from('modules')
    .select(`
      id,
      title,
      description,
      thumbnail_url,
      status,
      order_index,
      duration_mins,
      created_at,
      module_role_access!inner ( role_id ),
      module_content (
        id,
        title,
        content_type,
        order_index
      )
    `)
    .eq('status', 'published')
    .eq('module_role_access.role_id', roleId)
    .order('order_index', { ascending: true })

  if (modulesError) {
    return NextResponse.json({ error: modulesError.message }, { status: 500 })
  }

  const moduleIds = (modules || []).map(m => m.id)

  let progressMap = {}
  if (moduleIds.length > 0) {
    const { data: progressRows } = await supabaseAdmin
      .from('user_module_progress')
      .select('module_id, status, progress_pct, started_at, completed_at')
      .eq('user_id', user.id)
      .in('module_id', moduleIds)

    progressMap = (progressRows || []).reduce((acc, row) => {
      acc[row.module_id] = row
      return acc
    }, {})
  }

  const modulesWithProgress = (modules || []).map(m => ({
    id:            m.id,
    title:         m.title,
    description:   m.description,
    thumbnail_url: m.thumbnail_url,
    duration_mins: m.duration_mins,
    order_index:   m.order_index,
    content:       m.module_content || [],
    progress:      progressMap[m.id] || {
      status:       'not_started',
      progress_pct: 0,
      started_at:   null,
      completed_at: null,
    },
  }))

  return NextResponse.json(
    { modules: modulesWithProgress },
    { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
  )
})
