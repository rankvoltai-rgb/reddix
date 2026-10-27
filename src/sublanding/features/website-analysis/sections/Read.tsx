import { ScrollText } from 'lucide-react';
import { Band, Pill, SECTION_TITLE } from '@/components/landing/frame';
import { Reveal } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { READ } from '../content';

/* A run sheet: the steps as numbered rows, each with the one number from the
   code that governs it pinned on the right. */
export function Read() {
  return (
    <section aria-labelledby="read-title">
      <Band inner="px-6 py-12 sm:px-10 sm:py-14 lg:px-12">
        <Pill icon={ScrollText}>{READ.pill}</Pill>
        <h2 id="read-title" className={cn('mt-5 max-w-2xl', SECTION_TITLE)}>
          {READ.title}
        </h2>
        <p className="mt-4 max-w-2xl text-[0.98rem] leading-relaxed text-muted-foreground">{READ.body}</p>
      </Band>
      <Band>
        <ol className="divide-y divide-ink/[0.07]">
          {READ.steps.map((s, i) => (
            <li key={s.title}>
              <Reveal delay={i * 0.05} y={10} className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-4 px-6 py-6 sm:grid-cols-[4rem_minmax(0,1fr)_11rem] sm:px-10 lg:px-12">
                <span className="text-[1.6rem] font-semibold leading-none tracking-[-0.04em] tabular-nums text-ink/20 sm:text-[2rem]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <h3 className="text-[1.05rem] font-semibold tracking-[-0.01em] text-ink">{s.title}</h3>
                  <p className="mt-1.5 max-w-2xl text-[0.9rem] leading-relaxed text-muted-foreground">{s.body}</p>
                </div>
                <span className="col-start-2 mt-3 w-fit self-start rounded-md border border-cta/25 bg-cta-soft px-2 py-1 text-[0.75rem] font-semibold tabular-nums text-cta-deep sm:col-start-3 sm:mt-0 sm:justify-self-end">
                  {s.fact}
                </span>
              </Reveal>
            </li>
          ))}
        </ol>
      </Band>
    </section>
  );
}
