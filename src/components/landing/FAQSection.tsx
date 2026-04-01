import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'How does Reddix find leads on Reddit?',
    a: 'Reddix uses AI to scan hundreds of subreddits for posts where people express buying intent — asking for tool recommendations, comparing products, or describing problems your product solves. Each lead is scored 0–100 based on how likely they are to convert.',
  },
  {
    q: 'Do I need a Reddit account to use Reddix?',
    a: 'Not to find leads. Reddix scans publicly available Reddit posts. You only need a Reddit account when you want to post replies. We generate the reply for you — just copy, paste, and post.',
  },
  {
    q: 'Will my replies look spammy?',
    a: 'No. Our AI is specifically trained on Reddit culture and tone. Replies are contextual, helpful, and mention your product naturally — the way a real community member would recommend something they use and love.',
  },
  {
    q: 'How accurate is the intent scoring?',
    a: 'Very. We analyze post content, context, subreddit norms, and engagement patterns. Hot leads (80+ score) typically have a 3–5x higher reply engagement rate compared to generic mentions. You can filter by score to focus on the best opportunities.',
  },
  {
    q: 'What happens on the free plan?',
    a: 'You get 10 leads per day across 4 subreddits with full AI reply generation. It\'s enough to validate the tool and start seeing results. Upgrade to Premium for unlimited leads, unlimited subreddits, and priority scanning.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes, absolutely. No contracts, no commitments. Cancel your subscription anytime from your settings page and you\'ll keep access until the end of your billing period.',
  },
  {
    q: 'How does auto-pilot work?',
    a: 'Once you configure your product and select subreddits, enable auto-pilot and choose your scan frequency (every 6 hours, 12 hours, or daily). Reddix will automatically scan and surface new leads to your dashboard without you needing to click anything.',
  },
  {
    q: 'What subreddits does Reddix monitor?',
    a: 'Reddix monitors any public subreddit you choose. Our AI also suggests relevant subreddits based on your product — you might discover communities you didn\'t even know existed. Premium users get unlimited subreddit monitoring.',
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border/30 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
      >
        <span className="text-[15px] font-medium text-foreground group-hover:text-primary transition-colors">
          {q}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? 'max-h-[500px] pb-5' : 'max-h-0'
        }`}
      >
        <p className="text-[14px] text-muted-foreground leading-[1.7] pr-8">
          {a}
        </p>
      </div>
    </div>
  );
}

export function FAQSection() {
  return (
    <section id="faq" className="py-24 sm:py-32 bg-muted/20">
      <div className="max-w-[700px] mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-[13px] font-medium text-primary mb-3 tracking-wide uppercase">
            FAQ
          </p>
          <h2 className="text-3xl sm:text-[40px] font-semibold tracking-[-0.02em] leading-tight">
            Common{' '}
            <span className="font-display italic font-normal">questions</span>
          </h2>
        </div>

        <div className="bento-card reveal">
          {faqs.map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
