import { Split } from 'lucide-react';
import { Band, LINE, Pill, SECTION_TITLE } from '@/components/landing/frame';
import { Reveal } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { DIFFERENCES } from '../content';

/* Long-form: each difference gets a numbered row, the heading pinned on the
   left while its two paragraphs (Redreach, then Reddix) read on the right. */
export function Differences() {
  return (
    <section aria-labelledby="diff-title">
      <Band inner="px-6 py-12 sm:px-10 lg:px-12">
        <Pill icon={Split}>{DIFFERENCES.pill}</Pill>
        <h2 id="diff-title" className={cn('mt-5 max-w-2xl', SECTION_TITLE)}>
          {DIFFERENCES.title}
        </h2>
      </Band>
      {DIFFERENCES.items.map((d, i) => (
        <Band key={d.title} inner="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
          <div className={cn('px-6 pb-2 pt-8 sm:px-10 lg:border-r lg:px-12 lg:py-10', LINE)}>
            <div className="lg:sticky lg:top-28">
              <span className="text-[2.6rem] font-semibold leading-none tracking-[-0.05em] tabular-nums text-cta/25">0{i + 1}</span>
              <h3 className="mt-3 text-[1.3rem] font-semibold leading-snug tracking-[-0.02em] text-ink">{d.title}</h3>
            </div>
          </div>
          <Reveal className="space-y-4 px-6 pb-9 pt-3 sm:px-10 lg:px-12 lg:py-10">
            {d.body.map((p, j) => (
              <p key={j} className="max-w-[40rem] text-[0.97rem] leading-[1.75] text-ink/80">
                {p}
              </p>
            ))}
          </Reveal>
        </Band>
      ))}
    </section>
  );
}
