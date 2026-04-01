import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { MessageSquare, TrendingUp, ExternalLink } from 'lucide-react';

const sampleLeads = [
  {
    title: 'Looking for a tool to find leads on Reddit automatically',
    subreddit: 'r/SaaS',
    intent: 'hot' as const,
    score: 92,
    time: '2h ago',
  },
  {
    title: 'Best way to monitor Reddit for product mentions?',
    subreddit: 'r/startups',
    intent: 'warm' as const,
    score: 78,
    time: '4h ago',
  },
  {
    title: 'Anyone using AI to generate Reddit replies for outreach?',
    subreddit: 'r/Entrepreneur',
    intent: 'hot' as const,
    score: 88,
    time: '1h ago',
  },
];

const intentStyles: Record<string, string> = {
  hot: 'intent-hot',
  warm: 'intent-warm',
};

export function ProductDemo() {
  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-fade-in">
          {/* Browser chrome */}
          <div className="rounded-xl border border-border overflow-hidden shadow-2xl shadow-foreground/5">
            {/* Title bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-muted/60 border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[hsl(0,70%,65%)]" />
                <div className="w-3 h-3 rounded-full bg-[hsl(45,80%,60%)]" />
                <div className="w-3 h-3 rounded-full bg-[hsl(130,50%,55%)]" />
              </div>
              <div className="flex-1 mx-8">
                <div className="max-w-md mx-auto bg-background rounded-md px-3 py-1 text-xs text-muted-foreground text-center border border-border">
                  app.reddix.io/scanner
                </div>
              </div>
            </div>

            {/* App content */}
            <div className="bg-background p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Lead Scanner</h3>
                  <p className="text-xs text-muted-foreground">3 new leads found</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Live
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                {sampleLeads.map((lead, i) => (
                  <Card
                    key={i}
                    className="p-3 flex items-start justify-between gap-3 hover:bg-muted/50 transition-colors cursor-default"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] text-muted-foreground font-medium">
                          {lead.subreddit}
                        </span>
                        <span className="text-[11px] text-muted-foreground">·</span>
                        <span className="text-[11px] text-muted-foreground">{lead.time}</span>
                      </div>
                      <p className="text-sm text-foreground font-medium truncate">
                        {lead.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${intentStyles[lead.intent]}`}
                      >
                        {lead.score}% match
                      </span>
                      <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
                      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                  </Card>
                ))}
              </div>

              {/* AI Reply preview */}
              <div className="mt-4 p-3 rounded-lg bg-muted/40 border border-border">
                <p className="text-[11px] font-medium text-muted-foreground mb-1.5">
                  ✨ AI-generated reply
                </p>
                <p className="text-sm text-foreground leading-relaxed">
                  "Check out Reddix — it monitors Reddit 24/7 and surfaces posts where people
                  are actively looking for tools like yours. reddix.io"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
