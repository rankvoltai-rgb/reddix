import { Zap, Target, Compass, BarChart3, Shield, MessageSquare, Clock, Bell, Filter, Radar, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';

const showcases = [
  {
    tag: 'Intent Detection',
    icon: Zap,
    title: "Stop chasing mentions. Start closing buyers.",
    desc: "Most tools find noise. Reddix finds revenue. Our AI analyzes sentiment, context, and urgency to surface only the posts where someone is actively looking to buy, switch, or try something new.",
    features: [
      { icon: Target, text: 'Buying intent scored 0–100 with ML precision' },
      { icon: Filter, text: 'Noise-canceling filters eliminate tire-kickers' },
      { icon: Bell, text: 'Hot lead alerts hit your inbox instantly' },
    ],
    gradient: 'from-red-500/8 via-transparent to-orange-500/5',
    accentColor: 'text-red-500',
    demoUI: () => (
      <div className="space-y-3">
        {[
          { text: '"Need a tool to find leads on Reddit"', score: 96, intent: 'Hot', color: 'bg-red-500', barW: '96%' },
          { text: '"Best alternatives to BrandMonitor?"', score: 82, intent: 'Warm', color: 'bg-amber-400', barW: '82%' },
          { text: '"How do you do Reddit marketing?"', score: 34, intent: 'Low', color: 'bg-muted-foreground/30', barW: '34%' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 bg-background/60 rounded-xl p-3 border border-border/20">
            <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center shrink-0`}>
              <span className="text-[12px] font-bold text-white">{item.score}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] text-foreground font-medium truncate">{item.text}</p>
              <div className="mt-1.5 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className={`h-full ${item.color} rounded-full transition-all duration-700`} style={{ width: item.barW }} />
              </div>
            </div>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              item.intent === 'Hot' ? 'bg-red-50 text-red-600' : item.intent === 'Warm' ? 'bg-amber-50 text-amber-600' : 'bg-muted text-muted-foreground'
            }`}>{item.intent}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    tag: 'AI Replies',
    icon: MessageSquare,
    title: 'Replies so native, Redditors upvote them.',
    desc: "Forget generic templates. Reddix reads the entire thread, understands the vibe, and crafts a reply that sounds like a helpful community member — one who just happens to know the perfect tool.",
    features: [
      { icon: Shield, text: 'Tone-matched to each subreddit culture' },
      { icon: Compass, text: 'Full thread context analysis, not just keywords' },
      { icon: Clock, text: 'One-click copy → paste → convert' },
    ],
    gradient: 'from-blue-500/8 via-transparent to-violet-500/5',
    accentColor: 'text-blue-500',
    demoUI: () => (
      <div className="space-y-3">
        <div className="bg-background/60 rounded-xl p-4 border border-border/20">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-primary" />
            </div>
            <span className="text-[11px] font-semibold text-foreground">AI-Generated Reply</span>
            <span className="ml-auto text-[9px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-medium">Ready to post</span>
          </div>
          <p className="text-[13px] text-foreground/80 leading-[1.7] mb-3">
            "I had the exact same problem — was spending 3hrs/day manually searching Reddit. Started using <span className="text-primary font-medium">Reddix</span> and it literally does the scanning for me. Found 12 warm leads in my first week."
          </p>
          <div className="flex items-center gap-4 pt-3 border-t border-border/20">
            <span className="text-[10px] text-muted-foreground">🎯 Tone: Casual</span>
            <span className="text-[10px] text-muted-foreground">📝 186 chars</span>
            <span className="text-[10px] text-emerald-600 font-medium">✓ Reddit-safe</span>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 h-8 rounded-lg bg-foreground text-background flex items-center justify-center text-[11px] font-medium gap-1.5">
            Copy & Post <ArrowRight className="w-3 h-3" />
          </div>
          <div className="h-8 px-3 rounded-lg bg-muted flex items-center justify-center text-[11px] text-muted-foreground">
            Regenerate
          </div>
        </div>
      </div>
    ),
  },
  {
    tag: 'Auto-Pilot Mode',
    icon: BarChart3,
    title: 'Wake up to warm leads. Every. Single. Morning.',
    desc: "Set your scan frequency, pick your subreddits, and walk away. Reddix runs 24/7 on autopilot — discovering, scoring, and drafting replies while you focus on closing deals.",
    features: [
      { icon: Clock, text: 'Scan every 6h, 12h, or daily — your call' },
      { icon: Radar, text: 'AI discovers new subreddits you never knew existed' },
      { icon: TrendingUp, text: 'Built-in analytics track your Reddit ROI' },
    ],
    gradient: 'from-emerald-500/8 via-transparent to-teal-500/5',
    accentColor: 'text-emerald-500',
    demoUI: () => (
      <div className="space-y-3">
        <div className="bg-background/60 rounded-xl p-4 border border-border/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[12px] font-semibold text-foreground">Auto-Pilot Dashboard</span>
            <div className="flex items-center gap-2">
              <div className="w-8 h-4 rounded-full bg-emerald-500 relative">
                <div className="absolute right-0.5 top-0.5 w-3 h-3 rounded-full bg-white shadow-sm" />
              </div>
              <span className="text-[10px] font-medium text-emerald-600">Active</span>
            </div>
          </div>
          {[
            { label: 'Leads today', value: '14', change: '+5' },
            { label: 'Hot leads', value: '6', change: '+3' },
            { label: 'Replies drafted', value: '14', change: 'All' },
          ].map((row, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-t border-border/10">
              <span className="text-[11px] text-muted-foreground">{row.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold text-foreground">{row.value}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-medium">{row.change}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-1.5">
          {['6h', '12h', '24h'].map((freq, i) => (
            <span key={freq} className={`flex-1 text-center text-[10px] py-1.5 rounded-lg font-medium ${i === 0 ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'}`}>
              Every {freq}
            </span>
          ))}
        </div>
      </div>
    ),
  },
];

export function FeatureShowcase() {
  return (
    <section className="py-24 sm:py-32 relative">
      <div className="absolute inset-0 bg-dot-pattern opacity-20" />
      
      <div className="relative max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/[0.06] border border-primary/10 text-[12px] font-medium text-primary mb-5">
            <Target className="w-3.5 h-3.5" />
            Built for founders who ship fast
          </div>
          <h2 className="text-3xl sm:text-[46px] font-semibold tracking-[-0.03em] leading-[1.1]">
            Not another monitoring tool —
            <br />
            <span
              className="font-normal text-primary"
              style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
            >
              your Reddit revenue engine
            </span>
          </h2>
          <p className="mt-5 text-[15px] text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Three power features that turn Reddit from a time sink into your highest-converting acquisition channel.
          </p>
        </div>

        <div className="space-y-20">
          {showcases.map((s, i) => {
            const DemoUI = s.demoUI;
            return (
              <div key={i} className={`reveal`} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={`flex flex-col ${i % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-10 lg:gap-14 items-center`}>
                  {/* Text side */}
                  <div className="flex-1">
                    <div className="tag-pill border-primary/15 bg-primary/[0.04] text-primary mb-5">
                      <s.icon className="w-3.5 h-3.5" />
                      {s.tag}
                    </div>
                    <h3 className="text-[26px] sm:text-[32px] font-semibold text-foreground tracking-[-0.02em] leading-[1.15] mb-4">
                      {s.title}
                    </h3>
                    <p className="text-[15px] text-muted-foreground leading-[1.7] mb-7">
                      {s.desc}
                    </p>
                    <div className="space-y-3">
                      {s.features.map((f, j) => (
                        <div key={j} className="flex items-center gap-3 group/feat">
                          <div className="w-9 h-9 rounded-xl bg-muted/80 border border-border/20 flex items-center justify-center shrink-0 group-hover/feat:bg-primary/[0.06] transition-colors">
                            <f.icon className="w-4 h-4 text-foreground/50 group-hover/feat:text-primary transition-colors" />
                          </div>
                          <span className="text-[14px] text-muted-foreground">{f.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Demo UI side */}
                  <div className="flex-1 w-full">
                    <div className={`rounded-2xl border border-border/30 bg-gradient-to-br ${s.gradient} p-5 sm:p-6 transition-all duration-500 hover:shadow-[0_24px_60px_-12px_hsl(var(--foreground)/0.06)]`}>
                      <DemoUI />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
