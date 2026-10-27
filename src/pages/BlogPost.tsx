import { useMemo, useRef, type CSSProperties, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Reveal } from '@/components/landing/shared';
import { Band, CELL, CellGrid, GHOST_BUTTON, LINE, Spacer } from '@/components/landing/frame';
import { ArticleBody } from '@/components/blog/ArticleBody';
import { AuthorCard, AuthorMark, BlogCta, RailCta, ReadingProgress, ShareButtons, TableOfContents } from '@/components/blog/ArticleChrome';
import { CoverArt } from '@/components/blog/CoverArt';
import { PostCard, PostStamp } from '@/components/blog/PostCards';
import { faqForSchema, formatDate, getPost, listPosts, outlineArticle, relatedPosts, SITE_URL, tableOfContents } from '@/lib/blog';
import type { PostFull, PostMeta } from '@/lib/blog/types';
import { usePageMeta } from '@/hooks/usePageMeta';
import { cn } from '@/lib/utils';

function Shell({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-white font-jakarta">
        <Navbar framed />
        <main className="pt-16">{children}</main>
        <Footer />
      </div>
    </MotionConfig>
  );
}

function PostNotFound() {
  usePageMeta({ title: 'Post not found | Reddix Blog', description: 'This article may have moved or been unpublished.', path: '/blog', noindex: true });
  return (
    <Shell>
      <Band inner="px-5 py-32 text-center">
        <h1 className="text-2xl font-medium tracking-[-0.02em] text-ink">Post not found</h1>
        <p className="mt-3 text-muted-foreground">This article may have moved or been unpublished.</p>
        <Link to="/blog" className="mt-6 inline-flex h-10 items-center rounded-lg bg-cta px-5 text-sm font-semibold text-white transition-colors hover:bg-cta-hover">
          Back to the blog
        </Link>
      </Band>
      <Spacer closing />
    </Shell>
  );
}

export default function BlogPost() {
  const { slug = '' } = useParams();
  const post = useMemo(() => getPost(slug), [slug]);
  if (!post) return <PostNotFound />;
  // Keyed so moving between articles starts each one fresh (scroll-spy, progress).
  return <Article key={post.slug} post={post} />;
}

/* The article in the landing page's frame: the header split by a hairline,
   the cover inset in its own cell; the text column beside a rail that holds
   the contents and the offer; then more reading in hairline cells. */
