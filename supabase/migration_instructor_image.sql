-- Add instructor profile image
ALTER TABLE public.instructors
  ADD COLUMN IF NOT EXISTS image_url TEXT NOT NULL DEFAULT '';
