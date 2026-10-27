/**
 * Everything on the landing page below the hero, in order, as one chunk that
 * loads after the hero is interactive. MotionConfig makes every motion
 * component here follow the visitor's reduced-motion setting.
 */
import { MotionConfig } from 'motion/react';
import { DashboardShowcase } from './DashboardShowcase';
import { Testimonials } from './Testimonials';
import { HowItWorks } from './HowItWorks';
import { Features } from './Features';
import { ComparisonSection } from './ComparisonSection';
import { Guarantee, PricingSection } from './PricingSection';
import { FAQSection } from './FAQSection';
import { ClosingCTA } from './ClosingCTA';
import { Footer } from './Footer';

export default function LandingSections() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="font-jakarta">
        <DashboardShowcase />
        <Testimonials />
        <HowItWorks />
        <Features />
        <ComparisonSection />
        <PricingSection />
        <Guarantee />
        <FAQSection />
        <ClosingCTA />
      </main>
      <Footer />
    </MotionConfig>
  );
}
