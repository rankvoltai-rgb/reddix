import { Check, X } from 'lucide-react';

const rows = [
  { feature: 'Time to find leads', manual: '2–4 hours/day', reddix: '2 minutes setup' },
  { feature: 'Intent detection', manual: false, reddix: true },
  { feature: 'Lead scoring', manual: false, reddix: true },
  { feature: 'AI reply drafts', manual: false, reddix: true },
  { feature: 'Subreddit discovery', manual: 'Trial and error', reddix: 'AI-powered' },
  { feature: 'Duplicate filtering', manual: false, reddix: true },
  { feature: 'Scheduled scans', manual: false, reddix: true },
  { feature: 'Lead tracking CRM', manual: 'Spreadsheet', reddix: 'Built-in' },
  { feature: 'Scales with you', manual: false, reddix: true },
];

function CellValue({ value }: { value: string | boolean }) {
  if (value === true) return <Check className="w-4 h-4 text-[hsl(var(--success))]" />;
  if (value === false) return <X className="w-4 h-4 text-muted-foreground/30" />;
  return <span className="text-[13px]">{value}</span>;
}

export function ComparisonSection() {
  return (
    <section className="py-24 sm:py-32 bg-muted/20">
      <div className="max-w-[800px] mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-[13px] font-medium text-primary mb-3 tracking-wide uppercase">
            Comparison
          </p>
          <h2 className="text-3xl sm:text-[40px] font-semibold tracking-[-0.02em] leading-tight">
            Manual browsing{' '}
            <span className="font-display italic font-normal">vs. Reddix</span>
          </h2>
          <p className="mt-4 text-[15px] text-muted-foreground">
            See why founders switch from manual Reddit prospecting.
          </p>
        </div>

        <div className="bento-card p-0 overflow-hidden reveal">
          {/* Header */}
          <div className="grid grid-cols-3 gap-0 border-b border-border/40 bg-muted/30">
            <div className="px-5 py-3.5 text-[12px] font-medium text-muted-foreground uppercase tracking-wider">
              Feature
            </div>
            <div className="px-5 py-3.5 text-[12px] font-medium text-muted-foreground uppercase tracking-wider text-center border-x border-border/20">
              Manual
            </div>
            <div className="px-5 py-3.5 text-[12px] font-semibold text-primary uppercase tracking-wider text-center">
              Reddix
            </div>
          </div>

          {/* Rows */}
          {rows.map((row, i) => (
            <div
              key={i}
              className={`grid grid-cols-3 gap-0 ${i < rows.length - 1 ? 'border-b border-border/20' : ''} hover:bg-muted/20 transition-colors`}
            >
              <div className="px-5 py-3.5 text-[13px] text-foreground font-medium">
                {row.feature}
              </div>
              <div className="px-5 py-3.5 flex items-center justify-center border-x border-border/10 text-muted-foreground">
                <CellValue value={row.manual} />
              </div>
              <div className="px-5 py-3.5 flex items-center justify-center text-foreground">
                <CellValue value={row.reddix} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
