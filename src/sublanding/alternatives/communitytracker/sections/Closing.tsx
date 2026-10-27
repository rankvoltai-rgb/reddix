import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Users } from 'lucide-react';
import { Band, CELL, CellGrid, CTA_BUTTON, LINE, Pill, SECTION_TITLE, Spacer } from '@/components/landing/frame';
import { Reveal } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { CHECKED, CLOSE, FAQ, FITS, SOURCES } from '../content';

/* Two rows of five cells: the row's verdict in the first cell, its reasons in
   the rest. Reads like a scorecard rather than two lists. */
export function Fits() {
  const rows = [
    { ...FITS.them, red: false },
    { ...FITS.reddix, red: true },
  ];
  return (
    <section aria-labelledby="fits-title">
      <Band inner="px-6 py-12 sm:px-10 sm:py-14 lg:px-12">
        <Pill icon={Users}>{FITS.pill}</Pill>
        <h2 id="fits-title" className={cn('mt-5', SECTION_TITLE)}>
          {FITS.title}
        </h2>
      </Band>
      {rows.map((r) => (
        <Band key={r.title} inner={cn(r.red && 'bg-surface/50')}>
          <CellGrid className="sm:grid-cols-2 lg:grid-cols-[13rem_repeat(5,minmax(0,1fr))]">
            <li className={cn(CELL, 'px-6 py-6 sm:col-span-2 lg:col-span-1')}>
              <h3 className={cn('text-[1rem] font-semibold leading-snug', r.red ? 'text-cta' : 'text-ink')}>{r.title}</h3>
            </li>
            {r.items.map((item, i) => (
              <li key={item} className={cn(CELL, 'px-6 py-6')}>
                <Reveal delay={i * 0.05}>
                  <span className="text-[0.72rem] font-semibold tabular-nums text-ink/35">0{i + 1}</span>
                  <p className="mt-2 text-[0.86rem] leading-relaxed text-ink/80">{item}</p>
                </Reveal>
              </li>
            ))}
          </CellGrid>
        </Band>
      ))}
    </section>
  );
}

/* Questions as a ruled table: question left, answer right. */
export function Questions() {
  return (
    <section aria-labelledby="faq-title">
      <Band inner="px-6 py-10 sm:px-10 lg:px-12">
        <h2 id="faq-title" className={SECTION_TITLE}>
          Questions buyers ask about CommunityTracker and Reddix
        </h2>
      </Band>
      <Band>
        <dl className="divide-y divide-ink/[0.07]">
          {FAQ.map((f) => (
            <div key={f.q} className="grid gap-2 px-6 py-6 sm:px-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-10 lg:px-12">
              <dt className="text-[1rem] font-semibold leading-snug text-ink">{f.q}</dt>
              <dd className="text-[0.92rem] leading-relaxed text-muted-foreground">{f.a}</dd>
            </div>
          ))}
        </dl>
      </Band>
    </section>
  );
}

/* Sources and the close share one band: the close on the soft red, sources
   in the margin beside it. */
export function Close() {
  return (
    <section aria-labelledby="close-title">
      <Spacer />
      <Band id="sources" className="scroll-mt-16" inner="grid lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className={cn('border-b bg-cta-soft px-6 py-12 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14', LINE)}>
          <h2 id="close-title" className="max-w-xl text-balance text-[1.8rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.2rem]">
            {CLOSE.title}
          </h2>
          <p className="mt-4 max-w-lg text-[0.98rem] leading-relaxed text-ink/70">{CLOSE.body}</p>
          <Link to="/auth" className={cn(CTA_BUTTON, 'mt-7')}>
            {CLOSE.button}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <ul className="mt-9 flex flex-wrap gap-x-5 gap-y-2 text-[0.84rem]">
            {CLOSE.related.map((r) => (
              <li key={r.to}>
                <Link to={r.to} className="font-medium text-ink/75 underline decoration-ink/15 underline-offset-2 hover:text-ink">
                  {r.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/alternatives" className="font-medium text-ink/75 underline decoration-ink/15 underline-offset-2 hover:text-ink">
                All Reddix alternatives
              </Link>
            </li>
          </ul>
        </div>
        <div className="px-6 py-10 sm:px-10 lg:px-10 lg:py-14">
          <h2 className="text-[1rem] font-semibold text-ink">Sources</h2>
          <p className="mt-1.5 text-[0.78rem] leading-relaxed text-muted-foreground">
            {CHECKED}. Every CommunityTracker fact here comes from these pages; Reddix facts come from Reddix itself.
          </p>
          <ol className="mt-4 space-y-2 text-[0.84rem]">
            {SOURCES.map((s, i) => (
              <li key={s.url} className="flex gap-2">
                <span className="w-4 shrink-0 tabular-nums text-ink/35">{i + 1}</span>
                <a href={s.url} target="_blank" rel="noopener noreferrer nofollow" className="group inline-flex items-start gap-1 text-ink/80 underline decoration-ink/15 underline-offset-2 hover:text-ink">
                  {s.label}
                  <ArrowUpRight className="mt-0.5 h-3 w-3 shrink-0 text-ink/30 group-hover:text-ink" />
                </a>
              </li>
            ))}
          </ol>
        </div>
      </Band>
      <Spacer closing />
    </section>
  );
}
