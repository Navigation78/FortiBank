-- ============================================================
-- 002_create_roles.sql
-- Roles + user_roles assignment table
-- ============================================================

-- Enum for the 4 MVP roles + admin/IT roles
CREATE TYPE public.app_role AS ENUM (
  'teller',
  'loan_officer',
  'manager',
  'executive',
  'admin',
  'it_professional',
  'administration'
);

CREATE TABLE public.roles (
  id                    SERIAL PRIMARY KEY,
  name                  public.app_role NOT NULL UNIQUE,
  display_name          TEXT NOT NULL,
  description           TEXT,
  -- Risk thresholds: score above warning_threshold triggers alert
  -- score above critical_threshold triggers urgent warning + manager email
  risk_warning_threshold   INT NOT NULL DEFAULT 60,  -- 0-100
  risk_critical_threshold  INT NOT NULL DEFAULT 75,  -- 0-100
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert the 4 MVP roles + system roles with differentiated thresholds
INSERT INTO public.roles (name, display_name, description, risk_warning_threshold, risk_critical_threshold)
VALUES
  ('teller',          'Bank Teller',      'Front-line staff handling cash and customer transactions. High exposure to social engineering.',          60, 75),
  ('loan_officer',    'Loan Officer',     'Handles sensitive financial and identity data. At risk from document fraud and phishing.',                55, 70),
  ('manager',         'Bank Manager',     'Oversees branch operations. Credential abuse and insider threat risk.',                                   50, 65),
  ('executive',       'Executive',        'High-value target for spear phishing (whaling). Strictest thresholds apply.',                            45, 60),
  ('admin',           'System Admin',     'Platform administrator with full access to users, modules, and reports.',                                 50, 65),
  ('it_professional', 'IT Professional',  'Internal IT staff. Manages systems and access controls.',                                                50, 65),
  ('administration',  'Administration',   'General administrative staff handling internal operations.',                                              60, 75);

-- Junction table: one user can have one active role (bank context)
CREATE TABLE public.user_roles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role_id     INT  NOT NULL REFERENCES public.roles(id) ON DELETE RESTRICT,
  assigned_by UUID REFERENCES public.users(id),          -- admin who assigned it
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)                                         -- one role per user
);

-- Convenience view: users with their role name
CREATE OR REPLACE VIEW public.users_with_roles AS
SELECT
  u.id,
  u.email,
  u.full_name,
  u.employee_id,
  u.department,
  u.avatar_url,
  u.is_active,
  r.name        AS role,
  r.display_name AS role_display_name,
  r.risk_warning_threshold,
  r.risk_critical_threshold,
  u.created_at
FROM public.users u
LEFT JOIN public.user_roles ur ON ur.user_id = u.id
LEFT JOIN public.roles r       ON r.id = ur.role_id;