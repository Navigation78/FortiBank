-- 026_certificates_per_module.sql
-- Switch certificates from per-role to per-module.
-- A certificate is now awarded once per module when the user passes the final exam.

-- 1. Clear existing role-based certificate records (paradigm change)
DELETE FROM public.certificates;

-- 2. Drop old role-based unique constraint
ALTER TABLE public.certificates
  DROP CONSTRAINT IF EXISTS certificates_user_id_role_id_key;

-- 3. Drop role_id column
ALTER TABLE public.certificates
  DROP COLUMN IF EXISTS role_id;

-- 4. Add module_id column
ALTER TABLE public.certificates
  ADD COLUMN IF NOT EXISTS module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE RESTRICT;

-- 5. One certificate per module per user
ALTER TABLE public.certificates
  ADD CONSTRAINT certificates_user_id_module_id_key UNIQUE (user_id, module_id);

-- 6. Update RLS: users see their own certs; admins see all
DROP POLICY IF EXISTS "Users read their own certificates" ON public.certificates;
DROP POLICY IF EXISTS "Admins manage certificates"        ON public.certificates;

CREATE POLICY "Users read their own certificates" ON public.certificates
  FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Admins manage certificates" ON public.certificates
  FOR ALL USING (public.is_admin());
