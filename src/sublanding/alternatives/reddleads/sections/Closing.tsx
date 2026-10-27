import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, ClipboardCheck, Coffee, Table2 } from 'lucide-react';
import { Band, CTA_BUTTON, LINE, Pill, SECTION_TITLE, SectionHead, Spacer } from '@/components/landing/frame';
import { Reveal } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { BETTER, CHECKED, CLOSE, FAQ, NAME, PLANS_TABLE, SOURCES, STYLE, TRIAL } from '../content';

const COLS = [
  { key: 'starter', label: 'Starter', who: NAME },
  { key: 'pro', label: 'Pro', who: NAME },
  { key: 'max', label: 'Max', who: NAME },
  { key: 'premium', label: 'Premium', who: 'Reddix' },
  { key: 'lifetime', label: 'Lifetime', who: 'Reddix' },
] as const;

/* A matrix: attributes down, five plans across, the two vendors grouped.
   On a phone it scrolls sideways inside its own box. */
export function Plans() {
  return (
    <section aria-labelledby="plans-title">
      <SectionHead icon={Table2} eyebrow={PLANS_TABLE.pill} title={<span id="plans-title">{PLANS_TABLE.title}</span>} subtitle={PLANS_TABLE.body} />
      <Band>
        <div className="overflow-x-auto [scrollbar-width:thin]" tabIndex={0} aria-label="Plans table, scrolls sideways on small screens">
          <table className="w-full min-w-[46rem] border-collapse text-left text-[0.84rem]">
            <caption className="sr-only">
              {NAME} and Reddix plans. {CHECKED}.
            </caption>
            <thead>
              <tr className={cn('border-b text-[0.68rem] font-semibold uppercase tracking-[0.07em]', LINE)}>
                <td className="px-6 pt-4 sm:px-10" />
                <th scope="colgroup" colSpan={3} className="px-4 pt-4 text-ink/50">
                  {NAME}
                </th>
                <th scope="colgroup" colSpan={2} className="bg-surface/70 px-4 pt-4 text-cta">
                  Reddix
                </th>
              </tr>
              <tr className={cn('border-b', LINE)}>
                <td className="px-6 py-3 sm:px-10" />
                {COLS.map((c) => (
                  <th key={c.key} scope="col" className={cn('px-4 py-3 text-[0.92rem] font-semibold text-ink', c.who === 'Reddix' && 'bg-surface/70')}>
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PLANS_TABLE.rows.map((r) => (
                <tr key={r.label} className={cn('border-b last:border-b-0', LINE)}>
                  <th scope="row" className="px-6 py-3.5 font-medium text-muted-foreground sm:px-10">
                    {r.label}
                  </th>
                  {COLS.map((c) => (
                    <td key={c.key} className={cn('px-4 py-3.5 tabular-nums text-ink/85', c.who === 'Reddix' && 'bg-surface/70')}>
                      {r[c.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Band>
      <Band inner="px-6 py-3 text-[0.74rem] text-muted-foreground sm:px-10">{CHECKED}. One-year figures are list price times twelve.</Band>
    </section>
  );
}

/* Two short essays facing each other, each ending on its cost. */
export function Style() {
  const cols = [
    { ...STYLE.them, red: false },
    { ...STYLE.reddix, red: true },
  ];
  return (
    <section aria-labelledby="style-title">
      <Band inner="px-6 py-12 sm:px-10 sm:py-14 lg:px-12">
        <Pill icon={Coffee}>{STYLE.pill}</Pill>
        <h2 id="style-title" className={cn('mt-5 max-w-3xl', SECTION_TITLE)}>
          {STYLE.title}
        </h2>
      </Band>
      <Band inner="grid lg:grid-cols-2">
        {cols.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.08} className={cn('px-6 py-9 sm:px-10 lg:px-12', i === 0 ? 'border-b lg:border-b-0 lg:border-r' : 'bg-surface/50', LINE)}>
            <h3 className={cn('text-[1.1rem] font-semibold', c.red ? 'text-cta' : 'text-ink')}>{c.title}</h3>
            {c.body.map((p, j) => (
              <p key={j} className={cn('mt-3 text-[0.95rem] leading-relaxed', j === c.body.length - 1 ? 'text-muted-foreground' : 'text-ink/80')}>
                {p}
              </p>
            ))}
          </Reveal>
        ))}
      </Band>
    </section>
  );
}

/* The verdict as two cards on the panel tone, then the trial checklist as a
   numbered path. */
export function Verdict() {
  return (
    <section aria-labelledby="verdict-title">
      <Band inner="bg-surface/70 px-5 py-12 sm:px-10 sm:py-14 lg:px-12">
        <h2 id="verdict-title" className={cn('text-center', SECTION_TITLE)}>
          {BETTER.title}
        </h2>
        <div className="mt-9 grid gap-4 md:grid-cols-2">
          {[BETTER.them, BETTER.reddix].map((col, i) => (
            <Reveal key={col.title} delay={i * 0.08} className={cn('rounded-xl border bg-white p-6 sm:p-7', i === 1 ? 'border-cta/30' : 'border-ink/[0.08]')}>
              <h3 className={cn('text-[1.05rem] font-semibold', i === 1 ? 'text-cta' : 'text-ink')}>{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.items.map((item) => (
                  <li key={item} className="flex gap-2.5 text-[0.9rem] leading-relaxed text-ink/80">
                    <span aria-hidden className={cn('mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full', i === 1 ? 'bg-cta' : 'bg-ink/35')} />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </Band>
    </section>
  );
}

export function Trial() {
  return (
    <section aria-labelledby="trial-title">
      <Band inner="grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className={cn('border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14', LINE)}>
          <div className="lg:sticky lg:top-28">
            <Pill icon={ClipboardCheck}>{TRIAL.pill}</Pill>
            <h2 id="trial-title" className={cn('mt-5', SECTION_TITLE)}>
              {TRIAL.title}
            </h2>
          </div>
        </div>
        <ol>
          {TRIAL.steps.map((s, i) => (
            <li key={s.t} className={cn('flex gap-5 border-b px-6 py-6 last:border-b-0 sm:px-10 lg:px-12', LINE)}>
              <span className="text-[1.6rem] font-semibold leading-none tracking-[-0.03em] tabular-nums text-cta/70">{i + 1}</span>
              <div>
                <h3 className="text-[1rem] font-semibold text-ink">{s.t}</h3>
                <p className="mt-1.5 text-[0.9rem] leading-relaxed text-muted-foreground">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </Band>
    </section>
  );
}

/* Questions as numbered cards in a column, then sources and the close. */
export function Questions() {
  return (
    <section aria-labelledby="faq-title">
      <Band inner="px-6 py-10 text-center sm:px-10">
        <h2 id="faq-title" className={SECTION_TITLE}>
          ReddLeads and Reddix, answered
        </h2>
      </Band>
      <Band inner="px-5 py-8 sm:px-10">
        <dl className="mx-auto max-w-3xl space-y-3">
          {FAQ.map((f, i) => (
            <div key={f.q} className="rounded-xl border border-ink/[0.08] bg-white p-5 sm:p-6">
              <dt className="flex gap-3 text-[1rem] font-semibold leading-snug text-ink">
                <span className="text-[0.8rem] tabular-nums text-ink/35">Q{i + 1}</span>
                {f.q}
              </dt>
              <dd className="mt-2 pl-8 text-[0.9rem] leading-relaxed text-muted-foreground">{f.a}</dd>
            </div>
          ))}
        </dl>
      </Band>
    </section>
  );
}

export function Close() {
  return (
    <section aria-labelledby="close-title">
      <Band id="sources" className="scroll-mt-16" inner="px-6 py-7 sm:px-10 lg:px-12">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-baseline lg:gap-10">
          <h2 className="shrink-0 text-[1rem] font-semibold text-ink">Sources</h2>
          <ol className="flex flex-wrap gap-x-6 gap-y-2 text-[0.84rem]">
            {SOURCES.map((s, i) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer nofollow" className="group inline-flex items-center gap-1 text-ink/80 underline decoration-ink/15 underline-offset-2 hover:text-ink">
                  <span className="tabular-nums text-ink/35">{i + 1}.</span> {s.label}
                  <ArrowUpRight className="h-3 w-3 text-ink/30 group-hover:text-ink" />
                </a>
              </li>
            ))}
          </ol>
        </div>
        <p className="mt-3 text-[0.76rem] text-muted-foreground">{CHECKED}. ReddLeads facts come from these pages; Reddix facts come from Reddix itself.</p>
      </Band>
      <Spacer />
      <Band inner="px-6 py-14 text-center sm:px-10 sm:py-16">
        <h2 id="close-title" className="mx-auto max-w-2xl text-balance text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.4rem]">
          {CLOSE.title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[0.98rem] leading-relaxed text-muted-foreground">{CLOSE.body}</p>
        <Link to="/auth" className={cn(CTA_BUTTON, 'mt-8')}>
          {CLOSE.button}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <ul className="mt-9 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[0.84rem]">
          {[...CLOSE.related, { to: '/alternatives', label: 'All Reddix alternatives' }].map((r) => (
            <li key={r.to}>
              <Link to={r.to} className="font-medium text-ink/70 underline decoration-ink/15 underline-offset-2 hover:text-ink">
                {r.label}
              </Link>
            </li>
          ))}
        </ul>
      </Band>
      <Spacer closing />
    </section>
  );
}
