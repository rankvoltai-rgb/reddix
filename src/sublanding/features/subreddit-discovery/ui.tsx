/** Small pieces the page's sections share. */
import { Activity as Pulse } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Activity } from './content';

const ACTIVITY_LABEL: Record<Activity, string> = { high: 'High', medium: 'Medium', low: 'Low' };

/** The AI's activity estimate, labelled as one. */
export function ActivityTag({ activity, className }: { activity: Activity; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 text-[0.7rem] font-medium text-ink/55', className)}>
      <Pulse className="h-3 w-3" />
      {ACTIVITY_LABEL[activity]} activity (estimate)
    </span>
  );
}
