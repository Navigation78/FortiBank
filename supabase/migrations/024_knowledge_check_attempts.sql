-- Migration 024: knowledge_check_attempts
-- Tracks subtopic inline quiz (knowledge check) results per user.
-- These are the 3-MCQ panels embedded at the end of each subtopic content page.

CREATE TABLE knowledge_check_attempts (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id      UUID        NOT NULL REFERENCES modules(id)    ON DELETE CASCADE,
  content_id     UUID                 REFERENCES module_content(id) ON DELETE SET NULL,
  section_number TEXT,
  content_title  TEXT,
  correct_count  INT         NOT NULL DEFAULT 0,
  total_count    INT         NOT NULL DEFAULT 0,
  score_pct      INT         NOT NULL DEFAULT 0,
  passed         BOOLEAN     GENERATED ALWAYS AS (score_pct >= 60) STORED,
  submitted_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_kc_attempts_user_module ON knowledge_check_attempts (user_id, module_id);
CREATE INDEX idx_kc_attempts_content     ON knowledge_check_attempts (content_id);

-- Row-level security
ALTER TABLE knowledge_check_attempts ENABLE ROW LEVEL SECURITY;

-- Users can insert and read their own attempts
CREATE POLICY "kc_attempts_own_user" ON knowledge_check_attempts
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Admins can read all attempts for reporting
CREATE POLICY "kc_attempts_admin_read" ON knowledge_check_attempts
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
        AND r.name = 'system_admin'
    )
  );
