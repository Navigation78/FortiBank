import { createBrowserClient } from '@supabase/ssr'
import { getTabId } from '@/lib/tabSession'

let browserClient

// Per-tab localStorage key: tab ID (from sessionStorage) keeps tabs isolated
// while localStorage persists the session across F5 reloads and tab reopens.
function getSessionKey() {
  return `supabase-auth-token-${getTabId() || 'default'}`
}

function createRuntimeClientKey() {
  const tabId = getTabId()
  const pageInstanceId =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`

  return `supabase-auth-channel-${tabId || 'tab'}-${pageInstanceId}`
}

export function createClient() {
  if (browserClient) return browserClient

  const storageKey = createRuntimeClientKey()

  browserClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        storageKey,
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
            } catch {
              // Ignore storage errors.
            }
          },
          removeItem: () => {
            try {
              localStorage.removeItem(getSessionKey())
            } catch {
              // Ignore storage errors.
            }
          },
        },
      },
    }
  )

  return browserClient
}
