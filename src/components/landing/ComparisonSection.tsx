import { Check, X, Zap, Clock, AlertTriangle } from 'lucide-react';

const rows = [
  { feature: 'Time to first lead', manual: '2–4 hours/day', reddix: '2 minutes' },
  { feature: 'Intent detection', manual: false, reddix: true },
  { feature: 'Lead scoring (0–100)', manual: false, reddix: true },
  { feature: 'AI reply drafts', manual: false, reddix: true },
  { feature: 'Subreddit discovery', manual: 'Trial and error', reddix: 'AI-powered' },
  { feature: 'Duplicate filtering', manual: false, reddix: true },
  { feature: 'Scheduled 24/7 scans', manual: false, reddix: true },
  { feature: 'Lead tracking & CRM', manual: 'Spreadsheet', reddix: 'Built-in' },
  { feature: 'Scales without burnout', manual: false, reddix: true },
];

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
      <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center">
        <X className="w-3.5 h-3.5 text-red-400" />
      </div>
    </div>
  );
  return <span className={`text-[13px] font-medium ${positive ? 'text-foreground' : 'text-muted-foreground'}`}>{value}</span>;
}

export function ComparisonSection() {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-muted/30" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-radial-glow-bottom opacity-50" />
      
      <div className="relative max-w-[850px] mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/[0.06] border border-primary/10 text-[12px] font-medium text-primary mb-5">
            <AlertTriangle className="w-3.5 h-3.5" />
            The old way is broken
          </div>
          <h2 className="text-3xl sm:text-[44px] font-semibold tracking-[-0.03em] leading-[1.1]">
            Scrolling Reddit manually{' '}
            <span
              className="inline-flex items-center font-normal text-primary px-4 py-0.5 rounded-2xl border border-primary/[0.15] bg-primary/[0.04]"
              style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
            >
              vs. Reddix
            </span>
          </h2>
          <p className="mt-5 text-[15px] text-muted-foreground max-w-md mx-auto leading-relaxed">
            One path burns 3 hours a day. The other takes 2 minutes. Same channel, wildly different results.
          </p>
        </div>

        <div className="rounded-2xl border border-border/40 bg-background overflow-hidden shadow-[0_24px_60px_-12px_hsl(var(--foreground)/0.06)] reveal">
          {/* Header */}
          <div className="grid grid-cols-3 gap-0 border-b border-border/30">
            <div className="px-5 py-4 text-[12px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-3.5 h-3.5" />
              Feature
            </div>
            <div className="px-5 py-4 text-center border-x border-border/15">
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-3.5 h-3.5 text-muted-foreground/40" />
                <span className="text-[12px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Manual</span>
              </div>
            </div>
            <div className="px-5 py-4 text-center bg-primary/[0.03]">
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 rounded bg-primary flex items-center justify-center">
                  <span className="text-[7px] font-bold text-white">R</span>
                </div>
                <span className="text-[12px] font-bold text-primary uppercase tracking-wider">Reddix</span>
              </div>
            </div>
          </div>

          {/* Rows */}
          {rows.map((row, i) => (
            <div
              key={i}
              className={`grid grid-cols-3 gap-0 group transition-colors hover:bg-muted/20 ${i < rows.length - 1 ? 'border-b border-border/15' : ''}`}
            >
              <div className="px-5 py-4 text-[14px] text-foreground font-medium flex items-center">
                {row.feature}
              </div>
              <div className="px-5 py-4 flex items-center justify-center border-x border-border/10 text-muted-foreground">
                <CellValue value={row.manual} />
              </div>
              <div className="px-5 py-4 flex items-center justify-center bg-primary/[0.015] text-foreground">
                <CellValue value={row.reddix} positive />
              </div>
            </div>
          ))}
          
          {/* Bottom bar */}
          <div className="grid grid-cols-3 gap-0 border-t border-border/30 bg-muted/20">
            <div className="px-5 py-3.5 text-[12px] font-semibold text-foreground">
              Verdict
            </div>
            <div className="px-5 py-3.5 flex items-center justify-center border-x border-border/15">
              <span className="text-[12px] text-red-500 font-semibold">😓 Burnout</span>
            </div>
            <div className="px-5 py-3.5 flex items-center justify-center bg-primary/[0.03]">
              <span className="text-[12px] text-emerald-600 font-semibold">🚀 Autopilot</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
