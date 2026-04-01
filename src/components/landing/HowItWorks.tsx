import { Globe, Radar, MessageCircle } from 'lucide-react';

const steps = [
  {
    icon: Globe,
    num: '01',
    title: 'Drop in your URL',
    body: 'We analyze your product, audience, and positioning in seconds.',
  },
  {
    icon: Radar,
    num: '02',
    title: 'AI scans Reddit 24/7',
    body: 'Relevant subreddits are monitored for high-intent buying signals.',
  },
  {
    icon: MessageCircle,
    num: '03',
    title: 'Reply & convert',
    body: 'Each lead arrives with a context-aware AI reply you can post instantly.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 sm:py-32">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-[13px] font-medium text-primary mb-3 tracking-wide uppercase">
            How it works
          </p>
          <h2 className="text-3xl sm:text-[40px] font-semibold tracking-[-0.02em] leading-tight">
            Three steps to{' '}
            <span className="font-display italic font-normal">warm leads</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`bento-card flex flex-col reveal reveal-delay-${i + 1}`}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center">
                  <step.icon className="w-5 h-5 text-foreground" />
                </div>
                <span className="text-[12px] font-mono text-muted-foreground/50">
                  {step.num}
                </span>
              </div>
              <h3 className="text-[17px] font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
