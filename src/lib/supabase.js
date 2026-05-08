import { createBrowserClient } from '@supabase/ssr'

let browserClient

export function createClient() {
  if (browserClient) return browserClient

  browserClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        storageKey: 'supabase-auth-token',
        storage: {
          getItem: (key) => {
            try {
              return sessionStorage.getItem(key)
            } catch {
              return null
            }
          },
          setItem: (key, value) => {
            try {
              sessionStorage.setItem(key, value)
            } catch {
              // Ignore storage errors.
            }
          },
          removeItem: (key) => {
            try {
              sessionStorage.removeItem(key)
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
