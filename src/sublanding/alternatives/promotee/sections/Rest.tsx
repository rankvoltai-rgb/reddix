import { Link } from 'react-router-dom';
import { ArrowRight, HelpCircle, Library, Scale, ShieldAlert } from 'lucide-react';
import { Band, CELL, CellGrid, CTA_BUTTON, LINE, Pill, SECTION_TITLE, Spacer } from '@/components/landing/frame';
import { Reveal } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { CLOSING, FAQ, FIT, SOURCES, STRENGTHS, THREAD, TRADE } from '../content';
import { Ref } from './Ref';

/* Heading on the left, the four things Promotee does that Reddix doesn't on
   the right. */
export function Strengths() {
  return (
    <section aria-labelledby="pm-strengths">
      <Band inner="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)]">
        <div className={cn('border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-12', LINE)}>
          <h2 id="pm-strengths" className="text-[1.7rem] font-medium leading-[1.15] tracking-[-0.025em] text-ink sm:text-[2rem]">
            {STRENGTHS.title}
          </h2>
          <p className="mt-3 text-[0.92rem] leading-relaxed text-muted-foreground">{STRENGTHS.body}</p>
        </div>
        <CellGrid className="sm:grid-cols-2">
          {STRENGTHS.items.map((s, i) => (
            <li key={s.title} className={CELL}>
              <Reveal delay={i * 0.05} className="h-full p-6 sm:p-7">
                <h3 className="text-[1rem] font-semibold text-ink">{s.title}</h3>
                <p className="mt-2 text-[0.88rem] leading-relaxed text-muted-foreground">{s.body}</p>
              </Reveal>
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}

/* One card per activity: Promotee's description above, Reddit's words below,
   ruled in red down the side. */
export function Trade() {
  return (
    <section aria-labelledby="pm-trade">
      <Band inner="px-6 py-12 text-center sm:px-10 sm:py-14">
        <Pill icon={ShieldAlert}>{TRADE.pill}</Pill>
        <h2 id="pm-trade" className={cn('mx-auto mt-5 max-w-3xl', SECTION_TITLE)}>
          {TRADE.title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-balance text-[0.98rem] leading-relaxed text-muted-foreground">{TRADE.body}</p>
      </Band>
      <Band inner="px-5 py-8 sm:px-10 lg:px-12">
        <ol className="mx-auto grid max-w-4xl gap-3">
          {TRADE.rows.map((r, i) => {
            const reddit = r.reddit as { quote?: string; note?: string; where: string; src: string };
            return (
              <li key={r.activity}>
                <Reveal delay={i * 0.04} className="overflow-hidden rounded-xl border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
                  <div className="flex items-center gap-3 border-b border-ink/[0.06] bg-surface/60 px-5 py-3">
                    <span className="text-[0.75rem] font-semibold tabular-nums text-cta">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="text-[0.98rem] font-semibold text-ink">{r.activity}</h3>
                  </div>
                  <div className="grid sm:grid-cols-2">
                    <div className="px-5 py-4">
                      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Promotee</p>
                      <p className="mt-1.5 text-[0.9rem] leading-relaxed text-ink/80">
                        {r.them}
                        <Ref id="features" />
                      </p>
                    </div>
                    <div className="border-l-2 border-cta/60 bg-cta-soft/30 px-5 py-4 max-sm:border-l-0 max-sm:border-t">
                      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-cta-deep">Reddit</p>
                      <p className="mt-1.5 text-[0.9rem] leading-relaxed text-ink">
                        {reddit.quote ? `“${reddit.quote}”` : reddit.note}
                        <Ref id={reddit.src} />
                      </p>
                      <p className="mt-1.5 text-[0.74rem] text-muted-foreground">{reddit.where}</p>
                    </div>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
        <p className="mx-auto mt-6 max-w-4xl rounded-xl bg-ink px-5 py-4 text-[0.88rem] leading-relaxed text-white/85">
          {TRADE.after}
          {TRADE.afterSrc.map((id) => (
            <Ref key={id} id={id} />
          ))}
        </p>
      </Band>
    </section>
  );
}

/* Seven questions about one thread, each answered both ways in its own cell. */
export function Thread() {
  return (
    <section aria-labelledby="pm-thread">
      <Band inner="flex flex-wrap items-end justify-between gap-4 px-6 py-8 sm:px-10 lg:px-12">
        <h2 id="pm-thread" className="text-[1.6rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.9rem]">
          {THREAD.title}
        </h2>
        <p className="flex items-center gap-4 text-[0.78rem] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-ink/40" /> Promotee
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-cta" /> Reddix
          </span>
        </p>
      </Band>
      <Band>
        <CellGrid className="sm:grid-cols-2 lg:grid-cols-3">
          {THREAD.rows.map((r) => (
            <li key={r.label} className={cn(CELL, 'p-6 sm:p-7')}>
              <h3 className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{r.label}</h3>
              <p className="mt-3 flex gap-2.5 text-[0.88rem] leading-relaxed text-ink/75">
                <span className="mt-[0.45rem] h-2 w-2 shrink-0 rounded-full bg-ink/40" aria-hidden />
                <span>
                  <span className="sr-only">Promotee: </span>
                  {r.them}
                </span>
              </p>
              <p className="mt-2.5 flex gap-2.5 text-[0.88rem] font-medium leading-relaxed text-ink">
                <span className="mt-[0.45rem] h-2 w-2 shrink-0 rounded-full bg-cta" aria-hidden />
                <span>
                  <span className="sr-only">Reddix: </span>
                  {r.us}
                </span>
              </p>
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}

export function FitAndQuestions() {
  return (
    <section aria-labelledby="pm-faq">
      <Band inner="grid md:grid-cols-2">
        {[FIT.them, FIT.us].map((side, i) => (
          <div key={side.name} className={cn('px-6 py-8 sm:px-10 lg:px-12', i === 1 && cn('border-t md:border-l md:border-t-0', LINE))}>
            <h2 className="flex items-center gap-2 text-[1.15rem] font-semibold text-ink">
              <Scale className={cn('h-4 w-4', i === 1 ? 'text-cta' : 'text-ink/40')} />
              {side.name}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {side.items.map((item) => (
                <li key={item} className="border-l-2 border-ink/[0.08] pl-3 text-[0.92rem] leading-relaxed text-ink/80">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Band>
      <Spacer />
      <Band inner="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div className={cn('border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14', LINE)}>
          <div className="lg:sticky lg:top-28">
            <Pill icon={HelpCircle}>Questions</Pill>
            <h2 id="pm-faq" className={cn('mt-5', SECTION_TITLE)}>
              Promotee or Reddix?
            </h2>
          </div>
        </div>
        <dl className="divide-y divide-ink/[0.07]">
          {FAQ.map((f) => (
            <div key={f.q} className="px-6 py-7 sm:px-10 lg:px-12">
              <dt className="text-[1.04rem] font-semibold leading-snug text-ink">{f.q}</dt>
              <dd className="mt-2.5 max-w-[40rem] text-[0.92rem] leading-relaxed text-muted-foreground">{f.a}</dd>
            </div>
          ))}
        </dl>
      </Band>
    </section>
  );
}

export function SourcesAndClose() {
  return (
    <section aria-labelledby="pm-sources">
      <Spacer />
      <Band inner="px-6 py-10 sm:px-10 lg:px-12">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="pm-sources" className="flex items-center gap-2 text-[1.25rem] font-semibold tracking-[-0.02em] text-ink">
            <Library className="h-4 w-4 text-cta" />
            Sources
          </h2>
          <p className="text-[0.8rem] text-muted-foreground">Every page opened on October 27, 2026. Check the vendor’s site before buying.</p>
        </div>
        <ol className="mt-5 grid gap-x-10 gap-y-2.5 text-[0.86rem] md:grid-cols-2">
          {SOURCES.map((s, i) => (
            <li key={s.id} id={`pm-src-${i + 1}`} className="flex scroll-mt-24 gap-3">
              <span className="w-5 shrink-0 font-semibold tabular-nums text-cta">{i + 1}</span>
              <a href={s.url} target="_blank" rel="noopener noreferrer nofollow" className="min-w-0 break-words text-ink/80 underline decoration-ink/20 underline-offset-2 hover:text-ink hover:decoration-cta">
                {s.label}
              </a>
            </li>
          ))}
        </ol>
      </Band>
      <Spacer />
      <Band inner="grid items-center gap-6 bg-ink px-6 py-12 sm:px-10 md:grid-cols-[minmax(0,1.4fr)_auto] lg:px-12">
        <div>
          <h2 className="text-balance text-[1.8rem] font-medium leading-[1.12] tracking-[-0.03em] text-white sm:text-[2.2rem]">{CLOSING.title}</h2>
          <p className="mt-3 max-w-xl text-[0.96rem] leading-relaxed text-white/70">{CLOSING.body}</p>
        </div>
        <Link to="/auth" className={cn(CTA_BUTTON, 'w-fit')}>
          {CLOSING.button}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </Band>
      <Spacer closing />
    </section>
  );
}
