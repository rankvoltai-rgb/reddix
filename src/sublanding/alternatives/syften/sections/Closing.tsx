import { Link } from 'react-router-dom';
import { ArrowRight, Check, ExternalLink, Minus } from 'lucide-react';
import { Band, CTA_BUTTON, LINE, SECTION_TITLE, Spacer } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { CHECKED_LABEL } from '../../reddix';
import { CHOOSE, CLOSING, FAQ, PLANS, SOURCES, SYFTEN_PLANS } from '../content';

const ROWS: { label: string; get: (p: (typeof SYFTEN_PLANS)[number]) => string | boolean }[] = [
  { label: 'Price', get: (p) => `$${p.price.toFixed(2)}/mo` },
  { label: 'Community filters', get: (p) => String(p.filters) },
  { label: 'Community results a day', get: (p) => String(p.results) },
  { label: 'Web filters / results a day', get: (p) => `${p.webFilters} / ${p.webResults}` },
  { label: 'Archive', get: (p) => p.archive },
  { label: 'Slack', get: (p) => p.slack },
  { label: 'AI filtering', get: (p) => p.ai },
  { label: 'Webhooks and MCP', get: (p) => p.hooks },
];

/* Syften's plans as a matrix, columns per plan; scrolls sideways on phones
   inside its own box, never the page. */
export function Plans() {
  return (
    <section aria-labelledby="plans-title">
      <Band inner="px-6 py-12 sm:px-10 lg:px-12">
        <h2 id="plans-title" className={SECTION_TITLE}>
          {PLANS.title}
        </h2>
        <p className="mt-4 max-w-2xl text-[0.95rem] leading-relaxed text-muted-foreground">{PLANS.body}</p>
        <div className="mt-8 overflow-x-auto rounded-xl border border-ink/[0.08]">
          <table className="w-full min-w-[34rem] text-[0.85rem]">
            <thead>
              <tr className="bg-surface/70 text-left">
                <th className="px-4 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Syften</th>
                {SYFTEN_PLANS.map((p) => (
                  <th key={p.name} className="px-4 py-3 font-semibold text-ink">
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.label} className="border-t border-ink/[0.07]">
                  <th scope="row" className="px-4 py-2.5 text-left font-medium text-ink/75">
                    {r.label}
                  </th>
                  {SYFTEN_PLANS.map((p) => {
                    const v = r.get(p);
                    return (
                      <td key={p.name} className="px-4 py-2.5 tabular-nums text-ink">
                        {typeof v === 'boolean' ? (
                          v ? <Check aria-label="Yes" className="h-4 w-4 text-cta" /> : <Minus aria-label="No" className="h-4 w-4 text-ink/30" />
                        ) : (
                          v
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[0.75rem] text-muted-foreground">
          Syften prices from its pricing page, checked {CHECKED_LABEL}. A “Tailor made” plan is available by email.
        </p>
        <p className={cn('mt-6 border-l-2 border-cta pl-4 text-[0.9rem] leading-relaxed text-ink')}>{PLANS.reddix}</p>
      </Band>
    </section>
  );
}

export function Choose() {
  return (
    <section aria-labelledby="choose-title">
      <Band inner="px-6 pt-12 sm:px-10 lg:px-12">
        <h2 id="choose-title" className={SECTION_TITLE}>
          {CHOOSE.title}
        </h2>
      </Band>
      <Band inner="mt-8 grid md:grid-cols-2">
        {[
          { ...CHOOSE.syften, red: false },
          { ...CHOOSE.reddix, red: true },
        ].map((c, i) => (
          <div key={c.title} className={cn('px-6 py-8 sm:px-10 lg:px-12', i === 1 && 'border-t bg-cta-soft/50 md:border-l md:border-t-0', LINE)}>
            <h3 className={cn('text-[1.1rem] font-semibold', c.red ? 'text-cta-deep' : 'text-ink')}>{c.title}</h3>
            <ul className="mt-4 space-y-3">
              {c.items.map((it) => (
                <li key={it} className="flex gap-2.5 text-[0.9rem] leading-relaxed text-ink/85">
                  <Check className={cn('mt-1 h-3.5 w-3.5 shrink-0', c.red ? 'text-cta' : 'text-ink/50')} />
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Band>
    </section>
  );
}

/* A numbered single column: questions read top to bottom. */
export function Questions() {
  return (
    <section aria-labelledby="faq-title">
      <Band inner="px-6 py-12 sm:px-10 lg:px-12">
        <h2 id="faq-title" className={SECTION_TITLE}>
          Syften and Reddix, answered
        </h2>
        <dl className="mt-8 max-w-3xl divide-y divide-ink/[0.07]">
          {FAQ.map((f, i) => (
            <div key={f.q} className="grid grid-cols-[2rem_minmax(0,1fr)] py-5">
              <span className="text-[0.8rem] font-semibold tabular-nums text-cta">{i + 1}</span>
              <div>
                <dt className="text-[1rem] font-semibold leading-snug text-ink">{f.q}</dt>
                <dd className="mt-2 text-[0.9rem] leading-relaxed text-muted-foreground">{f.a}</dd>
              </div>
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
      <Band inner="bg-surface/70 px-6 py-8 sm:px-10 lg:px-12">
        <h2 id="sources-title" className="text-[0.95rem] font-semibold text-ink">
          Sources
        </h2>
        <p className="mt-1 text-[0.8rem] text-muted-foreground">Syften details from its own site, checked {CHECKED_LABEL}. Check syften.com before you buy.</p>
        <ol className="mt-4 space-y-2">
          {SOURCES.map((s, i) => (
            <li key={s.url} className="text-[0.82rem]">
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-start gap-1.5 text-ink/75 underline decoration-ink/20 underline-offset-2 hover:text-cta hover:decoration-cta/40"
              >
                <span className="tabular-nums text-muted-foreground">{i + 1}.</span>
                {s.label}
                <ExternalLink aria-hidden className="mt-0.5 h-3 w-3 shrink-0" />
              </a>
            </li>
          ))}
        </ol>
      </Band>
    </section>
  );
}

export function Closing() {
  return (
    <section aria-labelledby="close-title">
      <Spacer />
      <Band inner="flex flex-col items-start gap-6 px-6 py-12 sm:px-10 md:flex-row md:items-center md:justify-between lg:px-12">
        <div>
          <h2 id="close-title" className="text-balance text-[1.7rem] font-medium leading-[1.15] tracking-[-0.03em] text-ink sm:text-[2rem]">
            {CLOSING.title}
          </h2>
          <p className="mt-2 max-w-lg text-[0.92rem] leading-relaxed text-muted-foreground">{CLOSING.body}</p>
        </div>
        <Link to="/auth" className={cn(CTA_BUTTON, 'shrink-0')}>
          {CLOSING.cta}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </Band>
      <Spacer closing />
    </section>
  );
}
