import { useEffect } from 'react';
import { useCanonical } from './useCanonical';

interface PageMetaOptions {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
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
 * Sets unique <title>, meta description, and canonical URL for a route.
 * Optionally adds noindex for private/auth pages.
 */
export function usePageMeta({ title, description, path, noindex }: PageMetaOptions) {
  useCanonical(path);
  useEffect(() => {
    document.title = title;
    upsertMeta('description', description);
    if (noindex) {
      upsertMeta('robots', 'noindex, nofollow');
    }
    return () => {
      if (noindex) {
        const el = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
        if (el) el.setAttribute('content', 'index, follow');
      }
    };
  }, [title, description, noindex]);
}
