-- Add last_scan_at column for rate limiting
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_scan_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.last_scan_at IS 'Timestamp of last scan for rate limiting (1 scan per 5 minutes)';