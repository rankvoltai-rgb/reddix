import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
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

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
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
