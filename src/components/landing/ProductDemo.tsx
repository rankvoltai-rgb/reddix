import { Badge } from '@/components/ui/badge';
import { MessageSquare, ExternalLink, Sparkles, ArrowUpRight } from 'lucide-react';

const leads = [
  { title: 'Looking for a tool to find leads on Reddit automatically', sub: 'r/SaaS', intent: 'hot', score: 92, time: '2h' },
  { title: 'Best way to monitor Reddit for product mentions?', sub: 'r/startups', intent: 'warm', score: 78, time: '4h' },
  { title: 'Anyone using AI to generate Reddit replies for outreach?', sub: 'r/Entrepreneur', intent: 'hot', score: 88, time: '1h' },
  { title: 'Need a Reddit monitoring tool for my SaaS — any recs?', sub: 'r/growthacking', intent: 'hot', score: 95, time: '30m' },
];

export function ProductDemo() {
  return (
    <section className="py-12 sm:py-20">
      <div className="max-w-[1050px] mx-auto px-6">
        {/* Section intro */}
        <div className="text-center mb-12">
          <p className="text-[13px] font-medium text-primary mb-3 tracking-wide uppercase">
            Live preview
          </p>
          <h2 className="text-2xl sm:text-[34px] font-semibold tracking-[-0.02em] leading-tight">
            See what your dashboard looks like
          </h2>
          <p className="mt-3 text-[15px] text-muted-foreground max-w-md mx-auto">
            Real leads from real subreddits — scored, ranked, and ready for you to reply.
          </p>
        </div>

        <div className="reveal">
          <div className="rounded-2xl border border-border/50 overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)]">
            {/* Chrome */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/30 border-b border-border/30">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-foreground/8" />
                <div className="w-2.5 h-2.5 rounded-full bg-foreground/8" />
                <div className="w-2.5 h-2.5 rounded-full bg-foreground/8" />
              </div>
              <div className="flex-1 mx-12">
                <div className="max-w-[280px] mx-auto bg-background/60 rounded-md px-3 py-1 text-[11px] text-muted-foreground/60 text-center border border-border/30">
                  app.reddix.io/scanner
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="bg-background p-5 sm:p-6">
              {/* Top bar */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-[14px] font-semibold text-foreground">Lead Scanner</h3>
                  <p className="text-[12px] text-muted-foreground mt-0.5">4 new high-intent leads · Last scan 3m ago</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-[11px] h-6 px-2.5 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--success))] mr-1.5 animate-pulse" />
                    Scanning
                  </Badge>
                </div>
              </div>

              {/* Leads */}
              <div className="space-y-0.5">
                {leads.map((lead, i) => (
                  <div key={i} className="group flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-muted/40 transition-all duration-200">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-[12px] font-bold shrink-0 ${
                      lead.score >= 90 ? 'bg-red-50 text-red-500' : lead.intent === 'hot' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'
                    }`}>
                      {lead.score}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-foreground font-medium truncate">{lead.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{lead.sub} · {lead.time} ago</p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button className="p-1.5 rounded-md hover:bg-muted"><MessageSquare className="w-3.5 h-3.5 text-muted-foreground" /></button>
                      <button className="p-1.5 rounded-md hover:bg-muted"><ExternalLink className="w-3.5 h-3.5 text-muted-foreground" /></button>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI reply */}
              <div className="mt-5 rounded-xl bg-gradient-to-br from-primary/[0.03] to-transparent border border-primary/10 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[11px] font-semibold text-primary">AI-drafted reply</span>
                  </div>
                  <button className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                    Copy & go <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-[13px] text-foreground/80 leading-relaxed">
                  "Check out Reddix — it monitors Reddit 24/7 and surfaces posts where people are actively looking for tools like yours. reddix.io"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
