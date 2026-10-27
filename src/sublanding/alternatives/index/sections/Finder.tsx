import { useId, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ListFilter } from 'lucide-react';
import { Band, LINE as RULE, Pill, SECTION_TITLE } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { FINDER } from '../content';
import { REDDIX_ROW, STOPS } from '../directory';
import { shortlist, type Answers } from '../finder';

const STOP_NAME = Object.fromEntries(STOPS.map((s) => [s.id, s.name]));

/* Three questions; the list is filtered live from the directory's data. */
export function Finder() {
  const [answers, setAnswers] = useState<Answers>({ reach: 'reddit', hands: 'me', budget: 'any' });
  const { tools, reddix } = useMemo(() => shortlist(answers), [answers]);
  const count = tools.length + (reddix ? 1 : 0);

  return (
    <section id="finder" aria-labelledby="finder-title" className="scroll-mt-16">
      <Band inner="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className={cn('border-b px-6 py-12 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14', RULE)}>
          <Pill icon={ListFilter}>{FINDER.pill}</Pill>
          <h2 id="finder-title" className={cn('mt-5', SECTION_TITLE)}>
            {FINDER.title}
          </h2>
          <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">{FINDER.body}</p>
          <div className="mt-8 space-y-6">
            {(Object.keys(FINDER.questions) as (keyof Answers)[]).map((key) => (
              <Question
                key={key}
                label={FINDER.questions[key].label}
                options={FINDER.questions[key].options}
                value={answers[key]}
                onChange={(v) => setAnswers((a) => ({ ...a, [key]: v }) as Answers)}
              />
            ))}
          </div>
        </div>

        <div className="min-w-0 bg-surface/60 px-5 py-10 sm:px-10 lg:px-12 lg:py-14">
          <p aria-live="polite" className="text-[0.8rem] font-semibold text-ink">
            {count === 0 ? 'No matches' : `${count} ${count === 1 ? 'match' : 'matches'}`}
          </p>
          {count === 0 ? (
            <p className="mt-3 rounded-xl border border-dashed border-ink/[0.14] bg-white p-5 text-[0.9rem] text-muted-foreground">{FINDER.empty}</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {reddix && (
                <li className="rounded-xl border border-cta/30 bg-white p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-[0.95rem] font-semibold text-ink">Reddix</span>
                    <span className="text-[0.75rem] font-medium text-cta">{REDDIX_ROW.price}</span>
                  </div>
                  <p className="mt-1 text-[0.84rem] leading-relaxed text-muted-foreground">{REDDIX_ROW.what}</p>
                </li>
              )}
              {tools.map((t) => (
                <li key={t.slug}>
                  <Link
                    to={`/alternatives/${t.slug}`}
                    className="group block rounded-xl border border-ink/[0.08] bg-white p-4 transition-colors hover:border-ink/[0.18]"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="flex items-center gap-1.5 text-[0.95rem] font-semibold text-ink">
                        {t.name}
                        <ArrowRight className="h-3.5 w-3.5 text-ink/30 transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-cta" />
                      </span>
                      <span className="text-[0.72rem] font-medium text-muted-foreground">{STOP_NAME[t.stop]}</span>
                    </div>
                    <p className="mt-1 text-[0.84rem] leading-relaxed text-muted-foreground">{t.what}</p>
                    <p className="mt-2 text-[0.75rem] font-medium text-ink/70">{t.price}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Band>
    </section>
  );
}

function Question<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  const id = useId();
  return (
    <fieldset>
      <legend id={id} className="text-[0.82rem] font-semibold text-ink">
        {label}
      </legend>
      <div role="radiogroup" aria-labelledby={id} className="mt-2.5 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={value === o.id}
            onClick={() => onChange(o.id)}
            className={cn(
              'h-9 rounded-lg border px-3.5 text-[0.84rem] font-medium transition-colors',
              value === o.id ? 'border-cta/40 bg-cta-soft text-cta-deep' : 'border-ink/[0.1] bg-white text-ink/75 hover:border-ink/[0.2] hover:text-ink',
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
