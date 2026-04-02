import { useEffect } from 'react';

export function useCanonical(path: string) {
  useEffect(() => {
    const url = `https://reddix.info${path}`;
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = url;
    return () => {
      if (link) link.href = '';
    };
  }, [path]);
}
