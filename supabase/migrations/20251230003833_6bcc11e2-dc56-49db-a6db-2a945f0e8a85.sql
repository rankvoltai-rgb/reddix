-- Add full_name and initial_setup_completed columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS full_name text,
ADD COLUMN IF NOT EXISTS initial_setup_completed boolean DEFAULT false;