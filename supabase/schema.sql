-- LeadGuruTeach Supabase Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- ============================================================
-- 1. Profiles (extends auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 2. Packages (course bundles)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  tagline TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  original_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  courses_count INT NOT NULL DEFAULT 0,
  hours INT NOT NULL DEFAULT 0,
  enrollments TEXT NOT NULL DEFAULT '0',
  lectures INT NOT NULL DEFAULT 0,
  gradient TEXT NOT NULL DEFAULT 'from-purple-500/20 to-indigo-600/20',
  popular BOOLEAN NOT NULL DEFAULT FALSE,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  specialization JSONB NOT NULL DEFAULT '[]'::jsonb,
  journey_points JSONB NOT NULL DEFAULT '[]'::jsonb,
  bundle_courses JSONB NOT NULL DEFAULT '[]'::jsonb,
  includes JSONB NOT NULL DEFAULT '[]'::jsonb,
  certificate_steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 3. Banners (homepage carousel)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL,
  href TEXT NOT NULL DEFAULT '/',
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 4. Featured Courses (12-card grid on homepage)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.featured_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  href TEXT NOT NULL DEFAULT '/',
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 5. Testimonials
-- ============================================================
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Student',
  rating INT NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 6. Instructors
-- ============================================================
CREATE TABLE IF NOT EXISTS public.instructors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  avatar TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 7. User package purchases (enrollments)
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

-- ============================================================
-- 8. Audit logs (auth, API, button clicks)
-- ============================================================
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

-- ============================================================
-- 8. Updated_at trigger
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS packages_updated_at ON public.packages;
CREATE TRIGGER packages_updated_at
  BEFORE UPDATE ON public.packages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS banners_updated_at ON public.banners;
CREATE TRIGGER banners_updated_at
  BEFORE UPDATE ON public.banners
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS featured_courses_updated_at ON public.featured_courses;
CREATE TRIGGER featured_courses_updated_at
  BEFORE UPDATE ON public.featured_courses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS testimonials_updated_at ON public.testimonials;
CREATE TRIGGER testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS instructors_updated_at ON public.instructors;
CREATE TRIGGER instructors_updated_at
  BEFORE UPDATE ON public.instructors
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 9. Helper: check if user is admin
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================
-- 10. Row Level Security
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.featured_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: users read own profile; admins read all
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Packages: public read active; admin full CRUD
CREATE POLICY "Public can read active packages"
  ON public.packages FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Admins can read all packages"
  ON public.packages FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can insert packages"
  ON public.packages FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update packages"
  ON public.packages FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete packages"
  ON public.packages FOR DELETE
  USING (public.is_admin());

-- Banners: public read active; admin full CRUD
CREATE POLICY "Public can read active banners"
  ON public.banners FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Admins can read all banners"
  ON public.banners FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can insert banners"
  ON public.banners FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update banners"
  ON public.banners FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete banners"
  ON public.banners FOR DELETE
  USING (public.is_admin());

-- Featured courses: public read active; admin full CRUD
CREATE POLICY "Public can read active featured courses"
  ON public.featured_courses FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Admins can read all featured courses"
  ON public.featured_courses FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can insert featured courses"
  ON public.featured_courses FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update featured courses"
  ON public.featured_courses FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete featured courses"
  ON public.featured_courses FOR DELETE
  USING (public.is_admin());

-- Testimonials: public read active; admin full CRUD
CREATE POLICY "Public can read active testimonials"
  ON public.testimonials FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Admins can read all testimonials"
  ON public.testimonials FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can insert testimonials"
  ON public.testimonials FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update testimonials"
  ON public.testimonials FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete testimonials"
  ON public.testimonials FOR DELETE
  USING (public.is_admin());

-- Instructors: public read active; admin full CRUD
CREATE POLICY "Public can read active instructors"
  ON public.instructors FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Admins can read all instructors"
  ON public.instructors FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can insert instructors"
  ON public.instructors FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update instructors"
  ON public.instructors FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete instructors"
  ON public.instructors FOR DELETE
  USING (public.is_admin());

-- User packages: students read/insert own; admins read all
CREATE POLICY "Users can read own purchases"
  ON public.user_packages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can purchase packages"
  ON public.user_packages FOR INSERT
  WITH CHECK (auth.uid() = user_id AND status = 'active');

CREATE POLICY "Admins can read all purchases"
  ON public.user_packages FOR SELECT
  USING (public.is_admin());

-- Audit logs: anyone can insert; admins read
CREATE POLICY "Anyone can insert audit logs"
  ON public.audit_logs FOR INSERT
  WITH CHECK (event_category IN ('auth', 'api', 'button'));

CREATE POLICY "Admins can read audit logs"
  ON public.audit_logs FOR SELECT
  USING (public.is_admin());

-- ============================================================
-- 11. Storage bucket for banner images
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('banners', 'banners', TRUE)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view banner images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'banners');

