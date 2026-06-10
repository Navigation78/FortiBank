-- 028_risk_score_overhaul.sql
-- 1. Restrict Executive Risk Management module to Leadership roles only
--    (branch_manager, assistant_branch_manager — category = 'Leadership')
--    All other roles lose access and their denominator becomes 7 quizzes.
-- 2. Add quizzes_assigned column to risk_scores to store the denominator
--    (total quizzes linked to the user's role, not just quizzes attempted).
-- 3. Rewrite calculate_user_risk_score:
--    - Quiz: passes / total_assigned_for_role — penalises untaken quizzes
--    - Critical if quiz pass rate < 70 % OR phishing clicks >= 3
--    - Phishing: 3-strike system (1 click=33, 2=67, 3+=100)
--    - Weights flipped: quiz 60 %, phishing 40 %

-- ── 1. Executive module: Leadership roles only ────────────────────────────────

DELETE FROM public.module_role_access
WHERE module_id = (
  SELECT id FROM public.modules WHERE order_index = 7 LIMIT 1
)
AND role_id IN (
  SELECT id FROM public.roles WHERE category != 'Leadership'
);

-- ── 2. Add quizzes_assigned column ───────────────────────────────────────────

ALTER TABLE public.risk_scores
  ADD COLUMN IF NOT EXISTS quizzes_assigned INT NOT NULL DEFAULT 0;

-- ── 3. Rewrite calculate_user_risk_score ─────────────────────────────────────

CREATE OR REPLACE FUNCTION public.calculate_user_risk_score(p_user_id UUID)
RETURNS public.risk_scores AS $$
DECLARE
  v_role_id             INT;
  v_phishing_attempts   INT;
  v_phishing_clicks     INT;
  v_phishing_score      NUMERIC(5,2);
  v_quizzes_assigned    INT;
  v_quizzes_taken       INT;
  v_quizzes_passed      INT;
  v_quiz_pass_rate      NUMERIC(5,2);
  v_quiz_score          NUMERIC(5,2);
  v_composite           NUMERIC(5,2);
  v_warning_threshold   INT;
  v_critical_threshold  INT;
  v_is_warning          BOOLEAN;
  v_is_critical         BOOLEAN;
  v_new_record          public.risk_scores;
BEGIN

  -- Resolve user's role
  SELECT role_id INTO v_role_id
  FROM public.user_roles
  WHERE user_id = p_user_id
  LIMIT 1;

  -- ── Phishing component (3-strike system) ──────────────────────────────────
  -- Count campaigns that were actually sent to the user
  SELECT COUNT(*) INTO v_phishing_attempts
  FROM public.phishing_targets
  WHERE user_id = p_user_id
    AND result != 'not_sent';

  -- Total distinct campaign clicks (each campaign counts once)
  SELECT COUNT(*) INTO v_phishing_clicks
  FROM public.phishing_targets
  WHERE user_id = p_user_id
    AND result = 'clicked';

  -- 0 clicks = 0, 1 = 33, 2 = 67, 3+ = 100
  v_phishing_score := LEAST(100, ROUND((v_phishing_clicks::NUMERIC / 3.0) * 100, 2));

  -- ── Quiz component (role-aware denominator) ───────────────────────────────
  -- Denominator: all quizzes (checkpoint + final exam) for modules the user's
  -- role can access. Untaken quizzes count against the user.
  SELECT COUNT(q.id) INTO v_quizzes_assigned
  FROM public.quizzes         q
  JOIN public.module_role_access mra ON mra.module_id = q.module_id
  JOIN public.modules             m  ON m.id          = q.module_id
  WHERE mra.role_id = v_role_id
    AND m.status    = 'published';

  -- How many quizzes the user has actually attempted (for display)
  SELECT COUNT(*) INTO v_quizzes_taken
  FROM public.user_quiz_best_scores
  WHERE user_id = p_user_id;

  -- Numerator: distinct quizzes passed (best attempt), within the user's role
  SELECT COUNT(*) INTO v_quizzes_passed
  FROM public.user_quiz_best_scores ubs
  JOIN public.quizzes               q   ON q.id          = ubs.quiz_id
  JOIN public.module_role_access    mra ON mra.module_id = q.module_id
  WHERE ubs.user_id  = p_user_id
    AND ubs.passed   = true
    AND mra.role_id  = v_role_id;

  -- Pass rate against all assigned quizzes (0–100)
  v_quiz_pass_rate := CASE
    WHEN v_quizzes_assigned = 0 THEN 100.00
    ELSE ROUND((v_quizzes_passed::NUMERIC / v_quizzes_assigned) * 100, 2)
  END;

  -- Inverted: 0 = all passed (no risk), 100 = none passed (max risk)
  v_quiz_score := ROUND(100.0 - v_quiz_pass_rate, 2);

  -- ── Composite: quiz 60 %, phishing 40 % ──────────────────────────────────
  v_composite := ROUND((v_quiz_score * 0.6) + (v_phishing_score * 0.4), 2);

  -- ── Role thresholds ───────────────────────────────────────────────────────
  SELECT r.risk_warning_threshold, r.risk_critical_threshold
  INTO v_warning_threshold, v_critical_threshold
  FROM public.roles r
  WHERE r.id = v_role_id;

  v_warning_threshold  := COALESCE(v_warning_threshold, 55);
  v_critical_threshold := COALESCE(v_critical_threshold, 70);

  v_is_warning  := v_composite >= v_warning_threshold;

  -- Critical if composite threshold breached, OR 3+ phishing strikes,
  -- OR quiz pass rate below the required 70 % (and quizzes have been assigned)
  v_is_critical := v_composite >= v_critical_threshold
               OR  v_phishing_clicks >= 3
               OR  (v_quizzes_assigned > 0 AND v_quiz_pass_rate < 70);

  -- ── Insert snapshot ───────────────────────────────────────────────────────
  INSERT INTO public.risk_scores (
    user_id,
    phishing_score,    quiz_score,    composite_score,
    phishing_attempts, phishing_clicks,
    quizzes_taken,     quizzes_passed, quizzes_assigned,
    is_warning,        is_critical
  ) VALUES (
    p_user_id,
    v_phishing_score,  v_quiz_score,  v_composite,
    v_phishing_attempts, v_phishing_clicks,
    v_quizzes_taken,   v_quizzes_passed, v_quizzes_assigned,
    v_is_warning,      v_is_critical
  )
  RETURNING * INTO v_new_record;

  RETURN v_new_record;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

REVOKE EXECUTE ON FUNCTION public.calculate_user_risk_score(uuid) FROM anon, authenticated;
