-- LeadGuruTeach — Drop ALL objects created by schema.sql
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/wkugumqmthuuqwscbakd/sql/new
--
-- WARNING: This permanently deletes all app data in these tables.
--          It does NOT delete auth.users (login accounts stay).
-- After this, re-run supabase/schema.sql to recreate everything.

-- ============================================================
-- 1. Drop auth signup trigger (on auth.users)
-- ============================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- ============================================================
-- 2. Drop storage policies
-- ============================================================
DROP POLICY IF EXISTS "Public can view banner images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload banner images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update banner images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete banner images" ON storage.objects;

DROP POLICY IF EXISTS "Public can view media images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload media images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update media images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete media images" ON storage.objects;

-- ============================================================
-- 3. Delete storage objects + buckets (Supabase-safe method)
--    Direct DELETE is blocked unless allow_delete_query is set.
--    Optional: skip this section if you only want to reset app tables.
-- ============================================================
SELECT set_config('storage.allow_delete_query', 'true', true);

DELETE FROM storage.objects WHERE bucket_id IN ('banners', 'media');
DELETE FROM storage.buckets WHERE id IN ('banners', 'media');

SELECT set_config('storage.allow_delete_query', 'false', true);

-- ============================================================
-- 4. Drop all public tables (CASCADE removes policies, triggers, indexes)
-- ============================================================
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.payment_requests CASCADE;
DROP TABLE IF EXISTS public.affiliate_commissions CASCADE;
DROP TABLE IF EXISTS public.user_packages CASCADE;
DROP TABLE IF EXISTS public.instructors CASCADE;
DROP TABLE IF EXISTS public.testimonials CASCADE;
DROP TABLE IF EXISTS public.featured_courses CASCADE;
DROP TABLE IF EXISTS public.banners CASCADE;
DROP TABLE IF EXISTS public.packages CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- ============================================================
-- 5. Drop helper functions
-- ============================================================
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.set_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;

-- Done. Next step: run supabase/schema.sql to recreate.
