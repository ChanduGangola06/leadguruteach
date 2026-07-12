-- Audit logging for auth, API calls, and button clicks
-- Run in Supabase SQL Editor if you already applied schema.sql

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  event_category TEXT NOT NULL DEFAULT 'auth' CHECK (event_category IN ('auth', 'api', 'button')),
  success BOOLEAN NOT NULL DEFAULT FALSE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT,
  api_endpoint TEXT,
  api_method TEXT DEFAULT 'POST',
  button_label TEXT,
  page_path TEXT,
  error_code TEXT,
  error_message TEXT,
  user_agent TEXT,
  ip_address TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS audit_logs_created_at_idx ON public.audit_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS audit_logs_event_type_idx ON public.audit_logs (event_type);
CREATE INDEX IF NOT EXISTS audit_logs_email_idx ON public.audit_logs (email);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert audit logs"
  ON public.audit_logs FOR INSERT
  WITH CHECK (event_category IN ('auth', 'api', 'button'));

CREATE POLICY "Admins can read audit logs"
  ON public.audit_logs FOR SELECT
  USING (public.is_admin());
