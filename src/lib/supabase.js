import { createBrowserClient } from '@supabase/ssr'
import { getTabId } from '@/lib/tabSession'

let browserClient
const SESSION_STORAGE_KEY = 'supabase-auth-token'

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
              return sessionStorage.getItem(SESSION_STORAGE_KEY)
            } catch {
              return null
            }
          },
          setItem: (_key, value) => {
            try {
              sessionStorage.setItem(SESSION_STORAGE_KEY, value)
            } catch {
              // Ignore storage errors.
            }
          },
          removeItem: () => {
            try {
              sessionStorage.removeItem(SESSION_STORAGE_KEY)
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
