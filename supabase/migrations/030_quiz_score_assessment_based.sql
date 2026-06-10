-- 030_quiz_score_assessment_based.sql
-- Fixes two issues in the quiz component of the risk score:
--
-- 1. Binary pass/fail replaced with score-based average.
--    Old: quiz_score = 100 - (quizzes_passed / quizzes_assigned × 100)
--         A user who barely passed every quiz (71%) looked identical to
--         someone who aced them all (98%).
--    New: quiz_score = 100 - avg_best_score_pct_across_all_assigned_assessments
--         Untouched assessments contribute 0, so the average degrades
--         proportionally for every unfinished item.
--
-- 2. Knowledge checks (KCs) are now included in the average.
--    Previously only checkpoint quizzes and final exams were counted.
--    KCs are the inline subtopic quizzes embedded in each learning page;
--    excluding them understated both the breadth of assessment and the
--    penalty for skipping content.
--
-- Critical threshold: avg_assessment_score < 70 (user has not met the
-- 70% overall target across all assigned assessments).

-- ── 1. New columns on risk_scores ────────────────────────────────────────────

ALTER TABLE public.risk_scores
  ADD COLUMN IF NOT EXISTS avg_assessment_score    NUMERIC(5,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS knowledge_checks_assigned INT         NOT NULL DEFAULT 0;

-- ── 2. Rewrite calculate_user_risk_score ─────────────────────────────────────

CREATE OR REPLACE FUNCTION public.calculate_user_risk_score(p_user_id UUID)
RETURNS public.risk_scores AS $$
DECLARE
  v_role_id                   INT;

  -- Phishing
  v_phishing_attempts         INT;
  v_phishing_clicks           INT;
  v_phishing_score            NUMERIC(5,2);

  -- Quiz assessments (checkpoint + final exam)
  v_quiz_count                INT;
  v_quiz_score_sum            NUMERIC;

  -- Knowledge check assessments
  v_kc_count                  INT;
  v_kc_score_sum              NUMERIC;

  -- Combined
  v_total_assessment_count    INT;
  v_avg_assessment_score      NUMERIC(5,2);
  v_quiz_score                NUMERIC(5,2);   -- risk component (inverted)

  -- Pass/fail counts kept for display only
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

  -- ── Phishing: 3-strike system (unchanged from 028) ────────────────────────
  SELECT COUNT(*) INTO v_phishing_attempts
  FROM public.phishing_targets
  WHERE user_id = p_user_id AND result != 'not_sent';

  SELECT COUNT(*) INTO v_phishing_clicks
  FROM public.phishing_targets
  WHERE user_id = p_user_id AND result = 'clicked';

  -- 0 clicks = 0, 1 = 33, 2 = 67, 3+ = 100
  v_phishing_score := LEAST(100, ROUND((v_phishing_clicks::NUMERIC / 3.0) * 100, 2));

  -- ── Quizzes (checkpoint + final exam): count + sum best scores ────────────
  -- Unstarted quizzes contribute 0 to the sum via LEFT JOIN.
  SELECT
    COUNT(q.id),
    COALESCE(SUM(COALESCE(best.score_pct, 0)), 0)
  INTO v_quiz_count, v_quiz_score_sum
  FROM public.quizzes             q
  JOIN public.module_role_access  mra ON mra.module_id = q.module_id
  JOIN public.modules             m   ON m.id          = q.module_id
  LEFT JOIN (
    SELECT DISTINCT ON (quiz_id)
      quiz_id,
      score_pct
    FROM public.quiz_attempts
    WHERE user_id = p_user_id
    ORDER BY quiz_id, score_pct DESC
  ) best ON best.quiz_id = q.id
  WHERE mra.role_id = v_role_id
    AND m.status    = 'published';

  -- ── Knowledge checks: count + sum best scores per content item ───────────
  -- Each knowledge_check content item is one KC; use the highest score attempt.
  -- Untouched KCs contribute 0.
  SELECT
    COUNT(DISTINCT mc.id),
    COALESCE(SUM(COALESCE(best_kc.max_score, 0)), 0)
  INTO v_kc_count, v_kc_score_sum
  FROM public.module_content      mc
  JOIN public.module_role_access  mra    ON mra.module_id = mc.module_id
  JOIN public.modules             m      ON m.id          = mc.module_id
  LEFT JOIN (
    SELECT content_id, MAX(score_pct) AS max_score
    FROM public.knowledge_check_attempts
    WHERE user_id = p_user_id
    GROUP BY content_id
  ) best_kc ON best_kc.content_id = mc.id
  WHERE mc.content_type = 'knowledge_check'
    AND mra.role_id     = v_role_id
    AND m.status        = 'published';

  -- ── Combined average across all assessments ───────────────────────────────
  v_total_assessment_count := v_quiz_count + v_kc_count;

  v_avg_assessment_score := CASE
    WHEN v_total_assessment_count = 0 THEN 0
    ELSE ROUND((v_quiz_score_sum + v_kc_score_sum) / v_total_assessment_count, 2)
  END;

  -- quiz_score (risk component): 0 = perfect score, 100 = nothing done
  v_quiz_score := ROUND(100.0 - v_avg_assessment_score, 2);

  -- ── Pass/fail counts (display only — not used in formula) ────────────────
  SELECT COUNT(*) INTO v_quizzes_taken
  FROM public.user_quiz_best_scores ubs
  JOIN public.quizzes q ON q.id = ubs.quiz_id
  JOIN public.module_role_access mra ON mra.module_id = q.module_id
  WHERE ubs.user_id = p_user_id AND mra.role_id = v_role_id;

  SELECT COUNT(*) FILTER (WHERE ubs.passed) INTO v_quizzes_passed
  FROM public.user_quiz_best_scores ubs
  JOIN public.quizzes q ON q.id = ubs.quiz_id
  JOIN public.module_role_access mra ON mra.module_id = q.module_id
  WHERE ubs.user_id = p_user_id AND mra.role_id = v_role_id;

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
  -- OR average score across all assessments is below the 70% target
  v_is_critical := v_composite >= v_critical_threshold
               OR  v_phishing_clicks >= 3
               OR  (v_total_assessment_count > 0 AND v_avg_assessment_score < 70);

  -- ── Insert snapshot ───────────────────────────────────────────────────────
  INSERT INTO public.risk_scores (
    user_id,
    phishing_score,         quiz_score,          composite_score,
    phishing_attempts,      phishing_clicks,
    quizzes_taken,          quizzes_passed,      quizzes_assigned,
    avg_assessment_score,   knowledge_checks_assigned,
    is_warning,             is_critical
  ) VALUES (
    p_user_id,
    v_phishing_score,       v_quiz_score,        v_composite,
    v_phishing_attempts,    v_phishing_clicks,
    v_quizzes_taken,        v_quizzes_passed,    v_quiz_count,
    v_avg_assessment_score, v_kc_count,
    v_is_warning,           v_is_critical
  )
  RETURNING * INTO v_new_record;

  RETURN v_new_record;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

REVOKE EXECUTE ON FUNCTION public.calculate_user_risk_score(uuid) FROM anon, authenticated;

-- ── 3. Recalculate all users with the new formula ─────────────────────────────

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
