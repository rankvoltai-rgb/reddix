import { useId, useMemo, useState } from 'react';
import { Check, Minus, X } from 'lucide-react';
import { Band, LINE, SECTION_TITLE } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { PLANNER, SOURCES_WATCHED } from '../content';
import { coverage, syftenPlan, verdict } from '../plan';

const LABEL = 'text-[0.8rem] font-semibold text-ink';

/* Tick sources and needs; the planner reads Syften's and Reddix's published
   coverage and Syften's plan limits (plan.ts), and says what fits. */
export function Planner() {
  const ids = { filters: useId(), ai: useId(), slack: useId() };
  const [sources, setSources] = useState<string[]>(['Reddit', 'Hacker News']);
  const [filters, setFilters] = useState(5);
  const [ai, setAi] = useState(true);
  const [slack, setSlack] = useState(false);

  const toggle = (name: string) => setSources((s) => (s.includes(name) ? s.filter((x) => x !== name) : [...s, name]));
  const plan = useMemo(() => syftenPlan({ sources, filters, ai, slack }), [sources, filters, ai, slack]);
  const cov = useMemo(() => coverage(sources), [sources]);
  const read = useMemo(() => verdict(sources), [sources]);

  return (
    <section id="planner" aria-labelledby="planner-title" className="scroll-mt-16">
      <Band inner="px-6 py-12 sm:px-10 sm:py-14 lg:px-12">
        <h2 id="planner-title" className={SECTION_TITLE}>
          {PLANNER.title}
        </h2>
        <p className="mt-4 max-w-2xl text-[0.95rem] leading-relaxed text-muted-foreground">{PLANNER.body}</p>
      </Band>
      <Band inner="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        {/* ---------- needs ---------- */}
        <div className="min-w-0 px-5 py-8 sm:px-10 lg:px-12 lg:py-10">
          <fieldset>
            <legend className={LABEL}>Where your buyers talk</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {SOURCES_WATCHED.map((s) => {
                const on = sources.includes(s.name);
                return (
                  <button
                    key={s.name}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggle(s.name)}
                    className={cn(
                      'inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-[0.8rem] font-medium transition-colors',
                      on ? 'border-ink bg-ink text-white' : 'border-ink/[0.1] bg-white text-ink/75 hover:border-ink/[0.22] hover:text-ink',
                    )}
                  >
                    {on && <Check className="h-3 w-3" />}
                    {s.name}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-8 flex items-baseline justify-between gap-3">
            <label htmlFor={ids.filters} className={LABEL}>
              {PLANNER.filtersLabel}
            </label>
            <span className="text-[0.85rem] font-semibold tabular-nums text-ink">{filters}</span>
          </div>
          <input
            id={ids.filters}
            type="range"
            min={1}
            max={120}
            value={filters}
            onChange={(e) => setFilters(Number(e.target.value))}
            className="mt-2 w-full accent-cta"
          />
          <div className="mt-1 flex justify-between text-[0.7rem] tabular-nums text-muted-foreground">
            <span>1</span>
            <span>120</span>
          </div>

          <div className="mt-6 space-y-3">
            {[
              { id: ids.ai, label: PLANNER.aiLabel, value: ai, set: setAi },
              { id: ids.slack, label: PLANNER.slackLabel, value: slack, set: setSlack },
            ].map((o) => (
              <label key={o.id} htmlFor={o.id} className="flex cursor-pointer items-center gap-3 text-[0.88rem] text-ink">
                <input id={o.id} type="checkbox" checked={o.value} onChange={(e) => o.set(e.target.checked)} className="h-4 w-4 accent-cta" />
                {o.label}
              </label>
            ))}
          </div>
          <p className={cn('mt-8 border-t pt-4 text-[0.75rem] leading-relaxed text-muted-foreground', LINE)}>{PLANNER.note}</p>
        </div>

        {/* ---------- the read ---------- */}
        <div aria-live="polite" className={cn('min-w-0 border-t bg-surface/70 px-5 py-8 sm:px-10 lg:border-l lg:border-t-0 lg:px-12 lg:py-10', LINE)}>
          {read ? (
            <>
              <p className="text-[1.25rem] font-semibold leading-snug tracking-[-0.02em] text-ink">{read.title}</p>
              <p className="mt-2 text-[0.9rem] leading-relaxed text-muted-foreground">{read.body}</p>
            </>
          ) : (
            <p className="text-[0.95rem] text-muted-foreground">Pick at least one place your buyers talk.</p>
          )}

          {cov.picked.length > 0 && (
            <table className="mt-6 w-full overflow-hidden rounded-lg border border-ink/[0.08] bg-white text-[0.82rem]">
              <thead>
                <tr className="border-b border-ink/[0.07] text-left text-[0.7rem] uppercase tracking-[0.06em] text-muted-foreground">
                  <th className="px-3 py-2 font-semibold">Source</th>
                  <th className="px-3 py-2 font-semibold">Syften</th>
                  <th className="px-3 py-2 font-semibold">Reddix</th>
                </tr>
              </thead>
              <tbody>
                {cov.picked.map((s) => (
                  <tr key={s.name} className="border-b border-ink/[0.05] last:border-0">
                    <td className="px-3 py-2 font-medium text-ink">{s.name}</td>
                    <td className="px-3 py-2">
                      <Cell state={s.syften === 'yes' ? 'yes' : s.syften === 'addon' ? 'addon' : 'no'} />
                    </td>
                    <td className="px-3 py-2">
                      <Cell state={s.name === 'Reddit' ? 'yes' : 'no'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="mt-6 rounded-xl border border-ink/[0.08] bg-white p-4">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Syften plan that fits</p>
            {plan.kind === 'plan' ? (
              <>
                <p className="mt-1.5 flex items-baseline gap-2">
                  <span className="text-[1.5rem] font-semibold tracking-[-0.03em] text-ink">{plan.name}</span>
                  <span className="text-[0.95rem] font-semibold tabular-nums text-ink">${plan.total.toFixed(2)}/mo</span>
                </p>
                <p className="mt-1 text-[0.78rem] leading-relaxed text-muted-foreground">
                  ${plan.base.toFixed(2)} base
                  {plan.addons.map((a) => ` + $${a.price} ${a.name}`).join('')}
                </p>
              </>
            ) : (
              <p className="mt-1.5 text-[0.9rem] leading-relaxed text-ink">
                Over 100 filters: Syften’s “Tailor made” plan, priced by email.
              </p>
            )}
          </div>
        </div>
      </Band>
    </section>
  );
}

function Cell({ state }: { state: 'yes' | 'addon' | 'no' }) {
  if (state === 'yes')
    return (
      <span className="inline-flex items-center gap-1 font-semibold text-ink">
        <Check className="h-3.5 w-3.5 text-cta" />
        Yes
      </span>
    );
  if (state === 'addon')
    return (
      <span className="inline-flex items-center gap-1 text-ink/70">
        <Minus className="h-3.5 w-3.5" />
        Add-on
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-ink/40">
      <X className="h-3.5 w-3.5" />
      No
    </span>
  );
}
