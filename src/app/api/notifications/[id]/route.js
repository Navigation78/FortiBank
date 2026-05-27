// src/app/api/notifications/[id]/route.js
// PATCH  /api/notifications/:id  - mark as read/unread
// DELETE /api/notifications/:id  - delete a notification

import { NextResponse } from 'next/server'
import { getRouteUser, unauthorizedResponse } from '@/lib/supabaseRoute'

export async function PATCH(request, { params }) {
  const { user, supabase, networkError } = await getRouteUser(request)
  if (!user) return unauthorizedResponse(networkError)

  const { id } = await params
  const body = await request.json()
  const { is_read } = body

  if (typeof is_read !== 'boolean') {
    return NextResponse.json({ error: 'is_read (boolean) is required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data)  return NextResponse.json({ error: 'Not found' },  { status: 404 })

  return NextResponse.json({ notification: data })
}

export async function DELETE(request, { params }) {
  const { user, supabase, networkError } = await getRouteUser(request)
  if (!user) return unauthorizedResponse(networkError)

  const { id } = await params

  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
