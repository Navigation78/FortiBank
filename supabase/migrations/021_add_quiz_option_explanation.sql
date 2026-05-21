-- 021_add_quiz_option_explanation.sql
-- Add explanation column to quiz_options (was defined in 004 but never applied to the live DB)

ALTER TABLE public.quiz_options
  ADD COLUMN IF NOT EXISTS explanation TEXT;
