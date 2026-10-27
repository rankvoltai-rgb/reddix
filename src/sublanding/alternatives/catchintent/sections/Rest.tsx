import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Columns2, HelpCircle, LifeBuoy, MinusCircle } from 'lucide-react';
import { Band, CELL, CellGrid, CTA_BUTTON, LINE, Pill, SECTION_TITLE, SectionHead, Spacer } from '@/components/landing/frame';
import { Reveal } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { CHECKED_LABEL } from '../../reddix';
import { BOTH, CLOSE, COMPARE, FAQ, GAPS, LEGACY, SOURCES } from '../content';

/* For people still on a Reddit plan: the vendor's word, then three plain
   consequences. */
export function Legacy() {
  return (
    <section aria-labelledby="legacy-title">
      <Band inner="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
        <div className={cn('border-b bg-surface/70 px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-12', LINE)}>
          <Pill icon={LifeBuoy}>{LEGACY.pill}</Pill>
          <h2 id="legacy-title" className={cn('mt-5', SECTION_TITLE)}>
            {LEGACY.title}
          </h2>
          <p className="mt-4 text-[0.93rem] leading-relaxed text-muted-foreground">{LEGACY.body}</p>
        </div>
        <ol className="divide-y divide-ink/[0.07]">
          {LEGACY.items.map((item, i) => (
            <li key={item.title} className="flex gap-5 px-6 py-7 sm:px-10 lg:px-12">
              <span className="text-[1.6rem] font-semibold leading-none tracking-[-0.03em] tabular-nums text-cta">{i + 1}</span>
              <div>
                <h3 className="text-[1.02rem] font-semibold text-ink">{item.title}</h3>
                <p className="mt-1.5 text-[0.9rem] leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Band>
    </section>
  );
}

/* Row labels down the left, the two products across. On phones each row
   becomes a small stacked card. */
export function Compare() {
  return (
    <section aria-labelledby="compare-title">
      <SectionHead icon={Columns2} eyebrow={COMPARE.pill} title={<span id="compare-title">{COMPARE.title}</span>} subtitle={COMPARE.body} />
      <Band>
        <div className={cn('hidden grid-cols-[11rem_minmax(0,1fr)_minmax(0,1fr)] border-b bg-surface/70 text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground md:grid', LINE)}>
          <span className="px-6 py-3 sm:px-10 lg:pl-12" />
          <span className={cn('border-l px-6 py-3', LINE)}>CatchIntent now</span>
          <span className={cn('border-l px-6 py-3 text-cta', LINE)}>Reddix</span>
        </div>
        <dl>
          {COMPARE.rows.map((r) => (
            <div key={r.label} className={cn('grid border-b last:border-b-0 md:grid-cols-[11rem_minmax(0,1fr)_minmax(0,1fr)]', LINE)}>
              <dt className="px-6 pt-5 text-[0.85rem] font-semibold text-ink sm:px-10 md:py-5 lg:pl-12">{r.label}</dt>
              <dd className={cn('px-6 pt-2 text-[0.88rem] leading-relaxed text-ink/75 sm:px-10 md:border-l md:px-6 md:py-5', LINE)}>
                <span className="mb-0.5 block text-[0.7rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground md:hidden">CatchIntent now</span>
                {r.ci}
              </dd>
              <dd className={cn('px-6 pb-5 pt-3 text-[0.88rem] leading-relaxed text-ink sm:px-10 md:border-l md:px-6 md:py-5', LINE)}>
                <span className="mb-0.5 block text-[0.7rem] font-semibold uppercase tracking-[0.06em] text-cta md:hidden">Reddix</span>
                {r.reddix}
              </dd>
            </div>
          ))}
        </dl>
      </Band>
    </section>
  );
}

/* What's lost, said plainly, in a 2×2; what carries over in one line under it. */
export function Gaps() {
  return (
    <section aria-labelledby="gaps-title">
      <Band inner="px-6 py-10 sm:px-10 sm:py-12 lg:px-12">
        <Pill icon={MinusCircle}>{GAPS.pill}</Pill>
        <h2 id="gaps-title" className={cn('mt-5 max-w-3xl', SECTION_TITLE)}>
          {GAPS.title}
        </h2>
        <p className="mt-4 max-w-2xl text-[0.98rem] leading-relaxed text-muted-foreground">{GAPS.body}</p>
      </Band>
      <Band>
        <CellGrid className="sm:grid-cols-2">
          {GAPS.items.map((g, i) => (
            <li key={g.title} className={CELL}>
              <Reveal delay={(i % 2) * 0.06} className="h-full p-6 sm:p-8 lg:px-12">
                <span className="inline-flex h-6 items-center rounded-md bg-ink/[0.06] px-2 text-[0.7rem] font-semibold text-ink/60">Not in Reddix</span>
                <h3 className="mt-4 text-[1.05rem] font-semibold text-ink">{g.title}</h3>
                <p className="mt-2 text-[0.9rem] leading-relaxed text-muted-foreground">{g.body}</p>
              </Reveal>
            </li>
          ))}
        </CellGrid>
      </Band>
      <Band inner="px-6 py-5 text-[0.92rem] font-medium text-ink sm:px-10 lg:px-12">{GAPS.same}</Band>
      <Spacer />
      <Band inner="grid gap-4 px-6 py-10 sm:px-10 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-10 lg:px-12">
        <h2 className="text-[1.5rem] font-medium tracking-[-0.025em] text-ink">{BOTH.title}</h2>
        <p className="text-[0.95rem] leading-relaxed text-muted-foreground">{BOTH.body}</p>
      </Band>
    </section>
  );
}

/* Questions in two columns of cells, every answer open. */
export function Questions() {
  return (
    <section aria-labelledby="faq-title">
      <SectionHead icon={HelpCircle} eyebrow="Questions" title={<span id="faq-title">CatchIntent and Reddit, answered</span>} />
      <Band>
        <CellGrid className="md:grid-cols-2">
          {FAQ.map((f) => (
            <li key={f.q} className={cn(CELL, 'p-6 sm:p-8 md:last:odd:col-span-2 lg:px-12')}>
              <h3 className="text-[1.02rem] font-semibold leading-snug text-ink">{f.q}</h3>
              <p className="mt-2.5 text-[0.9rem] leading-relaxed text-muted-foreground">{f.a}</p>
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}

export function Sources() {
  return (
    <section aria-labelledby="sources-title">
      <Spacer />
      <Band inner="px-6 py-8 sm:px-10 lg:px-12">
        <h2 id="sources-title" className="text-[1rem] font-semibold text-ink">
          Sources
        </h2>
        <p className="mt-1 text-[0.78rem] text-muted-foreground">Checked {CHECKED_LABEL}. All CatchIntent facts come from CatchIntent’s own pages.</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-ink/[0.1] bg-white px-3 py-1.5 text-[0.8rem] text-ink/80 transition-colors hover:border-ink/[0.2] hover:text-ink"
              >
                {s.label}
                <ArrowUpRight className="h-3 w-3 shrink-0 text-muted-foreground" />
              </a>
            </li>
          ))}
        </ul>
      </Band>
    </section>
  );
}

export function Close() {
  return (
    <section aria-labelledby="close-title">
      <Spacer />
      <Band inner="grid gap-6 px-6 py-12 sm:px-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-center lg:px-12">
        <div>
          <h2 id="close-title" className="text-balance text-[1.8rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.2rem]">
            {CLOSE.title}
          </h2>
          <p className="mt-3 max-w-xl text-[0.98rem] leading-relaxed text-muted-foreground">{CLOSE.body}</p>
        </div>
        <Link to="/auth" className={cn(CTA_BUTTON, 'w-fit')}>
          {CLOSE.button}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </Band>
      <Spacer closing />
    </section>
  );
}
