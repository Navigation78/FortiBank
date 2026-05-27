// src/app/api/admin/users/route.js
// POST - creates a new employee (auth + profile + role)
// Uses supabaseAdmin to bypass RLS for user creation


import { NextResponse } from 'next/server'
import supabaseAdmin from '@/lib/supabaseAdmin'
import { ROLES } from '@/constants/roles'
import { getRouteUser, unauthorizedResponse } from '@/lib/supabaseRoute'

export async function GET(request) {
  const { user, supabase, networkError } = await getRouteUser(request)

  if (!user) return unauthorizedResponse(networkError)

  const { data: adminCheck, error: roleError } = await supabase
    .from('user_roles')
    .select('roles(name)')
    .eq('user_id', user.id)
    .single()

  if (roleError || adminCheck?.roles?.name !== ROLES.SYSTEM_ADMIN) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  const { data, error } = await supabaseAdmin
    .from('users_with_roles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ users: data })
}

export async function POST(request) {
  const { user: adminUser, supabase, networkError } = await getRouteUser(request)

  if (!adminUser) return unauthorizedResponse(networkError)

  const { data: adminCheck, error: roleError } = await supabase
    .from('user_roles')
    .select('roles(name)')
    .eq('user_id', adminUser.id)
    .single()

  if (roleError || adminCheck?.roles?.name !== ROLES.SYSTEM_ADMIN) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  const body = await request.json()
  const { full_name, email, password, employee_id, department, role_id } = body

  if (!full_name || !email || !password || !role_id) {
    return NextResponse.json({ error: 'full_name, email, password and role_id are required' }, { status: 400 })
  }

  // 1. Create auth user
  const { data: authData, error: authCreateError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name,
      must_change_password: true,
    },
  })

  if (authCreateError) {
    return NextResponse.json({ error: authCreateError.message }, { status: 400 })
  }

  const newUserId = authData.user.id

  // 2. Update public.users profile (trigger creates the row, we update it)
  const { error: profileUpdateError } = await supabaseAdmin
    .from('users')
    .update({ employee_id, department })
    .eq('id', newUserId)

  if (profileUpdateError) {
    return NextResponse.json({ error: profileUpdateError.message }, { status: 500 })
  }

  // 3. Assign role
  const { error: roleAssignError } = await supabaseAdmin
    .from('user_roles')
    .insert({
      user_id:     newUserId,
      role_id:     parseInt(role_id),
      assigned_by: adminUser.id,
    })

  if (roleAssignError) {
    return NextResponse.json({ error: roleAssignError.message }, { status: 500 })
  }

  return NextResponse.json({ user: authData.user }, { status: 201 })
}
