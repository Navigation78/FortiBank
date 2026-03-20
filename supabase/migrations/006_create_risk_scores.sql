-- ============================================================
-- 006_create_risk_scores.sql (Option 2 - Backend/function calculates composite)
-- ============================================================

CREATE TABLE public.risk_scores (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

  phishing_score      NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (phishing_score BETWEEN 0 AND 100),
  quiz_score          NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (quiz_score BETWEEN 0 AND 100),

  composite_score     NUMERIC(5,2) NOT NULL,

  phishing_attempts   INT NOT NULL DEFAULT 0,
  phishing_clicks     INT NOT NULL DEFAULT 0,
  quizzes_taken       INT NOT NULL DEFAULT 0,
  quizzes_passed      INT NOT NULL DEFAULT 0,

  is_warning          BOOLEAN NOT NULL DEFAULT FALSE,
  is_critical         BOOLEAN NOT NULL DEFAULT FALSE,

  calculated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_risk_scores_user_latest
  ON public.risk_scores (user_id, calculated_at DESC);

-- FUNCTION UPDATED
CREATE OR REPLACE FUNCTION public.calculate_user_risk_score(p_user_id UUID)
RETURNS public.risk_scores AS $$
DECLARE
  v_phishing_attempts   INT;
  v_phishing_clicks     INT;
  v_quizzes_taken       INT;
  v_quizzes_passed      INT;
  v_phishing_score      NUMERIC(5,2);
  v_quiz_score          NUMERIC(5,2);
  v_composite           NUMERIC(5,2);
  v_is_warning          BOOLEAN;
  v_is_critical         BOOLEAN;
  v_new_record          public.risk_scores;
BEGIN
  SELECT COUNT(*) INTO v_phishing_attempts
  FROM public.phishing_targets
  WHERE user_id = p_user_id;

  SELECT COUNT(*) FILTER (WHERE result = 'clicked') INTO v_phishing_clicks
  FROM public.phishing_targets
  WHERE user_id = p_user_id;

  v_phishing_score := CASE
    WHEN v_phishing_attempts = 0 THEN 0
    ELSE ROUND((v_phishing_clicks::NUMERIC / v_phishing_attempts) * 100, 2)
  END;

  SELECT COUNT(*) INTO v_quizzes_taken
  FROM public.user_quiz_best_scores
  WHERE user_id = p_user_id;

  SELECT COUNT(*) FILTER (WHERE passed) INTO v_quizzes_passed
  FROM public.user_quiz_best_scores
  WHERE user_id = p_user_id;

  v_quiz_score := CASE
    WHEN v_quizzes_taken = 0 THEN 50
    ELSE ROUND(100 - ((v_quizzes_passed::NUMERIC / v_quizzes_taken) * 100), 2)
  END;

  v_composite := ROUND((v_phishing_score * 0.6) + (v_quiz_score * 0.4), 2);

  v_is_warning  := v_composite >= 60;
  v_is_critical := v_composite >= 75;

  INSERT INTO public.risk_scores (
    user_id,
    phishing_score,
    quiz_score,
    composite_score,
    phishing_attempts,
    phishing_clicks,
    quizzes_taken,
    quizzes_passed,
    is_warning,
    is_critical
  )
  VALUES (
    p_user_id,
    v_phishing_score,
    v_quiz_score,
    v_composite,
    v_phishing_attempts,
    v_phishing_clicks,
    v_quizzes_taken,
    v_quizzes_passed,
    v_is_warning,
    v_is_critical
  )
  RETURNING * INTO v_new_record;

  RETURN v_new_record;
END;
$$ LANGUAGE plpgsql;