import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Flame, Sparkles, Star, Zap, Trophy, LucideIcon } from 'lucide-react';

export interface BadgeMilestone {
  threshold: number;
  name: string;
  icon: LucideIcon;
  unlocked: boolean;
}

const MILESTONES: Omit<BadgeMilestone, 'unlocked'>[] = [
  { threshold: 1, name: 'First Contact', icon: Flame },
  { threshold: 10, name: 'Lead Hunter', icon: Sparkles },
  { threshold: 25, name: 'Rising Star', icon: Star },
  { threshold: 50, name: 'Power Player', icon: Zap },
  { threshold: 100, name: 'Lead Legend', icon: Trophy },
];

export function useBadges() {
  const { user } = useAuth();

  const { data: engagedCount = 0, isLoading } = useQuery({
    queryKey: ['engaged-leads-count', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('Not authenticated');
      const { count, error } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'engaged');
      if (error) throw error;
      return count ?? 0;
    },
    enabled: !!user?.id,
  });

  const badges: BadgeMilestone[] = MILESTONES.map((m) => ({
    ...m,
    unlocked: engagedCount >= m.threshold,
  }));

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return { badges, unlockedCount, totalBadges: MILESTONES.length, engagedCount, isLoading };
}
