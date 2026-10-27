/**
 * /alternatives/syften: multi-platform monitoring vs Reddit buying intent.
 * See BRIEF.md for what it may claim and where each fact comes from.
 */
import { useEffect, useMemo } from 'react';
import { MotionConfig } from 'motion/react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Spacer } from '@/components/landing/frame';
import { usePageMeta } from '@/hooks/usePageMeta';
import { FAQ, HERO, META, PATH } from './content';
import { Hero } from './sections/Hero';
import { Lanes, Questions as TwoQuestions } from './sections/Approach';
import { Planner } from './sections/Planner';
import { Choose, Closing, Plans, Questions, Sources } from './sections/Closing';

const SITE = 'https://reddix.info';

export default function SyftenPage() {
  usePageMeta({ title: META.title, description: META.description, path: PATH });
  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0);
  }, []);

  const jsonLd = useMemo(() => {
    const url = `${SITE}${PATH}`;
    return {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: META.title, description: META.description, about: [{ '@type': 'SoftwareApplication', name: 'Syften' }, { '@type': 'SoftwareApplication', name: 'Reddix', url: SITE }] },
        { '@type': 'FAQPage', '@id': `${url}#faq`, mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
            { '@type': 'ListItem', position: 2, name: 'Alternatives', item: `${SITE}/alternatives` },
            { '@type': 'ListItem', position: 3, name: HERO.h1, item: url },
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
          <TwoQuestions />
          <Spacer />
          <Lanes />
          <Spacer />
          <Planner />
          <Spacer />
          <Plans />
          <Spacer />
          <Choose />
          <Spacer />
          <Questions />
          <Sources />
          <Closing />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
