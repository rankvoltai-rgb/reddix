import { useId, useMemo, useState } from 'react';
import { Calculator as CalcIcon, Check, Minus } from 'lucide-react';
import { Band, LINE, Pill, SECTION_TITLE } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { CALC, CHECKED, NAME, PLANS, PLATFORMS, REDDIX_YEAR, type PlanId } from '../content';

const ORDER: PlanId[] = ['free', 'starter', 'pro', 'advanced'];
const at = (id: PlanId) => ORDER.indexOf(id);
const higher = (a: PlanId, b: PlanId) => (at(a) >= at(b) ? a : b);
const usd = (n: number) => `$${n.toLocaleString('en-US')}`;

const OTHERS = PLATFORMS.filter((p) => p.name !== 'Reddit');

/* Keywords, communities and three toggles in; the cheapest CommunityTracker
   plan that covers them, and both tools' twelve-month list cost, out. */
export function Calculator() {
  const ids = { kw: useId() };
  const [keywords, setKeywords] = useState(3);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [toggles, setToggles] = useState<string[]>(['ai']);

  const result = useMemo(() => {
    if (keywords > 20) return { over: true as const };
    const reasons: { why: string; plan: PlanId }[] = [];
    const kwPlan = PLANS.find((p) => p.keywords >= keywords)!.id;
    reasons.push({ why: `${keywords} keyword${keywords === 1 ? '' : 's'}`, plan: kwPlan });
    for (const name of platforms) {
      const p = PLATFORMS.find((x) => x.name === name)!;
      reasons.push({ why: name, plan: p.from });
    }
    for (const id of toggles) {
      const t = CALC.toggles.find((x) => x.id === id)!;
      reasons.push({ why: t.label, plan: t.them });
    }
    const plan = reasons.reduce<PlanId>((acc, r) => higher(acc, r.plan), 'free');
    const decider = reasons.filter((r) => r.plan === plan).map((r) => r.why);
    const price = PLANS.find((p) => p.id === plan)!.price;
    return { over: false as const, plan, price, year: price * 12, decider };
  }, [keywords, platforms, toggles]);

  const reddixMissing = [
    ...platforms,
    ...toggles.filter((id) => !CALC.toggles.find((t) => t.id === id)!.reddix).map((id) => CALC.toggles.find((t) => t.id === id)!.label),
  ];

  const flip = (list: string[], set: (v: string[]) => void, v: string) => set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  return (
    <section id="calculator" aria-labelledby="calc-title" className="scroll-mt-16">
      <Band inner="px-6 py-12 sm:px-10 sm:py-14 lg:px-12">
        <Pill icon={CalcIcon}>{CALC.pill}</Pill>
        <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
          <h2 id="calc-title" className={SECTION_TITLE}>
            {CALC.title}
          </h2>
          <p className="text-[0.98rem] leading-relaxed text-muted-foreground lg:pb-1.5">{CALC.body}</p>
        </div>
      </Band>

      <Band inner="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* ---------- inputs ---------- */}
        <div className={cn('min-w-0 space-y-7 border-b px-5 py-8 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-10', LINE)}>
          <div>
            <div className="flex items-baseline justify-between gap-3">
              <label htmlFor={ids.kw} className="text-[0.85rem] font-semibold text-ink">
                {CALC.keywordsLabel}
              </label>
              <span className="text-[1.1rem] font-semibold tabular-nums text-ink">{keywords}</span>
            </div>
            <input
              id={ids.kw}
              type="range"
              min={1}
              max={25}
              value={keywords}
              onChange={(e) => setKeywords(Number(e.target.value))}
              className="mt-3 w-full accent-cta"
            />
            {/* Where each plan's keyword cap falls on the slider. */}
            <div aria-hidden className="relative mt-1 h-4 text-[0.68rem] tabular-nums text-muted-foreground">
              {PLANS.map((p) => (
                <span key={p.id} className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: `${((p.keywords - 1) / 24) * 100}%` }}>
                  {p.keywords}
                </span>
              ))}
            </div>
            <p className="mt-2 text-[0.76rem] leading-relaxed text-muted-foreground">{CALC.keywordsHint}</p>
          </div>

          <fieldset>
            <legend className="text-[0.85rem] font-semibold text-ink">{CALC.platformsLabel}</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {OTHERS.map((p) => {
                const on = platforms.includes(p.name);
                return (
                  <button
                    key={p.name}
                    type="button"
                    aria-pressed={on}
                    onClick={() => flip(platforms, setPlatforms, p.name)}
                    className={cn(
                      'h-8 rounded-lg border px-3 text-[0.8rem] font-medium transition-colors',
                      on ? 'border-ink bg-ink text-white' : 'border-ink/[0.1] bg-white text-ink/70 hover:border-ink/25 hover:text-ink',
                    )}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-[0.85rem] font-semibold text-ink">Also needed</legend>
            <div className="mt-3 space-y-2">
              {CALC.toggles.map((t) => (
                <label key={t.id} className="flex cursor-pointer items-center gap-3 text-[0.88rem] text-ink/80">
                  <input type="checkbox" checked={toggles.includes(t.id)} onChange={() => flip(toggles, setToggles, t.id)} className="h-4 w-4 accent-cta" />
                  {t.label}
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        {/* ---------- result ---------- */}
        <div className="min-w-0 bg-surface/60 px-5 py-8 sm:px-10 lg:px-12 lg:py-10" aria-live="polite">
          <div className="rounded-xl border border-ink/[0.08] bg-white p-5">
            <p className="text-[0.75rem] font-semibold text-ink/60">{NAME}</p>
            {result.over ? (
              <p className="mt-2 text-[0.92rem] leading-relaxed text-ink">{CALC.over}</p>
            ) : (
              <>
                <p className="mt-1 flex flex-wrap items-baseline gap-x-2">
                  <span className="text-[1.25rem] font-semibold text-ink">{PLANS.find((p) => p.id === result.plan)!.name}</span>
                  <span className="text-[0.9rem] tabular-nums text-muted-foreground">{result.price ? `${usd(result.price)}/month` : 'free'}</span>
                </p>
                <p className="mt-3 text-[2rem] font-semibold leading-none tracking-[-0.03em] tabular-nums text-ink">
                  {usd(result.year)}
                  <span className="ml-1.5 text-[0.85rem] font-medium tracking-normal text-muted-foreground">for 12 months</span>
                </p>
                <p className="mt-3 text-[0.78rem] leading-relaxed text-muted-foreground">Set by: {result.decider.join(', ')}.</p>
              </>
            )}
          </div>

          <div className="mt-3 rounded-xl border border-cta/25 bg-white p-5">
            <p className="text-[0.75rem] font-semibold text-cta">Reddix</p>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <div>
                <p className="text-[0.78rem] text-muted-foreground">Premium, 12 months</p>
                <p className="text-[1.5rem] font-semibold leading-tight tabular-nums text-ink">{usd(REDDIX_YEAR.premium)}</p>
              </div>
              <div>
                <p className="text-[0.78rem] text-muted-foreground">Lifetime, once</p>
                <p className="text-[1.5rem] font-semibold leading-tight tabular-nums text-ink">{usd(REDDIX_YEAR.lifetime)}</p>
              </div>
            </div>
            <ul className="mt-4 space-y-1.5 text-[0.82rem] leading-snug">
              {reddixMissing.length === 0 ? (
                <li className="flex gap-2 text-ink/80">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cta" />
                  Covers everything you set, on Reddit.
                </li>
              ) : (
                <li className="flex gap-2 text-ink/80">
                  <Minus className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink/35" />
                  <span>
                    Doesn’t cover: {reddixMissing.join(', ')}.
                    {platforms.length > 0 && <span className="text-muted-foreground"> {CALC.reddixPlatforms} the other communities.</span>}
                  </span>
                </li>
              )}
            </ul>
          </div>
          <p className="mt-4 text-[0.72rem] leading-relaxed text-muted-foreground">
            {CALC.note} {CHECKED}.
          </p>
        </div>
      </Band>
    </section>
  );
}
