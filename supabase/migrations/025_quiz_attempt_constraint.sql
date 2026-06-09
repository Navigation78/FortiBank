-- 025_quiz_attempt_constraint.sql
-- Add a unique constraint so two concurrent quiz submissions cannot produce duplicate
-- attempt_number values for the same user + quiz combination.
-- The application already checks and increments attempt_number, but without this
-- constraint a race condition (two requests arriving simultaneously) could bypass
-- the check and both insert with the same attempt_number.

ALTER TABLE public.quiz_attempts
  ADD CONSTRAINT uq_quiz_attempts_user_quiz_number
  UNIQUE (user_id, quiz_id, attempt_number);
