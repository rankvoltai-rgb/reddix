import { useState } from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { Band, LINE, SectionHead } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { MAPPING, type Verdict } from '../content';

const CHIP: Record<Verdict, string> = {
  covered: 'bg-cta text-white',
  partly: 'bg-cta-soft text-cta-deep',
  not: 'bg-ink/[0.06] text-ink/60',
};

type Filter = 'all' | Verdict;

/* Each GummySearch feature on the left, Reddix's answer on the right, the
   verdict between them. Filter to see only what's lost. */
export function Mapping() {
  const [filter, setFilter] = useState<Filter>('all');
  const rows = MAPPING.rows.filter((r) => filter === 'all' || r.verdict === filter);
  const count = (v: Verdict) => MAPPING.rows.filter((r) => r.verdict === v).length;
  const filters: { key: Filter; label: string; n: number }[] = [
    { key: 'all', label: 'All', n: MAPPING.rows.length },
    { key: 'covered', label: MAPPING.legend.covered, n: count('covered') },
    { key: 'partly', label: MAPPING.legend.partly, n: count('partly') },
    { key: 'not', label: MAPPING.legend.not, n: count('not') },
  ];

  return (
    <section aria-labelledby="mapping-title">
      <SectionHead icon={ArrowRightLeft} eyebrow={MAPPING.pill} title={<span id="mapping-title">{MAPPING.title}</span>} subtitle={MAPPING.body}>
        <div role="group" aria-label="Filter features" className="mt-7 flex flex-wrap justify-center gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              aria-pressed={filter === f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                'inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 text-[0.8rem] font-medium transition-colors',
                filter === f.key ? 'border-ink bg-ink text-white' : 'border-ink/[0.1] bg-white text-ink/70 hover:border-ink/[0.2] hover:text-ink',
              )}
            >
              {f.label}
              <span className={cn('tabular-nums', filter === f.key ? 'text-white/60' : 'text-muted-foreground')}>{f.n}</span>
            </button>
          ))}
        </div>
      </SectionHead>
      <Band>
        <div className={cn('hidden grid-cols-[minmax(0,1fr)_8.5rem_minmax(0,1fr)] border-b bg-surface/70 px-10 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground md:grid lg:px-12', LINE)}>
          <span>In GummySearch</span>
          <span className="text-center">In Reddix</span>
          <span>How Reddix handles it</span>
        </div>
        <ul className="divide-y divide-ink/[0.07]">
          {rows.map((r) => (
            <li key={r.gummy} className="grid gap-3 px-6 py-6 sm:px-10 md:grid-cols-[minmax(0,1fr)_8.5rem_minmax(0,1fr)] md:items-start md:gap-6 lg:px-12">
              <div>
                <h3 className="text-[1rem] font-semibold text-ink">{r.gummy}</h3>
                <p className="mt-1 text-[0.88rem] leading-relaxed text-muted-foreground">{r.what}</p>
              </div>
              <div className="md:flex md:justify-center">
                <span className={cn('inline-flex h-6 items-center rounded-md px-2 text-[0.72rem] font-semibold', CHIP[r.verdict])}>{MAPPING.legend[r.verdict]}</span>
              </div>
              <p className="text-[0.9rem] leading-relaxed text-ink/85">{r.reddix}</p>
            </li>
          ))}
        </ul>
      </Band>
    </section>
  );
}
