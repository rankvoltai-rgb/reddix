ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS cached_replies jsonb,
  ADD COLUMN IF NOT EXISTS replies_generated_at timestamptz;