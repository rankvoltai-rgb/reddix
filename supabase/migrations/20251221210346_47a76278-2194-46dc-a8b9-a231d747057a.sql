-- Add enhanced profile fields for better AI context
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS product_url TEXT,
ADD COLUMN IF NOT EXISTS key_features TEXT[],
ADD COLUMN IF NOT EXISTS competitor_names TEXT[],
ADD COLUMN IF NOT EXISTS common_objections TEXT[],
ADD COLUMN IF NOT EXISTS success_stories TEXT,
ADD COLUMN IF NOT EXISTS pricing_model TEXT,
ADD COLUMN IF NOT EXISTS unique_differentiators TEXT;