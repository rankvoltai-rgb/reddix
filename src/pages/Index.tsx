import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Target, MessageSquare, TrendingUp, Loader2 } from 'lucide-react';

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
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <h1 className="text-lg font-semibold text-foreground">Reddix</h1>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate('/auth')}>
                Sign in
              </Button>
              <Button size="sm" onClick={() => navigate('/auth')}>
                Get started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 sm:py-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-semibold text-foreground tracking-tight leading-tight">
            Find warm leads on Reddit,{' '}
            <span className="text-primary">automatically</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Reddix scans Reddit for people actively looking for products like yours.
            Get AI-powered reply suggestions that blend in naturally—no spammy outreach.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Button size="lg" onClick={() => navigate('/auth')}>
              Start free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" size="lg">
              See how it works
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-foreground text-center mb-12">
            Everything you need to find qualified leads
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Zap,
                title: 'Intent Detection',
                description: 'AI identifies posts where users are actively looking for solutions like yours.',
              },
              {
                icon: Target,
                title: 'Lead Scoring',
                description: 'Automatically ranks leads by buying intent so you focus on the hottest opportunities.',
              },
              {
                icon: MessageSquare,
                title: 'AI Replies',
                description: 'Generate context-aware responses that match Reddit culture and feel natural.',
              },
              {
                icon: TrendingUp,
                title: 'Built-in CRM',
                description: 'Track every lead from discovery to conversion in one clean dashboard.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-card border border-border rounded-lg p-6 animate-fade-in"
              >
                <feature.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-medium text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Ready to find your next customers?
          </h2>
          <p className="text-muted-foreground mb-8">
            Set up in 2 minutes. No credit card required.
          </p>
          <Button size="lg" onClick={() => navigate('/auth')}>
            Get started for free
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} Reddix. Built for founders who want warm conversations, not cold outreach.
          </p>
        </div>
      </footer>
    </div>
  );
}