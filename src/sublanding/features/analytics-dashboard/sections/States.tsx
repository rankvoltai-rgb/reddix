import { ArrowRight, Search, Signpost, Zap } from 'lucide-react';
import { Band, CELL, CellGrid, SectionHead } from '@/components/landing/frame';
import { Reveal } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { STATES } from '../content';

const ICONS = [Search, Zap];

/* The three panels side by side, each under the condition that shows it. */
export function States() {
  return (
    <section aria-labelledby="states-title">
      <SectionHead icon={Signpost} eyebrow={STATES.pill} title={<span id="states-title">{STATES.title}</span>} subtitle={STATES.body} />
      <Band>
        <CellGrid className="md:grid-cols-3">
          {STATES.states.map((s, i) => {
            const Icon = ICONS[i];
            return (
              <li key={s.title} className={cn(CELL, 'flex flex-col')}>
                <p className="flex items-center gap-2 border-b border-ink/[0.07] bg-surface/70 px-6 py-3 text-[0.72rem] font-semibold text-ink/70">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-ink/[0.12] bg-white text-[0.62rem] tabular-nums">{i + 1}</span>
                  When: {s.when}
                </p>
                <Reveal delay={i * 0.07} className="flex flex-1 flex-col p-6 sm:p-7">
                  <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-ink/[0.08] bg-white px-4 py-7 text-center">
                    {Icon ? (
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-ink/45">
                        <Icon className="h-5 w-5" />
                      </span>
                    ) : (
                      <ul aria-hidden className="w-full space-y-2">
                        {['bg-cta', 'bg-cta/55', 'bg-ink/35'].map((dot, j) => (
                          <li key={dot} className="flex items-center gap-2.5">
                            <span className={cn('h-2 w-2 shrink-0 rounded-full', dot)} />
                            <span className="h-2 flex-1 rounded-full bg-ink/[0.07]" style={{ maxWidth: `${88 - j * 14}%` }} />
                          </li>
                        ))}
                      </ul>
                    )}
                    <h3 className="mt-4 text-[1.02rem] font-semibold text-ink">{s.title}</h3>
                    <p className="mt-1.5 max-w-[16rem] text-[0.82rem] leading-relaxed text-muted-foreground">{s.body}</p>
                    <span className="mt-4 inline-flex items-center gap-1 rounded-md bg-ink px-2.5 py-1 text-[0.7rem] font-semibold text-white">
                      {s.action}
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </CellGrid>
      </Band>
    </section>
  );
}
