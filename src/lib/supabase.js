// Using @supabase/supabase-js directly (NOT @supabase/ssr) because:
// - Our API routes authenticate via Bearer token, not cookies.
// - @supabase/ssr writes sb-* cookie chunks for SSR session sync even when a
//   custom storage adapter is provided.  Those chunks accumulate across logins
//   (especially with 12 different role accounts) and push request headers over
//   Vercel's size limit (494 REQUEST_HEADER_TOO_LARGE).
// - createClient from supabase-js honours only the custom storage adapter below
//   and writes no cookies at all.
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { getTabId } from '@/lib/tabSession'

let browserClient

// Per-tab localStorage key keeps tabs isolated while persisting across reloads.
function getSessionKey() {
  return `supabase-auth-token-${getTabId() || 'default'}`
}

// Remove any leftover sb-* cookie chunks from previous @supabase/ssr sessions.
// Runs once on first client creation; safe to call multiple times.
function clearLegacySupabaseCookies() {
  if (typeof document === 'undefined') return
  try {
    document.cookie.split(';').forEach(cookie => {
      const name = cookie.split('=')[0].trim()
      if (name.startsWith('sb-') && name.includes('-auth-token')) {
        // Delete for both the current path and root, covering all possible
        // paths that @supabase/ssr may have used when writing the cookie.
        document.cookie = `${name}=; Max-Age=0; path=/`
        document.cookie = `${name}=; Max-Age=0; path=/; domain=${location.hostname}`
      }
    })
  } catch {
    // Non-fatal — best effort cleanup.
  }
}

export function createClient() {
  if (browserClient) return browserClient

  clearLegacySupabaseCookies()

  // Per-tab storageKey gives each tab its own BroadcastChannel name so auth
  // events (SIGNED_IN, TOKEN_REFRESHED, SIGNED_OUT) from one tab are not
  // broadcast to other tabs that may be logged in as a different user.
  const tabId = getTabId() || 'default'

  browserClient = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        storageKey: `sb-fortibank-${tabId}`,
        storage: {
          getItem: () => {
            try {
              return localStorage.getItem(getSessionKey())
            } catch {
              return null
            }
          },
          setItem: (_key, value) => {
            try {
              localStorage.setItem(getSessionKey(), value)
            } catch {}
          },
          removeItem: () => {
            try {
              localStorage.removeItem(getSessionKey())
            } catch {}
          },
        },
        persistSession:   true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    }
  )

  return browserClient
}
