/**
 * /alternatives/reddleads: a scanner on a timer against one you start. See
 * BRIEF.md for the angle and RESEARCH.md for every competitor fact.
 */
import { useEffect, useMemo } from 'react';
import { MotionConfig } from 'motion/react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Spacer } from '@/components/landing/frame';
import { usePageMeta } from '@/hooks/usePageMeta';
import { FAQ, META, NAME, PATH } from './content';
import { Hero } from './sections/Hero';
import { Day } from './sections/Day';
import { Close, Plans, Questions, Style, Trial, Verdict } from './sections/Closing';

const SITE = 'https://reddix.info';

export default function ReddLeadsPage() {
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
          about: [
            { '@type': 'SoftwareApplication', name: NAME, url: 'https://reddleads.com' },
            { '@type': 'SoftwareApplication', name: 'Reddix', url: SITE },
          ],
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
            { '@type': 'ListItem', position: 3, name: `${NAME} vs Reddix`, item: url },
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
          <Day />
          <Spacer />
          <Style />
          <Spacer />
          <Plans />
          <Spacer />
          <Verdict />
          <Trial />
          <Spacer />
          <Questions />
          <Close />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
