ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS deep_analyzed boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS analyzed_at timestamptz;