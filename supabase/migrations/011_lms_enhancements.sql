
-- 1. Add topic-structure fields to module_content
ALTER TABLE public.module_content
  ADD COLUMN IF NOT EXISTS section_number       TEXT,
  ADD COLUMN IF NOT EXISTS learning_objectives  TEXT[]  DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS image_caption        TEXT;

-- 2. Add knowledge_check to the content_type enum
ALTER TYPE public.content_type ADD VALUE IF NOT EXISTS 'knowledge_check';

-- 3. Drop the module-level unique constraint on quizzes so a module
--    can have both a final_exam quiz and one or more checkpoint quizzes.
ALTER TABLE public.quizzes
  DROP CONSTRAINT IF EXISTS quizzes_module_id_key;

-- 4. Classify quiz as final_exam (default) or per-topic checkpoint
ALTER TABLE public.quizzes
  ADD COLUMN IF NOT EXISTS quiz_type      TEXT NOT NULL DEFAULT 'final_exam'
    CHECK (quiz_type IN ('final_exam', 'checkpoint')),
  ADD COLUMN IF NOT EXISTS section_number TEXT;   -- links checkpoint to topic e.g. "1.0"

-- 5. Topic-level progress tracking (per user, per module, per topic)
CREATE TABLE IF NOT EXISTS public.user_topic_progress (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES public.users(id)   ON DELETE CASCADE,
  module_id         UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  section_number    TEXT NOT NULL,          -- e.g. "1.0"
  viewed_page_ids   UUID[] DEFAULT '{}',    -- module_content IDs viewed in this topic
  checkpoint_passed BOOLEAN DEFAULT FALSE,
  checkpoint_score  INT,
  completed_at      TIMESTAMPTZ,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, module_id, section_number)
);

CREATE INDEX IF NOT EXISTS idx_user_topic_progress_lookup
  ON public.user_topic_progress(user_id, module_id);
