import { ArrowUpRight, Scale } from 'lucide-react';
import { Band, LINE as RULE, Pill, SECTION_TITLE } from '@/components/landing/frame';
import { Reveal } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { LINE } from '../content';

/* Why the line is the right way to sort these tools, and Reddit's own words
   on the far end of it. */
export function Line() {
  return (
    <section aria-labelledby="line-title">
      <Band inner="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className={cn('border-b px-6 py-12 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-16', RULE)}>
          <Pill icon={Scale}>{LINE.pill}</Pill>
          <h2 id="line-title" className={cn('mt-5', SECTION_TITLE)}>
            {LINE.title}
          </h2>
          <p className="mt-5 max-w-[32rem] text-[1rem] leading-relaxed text-muted-foreground">{LINE.body}</p>
        </div>
        <div className="bg-surface/60 px-6 py-12 sm:px-10 lg:px-12 lg:py-16">
          <h3 className="text-[0.8rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground">{LINE.rules.title}</h3>
          <ol className="mt-5 space-y-3">
            {LINE.rules.items.map((r, i) => (
              <li key={r.text}>
                <Reveal delay={i * 0.06} className="rounded-xl border border-ink/[0.08] bg-white p-4 sm:p-5">
                  <p className="text-[0.92rem] leading-relaxed text-ink">{r.text}</p>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2.5 inline-flex items-center gap-1 text-[0.78rem] font-medium text-cta hover:text-cta-hover"
                  >
                    {r.source}
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                </Reveal>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-[0.84rem] leading-relaxed text-ink/70">{LINE.rules.note}</p>
        </div>
      </Band>
    </section>
  );
}
