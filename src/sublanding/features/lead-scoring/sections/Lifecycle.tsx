import { Archive, GitBranch } from 'lucide-react';
import { Band, LINE, SectionHead } from '@/components/landing/frame';
import { Reveal } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { LIFECYCLE } from '../content';

/* A rail from New to Converted, with Archived branching off below it. */
export function Lifecycle() {
  return (
    <section aria-labelledby="lifecycle-title">
      <SectionHead icon={GitBranch} eyebrow={LIFECYCLE.pill} title={<span id="lifecycle-title">{LIFECYCLE.title}</span>} subtitle={LIFECYCLE.body} />
      <Band inner="px-5 py-10 sm:px-10 lg:px-12 lg:py-14">
        <ol className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {/* The rail, behind the dots on wide screens. */}
          <span aria-hidden className="absolute left-[0.6875rem] right-0 top-[0.6875rem] hidden h-px bg-ink/[0.12] lg:block" />
          {LIFECYCLE.steps.map((s, i) => (
            <li key={s.status} className="relative">
              <Reveal delay={i * 0.07}>
                <span
                  aria-hidden
                  className={cn(
                    'relative z-10 flex h-[1.375rem] w-[1.375rem] items-center justify-center rounded-full border-2 bg-white',
                    i === LIFECYCLE.steps.length - 1 ? 'border-cta bg-cta' : 'border-cta',
                  )}
                >
                  <span className={cn('h-1.5 w-1.5 rounded-full', i === LIFECYCLE.steps.length - 1 ? 'bg-white' : 'bg-cta')} />
                </span>
                <h3 className="mt-4 text-[1.1rem] font-semibold tracking-[-0.015em] text-ink">{s.status}</h3>
                <p className="mt-1 text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-cta">{s.who}</p>
                <p className="mt-2 text-[0.88rem] leading-relaxed text-muted-foreground">{s.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal delay={0.2} className={cn('mt-10 flex gap-4 border-t border-dashed pt-8 lg:ml-[25%]', LINE)}>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-ink/[0.1] bg-surface text-ink/50">
            <Archive className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-[1.02rem] font-semibold text-ink">
              {LIFECYCLE.archived.status}
              <span className="ml-2 text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground">{LIFECYCLE.archived.who}</span>
            </h3>
            <p className="mt-1.5 max-w-xl text-[0.88rem] leading-relaxed text-muted-foreground">{LIFECYCLE.archived.body}</p>
          </div>
        </Reveal>
      </Band>
    </section>
  );
}
