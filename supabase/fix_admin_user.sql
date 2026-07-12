-- Promote an existing auth user to admin (Supabase SQL Editor)
-- Replace the email below with the account you created in Authentication → Users.

-- 1. Confirm email (skip if user can already log in)
UPDATE auth.users
SET
  email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
  confirmed_at = COALESCE(confirmed_at, NOW())
WHERE email = 'leadguruteach@gmail.com';

-- 2. Set admin role on profile (student → admin)
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'leadguruteach@gmail.com';

-- 3. Create profile if trigger did not run (Dashboard-created users)
INSERT INTO public.profiles (id, email, full_name, role)
SELECT
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', 'Admin'),
  'admin'
FROM auth.users
WHERE email = 'leadguruteach@gmail.com'
ON CONFLICT (id) DO UPDATE
SET role = 'admin', email = EXCLUDED.email;
