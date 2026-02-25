import { Lock } from 'lucide-react';
import type { BadgeMilestone } from '@/hooks/useBadges';

interface BadgeCardProps {
  badge: BadgeMilestone;
}

export function BadgeCard({ badge }: BadgeCardProps) {
  const Icon = badge.icon;

  return (
    <div className="flex flex-col items-center gap-2 min-w-[80px]">
      <div
        className={`relative w-14 h-14 rounded-xl flex items-center justify-center transition-all ${
          badge.unlocked
            ? 'bg-[hsl(0,80%,65%)] shadow-md'
            : 'bg-muted opacity-40 grayscale'
        }`}
      >
        <Icon className={`w-6 h-6 ${badge.unlocked ? 'text-white' : 'text-muted-foreground'}`} />
        {!badge.unlocked && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-background border border-border flex items-center justify-center">
            <Lock className="w-3 h-3 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="text-center">
        <p className={`text-xs font-medium ${badge.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
          {badge.name}
        </p>
        <p className="text-[10px] text-muted-foreground">{badge.threshold} lead{badge.threshold !== 1 ? 's' : ''}</p>
      </div>
    </div>
  );
}