CREATE POLICY "Admins can upload banner images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'banners' AND public.is_admin());

CREATE POLICY "Admins can update banner images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'banners' AND public.is_admin());

CREATE POLICY "Admins can delete banner images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'banners' AND public.is_admin());

INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', TRUE)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view media images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

CREATE POLICY "Admins can upload media images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'media' AND public.is_admin());

CREATE POLICY "Admins can update media images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'media' AND public.is_admin());

CREATE POLICY "Admins can delete media images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'media' AND public.is_admin());

-- ============================================================
-- 11. Seed data (optional — mirrors static lib files)
-- ============================================================
INSERT INTO public.packages (
  slug, name, tagline, description, price, original_price,
  courses_count, hours, enrollments, lectures, gradient, popular,
  features, specialization, journey_points, bundle_courses, includes
) VALUES
(
  'bronze-bundle', 'Bronze Bundle', 'Office Skills That Set You Apart!',
  'The Bronze Bundle is designed to make you efficient, professional, and job-ready.',
  1899, 2500, 4, 21, '140K+', 81, 'from-amber-600/20 to-orange-600/20', FALSE,
  '["Live Q&A Support","140K+ Students Enrolled","LeadGuruTeach Certificate"]',
  '["Microsoft Office Proficiency","Professional Communication","Resume & Interview Preparation"]',
  '[{"title":"Work Efficiency","description":"Organize work with MS Office tools."}]',
  '[{"title":"MS Word Course"},{"title":"MS Excel Course"},{"title":"MS PowerPoint Course"},{"title":"How To Crack Interview With Ease"}]',
  '["21 hours on-demand video","Full lifetime access","Certificate of Completion"]'
),
(
  'gold-package', 'Gold Package', 'Master In-Demand Skills & Start Earning!',
  'Our most popular bundle combining advanced digital marketing and affiliate marketing.',
  6999, 7999, 23, 70, '70K+', 340, 'from-yellow-500/20 to-amber-600/20', TRUE,
  '["Live Q&A Support","70K+ Students Enrolled","LeadGuruTeach Certificate"]',
  '["Advanced Digital Marketing","Sales & Business Development","Affiliate Marketing"]',
  '[{"title":"High-Income Skill Mastery","description":"Learn in-demand skills."}]',
  '[{"title":"Facebook Ads Mastery"},{"title":"Affiliate Marketing Pro"},{"title":"SEO & Content Marketing"}]',
  '["70 hours on-demand video","Full lifetime access","Live Q&A sessions","Certificate of Completion"]'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.banners (title, image_url, href, sort_order) VALUES
(
  'Learn from expert trainers',
  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1920&q=80',
  '/auth', 1
),
(
  'Join 2 Lakh+ students',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&q=80',
  '/#courses', 2
)
ON CONFLICT DO NOTHING;

INSERT INTO public.featured_courses (title, image_url, category, href, sort_order) VALUES
('Digital Marketing Mastery', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80', 'Marketing', '/bundle/gold-package', 1),
('Public Speaking Excellence', 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&q=80', 'Communication', '/bundle/silver-package', 2),
('Video Editing Pro', 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&q=80', 'Creative', '/bundle/gold-package', 3),
('LinkedIn Personal Branding', 'https://images.unsplash.com/photo-1611941872454-41344b4c8b0e?w=600&q=80', 'Career', '/bundle/silver-package', 4),
('MS Excel Advanced', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80', 'Office Skills', '/bundle/bronze-bundle', 5),
('MS Word Professional', 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&q=80', 'Office Skills', '/bundle/bronze-bundle', 6),
('MS PowerPoint Design', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80', 'Office Skills', '/bundle/bronze-bundle', 7),
('Crack Interview With Ease', 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&q=80', 'Career', '/bundle/bronze-bundle', 8),
('Affiliate Marketing Pro', 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=600&q=80', 'Earning', '/bundle/gold-package', 9),
('English Fluency Coach', 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&q=80', 'Communication', '/bundle/silver-package', 10),
('Facebook Ads Expert', 'https://images.unsplash.com/photo-1611162617213-7d7a39e152b8?w=600&q=80', 'Marketing', '/bundle/platinum-package', 11),
('Personal Branding 101', 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80', 'Career', '/bundle/silver-package', 12)
ON CONFLICT DO NOTHING;

INSERT INTO public.testimonials (quote, name, role, rating, sort_order) VALUES
('The best platform I have ever used in this industry. And the best thing is same day payout!', 'Ishika Pandey', 'Student', 5, 1),
('LeadGuruTeach helped me remain updated with recent trends and advancements. Now there is no looking back.', 'Ananya Sharma', 'Student', 5, 2),
('If you are a newbie or an expert, LeadGuruTeach has covered everything under one roof for skill development.', 'Ravi Pandey', 'Student', 5, 3),
('This platform helped me overcome my fears and make the most out of given opportunities.', 'Deepak Saini', 'Student', 5, 4),
('LeadGuruTeach has completely transformed my life and helped me become the best version of myself.', 'Arun Shaoo', 'Student', 5, 5),
('I used to struggle with communication. LeadGuruTeach helped me improve and become efficient in discussions.', 'Priyanka Sharma', 'Student', 5, 6)
ON CONFLICT DO NOTHING;

INSERT INTO public.instructors (name, title, avatar, sort_order) VALUES
('Srijan Mitra', 'Video Editing Coach', 'SM', 1),
('Sapna Patheja', 'Mind & Life Coach', 'SP', 2),
('Rahul Jain', 'Business Strategist', 'RJ', 3),
('Jai Purohit', 'Sales Expert', 'JP', 4),
('Ashu Gandhi', 'Digital Marketer', 'AG', 5),
('Shruti Lohariwal', 'Freelancer Instructor', 'SL', 6),
('Karan Rana', 'Productivity Coach', 'KR', 7),
('Shivam', 'Emotional Intelligence Coach', 'SH', 8),
('Rahul Bansal', 'Content Creator', 'RB', 9),
('Saud Siraj', 'Self-Development Coach', 'SS', 10),
('Sachin Thakur', 'English Speaking Coach', 'ST', 11),
('Abhay Ranjan', 'Digital Marketing Specialist', 'AR', 12),
('Shraddha Shrivastava', 'LinkedIn Coach', 'SS', 13),
('Abhishek Vishnoi', 'English Fluency Coach', 'AV', 14),
('Taiba Mehmood', 'Storytelling Expert', 'TM', 15),
('Vinit Aggarwal', 'Stock Market Trainer', 'VA', 16),
('Rajat Mathur', 'Career & Interview Coach', 'RM', 17),
('Avi Arya', 'Digital Marketing Expert', 'AA', 18)
ON CONFLICT DO NOTHING;

-- After first admin signup, promote to admin:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'your@email.com';

