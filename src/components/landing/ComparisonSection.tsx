import { Check, Clock, Radar, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Reveal } from './shared';
import { Accent, Band, LINE, SectionHead, Spacer } from './frame';

const ROWS: { feature: string; manual: string | boolean; reddix: string | boolean }[] = [
  { feature: 'Time to first lead', manual: '2–4 hours a day', reddix: '2 minutes' },
  { feature: 'Intent detection', manual: false, reddix: true },
  { feature: 'Lead scoring (0–100)', manual: false, reddix: true },
  { feature: 'AI reply drafts', manual: false, reddix: true },
  { feature: 'Subreddit discovery', manual: 'Trial and error', reddix: 'AI-powered' },
  { feature: 'Duplicate filtering', manual: false, reddix: true },
  { feature: 'Scheduled 24/7 scans', manual: false, reddix: true },
  { feature: 'Lead tracking', manual: 'Spreadsheet', reddix: 'Built-in' },
  { feature: 'Scales without burnout', manual: false, reddix: true },
];

function Value({ value, ours }: { value: string | boolean; ours?: boolean }) {
  if (value === true) {
    return (
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cta text-white">
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
        <span className="sr-only">Yes</span>
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink/[0.05] text-ink/35">
        <X className="h-3.5 w-3.5" strokeWidth={2.5} />
        <span className="sr-only">No</span>
      </span>
    );
  }
  return <span className={cn('text-[0.85rem]', ours ? 'font-semibold text-ink' : 'text-muted-foreground')}>{value}</span>;
}

/* Three columns on the page's own hairlines: what you'd do by hand, and what
   Reddix does, with Reddix's column held in a soft red key. */
const GRID = 'grid grid-cols-[1.25fr_1fr_1fr] sm:grid-cols-[1.6fr_1fr_1fr]';

export function ComparisonSection() {
  return (
    <section>
      <Spacer />
      <SectionHead
        icon={Clock}
        eyebrow="The old way is broken"
        title={
          <>
            Scrolling Reddit by hand <Accent>vs. Reddix</Accent>
          </>
        }
        subtitle="One path burns three hours a day. The other takes two minutes. Same channel, wildly different results."
      />
      <Band>
        <Reveal>
          <div role="table" aria-label="Manual Reddit prospecting compared with Reddix">
            <div role="row" className={cn(GRID, 'border-b', LINE)}>
              <span role="columnheader" className="px-5 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:px-8">
                Feature
              </span>
              <span role="columnheader" className={cn('flex items-center justify-center gap-2 border-l px-3 py-4 text-[0.8rem] font-medium text-muted-foreground', LINE)}>
                <Clock className="h-3.5 w-3.5 opacity-60" />
                By hand
              </span>
              <span role="columnheader" className={cn('flex items-center justify-center gap-2 border-l bg-cta-soft/60 px-3 py-4 text-[0.85rem] font-semibold text-cta', LINE)}>
                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-cta">
                  <Radar className="h-3 w-3 text-white" />
                </span>
                Reddix
              </span>
            </div>
            {ROWS.map((r) => (
              <div key={r.feature} role="row" className={cn(GRID, 'border-b transition-colors hover:bg-surface/50', LINE)}>
                <span role="rowheader" className="flex items-center px-5 py-3.5 text-[0.9rem] font-medium text-ink sm:px-8">
                  {r.feature}
                </span>
                <span role="cell" className={cn('flex items-center justify-center border-l px-3 py-3.5 text-center', LINE)}>
                  <Value value={r.manual} />
                </span>
                <span role="cell" className={cn('flex items-center justify-center border-l bg-cta-soft/40 px-3 py-3.5 text-center', LINE)}>
                  <Value value={r.reddix} ours />
                </span>
              </div>
            ))}
            <div role="row" className={GRID}>
              <span role="rowheader" className="flex items-center px-5 py-4 text-[0.9rem] font-semibold text-ink sm:px-8">
                Verdict
              </span>
              <span role="cell" className={cn('flex items-center justify-center border-l px-3 py-4 text-[0.85rem] font-medium text-muted-foreground', LINE)}>
                Burnout
              </span>
              <span role="cell" className={cn('flex items-center justify-center border-l bg-cta-soft/60 px-3 py-4 text-[0.85rem] font-semibold text-cta', LINE)}>
                Autopilot
              </span>
            </div>
          </div>
        </Reveal>
      </Band>
    </section>
  );
}