function Article({ post }: { post: PostFull }) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const article = useMemo(() => ({ published: post.date, modified: post.updated, tags: post.tags }), [post]);
  usePageMeta({
    title: `${post.title} | Reddix`,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    image: `${SITE_URL}/og/blog/${post.slug}.jpg`,
    article,
  });

  const outline = useMemo(() => outlineArticle(post.blocks), [post.blocks]);
  const toc = useMemo(() => tableOfContents(outline), [outline]);
  const related = useMemo<PostMeta[]>(() => relatedPosts(post, listPosts()), [post]);
  const bodyRef = useRef<HTMLDivElement>(null);
  const topic = post.tags[0];

  const jsonLd = useMemo(() => {
    const faq = faqForSchema(post.blocks);
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BlogPosting',
          '@id': `${url}#article`,
          headline: post.title,
          description: post.excerpt,
          datePublished: post.date,
          dateModified: post.updated,
          wordCount: post.wordCount,
          keywords: [post.keyword, ...post.tags].filter(Boolean).join(', '),
          articleSection: topic,
          inLanguage: 'en',
          author: { '@type': 'Organization', name: post.author, url: SITE_URL },
          publisher: { '@type': 'Organization', name: 'Reddix', url: SITE_URL, logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.png` } },
          mainEntityOfPage: url,
          ...(post.cover ? { image: `${SITE_URL}${post.cover}` } : {}),
        },
        ...(faq.length
          ? [
              {
                '@type': 'FAQPage',
                '@id': `${url}#faq`,
                mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
              },
            ]
          : []),
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
            { '@type': 'ListItem', position: 3, name: post.title, item: url },
          ],
        },
      ],
    };
  }, [post, url, topic]);

  return (
    <Shell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ReadingProgress target={bodyRef} />
      <article>
        {/* ---------- header ---------- */}
        <header className="relative bg-white">
          <div className={cn('relative mx-auto grid max-w-6xl border-x lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]', LINE)}>
            <div className="flex flex-col justify-center px-5 pb-10 pt-8 motion-safe:animate-hero-rise sm:px-10 lg:py-14 lg:pl-12 lg:pr-10">
              <nav aria-label="Breadcrumb">
                <ol className="flex items-center gap-1.5 text-[0.8rem] text-muted-foreground">
                  <li>
                    <Link to="/blog" className="py-2 transition-colors hover:text-ink">
                      Blog
                    </Link>
                  </li>
                  {topic && (
                    <>
                      <ChevronRight aria-hidden className="h-3.5 w-3.5 text-ink/25" />
                      <li>
                        <Link to={`/blog?topic=${encodeURIComponent(topic)}`} className="py-2 font-medium text-cta transition-colors hover:text-cta-hover">
                          {topic}
                        </Link>
                      </li>
                    </>
                  )}
                </ol>
              </nav>
              <h1 className="mt-5 text-balance text-[2.05rem] font-medium leading-[1.1] tracking-[-0.03em] text-ink sm:text-[2.7rem] lg:text-[2.9rem]">
                {post.title}
              </h1>
              {post.excerpt && <p className="mt-5 max-w-2xl text-[1.05rem] leading-relaxed text-muted-foreground sm:text-[1.15rem]">{post.excerpt}</p>}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-5">
                <div className="flex items-center gap-3">
                  <AuthorMark className="h-10 w-10" />
                  <div className="text-sm leading-tight">
                    <p className="font-semibold text-ink">{post.author}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      <PostStamp post={post} />
                      {post.updated !== post.date && <> · Updated {formatDate(post.updated)}</>}
                    </p>
                  </div>
                </div>
                <ShareButtons url={url} title={post.title} />
              </div>
            </div>
            {/* The cover, inset in its own cell with a hairline of white around it. */}
            <div className={cn('border-t p-3 motion-safe:animate-hero-rise lg:border-l lg:border-t-0', LINE)} style={{ '--rise-delay': '0.08s' } as CSSProperties}>
              <div className="h-full overflow-hidden rounded-lg border border-ink/[0.06]">
                <CoverArt post={post} className="aspect-[16/11] h-full w-full lg:aspect-auto lg:min-h-[22rem]" />
              </div>
            </div>
          </div>
        </header>

        {/* ---------- body + rail ---------- */}
        <Band inner="grid lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div ref={bodyRef} className="min-w-0 px-5 py-10 sm:px-10 lg:py-14 lg:pl-12 lg:pr-14">
            <div className="max-w-[43rem]">
              <TableOfContents entries={toc} variant="inline" className="mb-10 lg:hidden" />
              <ArticleBody outline={outline} share={{ url, title: post.title }} />
              <footer className={cn('mt-14 space-y-8 border-t pt-10', LINE)}>
                <div className="flex flex-wrap items-center justify-between gap-5">
                  {post.tags.length > 0 && (
                    <ul aria-label="Topics" className="flex flex-wrap gap-2">
                      {post.tags.map((t) => (
                        <li key={t}>
                          <Link
                            to={`/blog?topic=${encodeURIComponent(t)}`}
                            className="inline-flex h-8 items-center rounded-lg border border-ink/[0.08] bg-white px-3 text-[0.8rem] font-medium text-ink/75 transition-colors hover:border-cta/30 hover:text-cta"
                          >
                            {t}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                  <ShareButtons url={url} title={post.title} />
                </div>
                <AuthorCard author={post.author} />
              </footer>
            </div>
          </div>
          <aside className={cn('hidden border-l lg:block', LINE)}>
            <div className="sticky top-24 max-h-[calc(100dvh-7rem)] space-y-8 overflow-y-auto px-6 py-14 [scrollbar-width:none]">
              <TableOfContents entries={toc} variant="rail" />
              <RailCta />
            </div>
          </aside>
        </Band>
      </article>

      {/* ---------- keep reading ---------- */}
      {related.length > 0 && (
        <section aria-labelledby="related-title">
          <Spacer />
          <Band inner="flex items-end justify-between gap-4 px-6 py-8 sm:px-10 lg:px-12">
            <h2 id="related-title" className="text-[1.6rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.9rem]">
              Keep reading
            </h2>
            <Link to="/blog" className={cn(GHOST_BUTTON, 'group/btn shrink-0')}>
              All articles
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
            </Link>
          </Band>
          <Band>
            <CellGrid className="sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <li key={p.slug} className={CELL}>
                  <Reveal delay={i * 0.06} className="h-full">
                    <PostCard post={p} />
                  </Reveal>
                </li>
              ))}
            </CellGrid>
          </Band>
        </section>
      )}
      <BlogCta />
    </Shell>
  );
}
