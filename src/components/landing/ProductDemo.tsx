import { Badge } from '@/components/ui/badge';
import { MessageSquare, ExternalLink, Sparkles } from 'lucide-react';

const leads = [
  {
    title: 'Looking for a tool to find leads on Reddit automatically',
    sub: 'r/SaaS',
    intent: 'hot',
    score: 92,
    time: '2h',
  },
  {
    title: 'Best way to monitor Reddit for product mentions?',
    sub: 'r/startups',
    intent: 'warm',
    score: 78,
    time: '4h',
  },
  {
    title: 'Anyone using AI to generate Reddit replies for outreach?',
    sub: 'r/Entrepreneur',
    intent: 'hot',
    score: 88,
    time: '1h',
  },
];

export function ProductDemo() {
  return (
    <section className="py-8 sm:py-16">
      <div className="max-w-[980px] mx-auto px-6">
        <div className="reveal">
          {/* Browser frame */}
          <div className="rounded-2xl border border-border/60 overflow-hidden shadow-[0_32px_80px_-16px_rgba(0,0,0,0.08)]">
            {/* Chrome */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/40 border-b border-border/40">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-foreground/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-foreground/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-foreground/10" />
              </div>
              <div className="flex-1 mx-12">
                <div className="max-w-[280px] mx-auto bg-background/80 rounded-md px-3 py-1 text-[11px] text-muted-foreground text-center border border-border/40">
                  app.reddix.io/scanner
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="bg-background p-5 sm:p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-[13px] font-semibold text-foreground">Lead Scanner</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">3 new leads · Last scan 5m ago</p>
                </div>
                <Badge variant="secondary" className="text-[11px] h-6 px-2.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--success))] mr-1.5" />
                  Live
                </Badge>
              </div>

              <div className="space-y-1">
                {leads.map((lead, i) => (
                  <div
                    key={i}
                    className="group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    {/* Score pip */}
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0 ${
                        lead.intent === 'hot'
                          ? 'bg-red-50 text-red-500'
                          : 'bg-amber-50 text-amber-500'
                      }`}
                    >
                      {lead.score}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-foreground font-medium truncate leading-snug">
                        {lead.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {lead.sub} · {lead.time} ago
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button className="p-1.5 rounded-md hover:bg-muted">
                        <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                      <button className="p-1.5 rounded-md hover:bg-muted">
                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Reply preview */}
              <div className="mt-4 rounded-xl bg-muted/30 border border-border/40 p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-3 h-3 text-primary" />
                  <span className="text-[11px] font-medium text-muted-foreground">AI-drafted reply</span>
                </div>
                <p className="text-[13px] text-foreground leading-relaxed">
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
