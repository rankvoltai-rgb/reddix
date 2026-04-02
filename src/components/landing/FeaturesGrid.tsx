import { Zap, Target, MessageSquare, Compass, BarChart3, Clock, Repeat, Globe, Shield, Star, TrendingUp, ArrowUpRight } from 'lucide-react';

/* Each feature card has a mini functional UI instead of just an icon */

function IntentDetectionUI() {
  return (
    <div className="space-y-1.5 mb-4">
      {[
        { text: '"Looking for a CRM tool"', score: 94, color: 'bg-red-500' },
        { text: '"Anyone tried Notion for PM?"', score: 62, color: 'bg-amber-400' },
        { text: '"Best SaaS tools 2026"', score: 31, color: 'bg-muted-foreground/30' },
      ].map((item, i) => (
        <div key={i} className="flex items-center gap-2 text-[11px]">
          <div className={`w-5 h-5 rounded ${item.color} flex items-center justify-center`}>
            <span className="text-[8px] font-bold text-white">{item.score}</span>
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
    <div className="flex items-end gap-1.5 h-12 mb-4">
      {bars.map((h, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t-sm bg-primary/70"
            style={{ height: `${h * 0.45}px`, opacity: 0.3 + (h / 100) * 0.7 }}
          />
          <span className="text-[8px] text-muted-foreground">{h}</span>
        </div>
      ))}
    </div>
  );
}

function AIReplyUI() {
  return (
    <div className="mb-4">
      <div className="rounded-lg bg-muted/40 border border-border/30 px-2.5 py-2 text-[10px] text-muted-foreground leading-relaxed">
        <span className="text-foreground">"Check out Reddix</span> — it monitors Reddit 24/7 and finds people asking for tools like yours. <span className="text-primary">reddix.io</span>"
      </div>
      <div className="flex gap-1.5 mt-1.5">
        <div className="h-1 flex-1 rounded-full bg-[hsl(var(--success))]" />
        <div className="h-1 w-6 rounded-full bg-muted" />
      </div>
    </div>
  );
}

function SubredditUI() {
  return (
    <div className="flex flex-wrap gap-1 mb-4">
      {['r/SaaS', 'r/startups', 'r/Entrepreneur', 'r/marketing', '+12'].map((sub, i) => (
        <span
          key={i}
          className={`text-[9px] px-2 py-0.5 rounded-full border ${
            i < 3 ? 'border-primary/20 bg-primary/[0.04] text-primary' : i === 4 ? 'border-border bg-muted text-muted-foreground' : 'border-border bg-muted/50 text-muted-foreground'
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
    <div className="mb-4 space-y-2">
      {[
        { label: 'Leads this week', value: '47', change: '+18%', up: true },
        { label: 'Reply rate', value: '34%', change: '+6%', up: true },
      ].map((stat, i) => (
        <div key={i} className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground">{stat.label}</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-foreground">{stat.value}</span>
            <span className="text-[9px] text-[hsl(var(--success))] font-medium">{stat.change}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ScheduleUI() {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-4 rounded-full bg-[hsl(var(--success))] relative">
          <div className="absolute right-0.5 top-0.5 w-3 h-3 rounded-full bg-white" />
        </div>
        <span className="text-[10px] font-medium text-[hsl(var(--success))]">Auto-pilot on</span>
      </div>
      <div className="flex gap-1">
        {['6h', '12h', '24h'].map((freq, i) => (
          <span
            key={freq}
            className={`text-[9px] px-2 py-0.5 rounded ${
              i === 0 ? 'bg-foreground text-background font-medium' : 'bg-muted text-muted-foreground'
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
    <div className="mb-4 space-y-1">
      {[
        { text: 'Post #4821', dup: true },
        { text: 'Post #4837', dup: false },
        { text: 'Post #4812', dup: true },
      ].map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-[10px]">
          <div className={`w-4 h-4 rounded flex items-center justify-center ${p.dup ? 'bg-muted' : 'bg-[hsl(var(--success))]/10'}`}>
            {p.dup ? <span className="text-[8px] text-muted-foreground">—</span> : <span className="text-[8px] text-[hsl(var(--success))]">✓</span>}
          </div>
          <span className={p.dup ? 'text-muted-foreground/40 line-through' : 'text-muted-foreground'}>{p.text}</span>
        </div>
      ))}
    </div>
  );
}

function WebAnalysisUI() {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-5 h-5 rounded bg-muted flex items-center justify-center text-[8px] font-bold text-muted-foreground">R</div>
        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full w-[85%] bg-primary rounded-full" />
        </div>
        <span className="text-[9px] text-muted-foreground">85%</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {['lead gen', 'reddit', 'SaaS'].map((kw) => (
          <span key={kw} className="text-[8px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{kw}</span>
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
        <div key={t.tone} className={`flex items-center gap-2 text-[10px] px-2 py-1 rounded ${t.active ? 'bg-primary/[0.06] text-primary font-medium' : 'text-muted-foreground'}`}>
          <div className={`w-2.5 h-2.5 rounded-full border-2 ${t.active ? 'border-primary bg-primary' : 'border-muted-foreground/30'}`} />
          {t.tone}
        </div>
      ))}
    </div>
  );
}

const features = [
  { icon: Zap, title: 'Intent Detection', desc: 'AI spots genuine buying signals, not just keyword mentions.', ui: IntentDetectionUI },
  { icon: Target, title: 'Lead Scoring', desc: 'Every lead scored 0-100 based on purchase readiness.', ui: LeadScoringUI },
  { icon: MessageSquare, title: 'AI Replies', desc: "Context-aware drafts that match each subreddit's culture.", ui: AIReplyUI },
  { icon: Compass, title: 'Subreddit Discovery', desc: 'AI suggests communities where your audience discusses problems.', ui: SubredditUI },
  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Track leads, replies, and conversion rates in real time.', ui: AnalyticsUI },
  { icon: Clock, title: 'Scheduled Scans', desc: 'Auto-pilot scans Reddit on your schedule — daily or hourly.', ui: ScheduleUI },
  { icon: Repeat, title: 'Deduplication', desc: 'Smart filtering ensures you never see the same post twice.', ui: DedupUI },
  { icon: Globe, title: 'Website Analysis', desc: 'Drop your URL and we extract keywords and positioning instantly.', ui: WebAnalysisUI },
  { icon: Shield, title: 'Natural Tone', desc: 'Replies designed to add value, not feel like ads or spam.', ui: ToneUI },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="py-24 sm:py-32 bg-muted/20">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-[13px] font-medium text-primary mb-3 tracking-wide uppercase">
            Everything included
          </p>
          <h2 className="text-3xl sm:text-[40px] font-semibold tracking-[-0.02em] leading-tight">
            One tool,{' '}
            <span
              className="font-normal text-primary"
              style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
            >
              every feature
            </span>{' '}
            you need
          </h2>
          <p className="mt-4 text-[15px] text-muted-foreground max-w-lg mx-auto">
            Built by SaaS founders, for SaaS founders. Every feature replaces hours of manual Reddit work.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {features.map((f, i) => {
            const MiniUI = f.ui;
            return (
              <div
                key={i}
                className={`bento-card group reveal overflow-hidden`}
                style={{ animationDelay: `${Math.min(i * 0.06, 0.4)}s` }}
              >
                <MiniUI />
                <h3 className="text-[14px] font-semibold text-foreground mb-1">{f.title}</h3>
                <p className="text-[12px] text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
