import { createClient } from '@supabase/supabase-js'

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
  const { data: { user }, error } = token
    ? await supabase.auth.getUser(token)
    : await supabase.auth.getUser()

  return { user, error, supabase, tabId }
}
