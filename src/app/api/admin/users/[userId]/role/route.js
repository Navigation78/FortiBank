// src/app/api/admin/users/[userId]/role/route.js
// PUT - reassigns a user's role

import { NextResponse } from 'next/server'
import supabaseAdmin from '@/lib/supabaseAdmin'
import { ROLES } from '@/constants/roles'
import { getRouteUser, unauthorizedResponse } from '@/lib/supabaseRoute'
import { withApiHandler } from '@/lib/apiHandler'
import { ValidationError, ForbiddenError } from '@/lib/errors'

export const PUT = withApiHandler(async (request, { params }) => {
  const { userId }  = await params
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

  const body = await request.json()
  const { role_id } = body

  if (!role_id) {
    throw new ValidationError('role_id is required', { field: 'role_id' })
  }

  const { error: deleteError } = await supabaseAdmin
    .from('user_roles')
    .delete()
    .eq('user_id', userId)

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 })
  }

  const { error } = await supabaseAdmin
    .from('user_roles')
    .insert({ user_id: userId, role_id, assigned_by: user.id })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
})
