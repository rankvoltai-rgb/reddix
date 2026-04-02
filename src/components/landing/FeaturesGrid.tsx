import { Zap, Target, MessageSquare, Compass, BarChart3, Clock, Repeat, Globe, Shield, ArrowUpRight } from 'lucide-react';

function IntentDetectionUI() {
  return (
    <div className="space-y-1.5 mb-4">
      {[
        { text: '"Looking for a CRM tool"', score: 94, color: 'bg-red-500' },
        { text: '"Anyone tried Notion for PM?"', score: 62, color: 'bg-amber-400' },
        { text: '"Best SaaS tools 2026"', score: 31, color: 'bg-muted-foreground/30' },
      ].map((item, i) => (
        <div key={i} className="flex items-center gap-2.5 text-[11px] bg-background/50 rounded-lg px-2.5 py-1.5 border border-border/10">
          <div className={`w-6 h-6 rounded-md ${item.color} flex items-center justify-center`}>
            <span className="text-[9px] font-bold text-white">{item.score}</span>
          </div>
          <span className="text-muted-foreground truncate flex-1">{item.text}</span>
        </div>
      ))}
    </div>
  );
}

function LeadScoringUI() {
  const bars = [95, 82, 68, 45, 28];
  return (
    <div className="flex items-end gap-2 h-16 mb-4 px-2">
      {bars.map((h, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
          <div
            className="w-full rounded-t-md bg-gradient-to-t from-primary to-primary/60"
            style={{ height: `${h * 0.55}px`, opacity: 0.3 + (h / 100) * 0.7 }}
          />
          <span className="text-[9px] font-medium text-muted-foreground">{h}</span>
        </div>
      ))}
    </div>
  );
}

function AIReplyUI() {
  return (
    <div className="mb-4">
      <div className="rounded-xl bg-background/50 border border-border/20 px-3 py-2.5 text-[10px] text-muted-foreground leading-relaxed">
        <span className="text-foreground font-medium">"Check out Reddix</span> — it scans Reddit 24/7 and surfaces people looking for exactly what you build. <span className="text-primary font-medium">reddix.io</span>"
      </div>
      <div className="flex gap-1.5 mt-2">
        <div className="h-1.5 flex-1 rounded-full bg-emerald-500/60" />
        <div className="h-1.5 w-8 rounded-full bg-muted" />
      </div>
    </div>
  );
}

function SubredditUI() {
  return (
    <div className="flex flex-wrap gap-1.5 mb-4">
      {['r/SaaS', 'r/startups', 'r/Entrepreneur', 'r/marketing', '+12'].map((sub, i) => (
        <span
          key={i}
          className={`text-[9px] px-2.5 py-1 rounded-full border font-medium ${
            i < 3 ? 'border-primary/20 bg-primary/[0.04] text-primary' : 'border-border bg-muted/50 text-muted-foreground'
          }`}
        >
          {sub}
        </span>
      ))}
    </div>
  );
}

