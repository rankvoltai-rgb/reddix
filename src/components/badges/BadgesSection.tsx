import { useEffect, useMemo, useRef } from 'react';
import { useBadges } from '@/hooks/useBadges';
import { useAuth } from '@/hooks/useAuth';
import { BadgeCard } from './BadgeCard';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

function getSeenKey(userId: string) {
  return `badges-seen-${userId}`;
}

function getSeenBadges(userId: string): number[] {
  try {
    const raw = localStorage.getItem(getSeenKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function BadgesSection() {
  const { badges, unlockedCount, totalBadges, isLoading } = useBadges();
  const { user } = useAuth();
  const markedRef = useRef(false);

  const newThresholds = useMemo(() => {
    if (!user?.id || isLoading) return new Set<number>();
    const seen = getSeenBadges(user.id);
    return new Set(
      badges
        .filter((b) => b.unlocked && !seen.includes(b.threshold))
        .map((b) => b.threshold)
    );
  }, [badges, user?.id, isLoading]);

  useEffect(() => {
    if (!user?.id || isLoading || newThresholds.size === 0 || markedRef.current) return;
    markedRef.current = true;

    const newBadges = badges.filter((b) => newThresholds.has(b.threshold));
    newBadges.forEach((b) => {
      toast.success(`Badge Unlocked! You earned "${b.name}" 🎉`);
    });

    const timer = setTimeout(() => {
      const seen = getSeenBadges(user.id);
      const updated = [...new Set([...seen, ...newThresholds])];
      localStorage.setItem(getSeenKey(user.id), JSON.stringify(updated));
    }, 1800);

    return () => clearTimeout(timer);
  }, [newThresholds, user?.id, isLoading, badges]);

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-10">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-foreground">Achievements</h3>
        <span className="text-sm text-muted-foreground">
          {isLoading ? '…' : `${unlockedCount}/${totalBadges} unlocked`}
        </span>
      </div>
      {isLoading ? (
        <div className="flex gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="w-14 h-14 rounded-xl" />
              <Skeleton className="w-16 h-3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-6">
          {badges.map((badge) => (
            <BadgeCard key={badge.name} badge={badge} isNew={newThresholds.has(badge.threshold)} />
          ))}
        </div>
      )}
    </div>
  );
}
