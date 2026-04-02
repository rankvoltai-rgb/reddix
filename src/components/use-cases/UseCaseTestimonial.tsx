import { Quote } from 'lucide-react';
import type { UseCaseData } from '@/lib/useCases';

export function UseCaseTestimonial({ useCase }: { useCase: UseCaseData }) {
  return (
    <section className="py-20 sm:py-24 relative overflow-hidden">
      <div className="max-w-[800px] mx-auto px-6">
        <div className="relative rounded-2xl border border-border/40 bg-background p-10 sm:p-14 shadow-[0_12px_40px_-12px_hsl(var(--foreground)/0.04)] text-center reveal">
          <Quote className="w-8 h-8 text-primary/20 mx-auto mb-6" />
          <blockquote className="text-[20px] sm:text-[24px] font-medium text-foreground leading-[1.5] tracking-[-0.01em]">
            "{useCase.testimonial.quote}"
          </blockquote>
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/[0.08] border border-primary/10 flex items-center justify-center text-[14px] font-bold text-primary">
              {useCase.testimonial.name.charAt(0)}
            </div>
            <div className="text-left">
              <div className="text-[14px] font-semibold text-foreground">{useCase.testimonial.name}</div>
              <div className="text-[12px] text-muted-foreground">{useCase.testimonial.role}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
