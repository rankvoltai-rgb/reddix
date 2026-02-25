
-- Add search term caching columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS cached_search_terms jsonb,
  ADD COLUMN IF NOT EXISTS search_terms_cached_at timestamptz;
