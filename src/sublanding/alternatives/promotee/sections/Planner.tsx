import { useId, useMemo, useState } from 'react';
import { AlertTriangle, Calculator, Check } from 'lucide-react';
import { Band, LINE, Pill, SECTION_TITLE } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { REDDIX } from '../../reddix';
import { COST, PLANNER, PLANS } from '../content';

type PlanId = (typeof PLANS)[number]['id'];
const DAYS = 30;

/** Prices a month on a plan from Promotee's published numbers. */
function plan(leads: number, perDay: number, dms: number, id: PlanId, annual: boolean) {
  const p = PLANS.find((x) => x.id === id)!;
  const comments = perDay * DAYS;
  const credits = leads * COST.lead + comments * COST.comment + dms * COST.dm;
  const blocked: string[] = [];
  if (p.commentCapPerDay !== null && perDay > p.commentCapPerDay) blocked.push(`${p.name} caps AI comments at ${p.commentCapPerDay} a day.`);
  if (!p.dms && dms > 0) blocked.push(`${p.name} doesn’t include auto-DMs.`);
  if (credits > p.credits) blocked.push(`Needs ${credits.toLocaleString()} credits; ${p.name} has ${p.credits.toLocaleString()} a month.`);
  const fits = (q: (typeof PLANS)[number]) =>
    credits <= q.credits && (q.dms || dms === 0) && (q.commentCapPerDay === null || perDay <= q.commentCapPerDay);
  return {
    p,
    comments,
    credits,
    blocked,
    smallest: PLANS.find(fits),
    perMonth: annual ? p.annual / 12 : p.monthly,
    actions: comments + dms,
  };
}

const money = (n: number) => `$${n % 1 === 0 ? n : n.toFixed(2)}`;