function AnalyticsUI() {
  return (
    <div className="mb-4 space-y-2.5">
      {[
        { label: 'Leads this week', value: '47', change: '+18%' },
        { label: 'Reply rate', value: '34%', change: '+6%' },
      ].map((stat, i) => (
        <div key={i} className="flex items-center justify-between bg-background/50 rounded-lg px-3 py-2 border border-border/10">
          <span className="text-[10px] text-muted-foreground">{stat.label}</span>
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold text-foreground">{stat.value}</span>
            <span className="text-[9px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">{stat.change}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ScheduleUI() {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-9 h-5 rounded-full bg-emerald-500 relative">
          <div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow-sm" />
        </div>
        <span className="text-[11px] font-semibold text-emerald-600">Auto-pilot active</span>
      </div>
      <div className="flex gap-1.5">
        {['6h', '12h', '24h'].map((freq, i) => (
          <span
            key={freq}
            className={`text-[10px] px-3 py-1 rounded-lg font-medium ${
              i === 0 ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'
            }`}
          >
            Every {freq}
          </span>
        ))}
      </div>
    </div>
  );
}

function DedupUI() {
  return (
    <div className="mb-4 space-y-1.5">
      {[
        { text: 'Post #4821', dup: true },
        { text: 'Post #4837', dup: false },
        { text: 'Post #4812', dup: true },
      ].map((p, i) => (
        <div key={i} className="flex items-center gap-2.5 text-[10px] bg-background/50 rounded-lg px-2.5 py-1.5 border border-border/10">
          <div className={`w-5 h-5 rounded-md flex items-center justify-center ${p.dup ? 'bg-muted' : 'bg-emerald-50'}`}>
            {p.dup ? <span className="text-[9px] text-muted-foreground">✕</span> : <span className="text-[9px] text-emerald-600">✓</span>}
          </div>
          <span className={p.dup ? 'text-muted-foreground/40 line-through' : 'text-muted-foreground font-medium'}>{p.text}</span>
        </div>
      ))}
    </div>
  );
}

function WebAnalysisUI() {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2.5 mb-2.5">
        <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center text-[9px] font-bold text-primary">R</div>
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full w-[85%] bg-primary rounded-full" />
        </div>
        <span className="text-[10px] font-semibold text-foreground">85%</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {['lead gen', 'reddit', 'SaaS', 'monitoring'].map((kw) => (
          <span key={kw} className="text-[9px] bg-primary/[0.04] border border-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{kw}</span>
        ))}
      </div>
    </div>
  );
}

function ToneUI() {
  return (
    <div className="mb-4 space-y-1.5">
      {[
        { tone: 'Casual', active: true },
        { tone: 'Professional', active: false },
        { tone: 'Witty', active: false },
      ].map((t) => (
        <div key={t.tone} className={`flex items-center gap-2.5 text-[11px] px-3 py-1.5 rounded-lg transition-all ${t.active ? 'bg-primary/[0.06] text-primary font-semibold border border-primary/10' : 'text-muted-foreground bg-background/50'}`}>
          <div className={`w-3 h-3 rounded-full border-2 ${t.active ? 'border-primary bg-primary' : 'border-muted-foreground/30'}`} />
          {t.tone}
        </div>
      ))}
    </div>
  );
}

const features = [
  { icon: Zap, title: 'Intent Detection', desc: 'AI spots genuine buying signals, not vanity mentions.', ui: IntentDetectionUI, accent: 'hover:border-red-200' },
  { icon: Target, title: 'Lead Scoring', desc: 'Every lead scored 0–100 based on purchase readiness.', ui: LeadScoringUI, accent: 'hover:border-amber-200' },
  { icon: MessageSquare, title: 'AI Replies', desc: "Context-aware drafts that match each subreddit's vibe.", ui: AIReplyUI, accent: 'hover:border-blue-200' },
  { icon: Compass, title: 'Subreddit Discovery', desc: 'AI finds communities where your ICP actively hangs out.', ui: SubredditUI, accent: 'hover:border-violet-200' },
  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Track leads, replies, and conversion rates — in real time.', ui: AnalyticsUI, accent: 'hover:border-emerald-200' },
  { icon: Clock, title: 'Scheduled Scans', desc: 'Auto-pilot scans Reddit on your schedule. Set and forget.', ui: ScheduleUI, accent: 'hover:border-teal-200' },
  { icon: Repeat, title: 'Deduplication', desc: 'Smart filtering — you never see the same post twice.', ui: DedupUI, accent: 'hover:border-orange-200' },
  { icon: Globe, title: 'Website Analysis', desc: 'Drop your URL — we extract keywords and positioning.', ui: WebAnalysisUI, accent: 'hover:border-pink-200' },
  { icon: Shield, title: 'Natural Tone', desc: 'Replies built to add value, never to sound like ads.', ui: ToneUI, accent: 'hover:border-indigo-200' },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-muted/30" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-radial-glow opacity-40" />
      
      <div className="relative max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/[0.06] border border-primary/10 text-[12px] font-medium text-primary mb-5">
            <Zap className="w-3.5 h-3.5" />
            9 features. Zero bloat.
          </div>
          <h2 className="text-3xl sm:text-[44px] font-semibold tracking-[-0.03em] leading-[1.1]">
            One tool.{' '}
            <span
              className="inline-flex items-center font-normal text-primary px-4 py-0.5 rounded-2xl border border-primary/[0.15] bg-primary/[0.04]"
              style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
            >
              Every weapon
            </span>{' '}
            you need.
          </h2>
          <p className="mt-5 text-[15px] text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Built by SaaS founders who were tired of spending 3 hours/day scrolling Reddit. Every feature replaces an entire workflow.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => {
            const MiniUI = f.ui;
            return (
              <div
                key={i}
                className={`group relative rounded-2xl border border-border/40 bg-gradient-to-br from-background to-muted/20 p-5 transition-all duration-500 ${f.accent} hover:shadow-[0_20px_50px_-12px_hsl(var(--foreground)/0.06)] hover:-translate-y-0.5 reveal overflow-hidden`}
                style={{ animationDelay: `${Math.min(i * 0.06, 0.4)}s` }}
              >
                {/* Hover arrow */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 -translate-x-1">
                  <ArrowUpRight className="w-4 h-4 text-primary/40" />
                </div>

                <MiniUI />
                
                <div className="flex items-center gap-2 mb-1.5">
                  <f.icon className="w-4 h-4 text-primary/60" />
                  <h3 className="text-[15px] font-semibold text-foreground">{f.title}</h3>
                </div>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
