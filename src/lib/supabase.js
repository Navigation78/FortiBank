import { createBrowserClient } from '@supabase/ssr'

let browserClient

export function createClient() {
  if (browserClient) {
    return browserClient
  }

  browserClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  return browserClient
}

const supabase = createClient()
export default supabase
