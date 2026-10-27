import { Sparkles, Workflow } from 'lucide-react';
import { Band, LINE, SectionHead } from '@/components/landing/frame';
import { Reveal } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { JOBS, LADDER, PLANS } from '../content';

/** The one step both workflows share, by index in each list. */
const SHARED = { them: 1, reddix: 2 };

/* Two vertical workflows on a rail each. The step they share is marked on
   both sides, so the overlap is one stop out of five. */
export function Jobs() {
  const cols = [
    { ...JOBS.them, shared: SHARED.them, red: false },
    { ...JOBS.reddix, shared: SHARED.reddix, red: true },
  ];
  return (
    <section aria-labelledby="jobs-title">
      <SectionHead icon={Workflow} eyebrow={JOBS.pill} title={<span id="jobs-title">{JOBS.title}</span>} subtitle={JOBS.body} />
      <Band inner="grid lg:grid-cols-2">
        {cols.map((c, ci) => (
          <div key={c.name} className={cn('px-6 py-9 sm:px-10 lg:px-12 lg:py-11', ci === 0 ? 'border-b lg:border-b-0 lg:border-r' : 'bg-surface/50', LINE)}>
            <h3 className={cn('text-[1.15rem] font-semibold tracking-[-0.015em]', c.red ? 'text-cta' : 'text-ink')}>{c.name}</h3>
            <p className="mt-1 text-[0.9rem] text-muted-foreground">{c.lead}</p>
            <ol className="relative mt-7 space-y-5 before:absolute before:bottom-2 before:left-[0.69rem] before:top-2 before:w-px before:bg-ink/[0.1]">
              {c.steps.map((s, i) => {
                const shared = i === c.shared;
                return (
                  <li key={s.t} className="relative flex gap-4">
                    <span
                      className={cn(
                        'relative z-10 flex h-[1.4rem] w-[1.4rem] shrink-0 items-center justify-center rounded-full border text-[0.68rem] font-semibold tabular-nums',
                        shared ? 'border-cta bg-cta text-white' : 'border-ink/[0.14] bg-white text-ink/60',
                      )}
                    >
                      {i + 1}
                    </span>
                    <Reveal delay={i * 0.05} className={cn('min-w-0 flex-1', shared && 'rounded-lg border border-cta/25 bg-cta-soft/50 px-3.5 py-3 -mt-1.5')}>
                      <p className="text-[0.95rem] font-semibold leading-snug text-ink">
                        {s.t}
                        {shared && <span className="ml-2 align-middle text-[0.65rem] font-semibold uppercase tracking-[0.06em] text-cta">Shared step</span>}
                      </p>
                      <p className="mt-1 text-[0.86rem] leading-relaxed text-muted-foreground">{s.d}</p>
                    </Reveal>
                  </li>
                );
              })}
            </ol>
            <p className={cn('mt-7 border-t pt-4 text-[0.82rem] leading-relaxed text-ink/70', LINE)}>{c.footnote}</p>
          </div>
        ))}
      </Band>
    </section>
  );
}

/* The four plans as stairs: each step up is higher and lists only what it
   adds. The step where AI scoring arrives carries the marker. */
export function Ladder() {
  return (
    <section aria-labelledby="ladder-title">
      <SectionHead icon={Sparkles} eyebrow={LADDER.pill} title={<span id="ladder-title">{LADDER.title}</span>} subtitle={LADDER.body} />
      <Band>
        <ol className="grid sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((p, i) => {
            const ai = p.id === 'pro';
            return (
              <li key={p.id} className={cn('border-b sm:border-r', LINE, 'lg:border-b-0', i === PLANS.length - 1 && 'lg:border-r-0')}>
                <Reveal delay={i * 0.07} className="flex h-full flex-col">
                  <div aria-hidden className="hidden lg:block" style={{ height: `${(PLANS.length - 1 - i) * 2.5}rem` }} />
                  <div className={cn('flex flex-1 flex-col border-t-4 px-6 pb-8 pt-6 sm:px-8', ai ? 'border-cta bg-cta-soft/40' : 'border-ink/15')}>
                    {ai && <p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-cta">{LADDER.marker}</p>}
                    <p className="text-[1rem] font-semibold text-ink">{p.name}</p>
                    <p className="mt-1 text-[1.9rem] font-semibold leading-none tracking-[-0.03em] tabular-nums text-ink">
                      ${p.price}
                      <span className="text-[0.85rem] font-medium tracking-normal text-muted-foreground">/month</span>
                    </p>
                    <ul className="mt-5 space-y-2 text-[0.84rem] leading-snug text-ink/75">
                      {p.unlocks.map((u) => (
                        <li key={u} className="flex gap-2">
                          <span aria-hidden className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-ink/40" />
                          {u}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </Band>
      <Band inner="grid text-[0.86rem] leading-relaxed text-muted-foreground sm:grid-cols-2">
        <p className={cn('border-b px-6 py-6 sm:border-b-0 sm:border-r sm:px-10 lg:px-12', LINE)}>{LADDER.alerts}</p>
        <p className="px-6 py-6 sm:px-10 lg:px-12">{LADDER.credits}</p>
      </Band>
    </section>
  );
}
