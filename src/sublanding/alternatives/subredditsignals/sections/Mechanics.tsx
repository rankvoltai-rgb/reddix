import { Link } from 'react-router-dom';
import { ArrowRight, Gauge, Route } from 'lucide-react';
import { Band, LINE, SectionHead } from '@/components/landing/frame';
import { Reveal } from '@/components/landing/shared';
import { cn } from '@/lib/utils';
import { DELIVERY, SCORING } from '../content';

/* Two spec sheets side by side. The scales are drawn, not filled: neither
   vendor's numbers for a real post are shown, only the shape of each model. */
export function Scoring() {
  const { them, reddix } = SCORING;
  return (
    <section aria-labelledby="scoring-title">
      <SectionHead icon={Gauge} eyebrow={SCORING.pill} title={<span id="scoring-title">{SCORING.title}</span>} subtitle={SCORING.body} />
      <Band inner="grid lg:grid-cols-2">
        <Reveal className={cn('border-b px-6 py-9 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-12', LINE)}>
          <h3 className="text-[1.15rem] font-semibold tracking-[-0.015em] text-ink">{them.name}</h3>
          <p className="mt-1 text-[0.92rem] text-muted-foreground">{them.lead}</p>
          <ul aria-label="Scoring dimensions, each 1 to 10" className="mt-6 space-y-2.5">
            {them.dimensions.map((d) => (
              <li key={d} className="grid grid-cols-[8.5rem_minmax(0,1fr)] items-center gap-3 text-[0.82rem] sm:grid-cols-[11rem_minmax(0,1fr)]">
                <span className="font-medium text-ink/80">{d}</span>
                <span aria-hidden className="flex gap-[3px]">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <span key={i} className={cn('h-2.5 flex-1 rounded-[2px]', i >= 6 ? 'bg-ink/[0.14]' : 'bg-ink/[0.06]')} />
                  ))}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-right text-[0.7rem] text-muted-foreground">1 to 10 each · darker cells: 7 and up</p>
          <ul className="mt-6 space-y-3 text-[0.9rem] leading-relaxed text-ink/80">
            {them.points.map((p) => (
              <li key={p} className="border-l-2 border-ink/10 pl-3">
                {p}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[0.8rem] text-muted-foreground">{them.note}</p>
        </Reveal>

        <Reveal delay={0.08} className="bg-surface/60 px-6 py-9 sm:px-10 lg:px-12 lg:py-12">
          <h3 className="text-[1.15rem] font-semibold tracking-[-0.015em] text-ink">{reddix.name}</h3>
          <p className="mt-1 text-[0.92rem] text-muted-foreground">{reddix.lead}</p>
          <div aria-hidden className="mt-6">
            <div className="flex h-9 gap-[3px] overflow-hidden rounded-lg">
              <span className="flex flex-[25] items-center justify-center bg-ink/[0.08] text-[0.7rem] font-semibold text-ink/50">Low</span>
              <span className="flex flex-[15] items-center justify-center bg-cta/25 text-[0.7rem] font-semibold text-ink/60">
                <span className="hidden sm:inline">Research</span>
              </span>
              <span className="flex flex-[30] items-center justify-center bg-cta/55 text-[0.7rem] font-semibold text-white">Warm</span>
              <span className="flex flex-[30] items-center justify-center bg-cta text-[0.7rem] font-semibold text-white">Hot</span>
            </div>
            <div className="mt-2 flex justify-between text-[0.7rem] tabular-nums text-muted-foreground">
              <span>0</span>
              <span>100</span>
            </div>
          </div>
          <ul className="mt-6 space-y-3 text-[0.9rem] leading-relaxed text-ink/80">
            {reddix.points.map((p) => (
              <li key={p} className="border-l-2 border-cta/30 pl-3">
                {p}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[0.8rem] text-muted-foreground">{reddix.note}</p>
          <Link to={reddix.link.to} className="group mt-3 inline-flex items-center gap-1.5 text-[0.85rem] font-semibold text-cta hover:text-cta-hover">
            {reddix.link.label}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </Band>
    </section>
  );
}

/* Two lanes, three stops each. The difference is who starts the lane: a
   stranger posting, or you pressing Scan. */
export function Delivery() {
  const lanes = [
    { ...DELIVERY.them, start: 'Starts when someone posts', tone: 'them' as const },
    { ...DELIVERY.reddix, start: 'Starts when you press Scan', tone: 'reddix' as const },
  ];
  return (
    <section aria-labelledby="delivery-title">
      <SectionHead icon={Route} eyebrow={DELIVERY.pill} title={<span id="delivery-title">{DELIVERY.title}</span>} subtitle={DELIVERY.body} />
      {lanes.map((lane, li) => (
        <Band key={lane.name} inner={cn('grid lg:grid-cols-[12rem_minmax(0,1fr)]', li === 1 && 'bg-surface/50')}>
          <div className={cn('border-b px-6 py-6 sm:px-10 lg:border-b-0 lg:border-r lg:px-8 lg:py-8', LINE)}>
            <p className={cn('text-[1.02rem] font-semibold', lane.tone === 'reddix' ? 'text-cta' : 'text-ink')}>{lane.name}</p>
            <p className="mt-1 text-[0.8rem] text-muted-foreground">{lane.start}</p>
          </div>
          <ol className="grid sm:grid-cols-3">
            {lane.steps.map((s, i) => (
              <li key={s.label} className={cn('relative px-6 py-6 sm:px-8 lg:py-8', i > 0 && 'border-t sm:border-l sm:border-t-0', LINE)}>
                <Reveal delay={i * 0.08}>
                  <span
                    className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-full text-[0.7rem] font-semibold tabular-nums',
                      lane.tone === 'reddix' ? 'bg-cta text-white' : 'bg-ink text-white',
                    )}
                  >
                    {i + 1}
                  </span>
                  <p className="mt-3 text-[0.95rem] font-semibold leading-snug text-ink">{s.label}</p>
                  <p className="mt-1.5 text-[0.84rem] leading-relaxed text-muted-foreground">{s.detail}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </Band>
      ))}
      <Band inner="px-6 py-8 sm:px-10 lg:px-12">
        <p className="mx-auto max-w-3xl text-center text-[1rem] leading-relaxed text-ink sm:text-[1.08rem]">{DELIVERY.takeaway}</p>
      </Band>
    </section>
  );
}
