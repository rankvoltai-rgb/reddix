import { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';

const faqs = [
  {
    q: 'How does Reddix actually find leads?',
    a: 'Our AI agents scan hundreds of subreddits 24/7 for posts where people express genuine buying intent — asking for recommendations, comparing tools, or describing problems your product solves. Each lead is scored 0–100 based on conversion likelihood.',
  },
  {
    q: 'Do I need a Reddit account?',
    a: 'Not to discover leads. Reddix scans publicly available Reddit posts. You only need your own Reddit account when you want to post replies. We generate the reply for you — just copy, paste, and post.',
  },
  {
    q: "Won't my replies look spammy?",
    a: "No. Our AI is specifically tuned for Reddit culture. Replies are contextual, helpful, and mention your product the way a real community member would — like recommending something they genuinely use and love. Zero self-promo vibes.",
  },
  {
    q: 'How accurate is the intent scoring?',
    a: 'Extremely. We analyze post content, context, subreddit norms, and engagement patterns. Hot leads (80+ score) have a 3–5x higher reply engagement rate compared to generic mentions. You can filter by score to focus on the highest-value opportunities.',
  },
  {
    q: 'What is the Lifetime plan?',
    a: "For $150 one-time, you get lifetime access to all premium features: unlimited leads, unlimited subreddits, priority scanning, advanced analytics, team collaboration, and priority support. No recurring charges ever.",
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Absolutely. No contracts, no commitments, no guilt trips. Cancel from your settings page and keep access until the end of your billing period.',
  },
  {
    q: 'How does auto-pilot work?',
    a: 'Configure your product, select subreddits, pick your scan frequency (every 6h, 12h, or daily), and enable auto-pilot. Reddix scans automatically and surfaces new leads with AI replies ready to go. Wake up to warm opportunities.',
  },
  {
    q: 'What subreddits can Reddix monitor?',
    a: "Any public subreddit. Our AI also suggests communities you didn't even know existed — based on your product's positioning and target audience. Premium users get unlimited subreddit monitoring.",
  },
];

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`border-b border-border/20 last:border-b-0 transition-colors ${open ? 'bg-primary/[0.01]' : ''}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 px-1 text-left group"
      >
        <div className="flex items-center gap-3">
          <span className="text-[12px] font-mono text-muted-foreground/30 w-6 shrink-0">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="text-[15px] font-medium text-foreground group-hover:text-primary transition-colors">
            {q}
          </span>
        </div>
        <div className={`w-7 h-7 rounded-lg border border-border/30 flex items-center justify-center shrink-0 transition-all duration-300 ${open ? 'bg-primary border-primary' : 'bg-muted/50'}`}>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-all duration-300 ${
              open ? 'rotate-180 text-white' : 'text-muted-foreground'
            }`}
          />
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? 'max-h-[500px] pb-5' : 'max-h-0'
        }`}
      >
        <p className="text-[14px] text-muted-foreground leading-[1.7] pl-9 pr-10">
          {a}
        </p>
      </div>
    </div>
  );
}

export function FAQSection() {
  return (
    <section id="faq" className="py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-muted/30" />
      
      <div className="relative max-w-[750px] mx-auto px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/[0.06] border border-primary/10 text-[12px] font-medium text-primary mb-5">
            <HelpCircle className="w-3.5 h-3.5" />
            Got questions? We've got answers.
          </div>
          <h2 className="text-3xl sm:text-[44px] font-semibold tracking-[-0.03em] leading-[1.1]">
            Frequently asked{' '}
            <span
              className="inline-flex items-center font-normal text-primary px-4 py-0.5 rounded-2xl border border-primary/[0.15] bg-primary/[0.04]"
              style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
            >
              questions
            </span>
          </h2>
        </div>

        <div className="rounded-2xl border border-border/40 bg-background p-6 sm:p-8 shadow-[0_12px_40px_-12px_hsl(var(--foreground)/0.04)] reveal">
          {faqs.map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-8 text-center reveal" style={{ animationDelay: '0.2s' }}>
          <div className="inline-flex items-center gap-2 text-[14px] text-muted-foreground">
            <MessageCircle className="w-4 h-4" />
            Still have questions?{' '}
            <a href="mailto:support@reddix.io" className="text-primary font-medium hover:underline">
              Reach out anytime
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
