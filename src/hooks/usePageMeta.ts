import { useEffect } from 'react';
import { useCanonical } from './useCanonical';

interface PageMetaOptions {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  image?: string;
}

function upsertMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * Sets unique <title>, meta description, canonical URL, and Open Graph /
 * Twitter card tags for a route. Optionally adds noindex for private/auth pages.
 */
export function usePageMeta({ title, description, path, noindex, image }: PageMetaOptions) {
  useCanonical(path);
  useEffect(() => {
    const url = `https://reddix.info${path}`;
    document.title = title;
    upsertMeta('description', description);
    upsertMeta('og:title', title, 'property');
    upsertMeta('og:description', description, 'property');
    upsertMeta('og:url', url, 'property');
    upsertMeta('twitter:title', title);
    upsertMeta('twitter:description', description);
    if (image) {
      upsertMeta('og:image', image, 'property');
      upsertMeta('twitter:image', image);
    }
    if (noindex) {
      upsertMeta('robots', 'noindex, nofollow');
    }
    return () => {
      if (noindex) {
        const el = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
        if (el) el.setAttribute('content', 'index, follow');
      }
    };
  }, [title, description, path, noindex, image]);
}

