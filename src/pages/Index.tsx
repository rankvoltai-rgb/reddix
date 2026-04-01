import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Loader2 } from 'lucide-react';

import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { ProductDemo } from '@/components/landing/ProductDemo';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { FeaturesGrid } from '@/components/landing/FeaturesGrid';
import { StatsBar } from '@/components/landing/StatsBar';
import { PricingSection } from '@/components/landing/PricingSection';
import { FinalCTA } from '@/components/landing/FinalCTA';

export default function Index() {
  const { user, loading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading || profileLoading) return;
    if (user) {
      if (!profile?.onboarding_completed) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, authLoading, profile, profileLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ProductDemo />
      <StatsBar />
      <HowItWorks />
      <FeaturesGrid />
      <PricingSection />
      <FinalCTA />

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm font-semibold text-foreground">Reddix</span>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Reddix. Built for founders who want warm conversations, not cold outreach.
          </p>
        </div>
      </footer>
    </div>
  );
}
