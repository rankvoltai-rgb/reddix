/**
 * /features/scheduled-scans: Reddix scans on demand, not on a schedule, and
 * this page says so. See BRIEF.md for what it may claim.
 */
import { useEffect, useMemo } from 'react';
import { MotionConfig } from 'motion/react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Spacer } from '@/components/landing/frame';
import { usePageMeta } from '@/hooks/usePageMeta';
import { FAQ, META, PATH } from './content';
import { Hero } from './sections/Hero';
import { Answer } from './sections/Answer';
import { Anatomy } from './sections/Anatomy';
import { Planner } from './sections/Planner';
import { Close, Questions } from './sections/Closing';

const SITE = 'https://reddix.info';

export default function ScheduledScansPage() {
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
          about: { '@type': 'Thing', name: 'Scanning Reddit for leads on demand' },
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
            { '@type': 'ListItem', position: 3, name: 'Scanning', item: url },
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
          <Answer />
          <Spacer />
          <Anatomy />
          <Spacer />
          <Planner />
          <Spacer />
          <Questions />
          <Close />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
