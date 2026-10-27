import { useId, useMemo, useState } from 'react';
import { Info, SlidersHorizontal } from 'lucide-react';
import { Band, LINE, Pill, SECTION_TITLE } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { REDDIX } from '../../reddix';
import { CALCULATOR, PRICE_NOTE, TIERS } from '../content';

type FieldId = (typeof CALCULATOR.fields)[number]['id'];
type Usage = Record<FieldId, number>;
type Billing = 'monthly' | 'yearly';

/** The cheapest tier whose limits cover the usage; null means its custom plan. */
function fit(u: Usage) {
  return (
    TIERS.find(
      (t) => u.projects <= t.projects && u.subreddits <= t.subreddits && u.keywords <= t.keywords && u.scans <= t.scans && u.posts <= t.posts,
    ) ?? null
  );
}

/** Which limit pushed the usage past a tier, for the explanation line. */
function blockers(u: Usage, t: (typeof TIERS)[number]) {
  const out: string[] = [];
  if (u.projects > t.projects) out.push(`${t.projects} project${t.projects > 1 ? 's' : ''}`);
  if (u.subreddits > t.subreddits) out.push(`${t.subreddits} subreddits`);
  if (u.keywords > t.keywords) out.push(`${t.keywords} keywords`);
  if (u.scans > t.scans) out.push(`${t.scans} scans a month`);
  if (u.posts > t.posts) out.push(`${t.posts} generated posts`);
  return out;
}

const usd = (n: number) => `$${n.toLocaleString('en-US')}`;

export function Cost() {
  const id = useId();
  const [usage, setUsage] = useState<Usage>(() => Object.fromEntries(CALCULATOR.fields.map((f) => [f.id, f.initial])) as Usage);
  const [billing, setBilling] = useState<Billing>('yearly');

  const tier = useMemo(() => fit(usage), [usage]);
  const skipped = useMemo(() => {
    const i = tier ? TIERS.indexOf(tier) : TIERS.length;
    return i > 0 ? { name: TIERS[i - 1].name, why: blockers(usage, TIERS[i - 1]) } : null;
  }, [tier, usage]);

  const theirs = tier ? (billing === 'monthly' ? tier.monthly * 12 : tier.yearly) : null;
  const premium = REDDIX.pricing.premium.price * 12;
  const lifetime = REDDIX.pricing.lifetime.price;
  const notes = [
    usage.posts > 0 && CALCULATOR.reddixNotes.posts,
    CALCULATOR.reddixNotes.scans,
    usage.projects > 1 && CALCULATOR.reddixNotes.projects,
  ].filter(Boolean) as string[];

  return (
    <section aria-labelledby="cost-title">
      <Band inner="grid gap-6 px-6 py-12 sm:px-10 lg:grid-cols-2 lg:items-end lg:px-12">
        <div>
          <Pill icon={SlidersHorizontal}>{CALCULATOR.pill}</Pill>
          <h2 id="cost-title" className={cn('mt-5', SECTION_TITLE)}>
            {CALCULATOR.title}
          </h2>
        </div>
        <p className="text-[0.98rem] leading-relaxed text-muted-foreground">{CALCULATOR.body}</p>
      </Band>

      <Band inner="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="min-w-0 space-y-6 px-5 py-8 sm:px-10 lg:px-12">
          {CALCULATOR.fields.map((f) => (
            <div key={f.id}>
              <div className="flex items-baseline justify-between gap-3">
                <label htmlFor={`${id}-${f.id}`} className="text-[0.85rem] font-semibold text-ink">
                  {f.label}
                </label>
                <span className="text-[0.9rem] font-semibold tabular-nums text-ink">{usage[f.id]}</span>
              </div>
              <input
                id={`${id}-${f.id}`}
                type="range"
                min={f.min}
                max={f.max}
                step={f.step}
                value={usage[f.id]}
                onChange={(e) => setUsage((u) => ({ ...u, [f.id]: Number(e.target.value) }))}
                className="mt-2 w-full accent-cta"
              />
            </div>
          ))}
          <div>
            <p className="text-[0.85rem] font-semibold text-ink">ReplyDaddy billing</p>
            <div role="radiogroup" aria-label="ReplyDaddy billing" className="mt-2.5 inline-flex rounded-lg border border-ink/[0.1] bg-white p-1">
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
          </div>
        </div>

        <div aria-live="polite" className={cn('min-w-0 border-t bg-surface/70 px-5 py-8 sm:px-10 lg:border-l lg:border-t-0 lg:px-12', LINE)}>
          <p className="text-[0.8rem] font-semibold text-ink">ReplyDaddy tier that fits</p>
          <p className="mt-2 text-[1.5rem] font-semibold tracking-[-0.03em] text-ink">{tier ? tier.name : 'Custom plan'}</p>
          <p className="mt-1 text-[0.85rem] text-muted-foreground">
            {tier ? `${usd(tier.monthly)} a month, or ${usd(tier.yearly)} a year` : CALCULATOR.customNote}
          </p>
          {skipped && skipped.why.length > 0 && (
            <p className="mt-2 text-[0.8rem] text-ink/70">
              {skipped.name} stops at {skipped.why.join(', ')}.
            </p>
          )}

          <dl className="mt-7 divide-y divide-ink/[0.07] rounded-xl border border-ink/[0.08] bg-white text-[0.88rem]">
            <Row label={tier ? `ReplyDaddy ${tier.name}, a year billed ${billing}` : 'ReplyDaddy custom plan'} value={theirs === null ? 'By quote' : usd(theirs)} />
            <Row label="Reddix Premium, 12 months" value={usd(premium)} ours />
            <Row label="Reddix Lifetime, paid once" value={usd(lifetime)} ours />
          </dl>

          <ul className="mt-5 space-y-1.5 text-[0.8rem] leading-relaxed text-ink/70">
            {notes.map((n) => (
              <li key={n} className="flex gap-2">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink/40" />
                {n}
              </li>
            ))}
            <li className="flex gap-2">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink/40" />
              {CALCULATOR.freeNote}
            </li>
          </ul>
        </div>
      </Band>

      <Band inner="px-6 py-7 sm:px-10 lg:px-12">
        <h3 className="text-[0.95rem] font-semibold text-ink">{PRICE_NOTE.title}</h3>
        <p className="mt-1.5 max-w-3xl text-[0.88rem] leading-relaxed text-muted-foreground">{PRICE_NOTE.body}</p>
      </Band>
    </section>
  );
}

function Row({ label, value, ours = false }: { label: string; value: string; ours?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 px-4 py-3">
      <dt className="text-ink/75">{label}</dt>
      <dd className={cn('shrink-0 font-semibold tabular-nums', ours ? 'text-cta' : 'text-ink')}>{value}</dd>
    </div>
  );
}
