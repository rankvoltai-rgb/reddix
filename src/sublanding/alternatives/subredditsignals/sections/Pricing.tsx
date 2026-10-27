import { AlertTriangle, Wallet } from 'lucide-react';
import { Band, LINE, SectionHead } from '@/components/landing/frame';
import { Reveal } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { CHECKED, NAME, PRICING } from '../content';

const usd = (n: number) => `$${n.toLocaleString('en-US')}`;

/* One row per plan: name, list price, and a bar for the year's cost. The
   managed service runs off the scale, so it gets a note instead of a bar. */
export function Pricing() {
  const scale = Math.max(...PRICING.rows.filter((r) => r.year < 5000).map((r) => r.year));
  return (
    <section aria-labelledby="pricing-title">
      <SectionHead icon={Wallet} eyebrow={PRICING.pill} title={<span id="pricing-title">{PRICING.title}</span>} subtitle={PRICING.body} />
      <Band>
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">
            Plans and yearly cost, {NAME} and Reddix. {CHECKED}.
          </caption>
          <thead className="hidden sm:table-header-group">
            <tr className={cn('border-b text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground', LINE)}>
              <th scope="col" className="px-6 py-3 font-semibold sm:px-10">Plan</th>
              <th scope="col" className="px-4 py-3 font-semibold">List price</th>
              <th scope="col" className="w-[40%] px-4 py-3 font-semibold">One year</th>
              <th scope="col" className="hidden px-6 py-3 font-semibold lg:table-cell">What you get</th>
            </tr>
          </thead>
          <tbody>
            {PRICING.rows.map((r, i) => {
              const off = r.year > scale;
              const first = i === 0 || PRICING.rows[i - 1].who !== r.who;
              return (
                <tr
                  key={r.plan + r.who}
                  className={cn('grid grid-cols-2 border-b sm:table-row', LINE, r.who === 'reddix' && 'bg-surface/60', first && i > 0 && 'border-t-2 border-t-ink/10')}
                >
                  <th scope="row" className="col-span-2 px-6 pb-1 pt-4 text-[0.92rem] font-semibold text-ink sm:px-10 sm:py-4">
                    <span className={cn('mr-2 text-[0.7rem] font-semibold uppercase tracking-[0.06em]', r.who === 'reddix' ? 'text-cta' : 'text-ink/45')}>
                      {r.who === 'reddix' ? 'Reddix' : NAME}
                    </span>
                    <span className="block sm:inline">{r.plan}</span>
                  </th>
                  <td className="px-6 pb-4 text-[0.88rem] tabular-nums text-ink/80 sm:px-4 sm:py-4">{r.price}</td>
                  <td className="px-6 pb-4 sm:px-4 sm:py-4">
                    {off ? (
                      <span className="text-[0.82rem] tabular-nums text-ink/70">From {usd(r.year)} a year, off this scale</span>
                    ) : (
                      <span className="flex items-center gap-3">
                        <span aria-hidden className="hidden h-2 flex-1 rounded-full bg-ink/[0.05] sm:block">
                          <Reveal className="h-full" y={0}>
                            <span
                              className={cn('block h-full rounded-full', r.who === 'reddix' ? 'bg-cta' : 'bg-ink/40')}
                              style={{ width: `${(r.year / scale) * 100}%` }}
                            />
                          </Reveal>
                        </span>
                        <span className="w-[5.5rem] shrink-0 text-[0.88rem] font-semibold tabular-nums text-ink sm:text-right">
                          {usd(r.year)}
                          <span className="block text-[0.7rem] font-normal text-muted-foreground">{r.yearNote}</span>
                        </span>
                      </span>
                    )}
                  </td>
                  <td className="col-span-2 px-6 pb-4 text-[0.8rem] text-muted-foreground sm:hidden lg:table-cell lg:py-4">{r.limits}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Band>
      <Band inner="grid lg:grid-cols-2">
        <ul className={cn('space-y-3 border-b px-6 py-7 text-[0.88rem] leading-relaxed sm:px-10 lg:border-b-0 lg:border-r lg:px-12', LINE)}>
          {PRICING.trials.map((t) => (
            <li key={t.who}>
              <span className="font-semibold text-ink">{t.who}:</span> <span className="text-ink/75">{t.text}</span>
            </li>
          ))}
          <li className="pt-1 text-[0.75rem] text-muted-foreground">{CHECKED}.</li>
        </ul>
        <div className="flex gap-3 px-6 py-7 sm:px-10 lg:px-12">
          <AlertTriangle aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-cta" />
          <div>
            <p className="text-[0.92rem] font-semibold text-ink">{PRICING.caveatTitle}</p>
            <p className="mt-1.5 text-[0.86rem] leading-relaxed text-muted-foreground">{PRICING.caveat}</p>
          </div>
        </div>
      </Band>
    </section>
  );
}
