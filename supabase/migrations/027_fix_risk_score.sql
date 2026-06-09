-- 027_fix_risk_score.sql
-- 1. Quiz score default: change from 50 → 0 for users with no quiz attempts.
--    A fresh user who has done nothing wrong should start at 0, not penalised
--    by a 50-point default that inflates their composite score immediately.
-- 2. Role-aware thresholds: is_warning / is_critical now use the role's actual
--    warning/critical thresholds from the roles table instead of hardcoded 60/75.
--    This aligns the DB flags (used for emails/alerts) with what the UI already
--    shows based on the user's role.

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
  v_warning_threshold   INT;
  v_critical_threshold  INT;
BEGIN
  -- Phishing: only count targets that were actually sent
  SELECT COUNT(*) INTO v_phishing_attempts
  FROM public.phishing_targets
  WHERE user_id = p_user_id
    AND result != 'not_sent';

  SELECT COUNT(*) FILTER (WHERE result = 'clicked') INTO v_phishing_clicks
  FROM public.phishing_targets
  WHERE user_id = p_user_id
    AND result != 'not_sent';

  v_phishing_score := CASE
    WHEN v_phishing_attempts = 0 THEN 0
    ELSE ROUND((v_phishing_clicks::NUMERIC / v_phishing_attempts) * 100, 2)
  END;

  -- Quiz: use best score per quiz
  SELECT COUNT(*) INTO v_quizzes_taken
  FROM public.user_quiz_best_scores
  WHERE user_id = p_user_id;

  SELECT COUNT(*) FILTER (WHERE passed) INTO v_quizzes_passed
  FROM public.user_quiz_best_scores
  WHERE user_id = p_user_id;

  -- 0 = no quizzes yet (not a penalty), 100 = failed everything
  v_quiz_score := CASE
    WHEN v_quizzes_taken = 0 THEN 0
    ELSE ROUND(100 - ((v_quizzes_passed::NUMERIC / v_quizzes_taken) * 100), 2)
  END;

  -- Composite: phishing 60%, quiz 40%
  v_composite := ROUND((v_phishing_score * 0.6) + (v_quiz_score * 0.4), 2);

  -- Look up this user's role-specific thresholds
  SELECT r.risk_warning_threshold, r.risk_critical_threshold
  INTO v_warning_threshold, v_critical_threshold
  FROM public.user_roles ur
  JOIN public.roles r ON r.id = ur.role_id
  WHERE ur.user_id = p_user_id;

  -- Fall back to sensible defaults if the user has no role assigned yet
  v_warning_threshold  := COALESCE(v_warning_threshold, 55);
  v_critical_threshold := COALESCE(v_critical_threshold, 70);

  v_is_warning  := v_composite >= v_warning_threshold;
  v_is_critical := v_composite >= v_critical_threshold;

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

REVOKE EXECUTE ON FUNCTION public.calculate_user_risk_score(uuid) FROM anon, authenticated;
