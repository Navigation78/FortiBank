import { createClient } from '@supabase/supabase-js'

// This client uses the service role key which bypasses RLS entirely.

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {//auth configures authentication behaviour of the supabase client.
      autoRefreshToken: false,// No need to refresh since this client is for server-side use only
      persistSession: false//each request is independent and so we don't want to persist any session data
    }
  }
)

export default supabaseAdmin