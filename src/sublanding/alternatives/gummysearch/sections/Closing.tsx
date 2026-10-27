import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, BookOpen, Compass, HelpCircle, Tag, X, Check } from 'lucide-react';
import { Band, CTA_BUTTON, LINE, Pill, SECTION_TITLE, Spacer } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { CHECKED_LABEL } from '../../reddix';
import { CLOSE, FAQ, FIT, PRICES, SOURCES } from '../content';

/* Two price lists facing each other: the old one struck through as history. */
export function Prices() {
  return (
    <section aria-labelledby="prices-title">
      <Band inner="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div className={cn('border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-12', LINE)}>
          <Pill icon={Tag}>{PRICES.pill}</Pill>
          <h2 id="prices-title" className={cn('mt-5', SECTION_TITLE)}>
            {PRICES.title}
          </h2>
          <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">{PRICES.body}</p>
          <p className="mt-4 text-[0.8rem] leading-relaxed text-muted-foreground">{PRICES.footnote}</p>
        </div>
        <div className="grid sm:grid-cols-2">
          <PriceList title="GummySearch, no longer sold" items={PRICES.gummy} muted />
          <PriceList title="Reddix" items={PRICES.reddix} className={cn('border-t sm:border-l sm:border-t-0', LINE)} />
        </div>
      </Band>
    </section>
  );
}

function PriceList({
  title,
  items,
  muted = false,
  className,
}: {
  title: string;
  items: { name: string; price: string; note: string }[];
  muted?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('px-6 py-8 sm:px-8', muted && 'bg-surface/60', className)}>
      <p className="text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground">{title}</p>
      <ul className="mt-4 divide-y divide-ink/[0.07]">
        {items.map((p) => (
          <li key={p.name} className="py-3.5">
            <div className="flex items-baseline justify-between gap-3">
              <span className={cn('text-[0.95rem] font-semibold', muted ? 'text-ink/55' : 'text-ink')}>{p.name}</span>
              <span className={cn('text-[0.95rem] font-semibold tabular-nums', muted ? 'text-ink/45 line-through decoration-ink/30' : 'text-ink')}>{p.price}</span>
            </div>
            <p className="mt-0.5 text-[0.8rem] text-muted-foreground">{p.note}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* Who should come over, and who'd be better served by a research tool. */
export function Fit() {
  return (
    <section aria-labelledby="fit-title">
      <Band inner="px-6 py-10 text-center sm:px-10 sm:py-12">
        <Pill icon={Compass}>{FIT.pill}</Pill>
        <h2 id="fit-title" className={cn('mx-auto mt-5 max-w-3xl', SECTION_TITLE)}>
          {FIT.title}
        </h2>
      </Band>
      <Band inner="grid md:grid-cols-2">
        <FitColumn title={FIT.move.title} items={FIT.move.items} good />
        <div className={cn('border-t bg-surface/70 md:border-l md:border-t-0', LINE)}>
          <FitColumn title={FIT.elsewhere.title} items={FIT.elsewhere.items} />
          <p className="px-6 pb-8 text-[0.82rem] leading-relaxed text-muted-foreground sm:px-10 lg:px-12">{FIT.elsewhere.note}</p>
        </div>
      </Band>
    </section>
  );
}

function FitColumn({ title, items, good = false }: { title: string; items: readonly string[]; good?: boolean }) {
  const Icon = good ? Check : X;
  return (
    <div className="px-6 py-8 sm:px-10 lg:px-12 lg:py-10">
      <h3 className="text-[1.1rem] font-semibold tracking-[-0.01em] text-ink">{title}…</h3>
      <ul className="mt-5 space-y-3.5">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-[0.93rem] leading-relaxed text-ink/85">
            <span className={cn('mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md', good ? 'bg-cta text-white' : 'bg-ink/[0.07] text-ink/50')}>
              <Icon className="h-3 w-3" />
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* Questions as a numbered column, every answer open. */
export function Questions() {
  return (
    <section aria-labelledby="faq-title">
      <Band inner="px-6 py-10 sm:px-10 sm:py-12 lg:px-12">
        <Pill icon={HelpCircle}>Questions</Pill>
        <h2 id="faq-title" className={cn('mt-5', SECTION_TITLE)}>
          GummySearch’s shutdown, answered
        </h2>
      </Band>
      <Band>
        <dl className="divide-y divide-ink/[0.07]">
          {FAQ.map((f, i) => (
            <div key={f.q} className="grid gap-2 px-6 py-7 sm:px-10 md:grid-cols-[3rem_minmax(0,1fr)_minmax(0,1.4fr)] md:gap-8 lg:px-12">
              <span className="hidden text-[0.8rem] font-semibold tabular-nums text-cta md:block">0{i + 1}</span>
              <dt className="text-[1.02rem] font-semibold leading-snug text-ink">{f.q}</dt>
              <dd className="text-[0.92rem] leading-relaxed text-muted-foreground">{f.a}</dd>
            </div>
          ))}
        </dl>
      </Band>
    </section>
  );
}

export function Sources() {
  return (
    <section aria-labelledby="sources-title">
      <Band inner="px-6 py-8 sm:px-10 lg:px-12">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="sources-title" className="flex items-center gap-2 text-[1rem] font-semibold text-ink">
            <BookOpen className="h-4 w-4 text-cta" />
            Sources
          </h2>
          <p className="text-[0.78rem] text-muted-foreground">GummySearch facts checked {CHECKED_LABEL}, from GummySearch’s own pages.</p>
        </div>
        <ol className="mt-4 grid gap-x-8 gap-y-2 text-[0.84rem] md:grid-cols-2">
          {SOURCES.map((s, i) => (
            <li key={s.url} className="flex gap-2.5">
              <span className="w-5 shrink-0 tabular-nums text-muted-foreground">{i + 1}.</span>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="group inline-flex min-w-0 items-start gap-1 text-ink/80 underline decoration-ink/20 underline-offset-2 transition-colors hover:text-ink hover:decoration-cta">
                <span className="min-w-0 break-words">{s.label}</span>
                <ArrowUpRight className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground group-hover:text-cta" />
              </a>
            </li>
          ))}
        </ol>
      </Band>
    </section>
  );
}

export function Close() {
  return (
    <section aria-labelledby="close-title">
      <Spacer />
      <Band inner="bg-ink px-6 py-14 text-center sm:px-10 sm:py-16">
        <h2 id="close-title" className="mx-auto max-w-2xl text-balance text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-white sm:text-[2.4rem]">
          {CLOSE.title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-balance text-[0.98rem] leading-relaxed text-white/70">{CLOSE.body}</p>
        <Link to="/auth" className={cn(CTA_BUTTON, 'mt-8')}>
          {CLOSE.button}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </Band>
      <Spacer closing />
    </section>
  );
}
