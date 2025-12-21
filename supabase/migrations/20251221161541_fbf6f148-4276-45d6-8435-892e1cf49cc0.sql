-- Drop the old constraint that limits intent_score to 1-10
ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_intent_score_check;

-- Add the new constraint with correct range 1-100
ALTER TABLE public.leads ADD CONSTRAINT leads_intent_score_check 
  CHECK (intent_score >= 1 AND intent_score <= 100);