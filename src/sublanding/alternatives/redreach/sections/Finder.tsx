import { useId, useMemo, useState } from 'react';
import { Calculator, Check, Minus } from 'lucide-react';
import { Band, LINE, Pill, SECTION_TITLE } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { REDDIX } from '../../reddix';
import { CALCULATOR, PLANS } from '../content';

type Plan = (typeof PLANS.plans)[number];
type NeedId = (typeof CALCULATOR.needs)[number]['id'];
type Billing = 'monthly' | 'yearly';

/** Does a Redreach plan cover a need? Read straight off the plan table. */
const covers: Record<NeedId, (p: Plan) => boolean> = {
  daily: (p) => p.cadence === 'daily',
  telegram: (p) => (p.alerts as readonly string[]).includes('Telegram'),
  slack: (p) => (p.alerts as readonly string[]).includes('Slack'),
  api: (p) => p.api,
  dms: (p) => p.dms > 100,
  seats3: (p) => p.seats >= 3,
};

/** The cheapest plan that covers every ticked need (plans are listed cheapest first). */
function pick(needs: Set<NeedId>): Plan {
  return PLANS.plans.find((p) => [...needs].every((n) => covers[n](p))) ?? PLANS.plans[PLANS.plans.length - 1];
}

const usd = (n: number) => `$${n.toLocaleString('en-US')}`;

