/**
 * A comparison page's link to the roundup on the same tool: this page is one
 * tool against Reddix, the post is every option. It appears once the post is
 * live, so a page never links to something that isn't there yet.
 */
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Band, Spacer } from '@/components/landing/frame';
import { guideIsLive } from '@/lib/blog/schedule';

export function RelatedGuide({ slug, title, body }: { slug: string; title: string; body: string }) {
  if (!guideIsLive(slug)) return null;
  return (
    <>
      <Band>
        <Link
          to={`/blog/${slug}`}
          className="group flex flex-col gap-3 px-6 py-7 transition-colors hover:bg-surface/60 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-12"
        >
          <span>
            <span className="block text-[1.05rem] font-semibold tracking-[-0.01em] text-ink">{title}</span>
            <span className="mt-1 block max-w-2xl text-[0.9rem] leading-relaxed text-muted-foreground">{body}</span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-ink/30 transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-cta" />
        </Link>
      </Band>
      <Spacer />
    </>
  );
}
