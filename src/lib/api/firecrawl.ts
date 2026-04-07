import { supabase } from '@/integrations/supabase/client';

type FirecrawlResponse<T = any> = {
  success: boolean;
  error?: string;
  data?: T;
  leadsFound?: number;
  postsScanned?: number;
  hotLeads?: number;
  warmLeads?: number;
  message?: string;
};

type SearchOptions = {
  limit?: number;
  lang?: string;
  country?: string;
  tbs?: string;
  scrapeOptions?: { formats?: ('markdown' | 'html')[] };
};

type AutoGenerateKeywordsResponse = {
  success: boolean;
  error?: string;
  keywords?: Array<{ keyword: string; category: string; reasoning: string }>;
  summary?: string;
  inserted?: number;
};

type DiscoverSubredditsResponse = {
  success: boolean;
  error?: string;
  suggestions?: Array<{
    name: string;
    relevance_score: number;
    reasoning: string;
    typical_intent_signals: string[];
    estimated_activity: string;
    category: string;
  }>;
  analysis_summary?: string;
};

type AnalyzeWebsiteResponse = {
  success: boolean;
  error?: string;
  data?: {
    company_description: string;
    target_audience: string;
    value_proposition: string;
    key_features: string[];
    competitor_names: string[];
    pricing_model: string;
    unique_differentiators: string;
    common_objections: string[];
    success_stories: string;
    tone: string;
    suggested_keywords: string[];
  };
};

export const firecrawlApi = {
  async search(query: string, options?: SearchOptions): Promise<FirecrawlResponse> {
    const { data, error } = await supabase.functions.invoke('firecrawl-search', {
      body: { query, options },
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return data;
  },

  async scanForLeads(scanType: 'manual' | 'auto' = 'manual'): Promise<FirecrawlResponse> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data, error } = await supabase.functions.invoke('scan-reddit', {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      body: { scan_type: scanType },
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return data;
  },

  async autoGenerateKeywords(): Promise<AutoGenerateKeywordsResponse> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data, error } = await supabase.functions.invoke('auto-generate-keywords', {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return data;
  },

  async discoverSubreddits(): Promise<DiscoverSubredditsResponse> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data, error } = await supabase.functions.invoke('discover-subreddits', {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return data;
  },

  async analyzeWebsite(url: string): Promise<AnalyzeWebsiteResponse> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data, error } = await supabase.functions.invoke('analyze-website', {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      body: { url },
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return data;
  },
};