export function Finder() {
  const ids = useId();
  const [needs, setNeeds] = useState<Set<NeedId>>(new Set());
  const [billing, setBilling] = useState<Billing>('monthly');

  const plan = useMemo(() => pick(needs), [needs]);
  const redreachYear = billing === 'monthly' ? plan.monthly * 12 : plan.yearly;
  const premiumYear = REDDIX.pricing.premium.price * 12;
  const lifetime = REDDIX.pricing.lifetime.price;
  const bars = [
    { label: `Redreach ${plan.name}, ${billing === 'monthly' ? 'billed monthly' : 'billed yearly'}`, value: redreachYear, ours: false },
    { label: 'Reddix Premium, billed monthly', value: premiumYear, ours: true },
    { label: 'Reddix Lifetime, paid once', value: lifetime, ours: true },
  ];
  const max = Math.max(...bars.map((b) => b.value));
  const gaps = [...needs].map((n) => CALCULATOR.reddixMissing[n]).filter(Boolean);

  const toggle = (id: NeedId) =>
    setNeeds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <section aria-labelledby="finder-title">
      <Band inner="px-6 py-12 sm:px-10 lg:px-12">
        <Pill icon={Calculator}>{CALCULATOR.pill}</Pill>
        <h2 id="finder-title" className={cn('mt-5 max-w-2xl', SECTION_TITLE)}>
          {CALCULATOR.title}
        </h2>
        <p className="mt-3 max-w-2xl text-[0.98rem] leading-relaxed text-muted-foreground">{CALCULATOR.body}</p>
      </Band>
      <Band inner="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        {/* ---------- needs ---------- */}
        <fieldset className="min-w-0 px-5 py-8 sm:px-10 lg:px-12">
          <legend className="sr-only">What you need from Redreach</legend>
          <p className="text-[0.8rem] font-semibold text-ink">What you need</p>
          <ul className="mt-3 space-y-2">
            {CALCULATOR.needs.map((n) => {
              const on = needs.has(n.id);
              return (
                <li key={n.id}>
                  <label
                    htmlFor={`${ids}-${n.id}`}
                    className={cn(
                      'flex cursor-pointer items-center gap-3 rounded-lg border px-3.5 py-3 text-[0.9rem] transition-colors',
                      on ? 'border-cta/40 bg-cta-soft/60 text-ink' : 'border-ink/[0.1] bg-white text-ink/80 hover:border-ink/[0.2]',
                    )}
                  >
                    <input id={`${ids}-${n.id}`} type="checkbox" checked={on} onChange={() => toggle(n.id)} className="h-4 w-4 accent-cta" />
                    {n.label}
                  </label>
                </li>
              );
            })}
          </ul>
          <p className="mt-6 text-[0.8rem] font-semibold text-ink">Redreach billing</p>
          <div role="radiogroup" aria-label="Redreach billing" className="mt-2.5 inline-flex rounded-lg border border-ink/[0.1] bg-white p-1">
            {(['monthly', 'yearly'] as Billing[]).map((b) => (
              <button
                key={b}
                type="button"
                role="radio"
                aria-checked={billing === b}
                onClick={() => setBilling(b)}
                className={cn('h-8 rounded-md px-3.5 text-[0.82rem] font-medium capitalize transition-colors', billing === b ? 'bg-ink text-white' : 'text-ink/70 hover:text-ink')}
              >
                {b}
              </button>
            ))}
          </div>
        </fieldset>

        {/* ---------- result ---------- */}
        <div aria-live="polite" className={cn('min-w-0 border-t bg-surface/70 px-5 py-8 sm:px-10 lg:border-l lg:border-t-0 lg:px-12', LINE)}>
          <p className="text-[0.8rem] font-semibold text-ink">Cheapest Redreach plan that covers it</p>
          <div className="mt-3 rounded-xl border border-ink/[0.08] bg-white p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-[1.5rem] font-semibold tracking-[-0.03em] text-ink">{plan.name}</p>
              <p className="text-[0.9rem] tabular-nums text-ink/80">
                {usd(plan.monthly)}/month · {usd(plan.yearly)}/year
              </p>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-[0.82rem] sm:grid-cols-3">
              {[
                ['New leads', plan.cadence],
                ['Reply suggestions', String(plan.replies)],
                ['Auto DMs a day', String(plan.dms)],
                ['Competitors', String(plan.competitors)],
                ['Keywords', String(plan.keywords)],
                ['Seats', String(plan.seats)],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="font-semibold capitalize tabular-nums text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 flex flex-wrap gap-1.5 text-[0.75rem]">
              {plan.alerts.map((a) => (
                <span key={a} className="rounded-md bg-ink/[0.05] px-2 py-0.5 font-medium text-ink/75">
                  {a}
                </span>
              ))}
              <span className="rounded-md bg-ink/[0.05] px-2 py-0.5 font-medium text-ink/75">{plan.api ? 'API & MCP' : 'No API'}</span>
            </p>
          </div>

          <p className="mt-7 text-[0.8rem] font-semibold text-ink">A year, side by side</p>
          <ul className="mt-3 space-y-3">
            {bars.map((b) => (
              <li key={b.label}>
                <div className="flex items-baseline justify-between gap-3 text-[0.82rem]">
                  <span className="text-ink/80">{b.label}</span>
                  <span className="font-semibold tabular-nums text-ink">{usd(b.value)}</span>
                </div>
                <div className="mt-1.5 h-2 rounded-full bg-ink/[0.06]">
                  <div className={cn('h-full rounded-full transition-[width] duration-500', b.ours ? 'bg-cta' : 'bg-ink/45')} style={{ width: `${(b.value / max) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>

          <ul className="mt-6 space-y-1.5 text-[0.82rem] leading-relaxed">
            {gaps.length === 0 ? (
              <li className="flex items-start gap-2 text-ink/75">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-cta" />
                With nothing ticked, Redreach’s Startup plan covers it; tick a need to see how Reddix compares.
              </li>
            ) : (
              [...new Set(gaps)].map((g) => (
                <li key={g} className="flex items-start gap-2 text-ink/75">
                  <Minus className="mt-0.5 h-4 w-4 shrink-0 text-ink/40" />
                  {g}
                </li>
              ))
            )}
          </ul>
          <p className="mt-5 text-[0.72rem] leading-relaxed text-muted-foreground">
            {PLANS.note} The ${PLANS.pass.price} {PLANS.pass.days}-day pass isn’t included here: {PLANS.pass.note}
          </p>
        </div>
      </Band>
    </section>
  );
}
