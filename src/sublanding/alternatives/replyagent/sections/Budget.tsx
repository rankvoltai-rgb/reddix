import { useId, useMemo, useState } from 'react';
import { Wallet } from 'lucide-react';
import { Band, LINE, Pill, SECTION_TITLE } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { REDDIX } from '../../reddix';
import { BUDGET } from '../content';

type RateId = (typeof BUDGET.rates)[number]['id'];
type PlanId = (typeof BUDGET.plans)[number]['id'];

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;
const usd = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;

/** A month of ReplyAgent: the AI plan, plus posting at its listed rates, minus
 *  the 70% refund on content removed at the check. */
function month(comments: number, posts: number, removal: number, rate: (typeof BUDGET.rates)[number], plan: (typeof BUDGET.plans)[number]) {
  const removed = { comments: Math.round(comments * removal), posts: Math.round(posts * removal) };
  const posting = comments * rate.comment + posts * rate.post;
  const refund = (removed.comments * rate.comment + removed.posts * rate.post) * BUDGET.refund;
  return { plan: plan.monthly, posting, refund, total: plan.monthly + posting - refund, removed, live: { comments: comments - removed.comments, posts: posts - removed.posts } };
}

export function Budget() {
  const id = useId();
  const [comments, setComments] = useState(30);
  const [posts, setPosts] = useState(4);
  const [removalPct, setRemovalPct] = useState(20);
  const [rateId, setRateId] = useState<RateId>('cards');
  const [planId, setPlanId] = useState<PlanId>('monthly');

  const rate = BUDGET.rates.find((r) => r.id === rateId)!;
  const plan = BUDGET.plans.find((p) => p.id === planId)!;
  const m = useMemo(() => month(comments, posts, removalPct / 100, rate, plan), [comments, posts, removalPct, rate, plan]);
  const year = plan.yearly + (m.posting - m.refund) * 12;

  const sliders = [
    { key: 'comments', label: 'Comments it posts a month', value: comments, set: setComments, max: 150, step: 5 },
    { key: 'posts', label: 'Posts it publishes a month', value: posts, set: setPosts, max: 40, step: 1 },
    { key: 'removal', label: 'Share you expect removed at the check', value: removalPct, set: setRemovalPct, max: 100, step: 5, suffix: '%' },
  ];

  return (
    <section aria-labelledby="budget-title">
      <Band inner="px-6 py-12 sm:px-10 lg:px-12">
        <Pill icon={Wallet}>{BUDGET.pill}</Pill>
        <h2 id="budget-title" className={cn('mt-5 max-w-2xl', SECTION_TITLE)}>
          {BUDGET.title}
        </h2>
        <p className="mt-3 max-w-2xl text-[0.98rem] leading-relaxed text-muted-foreground">{BUDGET.body}</p>
      </Band>

      <Band inner="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="min-w-0 space-y-6 px-5 py-8 sm:px-10 lg:px-12">
          {sliders.map((s) => (
            <div key={s.key}>
              <div className="flex items-baseline justify-between gap-3">
                <label htmlFor={`${id}-${s.key}`} className="text-[0.85rem] font-semibold text-ink">
                  {s.label}
                </label>
                <span className="text-[0.9rem] font-semibold tabular-nums text-ink">
                  {s.value}
                  {s.suffix ?? ''}
                </span>
              </div>
              <input id={`${id}-${s.key}`} type="range" min={0} max={s.max} step={s.step} value={s.value} onChange={(e) => s.set(Number(e.target.value))} className="mt-2 w-full accent-cta" />
            </div>
          ))}
          <p className="text-[0.75rem] leading-relaxed text-muted-foreground">{BUDGET.removalNote}</p>

          <Choice label="AI plan" options={BUDGET.plans.map((p) => ({ id: p.id, label: p.label }))} value={planId} onChange={(v) => setPlanId(v as PlanId)} />
          <Choice
            label="Posting prices (its pricing page lists both)"
            options={BUDGET.rates.map((r) => ({ id: r.id, label: r.label, note: r.note }))}
            value={rateId}
            onChange={(v) => setRateId(v as RateId)}
          />
        </div>

        <div aria-live="polite" className={cn('min-w-0 border-t bg-surface/70 px-5 py-8 sm:px-10 lg:border-l lg:border-t-0 lg:px-12', LINE)}>
          <p className="text-[0.8rem] font-semibold text-ink">A month of ReplyAgent</p>
          <dl className="mt-3 divide-y divide-ink/[0.07] rounded-xl border border-ink/[0.08] bg-white text-[0.88rem]">
            <Line label={plan.id === 'annual' ? 'AI plan ($699 a year, per month)' : 'AI plan'} value={usd(m.plan)} />
            <Line label={`Posting: ${comments} × ${usd(rate.comment)} + ${posts} × ${usd(rate.post)}`} value={usd(m.posting)} />
            <Line label={`Refund: 70% on ${plural(m.removed.comments, 'comment')} and ${plural(m.removed.posts, 'post')} removed`} value={`−${usd(m.refund)}`} />
            <Line label="Total" value={usd(m.total)} strong />
          </dl>
          <p className="mt-3 text-[0.8rem] text-ink/70">
            Still up after the check: {plural(m.live.comments, 'comment')} and {plural(m.live.posts, 'post')}.
          </p>

          <p className="mt-7 text-[0.8rem] font-semibold text-ink">A year</p>
          <dl className="mt-3 divide-y divide-ink/[0.07] rounded-xl border border-ink/[0.08] bg-white text-[0.88rem]">
            <Line label="ReplyAgent, as set" value={usd(Math.round(year * 100) / 100)} />
            <Line label="Reddix Premium, 12 months" value={usd(REDDIX.pricing.premium.price * 12)} ours />
            <Line label="Reddix Lifetime, paid once" value={usd(REDDIX.pricing.lifetime.price)} ours />
          </dl>
          <p className="mt-3 text-[0.75rem] leading-relaxed text-muted-foreground">With Reddix you post every reply yourself, so there’s no posting charge, but the time to post is yours too.</p>
        </div>
      </Band>
    </section>
  );
}

function Choice({ label, options, value, onChange }: { label: string; options: { id: string; label: string; note?: string }[]; value: string; onChange: (id: string) => void }) {
  return (
    <div>
      <p className="text-[0.85rem] font-semibold text-ink">{label}</p>
      <div role="radiogroup" aria-label={label} className="mt-2.5 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={value === o.id}
            onClick={() => onChange(o.id)}
            title={o.note}
            className={cn(
              'rounded-lg border px-3 py-2 text-left text-[0.82rem] font-medium transition-colors',
              value === o.id ? 'border-cta/40 bg-cta-soft text-cta-deep' : 'border-ink/[0.1] bg-white text-ink/75 hover:border-ink/[0.2]',
            )}
          >
            {o.label}
            {o.note && <span className="block text-[0.7rem] font-normal text-muted-foreground">{o.note}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

function Line({ label, value, strong = false, ours = false }: { label: string; value: string; strong?: boolean; ours?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 px-4 py-3">
      <dt className={cn('min-w-0', strong ? 'font-semibold text-ink' : 'text-ink/75')}>{label}</dt>
      <dd className={cn('shrink-0 tabular-nums', strong ? 'text-[1.1rem] font-semibold text-ink' : 'font-semibold', ours ? 'text-cta' : 'text-ink')}>{value}</dd>
    </div>
  );
}
