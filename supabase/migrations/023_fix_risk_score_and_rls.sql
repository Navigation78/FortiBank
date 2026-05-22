-- 023_fix_risk_score_and_rls.sql
-- 1. Fix calculate_user_risk_score: only count *sent* phishing targets as attempts
--    (previously counted 'not_sent' rows, diluting the phishing score)
-- 2. Fix phishing_campaigns RLS: users need to read campaign name/subject on Results page
-- 3. Fix quizzes RLS: users must be able to read quizzes they've already attempted
--    (handles modules that may later be unpublished)

-- ── 1. Fix calculate_user_risk_score ─────────────────────────────────────────

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
  -- Count only targets that were actually sent (exclude 'not_sent' drafts)
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

  -- Use best score per quiz to determine pass/fail
  SELECT COUNT(*) INTO v_quizzes_taken
  FROM public.user_quiz_best_scores
  WHERE user_id = p_user_id;

  SELECT COUNT(*) FILTER (WHERE passed) INTO v_quizzes_passed
  FROM public.user_quiz_best_scores
  WHERE user_id = p_user_id;

  -- Quiz score: 0 = passed everything, 100 = failed everything
  v_quiz_score := CASE
    WHEN v_quizzes_taken = 0 THEN 50
    ELSE ROUND(100 - ((v_quizzes_passed::NUMERIC / v_quizzes_taken) * 100), 2)
  END;

  -- Composite: phishing weighted 60%, quiz weighted 40%
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

-- Revoke direct access (service role only, as before)
REVOKE EXECUTE ON FUNCTION public.calculate_user_risk_score(uuid) FROM anon, authenticated;


-- ── 2. Fix phishing_campaigns RLS ────────────────────────────────────────────
-- Split the blanket "admins only" policy into:
--   (a) admins get full management
--   (b) regular users can SELECT campaigns that were already sent to them
--       (safe: they already know the campaign exists; this just reveals name/subject)

DROP POLICY IF EXISTS "Only admins see campaigns"  ON public.phishing_campaigns;
DROP POLICY IF EXISTS "Admins manage campaigns"    ON public.phishing_campaigns;
DROP POLICY IF EXISTS "Users read sent campaign details" ON public.phishing_campaigns;

CREATE POLICY "Admins manage campaigns"
  ON public.phishing_campaigns FOR ALL
  USING (public.is_admin());

CREATE POLICY "Users read sent campaign details"
  ON public.phishing_campaigns FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.phishing_targets pt
      WHERE pt.campaign_id = phishing_campaigns.id
        AND pt.user_id     = auth.uid()
        AND pt.result     != 'not_sent'
    )
  );


-- ── 3. Fix quizzes RLS: include attempted quizzes ─────────────────────────────
-- A user must be able to read a quiz they've already taken even if the parent
-- module is later unpublished (so Results page shows correct quiz titles).

DROP POLICY IF EXISTS "Users can read quizzes for their modules" ON public.quizzes;

CREATE POLICY "Users can read quizzes for their modules"
  ON public.quizzes FOR SELECT
  USING (
    public.is_admin()
    -- Quiz belongs to a published module accessible via the user's role
    OR EXISTS (
      SELECT 1
      FROM public.modules m
      JOIN public.module_role_access mra ON mra.module_id = m.id
      JOIN public.user_roles         ur  ON ur.role_id    = mra.role_id
      WHERE m.id     = quizzes.module_id
        AND m.status = 'published'
        AND ur.user_id = auth.uid()
    )
    -- User has already attempted this quiz (historical record access)
    OR EXISTS (
      SELECT 1 FROM public.quiz_attempts qa
      WHERE qa.quiz_id  = quizzes.id
        AND qa.user_id  = auth.uid()
    )
  );
