
// src/app/api/admin/users/[userId]/role/route.js
// PUT — reassigns a user's role

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import supabaseAdmin from '@/lib/supabaseAdmin'
import { ROLES } from '@/constants/roles'

export async function PUT(request, { params }) {
  const { userId }  = await params
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: adminCheck, error: roleError } = await supabase
    .from('user_roles')
    .select('roles(name)')
    .eq('user_id', user.id)
    .single()

  if (roleError || adminCheck?.roles?.name !== ROLES.SYSTEM_ADMIN) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  const body = await request.json()
  const { role_id } = body

  if (!role_id) {
    return NextResponse.json({ error: 'role_id is required' }, { status: 400 })
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
}
