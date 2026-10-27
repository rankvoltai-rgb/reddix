import { ScrollText } from 'lucide-react';
import { Band, Pill, SECTION_TITLE } from '@/components/landing/frame';
import { Reveal } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { RULES } from '../content';

/* A rulebook: one wide row per rule, the numeral set large, what the AI is
   told beside it, and why it matters on Reddit after that. */
export function Rules() {
  return (
    <section aria-labelledby="rules-title">
      <Band inner="px-6 py-12 sm:px-10 sm:py-14 lg:px-12">
        <Pill icon={ScrollText}>{RULES.pill}</Pill>
        <h2 id="rules-title" className={cn('mt-5 max-w-2xl', SECTION_TITLE)}>
          {RULES.title}
        </h2>
        <p className="mt-4 max-w-2xl text-[0.98rem] leading-relaxed text-muted-foreground">{RULES.body}</p>
      </Band>
      <Band>
        <ol className="divide-y divide-ink/[0.07]">
          {RULES.items.map((r, i) => (
            <li key={r.rule} id={`rule-${i + 1}`} className="scroll-mt-24">
              <Reveal y={10} className="grid gap-3 px-6 py-7 sm:grid-cols-[4.5rem_minmax(0,1fr)] sm:px-10 lg:grid-cols-[6rem_minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-10 lg:px-12 lg:py-9">
                <span aria-hidden className="text-[2.6rem] font-medium leading-none tracking-[-0.05em] tabular-nums text-cta/80 lg:text-[3.4rem]">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <h3 className="text-[1.15rem] font-semibold tracking-[-0.015em] text-ink">{r.rule}</h3>
                  <p className="mt-2 border-l-2 border-cta/40 pl-3 text-[0.86rem] leading-relaxed text-ink/70">
                    <span className="sr-only">The AI is told: </span>
                    {r.prompt}
                  </p>
                </div>
                <p className="text-[0.9rem] leading-relaxed text-muted-foreground sm:col-start-2 lg:col-start-auto">{r.why}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Band>
    </section>
  );
}
