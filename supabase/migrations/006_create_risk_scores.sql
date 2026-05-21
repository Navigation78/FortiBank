-- 006_create_risk_scores.sql
-- Converts composite_score from a GENERATED column to a plain
-- column so the function can insert it explicitly.

DO $$
BEGIN
  -- If composite_score exists as a GENERATED column, drop and re-add as plain
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'risk_scores'
      AND column_name  = 'composite_score'
      AND is_generated = 'ALWAYS'
  ) THEN
    ALTER TABLE public.risk_scores DROP COLUMN composite_score;
    ALTER TABLE public.risk_scores ADD COLUMN composite_score NUMERIC(5,2) NOT NULL DEFAULT 0;

  -- If the column doesn't exist at all, just add it
  ELSIF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'risk_scores'
      AND column_name  = 'composite_score'
  ) THEN
    ALTER TABLE public.risk_scores ADD COLUMN composite_score NUMERIC(5,2) NOT NULL DEFAULT 0;

  -- Otherwise it's already a plain column — nothing to do
  END IF;
END $$;

-- FUNCTION: replaces the version from 005 — now inserts composite_score explicitly
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
