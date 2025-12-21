import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface DashboardStats {
  totalLeads: number;
  hotLeads: number;
  repliesReady: number;
  activeSubreddits: number;
}

interface RecentLead {
  id: string;
  thread_title: string | null;
  thread_url: string;
  intent_level: 'low' | 'research' | 'warm' | 'hot' | null;
  subreddit: string;
  discovered_at: string | null;
}

export function useDashboardStats() {
  const { user } = useAuth();

  const statsQuery = useQuery({
    queryKey: ['dashboard-stats', user?.id],
    queryFn: async (): Promise<DashboardStats> => {
      if (!user?.id) throw new Error('Not authenticated');

      const [leadsResult, hotLeadsResult, repliesResult, subredditsResult] = await Promise.all([
        supabase
          .from('leads')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id),
        supabase
          .from('leads')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('intent_level', 'hot'),
        supabase
          .from('reply_drafts')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('is_posted', false),
        supabase
          .from('monitored_subreddits')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('is_active', true),
      ]);

      return {
        totalLeads: leadsResult.count ?? 0,
        hotLeads: hotLeadsResult.count ?? 0,
        repliesReady: repliesResult.count ?? 0,
        activeSubreddits: subredditsResult.count ?? 0,
      };
    },
    enabled: !!user?.id,
  });

  const recentLeadsQuery = useQuery({
    queryKey: ['recent-leads', user?.id],
    queryFn: async (): Promise<RecentLead[]> => {
      if (!user?.id) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('leads')
        .select('id, thread_title, thread_url, intent_level, subreddit, discovered_at')
        .eq('user_id', user.id)
        .order('discovered_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user?.id,
  });

  return {
    stats: statsQuery.data,
    recentLeads: recentLeadsQuery.data ?? [],
    isLoading: statsQuery.isLoading || recentLeadsQuery.isLoading,
    error: statsQuery.error || recentLeadsQuery.error,
  };
}
