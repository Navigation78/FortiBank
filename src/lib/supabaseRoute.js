import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export function getBearerToken(request) {
  const authHeader = request?.headers?.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  return authHeader.slice('Bearer '.length)
}

export async function createRouteClient(request) {
  const token = getBearerToken(request)

  if (token) {
    return {
      token,
      tabId: request.headers.get('X-Tab-ID'),
      supabase: createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
          global: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        }
      ),
    }
  }

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

  return { token: null, tabId: request?.headers?.get('X-Tab-ID') ?? null, supabase }
}

export async function getRouteUser(request) {
  const { supabase, token, tabId } = await createRouteClient(request)
  const { data: { user }, error } = token
    ? await supabase.auth.getUser(token)
    : await supabase.auth.getUser()

  return { user, error, supabase, tabId }
}
