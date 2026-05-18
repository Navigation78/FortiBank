// src/app/api/modules/route.js
// GET - returns published modules assigned to the current user's role
// Includes their progress on each module

import { NextResponse } from 'next/server'
import supabaseAdmin from '@/lib/supabaseAdmin'
import { getRouteUser } from '@/lib/supabaseRoute'

export async function GET(request) {
  // 1. Get the logged-in user
  const { user, error: authError } = await getRouteUser(request)
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Get the user's role_id from user_roles
  const { data: userRole, error: roleError } = await supabaseAdmin
    .from('user_roles')
    .select('role_id')
    .eq('user_id', user.id)
    .single()

  if (roleError || !userRole) {
    return NextResponse.json({ modules: [] })
  }

  const roleId = userRole.role_id

  // 3. Fetch published modules that include this role
  //    module_role_access!inner ensures only modules with a matching role come back
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

  // 4. Fetch the user's progress for all these modules in one query
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

  // 5. Merge progress into each module and strip the join table from the response
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

  return NextResponse.json({ modules: modulesWithProgress })
}
