// src/app/api/admin/users/route.js
// GET  - list all users (admin only)
// POST - create a new employee (auth + profile + role)

import { NextResponse } from 'next/server'
import supabaseAdmin from '@/lib/supabaseAdmin'
import { ROLES } from '@/constants/roles'
import { getRouteUser, unauthorizedResponse } from '@/lib/supabaseRoute'
import { withApiHandler } from '@/lib/apiHandler'
import { ValidationError, ForbiddenError } from '@/lib/errors'

export const GET = withApiHandler(async (request) => {
  const { user, supabase, networkError } = await getRouteUser(request)
  if (!user) return unauthorizedResponse(networkError)

  const { data: adminCheck, error: roleError } = await supabase
    .from('user_roles')
    .select('roles(name)')
    .eq('user_id', user.id)
    .single()

  if (roleError || adminCheck?.roles?.name !== ROLES.SYSTEM_ADMIN) {
    throw new ForbiddenError('Admin access required')
  }

  const { data, error } = await supabaseAdmin
    .from('users_with_roles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ users: data })
})

export const POST = withApiHandler(async (request) => {
  const { user: adminUser, supabase, networkError } = await getRouteUser(request)
  if (!adminUser) return unauthorizedResponse(networkError)

  const { data: adminCheck, error: roleError } = await supabase
    .from('user_roles')
    .select('roles(name)')
    .eq('user_id', adminUser.id)
    .single()

  if (roleError || adminCheck?.roles?.name !== ROLES.SYSTEM_ADMIN) {
    throw new ForbiddenError('Admin access required')
  }

  const body = await request.json()
  const { full_name, email, password, employee_id, department, role_id } = body

  if (!full_name || !email || !password || !role_id) {
    throw new ValidationError('full_name, email, password and role_id are required', {
      fields: ['full_name', 'email', 'password', 'role_id'],
    })
  }

  const { data: authData, error: authCreateError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name, must_change_password: true },
  })

  if (authCreateError) {
    return NextResponse.json({ error: authCreateError.message }, { status: 400 })
  }

  const newUserId = authData.user.id

  const { error: profileUpdateError } = await supabaseAdmin
    .from('users')
    .update({ employee_id, department })
    .eq('id', newUserId)

  if (profileUpdateError) {
    return NextResponse.json({ error: profileUpdateError.message }, { status: 500 })
  }

  const { error: roleAssignError } = await supabaseAdmin
    .from('user_roles')
    .insert({ user_id: newUserId, role_id: parseInt(role_id), assigned_by: adminUser.id })

  if (roleAssignError) {
    return NextResponse.json({ error: roleAssignError.message }, { status: 500 })
  }

  return NextResponse.json({ user: authData.user }, { status: 201 })
})
