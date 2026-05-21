
-- 020_function_security.sql
-- Restrict SECURITY DEFINER functions to prevent anon/authenticated
-- roles from calling them directly via the REST API.


-- Trigger function: never callable directly via API
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;

-- Risk score calculation: only called server-side via service role key
REVOKE EXECUTE ON FUNCTION public.calculate_user_risk_score(uuid) FROM anon, authenticated;

-- RLS helpers: anon must never call these.
-- authenticated keeps EXECUTE because RLS policies on every table call
-- these functions at query time — revoking would cause permission errors.
REVOKE EXECUTE ON FUNCTION public.current_user_role() FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_admin_or_it() FROM anon;

-- Revoke is_it_professional if it exists (orphaned function not in migrations)
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'is_it_professional'
  ) THEN
    REVOKE EXECUTE ON FUNCTION public.is_it_professional() FROM anon;
  END IF;
END $$;
