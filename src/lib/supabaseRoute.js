import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'
import supabaseAdmin from '@/lib/supabaseAdmin'

export function getBearerToken(request) {
  const authHeader = request?.headers?.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  return authHeader.slice('Bearer '.length)
}

function makeSupabaseClient(bearerToken) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: { persistSession: false, autoRefreshToken: false },
      ...(bearerToken && {
        global: { headers: { Authorization: `Bearer ${bearerToken}` } },
      }),
    }
  )
}

export async function createRouteClient(request) {
  const token = getBearerToken(request)
  return {
    token,
    tabId: request?.headers?.get('X-Tab-ID') ?? null,
    supabase: makeSupabaseClient(token),
  }
}

export async function getRouteUser(request) {
  const { supabase, token, tabId } = await createRouteClient(request)

  let user = null
  let error = null
  let networkError = false

  try {
    const { data, error: authErr } = token
      ? await supabase.auth.getUser(token)
      : await supabase.auth.getUser()
    user = data?.user ?? null
    error = authErr ?? null
    // GoTrue API errors carry a numeric `status`; raw network/fetch failures don't
    if (error && typeof error.status !== 'number') {
      networkError = true
      logger.warn('[supabaseRoute] Auth service network error', { message: error.message })
    }
  } catch (err) {
    error = err
    networkError = true
    logger.error(err, { context: 'getRouteUser', route: request?.nextUrl?.pathname })
  }

  // Block users who are required to change their password before doing anything else.
  // The flag lives in JWT metadata — no extra DB call needed.
  if (user?.user_metadata?.must_change_password === true) {
    logger.warn('[supabaseRoute] Blocked: must_change_password', { userId: user.id })
    user = null
  }

  // Block deactivated accounts. Requires one DB lookup per request, but security > latency here.
  // Fails open on DB error so a transient outage doesn't lock out all employees.
  if (user) {
    try {
      const { data: profile } = await supabaseAdmin
        .from('users')
        .select('is_active')
        .eq('id', user.id)
        .single()
      if (profile && !profile.is_active) {
        logger.warn('[supabaseRoute] Blocked: account deactivated', { userId: user.id })
        user = null
      }
    } catch (profileErr) {
      logger.error(profileErr, { context: 'getRouteUser:is_active_check', userId: user.id })
    }
  }

  return { user, error, supabase, tabId, networkError }
}

export function unauthorizedResponse(networkError = false) {
  if (networkError) {
    return NextResponse.json(
      { error: 'Authentication service temporarily unavailable. Please try again.' },
      { status: 503 }
    )
  }
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
