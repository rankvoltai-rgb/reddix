import { Link } from 'react-router-dom';
import { ArrowRight, HelpCircle } from 'lucide-react';
import { Band, CTA_BUTTON, LINE as RULE, Pill, SECTION_TITLE, Spacer } from '@/components/landing/frame';
import { Reveal } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { CLOSE, FAQ, METHOD } from '../content';

/* The method beside the questions: how the guide was made is part of the
   answer to "can I trust it". */
export function Questions() {
  return (
    <section aria-labelledby="faq-title">
      <Band inner="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <div className={cn('border-b bg-surface/60 px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14', RULE)}>
          <h2 className="text-[1.25rem] font-semibold tracking-[-0.02em] text-ink">{METHOD.title}</h2>
          <ol className="mt-5 space-y-4">
            {METHOD.items.map((m, i) => (
              <li key={m} className="flex gap-3 text-[0.88rem] leading-relaxed text-ink/80">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white text-[0.7rem] font-semibold tabular-nums text-cta shadow-[0_0_0_1px_hsl(var(--ink)/0.08)]">
                  {i + 1}
                </span>
                {m}
              </li>
            ))}
          </ol>
        </div>
        <div className="px-6 py-10 sm:px-10 lg:px-12 lg:py-14">
          <Pill icon={HelpCircle}>Questions</Pill>
          <h2 id="faq-title" className={cn('mt-5', SECTION_TITLE)}>
            Choosing a Reddit lead tool
          </h2>
          <dl className="mt-8 divide-y divide-ink/[0.07] border-t border-ink/[0.07]">
            {FAQ.map((f) => (
              <div key={f.q} className="py-6">
                <dt className="text-[1.02rem] font-semibold leading-snug text-ink">{f.q}</dt>
                <dd className="mt-2 text-[0.92rem] leading-relaxed text-muted-foreground">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Band>
    </section>
  );
}

export function Close() {
  return (
    <section aria-labelledby="close-title">
      <Spacer />
      <Band inner="px-6 py-14 text-center sm:px-10 sm:py-16">
        <Reveal>
          <h2 id="close-title" className="mx-auto max-w-2xl text-balance text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.4rem]">
            {CLOSE.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-balance text-[0.98rem] leading-relaxed text-muted-foreground">{CLOSE.body}</p>
          <Link to="/auth" className={cn(CTA_BUTTON, 'mt-8')}>
            {CLOSE.button}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </Band>
      <Spacer closing />
    </section>
  );
}
