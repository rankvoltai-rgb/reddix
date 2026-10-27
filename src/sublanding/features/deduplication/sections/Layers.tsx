import type { ReactNode } from 'react';
import { ArrowRight, Layers3 } from 'lucide-react';
import { Band, LINE, Pill, SECTION_TITLE } from '@/components/landing/frame';
import { Reveal } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { LAYERS } from '../content';
import { WINDOW_DAYS } from '../memory';

/* Heading held on the left while the three layers scroll by on the right,
   each with a small drawing of what it catches. */
export function Layers() {
  const drawings = [<SameScan key="a" />, <AcrossScans key="b" />, <Promotion key="c" />];
  return (
    <section aria-labelledby="layers-title">
      <Band inner="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
        <div className={cn('border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14', LINE)}>
          <div className="lg:sticky lg:top-28">
            <Pill icon={Layers3}>{LAYERS.pill}</Pill>
            <h2 id="layers-title" className={cn('mt-5', SECTION_TITLE)}>
              {LAYERS.title}
            </h2>
            <p className="mt-4 max-w-md text-[0.98rem] leading-relaxed text-muted-foreground">{LAYERS.body}</p>
          </div>
        </div>
        <ol className="divide-y divide-ink/[0.07]">
          {LAYERS.items.map((item, i) => (
            <li key={item.title}>
              <Reveal y={12} className="px-6 py-9 sm:px-10 lg:px-12 lg:py-12">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[0.75rem] font-semibold tabular-nums text-cta">Layer {i + 1}</span>
                  <span className="rounded-md border border-ink/[0.08] bg-surface px-2 py-0.5 text-[0.72rem] font-medium text-ink/70">{item.tag}</span>
                </div>
                <h3 className="mt-2 text-[1.2rem] font-semibold tracking-[-0.02em] text-ink">{item.title}</h3>
                <p className="mt-2 max-w-[34rem] text-[0.93rem] leading-relaxed text-muted-foreground">{item.body}</p>
                <div aria-hidden className="mt-6 rounded-lg border border-ink/[0.07] bg-surface/60 px-4 py-4">
                  {drawings[i]}
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </Band>
    </section>
  );
}

function LinkChip({ children, faded }: { children: ReactNode; faded?: boolean }) {
  return (
    <span
      className={cn(
        'block truncate rounded-md border bg-white px-2.5 py-1.5 font-mono text-[0.68rem]',
        faded ? 'border-dashed border-ink/[0.12] text-ink/35 line-through' : 'border-ink/[0.1] text-ink/75',
      )}
    >
      {children}
    </span>
  );
}

function SameScan() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
      <div className="space-y-1.5">
        <LinkChip>r/smallbusiness/comments/…/simpler_crm</LinkChip>
        <LinkChip faded>r/smallbusiness/comments/…/simpler_crm</LinkChip>
        <LinkChip faded>r/smallbusiness/comments/…/simpler_crm</LinkChip>
      </div>
      <ArrowRight className="h-4 w-4 text-ink/30" />
      <div>
        <LinkChip>r/smallbusiness/comments/…/simpler_crm</LinkChip>
        <p className="mt-1.5 text-[0.68rem] font-medium text-cta">Read once</p>
      </div>
    </div>
  );
}

function AcrossScans() {
  const days = Array.from({ length: WINDOW_DAYS + 1 }, (_, i) => i + 1);
  return (
    <div>
      <div className="grid grid-cols-8 gap-1">
        {days.map((d) => (
          <span
            key={d}
            className={cn(
              'flex h-8 items-center justify-center rounded-md text-[0.66rem] font-semibold tabular-nums',
              d === 1 && 'bg-cta text-white',
              d > 1 && d <= WINDOW_DAYS && 'bg-[repeating-linear-gradient(135deg,hsl(var(--cta)/0.14)_0_4px,transparent_4px_8px)] text-cta-deep',
              d > WINDOW_DAYS && 'border border-ink/[0.14] bg-white text-ink/60',
            )}
          >
            {d}
          </span>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[0.68rem] text-muted-foreground">
        <span>Day 1: read</span>
        <span>Days 2–{WINDOW_DAYS}: skipped</span>
        <span>Day {WINDOW_DAYS + 1}: can be read again</span>
      </div>
    </div>
  );
}

function Promotion() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="rounded-md bg-ink/[0.06] px-2.5 py-1.5 text-[0.75rem] text-ink/55 line-through decoration-ink/40">“I built a tiny CRM, check out my…”</span>
      <ArrowRight className="h-4 w-4 text-ink/30" />
      <span className="rounded-md border border-ink/[0.1] bg-white px-2.5 py-1.5 text-[0.72rem] font-semibold tabular-nums text-ink">Remembered · score 0</span>
    </div>
  );
}
