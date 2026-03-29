
-- 002_create_roles.sql
-- Roles + user_roles assignment table


CREATE TYPE public.app_role AS ENUM (
  -- Leadership
  'branch_manager',
  'assistant_branch_manager',

  -- Departmental Heads (Middle Management)
  'credit_manager',
  'customer_service_manager',
  'relationship_manager',

  -- Professional Staff / Senior Officers
  'relationship_officer',
  'credit_officer',
  'service_recovery_officer',

  -- Frontline Staff / Operations
  'head_teller',
  'teller',
  'customer_service_assistant',

  -- System
  'system_admin'
);

CREATE TABLE public.roles (
  id                       SERIAL PRIMARY KEY,
  name                     public.app_role NOT NULL UNIQUE,
  display_name             TEXT NOT NULL,
  category                 TEXT NOT NULL,           -- Leadership, Departmental Heads, etc.
  description              TEXT,
  risk_warning_threshold   INT NOT NULL DEFAULT 55,
  risk_critical_threshold  INT NOT NULL DEFAULT 70,
  has_modules              BOOLEAN NOT NULL DEFAULT TRUE,
  has_admin_access         BOOLEAN NOT NULL DEFAULT FALSE,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.roles (
  name, display_name, category, description,
  risk_warning_threshold, risk_critical_threshold,
  has_modules, has_admin_access
)
VALUES
  -- ── Leadership ─────────────────────────────────────────────
  ('branch_manager', 'Branch Manager', 'Leadership',
   'Overall responsibility for branch performance, compliance and staff. High-value spear phishing target.',
   45, 58, TRUE, FALSE),

  ('assistant_branch_manager', 'Assistant Branch Manager / Operations Manager', 'Leadership',
   'Deputises the branch manager, oversees daily operations and compliance.',
   45, 58, TRUE, FALSE),

  -- ── Departmental Heads ─────────────────────────────────────
  ('credit_manager', 'Credit Manager', 'Departmental Heads',
   'Manages credit appraisal and loan portfolio. At risk from document fraud and identity theft.',
   50, 63, TRUE, FALSE),

  ('customer_service_manager', 'Customer Service Manager', 'Departmental Heads',
   'Oversees customer experience and service delivery. Exposed to social engineering.',
   50, 63, TRUE, FALSE),

  ('relationship_manager', 'Relationship Manager', 'Departmental Heads',
   'Manages key client relationships and business development. Targeted for financial fraud.',
   50, 63, TRUE, FALSE),

  -- ── Professional Staff / Senior Officers ───────────────────
  ('relationship_officer', 'Relationship Officer', 'Professional Staff',
   'Handles client accounts and supports relationship managers. Phishing and data handling risk.',
   55, 68, TRUE, FALSE),

  ('credit_officer', 'Credit Officer', 'Professional Staff',
   'Processes loan applications and credit assessments. Document fraud and data risk.',
   55, 68, TRUE, FALSE),

  ('service_recovery_officer', 'Service Recovery Officer', 'Professional Staff',
   'Resolves customer complaints and escalations. Social engineering risk.',
   55, 68, TRUE, FALSE),

  -- ── Frontline Staff / Operations ───────────────────────────
  ('head_teller', 'Head Teller / Vault Custodian', 'Frontline Staff',
   'Manages teller operations and vault access. High exposure to physical and cyber threats.',
   58, 72, TRUE, FALSE),

  ('teller', 'Bank Teller', 'Frontline Staff',
   'Handles cash transactions and customer interactions. Primary social engineering target.',
   58, 72, TRUE, FALSE),

  ('customer_service_assistant', 'Customer Service Assistant', 'Frontline Staff',
   'First point of contact for customers. High exposure to social engineering and phishing.',
   58, 72, TRUE, FALSE),

  -- ── System ─────────────────────────────────────────────────
  ('system_admin', 'System Administrator', 'System',
   'Manages the training platform — users, modules, campaigns and reports. No training modules assigned.',
   40, 55, FALSE, TRUE);

-- Junction table: one user, one role
CREATE TABLE public.user_roles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role_id     INT  NOT NULL REFERENCES public.roles(id) ON DELETE RESTRICT,
  assigned_by UUID REFERENCES public.users(id),
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Convenience view: users with their role details
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
  r.name                   AS role,
  r.display_name           AS role_display_name,
  r.category               AS role_category,
  r.has_modules,
  r.has_admin_access,
  r.risk_warning_threshold,
  r.risk_critical_threshold,
  u.created_at
FROM public.users u
LEFT JOIN public.user_roles ur ON ur.user_id = u.id
LEFT JOIN public.roles r       ON r.id = ur.role_id;