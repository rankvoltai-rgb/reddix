/**
 * The numbers behind a roundup's price chart, placed in a post with
 * `![alt](figure:price-chart/<post-slug> "caption")`. Each chart is a JSON file
 * in src/content/price-charts named after its post. Every bar is a published
 * list price from the vendor's own page on `checkedOn`, and the post's own
 * table says the same thing. Pure: the app and the build scripts both use it.
 */
export interface PriceBar {
  name: string;
  /** List price in USD a month, billed monthly. 0 reads as "Free". */
  value: number;
  /** What that price buys, in a few words. */
  note: string;
  /** Reddix, drawn in the brand colour. */
  reddix?: boolean;
  /** The tool the post is about, drawn as the reference bar. */
  reference?: boolean;
}

export interface PriceChartData {
  title: string;
  subtitle: string;
  /** YYYY-MM-DD */
  checkedOn: string;
  bars: PriceBar[];
}

const FIGURE = /^figure:price-chart\/([a-z0-9-]+)$/;

/** "figure:price-chart/x" -> "x"; anything else -> null. */
export function priceChartSlug(url: string | undefined): string | null {
  return FIGURE.exec(url ?? '')?.[1] ?? null;
}

export function formatPrice(value: number): string {
  if (value === 0) return 'Free';
  return `$${Number.isInteger(value) ? value : value.toFixed(2)}`;
}
