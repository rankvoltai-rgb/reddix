import { useNavigate } from 'react-router-dom';
import { ArrowRight, AlertTriangle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Competitor } from '@/lib/alternatives';

export function CompetitorCard({ competitor, index }: { competitor: Competitor; index: number }) {
  const navigate = useNavigate();

  return (
    <div
      className={`group relative bento-card cursor-pointer reveal`}
      style={{ animationDelay: `${index * 0.08}s` }}
      onClick={() => navigate(`/alternatives/${competitor.slug}`)}
    >
      {/* Gradient accent top */}
      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Status badge */}
      <div className="flex items-center justify-between mb-4">
        {competitor.status === 'shutdown' ? (
          <span className="tag-pill bg-destructive/5 text-destructive border-destructive/15">
            <AlertTriangle className="w-3 h-3" />
            Shut down
          </span>
        ) : (
          <span className="tag-pill bg-muted text-muted-foreground border-border">
            Active
          </span>
        )}
        <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
      </div>

      {/* Name */}
      <h3 className="text-[18px] font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors">
        Reddix vs {competitor.name}
      </h3>
      <p className="text-[13px] text-muted-foreground leading-relaxed mb-4 line-clamp-2">
        {competitor.weakness}
      </p>

      {/* Quick feature check */}
      <div className="space-y-2 mb-5">
        {competitor.features.slice(0, 3).map((f, i) => (
          <div key={i} className="flex items-center justify-between text-[12px]">
            <span className="text-muted-foreground">{f.name}</span>
            <div className="flex items-center gap-3">
              <span className={f.competitor === true ? 'text-emerald-600' : f.competitor === false ? 'text-destructive/50' : 'text-muted-foreground'}>
                {f.competitor === true ? '✓' : f.competitor === false ? '✗' : f.competitor}
              </span>
              <span className="w-px h-3 bg-border" />
              <span className="text-emerald-600 font-medium">
                {f.reddix === true ? '✓' : typeof f.reddix === 'string' ? f.reddix : '✗'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Button
        variant="ghost"
        size="sm"
        className="w-full text-[13px] font-medium text-primary hover:bg-primary/5 rounded-xl group-hover:bg-primary/5 transition-colors"
      >
        <Zap className="w-3.5 h-3.5 mr-1.5" />
        See full comparison
      </Button>
    </div>
  );
}
