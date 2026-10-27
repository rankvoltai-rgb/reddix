/**
 * The strip under the landing hero: a full-width hairline band inside the
 * page rails, framed by a laurel wing at each end, holding the hero's three
 * proof points.
 */
import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';
import { RedditMark } from './subreddit-ticker';

const LINE = 'border-ink/[0.07]';

export function Laurel({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 52" aria-hidden className={className}>
      <path d="M18 50C1 40 1 12 18 2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M14.2 47.3Q16.8 44.6 15.3 41.2Q12.7 43.9 14.2 47.3ZM14.2 47.3Q10.7 46.1 8.3 49.0Q11.9 50.2 14.2 47.3ZM9.8 42.1Q12.9 40.3 12.4 36.7Q9.3 38.6 9.8 42.1ZM9.8 42.1Q6.8 40.2 3.9 42.2Q6.9 44.2 9.8 42.1ZM6.9 36.1Q10.2 35.1 10.5 31.6Q7.2 32.6 6.9 36.1ZM6.9 36.1Q4.6 33.5 1.3 34.8Q3.7 37.3 6.9 36.1ZM5.4 29.4Q8.7 29.2 9.7 26.0Q6.4 26.3 5.4 29.4ZM5.4 29.4Q3.8 26.6 0.5 27.0Q2.2 29.9 5.4 29.4ZM5.4 22.6Q8.5 23.1 10.1 20.3Q7.0 19.9 5.4 22.6ZM5.4 22.6Q4.5 19.6 1.3 19.4Q2.3 22.4 5.4 22.6ZM6.9 15.9Q9.7 17.0 11.7 14.8Q8.9 13.7 6.9 15.9ZM6.9 15.9Q6.7 13.0 3.8 12.1Q4.0 15.1 6.9 15.9ZM9.8 9.9Q12.2 11.5 14.5 9.9Q12.2 8.3 9.8 9.9ZM9.8 9.9Q10.3 7.1 7.8 5.6Q7.4 8.4 9.8 9.9ZM13.8 5.1Q15.6 7.2 18.1 6.3Q16.4 4.2 13.8 5.1ZM13.8 5.1Q14.9 2.6 13.0 0.7Q11.9 3.2 13.8 5.1Z"
        fill="currentColor"
      />
    </svg>
  );
}

function Label({ children }: { children: string }) {
  return (
    <span className="whitespace-nowrap text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground/85 sm:text-[0.64rem] sm:tracking-[0.2em]">
      {children}
    </span>
  );
}

function Stat({ value, label, className }: { value: string; label: string; className?: string }) {
  return (
    <div className={cn('flex h-[72px] items-center justify-center gap-2 sm:gap-2.5', className)}>
      <span className="text-[1.3rem] font-[700] leading-none tracking-tight text-ink/75">{value}</span>
      <Label>{label}</Label>
    </div>
  );
}

export function HeroProofBand({ style, className }: { style?: CSSProperties; className?: string }) {
  return (
    <div className={cn('border-y bg-white font-jakarta', LINE, className)} style={style}>
      <div className={cn('relative mx-auto max-w-6xl border-x', LINE)}>
        <Laurel className="pointer-events-none absolute left-5 top-1/2 hidden h-[68px] w-auto -translate-y-1/2 text-ink/[0.1] md:block" />
        <Laurel className="pointer-events-none absolute right-5 top-1/2 hidden h-[68px] w-auto -translate-y-1/2 -scale-x-100 text-ink/[0.1] md:block" />

        <div className="grid grid-cols-2 md:mx-16 md:grid-cols-[1.5fr_1fr_1fr]">
          <div
            className={cn(
              'group/reddit col-span-2 flex h-[72px] items-center justify-center gap-3 border-b md:col-span-1 md:border-b-0 md:border-r',
              LINE,
            )}
          >
            <Label>Leads found on</Label>
            <span className="flex items-center gap-1.5 text-[1.05rem] font-semibold tracking-tight text-ink/70 transition-colors group-hover/reddit:text-ink">
              <RedditMark className="h-[18px] w-[18px] opacity-60 grayscale transition-[filter,opacity] duration-200 group-hover/reddit:opacity-100 group-hover/reddit:grayscale-0" />
              Reddit
            </span>
          </div>
          <Stat value="100K+" label="Leads found" className={cn('border-r', LINE)} />
          <Stat value="500+" label="SaaS teams" />
        </div>
      </div>
    </div>
  );
}
