/**
 * The landing page's last band: a red block inside the rails, the promise in
 * white, one button, and a Reddit thread rising from the band's lower edge,
 * cropped by it. The hero's radar returns here in white, so the page opens
 * and closes on the same motif.
 *
 * A white closing band follows, so this block and the red footer under it
 * read as two things rather than one long field.
 *
 * Same copy as <FinalCTA>, which the feature and use-case pages still use.
 */
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUp, Flame, MessageSquare } from 'lucide-react';
import { HeroRadar } from './hero-radar';
import { RedditMark } from './subreddit-ticker';
import { Reveal, SubredditIcon } from './shared';
import { Band, Spacer } from './frame';

function ThreadCard() {
  return (
    <div className="rounded-xl rounded-b-none bg-white p-5 shadow-[0_-12px_48px_-16px_rgba(72,4,8,0.55)] sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2">
          <SubredditIcon name="r/startups" className="h-6 w-6 text-[0.65rem]" />
          <span className="text-sm font-semibold text-ink">r/startups</span>
          <span className="text-[0.72rem] text-muted-foreground">· just now</span>
        </span>
        <span className="inline-flex items-center gap-1 rounded-md bg-cta-soft px-1.5 py-0.5 text-[0.68rem] font-semibold text-cta">
          <Flame className="h-3 w-3" />
          Hot · 93
        </span>
      </div>
      <p className="mt-3 text-[1rem] font-semibold leading-snug text-ink">
        What do you use to find your first 100 customers?
      </p>
      <p className="mt-1 flex items-center gap-3 text-[0.72rem] text-muted-foreground">
        <span className="flex items-center gap-1">
          <ArrowUp className="h-3.5 w-3.5" />
          112
        </span>
        <span className="flex items-center gap-1">
          <MessageSquare className="h-3.5 w-3.5" />
          41 comments
        </span>
      </p>
      <div className="mt-4 rounded-lg border border-cta/25 bg-cta-soft/60 p-3.5">
        <p className="flex items-center gap-1.5 text-[0.7rem] font-semibold text-cta">
          <RedditMark className="h-3.5 w-3.5" />
          Your reply, drafted
        </p>
        <p className="mt-1.5 text-[0.85rem] leading-relaxed text-ink/85">
          Honestly, Reddit threads like this one. We stopped searching by hand and let{' '}
          <span className="font-semibold text-ink underline decoration-cta/60 decoration-2 underline-offset-2">Reddix</span>{' '}
          flag the posts where people are asking for a tool like ours.
        </p>
      </div>
    </div>
  );
}

export function ClosingCTA() {
  return (
    <section>
      <Spacer />
      <Band inner="overflow-hidden bg-cta">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.22] [mask-image:radial-gradient(ellipse_70%_80%_at_50%_45%,#000_40%,transparent_100%)]"
        >
          <HeroRadar className="text-white" />
        </div>

        <div className="relative px-5 pt-16 text-center font-jakarta sm:px-8 sm:pt-20">
          <Reveal>
            <h2 className="mx-auto max-w-2xl text-balance text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.75rem]">
              Your next 100 customers are posting on Reddit right now
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-balance text-[1rem] leading-relaxed text-white sm:text-[1.05rem]">
              They're asking for recommendations, comparing tools, and describing the exact problem you solve. Show up
              before your competitor does.
            </p>
            <Link
              to="/auth"
              className="group mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-white px-5 text-[0.95rem] font-semibold text-cta shadow-[0_1px_2px_rgba(72,4,8,0.2),0_8px_24px_-12px_rgba(72,4,8,0.5)] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-white/95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
            >
              Start finding leads — free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <p className="mt-3.5 text-[0.82rem] font-medium text-white">No credit card · 2-minute setup · Cancel anytime</p>
          </Reveal>

          {/* The thread rises from the band's foot and is cut off by it. */}
          <Reveal delay={0.12} y={40} className="mx-auto mt-12 h-[14rem] max-w-xl overflow-hidden text-left sm:mt-14 sm:h-[15.5rem]">
            <ThreadCard />
          </Reveal>
        </div>
      </Band>
      <Spacer closing />
    </section>
  );
}
