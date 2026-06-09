// src/app/api/auth/login/route.js
// POST - signs in a user with email and password

import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import supabaseAdmin from '@/lib/supabaseAdmin'
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

// In-memory rate limiter: 5 failed attempts per email per 15 minutes.
// Effective for single-instance deployments. For multi-instance production (e.g. Vercel),
// swap the Map for a Redis/Upstash store.
const loginAttempts = new Map()
const RATE_LIMIT_MAX    = 5
const RATE_LIMIT_WINDOW = 15 * 60 * 1000

function isRateLimited(email) {
  const now   = Date.now()
  const entry = loginAttempts.get(email)

  if (!entry || now > entry.resetAt) {
    loginAttempts.set(email, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    return false
  }

  if (entry.count >= RATE_LIMIT_MAX) return true
  entry.count++
  return false
}

export const POST = withApiHandler(async (request) => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )

  const body = await request.json()
  const { email: rawEmail, password } = body

  if (!rawEmail || !password) {
    throw new ValidationError('Email and password are required', { fields: ['email', 'password'] })
  }

  const email = rawEmail.toLowerCase().trim()

  if (isRateLimited(email)) {
    return NextResponse.json(
      { error: 'Too many login attempts. Please try again in 15 minutes.' },
      { status: 429 }
    )
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }

  // Prevent deactivated accounts from obtaining a session
  const { data: profile } = await supabaseAdmin
    .from('users')
    .select('is_active')
    .eq('id', data.user.id)
    .single()

  if (profile && !profile.is_active) {
    return NextResponse.json(
      { error: 'Your account has been deactivated. Please contact your administrator.' },
      { status: 403 }
    )
  }

  // Clear failed-attempt counter on successful login
  loginAttempts.delete(email)

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
