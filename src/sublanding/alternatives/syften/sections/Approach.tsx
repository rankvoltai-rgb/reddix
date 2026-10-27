import { Band, CELL, CellGrid, LINE, SECTION_TITLE } from '@/components/landing/frame';
import { Reveal } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { LANES, QUESTIONS } from '../content';

/* The two questions, set large: the clearest way to say they're different tools. */
export function Questions() {
  return (
    <section aria-labelledby="q-title">
      <Band inner="px-6 pt-12 sm:px-10 lg:px-12">
        <h2 id="q-title" className={SECTION_TITLE}>
          {QUESTIONS.title}
        </h2>
      </Band>
      <Band inner="grid md:grid-cols-2">
        {[
          { who: 'Syften', ...QUESTIONS.syften, red: false },
          { who: 'Reddix', ...QUESTIONS.reddix, red: true },
        ].map((x, i) => (
          <Reveal key={x.who} delay={i * 0.08} className={cn('px-6 py-10 sm:px-10 lg:px-12 lg:py-14', i === 1 && 'border-t md:border-l md:border-t-0', LINE)}>
            <p className={cn('text-[0.75rem] font-semibold uppercase tracking-[0.06em]', x.red ? 'text-cta' : 'text-muted-foreground')}>{x.who} asks</p>
            <p className="mt-3 text-balance text-[1.6rem] font-medium leading-[1.15] tracking-[-0.03em] text-ink sm:text-[1.9rem]">“{x.q}”</p>
            <p className="mt-5 max-w-md text-[0.92rem] leading-relaxed text-muted-foreground">{x.body}</p>
          </Reveal>
        ))}
      </Band>
    </section>
  );
}

/* Two swimlanes, four steps each, so the reader can follow a post through
   either tool. */
export function Lanes() {
  const lanes = [
    { who: 'Syften', steps: LANES.syften, red: false },
    { who: 'Reddix', steps: LANES.reddix, red: true },
  ];
  return (
    <section aria-labelledby="lanes-title">
      <Band inner="px-6 py-12 sm:px-10 lg:px-12">
        <h2 id="lanes-title" className={SECTION_TITLE}>
          {LANES.title}
        </h2>
      </Band>
      {lanes.map((lane) => (
        <Band key={lane.who} inner="grid lg:grid-cols-[8rem_minmax(0,1fr)]">
          <p
            className={cn(
              'border-b px-6 py-4 text-[0.8rem] font-semibold uppercase tracking-[0.06em] lg:border-b-0 lg:border-r lg:py-8',
              lane.red ? 'text-cta' : 'text-muted-foreground',
              LINE,
            )}
          >
            {lane.who}
          </p>
          <CellGrid className="sm:grid-cols-2 lg:grid-cols-4">
            {lane.steps.map((s, i) => (
              <li key={s.step} className={cn(CELL, 'px-6 py-6 sm:px-7')}>
                <span className={cn('text-[0.72rem] font-semibold tabular-nums', lane.red ? 'text-cta' : 'text-muted-foreground')}>Step {i + 1}</span>
                <h3 className="mt-1.5 text-[0.98rem] font-semibold text-ink">{s.step}</h3>
                <p className="mt-2 text-[0.85rem] leading-relaxed text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </CellGrid>
        </Band>
      ))}
    </section>
  );
}
