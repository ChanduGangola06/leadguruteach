-- Run this if you already applied the original schema.sql
-- Adds featured_courses, testimonials, instructors + media storage bucket

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

ALTER TABLE public.featured_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active featured courses"
  ON public.featured_courses FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admins can read all featured courses"
  ON public.featured_courses FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can insert featured courses"
  ON public.featured_courses FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update featured courses"
  ON public.featured_courses FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete featured courses"
  ON public.featured_courses FOR DELETE USING (public.is_admin());

CREATE POLICY "Public can read active testimonials"
  ON public.testimonials FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admins can read all testimonials"
  ON public.testimonials FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can insert testimonials"
  ON public.testimonials FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update testimonials"
  ON public.testimonials FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete testimonials"
  ON public.testimonials FOR DELETE USING (public.is_admin());

CREATE POLICY "Public can read active instructors"
  ON public.instructors FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admins can read all instructors"
  ON public.instructors FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can insert instructors"
  ON public.instructors FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update instructors"
  ON public.instructors FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete instructors"
  ON public.instructors FOR DELETE USING (public.is_admin());

INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', TRUE)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view media images"
  ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Admins can upload media images"
  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media' AND public.is_admin());
CREATE POLICY "Admins can update media images"
  ON storage.objects FOR UPDATE USING (bucket_id = 'media' AND public.is_admin());
CREATE POLICY "Admins can delete media images"
  ON storage.objects FOR DELETE USING (bucket_id = 'media' AND public.is_admin());
