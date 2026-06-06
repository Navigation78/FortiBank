// src/app/api/auth/login/route.js
// POST - signs in a user with email and password

import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { withApiHandler } from '@/lib/apiHandler'
import { ValidationError } from '@/lib/errors'

const ROLE_REDIRECT_MAP = {
  system_admin:               '/admin',
  branch_manager:             '/dashboard/branch-manager',
  assistant_branch_manager:   '/dashboard/assistant-branch-manager',
  credit_manager:             '/dashboard/credit-manager',
  customer_service_manager:   '/dashboard/customer-service-manager',
  relationship_manager:       '/dashboard/relationship-manager',
  relationship_officer:       '/dashboard/relationship-officer',
  credit_officer:             '/dashboard/credit-officer',
  service_recovery_officer:   '/dashboard/service-recovery-officer',
  head_teller:                '/dashboard/head-teller',
  teller:                     '/dashboard/teller',
  customer_service_assistant: '/dashboard/customer-service-assistant',
}

export const POST = withApiHandler(async (request) => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )

  const body = await request.json()
  const { email, password } = body

  if (!email || !password) {
    throw new ValidationError('Email and password are required', { fields: ['email', 'password'] })
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }

  const { data: userRole } = await supabase
    .from('user_roles')
    .select('roles ( name, display_name, category )')
    .eq('user_id', data.user.id)
    .single()

  const role = userRole?.roles?.name || null
  const redirectTo = ROLE_REDIRECT_MAP[role] || '/dashboard'

  return NextResponse.json({
    user: data.user,
    role,
    redirectTo,
    session: data.session,
  })
})
