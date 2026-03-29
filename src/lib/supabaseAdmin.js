import { createClient } from '@supabase/supabase-js'

// This client uses the service role key which bypasses RLS entirely.

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,// No need to refresh since this client is for server-side use only
      persistSession: false
    }
  }
)

export default supabaseAdmin