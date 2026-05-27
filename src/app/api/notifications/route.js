// src/app/api/notifications/route.js
// GET  /api/notifications  - list notifications for current user
// POST /api/notifications  - internal: create a notification (admin only)

import { NextResponse } from 'next/server'
import supabaseAdmin from '@/lib/supabaseAdmin'
import { getRouteUser, unauthorizedResponse } from '@/lib/supabaseRoute'

const PAGE_SIZE = 20

export async function GET(request) {
  const { user, supabase, networkError } = await getRouteUser(request)
  if (!user) return unauthorizedResponse(networkError)

  const { searchParams } = new URL(request.url)
  const filter = searchParams.get('filter') || 'all'  // all | unread | read
  const type   = searchParams.get('type')  || null    // module | quiz | etc.
  const page   = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const offset = (page - 1) * PAGE_SIZE

  let query = supabase
    .from('notifications')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1)

  if (filter === 'unread') query = query.eq('is_read', false)
  if (filter === 'read')   query = query.eq('is_read', true)
  if (type)                query = query.eq('type', type)

  const { data, error, count } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    notifications: data || [],
    total:         count || 0,
    page,
    pageSize:      PAGE_SIZE,
    hasMore:       (count || 0) > offset + PAGE_SIZE,
  })
}

export async function POST(request) {
  // Internal: only system_admin may POST notifications via the API
  const { user, networkError } = await getRouteUser(request)
  if (!user) return unauthorizedResponse(networkError)

  const { data: roleData } = await supabaseAdmin
    .from('user_roles').select('roles(name)').eq('user_id', user.id).single()
  if (roleData?.roles?.name !== 'system_admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const { user_id, title, message, type, link } = body
  if (!user_id || !title || !message) {
    return NextResponse.json({ error: 'user_id, title, and message are required' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('notifications')
    .insert({ user_id, title, message, type: type || 'system', link: link || null })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ notification: data }, { status: 201 })
}
