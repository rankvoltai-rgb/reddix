import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Columns2, Library } from 'lucide-react';
import { Band, CTA_BUTTON, LINE, Pill, SECTION_TITLE, Spacer } from '@/components/landing/frame';
import { Reveal } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { CLOSING, FAQ, FIT, OWN_WORDS, SIDE, SOURCES } from '../content';
import { Ref } from './Ref';

/* REDAccs' three sentences across the top; Reddit's four below on ink. */
export function OwnWords() {
  return (
    <section aria-labelledby="rc-words">
      <Band inner="grid gap-6 px-6 py-12 sm:px-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:px-12">
        <div>
          <Pill icon={BookOpen}>{OWN_WORDS.pill}</Pill>
          <h2 id="rc-words" className={cn('mt-5', SECTION_TITLE)}>
            {OWN_WORDS.title}
          </h2>
        </div>
        <p className="text-[0.98rem] leading-relaxed text-muted-foreground">{OWN_WORDS.body}</p>
      </Band>
      <Band inner="grid md:grid-cols-3">
        {OWN_WORDS.vendor.map((v, i) => (
          <Reveal key={v.quote} delay={i * 0.05} className={cn('px-6 py-8 sm:px-8', i > 0 && cn('border-t md:border-l md:border-t-0', LINE))}>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">REDAccs</p>
            <blockquote className="mt-3 text-[1.15rem] font-medium leading-snug tracking-[-0.01em] text-ink">
              “{v.quote}”
              <Ref id={v.src} />
            </blockquote>
            <p className="mt-3 text-[0.78rem] text-muted-foreground">{v.where}</p>
          </Reveal>
        ))}
      </Band>
      <Band inner="bg-ink px-6 py-10 sm:px-10 lg:px-12">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-white/55">Reddit</p>
        <ul className="mt-4 grid gap-x-10 gap-y-6 md:grid-cols-2">
          {OWN_WORDS.reddit.map((r) => {
            const item = r as { quote?: string; note?: string; where: string; src: string };
            return (
              <li key={item.where}>
                <p className="text-[0.98rem] leading-relaxed text-white">
                  {item.quote ? `“${item.quote}”` : item.note}
                  <Ref id={item.src} light />
                </p>
                <p className="mt-1.5 text-[0.76rem] text-white/55">{item.where}</p>
              </li>
            );
          })}
        </ul>
      </Band>
    </section>
  );
}

const EDGE: Record<string, { text: string; cls: string } | undefined> = {
  them: { text: 'Thread Finder ahead', cls: 'bg-ink text-white' },
  us: { text: 'Reddix ahead', cls: 'bg-cta text-white' },
};

/* The fair part: the one product that does Reddix's job, row by row. */
export function Side() {
  return (
    <section aria-labelledby="rc-side">
      <Band inner="px-6 py-12 sm:px-10 sm:py-14 lg:px-12">
        <Pill icon={Columns2}>{SIDE.pill}</Pill>
        <h2 id="rc-side" className={cn('mt-5 max-w-2xl', SECTION_TITLE)}>
          {SIDE.title}
        </h2>
        <p className="mt-4 max-w-2xl text-[0.98rem] leading-relaxed text-muted-foreground">{SIDE.body}</p>
      </Band>
      <Band>
        <div className={cn('hidden grid-cols-[11rem_minmax(0,1fr)_minmax(0,1fr)] border-b text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground md:grid', LINE)}>
          <span className="px-6 py-3 lg:px-12" />
          <span className={cn('border-l px-6 py-3', LINE)}>Thread Finder</span>
          <span className={cn('border-l px-6 py-3', LINE)}>Reddix</span>
        </div>
        <ul>
          {SIDE.rows.map((r) => {
            const edge = EDGE[r.edge];
            return (
              <li key={r.label} className={cn('grid border-b last:border-b-0 md:grid-cols-[11rem_minmax(0,1fr)_minmax(0,1fr)]', LINE)}>
                <div className="px-6 pt-5 md:py-5 lg:px-12">
                  <p className="text-[0.88rem] font-semibold text-ink">{r.label}</p>
                  {edge && <span className={cn('mt-1.5 inline-flex rounded-md px-1.5 py-0.5 text-[0.66rem] font-semibold', edge.cls)}>{edge.text}</span>}
                </div>
                <p className={cn('px-6 py-3 text-[0.88rem] leading-relaxed text-ink/75 md:border-l md:py-5', LINE)}>
                  <span className="font-semibold text-ink md:hidden">Thread Finder: </span>
                  {r.them}
                </p>
                <p className={cn('px-6 pb-5 pt-1 text-[0.88rem] leading-relaxed text-ink md:border-l md:py-5', LINE)}>
                  <span className="font-semibold md:hidden">Reddix: </span>
                  {r.us}
                </p>
              </li>
            );
          })}
        </ul>
      </Band>
    </section>
  );
}