export function Planner() {
  const ids = { leads: useId(), per: useId(), dms: useId() };
  const [leads, setLeads] = useState(200);
  const [perDay, setPerDay] = useState(5);
  const [dms, setDms] = useState(100);
  const [planId, setPlanId] = useState<PlanId>('grow');
  const [annual, setAnnual] = useState(false);

  const r = useMemo(() => plan(leads, perDay, dms, planId, annual), [leads, perDay, dms, planId, annual]);
  const used = Math.min(100, (r.credits / r.p.credits) * 100);
  const { premium, lifetime } = REDDIX.pricing;

  return (
    <section aria-labelledby="pm-plan">
      <Band inner="px-6 pb-8 pt-12 sm:px-10 sm:pt-14 lg:px-12">
        <Pill icon={Calculator}>{PLANNER.pill}</Pill>
        <h2 id="pm-plan" className={cn('mt-5 max-w-2xl', SECTION_TITLE)}>
          {PLANNER.title}
        </h2>
        <p className="mt-4 max-w-3xl text-[0.96rem] leading-relaxed text-muted-foreground">{PLANNER.body}</p>
      </Band>

      <Band inner="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        {/* ---------- what you'd ask of it ---------- */}
        <div className="min-w-0 space-y-7 px-5 py-8 sm:px-10 lg:px-12 lg:py-10">
          <fieldset>
            <legend className="text-[0.8rem] font-semibold text-ink">Plan</legend>
            <div className="mt-2.5 grid grid-cols-3 gap-1.5 rounded-xl bg-surface p-1">
              {PLANS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={planId === p.id}
                  onClick={() => setPlanId(p.id)}
                  className={cn(
                    'rounded-lg px-2 py-2 text-[0.85rem] font-semibold transition-colors',
                    planId === p.id ? 'bg-white text-ink shadow-[0_1px_2px_rgba(16,24,40,0.08)]' : 'text-ink/60 hover:text-ink',
                  )}
                >
                  {p.name}
                  <span className="block text-[0.72rem] font-medium text-muted-foreground">{money(annual ? p.annual : p.monthly)}{annual ? '/yr' : '/mo'}</span>
                </button>
              ))}
            </div>
            <label className="mt-3 flex cursor-pointer items-center gap-2 text-[0.82rem] text-ink/75">
              <input type="checkbox" checked={annual} onChange={(e) => setAnnual(e.target.checked)} className="h-4 w-4 accent-cta" />
              Billed yearly
            </label>
          </fieldset>

          <Slider id={ids.leads} label={PLANNER.leadsLabel} value={leads} set={setLeads} max={3000} step={50} hint={`${COST.lead} credit each`} />
          <Slider id={ids.per} label={PLANNER.commentsLabel} value={perDay} set={setPerDay} max={40} step={1} hint={`${COST.comment} credits each`} />
          <Slider id={ids.dms} label={PLANNER.dmsLabel} value={dms} set={setDms} max={1500} step={25} hint={`${COST.dm} credits each`} />
        </div>

        {/* ---------- what it would come to ---------- */}
        <div className={cn('min-w-0 border-t bg-surface/60 px-5 py-8 sm:px-10 lg:border-l lg:border-t-0 lg:px-12 lg:py-10', LINE)} aria-live="polite">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[0.8rem] font-semibold text-ink">Credits on {r.p.name}</p>
            <p className="text-[0.85rem] tabular-nums text-muted-foreground">
              <span className={cn('font-semibold', r.credits > r.p.credits ? 'text-cta' : 'text-ink')}>{r.credits.toLocaleString()}</span> / {r.p.credits.toLocaleString()}
            </p>
          </div>
          <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-ink/[0.07]">
            <div className={cn('h-full rounded-full transition-[width] duration-300', r.credits > r.p.credits ? 'bg-cta' : 'bg-ink/60')} style={{ width: `${used}%` }} />
          </div>

          <ul className="mt-4 space-y-1.5 text-[0.84rem]">
            {r.blocked.length ? (
              r.blocked.map((b) => (
                <li key={b} className="flex gap-2 text-ink">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-cta" />
                  {b}
                </li>
              ))
            ) : (
              <li className="flex gap-2 text-ink">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-cta" />
                {r.p.name} covers this month, for {money(Math.round(r.perMonth * 100) / 100)} a month.
              </li>
            )}
            <li className="text-muted-foreground">
              {r.smallest
                ? `Smallest published plan that covers it: ${r.smallest.name}.`
                : 'No published plan covers it; Scale has 5,000 credits a month.'}
            </li>
          </ul>

          <div className="mt-7 rounded-xl border border-ink/[0.08] bg-white p-5">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">From your connected accounts, as planned</p>
            <p className="mt-2 text-[2.4rem] font-semibold leading-none tracking-[-0.04em] tabular-nums text-ink">{r.actions.toLocaleString()}</p>
            <p className="mt-2 text-[0.84rem] leading-relaxed text-ink/70">
              {r.comments.toLocaleString()} public comments and {dms.toLocaleString()} private messages a month, sent automatically, plus whatever warm-up does.{' '}
              {r.smallest
                ? `${r.smallest.name} allows up to ${r.smallest.accounts} connected ${r.smallest.accounts === 1 ? 'account' : 'accounts'}.`
                : 'That’s more than any published plan allows.'}
            </p>
          </div>

          <div className="mt-3 rounded-xl border border-dashed border-cta/30 bg-cta-soft/40 p-5">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-cta-deep">With Reddix</p>
            <p className="mt-2 text-[2.4rem] font-semibold leading-none tracking-[-0.04em] tabular-nums text-ink">0</p>
            <p className="mt-2 text-[0.84rem] leading-relaxed text-ink/70">
              Actions taken as your account. Every reply is one you chose to post. ${premium.price} a month with a {premium.trial}, or ${lifetime.price} once.
            </p>
          </div>
        </div>
      </Band>
    </section>
  );
}

function Slider({ id, label, value, set, max, step, hint }: { id: string; label: string; value: number; set: (n: number) => void; max: number; step: number; hint: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[0.8rem] font-semibold text-ink">
          {label}
        </label>
        <span className="text-[0.9rem] font-semibold tabular-nums text-ink">{value.toLocaleString()}</span>
      </div>
      <input id={id} type="range" min={0} max={max} step={step} value={value} onChange={(e) => set(Number(e.target.value))} className="mt-2 w-full accent-cta" />
      <p className="mt-0.5 text-[0.72rem] text-muted-foreground">{hint}</p>
    </div>
  );
}
