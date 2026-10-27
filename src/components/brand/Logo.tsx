/**
 * The Reddix mark: a white half-disc on the brand red, drawn as a vector so
 * it stays crisp at every size. Geometry is measured from the master file
 * (src/assets/logo.png): the flat edge sits at 42.45% of the height, the disc
 * spans 17.5%–82.5% of the width and reaches 75.5% down.
 *
 * The mark's red (#FF3130) is also the site's --cta red.
 */
import { cn } from '@/lib/utils';

export const LOGO_RED = '#FF3130';

export function LogoMark({
  className,
  inverted = false,
  title,
}: {
  className?: string;
  /** White tile with a red half-disc, for red backgrounds. */
  inverted?: boolean;
  /** Give the mark a name when it stands alone as a link's only content. */
  title?: string;
}) {
  const field = inverted ? '#fff' : LOGO_RED;
  const disc = inverted ? LOGO_RED : '#fff';
  return (
    <svg viewBox="0 0 100 100" className={cn('shrink-0', className)} role={title ? 'img' : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      <rect width="100" height="100" rx="24" fill={field} />
      <path d="M17.5 42.45 A32.5 33.05 0 0 0 82.5 42.45 Z" fill={disc} />
    </svg>
  );
}

/** The mark beside the wordmark, as the navbar and auth pages show it. */
export function Logo({ className, markClassName, inverted = false }: { className?: string; markClassName?: string; inverted?: boolean }) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <LogoMark className={cn('h-7 w-7', markClassName)} inverted={inverted} />
      <span className={cn('text-[1.2rem] font-semibold tracking-tight', inverted ? 'text-white' : 'text-ink')}>Reddix</span>
    </span>
  );
}
