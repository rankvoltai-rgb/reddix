
ALTER TABLE public.seen_posts
  ADD COLUMN IF NOT EXISTS last_score INTEGER,
  ADD COLUMN IF NOT EXISTS last_scored_at TIMESTAMPTZ;

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS quality_score INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS confidence NUMERIC(3,2),
  ADD COLUMN IF NOT EXISTS has_competitor_mention BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_leads_user_quality
  ON public.leads (user_id, quality_score DESC);
