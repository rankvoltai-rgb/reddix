import { useBadges } from '@/hooks/useBadges';
import { BadgeCard } from './BadgeCard';
import { Skeleton } from '@/components/ui/skeleton';

export function BadgesSection() {
  const { badges, unlockedCount, totalBadges, isLoading } = useBadges();

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
            <BadgeCard key={badge.name} badge={badge} />
          ))}
        </div>
      )}
    </div>
  );
}
