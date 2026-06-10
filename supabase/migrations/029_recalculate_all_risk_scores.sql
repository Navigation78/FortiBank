-- 029_recalculate_all_risk_scores.sql
-- One-time cleanup + full recalculation after the formula overhaul in 028.
--
-- Problem: existing risk_scores rows were calculated with the old formula
-- (quiz denominator = quizzes taken, phishing = click %, weights 60/40 swapped).
-- Some users show composite = 0 but still have active risk_alerts from a prior
-- calculation, producing confusing "score of 0 requires attention" notifications.
--
-- Fix:
--   1. Mark all stale risk_alert notifications as read (stop the unread badge)
--   2. Resolve all active risk_alerts (based on now-invalid snapshots)
--   3. Recalculate every user who has modules assigned — this inserts a fresh
--      risk_scores row and fires new alerts only if genuinely warranted

-- ── 1. Silence stale risk-alert notifications ─────────────────────────────────

UPDATE public.notifications
SET    is_read = TRUE
WHERE  type    = 'risk_alert'
  AND  is_read = FALSE;

-- ── 2. Resolve stale risk alerts ──────────────────────────────────────────────

UPDATE public.risk_alerts
SET    status = 'resolved'
WHERE  status = 'active';

-- ── 3. Recalculate scores for all users with training modules ─────────────────

DO $$
DECLARE
  rec RECORD;
BEGIN
  FOR rec IN
    SELECT DISTINCT ur.user_id
    FROM   public.user_roles  ur
    JOIN   public.roles       ro ON ro.id = ur.role_id
    WHERE  ro.has_modules = TRUE
  LOOP
    BEGIN
      PERFORM public.calculate_user_risk_score(rec.user_id);
    EXCEPTION WHEN OTHERS THEN
      -- Log the failure but keep looping so one bad user doesn't abort the rest
      RAISE WARNING 'calculate_user_risk_score failed for user %: %', rec.user_id, SQLERRM;
    END;
  END LOOP;
END $$;
