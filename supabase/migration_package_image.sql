-- Add package cover image
ALTER TABLE public.packages
  ADD COLUMN IF NOT EXISTS image_url TEXT NOT NULL DEFAULT '';
