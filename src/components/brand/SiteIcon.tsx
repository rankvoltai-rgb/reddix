import { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * The favicon of whatever site is typed into a website field, in place of the
 * globe. It waits for typing to pause, then tries the site's own standard
 * icon paths, and keeps the globe if none of them loads.
 */

/** "https://www.Acme.io/pricing" → "www.acme.io"; null until it looks like a domain. */
export function hostFrom(value: string): string | null {
  const bare = value
    .trim()
    .toLowerCase()
    .replace(/^[a-z][a-z0-9+.-]*:\/\//, '')
    .replace(/^[^@/]*@/, '')
    .split(/[/?#]/)[0]
    .replace(/:\d+$/, '')
    .replace(/\.$/, '');
  return /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/.test(bare) ? bare : null;
}

/** Found icons by host, so a site is only looked up once per visit. */
const found = new Map<string, string | null>();

function load(src: string): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.referrerPolicy = 'no-referrer';
    img.onload = () => resolve(img.naturalWidth > 1 ? src : null);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

async function lookup(host: string): Promise<string | null> {
  if (found.has(host)) return found.get(host) ?? null;
  // The site's own standard icon paths only: an icon service would answer a
  // made-up domain with a placeholder, and would learn what people type.
  const candidates = ['favicon.ico', 'favicon.svg', 'favicon.png', 'apple-touch-icon.png'].map((f) => `https://${host}/${f}`);
  let src: string | null = null;
  for (const c of candidates) {
    src = await load(c);
    if (src) break;
  }
  found.set(host, src);
  return src;
}

/** The loaded favicon URL for a typed website, or null. */
export function useFavicon(value: string, wait = 450): string | null {
  const host = hostFrom(value);
  const [icon, setIcon] = useState<{ host: string; src: string } | null>(null);

  useEffect(() => {
    if (!host) return;
    let live = true;
    const t = window.setTimeout(() => {
      void lookup(host).then((src) => {
        if (live) setIcon(src ? { host, src } : null);
      });
    }, found.has(host) ? 0 : wait);
    return () => {
      live = false;
      window.clearTimeout(t);
    };
  }, [host, wait]);

  // Only the current host's icon: a stale one never shows for a new address.
  return icon && icon.host === host ? icon.src : null;
}

/** The globe, swapped for the site's favicon once one loads. */
export function SiteIcon({ value, className, globeClassName }: { value: string; className?: string; globeClassName?: string }) {
  const src = useFavicon(value);
  return (
    <span aria-hidden className={cn('relative grid h-4 w-4 shrink-0 place-items-center', className)}>
      <Globe
        className={cn(
          'col-start-1 row-start-1 h-full w-full text-muted-foreground transition-[opacity,transform] duration-200',
          src ? 'scale-75 opacity-0' : 'opacity-100',
          globeClassName,
        )}
      />
      {src && (
        <img
          key={src}
          src={src}
          alt=""
          referrerPolicy="no-referrer"
          className="col-start-1 row-start-1 h-full w-full rounded-[3px] object-contain motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-75 motion-safe:duration-200"
        />
      )}
    </span>
  );
}
