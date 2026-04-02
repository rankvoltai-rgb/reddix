import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { features } from '@/lib/features';
import type { UseCaseData } from '@/lib/useCases';

export function UseCaseFeatures({ useCase }: { useCase: UseCaseData }) {
  const navigate = useNavigate();
  const relevant = useCase.relevantFeatures
    .map((slug) => features.find((f) => f.slug === slug))
    .filter(Boolean);

  if (relevant.length === 0) return null;

  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-14 reveal">
          <h2 className="text-[28px] sm:text-[40px] font-bold tracking-[-0.03em] leading-[1.1]">
            Key features for{' '}
            <span
              className="inline-flex items-center font-normal text-primary px-4 py-0.5 rounded-2xl border border-primary/[0.15] bg-primary/[0.04]"
              style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
            >
              {useCase.title.toLowerCase()}
            </span>
          </h2>
          <p className="mt-4 text-[15px] text-muted-foreground max-w-[500px] mx-auto">
            The Reddix capabilities that matter most for your workflow.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {relevant.map((f) => {
            if (!f) return null;
            const FIcon = f.icon;
            return (
              <button
                key={f.slug}
                onClick={() => navigate(`/features/${f.slug}`)}
                className="group flex items-center gap-4 rounded-2xl border border-border/40 bg-background p-6 hover:border-primary/20 hover:shadow-[0_8px_30px_-10px_hsl(var(--primary)/0.08)] transition-all duration-300 text-left reveal"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/[0.06] border border-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/[0.1] transition-colors">
                  <FIcon className="w-6 h-6 text-primary/70 group-hover:text-primary transition-colors" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-[15px] font-semibold text-foreground group-hover:text-primary transition-colors">{f.title}</span>
                  <span className="block text-[13px] text-muted-foreground line-clamp-1 mt-0.5">{f.tagline}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
