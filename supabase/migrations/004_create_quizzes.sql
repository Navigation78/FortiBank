-- ============================================================
-- 004_create_quizzes.sql (Option 2 - Store pass_score locally)
-- ============================================================

CREATE TYPE public.question_type AS ENUM (
  'multiple_choice',
  'multi_select',
  'true_false'
);

CREATE TABLE public.quizzes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id       UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT,
  pass_score      INT  NOT NULL DEFAULT 70 CHECK (pass_score BETWEEN 0 AND 100),
  max_attempts    INT  NOT NULL DEFAULT 3,
  time_limit_mins INT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(module_id)
);

CREATE TRIGGER quizzes_updated_at
  BEFORE UPDATE ON public.quizzes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE public.quiz_questions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id         UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_text   TEXT NOT NULL,
  question_type   public.question_type NOT NULL DEFAULT 'multiple_choice',
  explanation     TEXT,
  order_index     INT  NOT NULL DEFAULT 0,
  points          INT  NOT NULL DEFAULT 1,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.quiz_options (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id     UUID NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
  option_text     TEXT NOT NULL,
  is_correct      BOOLEAN NOT NULL DEFAULT FALSE,
  order_index     INT NOT NULL DEFAULT 0
);

CREATE TABLE public.quiz_attempts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  quiz_id         UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  pass_score      INT NOT NULL, -- copied at attempt time
  score_pct       INT NOT NULL CHECK (score_pct BETWEEN 0 AND 100),
  passed          BOOLEAN GENERATED ALWAYS AS (score_pct >= pass_score) STORED,
  time_taken_secs INT,
  attempt_number  INT NOT NULL DEFAULT 1,
  submitted_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.quiz_attempt_answers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id      UUID NOT NULL REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
  question_id     UUID NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
  selected_option_ids UUID[],
  is_correct      BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE OR REPLACE VIEW public.user_quiz_best_scores AS
SELECT DISTINCT ON (user_id, quiz_id)
  user_id,
  quiz_id,
  score_pct   AS best_score_pct,
  passed,
  submitted_at AS best_attempt_at
FROM public.quiz_attempts
ORDER BY user_id, quiz_id, score_pct DESC;