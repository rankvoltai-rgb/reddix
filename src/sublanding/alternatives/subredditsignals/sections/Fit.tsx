import { useMemo, useState } from 'react';
import { Check, ListChecks, Minus, RotateCcw } from 'lucide-react';
import { Band, LINE, Pill, SECTION_TITLE } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { CHECKED, FIT, NAME, PLAN_NAME, PLAN_PRICE, type Plan } from '../content';

const RANK: Plan[] = ['starter', 'pro', 'managed'];

/* Tick the needs you can't do without. For each, both vendors' answers; then
   how many each covers, and the cheapest Subreddit Signals plan that covers
   every need it can meet. */
export function Fit() {
  const [picked, setPicked] = useState<string[]>(['email', 'once']);
  const chosen = useMemo(() => FIT.needs.filter((n) => picked.includes(n.id)), [picked]);

  const themCount = chosen.filter((n) => n.them.ok).length;
  const reddixCount = chosen.filter((n) => n.reddix.ok).length;
  const plan = chosen.reduce<Plan | null>((acc, n) => {
    if (!n.them.ok || !n.them.plan) return acc;
    if (!acc) return n.them.plan;
    return RANK.indexOf(n.them.plan) > RANK.indexOf(acc) ? n.them.plan : acc;
  }, null);

  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  return (
    <section id="fit" aria-labelledby="fit-title" className="scroll-mt-16">
      <Band inner="grid gap-5 px-6 py-12 sm:px-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:px-12">
        <div>
          <Pill icon={ListChecks}>{FIT.pill}</Pill>
          <h2 id="fit-title" className={cn('mt-5', SECTION_TITLE)}>
            {FIT.title}
          </h2>
        </div>
        <p className="text-[0.98rem] leading-relaxed text-muted-foreground lg:pb-1.5">{FIT.body}</p>
      </Band>

      <Band inner="grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <fieldset className={cn('min-w-0 border-b px-5 py-7 sm:px-10 lg:border-b-0 lg:border-r lg:px-10 lg:py-9', LINE)}>
          <legend className="sr-only">Needs</legend>
          <ul className="space-y-1.5">
            {FIT.needs.map((n) => {
              const on = picked.includes(n.id);
              return (
                <li key={n.id}>
                  <label
                    className={cn(
                      'flex cursor-pointer items-start gap-3 rounded-lg border px-3.5 py-2.5 text-[0.88rem] leading-snug transition-colors',
                      on ? 'border-cta/35 bg-cta-soft/60 text-ink' : 'border-ink/[0.08] bg-white text-ink/75 hover:border-ink/[0.16]',
                    )}
                  >
                    <input type="checkbox" checked={on} onChange={() => toggle(n.id)} className="mt-0.5 h-4 w-4 shrink-0 accent-cta" />
                    {n.label}
                  </label>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            onClick={() => setPicked([])}
            disabled={!picked.length}
            className="mt-4 inline-flex items-center gap-1.5 text-[0.8rem] font-medium text-muted-foreground transition-colors hover:text-ink disabled:opacity-40"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Clear
          </button>
        </fieldset>

        <div className="min-w-0 bg-surface/60 px-5 py-7 sm:px-10 lg:px-10 lg:py-9">
          {chosen.length === 0 ? (
            <p className="rounded-xl border border-dashed border-ink/[0.14] bg-white px-5 py-10 text-center text-[0.9rem] text-muted-foreground">{FIT.empty}</p>
          ) : (
            <>
              <div aria-live="polite" className="grid grid-cols-2 gap-3">
                <Tally name={NAME} count={themCount} total={chosen.length} sub={plan ? `Cheapest plan: ${PLAN_NAME[plan]}, ${PLAN_PRICE[plan]}` : 'No plan covers these'} />
                <Tally name="Reddix" count={reddixCount} total={chosen.length} sub={reddixCount ? 'Premium or Lifetime' : 'Covers none of these'} red />
              </div>
              <ul className="mt-5 divide-y divide-ink/[0.07] rounded-xl border border-ink/[0.08] bg-white">
                {chosen.map((n) => (
                  <li key={n.id} className="px-4 py-3.5">
                    <p className="text-[0.86rem] font-semibold text-ink">{n.label}</p>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      <Answer ok={n.them.ok} who={NAME} text={n.them.text} />
                      <Answer ok={n.reddix.ok} who="Reddix" text={n.reddix.text} />
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
          <p className="mt-4 text-[0.72rem] text-muted-foreground">{CHECKED}. Plan contents can change; confirm in each trial.</p>
        </div>
      </Band>
    </section>
  );
}

function Tally({ name, count, total, sub, red }: { name: string; count: number; total: number; sub: string; red?: boolean }) {
  return (
    <div className="rounded-xl border border-ink/[0.08] bg-white p-4">
      <p className={cn('text-[0.75rem] font-semibold', red ? 'text-cta' : 'text-ink/60')}>{name}</p>
      <p className="mt-1 text-[1.7rem] font-semibold leading-none tracking-[-0.03em] tabular-nums text-ink">
        {count}
        <span className="text-[1rem] font-medium text-muted-foreground"> of {total}</span>
      </p>
      <p className="mt-2 text-[0.75rem] leading-snug text-muted-foreground">{sub}</p>
    </div>
  );
}

function Answer({ ok, who, text }: { ok: boolean; who: string; text: string }) {
  return (
    <p className="flex gap-2 text-[0.8rem] leading-snug">
      {ok ? <Check aria-label="Yes" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cta" /> : <Minus aria-label="No" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink/30" />}
      <span>
        <span className="font-medium text-ink/80">{who}: </span>
        <span className="text-muted-foreground">{text}</span>
      </span>
    </p>
  );
}
