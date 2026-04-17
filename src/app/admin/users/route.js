// src/app/api/admin/users/route.js
// POST — creates a new employee (auth + profile + role)
// Uses supabaseAdmin to bypass RLS for user creation


import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import supabaseAdmin from '@/lib/supabaseAdmin'

export async function GET() {
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

  const { data: adminCheck } = await supabaseAdmin
    .from('user_roles')
    .select('roles(name)')
    .eq('user_id', user.id)
    .single()

  if (adminCheck?.roles?.name !== 'system_admin') {
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

  const { data: { user: adminUser }, error: authError } = await supabase.auth.getUser()
  if (authError || !adminUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: adminCheck } = await supabaseAdmin
    .from('user_roles')
    .select('roles(name)')
    .eq('user_id', adminUser.id)
    .single()

  if (adminCheck?.roles?.name !== 'system_admin') {
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
    user_metadata: { full_name },
  })

  if (authCreateError) {
    return NextResponse.json({ error: authCreateError.message }, { status: 400 })
  }

  const newUserId = authData.user.id

  // 2. Update public.users profile (trigger creates the row, we update it)
  await supabaseAdmin
    .from('users')
    .update({ employee_id, department })
    .eq('id', newUserId)

  // 3. Assign role
  const { error: roleError } = await supabaseAdmin
    .from('user_roles')
    .insert({
      user_id:     newUserId,
      role_id:     parseInt(role_id),
      assigned_by: adminUser.id,
    })

  if (roleError) {
    return NextResponse.json({ error: roleError.message }, { status: 500 })
  }

  return NextResponse.json({ user: authData.user }, { status: 201 })
}