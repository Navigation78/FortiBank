-- 010_create_notifications.sql
-- Notification inbox for employees and admins

CREATE TABLE public.notifications (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       TEXT        NOT NULL,
  message     TEXT        NOT NULL,
  type        TEXT        NOT NULL DEFAULT 'system',
  -- type values: module | quiz | phishing | risk_alert | certificate | announcement | system
  link        TEXT,       -- optional deep-link path (e.g. /modules/abc)
  is_read     BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Fast lookups by user, ordered newest-first, and for unread badge count
CREATE INDEX idx_notifications_user_created ON public.notifications (user_id, created_at DESC);
CREATE INDEX idx_notifications_user_unread  ON public.notifications (user_id, is_read) WHERE is_read = FALSE;

-- ── RLS ─────────────────────────────────────────────────────
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can read their own notifications (admins can read all)
CREATE POLICY "Users read own notifications"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin());

-- Users can update (mark read/unread) their own notifications
CREATE POLICY "Users update own notifications"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid() OR public.is_admin());

-- Users can delete their own notifications
CREATE POLICY "Users delete own notifications"
  ON public.notifications FOR DELETE
  USING (user_id = auth.uid() OR public.is_admin());

-- Only the service role (supabaseAdmin) may insert — individual API routes
-- call the notification service which uses the admin client.
-- This prevents users from spoofing notifications for other users.
CREATE POLICY "Service role inserts notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (public.is_admin() OR user_id = auth.uid());
