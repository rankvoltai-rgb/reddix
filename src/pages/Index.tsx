import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useCanonical } from '@/hooks/useCanonical';
import { Loader2 } from 'lucide-react';

import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { LogoBar } from '@/components/landing/LogoBar';
import { ProductDemo } from '@/components/landing/ProductDemo';
import { StatsBar } from '@/components/landing/StatsBar';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { FeatureShowcase } from '@/components/landing/FeatureShowcase';
import { FeaturesGrid } from '@/components/landing/FeaturesGrid';
import { Testimonials } from '@/components/landing/Testimonials';
import { ComparisonSection } from '@/components/landing/ComparisonSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { FinalCTA } from '@/components/landing/FinalCTA';
import { Footer } from '@/components/landing/Footer';

export default function Index() {
  const { user, loading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  useCanonical('/');
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading || profileLoading) return;
    if (user) {
      navigate(!profile?.onboarding_completed ? '/onboarding' : '/dashboard');
    }
  }, [user, authLoading, profile, profileLoading, navigate]);

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
    "logo": "https://reddix.info/placeholder.svg",
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
