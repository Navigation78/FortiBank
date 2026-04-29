
// src/app/api/auth/login/route.js
// POST — signs in a user with email and password
// Returns the user's role so the client can redirect correctly

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

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

  const body = await request.json()
  const { email, password } = body

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 }
    )
  }

  // Sign in with Supabase Auth
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 401 }
    )
  }

  // Fetch the user's role to determine redirect
  const { data: userRole } = await supabase
    .from('user_roles')
    .select(`
      roles (
        name,
        display_name,
        category
      )
    `)
    .eq('user_id', data.user.id)
    .single()

  const role = userRole?.roles?.name || null

  // Map role to dashboard URL
  const ROLE_REDIRECT_MAP = {
    system_admin:              '/admin',
    branch_manager:            '/dashboard/branch-manager',
    assistant_branch_manager:  '/dashboard/assistant-branch-manager',
    credit_manager:            '/dashboard/credit-manager',
    customer_service_manager:  '/dashboard/customer-service-manager',
    relationship_manager:      '/dashboard/relationship-manager',
    relationship_officer:      '/dashboard/relationship-officer',
    credit_officer:            '/dashboard/credit-officer',
    service_recovery_officer:  '/dashboard/service-recovery-officer',
    head_teller:               '/dashboard/head-teller',
    teller:                    '/dashboard/teller',
    customer_service_assistant: '/dashboard/customer-service-assistant',
  }

  const redirectTo = ROLE_REDIRECT_MAP[role] || '/login'

  return NextResponse.json({
    user:       data.user,
    role,
    redirectTo,
  })
}