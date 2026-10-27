import { useId, useState } from 'react';
import { Check, CircleOff, Minus, Network, PencilLine } from 'lucide-react';
import { Band, LINE, Pill, SECTION_TITLE } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { MAP, USES, type Field } from '../content';

/* Fields down the side, the parts of Reddix that read them across the top.
   Picking a field opens what each part does with it, and what changes when
   it's empty. */
export function FieldMap() {
  const [selected, setSelected] = useState(MAP.fields[5].id);
  const field = MAP.fields.find((f) => f.id === selected) ?? MAP.fields[0];
  const panelId = useId();

  return (
    <section aria-labelledby="map-title">
      <Band inner="grid gap-6 px-6 py-12 sm:px-10 sm:py-14 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-end lg:px-12">
        <div>
          <Pill icon={Network}>{MAP.pill}</Pill>
          <h2 id="map-title" className={cn('mt-5', SECTION_TITLE)}>
            {MAP.title}
          </h2>
        </div>
        <p className="text-[0.98rem] leading-relaxed text-muted-foreground lg:pb-1.5">{MAP.body}</p>
      </Band>

      <Band inner="grid lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        {/* ---------- the matrix ---------- */}
        <div className="min-w-0">
          <div className={cn('hidden grid-cols-[minmax(0,1fr)_repeat(4,4.5rem)] items-end gap-2 border-b px-6 pb-3 pt-5 sm:grid sm:px-10 lg:px-12', LINE)}>
            <span className="text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Field</span>
            {USES.map((u) => (
              <span key={u.id} className="text-center text-[0.7rem] font-semibold leading-tight text-muted-foreground">
                {u.short}
              </span>
            ))}
          </div>
          <ul aria-label="Profile fields" className="divide-y divide-ink/[0.07]">
            {MAP.fields.map((f) => {
              const on = f.id === selected;
              return (
                <li key={f.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(f.id)}
                    aria-pressed={on}
                    aria-controls={panelId}
                    className={cn(
                      'grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-6 py-3.5 text-left transition-colors sm:grid-cols-[minmax(0,1fr)_repeat(4,4.5rem)] sm:px-10 lg:px-12',
                      on ? 'bg-cta-soft/70' : 'hover:bg-surface/70',
                    )}
                  >
                    <span className="min-w-0">
                      <span className={cn('block truncate text-[0.92rem] font-semibold', on ? 'text-cta-deep' : 'text-ink')}>{f.name}</span>
                      <span className="block truncate text-[0.75rem] text-muted-foreground">{f.source}</span>
                    </span>
                    {/* Phones: the four dots in a row. Wider: one per column. */}
                    <span className="sr-only">Used by {usedBy(f) || 'nothing yet'}</span>
                    <span aria-hidden className="flex gap-1.5 sm:contents">
                      {USES.map((u) => (
                        <span key={u.id} className="flex justify-center">
                          <span
                            className={cn(
                              'h-2.5 w-2.5 rounded-full sm:h-3 sm:w-3',
                              f.uses[u.id] ? (on ? 'bg-cta' : 'bg-ink/70') : 'border border-ink/[0.18] bg-transparent',
                            )}
                          />
                        </span>
                      ))}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className={cn('border-t px-6 py-3.5 text-[0.75rem] text-muted-foreground sm:px-10 lg:px-12', LINE)}>
            <span className="sm:hidden">Dots: {USES.map((u) => u.short).join(', ')}. </span>
            {MAP.note}
          </p>
        </div>

        {/* ---------- the selected field ---------- */}
        <div id={panelId} aria-live="polite" className={cn('min-w-0 border-t bg-surface/70 px-6 py-8 sm:px-10 lg:border-l lg:border-t-0 lg:px-10', LINE)}>
          <div className="lg:sticky lg:top-24">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[1.3rem] font-semibold tracking-[-0.02em] text-ink">{field.name}</h3>
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[0.7rem] font-semibold',
                  field.editable ? 'bg-white text-ink ring-1 ring-inset ring-ink/[0.1]' : 'bg-ink/[0.05] text-ink/55',
                )}
              >
                <PencilLine className="h-3 w-3" />
                {field.editable ? 'Editable in Settings' : 'Set by the analysis'}
              </span>
            </div>
            <p className="mt-1.5 text-[0.82rem] text-muted-foreground">
              {field.source} · {field.shape}
            </p>

            <ul className="mt-6 space-y-3">
              {USES.map((u) => {
                const text = field.uses[u.id];
                return (
                  <li key={u.id} className={cn('rounded-lg border bg-white p-3.5', text ? 'border-ink/[0.08]' : 'border-dashed border-ink/[0.1]')}>
                    <p className={cn('flex items-center gap-1.5 text-[0.78rem] font-semibold', text ? 'text-ink' : 'text-ink/40')}>
                      {text ? <Check className="h-3.5 w-3.5 text-cta" /> : <Minus className="h-3.5 w-3.5" />}
                      {u.label}
                    </p>
                    {text && <p className="mt-1 text-[0.84rem] leading-relaxed text-ink/75">{text}</p>}
                  </li>
                );
              })}
            </ul>

            <div className="mt-5 flex gap-3 rounded-lg border border-cta/20 bg-white p-3.5">
              <CircleOff className="mt-0.5 h-4 w-4 shrink-0 text-cta" />
              <p className="text-[0.84rem] leading-relaxed text-ink/80">
                <span className="font-semibold text-ink">If it’s empty: </span>
                {field.ifEmpty}
              </p>
            </div>
          </div>
        </div>
      </Band>
    </section>
  );
}

function usedBy(f: Field): string {
  return USES.filter((u) => f.uses[u.id])
    .map((u) => u.label.toLowerCase())
    .join(', ');
}
