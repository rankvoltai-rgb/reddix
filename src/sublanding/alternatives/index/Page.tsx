/**
 * /alternatives: a field guide to Reddit lead tools, sorted by what each does
 * on Reddit. Tool facts come from directory.ts, words from content.ts.
 */
import { useEffect, useMemo } from 'react';
import { MotionConfig } from 'motion/react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Spacer } from '@/components/landing/frame';
import { usePageMeta } from '@/hooks/usePageMeta';
import { FAQ, META, PATH } from './content';
import { TOOLS } from './directory';
import { Hero } from './sections/Hero';
import { Line } from './sections/Line';
import { Finder } from './sections/Finder';
import { Also, Directory, Gone } from './sections/Directory';
import { Close, Questions } from './sections/Closing';

const SITE = 'https://reddix.info';

export default function AlternativesIndex() {
  usePageMeta({ title: META.title, description: META.description, path: PATH });
  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0);
  }, []);

  const jsonLd = useMemo(() => {
    const url = `${SITE}${PATH}`;
    return {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'CollectionPage', '@id': `${url}#webpage`, url, name: META.title, description: META.description },
        {
          '@type': 'ItemList',
          '@id': `${url}#list`,
          itemListElement: TOOLS.map((t, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: `Reddix vs ${t.name}`,
            url: `${SITE}/alternatives/${t.slug}`,
          })),
        },
        {
          '@type': 'FAQPage',
          '@id': `${url}#faq`,
          mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
            { '@type': 'ListItem', position: 2, name: 'Alternatives', item: url },
          ],
        },
      ],
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-white font-jakarta">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Navbar framed />
        <main>
          <Hero />
          <Spacer />
          <Line />
          <Spacer />
          <Finder />
          <Spacer />
          <Directory />
          <Spacer />
          <Gone />
          <Also />
          <Spacer />
          <Questions />
          <Close />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
