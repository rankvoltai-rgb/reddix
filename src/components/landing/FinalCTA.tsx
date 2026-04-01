import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function FinalCTA() {
  const navigate = useNavigate();

  return (
    <section className="relative py-28 sm:py-36 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-foreground" />
      <div className="orb w-[500px] h-[500px] bg-[hsl(var(--primary)/0.25)] top-[-100px] right-[-100px]" style={{ filter: 'blur(120px)' }} />
      <div className="orb w-[400px] h-[400px] bg-[hsl(350,70%,50%,0.15)] bottom-[-150px] left-[-50px]" style={{ filter: 'blur(120px)', animationDelay: '-6s' }} />

      <div className="relative max-w-[600px] mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-[42px] font-semibold text-background tracking-[-0.02em] leading-tight">
          Ready to find your next{' '}
          <span className="font-display italic font-normal opacity-80">100 customers</span>
          ?
        </h2>
        <p className="mt-5 text-[16px] text-background/50">
          Set up in under 2 minutes. No credit card required.
        </p>
        <Button
          size="lg"
          onClick={() => navigate('/auth')}
          className="mt-9 h-12 px-8 rounded-xl text-[14px] bg-background text-foreground hover:bg-background/90 shadow-2xl"
        >
          Get started for free
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
      </div>
    </section>
  );
}
