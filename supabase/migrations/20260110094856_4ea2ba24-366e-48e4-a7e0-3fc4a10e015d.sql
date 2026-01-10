-- Phase 1: Scanner Optimization Tables

-- 1. Seen posts table for deduplication across scans
CREATE TABLE public.seen_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  post_url text NOT NULL,
  post_hash text GENERATED ALWAYS AS (encode(sha256(post_url::bytea), 'hex')) STORED,
  first_seen_at timestamptz DEFAULT now(),
  last_seen_at timestamptz DEFAULT now(),
  UNIQUE(user_id, post_url)
);

-- Index for fast lookups
CREATE INDEX idx_seen_posts_user_hash ON public.seen_posts(user_id, post_hash);
CREATE INDEX idx_seen_posts_user_url ON public.seen_posts(user_id, post_url);

-- Enable RLS
ALTER TABLE public.seen_posts ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view own seen posts" ON public.seen_posts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own seen posts" ON public.seen_posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own seen posts" ON public.seen_posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own seen posts" ON public.seen_posts
  FOR DELETE USING (auth.uid() = user_id);

-- Service role full access for edge functions
CREATE POLICY "Service role full access on seen_posts" ON public.seen_posts
  FOR ALL USING (auth.role() = 'service_role');


-- 2. Scan history table for tracking scan results over time
CREATE TABLE public.scan_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  scan_type text NOT NULL DEFAULT 'manual', -- 'manual', 'scheduled', 'auto'
  posts_scanned integer DEFAULT 0,
  leads_found integer DEFAULT 0,
  hot_leads integer DEFAULT 0,
  warm_leads integer DEFAULT 0,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  status text DEFAULT 'running', -- 'running', 'completed', 'failed'
  error_message text,
  created_at timestamptz DEFAULT now()
);

-- Index for user queries
CREATE INDEX idx_scan_history_user ON public.scan_history(user_id, created_at DESC);

-- Enable RLS
ALTER TABLE public.scan_history ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view own scan history" ON public.scan_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role full access on scan_history" ON public.scan_history
  FOR ALL USING (auth.role() = 'service_role');


-- 3. Add is_auto_generated column to keywords table
ALTER TABLE public.keywords 
  ADD COLUMN IF NOT EXISTS is_auto_generated boolean DEFAULT false;


-- 4. Add auto_pilot settings to profiles table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS auto_pilot_enabled boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS scan_frequency_hours integer DEFAULT 4,
  ADD COLUMN IF NOT EXISTS next_scheduled_scan_at timestamptz;