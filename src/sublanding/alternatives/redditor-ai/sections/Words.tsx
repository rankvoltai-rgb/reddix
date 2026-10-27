import { BookOpen, Quote } from 'lucide-react';
import { Band, LINE, Pill, SECTION_TITLE } from '@/components/landing/frame';
import { Reveal } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { WORDS } from '../content';
import { Ref } from './Ref';

/* A ledger: the vendor's sentence on the left, Reddit's on the right, one
   topic per row. No verdict column; the reader supplies it. */
export function Words() {
  return (
    <section aria-labelledby="ra-words">
      <Band inner="grid gap-6 px-6 py-12 sm:px-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:px-12">
        <div>
          <Pill icon={BookOpen}>{WORDS.pill}</Pill>
          <h2 id="ra-words" className={cn('mt-5', SECTION_TITLE)}>
            {WORDS.title}
          </h2>
        </div>
        <p className="text-[0.98rem] leading-relaxed text-muted-foreground">{WORDS.body}</p>
      </Band>

      <Band>
        <div className={cn('hidden grid-cols-[9rem_minmax(0,1fr)_minmax(0,1fr)] border-b text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground md:grid', LINE)}>
          <span className="px-6 py-3 lg:px-12" />
          <span className={cn('border-l px-6 py-3', LINE)}>Redditor AI says</span>
          <span className={cn('border-l px-6 py-3', LINE)}>Reddit says</span>
        </div>
        <ul>
          {WORDS.pairs.map((p, i) => {
            const reddit = p.reddit as { quote?: string; where: string; src: string; note?: string };
            return (
              <li key={p.topic} className={cn('grid border-b last:border-b-0 md:grid-cols-[9rem_minmax(0,1fr)_minmax(0,1fr)]', LINE)}>
                <span className="px-6 pt-6 text-[0.8rem] font-semibold text-ink md:py-6 lg:px-12">{p.topic}</span>
                <Reveal delay={i * 0.04} className={cn('px-6 py-4 md:border-l md:py-6', LINE)}>
                  <p className="flex gap-2 text-[1.02rem] font-medium leading-snug text-ink">
                    <Quote aria-hidden className="mt-1 h-3.5 w-3.5 shrink-0 text-ink/30" />
                    <span>
                      “{p.them.quote}”
                      <Ref id={p.them.src} />
                    </span>
                  </p>
                  <p className="mt-2 pl-[1.375rem] text-[0.75rem] text-muted-foreground">{p.them.where}</p>
                </Reveal>
                <Reveal delay={i * 0.04 + 0.05} className={cn('border-t bg-surface/60 px-6 py-5 md:border-l md:border-t-0 md:py-6', LINE)}>
                  {reddit.quote && (
                    <p className="text-[0.98rem] font-medium leading-snug text-ink">
                      “{reddit.quote}”
                      <Ref id={reddit.src} />
                    </p>
                  )}
                  {reddit.note && (
                    <p className={cn('text-[0.86rem] leading-relaxed text-ink/70', reddit.quote && 'mt-2')}>
                      {reddit.note}
                      {!reddit.quote && <Ref id={reddit.src} />}
                    </p>
                  )}
                  <p className="mt-2 text-[0.75rem] text-muted-foreground">{reddit.where}</p>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </Band>
    </section>
  );
}
