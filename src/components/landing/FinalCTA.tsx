import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function FinalCTA() {
  const navigate = useNavigate();

  return (
    <section className="relative py-28 sm:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-foreground" />
      <div className="orb w-[600px] h-[600px] bg-[hsl(var(--primary)/0.2)] top-[-200px] right-[-100px]" style={{ filter: 'blur(140px)' }} />
      <div className="orb w-[500px] h-[500px] bg-[hsl(350,70%,50%,0.12)] bottom-[-200px] left-[-100px]" style={{ filter: 'blur(140px)', animationDelay: '-6s' }} />

      <div className="relative max-w-[650px] mx-auto px-6 text-center">
        <p className="text-[13px] font-medium text-background/40 mb-4 tracking-wide uppercase">
          Get started today
        </p>
        <h2 className="text-[32px] sm:text-[48px] font-semibold text-background tracking-[-0.03em] leading-[1.1]">
          Your next 100 customers are{' '}
          <span
            className="font-normal text-background/70"
            style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
          >
            already on Reddit
          </span>
        </h2>
        <p className="mt-6 text-[16px] text-background/40 leading-relaxed max-w-md mx-auto">
          They're asking for tools like yours right now. Reddix helps you show up in the conversation.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            size="lg"
            onClick={() => navigate('/auth')}
            className="h-[52px] px-8 rounded-xl text-[15px] bg-background text-foreground hover:bg-background/90 shadow-2xl"
          >
            Start for free
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
        <p className="mt-5 text-[12px] text-background/25">
          No credit card · 2 min setup · Cancel anytime
        </p>
      </div>
    </section>
  );
}
