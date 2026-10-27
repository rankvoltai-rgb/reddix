import { FileText, ScanText, UserRound } from 'lucide-react';
import { Band, LINE, Pill, SECTION_TITLE } from '@/components/landing/frame';
import { Reveal } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { INPUTS } from '../content';

/* A spec sheet: the two sources side by side, every field the AI sees, then
   what it notes about the writer while it reads. */
export function Inputs() {
  return (
    <section aria-labelledby="inputs-title">
      <Band inner="grid gap-6 px-6 py-12 sm:px-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:px-12">
        <div>
          <Pill icon={ScanText}>{INPUTS.pill}</Pill>
          <h2 id="inputs-title" className={cn('mt-5', SECTION_TITLE)}>
            {INPUTS.title}
          </h2>
        </div>
        <p className="text-[0.98rem] leading-relaxed text-muted-foreground lg:pb-1.5">{INPUTS.body}</p>
      </Band>

      <Band inner="grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        {[
          { icon: FileText, ...INPUTS.post },
          { icon: UserRound, ...INPUTS.profile },
        ].map((col, i) => (
          <div key={col.title} className={cn('min-w-0', i === 1 && cn('border-t lg:border-l lg:border-t-0', LINE))}>
            <h3 className={cn('flex items-center gap-2.5 border-b px-6 py-4 text-[0.95rem] font-semibold text-ink sm:px-10 lg:px-12', LINE)}>
              <col.icon className="h-4 w-4 text-cta" />
              {col.title}
            </h3>
            <dl className="divide-y divide-ink/[0.07]">
              {col.rows.map((r, j) => (
                <Reveal key={r.name} delay={j * 0.04} y={8} className="grid gap-1 px-6 py-3.5 sm:grid-cols-[minmax(7rem,0.55fr)_minmax(0,1fr)] sm:gap-4 sm:px-10 lg:px-12">
                  <dt className="text-[0.86rem] font-semibold text-ink">{r.name}</dt>
                  <dd className="text-[0.86rem] leading-relaxed text-muted-foreground">{r.value}</dd>
                </Reveal>
              ))}
            </dl>
          </div>
        ))}
      </Band>

      <Band inner="bg-surface/70 px-6 py-7 sm:px-10 lg:px-12">
        <h3 className="text-[0.86rem] font-semibold text-ink">{INPUTS.readsTitle}</h3>
        <ul className="mt-3 flex flex-wrap gap-2">
          {INPUTS.reads.map((r) => (
            <li key={r} className="rounded-lg border border-ink/[0.08] bg-white px-2.5 py-1.5 text-[0.8rem] text-ink/80">
              {r}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[0.8rem] text-muted-foreground">{INPUTS.profileNote}</p>
      </Band>
    </section>
  );
}
