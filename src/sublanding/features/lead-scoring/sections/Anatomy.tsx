import type { ReactNode } from 'react';
import { Brain, Crosshair, ScanLine } from 'lucide-react';
import { Band, LINE, SectionHead } from '@/components/landing/frame';
import { Reveal, SubredditIcon } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { ANATOMY } from '../content';
import { LevelChip } from '../../intent-detection/ui';

/* A numbered pin, matching a mark on the card to its explanation. */
function Pin({ n, className }: { n: number; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink text-[0.65rem] font-semibold text-white', className)}
    >
      {n}
    </span>
  );
}

function Callout({ n }: { n: number }) {
  const m = ANATOMY.marks[n];
  return (
    <li className="flex gap-3">
      <Pin n={n + 1} className="mt-0.5" />
      <div>
        <h3 className="text-[0.95rem] font-semibold text-ink">{m.title}</h3>
        <p className="mt-1 text-[0.86rem] leading-relaxed text-muted-foreground">{m.body}</p>
      </div>
    </li>
  );
}

function Marked({ n, children }: { n: number; children: ReactNode }) {
  return (
    <span className="relative inline-flex items-center pr-3.5">
      {children}
      <Pin n={n + 1} className="absolute -top-2.5 right-0 h-4 w-4 text-[0.55rem] ring-2 ring-white" />
    </span>
  );
}

/* The card in the middle; what each mark means on either side. */
export function Anatomy() {
  return (
    <section aria-labelledby="anatomy-title">
      <SectionHead icon={ScanLine} eyebrow={ANATOMY.pill} title={<span id="anatomy-title">{ANATOMY.title}</span>} subtitle={ANATOMY.body} />
      <Band inner="grid gap-10 px-5 py-12 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,25rem)_minmax(0,1fr)] lg:items-center lg:gap-12 lg:px-12 lg:py-16">
        <ol className="order-2 space-y-7 lg:order-1">
          {[0, 1, 2].map((n) => (
            <Callout key={n} n={n} />
          ))}
        </ol>

        <Reveal className="order-1 lg:order-2">
          <figure>
            <div className="rounded-xl border border-ink/[0.08] border-l-4 border-l-cta bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_18px_40px_-24px_rgba(16,24,40,0.28)]">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
                <Marked n={0}>
                  <LevelChip level="hot" />
                </Marked>
                <Marked n={1}>
                  <span className="text-[0.75rem] text-muted-foreground">Score: 51</span>
                </Marked>
                <Marked n={2}>
                  <span className="inline-flex h-6 items-center gap-1 rounded-md border border-cta/40 px-2 text-[0.72rem] font-medium text-cta">
                    <Crosshair className="h-3 w-3" />
                    Competitor
                  </span>
                </Marked>
                <Marked n={3}>
                  <span className="text-[0.68rem] text-muted-foreground">~55% conf</span>
                </Marked>
              </div>
              <p className="mt-4 text-[1rem] font-semibold leading-snug text-ink">
                Looking for an alternative to Pipewell for a 3-person team
              </p>
              <p className="mt-1.5 text-[0.85rem] leading-relaxed text-ink/60">
                We only use the contacts tab and the price went up again. What are small teams moving to?
              </p>
              <div className="relative mt-4 rounded-md border-l-2 border-cta/40 bg-surface px-3 py-2">
                <p className="text-[0.78rem] italic leading-relaxed text-muted-foreground">
                  <Brain className="mr-1 inline h-3 w-3 text-cta" />
                  Asks for a replacement for a competitor you listed, for a small team.
                </p>
                <Pin n={5} className="absolute -right-2 -top-2.5 h-4 w-4 text-[0.55rem] ring-2 ring-white" />
              </div>
              <div className={cn('mt-4 flex items-center gap-2 border-t pt-3 text-[0.72rem] text-muted-foreground', LINE)}>
                <SubredditIcon name="r/smallbusiness" className="h-4 w-4 text-[0.5rem]" />
                r/smallbusiness · 3 hours ago
              </div>
            </div>
            <figcaption className="mt-3 text-center text-[0.72rem] text-muted-foreground">{ANATOMY.note}</figcaption>
          </figure>
        </Reveal>

        <ol className="order-3 space-y-7" start={4}>
          {[3, 4].map((n) => (
            <Callout key={n} n={n} />
          ))}
        </ol>
      </Band>
    </section>
  );
}
