
-- FULL ROLES RESET MIGRATION

-- Step 1: Drop everything that depends on the old roles
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.module_role_access CASCADE;
DROP VIEW IF EXISTS public.users_with_roles CASCADE;
DROP TYPE IF EXISTS public.app_role CASCADE;

-- Step 2: Recreate the enum with new roles only
CREATE TYPE public.app_role AS ENUM (
  'branch_manager',
  'assistant_branch_manager',
  'credit_manager',
  'customer_service_manager',
  'relationship_manager',
  'relationship_officer',
  'credit_officer',
  'service_recovery_officer',
  'head_teller',
  'teller',
  'customer_service_assistant',
  'system_admin'
);

-- Step 3: Drop and recreate roles table
DROP TABLE IF EXISTS public.roles CASCADE;

CREATE TABLE public.roles (
  id                       SERIAL PRIMARY KEY,
  name                     public.app_role NOT NULL UNIQUE,
  display_name             TEXT NOT NULL,
  category                 TEXT NOT NULL,
  description              TEXT,
  risk_warning_threshold   INT NOT NULL DEFAULT 55,
  risk_critical_threshold  INT NOT NULL DEFAULT 70,
  has_modules              BOOLEAN NOT NULL DEFAULT TRUE,
  has_admin_access         BOOLEAN NOT NULL DEFAULT FALSE,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Step 4: Insert all new roles
INSERT INTO public.roles (
  name, display_name, category, description,
  risk_warning_threshold, risk_critical_threshold,
  has_modules, has_admin_access
) VALUES
  ('branch_manager',
   'Branch Manager', 'Leadership',
   'Overall responsibility for branch performance, compliance and staff.',
   45, 58, TRUE, FALSE),

  ('assistant_branch_manager',
   'Assistant Branch Manager', 'Leadership',
   'Deputises the branch manager and oversees daily operations.',
   45, 58, TRUE, FALSE),

  ('credit_manager',
   'Credit Manager', 'Departmental Heads',
   'Manages credit appraisal and loan portfolio.',
   50, 63, TRUE, FALSE),

  ('customer_service_manager',
   'Customer Service Manager', 'Departmental Heads',
   'Oversees customer experience and service delivery.',
   50, 63, TRUE, FALSE),

  ('relationship_manager',
   'Relationship Manager', 'Departmental Heads',
   'Manages key client relationships and business development.',
   50, 63, TRUE, FALSE),

  ('relationship_officer',
   'Relationship Officer', 'Professional Staff',
   'Handles client accounts and supports relationship managers.',
   55, 68, TRUE, FALSE),

  ('credit_officer',
   'Credit Officer', 'Professional Staff',
   'Processes loan applications and credit assessments.',
   55, 68, TRUE, FALSE),

  ('service_recovery_officer',
   'Service Recovery Officer', 'Professional Staff',
   'Resolves customer complaints and escalations.',
   55, 68, TRUE, FALSE),

  ('head_teller',
   'Head Teller / Vault Custodian', 'Frontline Staff',
   'Manages teller operations and vault access.',
   58, 72, TRUE, FALSE),

  ('teller',
   'Bank Teller', 'Frontline Staff',
   'Handles cash transactions and customer interactions.',
   58, 72, TRUE, FALSE),

  ('customer_service_assistant',
   'Customer Service Assistant', 'Frontline Staff',
   'First point of contact for customers.',
   58, 72, TRUE, FALSE),

  ('system_admin',
   'System Admin', 'System',
   'Manages the training platform — users, modules, campaigns and reports.',
   40, 55, FALSE, TRUE);

-- Step 5: Recreate user_roles table
CREATE TABLE public.user_roles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role_id     INT  NOT NULL REFERENCES public.roles(id) ON DELETE RESTRICT,
  assigned_by UUID REFERENCES public.users(id),
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Step 6: Recreate module_role_access table
CREATE TABLE public.module_role_access (
  id        SERIAL PRIMARY KEY,
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  role_id   INT  NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  UNIQUE(module_id, role_id)
);

-- Step 7: Recreate users_with_roles view
CREATE OR REPLACE VIEW public.users_with_roles
  WITH (security_invoker = true)
AS
SELECT
  u.id,
  u.email,
  u.full_name,
  u.employee_id,
  u.department,
  u.avatar_url,
  u.is_active,
  r.name                    AS role,
  r.display_name            AS role_display_name,
  r.category                AS role_category,
  r.has_modules,
  r.has_admin_access,
  r.risk_warning_threshold,
  r.risk_critical_threshold,
  u.created_at
FROM public.users u
LEFT JOIN public.user_roles ur ON ur.user_id = u.id
LEFT JOIN public.roles r       ON r.id = ur.role_id;

-- Step 8: Re-enable RLS on the new tables
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_role_access ENABLE ROW LEVEL SECURITY;

-- Step 9: Recreate RLS policies
CREATE POLICY "Anyone can read roles"
  ON public.roles FOR SELECT USING (true);

CREATE POLICY "Admins can manage roles"
  ON public.roles FOR ALL USING (public.is_admin());

CREATE POLICY "Users can read their own role"
  ON public.user_roles FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Admins can manage user roles"
  ON public.user_roles FOR ALL USING (public.is_admin());

CREATE POLICY "Users can read their module access"
  ON public.module_role_access FOR SELECT
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.role_id = module_role_access.role_id
        AND ur.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins manage module access"
  ON public.module_role_access FOR ALL USING (public.is_admin());

-- Step 10: Update is_admin function to use system_admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT public.current_user_role() = 'system_admin';
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_admin_or_it()
RETURNS BOOLEAN AS $$
  SELECT public.current_user_role() = 'system_admin';
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;