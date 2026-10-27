import { useId, useMemo, useState } from 'react';
import { Minus, Plus, ReceiptText } from 'lucide-react';
import { Band, LINE, Pill, SECTION_TITLE } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { REDDIX } from '../../reddix';
import { PRICES, RECEIPT, UPVOTE_PACKS } from '../content';
import { Ref } from './Ref';

const usd = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;

/* An order on the left, the receipt it prints on the right. Totals use the
   published prices; the fine print is REDAccs' own wording. */
export function Receipt() {
  const ids = { pack: useId() };
  const [comments, setComments] = useState(5);
  const [linked, setLinked] = useState(2);
  const [posts, setPosts] = useState(1);
  const [pack, setPack] = useState(1); // index into UPVOTE_PACKS, -1 for none

  const lines = useMemo(() => {
    const out: { label: string; qty: string; amount: number }[] = [];
    if (comments) out.push({ label: 'Custom comments', qty: `${comments} × ${usd(PRICES.comment)}`, amount: comments * PRICES.comment });
    if (linked) out.push({ label: 'Comments with a link', qty: `${linked} × ${usd(PRICES.linkComment)}`, amount: linked * PRICES.linkComment });
    if (posts) out.push({ label: 'Posts', qty: `${posts} × ${usd(PRICES.post)}`, amount: posts * PRICES.post });
    if (pack >= 0) {
      const p = UPVOTE_PACKS[pack];
      out.push({ label: 'Upvote pack', qty: `${p.votes.toLocaleString('en-US')} votes`, amount: p.price });
    }
    return out;
  }, [comments, linked, posts, pack]);

  const total = lines.reduce((a, l) => a + l.amount, 0);
  const perVote = pack >= 0 ? UPVOTE_PACKS[pack].price / UPVOTE_PACKS[pack].votes : null;
  const placed = comments + linked + posts;
  const { premium, lifetime } = REDDIX.pricing;

  return (
    <section aria-labelledby="rc-receipt">
      <Band inner="px-6 pb-8 pt-12 text-center sm:px-10 sm:pt-14">
        <Pill icon={ReceiptText}>{RECEIPT.pill}</Pill>
        <h2 id="rc-receipt" className={cn('mx-auto mt-5 max-w-2xl', SECTION_TITLE)}>
          {RECEIPT.title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-balance text-[0.96rem] leading-relaxed text-muted-foreground">{RECEIPT.body}</p>
      </Band>

      <Band inner="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="min-w-0 space-y-5 px-5 py-8 sm:px-10 lg:px-12 lg:py-10">
          <Stepper label="Custom comments" price={`${usd(PRICES.comment)} each`} value={comments} set={setComments} />
          <Stepper label="Comments with a link" price={`${usd(PRICES.linkComment)} each`} value={linked} set={setLinked} />
          <Stepper label="Posts" price={`${usd(PRICES.post)} each`} value={posts} set={setPosts} />
          <div>
            <label htmlFor={ids.pack} className="text-[0.85rem] font-semibold text-ink">
              Upvote pack
            </label>
            <select
              id={ids.pack}
              value={pack}
              onChange={(e) => setPack(Number(e.target.value))}
              className="mt-2 h-11 w-full rounded-lg border border-ink/[0.1] bg-white px-3 text-[0.9rem] text-ink outline-none focus:border-cta/50 focus:shadow-[0_0_0_4px_hsl(var(--cta)/0.12)]"
            >
              <option value={-1}>None</option>
              {UPVOTE_PACKS.map((p, i) => (
                <option key={p.price} value={i}>
                  {usd(p.price)}: {p.votes.toLocaleString('en-US')} votes
                </option>
              ))}
            </select>
            <p className="mt-1.5 text-[0.72rem] text-muted-foreground">{RECEIPT.packNote}</p>
          </div>
        </div>

        {/* The receipt. */}
        <div className={cn('min-w-0 border-t bg-surface/70 px-4 py-8 sm:px-10 lg:border-l lg:border-t-0 lg:py-10', LINE)}>
          <div
            className="mx-auto max-w-[24rem] rounded-t-lg border-b-2 border-dashed border-ink/15 bg-white px-5 pb-7 pt-6 shadow-[0_1px_2px_rgba(16,24,40,0.06),0_14px_30px_-20px_rgba(16,24,40,0.35)]"
            aria-live="polite"
          >
            <p className="text-center text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Order at published prices</p>
            <ul className="mt-5 space-y-2.5 text-[0.86rem]">
              {lines.length ? (
                lines.map((l) => (
                  <li key={l.label} className="flex items-baseline gap-2">
                    <span className="min-w-0">
                      <span className="block text-ink">{l.label}</span>
                      <span className="block text-[0.74rem] tabular-nums text-muted-foreground">{l.qty}</span>
                    </span>
                    <span className="mb-1 flex-1 border-b border-dotted border-ink/20" aria-hidden />
                    <span className="font-semibold tabular-nums text-ink">{usd(l.amount)}</span>
                  </li>
                ))
              ) : (
                <li className="text-center text-muted-foreground">Nothing ordered yet.</li>
              )}
            </ul>
            <div className="mt-5 flex items-baseline justify-between border-t-2 border-ink pt-3">
              <span className="text-[0.85rem] font-semibold text-ink">Total</span>
              <span className="text-[1.6rem] font-semibold tabular-nums tracking-[-0.03em] text-ink">{usd(total)}</span>
            </div>
            <p className="mt-1 text-right text-[0.74rem] tabular-nums text-muted-foreground">
              {placed} placed {placed === 1 ? 'item' : 'items'}
              {perVote !== null && ` · ${usd(Math.round(perVote * 1000) / 1000)} a vote`}
            </p>
            <ul className="mt-6 space-y-2 border-t border-dashed border-ink/20 pt-4 text-[0.72rem] leading-snug text-ink/60">
              {RECEIPT.fine.map((f) => (
                <li key={f.text}>
                  * “{f.text}”
                  <Ref id={f.src} />
                </li>
              ))}
            </ul>
          </div>

          <p className="mx-auto mt-5 max-w-[24rem] rounded-xl border border-dashed border-cta/30 bg-cta-soft/40 px-4 py-3 text-[0.82rem] leading-relaxed text-ink/80">
            <span className="font-semibold text-ink">Reddix sells none of these.</span> It’s ${premium.price} a month with a {premium.trial}, or ${lifetime.price} once, and every reply
            is one you post yourself.
          </p>
        </div>
      </Band>
    </section>
  );
}

function Stepper({ label, price, value, set }: { label: string; price: string; value: number; set: (n: number) => void }) {
  const btn =
    'flex h-9 w-9 items-center justify-center rounded-lg border border-ink/[0.1] bg-white text-ink transition-colors hover:border-ink/[0.2] disabled:opacity-35';
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-[0.88rem] font-semibold text-ink">{label}</p>
        <p className="text-[0.75rem] text-muted-foreground">{price}</p>
      </div>
      <div className="flex items-center gap-2">
        <button type="button" className={btn} onClick={() => set(Math.max(0, value - 1))} disabled={value === 0} aria-label={`Fewer ${label.toLowerCase()}`}>
          <Minus className="h-3.5 w-3.5" />
        </button>
        <output className="w-8 text-center text-[0.95rem] font-semibold tabular-nums text-ink" aria-label={label}>
          {value}
        </output>
        <button type="button" className={btn} onClick={() => set(Math.min(50, value + 1))} disabled={value === 50} aria-label={`More ${label.toLowerCase()}`}>
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
