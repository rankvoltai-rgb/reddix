import { Check, Scale, X } from 'lucide-react';
import { Band, LINE, Pill, SECTION_TITLE } from '@/components/landing/frame';
import { Reveal } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { ANSWER } from '../content';

/* The straight answer as a ledger: what happens, what doesn't, then why. */
export function Answer() {
  return (
    <section aria-labelledby="answer-title">
      <Band inner="px-6 py-12 sm:px-10 sm:py-14 lg:px-12">
        <Pill icon={Scale}>{ANSWER.pill}</Pill>
        <h2 id="answer-title" className={cn('mt-5', SECTION_TITLE)}>
          {ANSWER.title}
        </h2>
      </Band>
      <Band inner="grid sm:grid-cols-2">
        {[
          { ...ANSWER.does, yes: true },
          { ...ANSWER.doesnt, yes: false },
        ].map((col, ci) => (
          <div key={col.label} className={cn('px-6 py-8 sm:px-10 lg:px-12 lg:py-10', ci === 1 && cn('border-t sm:border-l sm:border-t-0', LINE), !col.yes && 'bg-surface/70')}>
            <h3 className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{col.label}</h3>
            <ul className="mt-5 space-y-3.5">
              {col.items.map((item, i) => (
                <li key={item}>
                  <Reveal delay={i * 0.05} y={8} className="flex gap-3 text-[0.98rem] leading-snug text-ink">
                    <span
                      className={cn(
                        'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md',
                        col.yes ? 'bg-cta text-white' : 'border border-ink/[0.12] bg-white text-ink/45',
                      )}
                    >
                      {col.yes ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    </span>
                    <span className={col.yes ? undefined : 'text-ink/70'}>{item}</span>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Band>
      <Band inner="grid gap-6 px-6 py-10 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:px-12 lg:py-12">
        <h3 className="text-[1.25rem] font-semibold leading-snug tracking-[-0.02em] text-ink">{ANSWER.why.title}</h3>
        <div className="max-w-[42rem] space-y-4 text-[0.98rem] leading-relaxed text-muted-foreground">
          {ANSWER.why.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </Band>
    </section>
  );
}
