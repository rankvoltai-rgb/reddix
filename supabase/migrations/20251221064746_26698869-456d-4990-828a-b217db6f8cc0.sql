-- Create enum for lead status
CREATE TYPE public.lead_status AS ENUM ('new', 'engaged', 'replied', 'converted', 'archived');

-- Create enum for intent level
CREATE TYPE public.intent_level AS ENUM ('hot', 'warm', 'research', 'low');

-- Create enum for tone preference
CREATE TYPE public.tone_preference AS ENUM ('professional', 'casual', 'friendly', 'technical', 'witty');

-- Create profiles table with onboarding data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  product_name TEXT,
  company_description TEXT,
  target_audience TEXT,
  value_proposition TEXT,
  tone tone_preference DEFAULT 'friendly',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create monitored subreddits table
CREATE TABLE public.monitored_subreddits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subreddit_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, subreddit_name)
);

-- Create keywords table
CREATE TABLE public.keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, keyword)
);

-- Create leads table
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  thread_url TEXT NOT NULL,
  thread_title TEXT,
  thread_content TEXT,
  subreddit TEXT NOT NULL,
  author TEXT,
  intent_score INTEGER CHECK (intent_score >= 1 AND intent_score <= 10),
  intent_level intent_level DEFAULT 'low',
  status lead_status DEFAULT 'new',
  relevance_notes TEXT,
  notes TEXT,
  discovered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reply drafts table
CREATE TABLE public.reply_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_posted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monitored_subreddits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reply_drafts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for monitored_subreddits
CREATE POLICY "Users can view own subreddits" ON public.monitored_subreddits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subreddits" ON public.monitored_subreddits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subreddits" ON public.monitored_subreddits
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own subreddits" ON public.monitored_subreddits
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for keywords
CREATE POLICY "Users can view own keywords" ON public.keywords
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own keywords" ON public.keywords
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own keywords" ON public.keywords
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own keywords" ON public.keywords
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for leads
CREATE POLICY "Users can view own leads" ON public.leads
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own leads" ON public.leads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own leads" ON public.leads
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own leads" ON public.leads
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for reply_drafts
CREATE POLICY "Users can view own drafts" ON public.reply_drafts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own drafts" ON public.reply_drafts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own drafts" ON public.reply_drafts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own drafts" ON public.reply_drafts
  FOR DELETE USING (auth.uid() = user_id);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reply_drafts_updated_at
  BEFORE UPDATE ON public.reply_drafts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();