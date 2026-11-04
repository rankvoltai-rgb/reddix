/**
 * A roundup's price chart: one bar per tool, Reddix in the brand colour and the
 * tool the post is about as the darker reference bar.
 */
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/blog/posts';
import { formatPrice, priceChartSlug, type PriceChartData } from '@/lib/blog/price-chart';

export { priceChartSlug };

const CHARTS = import.meta.glob<PriceChartData>('/src/content/price-charts/*.json', { eager: true, import: 'default' });

export function PriceChart({ slug, alt }: { slug: string; alt: string }) {
  const chart = CHARTS[`/src/content/price-charts/${slug}.json`];
  if (!chart) return null;
  const max = Math.max(...chart.bars.map((b) => b.value), 1);
  return (
    <div role="img" aria-label={alt} className="rounded-xl border border-ink/[0.08] bg-white p-4 sm:p-5">
      <p className="text-[0.92rem] font-semibold text-ink">{chart.title}</p>
      <p className="mt-0.5 text-[0.78rem] text-muted-foreground">{chart.subtitle}</p>
      <div className="mt-5 space-y-3.5">
        {chart.bars.map((b) => (
          <div key={b.name} className="grid grid-cols-[7.75rem_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[8.5rem_minmax(0,1fr)]">
            <div className="min-w-0">
              <p className={cn('text-[0.78rem] font-semibold leading-tight', b.reddix ? 'text-cta' : 'text-ink')}>{b.name}</p>
              <p className="mt-0.5 line-clamp-2 text-[0.68rem] leading-tight text-muted-foreground">{b.note}</p>
            </div>
            <div className="flex items-center gap-2 border-l border-ink/15">
              <span
                className={cn('block h-4 rounded-r', b.reddix ? 'bg-cta' : b.reference ? 'bg-ink/45' : 'bg-ink/15')}
                style={{ width: `${Math.max(2, (b.value / max) * 76)}%` }}
              />
              <span className="shrink-0 text-[0.78rem] font-bold tabular-nums text-ink">{formatPrice(b.value)}</span>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[0.68rem] text-muted-foreground">
        List prices billed monthly, from each vendor's own page on {formatDate(chart.checkedOn)}.
      </p>
    </div>
  );
}
