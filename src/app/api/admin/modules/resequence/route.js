// src/app/api/admin/modules/resequence/route.js
// POST - renumber module order_index values contiguously from 1.

import { NextResponse } from 'next/server'
import supabaseAdmin from '@/lib/supabaseAdmin'
import { getRouteUser, unauthorizedResponse } from '@/lib/supabaseRoute'

async function verifyAdmin(request) {
  const { user, networkError } = await getRouteUser(request)
  if (!user) return networkError ? unauthorizedResponse(true) : null
  const { data: roleData } = await supabaseAdmin
    .from('user_roles').select('roles(name)').eq('user_id', user.id).single()
  if (roleData?.roles?.name !== 'system_admin') return null
  return user
}

export async function POST(request) {
  const admin = await verifyAdmin(request)
  if (admin instanceof Response) return admin
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: modules, error: fetchError } = await supabaseAdmin
    .from('modules')
    .select('id, order_index, created_at')
    .order('order_index', { ascending: true })
    .order('created_at', { ascending: true })

  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 })

  const updates = (modules || []).map((module, index) =>
    supabaseAdmin
      .from('modules')
      .update({ order_index: index + 1 })
      .eq('id', module.id)
  )

  const results = await Promise.all(updates)
  const updateError = results.find(result => result.error)?.error
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })

  return NextResponse.json({ success: true, count: modules?.length || 0 })
}
