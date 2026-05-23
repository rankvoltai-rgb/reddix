import { lazy, Suspense, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useSubscription } from '@/hooks/useSubscription';
import { useCanonical } from '@/hooks/useCanonical';
import { resolveDestination, safeNavigate } from '@/lib/routing';
import { Loader2 } from 'lucide-react';

// Eager: above-the-fold for first paint.
import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';

// Lazy: everything below the fold streams in after hero is interactive.
const LogoBar = lazy(() => import('@/components/landing/LogoBar').then(m => ({ default: m.LogoBar })));
const ProductDemo = lazy(() => import('@/components/landing/ProductDemo').then(m => ({ default: m.ProductDemo })));
const StatsBar = lazy(() => import('@/components/landing/StatsBar').then(m => ({ default: m.StatsBar })));
const HowItWorks = lazy(() => import('@/components/landing/HowItWorks').then(m => ({ default: m.HowItWorks })));
const FeatureShowcase = lazy(() => import('@/components/landing/FeatureShowcase').then(m => ({ default: m.FeatureShowcase })));
const FeaturesGrid = lazy(() => import('@/components/landing/FeaturesGrid').then(m => ({ default: m.FeaturesGrid })));
const Testimonials = lazy(() => import('@/components/landing/Testimonials').then(m => ({ default: m.Testimonials })));
const ComparisonSection = lazy(() => import('@/components/landing/ComparisonSection').then(m => ({ default: m.ComparisonSection })));
const PricingSection = lazy(() => import('@/components/landing/PricingSection').then(m => ({ default: m.PricingSection })));
const FAQSection = lazy(() => import('@/components/landing/FAQSection').then(m => ({ default: m.FAQSection })));
const FinalCTA = lazy(() => import('@/components/landing/FinalCTA').then(m => ({ default: m.FinalCTA })));
const Footer = lazy(() => import('@/components/landing/Footer').then(m => ({ default: m.Footer })));

export default function Index() {
  const { user, loading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  const { subscribed, isLoading: subLoading } = useSubscription();
  useCanonical('/');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect signed-in users away from the landing page.
    if (!user) return;
    const dest = resolveDestination({
      user,
      profile,
      subscribed,
      authLoading,
      profileLoading,
      subLoading,
    });
    if (dest && dest !== '/auth') {
      safeNavigate(location.pathname, dest, navigate);
    }
  }, [user, authLoading, profile, profileLoading, subscribed, subLoading, navigate, location.pathname]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Reddix",
    "url": "https://reddix.info",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "description": "AI-powered Reddit lead generation platform. Scans Reddit 24/7, scores buying intent with AI (0–100), drafts context-aware replies, and tracks leads from discovery to conversion.",
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": "0",
      "highPrice": "97",
      "offerCount": "3"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "127"
    },
    "featureList": [
      "AI Intent Detection (0–100 scoring)",
      "Autonomous 24/7 Reddit Scanning",
      "AI Reply Draft Generation",
      "Subreddit Discovery",
      "Lead CRM & Tracking",
      "Duplicate Filtering",
      "Website Analysis",
      "Natural Tone Matching"
    ]
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Reddix",
    "url": "https://reddix.info",
    "logo": "https://reddix.info/favicon.png",
    "sameAs": []
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is Reddix?",
        "acceptedAnswer": { "@type": "Answer", "text": "Reddix is an AI-powered Reddit lead generation platform that scans Reddit 24/7, scores buying intent, and drafts context-aware replies to help you convert Reddit conversations into customers." }
      },
      {
        "@type": "Question",
        "name": "How does AI intent scoring work?",
        "acceptedAnswer": { "@type": "Answer", "text": "Reddix uses NLP to analyze each Reddit thread's context, language patterns, and buying signals, assigning a score from 0 to 100 so you can prioritize the hottest leads." }
      },
      {
        "@type": "Question",
        "name": "Is Reddix safe to use? Will I get banned?",
        "acceptedAnswer": { "@type": "Answer", "text": "Yes. Reddix drafts replies for you to review and post yourself. It never auto-posts, so your account stays fully compliant with Reddit's terms of service." }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Navbar />
      <HeroSection />
      <LogoBar />
      <ProductDemo />
      <StatsBar />
      <HowItWorks />
      <FeatureShowcase />
      <FeaturesGrid />
      <Testimonials />
      <ComparisonSection />
      <PricingSection />
      <FAQSection />
      <FinalCTA />
      <Footer />
    </div>
  );
}
