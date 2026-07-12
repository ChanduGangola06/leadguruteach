-- User package purchases / enrollments
-- Run in Supabase SQL Editor after schema.sql

CREATE TABLE IF NOT EXISTS public.user_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  package_id UUID NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
  purchased_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'refunded', 'cancelled')),
  amount_paid NUMERIC(10,2),
  UNIQUE (user_id, package_id)
);

CREATE INDEX IF NOT EXISTS user_packages_user_id_idx ON public.user_packages (user_id);
CREATE INDEX IF NOT EXISTS user_packages_package_id_idx ON public.user_packages (package_id);

ALTER TABLE public.user_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own purchases"
  ON public.user_packages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can purchase packages"
  ON public.user_packages FOR INSERT
  WITH CHECK (auth.uid() = user_id AND status = 'active');

CREATE POLICY "Admins can read all purchases"
  ON public.user_packages FOR SELECT
  USING (public.is_admin());
