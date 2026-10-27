import { MessageSquareWarning } from 'lucide-react';
import { Band, LINE, Pill } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { DMS } from '../content';

/* The vendor's description and Reddit's policy, set side by side as two
   plain lists, so the reader compares them without a verdict from us. */
export function Dms() {
  return (
    <section aria-labelledby="dms-title">
      <Band inner="px-6 pb-8 pt-12 text-center sm:px-10">
        <Pill icon={MessageSquareWarning}>{DMS.pill}</Pill>
        <h2 id="dms-title" className="mx-auto mt-5 max-w-2xl text-balance text-[1.8rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.2rem]">
          {DMS.title}
        </h2>
      </Band>
      <Band inner="grid md:grid-cols-2">
        {[DMS.vendor, DMS.reddit].map((col, i) => (
          <div key={col.label} className={cn('px-6 py-8 sm:px-10 lg:px-12', i === 1 && cn('border-t bg-surface/60 md:border-l md:border-t-0', LINE))}>
            <h3 className="text-[0.8rem] font-semibold uppercase tracking-[0.07em] text-muted-foreground">{col.label}</h3>
            <ul className="mt-4 space-y-3">
              {col.points.map((p) => (
                <li key={p} className="flex gap-3 text-[0.93rem] leading-relaxed text-ink/85">
                  <span aria-hidden className={cn('mt-2 h-1.5 w-1.5 shrink-0 rounded-full', i === 1 ? 'bg-cta' : 'bg-ink/30')} />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Band>
      <Band inner="px-6 py-6 sm:px-10 lg:px-12">
        <p className="mx-auto max-w-3xl text-center text-[0.92rem] leading-relaxed text-ink/75">{DMS.close}</p>
      </Band>
    </section>
  );
}
