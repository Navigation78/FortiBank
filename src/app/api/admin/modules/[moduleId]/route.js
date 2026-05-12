// src/app/api/admin/modules/[moduleId]/route.js
// DELETE — delete a module

import { NextResponse } from 'next/server'
import supabaseAdmin from '@/lib/supabaseAdmin'
import { getRouteUser } from '@/lib/supabaseRoute'

async function verifyAdmin(request) {
  const { user } = await getRouteUser(request)
  if (!user) return null
  const { data: roleData } = await supabaseAdmin
    .from('user_roles').select('roles(name)').eq('user_id', user.id).single()
  if (roleData?.roles?.name !== 'system_admin') return null
  return user
}

export async function DELETE(request, { params }) {
  const admin = await verifyAdmin(request)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { moduleId } = await params

  // Delete the module (cascading deletes should handle related records)
  const { error } = await supabaseAdmin
    .from('modules')
    .delete()
    .eq('id', moduleId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}