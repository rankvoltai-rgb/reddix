/**
 * /alternatives/gummysearch: a migration page for a tool that is shutting
 * down. See BRIEF.md for its job and what it may claim.
 */
import { useEffect, useMemo } from 'react';
import { MotionConfig } from 'motion/react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Spacer } from '@/components/landing/frame';
import { usePageMeta } from '@/hooks/usePageMeta';
import { FAQ, HERO, META, PATH } from './content';
import { Hero } from './sections/Hero';
import { Timeline } from './sections/Timeline';
import { Checklist } from './sections/Checklist';
import { Mapping } from './sections/Mapping';
import { Close, Fit, Prices, Questions, Sources } from './sections/Closing';

const SITE = 'https://reddix.info';

export default function GummySearchAlternative() {
  usePageMeta({ title: META.title, description: META.description, path: PATH });
  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0);
  }, []);

  const jsonLd = useMemo(() => {
    const url = `${SITE}${PATH}`;
    return {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: META.title, description: META.description, about: { '@type': 'Thing', name: 'GummySearch' } },
        {
          '@type': 'FAQPage',
          '@id': `${url}#faq`,
          mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
            { '@type': 'ListItem', position: 2, name: 'Alternatives', item: `${SITE}/alternatives` },
            { '@type': 'ListItem', position: 3, name: HERO.pill, item: url },
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
          <Timeline />
          <Spacer />
          <Checklist />
          <Spacer />
          <Mapping />
          <Spacer />
          <Prices />
          <Spacer />
          <Fit />
          <Spacer />
          <Questions />
          <Sources />
          <Close />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
