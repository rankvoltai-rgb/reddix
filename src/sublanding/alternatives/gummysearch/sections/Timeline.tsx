import { Clock3 } from 'lucide-react';
import { Band, CELL, CellGrid, SectionHead } from '@/components/landing/frame';
import { Reveal } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { PHASES } from '../content';
import { phaseIndex } from '../dates';
import { useToday } from '../useToday';

/* The three phases side by side; the one today falls in is marked. */
export function Timeline() {
  const now = useToday();
  const current = phaseIndex(now, PHASES.phases);
  return (
    <section aria-labelledby="phases-title">
      <SectionHead icon={Clock3} eyebrow={PHASES.pill} title={<span id="phases-title">{PHASES.title}</span>} subtitle={PHASES.body} />
      <Band>
        <CellGrid className="md:grid-cols-3">
          {PHASES.phases.map((p, i) => {
            const isNow = i === current;
            const past = i < current;
            return (
              <li key={p.title} className={cn(CELL, isNow && 'bg-cta-soft/50')}>
                <Reveal delay={i * 0.07} className="flex h-full flex-col p-6 sm:p-8">
                  <div className="flex items-center justify-between gap-3">
                    <span className={cn('text-[0.75rem] font-semibold tabular-nums', isNow ? 'text-cta' : 'text-muted-foreground')}>0{i + 1}</span>
                    {isNow && (
                      <span className="rounded-md bg-cta px-2 py-0.5 text-[0.68rem] font-semibold text-white">You are here</span>
                    )}
                    {past && <span className="text-[0.7rem] font-medium text-muted-foreground">Over</span>}
                  </div>
                  <p className="mt-5 text-[0.78rem] font-medium text-muted-foreground">{p.label}</p>
                  <h3 className={cn('mt-1 text-[1.2rem] font-semibold tracking-[-0.02em]', past ? 'text-ink/55' : 'text-ink')}>{p.title}</h3>
                  <p className={cn('mt-2.5 text-[0.9rem] leading-relaxed', past ? 'text-ink/45' : 'text-muted-foreground')}>{p.body}</p>
                </Reveal>
              </li>
            );
          })}
        </CellGrid>
      </Band>
    </section>
  );
}
