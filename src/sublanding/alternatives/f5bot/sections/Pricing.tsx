import { Band, LINE, SECTION_TITLE } from '@/components/landing/frame';
import { cn } from '@/lib/utils';
import { CHECKED_LABEL, REDDIX } from '../../reddix';
import { F5_TIERS, PRICING } from '../content';

/* F5Bot's ladder with a rule across it where business use begins, and
   Reddix's plans beside it. */
export function Pricing() {
  const firstBusiness = F5_TIERS.findIndex((t) => t.business);
  return (
    <section aria-labelledby="pricing-title">
      <Band inner="grid lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="min-w-0 px-5 py-10 sm:px-10 lg:py-14 lg:pl-12">
          <h2 id="pricing-title" className={SECTION_TITLE}>
            {PRICING.title}
          </h2>
          <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-muted-foreground">{PRICING.body}</p>

          <ol className="mt-8 overflow-hidden rounded-xl border border-ink/[0.08]">
            {F5_TIERS.map((t, i) => (
              <li key={t.name}>
                {i === firstBusiness && (
                  <p className="flex items-center gap-2 border-y border-cta/30 bg-cta-soft px-4 py-1.5 text-[0.72rem] font-semibold text-cta-deep">
                    Business and client use starts here
                  </p>
                )}
                <div
                  className={cn(
                    'grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-4 gap-y-1 px-4 py-3.5 sm:grid-cols-[6.5rem_7rem_minmax(0,1fr)]',
                    i > 0 && i !== firstBusiness && 'border-t border-ink/[0.07]',
                    !t.business && 'bg-surface/60',
                  )}
                >
                  <span className="text-[0.9rem] font-semibold text-ink">{t.name}</span>
                  <span className="text-[0.9rem] font-semibold tabular-nums text-ink sm:order-none">{t.price}</span>
                  <span className="col-span-2 text-[0.8rem] leading-relaxed text-muted-foreground sm:col-span-1">
                    {t.keywords} keywords · {t.alerts} · {t.delay} · <span className={cn(!t.business && 'font-medium text-ink/75')}>{t.use}</span>
                  </span>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-[0.75rem] leading-relaxed text-muted-foreground">
            {PRICING.f5Note} F5Bot prices from f5bot.com/tiers, checked {CHECKED_LABEL}.
          </p>
        </div>

        <aside className={cn('border-t bg-surface/70 px-5 py-10 sm:px-10 lg:border-l lg:border-t-0 lg:py-14', LINE)}>
          <h3 className="text-[1.05rem] font-semibold text-ink">{PRICING.reddixTitle}</h3>
          <ul className="mt-5 space-y-3">
            <li className="rounded-xl border border-ink/[0.08] bg-white p-4">
              <p className="text-[0.8rem] font-semibold text-muted-foreground">Premium</p>
              <p className="mt-1 text-[1.6rem] font-semibold tracking-[-0.03em] text-ink">
                ${REDDIX.pricing.premium.price}
                <span className="text-[0.85rem] font-medium text-muted-foreground">/month</span>
              </p>
            </li>
            <li className="rounded-xl border border-ink/[0.08] bg-white p-4">
              <p className="text-[0.8rem] font-semibold text-muted-foreground">Lifetime</p>
              <p className="mt-1 text-[1.6rem] font-semibold tracking-[-0.03em] text-ink">
                ${REDDIX.pricing.lifetime.price}
                <span className="text-[0.85rem] font-medium text-muted-foreground"> once</span>
              </p>
            </li>
            <li className="rounded-xl border border-dashed border-ink/[0.12] p-4">
              <p className="text-[0.8rem] font-semibold text-muted-foreground">Enterprise</p>
              <p className="mt-1 text-[0.9rem] text-ink">{REDDIX.pricing.enterprise.note}</p>
            </li>
          </ul>
          <p className="mt-4 text-[0.8rem] leading-relaxed text-muted-foreground">{PRICING.reddixNote}</p>
        </aside>
      </Band>
    </section>
  );
}
