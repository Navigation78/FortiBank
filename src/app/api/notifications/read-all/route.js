// src/app/api/notifications/read-all/route.js
// PATCH /api/notifications/read-all - mark all as read for current user

import { NextResponse } from 'next/server'
import { getRouteUser } from '@/lib/supabaseRoute'

export async function PATCH(request) {
  const { user, error: authError, supabase } = await getRouteUser(request)
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', user.id)
    .eq('is_read', false)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