/* Fit as two short columns; questions as rows, question left, answer right. */
export function FitAndQuestions() {
  return (
    <section aria-labelledby="rc-faq">
      <Band inner="grid md:grid-cols-2">
        {[FIT.them, FIT.us].map((side, i) => (
          <div key={side.name} className={cn('px-6 py-8 sm:px-10 lg:px-12', i === 1 && cn('border-t bg-cta-soft/40 md:border-l md:border-t-0', LINE))}>
            <h2 className="text-[1.15rem] font-semibold text-ink">{side.name}</h2>
            <ol className="mt-4 space-y-3">
              {side.items.map((item, j) => (
                <li key={item} className="flex gap-3 text-[0.92rem] leading-relaxed text-ink/80">
                  <span className={cn('text-[0.8rem] font-semibold tabular-nums', i === 1 ? 'text-cta' : 'text-ink/35')}>{j + 1}.</span>
                  {item}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </Band>
      <Spacer />
      <Band inner="px-6 py-10 sm:px-10 lg:px-12">
        <h2 id="rc-faq" className={SECTION_TITLE}>
          REDAccs and Reddix: questions
        </h2>
      </Band>
      <Band>
        <dl>
          {FAQ.map((f) => (
            <div key={f.q} className={cn('grid gap-2 border-b px-6 py-7 last:border-b-0 sm:px-10 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-10 lg:px-12', LINE)}>
              <dt className="text-[1.02rem] font-semibold leading-snug text-ink">{f.q}</dt>
              <dd className="text-[0.92rem] leading-relaxed text-muted-foreground">{f.a}</dd>
            </div>
          ))}
        </dl>
      </Band>
    </section>
  );
}

export function SourcesAndClose() {
  return (
    <section aria-labelledby="rc-sources">
      <Spacer />
      <Band inner="grid gap-6 px-6 py-10 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)] lg:px-12">
        <div>
          <h2 id="rc-sources" className="flex items-center gap-2 text-[1.25rem] font-semibold tracking-[-0.02em] text-ink">
            <Library className="h-4 w-4 text-cta" />
            Sources
          </h2>
          <p className="mt-2 text-[0.82rem] leading-relaxed text-muted-foreground">
            Opened on October 27, 2026. REDAccs’ prices disagree in places; we quote each page as it stood. Check before you buy.
          </p>
        </div>
        <ol className="grid gap-x-8 gap-y-2.5 text-[0.85rem] sm:grid-cols-2">
          {SOURCES.map((s, i) => (
            <li key={s.id} id={`rc-src-${i + 1}`} className="flex scroll-mt-24 gap-3">
              <span className="w-5 shrink-0 font-semibold tabular-nums text-cta">{i + 1}</span>
              <a href={s.url} target="_blank" rel="noopener noreferrer nofollow" className="min-w-0 break-words text-ink/80 underline decoration-ink/20 underline-offset-2 hover:text-ink hover:decoration-cta">
                {s.label}
              </a>
            </li>
          ))}
        </ol>
      </Band>
      <Spacer />
      <Band inner="bg-cta-soft px-6 py-14 text-center sm:px-10 sm:py-16">
        <h2 className="mx-auto max-w-2xl text-balance text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.4rem]">{CLOSING.title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-balance text-[0.98rem] leading-relaxed text-ink/70">{CLOSING.body}</p>
        <Link to="/auth" className={cn(CTA_BUTTON, 'mt-8')}>
          {CLOSING.button}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </Band>
      <Spacer closing />
    </section>
  );
}
