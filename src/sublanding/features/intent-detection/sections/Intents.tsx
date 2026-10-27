import { Bell, Layers } from 'lucide-react';
import { Band, CELL, CellGrid, SectionHead } from '@/components/landing/frame';
import { Reveal } from '@/components/landing/shared';
import { INTENTS } from '../content';
import { LevelChip, Meter } from '../ui';

const WORD = /(CRM)/;

/* Four posts with the same keyword, low to hot. Every card carries the same
   keyword-alert tag; only the intent score tells them apart. */
export function Intents() {
  return (
    <section aria-labelledby="intents-title">
      <SectionHead icon={Layers} eyebrow={INTENTS.pill} title={<span id="intents-title">{INTENTS.title}</span>} subtitle={INTENTS.body} />
      <Band>
        <CellGrid className="sm:grid-cols-2 lg:grid-cols-4">
          {INTENTS.posts.map((p, i) => (
            <li key={p.level} className={CELL}>
              <Reveal delay={i * 0.07} className="flex h-full flex-col p-6 sm:p-7">
                <span className="inline-flex w-fit items-center gap-1.5 rounded-md border border-dashed border-ink/[0.16] px-2 py-0.5 text-[0.68rem] font-medium text-muted-foreground">
                  <Bell className="h-3 w-3" />
                  Keyword alert: match
                </span>
                <blockquote className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-ink">
                  “
                  {p.text.split(WORD).map((part, j) =>
                    WORD.test(part) ? (
                      <span key={j} className="rounded-[0.3rem] bg-ink/[0.06] px-1 font-semibold">
                        {part}
                      </span>
                    ) : (
                      part
                    ),
                  )}
                  ”
                </blockquote>
                <div className="mt-6">
                  <div className="flex items-end justify-between gap-3">
                    <span className="text-[2rem] font-semibold leading-none tracking-[-0.04em] tabular-nums text-ink">{p.score}</span>
                    <LevelChip level={p.level} />
                  </div>
                  <Meter score={p.score} level={p.level} className="mt-3" />
                  <p className="mt-4 text-[0.84rem] leading-relaxed text-muted-foreground">{p.why}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </CellGrid>
      </Band>
      <Band inner="px-6 py-3.5 text-center text-[0.75rem] text-muted-foreground sm:px-10">{INTENTS.note}</Band>
    </section>
  );
}
