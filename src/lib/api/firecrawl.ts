import { supabase } from '@/integrations/supabase/client';

type FirecrawlResponse<T = any> = {
  success: boolean;
  error?: string;
  data?: T;
  leadsFound?: number;
  postsScanned?: number;
  message?: string;
};

type SearchOptions = {
  limit?: number;
  lang?: string;
  country?: string;
  tbs?: string;
  scrapeOptions?: { formats?: ('markdown' | 'html')[] };
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

  async scanForLeads(): Promise<FirecrawlResponse> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data, error } = await supabase.functions.invoke('scan-reddit', {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return data;
  },
};
