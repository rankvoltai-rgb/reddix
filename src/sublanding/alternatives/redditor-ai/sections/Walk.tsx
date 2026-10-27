import { useMemo, useState } from 'react';
import { Footprints } from 'lucide-react';
import { Band, LINE, Pill, SECTION_TITLE } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { ACTOR_LABEL, WALK, type Actor } from '../content';

/* Who does each step: the vendor in grey, Reddix in soft red, you
   in solid red. The tally is counted from the same data the cards show. */
const ACTOR_CHIP: Record<Actor, string> = {
  vendor: 'bg-ink/[0.07] text-ink/75',
  reddix: 'bg-cta-soft text-cta-deep',
  you: 'bg-cta text-white',
  none: 'bg-white text-muted-foreground ring-1 ring-inset ring-ink/[0.12]',
  unstated: 'bg-white text-muted-foreground border border-dashed border-ink/[0.25]',
};

const DOT: Record<Actor, string> = {
  vendor: 'bg-ink/40',
  reddix: 'bg-cta/45',
  you: 'bg-cta',
  none: 'bg-white ring-1 ring-ink/25',
  unstated: 'bg-white ring-1 ring-ink/25',
};

export function Walk() {
  const [active, setActive] = useState(0);
  const step = WALK.steps[active];

  const tally = useMemo(() => {
    const steps = WALK.steps;
    return {
      themYou: steps.filter((s) => (s.them.who as Actor) === 'you').length,
      usYou: steps.filter((s) => (s.us.who as Actor) === 'you').length,
      themOther: steps.filter((s) => (s.them.who as Actor) === 'vendor').length,
      total: steps.length,
    };
  }, []);

  return (
    <section aria-labelledby="ra-walk">
      <Band inner="px-6 pb-8 pt-12 sm:px-10 sm:pt-14 lg:px-12">
        <Pill icon={Footprints}>{WALK.pill}</Pill>
        <h2 id="ra-walk" className={cn('mt-5 max-w-2xl', SECTION_TITLE)}>
          {WALK.title}
        </h2>
        <p className="mt-4 max-w-2xl text-[0.98rem] leading-relaxed text-muted-foreground">{WALK.body}</p>
      </Band>

      <Band inner="grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.5fr)]">
        {/* The path: one button per step, with a dot for each tool. */}
        <ol className={cn('border-b lg:border-b-0 lg:border-r', LINE)} aria-label="Steps">
          {WALK.steps.map((s, i) => (
            <li key={s.title} className={cn('border-b last:border-b-0', LINE)}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={active === i}
                className={cn(
                  'flex w-full items-center gap-3 px-6 py-3.5 text-left transition-colors sm:px-10 lg:px-12',
                  active === i ? 'bg-surface' : 'hover:bg-surface/60',
                )}
              >
                <span className={cn('w-6 shrink-0 text-[0.75rem] font-semibold tabular-nums', active === i ? 'text-cta' : 'text-ink/35')}>
                  0{i + 1}
                </span>
                <span className={cn('flex-1 text-[0.92rem]', active === i ? 'font-semibold text-ink' : 'text-ink/75')}>{s.title}</span>
                <span className="flex items-center gap-1" aria-hidden>
                  <span className={cn('h-2 w-2 rounded-full', DOT[s.them.who as Actor])} />
                  <span className={cn('h-2 w-2 rounded-full', DOT[s.us.who as Actor])} />
                </span>
              </button>
            </li>
          ))}
        </ol>

        {/* The step, both ways. */}
        <div className="flex min-w-0 flex-col bg-surface/50 px-5 py-8 sm:px-10 lg:px-12 lg:py-10" aria-live="polite">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Step {active + 1} of {WALK.steps.length}
          </p>
          <h3 className="mt-1.5 text-[1.45rem] font-semibold tracking-[-0.02em] text-ink">{step.title}</h3>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Card name="Redditor AI" who={step.them.who as Actor} text={step.them.text} />
            <Card name="Reddix" who={step.us.who as Actor} text={step.us.text} />
          </div>

          <dl className={cn('mt-8 grid grid-cols-3 gap-3 border-t pt-6 text-center', LINE)}>
            <Stat value={`${tally.usYou} of ${tally.total}`} label="steps you take with Reddix" strong />
            <Stat value={`${tally.themYou} of ${tally.total}`} label="steps you take with Redditor AI" />
            <Stat value={`${tally.themOther} of ${tally.total}`} label="steps the vendor does for you" />
          </dl>
        </div>
      </Band>
    </section>
  );
}

function Card({ name, who, text }: { name: string; who: Actor; text: string }) {
  return (
    <div className="flex flex-col rounded-xl border border-ink/[0.08] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[0.85rem] font-semibold text-ink">{name}</span>
        <span className={cn('inline-flex h-6 items-center rounded-md px-2 text-[0.7rem] font-semibold', ACTOR_CHIP[who])}>{ACTOR_LABEL[who]}</span>
      </div>
      <p className="mt-3 text-[0.9rem] leading-relaxed text-ink/80">{text}</p>
    </div>
  );
}

function Stat({ value, label, strong = false }: { value: string; label: string; strong?: boolean }) {
  return (
    <div className="flex flex-col-reverse">
      <dt className="mt-1 text-[0.72rem] leading-snug text-muted-foreground">{label}</dt>
      <dd className={cn('text-[1.35rem] font-semibold tabular-nums tracking-[-0.02em]', strong ? 'text-cta' : 'text-ink')}>{value}</dd>
    </div>
  );
}
