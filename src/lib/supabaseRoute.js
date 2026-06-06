import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'

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
