/** Small pieces the page's sections share: level chips, the 0–100 meter and
 *  highlighted post text. */
import { cn } from '@/lib/utils';
import type { Kind, Level, Segment } from './signals';

export const LEVEL_NAME: Record<Level, string> = { hot: 'Hot', warm: 'Warm', research: 'Research', low: 'Low' };

/** Deeper red the closer a post is to buying. */
export const LEVEL_CHIP: Record<Level, string> = {
  hot: 'bg-cta text-white',
  warm: 'bg-cta-soft text-cta-deep',
  research: 'bg-ink/[0.06] text-ink/70',
  low: 'bg-ink/[0.035] text-ink/45',
};

export const LEVEL_FILL: Record<Level, string> = {
  hot: 'bg-cta',
  warm: 'bg-cta/55',
  research: 'bg-cta/25',
  low: 'bg-ink/15',
};

export function LevelChip({ level, score, className }: { level: Level; score?: number; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex h-6 items-center gap-1 whitespace-nowrap rounded-md px-2 text-[0.72rem] font-semibold tabular-nums',
        LEVEL_CHIP[level],
        className,
      )}
    >
      {LEVEL_NAME[level]}
      {score !== undefined && <span className="opacity-80">· {score}</span>}
    </span>
  );
}

/** The band edges on the 0–100 scale, where the level changes. */
export const EDGES = [25, 40, 70];

/** A thin 0–100 track with the band edges ticked and the score filled in. */
export function Meter({ score, level, className }: { score: number; level: Level; className?: string }) {
  return (
    <div className={cn('relative h-1.5 rounded-full bg-ink/[0.06]', className)}>
      <div
        className={cn('absolute inset-y-0 left-0 rounded-full transition-[width,background-color] duration-700 ease-out', LEVEL_FILL[level])}
        style={{ width: `${score}%` }}
      />
      {EDGES.map((e) => (
        <span key={e} aria-hidden className="absolute -top-0.5 h-2.5 w-px bg-white" style={{ left: `${e}%` }} />
      ))}
    </div>
  );
}

export const KIND_LABEL: Record<Kind, string> = {
  competitor: 'Competitor',
  alt: 'Alternative to',
  pricing: 'Pricing',
  ask: 'Buying phrase',
  junk: 'Promo or noise',
};

/** How each matched phrase is marked in the text. */
export const KIND_MARK: Record<Kind, string> = {
  competitor: 'bg-cta text-white',
  alt: 'bg-white text-cta-deep ring-1 ring-inset ring-cta/50',
  pricing: 'bg-cta/[0.16] text-cta-deep',
  ask: 'bg-transparent text-ink underline decoration-cta decoration-2 underline-offset-[3px]',
  junk: 'bg-ink/[0.07] text-ink/55 line-through decoration-ink/40',
};

/** The legend's sample of each mark. */
export const KIND_SWATCH: Record<Kind, string> = {
  competitor: 'bg-cta',
  alt: 'bg-white ring-1 ring-inset ring-cta/50',
  pricing: 'bg-cta/[0.16]',
  ask: 'rounded-none border-b-2 border-cta',
  junk: 'bg-ink/[0.1]',
};

/** Post text with its signals marked. `lit` limits which kinds show, for the
 *  hero's step-by-step reveal. */
export function Marked({ segments, lit }: { segments: Segment[]; lit?: (kind: Kind) => boolean }) {
  return (
    <>
      {segments.map((s, i) => {
        if (!s.kind) return <span key={i}>{s.text}</span>;
        const on = lit ? lit(s.kind) : true;
        return (
          <mark
            key={i}
            title={KIND_LABEL[s.kind]}
            className={cn(
              'rounded-[0.3rem] px-[0.15em] py-[0.02em] [box-decoration-break:clone] transition-colors duration-300',
              on ? KIND_MARK[s.kind] : 'bg-transparent text-inherit',
            )}
          >
            {s.text}
          </mark>
        );
      })}
    </>
  );
}
