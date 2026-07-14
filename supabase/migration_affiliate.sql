-- Affiliate leads, commissions, and payment requests
-- Safe to run even if user_packages does not exist yet
-- Prerequisites: public.profiles and public.packages must already exist

-- ============================================================
-- 0. Ensure purchases table exists (required for commissions)
-- ============================================================
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

DROP POLICY IF EXISTS "Users can read own purchases" ON public.user_packages;
CREATE POLICY "Users can read own purchases"
  ON public.user_packages FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can purchase packages" ON public.user_packages;
CREATE POLICY "Users can purchase packages"
  ON public.user_packages FOR INSERT
  WITH CHECK (auth.uid() = user_id AND status = 'active');

DROP POLICY IF EXISTS "Admins can read all purchases" ON public.user_packages;
CREATE POLICY "Admins can read all purchases"
  ON public.user_packages FOR SELECT
  USING (public.is_admin());

-- ============================================================
-- 1. Profile referral fields
-- ============================================================
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS referral_code TEXT,
  ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

CREATE UNIQUE INDEX IF NOT EXISTS profiles_referral_code_idx
  ON public.profiles (referral_code)
  WHERE referral_code IS NOT NULL;

-- Backfill referral codes for existing users
UPDATE public.profiles
SET referral_code = UPPER(SUBSTRING(REPLACE(id::text, '-', '') FROM 1 FOR 8))
WHERE referral_code IS NULL;

-- ============================================================
-- 2. Track referrer on purchases
-- ============================================================
ALTER TABLE public.user_packages
  ADD COLUMN IF NOT EXISTS referrer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS user_packages_referrer_id_idx
  ON public.user_packages (referrer_id);

-- ============================================================
-- 3. Affiliate commissions (earnings from referred sales)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.affiliate_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  package_id UUID NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
  user_package_id UUID REFERENCES public.user_packages(id) ON DELETE SET NULL,
  package_name TEXT NOT NULL DEFAULT '',
  package_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  commission_percent NUMERIC(5,2) NOT NULL DEFAULT 50,
  commission_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'credited' CHECK (status IN ('credited', 'reversed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS affiliate_commissions_affiliate_id_idx
  ON public.affiliate_commissions (affiliate_id);
CREATE INDEX IF NOT EXISTS affiliate_commissions_created_at_idx
  ON public.affiliate_commissions (created_at DESC);

ALTER TABLE public.affiliate_commissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Affiliates can read own commissions" ON public.affiliate_commissions;
CREATE POLICY "Affiliates can read own commissions"
  ON public.affiliate_commissions FOR SELECT
  USING (auth.uid() = affiliate_id);

DROP POLICY IF EXISTS "Admins can read all commissions" ON public.affiliate_commissions;
CREATE POLICY "Admins can read all commissions"
  ON public.affiliate_commissions FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "System can insert commissions" ON public.affiliate_commissions;
CREATE POLICY "System can insert commissions"
  ON public.affiliate_commissions FOR INSERT
  WITH CHECK (auth.uid() = affiliate_id OR public.is_admin() OR auth.uid() = buyer_id);

-- ============================================================
-- 4. Payment / withdrawal requests
-- ============================================================
CREATE TABLE IF NOT EXISTS public.payment_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL CHECK (amount >= 500),
  payment_method TEXT NOT NULL DEFAULT 'upi' CHECK (payment_method IN ('upi', 'bank')),
  upi_id TEXT,
  account_name TEXT,
  account_number TEXT,
  ifsc_code TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_note TEXT,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS payment_requests_user_id_idx ON public.payment_requests (user_id);
CREATE INDEX IF NOT EXISTS payment_requests_status_idx ON public.payment_requests (status);
CREATE INDEX IF NOT EXISTS payment_requests_created_at_idx ON public.payment_requests (created_at DESC);

ALTER TABLE public.payment_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own payment requests" ON public.payment_requests;
CREATE POLICY "Users can read own payment requests"
  ON public.payment_requests FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create payment requests" ON public.payment_requests;
CREATE POLICY "Users can create payment requests"
  ON public.payment_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id AND status = 'pending');

DROP POLICY IF EXISTS "Admins can read all payment requests" ON public.payment_requests;
CREATE POLICY "Admins can read all payment requests"
  ON public.payment_requests FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update payment requests" ON public.payment_requests;
CREATE POLICY "Admins can update payment requests"
  ON public.payment_requests FOR UPDATE
  USING (public.is_admin());
