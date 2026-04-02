import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import type { UseCaseData } from '@/lib/useCases';

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`border-b border-border/20 last:border-b-0 transition-colors ${open ? 'bg-primary/[0.01]' : ''}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 px-1 text-left group"
      >
        <div className="flex items-center gap-3">
          <span className="text-[12px] font-mono text-muted-foreground/30 w-6 shrink-0">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="text-[15px] font-medium text-foreground group-hover:text-primary transition-colors">
            {q}
          </span>
        </div>
        <div className={`w-7 h-7 rounded-lg border border-border/30 flex items-center justify-center shrink-0 transition-all duration-300 ${open ? 'bg-primary border-primary' : 'bg-muted/50'}`}>
          <ChevronDown className={`w-3.5 h-3.5 transition-all duration-300 ${open ? 'rotate-180 text-white' : 'text-muted-foreground'}`} />
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-[500px] pb-5' : 'max-h-0'}`}>
        <p className="text-[14px] text-muted-foreground leading-[1.7] pl-9 pr-10">{a}</p>
      </div>
    </div>
  );
}

export function UseCaseFAQ({ useCase }: { useCase: UseCaseData }) {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-muted/30" />

      <div className="relative max-w-[750px] mx-auto px-6">
        <div className="text-center mb-14 reveal">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/[0.06] border border-primary/10 text-[12px] font-medium text-primary mb-5">
            <HelpCircle className="w-3.5 h-3.5" />
            Questions from {useCase.title.toLowerCase()}
          </div>
          <h2 className="text-3xl sm:text-[40px] font-semibold tracking-[-0.03em] leading-[1.1]">
            Frequently asked{' '}
            <span
              className="inline-flex items-center font-normal text-primary px-4 py-0.5 rounded-2xl border border-primary/[0.15] bg-primary/[0.04]"
              style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
            >
              questions
            </span>
          </h2>
        </div>

        <div className="rounded-2xl border border-border/40 bg-background p-6 sm:p-8 shadow-[0_12px_40px_-12px_hsl(var(--foreground)/0.04)] reveal">
          {useCase.faq.map((item, i) => (
            <FAQItem key={i} q={item.q} a={item.a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
