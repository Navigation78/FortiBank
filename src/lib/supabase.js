import { createBrowserClient } from '@supabase/ssr'//Importing a function that creates the supabase client for the browser

export function createClient() {//create client is a reusable function
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

// Default export for convenience -- new clients can be created with createClient() if needed
const supabase = createClient()
export default supabase