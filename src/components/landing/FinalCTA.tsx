import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function FinalCTA() {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-foreground" />
      <div className="absolute inset-0 bg-radial-glow-bottom opacity-60" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-background leading-tight">
          Ready to find your next 100 customers on Reddit?
        </h2>
        <p className="mt-4 text-background/60 text-lg">
          Set up in 2 minutes. No credit card required.
        </p>
        <Button
          size="lg"
          onClick={() => navigate('/auth')}
          className="mt-8 rounded-full px-8 h-12 text-base bg-background text-foreground hover:bg-background/90"
        >
          Get started for free
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </section>
  );
}
