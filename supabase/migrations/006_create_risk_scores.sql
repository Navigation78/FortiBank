-- 
-- 006_create_risk_scores.sql
-- Risk score calculation, snapshots, alerts, and certificates
-- 

-- ── Risk Score Snapshots ─────────────────────────────────────
-- Recalculated periodically (e.g. nightly) or on key events
-- Formula: (phishing_score * 0.6) + (quiz_score * 0.4)
-- Higher score = higher risk

CREATE TABLE public.risk_scores (
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
CREATE INDEX idx_risk_scores_user_latest
  ON public.risk_scores (user_id, calculated_at DESC);

-- ── Risk Alerts ──────────────────────────────────────────────
CREATE TYPE public.alert_severity AS ENUM ('warning', 'critical');
CREATE TYPE public.alert_status   AS ENUM ('active', 'acknowledged', 'resolved');

CREATE TABLE public.risk_alerts (
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

CREATE TABLE public.certificates (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role_id           INT  NOT NULL REFERENCES public.roles(id) ON DELETE RESTRICT,
  certificate_no    TEXT NOT NULL UNIQUE DEFAULT
                      'CERT-' || TO_CHAR(NOW(), 'YYYY') || '-' ||
                      UPPER(SUBSTRING(encode(gen_random_bytes(4), 'hex'), 1, 8)),
  issued_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  valid_until       TIMESTAMPTZ GENERATED ALWAYS AS (issued_at + INTERVAL '1 year') STORED,
  pdf_url           TEXT,                      -- Supabase Storage URL for the PDF
  is_revoked        BOOLEAN NOT NULL DEFAULT FALSE,
  revoked_at        TIMESTAMPTZ,
  revoked_by        UUID REFERENCES public.users(id),
  UNIQUE(user_id, role_id)                    -- one active cert per role per user
);

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
    COUNT(*)                    INTO v_quizzes_taken,
    COUNT(*) FILTER (WHERE passed) INTO v_quizzes_passed -- placeholder, needs two selects
  FROM public.user_quiz_best_scores
  WHERE user_id = p_user_id;

  SELECT COUNT(*) FILTER (WHERE passed) INTO v_quizzes_passed
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