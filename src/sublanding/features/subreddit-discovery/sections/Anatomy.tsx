import { Link } from 'react-router-dom';
import { ArrowRight, Microscope, Plus } from 'lucide-react';
import { Band, LINE, SectionHead } from '@/components/landing/frame';
import { Reveal, SubredditIcon } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { ANATOMY } from '../content';
import { ActivityTag } from '../ui';

/** A numbered marker, shared by the card and its key. */
function Marker({ n, className }: { n: number; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn('inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cta text-[0.65rem] font-semibold tabular-nums text-white', className)}
    >
      {n}
    </span>
  );
}

/* One suggestion, taken apart: the card in the middle with numbered markers,
   the key to them on either side. */
export function Anatomy() {
  const { card, parts } = ANATOMY;
  const n = (id: string) => parts.findIndex((p) => p.id === id) + 1;
  const left = parts.slice(0, 3);
  const right = parts.slice(3);

  const key = (list: typeof parts, offset: number) => (
    <ol className="space-y-6">
      {list.map((p, i) => (
        <li key={p.id}>
          <Reveal delay={i * 0.06} y={8} className="flex gap-3">
            <Marker n={offset + i + 1} className="mt-0.5" />
            <div>
              <h3 className="text-[0.95rem] font-semibold text-ink">{p.label}</h3>
              <p className="mt-1 text-[0.86rem] leading-relaxed text-muted-foreground">{p.body}</p>
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  );

  return (
    <section aria-labelledby="anatomy-title">
      <SectionHead icon={Microscope} eyebrow={ANATOMY.pill} title={<span id="anatomy-title">{ANATOMY.title}</span>} subtitle={ANATOMY.body} />
      <Band inner="grid gap-10 px-6 py-12 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center lg:gap-10 lg:px-12 lg:py-16">
        <div className="order-2 lg:order-1">{key(left, 0)}</div>

        {/* ---------- the specimen ---------- */}
        <div className="order-1 lg:order-2">
          <div className="rounded-xl border border-ink/[0.08] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_18px_40px_-24px_rgba(16,24,40,0.28)]">
            <div className="flex items-center gap-2.5">
              <SubredditIcon name={card.name} className="h-8 w-8 text-[0.8rem]" />
              <span className="min-w-0 flex-1 truncate text-[1.02rem] font-semibold text-ink">r/{card.name}</span>
              <span className="flex items-center gap-1.5">
                <span className="rounded-md bg-surface px-1.5 py-0.5 text-[0.75rem] font-semibold tabular-nums text-ink">{card.score}% match</span>
                <Marker n={n('score')} />
              </span>
            </div>
            <div className="mt-4 flex gap-2">
              <p className="flex-1 text-[0.88rem] leading-relaxed text-ink/80">{card.reason}</p>
              <Marker n={n('reason')} />
            </div>
            <div className="mt-4 flex items-start gap-2">
              <ul className="flex flex-1 flex-wrap gap-1.5" aria-label="Intent signals">
                {card.signals.map((s) => (
                  <li key={s} className="rounded-md border border-ink/[0.08] px-2 py-0.5 text-[0.75rem] text-ink/70">
                    “{s}”
                  </li>
                ))}
              </ul>
              <Marker n={n('signals')} />
            </div>
            <div className={cn('mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-4', LINE)}>
              <span className="flex items-center gap-1.5">
                <ActivityTag activity={card.activity} />
                <Marker n={n('activity')} />
              </span>
              <span className="flex items-center gap-1.5">
                <span className="rounded-md bg-cta-soft px-1.5 py-0.5 text-[0.72rem] font-semibold capitalize text-cta-deep">{card.tier}</span>
                <Marker n={n('tier')} />
              </span>
            </div>
            <span aria-hidden className="mt-5 flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-ink text-[0.82rem] font-semibold text-white">
              <Plus className="h-3.5 w-3.5" />
              Add
            </span>
          </div>
          <p className="mt-3 text-center text-[0.72rem] text-muted-foreground">Illustrative suggestion for a fictional product.</p>
        </div>

        <div className="order-3">{key(right, left.length)}</div>
      </Band>

      {/* ---------- what discovery reads ---------- */}
      <Band inner="flex flex-col gap-4 px-6 py-6 sm:px-10 lg:flex-row lg:items-center lg:gap-8 lg:px-12">
        <p className="shrink-0 text-[0.8rem] font-semibold text-ink">{ANATOMY.readsTitle}</p>
        <ul className="flex flex-1 flex-wrap gap-1.5">
          {ANATOMY.reads.map((r) => (
            <li key={r} className="rounded-md border border-ink/[0.08] bg-surface px-2 py-1 text-[0.75rem] font-medium text-ink/75">
              {r}
            </li>
          ))}
        </ul>
        <Link to="/features/website-analysis" className="group inline-flex shrink-0 items-center gap-1.5 text-[0.8rem] font-medium text-cta hover:text-cta-hover">
          {ANATOMY.readsNote}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </Band>
    </section>
  );
}
