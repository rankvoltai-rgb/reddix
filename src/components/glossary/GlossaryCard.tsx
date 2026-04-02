import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { GlossaryTerm } from '@/lib/glossary';

const categoryColors: Record<string, string> = {
  Reddit: 'bg-orange-100 text-orange-700 border-orange-200',
  'Lead Generation': 'bg-blue-100 text-blue-700 border-blue-200',
  'AI & SaaS': 'bg-purple-100 text-purple-700 border-purple-200',
  Reddix: 'bg-primary/10 text-primary border-primary/20',
};

export function GlossaryCard({ term }: { term: GlossaryTerm }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/glossary/${term.slug}`)}
      className="group text-left w-full p-5 rounded-2xl border border-border/40 bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-[15px] font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
          {term.title}
        </h3>
        <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-0.5" />
      </div>
      <p className="text-[13px] text-muted-foreground leading-relaxed line-clamp-2 mb-4">
        {term.shortDef}
      </p>
      <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-medium border ${categoryColors[term.category] || ''}`}>
        {term.category}
      </span>
    </button>
  );
}
