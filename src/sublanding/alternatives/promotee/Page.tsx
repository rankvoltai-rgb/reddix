/**
 * /alternatives/promotee: automation on your own accounts, or drafting. See BRIEF.md.
 */
import { useEffect, useMemo } from 'react';
import { MotionConfig } from 'motion/react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Spacer } from '@/components/landing/frame';
import { usePageMeta } from '@/hooks/usePageMeta';
import { FAQ, META, PATH } from './content';
import { Hero, Loop } from './sections/Hero';
import { Planner } from './sections/Planner';
import { FitAndQuestions, SourcesAndClose, Strengths, Thread, Trade } from './sections/Rest';

const SITE = 'https://reddix.info';

export default function PromoteePage() {
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
          dateModified: '2026-10-27',
          isPartOf: { '@type': 'WebSite', name: 'Reddix', url: SITE },
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
            { '@type': 'ListItem', position: 2, name: 'Alternatives', item: `${SITE}/alternatives` },
            { '@type': 'ListItem', position: 3, name: 'Promotee vs Reddix', item: url },
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
          <Loop />
          <Spacer />
          <Strengths />
          <Spacer />
          <Planner />
          <Spacer />
          <Trade />
          <Spacer />
          <Thread />
          <Spacer />
          <FitAndQuestions />
          <SourcesAndClose />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
