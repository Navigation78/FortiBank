--
-- 005_create_phishing.sql
-- Phishing simulation campaigns, targets, click events, and campaign stats view
--

-- ── Phishing Campaigns ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.phishing_campaigns (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                TEXT NOT NULL,
  description         TEXT,
  email_subject       TEXT NOT NULL,
  email_sender_name   TEXT NOT NULL DEFAULT 'IT Helpdesk',
  email_sender_addr   TEXT NOT NULL DEFAULT 'helpdesk@fortibank-it.com',
  email_body_html     TEXT NOT NULL,
  target_role_ids     INT[],
  status              TEXT NOT NULL DEFAULT 'draft'
                        CHECK (status IN ('draft','scheduled','active','completed')),
  created_by          UUID REFERENCES public.users(id) ON DELETE SET NULL,
  started_at          TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Phishing Targets ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.phishing_targets (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id     UUID NOT NULL REFERENCES public.phishing_campaigns(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  result          TEXT NOT NULL DEFAULT 'not_sent'
                    CHECK (result IN ('not_sent','sent','opened','clicked','reported')),
  tracking_token  TEXT UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  sent_at         TIMESTAMPTZ,
  opened_at       TIMESTAMPTZ,
  clicked_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(campaign_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_phishing_targets_user  ON public.phishing_targets (user_id);
CREATE INDEX IF NOT EXISTS idx_phishing_targets_token ON public.phishing_targets (tracking_token);

-- ── Phishing Click Events ────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.phishing_click_events (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_id    UUID NOT NULL REFERENCES public.phishing_targets(id) ON DELETE CASCADE,
  event_type   TEXT NOT NULL CHECK (event_type IN ('opened','clicked')),
  occurred_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Campaign Stats View ──────────────────────────────────────
DROP VIEW IF EXISTS public.campaign_stats;
CREATE VIEW public.campaign_stats WITH (security_invoker = true) AS
SELECT
  c.id                                                        AS campaign_id,
  c.name,
  c.description,
  c.email_subject,
  c.email_sender_name,
  c.email_sender_addr,
  c.status,
  c.target_role_ids,
  c.created_by,
  c.created_at,
  c.started_at,
  COUNT(t.id)                                                 AS total_targets,
  COUNT(t.id) FILTER (WHERE t.result != 'not_sent')          AS sent_count,
  COUNT(t.id) FILTER (WHERE t.result = 'opened')             AS opened_count,
  COUNT(t.id) FILTER (WHERE t.result = 'clicked')            AS clicked_count,
  COUNT(t.id) FILTER (WHERE t.result = 'reported')           AS reported_count
FROM public.phishing_campaigns c
LEFT JOIN public.phishing_targets t ON t.campaign_id = c.id
GROUP BY c.id;

-- ── Risk Score Snapshots (originally in 006 draft) ───────────
-- 006_create_risk_scores.sql
-- Risk score calculation, snapshots, alerts, and certificates
--

-- ── Risk Score Snapshots ─────────────────────────────────────
-- Recalculated periodically (e.g. nightly) or on key events
-- Formula: (phishing_score * 0.6) + (quiz_score * 0.4)
-- Higher score = higher risk

CREATE TABLE IF NOT EXISTS public.risk_scores (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

  -- Component scores (0-100, higher = riskier)
  phishing_score      NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (phishing_score BETWEEN 0 AND 100),
  quiz_score          NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (quiz_score BETWEEN 0 AND 100),

  -- Weighted composite: 60% phishing + 40% quiz
  composite_score     NUMERIC(5,2) NOT NULL GENERATED ALWAYS AS (
                        ROUND((phishing_score * 0.6) + (quiz_score * 0.4), 2)
                      ) STORED,

  -- Context at time of calculation
  phishing_attempts   INT NOT NULL DEFAULT 0,
  phishing_clicks     INT NOT NULL DEFAULT 0,
  quizzes_taken       INT NOT NULL DEFAULT 0,
  quizzes_passed      INT NOT NULL DEFAULT 0,

  -- Threshold breach flags (populated from roles table at insert time)
  is_warning          BOOLEAN NOT NULL DEFAULT FALSE,
  is_critical         BOOLEAN NOT NULL DEFAULT FALSE,

  calculated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast latest-score lookups
CREATE INDEX IF NOT EXISTS idx_risk_scores_user_latest
  ON public.risk_scores (user_id, calculated_at DESC);

-- ── Risk Alerts ──────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE public.alert_severity AS ENUM ('warning', 'critical');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.alert_status AS ENUM ('active', 'acknowledged', 'resolved');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.risk_alerts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  risk_score_id   UUID NOT NULL REFERENCES public.risk_scores(id) ON DELETE CASCADE,
  severity        public.alert_severity NOT NULL,
  status          public.alert_status   NOT NULL DEFAULT 'active',
  message         TEXT NOT NULL,
  -- Whether manager/admin was notified via email
  email_sent      BOOLEAN NOT NULL DEFAULT FALSE,
  email_sent_at   TIMESTAMPTZ,
  acknowledged_by UUID REFERENCES public.users(id),
  acknowledged_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Certificates ─────────────────────────────────────────────
-- Awarded when a user completes all modules assigned to their role
-- AND has passed all associated quizzes

CREATE TABLE IF NOT EXISTS public.certificates (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role_id           INT  NOT NULL REFERENCES public.roles(id) ON DELETE RESTRICT,
  certificate_no    TEXT NOT NULL UNIQUE DEFAULT
                      'CERT-' || TO_CHAR(NOW(), 'YYYY') || '-' ||
                      UPPER(SUBSTRING(encode(gen_random_bytes(4), 'hex'), 1, 8)),
  issued_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  valid_until       TIMESTAMPTZ,
  pdf_url           TEXT,                      -- Supabase Storage URL for the PDF
  is_revoked        BOOLEAN NOT NULL DEFAULT FALSE,
  revoked_at        TIMESTAMPTZ,
  revoked_by        UUID REFERENCES public.users(id),
  UNIQUE(user_id, role_id)                    -- one active cert per role per user
);

CREATE OR REPLACE FUNCTION public.set_certificate_valid_until()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.valid_until := NEW.issued_at + INTERVAL '1 year';
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_certificate_valid_until ON public.certificates;
CREATE TRIGGER trg_certificate_valid_until
  BEFORE INSERT ON public.certificates
  FOR EACH ROW EXECUTE FUNCTION public.set_certificate_valid_until();

-- ── Helper Function: Calculate & Upsert Risk Score ───────────
-- Call this after any quiz attempt or phishing click event

CREATE OR REPLACE FUNCTION public.calculate_user_risk_score(p_user_id UUID)
RETURNS public.risk_scores AS $$
DECLARE
  v_phishing_attempts   INT;
  v_phishing_clicks     INT;
  v_quizzes_taken       INT;
  v_quizzes_passed      INT;
  v_phishing_score      NUMERIC(5,2);
  v_quiz_score          NUMERIC(5,2);
  v_warning_threshold   INT;
  v_critical_threshold  INT;
  v_composite           NUMERIC(5,2);
  v_is_warning          BOOLEAN;
  v_is_critical         BOOLEAN;
  v_new_record          public.risk_scores;
BEGIN
  -- 1. Phishing score: % of campaigns where user clicked (higher = riskier)
  SELECT
    COUNT(*)                                         INTO v_phishing_attempts
  FROM public.phishing_targets
  WHERE user_id = p_user_id
    AND result != 'not_sent';

  SELECT
    COUNT(*) FILTER (WHERE result = 'clicked')       INTO v_phishing_clicks
  FROM public.phishing_targets
  WHERE user_id = p_user_id;

  v_phishing_score := CASE
    WHEN v_phishing_attempts = 0 THEN 0
    ELSE ROUND((v_phishing_clicks::NUMERIC / v_phishing_attempts) * 100, 2)
  END;

  -- 2. Quiz score: inverse of average best score (higher fail rate = higher risk)
  SELECT
    COUNT(*),
    COUNT(*) FILTER (WHERE passed)
  INTO v_quizzes_taken, v_quizzes_passed
  FROM public.user_quiz_best_scores
  WHERE user_id = p_user_id;

  v_quiz_score := CASE
    WHEN v_quizzes_taken = 0 THEN 50  -- neutral if no quizzes attempted
    ELSE ROUND(100 - ((v_quizzes_passed::NUMERIC / v_quizzes_taken) * 100), 2)
  END;

  -- 3. Get role thresholds
  SELECT r.risk_warning_threshold, r.risk_critical_threshold
  INTO v_warning_threshold, v_critical_threshold
  FROM public.user_roles ur
  JOIN public.roles r ON r.id = ur.role_id
  WHERE ur.user_id = p_user_id
  LIMIT 1;

  -- Default thresholds if no role assigned
  v_warning_threshold  := COALESCE(v_warning_threshold, 60);
  v_critical_threshold := COALESCE(v_critical_threshold, 75);

  -- 4. Composite score
  v_composite := ROUND((v_phishing_score * 0.6) + (v_quiz_score * 0.4), 2);
  v_is_warning  := v_composite >= v_warning_threshold;
  v_is_critical := v_composite >= v_critical_threshold;

  -- 5. Insert new snapshot
  INSERT INTO public.risk_scores (
    user_id, phishing_score, quiz_score,
    phishing_attempts, phishing_clicks,
    quizzes_taken, quizzes_passed,
    is_warning, is_critical
  )
  VALUES (
    p_user_id, v_phishing_score, v_quiz_score,
    v_phishing_attempts, v_phishing_clicks,
    v_quizzes_taken, v_quizzes_passed,
    v_is_warning, v_is_critical
  )
  RETURNING * INTO v_new_record;

  RETURN v_new_record;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
