import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, BookCheck, HelpCircle, RotateCw, ShieldAlert } from 'lucide-react';
import { Band, CTA_BUTTON, LINE, Pill, SectionHead, SECTION_TITLE, Spacer } from '@/components/landing/frame';
import { Reveal } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { CLOSE, FAQ, LEDGER, LIMITS } from '../content';

/* Two columns, side by side: into the memory, or back next scan. */
export function Ledger() {
  const cols = [
    { ...LEDGER.remembered, icon: BookCheck, tone: 'bg-cta text-white' },
    { ...LEDGER.again, icon: RotateCw, tone: 'border border-ink/[0.12] bg-white text-ink/60' },
  ];
  return (
    <section aria-labelledby="ledger-title">
      <SectionHead icon={BookCheck} eyebrow={LEDGER.pill} title={<span id="ledger-title">{LEDGER.title}</span>} />
      <Band inner="grid md:grid-cols-2">
        {cols.map((c, ci) => (
          <div key={c.label} className={cn('px-6 py-8 sm:px-10 lg:px-12 lg:py-10', ci === 1 && cn('border-t bg-surface/70 md:border-l md:border-t-0', LINE))}>
            <h3 className="flex items-center gap-2.5 text-[1.05rem] font-semibold text-ink">
              <span className={cn('flex h-7 w-7 items-center justify-center rounded-md', c.tone)}>
                <c.icon className="h-3.5 w-3.5" />
              </span>
              {c.label}
            </h3>
            <ul className="mt-5 divide-y divide-ink/[0.07] border-y border-ink/[0.07]">
              {c.items.map((item) => (
                <li key={item} className="py-3 text-[0.93rem] leading-snug text-ink/85">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Band>
      <Band inner="px-6 py-5 text-[0.86rem] leading-relaxed text-muted-foreground sm:px-10 lg:px-12">
        <p className="max-w-[52rem]">{LEDGER.footnote}</p>
      </Band>
    </section>
  );
}

/* The honest edges, one row each: the case on the left, what happens on the
   right. */
export function Limits() {
  return (
    <section aria-labelledby="limits-title">
      <Band inner="px-6 py-10 sm:px-10 sm:py-12 lg:px-12">
        <Pill icon={ShieldAlert}>{LIMITS.pill}</Pill>
        <h2 id="limits-title" className={cn('mt-5', SECTION_TITLE)}>
          {LIMITS.title}
        </h2>
      </Band>
      <Band>
        <ul className="divide-y divide-ink/[0.07]">
          {LIMITS.items.map((l) => (
            <li key={l.title}>
              <Reveal y={10} className="grid gap-2 px-6 py-6 sm:px-10 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-8 lg:px-12">
                <h3 className="flex items-center gap-2.5 text-[1rem] font-semibold text-ink">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-cta" />
                  {l.title}
                </h3>
                <p className="text-[0.92rem] leading-relaxed text-muted-foreground">{l.body}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </Band>
    </section>
  );
}

/* One centred column, every answer open. */
export function Questions() {
  return (
    <section aria-labelledby="faq-title">
      <Band inner="px-6 py-12 sm:px-10 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <Pill icon={HelpCircle}>Questions</Pill>
            <h2 id="faq-title" className={cn('mt-5', SECTION_TITLE)}>
              Duplicates, answered
            </h2>
          </div>
          <dl className="mt-10 divide-y divide-ink/[0.07] border-y border-ink/[0.07]">
            {FAQ.map((f) => (
              <div key={f.q} className="py-6">
                <dt className="text-[1.05rem] font-semibold leading-snug tracking-[-0.01em] text-ink">{f.q}</dt>
                <dd className="mt-2.5 text-[0.94rem] leading-relaxed text-muted-foreground">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Band>
    </section>
  );
}

/* Split: the action on the panel tone, the next reads beside it. */
export function Close() {
  return (
    <section aria-labelledby="close-title">
      <Spacer />
      <Band inner="grid lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className={cn('border-b bg-surface/70 px-6 py-12 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14', LINE)}>
          <h2 id="close-title" className="max-w-xl text-balance text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.3rem]">
            {CLOSE.title}
          </h2>
          <p className="mt-4 max-w-lg text-[0.98rem] leading-relaxed text-muted-foreground">{CLOSE.body}</p>
          <Link to="/auth" className={cn(CTA_BUTTON, 'mt-8')}>
            {CLOSE.button}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <nav aria-label="Related features">
          <ul className="divide-y divide-ink/[0.07]">
            {CLOSE.links.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="group flex items-center justify-between gap-4 px-6 py-6 transition-colors hover:bg-surface/60 sm:px-10 lg:px-10">
                  <span>
                    <span className="block text-[0.98rem] font-semibold text-ink">{l.title}</span>
                    <span className="mt-1 block text-[0.85rem] text-muted-foreground">{l.body}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-ink/30 transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-cta" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Band>
      <Spacer closing />
    </section>
  );
}
