// src/app/api/admin/modules/[moduleId]/progress/route.js
// GET - all users assigned to this module with their progress

import { NextResponse } from 'next/server'
import supabaseAdmin from '@/lib/supabaseAdmin'
import { getRouteUser, unauthorizedResponse } from '@/lib/supabaseRoute'
import { withApiHandler } from '@/lib/apiHandler'

async function verifyAdmin(request) {
  const { user, networkError } = await getRouteUser(request)
  if (!user) return networkError ? unauthorizedResponse(true) : null
  const { data: roleData } = await supabaseAdmin
    .from('user_roles').select('roles(name)').eq('user_id', user.id).single()
  if (roleData?.roles?.name !== 'system_admin') return null
  return user
}

export const GET = withApiHandler(async (request, { params }) => {
  const admin = await verifyAdmin(request)
  if (admin instanceof Response) return admin
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { moduleId } = await params

  const { data: roleAccess, error: roleAccessError } = await supabaseAdmin
    .from('module_role_access')
    .select('role_id')
    .eq('module_id', moduleId)

  if (roleAccessError) return NextResponse.json({ error: roleAccessError.message }, { status: 500 })

  const roleIds = (roleAccess || []).map(r => r.role_id)
  if (roleIds.length === 0) return NextResponse.json({ users: [] })

  const { data: userRoles, error: userRolesError } = await supabaseAdmin
    .from('user_roles')
    .select('user_id, roles(name, display_name)')
    .in('role_id', roleIds)
    .neq('roles.name', 'system_admin')

  if (userRolesError) return NextResponse.json({ error: userRolesError.message }, { status: 500 })

  const filtered = (userRoles || []).filter(ur => ur.roles?.name !== 'system_admin')
  if (filtered.length === 0) return NextResponse.json({ users: [] })

  const userIds = [...new Set(filtered.map(ur => ur.user_id))]

  const [usersRes, progressRes] = await Promise.all([
    supabaseAdmin.from('users').select('id, full_name, email').in('id', userIds),
    supabaseAdmin
      .from('user_module_progress')
      .select('user_id, status, progress_pct, started_at, completed_at')
      .eq('module_id', moduleId)
      .in('user_id', userIds),
  ])

  if (usersRes.error)    return NextResponse.json({ error: usersRes.error.message },    { status: 500 })
  if (progressRes.error) return NextResponse.json({ error: progressRes.error.message }, { status: 500 })

  const userMap = {}
  ;(usersRes.data || []).forEach(u => { userMap[u.id] = u })

  const progressMap = {}
  ;(progressRes.data || []).forEach(p => { progressMap[p.user_id] = p })

  const roleMap = {}
  filtered.forEach(ur => {
    if (!roleMap[ur.user_id]) roleMap[ur.user_id] = ur.roles?.display_name || ur.roles?.name || ''
  })

  const result = userIds.map(userId => ({
    user_id:   userId,
    full_name: userMap[userId]?.full_name || 'Unknown',
    email:     userMap[userId]?.email || '',
    role:      roleMap[userId] || '',
    progress:  progressMap[userId] || { status: 'not_started', progress_pct: 0 },
  }))

  result.sort((a, b) => (b.progress.progress_pct || 0) - (a.progress.progress_pct || 0))

  return NextResponse.json({ users: result })
})
