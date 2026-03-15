-- 
-- 007_row_level_security.sql
-- RLS policies for all tables
-- 

-- ── Helper: get current user's role name ─────────────────────
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT AS $$
  SELECT r.name::TEXT
  FROM public.user_roles ur
  JOIN public.roles r ON r.id = ur.role_id
  WHERE ur.user_id = auth.uid()
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT public.current_user_role() = 'admin';
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ── Enable RLS on all tables ─────────────────────────────────
ALTER TABLE public.users                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_role_access     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_content         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_module_progress   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_options           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempt_answers   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phishing_campaigns     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phishing_targets       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phishing_click_events  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_scores            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_alerts            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates           ENABLE ROW LEVEL SECURITY;

-- ── users ────────────────────────────────────────────────────
CREATE POLICY "Users can read their own profile"
  ON public.users FOR SELECT
  USING (id = auth.uid() OR public.is_admin());

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Admins can insert users"
  ON public.users FOR INSERT
  WITH CHECK (public.is_admin());

-- ── user_roles ───────────────────────────────────────────────
CREATE POLICY "Users can read their own role"
  ON public.user_roles FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.is_admin());

-- ── modules ──────────────────────────────────────────────────
-- Users can only see published modules assigned to their role
CREATE POLICY "Users see modules for their role"
  ON public.modules FOR SELECT
  USING (
    status = 'published'
    AND (
      public.is_admin()
      OR EXISTS (
        SELECT 1
        FROM public.module_role_access mra
        JOIN public.user_roles ur ON ur.role_id = mra.role_id
        WHERE mra.module_id = modules.id
          AND ur.user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Admins can manage modules"
  ON public.modules FOR ALL
  USING (public.is_admin());

-- ── module_role_access ───────────────────────────────────────
CREATE POLICY "Users can read their module access"
  ON public.module_role_access FOR SELECT
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.role_id = module_role_access.role_id
        AND ur.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins manage module access"
  ON public.module_role_access FOR ALL
  USING (public.is_admin());

-- ── module_content ───────────────────────────────────────────
CREATE POLICY "Users can read content for accessible modules"
  ON public.module_content FOR SELECT
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.modules m
      JOIN public.module_role_access mra ON mra.module_id = m.id
      JOIN public.user_roles ur ON ur.role_id = mra.role_id
      WHERE m.id = module_content.module_id
        AND m.status = 'published'
        AND ur.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins manage content"
  ON public.module_content FOR ALL
  USING (public.is_admin());

-- ── user_module_progress ─────────────────────────────────────
CREATE POLICY "Users manage their own progress"
  ON public.user_module_progress FOR ALL
  USING (user_id = auth.uid() OR public.is_admin());

-- ── quizzes ──────────────────────────────────────────────────
CREATE POLICY "Users can read quizzes for their modules"
  ON public.quizzes FOR SELECT
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.modules m
      JOIN public.module_role_access mra ON mra.module_id = m.id
      JOIN public.user_roles ur ON ur.role_id = mra.role_id
      WHERE m.id = quizzes.module_id
        AND m.status = 'published'
        AND ur.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins manage quizzes"
  ON public.quizzes FOR ALL
  USING (public.is_admin());

-- ── quiz_questions & quiz_options ────────────────────────────
CREATE POLICY "Users can read questions for accessible quizzes"
  ON public.quiz_questions FOR SELECT
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.quizzes q
      JOIN public.modules m ON m.id = q.module_id
      JOIN public.module_role_access mra ON mra.module_id = m.id
      JOIN public.user_roles ur ON ur.role_id = mra.role_id
      WHERE q.id = quiz_questions.quiz_id
        AND ur.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins manage questions"
  ON public.quiz_questions FOR ALL
  USING (public.is_admin());

CREATE POLICY "Users can read options"
  ON public.quiz_options FOR SELECT
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.quiz_questions qq
      JOIN public.quizzes q  ON q.id  = qq.quiz_id
      JOIN public.modules m  ON m.id  = q.module_id
      JOIN public.module_role_access mra ON mra.module_id = m.id
      JOIN public.user_roles ur ON ur.role_id = mra.role_id
      WHERE qq.id = quiz_options.question_id
        AND ur.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins manage options"
  ON public.quiz_options FOR ALL
  USING (public.is_admin());

-- ── quiz_attempts & answers ──────────────────────────────────
CREATE POLICY "Users manage their own attempts"
  ON public.quiz_attempts FOR ALL
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Users manage their own answers"
  ON public.quiz_attempt_answers FOR ALL
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.quiz_attempts qa
      WHERE qa.id = quiz_attempt_answers.attempt_id
        AND qa.user_id = auth.uid()
    )
  );

-- ── phishing_campaigns ───────────────────────────────────────
-- Regular users cannot see campaigns (prevents forewarning)
CREATE POLICY "Only admins see campaigns"
  ON public.phishing_campaigns FOR ALL
  USING (public.is_admin());

-- ── phishing_targets ─────────────────────────────────────────
-- Users can only see their own target records (for results page)
CREATE POLICY "Users see their own phishing results"
  ON public.phishing_targets FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Admins manage targets"
  ON public.phishing_targets FOR ALL
  USING (public.is_admin());

-- ── phishing_click_events ────────────────────────────────────
CREATE POLICY "Admins manage click events"
  ON public.phishing_click_events FOR ALL
  USING (public.is_admin());

-- Allow the tracking API route to insert (uses service role key, bypasses RLS)
-- No user-facing policy needed here.

-- ── risk_scores ──────────────────────────────────────────────
CREATE POLICY "Users read their own risk score"
  ON public.risk_scores FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "System inserts risk scores"
  ON public.risk_scores FOR INSERT
  WITH CHECK (public.is_admin() OR user_id = auth.uid());

-- ── risk_alerts ──────────────────────────────────────────────
CREATE POLICY "Users read their own alerts"
  ON public.risk_alerts FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Admins manage alerts"
  ON public.risk_alerts FOR ALL
  USING (public.is_admin());

-- ── certificates ─────────────────────────────────────────────
CREATE POLICY "Users read their own certificates"
  ON public.certificates FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Admins manage certificates"
  ON public.certificates FOR ALL
  USING (public.is_admin());