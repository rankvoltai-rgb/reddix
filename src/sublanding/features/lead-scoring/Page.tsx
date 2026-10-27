/**
 * /features/lead-scoring: a page of its own rather than the shared feature
 * template. See BRIEF.md for what it's for and what it may claim.
 */
import { useEffect, useMemo } from 'react';
import { MotionConfig } from 'motion/react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Spacer } from '@/components/landing/frame';
import { usePageMeta } from '@/hooks/usePageMeta';
import { FAQ, META, PATH } from './content';
import { Hero } from './sections/Hero';
import { Anatomy } from './sections/Anatomy';
import { SecondRead } from './sections/SecondRead';
import { Triage } from './sections/Triage';
import { Lifecycle } from './sections/Lifecycle';
import { Close, Questions } from './sections/Closing';

const SITE = 'https://reddix.info';

export default function LeadScoringPage() {
  usePageMeta({ title: META.title, description: META.description, path: PATH });
  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0);
  }, []);

  const jsonLd = useMemo(() => {
    const url = `${SITE}${PATH}`;
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': `${url}#webpage`,
          url,
          name: META.title,
          description: META.description,
          about: { '@type': 'Thing', name: 'Reddit lead scoring' },
          isPartOf: { '@type': 'SoftwareApplication', name: 'Reddix', url: SITE },
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
            { '@type': 'ListItem', position: 2, name: 'Features', item: `${SITE}/#features` },
            { '@type': 'ListItem', position: 3, name: 'Lead scoring', item: url },
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
          <Anatomy />
          <Spacer />
          <SecondRead />
          <Spacer />
          <Triage />
          <Spacer />
          <Lifecycle />
          <Spacer />
          <Questions />
          <Close />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
