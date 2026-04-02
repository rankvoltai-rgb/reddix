import { Check, X, Zap } from 'lucide-react';
import type { CompetitorFeature } from '@/lib/alternatives';

function CellValue({ value, positive }: { value: string | boolean; positive?: boolean }) {
  if (value === true) return (
    <div className="flex items-center justify-center">
      <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center">
        <Check className="w-3.5 h-3.5 text-emerald-600" />
      </div>
    </div>
  );
  if (value === false) return (
    <div className="flex items-center justify-center">
      <div className="w-6 h-6 rounded-full bg-destructive/5 flex items-center justify-center">
        <X className="w-3.5 h-3.5 text-destructive/50" />
      </div>
    </div>
  );
  return <span className={`text-[13px] font-medium ${positive ? 'text-foreground' : 'text-muted-foreground'}`}>{value}</span>;
}

interface ComparisonTableProps {
  competitorName: string;
  features: CompetitorFeature[];
  verdict: { competitor: string; reddix: string };
}

export function ComparisonTable({ competitorName, features, verdict }: ComparisonTableProps) {
  return (
    <div className="rounded-2xl border border-border/40 bg-background overflow-hidden shadow-[0_24px_60px_-12px_hsl(var(--foreground)/0.06)] reveal">
      {/* Header */}
      <div className="grid grid-cols-3 gap-0 border-b border-border/30">
        <div className="px-5 py-4 text-[12px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Zap className="w-3.5 h-3.5" />
          Feature
        </div>
        <div className="px-5 py-4 text-center border-x border-border/15">
          <span className="text-[12px] font-semibold text-muted-foreground/60 uppercase tracking-wider">{competitorName}</span>
        </div>
        <div className="px-5 py-4 text-center bg-primary/[0.03]">
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 rounded bg-primary flex items-center justify-center">
              <span className="text-[7px] font-bold text-primary-foreground">R</span>
            </div>
            <span className="text-[12px] font-bold text-primary uppercase tracking-wider">Reddix</span>
          </div>
        </div>
      </div>

      {/* Rows */}
      {features.map((row, i) => (
        <div
          key={i}
          className={`grid grid-cols-3 gap-0 group transition-colors hover:bg-muted/20 ${i < features.length - 1 ? 'border-b border-border/15' : ''}`}
        >
          <div className="px-5 py-4 text-[14px] text-foreground font-medium flex items-center">
            {row.name}
          </div>
          <div className="px-5 py-4 flex items-center justify-center border-x border-border/10 text-muted-foreground">
            <CellValue value={row.competitor} />
          </div>
          <div className="px-5 py-4 flex items-center justify-center bg-primary/[0.015] text-foreground">
            <CellValue value={row.reddix} positive />
          </div>
        </div>
      ))}

      {/* Verdict */}
      <div className="grid grid-cols-3 gap-0 border-t border-border/30 bg-muted/20">
        <div className="px-5 py-3.5 text-[12px] font-semibold text-foreground">Verdict</div>
        <div className="px-5 py-3.5 flex items-center justify-center border-x border-border/15">
          <span className="text-[12px] font-semibold">{verdict.competitor}</span>
        </div>
        <div className="px-5 py-3.5 flex items-center justify-center bg-primary/[0.03]">
          <span className="text-[12px] text-emerald-600 font-semibold">{verdict.reddix}</span>
        </div>
      </div>
    </div>
  );
}
