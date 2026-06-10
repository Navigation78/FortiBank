-- 031_first_attempt_quizzes_only.sql
-- Refines quiz component of the risk score:
--
-- 1. Knowledge checks excluded — users retry KCs until 100%, so they always
--    contribute a perfect score and mask genuine knowledge gaps. Only
--    checkpoint quizzes and final exams are counted.
--
-- 2. First attempt only — the first attempt is the honest measure of
--    preparedness. Subsequent retakes are for learning, not for erasing
--    the original risk signal. Unstarted quizzes contribute 0.
--
-- avg_assessment_score now means:
--   average of first-attempt scores across all assigned quizzes
--   (checkpoint + final exam), with 0 for each unstarted quiz.
-- quiz_risk = 100 − avg_assessment_score

CREATE OR REPLACE FUNCTION public.calculate_user_risk_score(p_user_id UUID)
RETURNS public.risk_scores AS $$
DECLARE
  v_role_id                   INT;

  -- Phishing
  v_phishing_attempts         INT;
  v_phishing_clicks           INT;
  v_phishing_score            NUMERIC(5,2);

  -- Quiz (checkpoint + final exam, first attempt only)
  v_quiz_count                INT;     -- total assigned quizzes (denominator)
  v_quiz_score_sum            NUMERIC; -- sum of first-attempt scores

  -- Derived
  v_avg_assessment_score      NUMERIC(5,2);
  v_quiz_score                NUMERIC(5,2); -- risk component (inverted)

  -- Pass/fail counts for display
  v_quizzes_taken             INT;
  v_quizzes_passed            INT;

  -- Composite
  v_composite                 NUMERIC(5,2);
  v_warning_threshold         INT;
  v_critical_threshold        INT;
  v_is_warning                BOOLEAN;
  v_is_critical               BOOLEAN;
  v_new_record                public.risk_scores;
BEGIN

  -- ── Role ──────────────────────────────────────────────────────────────────
  SELECT role_id INTO v_role_id
  FROM public.user_roles
  WHERE user_id = p_user_id
  LIMIT 1;

  -- ── Phishing: 3-strike system (unchanged) ────────────────────────────────
  SELECT COUNT(*) INTO v_phishing_attempts
  FROM public.phishing_targets
  WHERE user_id = p_user_id AND result != 'not_sent';

  SELECT COUNT(*) INTO v_phishing_clicks
  FROM public.phishing_targets
  WHERE user_id = p_user_id AND result = 'clicked';

  v_phishing_score := LEAST(100, ROUND((v_phishing_clicks::NUMERIC / 3.0) * 100, 2));

  -- ── Quizzes: checkpoint + final exam, first attempt score only ────────────
  -- Denominator = all quizzes assigned to the role (published modules).
  -- For each quiz the user has started, use attempt_number = 1.
  -- Unstarted quizzes join to NULL → COALESCE → 0.
  SELECT
    COUNT(q.id),
    COALESCE(SUM(COALESCE(fa.score_pct, 0)), 0)
  INTO v_quiz_count, v_quiz_score_sum
  FROM public.quizzes             q
  JOIN public.module_role_access  mra ON mra.module_id = q.module_id
  JOIN public.modules             m   ON m.id          = q.module_id
  LEFT JOIN public.quiz_attempts  fa  ON fa.quiz_id    = q.id
                                     AND fa.user_id    = p_user_id
                                     AND fa.attempt_number = 1
  WHERE mra.role_id = v_role_id
    AND m.status    = 'published';

  -- Average first-attempt score (0–100); 0 when no quizzes assigned
  v_avg_assessment_score := CASE
    WHEN v_quiz_count = 0 THEN 0
    ELSE ROUND(v_quiz_score_sum / v_quiz_count, 2)
  END;

  -- Risk component: 0 = aced everything, 100 = nothing attempted / all failed
  v_quiz_score := ROUND(100.0 - v_avg_assessment_score, 2);

  -- ── Pass/fail counts (display only — not used in formula) ────────────────
  -- Also based on first attempt so the display is consistent with the score.
  SELECT COUNT(*) INTO v_quizzes_taken
  FROM public.quiz_attempts      qa
  JOIN public.quizzes            q   ON q.id          = qa.quiz_id
  JOIN public.module_role_access mra ON mra.module_id = q.module_id
  WHERE qa.user_id       = p_user_id
    AND qa.attempt_number = 1
    AND mra.role_id       = v_role_id;

  SELECT COUNT(*) FILTER (WHERE qa.passed) INTO v_quizzes_passed
  FROM public.quiz_attempts      qa
  JOIN public.quizzes            q   ON q.id          = qa.quiz_id
  JOIN public.module_role_access mra ON mra.module_id = q.module_id
  WHERE qa.user_id       = p_user_id
    AND qa.attempt_number = 1
    AND mra.role_id       = v_role_id;

  -- ── Composite: quiz 60 %, phishing 40 % ──────────────────────────────────
  v_composite := ROUND((v_quiz_score * 0.6) + (v_phishing_score * 0.4), 2);

  -- ── Thresholds ────────────────────────────────────────────────────────────
  SELECT r.risk_warning_threshold, r.risk_critical_threshold
  INTO v_warning_threshold, v_critical_threshold
  FROM public.roles r WHERE r.id = v_role_id;

  v_warning_threshold  := COALESCE(v_warning_threshold, 55);
  v_critical_threshold := COALESCE(v_critical_threshold, 70);

  v_is_warning  := v_composite >= v_warning_threshold;

  -- Critical if composite threshold breached, OR 3+ phishing strikes,
  -- OR first-attempt average is below the 70% target
  v_is_critical := v_composite >= v_critical_threshold
               OR  v_phishing_clicks >= 3
               OR  (v_quiz_count > 0 AND v_avg_assessment_score < 70);

  -- ── Insert snapshot ───────────────────────────────────────────────────────
  INSERT INTO public.risk_scores (
    user_id,
    phishing_score,       quiz_score,        composite_score,
    phishing_attempts,    phishing_clicks,
    quizzes_taken,        quizzes_passed,    quizzes_assigned,
    avg_assessment_score, knowledge_checks_assigned,
    is_warning,           is_critical
  ) VALUES (
    p_user_id,
    v_phishing_score,     v_quiz_score,      v_composite,
    v_phishing_attempts,  v_phishing_clicks,
    v_quizzes_taken,      v_quizzes_passed,  v_quiz_count,
    v_avg_assessment_score, 0,               -- KCs excluded
    v_is_warning,         v_is_critical
  )
  RETURNING * INTO v_new_record;

  RETURN v_new_record;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

REVOKE EXECUTE ON FUNCTION public.calculate_user_risk_score(uuid) FROM anon, authenticated;

-- ── Recalculate all users with the corrected formula ─────────────────────────

DO $$
DECLARE
  rec RECORD;
BEGIN
  FOR rec IN
    SELECT DISTINCT ur.user_id
    FROM   public.user_roles ur
    JOIN   public.roles      ro ON ro.id = ur.role_id
    WHERE  ro.has_modules = TRUE
  LOOP
    BEGIN
      PERFORM public.calculate_user_risk_score(rec.user_id);
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'calculate_user_risk_score failed for user %: %', rec.user_id, SQLERRM;
    END;
  END LOOP;
END $$;
