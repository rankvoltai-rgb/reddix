import { ListChecks } from 'lucide-react';
import { Band, LINE, Pill, SECTION_TITLE } from '@/components/landing/frame';
import { Reveal } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { LIST } from '../content';

/* Three moments on a timeline rule: when the list gets built and changed. */
export function YourList() {
  return (
    <section aria-labelledby="list-title">
      <Band inner="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)]">
        <div className={cn('border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14', LINE)}>
          <Pill icon={ListChecks}>{LIST.pill}</Pill>
          <h2 id="list-title" className={cn('mt-5', SECTION_TITLE)}>
            {LIST.title}
          </h2>
        </div>
        <ol className="relative grid sm:grid-cols-3">
          {LIST.moments.map((m, i) => (
            <li key={m.when} className={cn('relative min-w-0 px-6 pb-10 pt-12 sm:px-7 lg:pt-14', i > 0 && 'border-t sm:border-l sm:border-t-0', LINE)}>
              {/* The rule runs across all three, with a dot where each moment sits. */}
              <span aria-hidden className="absolute left-0 right-0 top-6 h-px bg-ink/[0.1] lg:top-8" />
              <span aria-hidden className={cn('absolute left-6 top-[1.2rem] h-3 w-3 rounded-full border-2 border-white sm:left-7 lg:top-[1.7rem]', i === 0 ? 'bg-cta' : 'bg-ink/30')} />
              <Reveal delay={i * 0.08} y={10}>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.07em] text-cta">{m.when}</p>
                <h3 className="mt-2 text-[1.1rem] font-semibold tracking-[-0.015em] text-ink">{m.title}</h3>
                <p className="mt-2 text-[0.88rem] leading-relaxed text-muted-foreground">{m.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Band>
    </section>
  );
}
