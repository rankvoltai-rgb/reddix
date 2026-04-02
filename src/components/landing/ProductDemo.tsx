import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, ExternalLink, Sparkles, ArrowUpRight, Copy, TrendingUp, Star, ChevronRight } from 'lucide-react';

const leads = [
  { title: 'Looking for a tool to find leads on Reddit automatically', sub: 'r/SaaS', intent: 'hot' as const, score: 92, time: '2h', author: 'u/founderben' },
  { title: 'Best way to monitor Reddit for product mentions?', sub: 'r/startups', intent: 'warm' as const, score: 78, time: '4h', author: 'u/sarahgrows' },
  { title: 'Anyone using AI to generate Reddit replies for outreach?', sub: 'r/Entrepreneur', intent: 'hot' as const, score: 88, time: '1h', author: 'u/alexscale' },
  { title: 'Need a Reddit monitoring tool for my SaaS — any recs?', sub: 'r/growthacking', intent: 'hot' as const, score: 95, time: '30m', author: 'u/mkdev' },
];

const intentColors = {
  hot: { bg: 'bg-red-500', text: 'text-white', label: 'Hot' },
  warm: { bg: 'bg-amber-400', text: 'text-amber-950', label: 'Warm' },
};

export function ProductDemo() {
  return (
    <section className="py-12 sm:py-20">
      <div className="max-w-[1080px] mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-[13px] font-medium text-primary mb-3 tracking-wide uppercase">
            Live preview
          </p>
          <h2 className="text-2xl sm:text-[34px] font-semibold tracking-[-0.02em] leading-tight">
            Your dashboard, ready to go
          </h2>
          <p className="mt-3 text-[15px] text-muted-foreground max-w-md mx-auto">
            Scored leads, AI-drafted replies, and one-click actions — all in one view.
          </p>
        </div>

        <div className="reveal">
          <div className="rounded-2xl border border-border/40 overflow-hidden shadow-[0_48px_100px_-24px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.03)]">
            {/* Chrome bar */}
            <div className="flex items-center gap-3 px-4 py-2.5 bg-[hsl(0,0%,97%)] border-b border-border/30">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                <div className="w-3 h-3 rounded-full bg-[#28C840]" />
              </div>
              <div className="flex-1 mx-8">
                <div className="max-w-[320px] mx-auto flex items-center gap-2 bg-background rounded-lg px-3 py-1.5 border border-border/40">
                  <div className="w-3 h-3 rounded-sm bg-primary/20 flex items-center justify-center">
                    <span className="text-[6px] text-primary font-bold">R</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">app.reddix.io/scanner</span>
                </div>
              </div>
            </div>

            {/* App layout */}
            <div className="bg-background flex">
              {/* Mini sidebar */}
              <div className="hidden sm:flex w-[200px] border-r border-border/20 bg-[hsl(0,0%,98.5%)] flex-col p-3 shrink-0">
                <div className="flex items-center gap-2 px-2 py-1.5 mb-4">
                  <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
                    <span className="text-[9px] text-white font-bold">R</span>
                  </div>
                  <span className="text-[12px] font-semibold text-foreground">Reddix</span>
                </div>

                {['Scanner', 'Leads', 'Dashboard', 'Settings'].map((item, i) => (
                  <div
                    key={item}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] mb-0.5 ${
                      i === 0
                        ? 'bg-primary/[0.06] text-foreground font-medium'
                        : 'text-muted-foreground hover:bg-muted/50'
                    }`}
                  >
                    {item}
                  </div>
                ))}

                {/* Usage indicator */}
                <div className="mt-auto pt-4 border-t border-border/20">
                  <div className="px-2">
                    <div className="flex items-center justify-between text-[10px] mb-1.5">
                      <span className="text-muted-foreground">Daily leads</span>
                      <span className="font-medium text-foreground">7/10</span>
                    </div>
                    <div className="h-1 bg-muted rounded-full overflow-hidden">
                      <div className="h-full w-[70%] bg-primary rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Main content */}
              <div className="flex-1 p-4 sm:p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-[14px] font-semibold text-foreground">Lead Scanner</h3>
                      <Badge variant="secondary" className="text-[10px] h-5 px-2 font-medium gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--success))] animate-pulse" />
                        Live
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">4 high-intent leads · Last scan 3m ago</p>
                  </div>
                  <Button size="sm" className="h-7 text-[11px] px-3 rounded-lg">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Scan now
                  </Button>
                </div>

                {/* Filters row */}
                <div className="flex items-center gap-2 mb-3">
                  {['All leads', 'Hot', 'Warm', 'Research'].map((filter, i) => (
                    <button
                      key={filter}
                      className={`text-[11px] px-2.5 py-1 rounded-md transition-colors ${
                        i === 0
                          ? 'bg-foreground text-background font-medium'
                          : 'text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                {/* Lead rows */}
                <div className="border border-border/30 rounded-xl overflow-hidden">
                  {leads.map((lead, i) => {
                    const intent = intentColors[lead.intent];
                    return (
                      <div
                        key={i}
                        className={`group flex items-center gap-3 px-3.5 py-3 hover:bg-muted/30 transition-all duration-200 ${
                          i < leads.length - 1 ? 'border-b border-border/20' : ''
                        }`}
                      >
                        {/* Score */}
                        <div className={`w-8 h-8 rounded-lg ${intent.bg} flex items-center justify-center shrink-0`}>
                          <span className={`text-[11px] font-bold ${intent.text}`}>{lead.score}</span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] text-foreground font-medium truncate leading-snug">
                            {lead.title}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] font-medium text-primary/70">{lead.sub}</span>
                            <span className="text-[10px] text-muted-foreground/40">·</span>
                            <span className="text-[10px] text-muted-foreground">{lead.author}</span>
                            <span className="text-[10px] text-muted-foreground/40">·</span>
                            <span className="text-[10px] text-muted-foreground">{lead.time} ago</span>
                          </div>
                        </div>

                        {/* Intent badge */}
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          lead.intent === 'hot' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {intent.label}
                        </span>

                        {/* Actions */}
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button className="p-1.5 rounded-md hover:bg-muted"><MessageSquare className="w-3.5 h-3.5 text-muted-foreground" /></button>
                          <button className="p-1.5 rounded-md hover:bg-muted"><ExternalLink className="w-3.5 h-3.5 text-muted-foreground" /></button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* AI reply panel */}
                <div className="mt-4 rounded-xl border border-primary/15 bg-gradient-to-br from-primary/[0.02] via-transparent to-primary/[0.01] overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-primary/10 bg-primary/[0.02]">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-[12px] font-semibold text-foreground">AI Reply Draft</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground px-2 py-1 rounded-md hover:bg-muted transition-colors">
                        <Star className="w-3 h-3" />
                        Rate
                      </button>
                      <button className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground px-2 py-1 rounded-md hover:bg-muted transition-colors">
                        <Copy className="w-3 h-3" />
                        Copy
                      </button>
                      <button className="flex items-center gap-1 text-[11px] bg-foreground text-background px-2.5 py-1 rounded-md font-medium hover:bg-foreground/90 transition-colors">
                        Copy & go
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-[13px] text-foreground/80 leading-[1.65]">
                      "Check out Reddix — it monitors Reddit 24/7 and surfaces posts where people are actively looking for tools like yours. Saved us hours of manual searching. <span className="text-primary">reddix.io</span>"
                    </p>
                    <div className="flex items-center gap-3 mt-2.5 pt-2.5 border-t border-border/20">
                      <span className="text-[10px] text-muted-foreground">142 characters</span>
                      <span className="text-[10px] text-muted-foreground/40">·</span>
                      <span className="text-[10px] text-[hsl(var(--success))] font-medium">Tone: Casual</span>
                      <span className="text-[10px] text-muted-foreground/40">·</span>
                      <button className="text-[10px] text-primary hover:underline">Regenerate</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
