import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/blog';
import { getPostMdx } from '@/lib/mdx';
import { mdxComponents } from '@/components/blog/MDXComponents';
import { ArticleShell } from '@/components/layout/ArticleShell';
import { MiniTOC } from '@/components/ui/MiniTOC';
import { ReadingProgress } from '@/components/blog/ReadingProgress';
import { BackToTop } from '@/components/blog/BackToTop';
import { InteractiveCTA } from '@/components/blog/InteractiveCTA';
import { InteractiveArticleModal } from '@/components/blog/InteractiveArticleModal';
import { PillarBadge } from '@/components/ui/PillarBadge';
import * as runtime from 'react/jsx-runtime';
import React from 'react';
import { formatDateLabel } from '@/lib/utils/formatDate';

// export async function generateStaticParams() {
//   const posts = await getAllPosts();
//   return posts.map((p) => ({ slug: p.slug }));
// }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostMdx(slug);
  if (!post) return {};
  const title = post.meta.title || slug.replace(/-/g, ' ');
  const description = post.meta.excerpt || post.excerpt;
  const ogUrl = `/api/og?title=${encodeURIComponent(title)}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [ogUrl],
      type: 'article'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogUrl]
    }
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const compiled = await getPostMdx(slug);
  if (!compiled) return notFound();

  // Build the MDX component from the compiled code function body
  const { code, meta, excerpt, interactiveHtml } = compiled;

  console.log(`[BlogPost Debug] Slug: ${slug}`);
  console.log(`[BlogPost Debug] interactiveHtml present:`, !!interactiveHtml);
  console.log(`[BlogPost Debug] interactiveHtml length:`, interactiveHtml?.length);
  console.log(`[BlogPost Debug] meta.interactive:`, meta.interactive);

  // eslint-disable-next-line no-new-func
  const MDXContent = new Function(String(code))({ ...runtime, components: mdxComponents }).default;

  const breadcrumb = (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap gap-1 text-neutral-500 dark:text-neutral-400">
        <li>
          <a href="/" className="hover:text-primary-600 dark:hover:text-primary-400">
            Home
          </a>
        </li>
        <li className="opacity-50">/</li>
        <li>
          <a href="/blog" className="hover:text-primary-600 dark:hover:text-primary-400">
            Blog
          </a>
        </li>
        <li className="opacity-50">/</li>
        <li aria-current="page" className="font-medium text-neutral-700 dark:text-neutral-300">
          {meta.title || slug.replace(/-/g, ' ')}
        </li>
      </ol>
    </nav>
  );

  return (
    <div className="relative">
      <ReadingProgress />
      <ArticleShell
        breadcrumb={breadcrumb}
        toc={<MiniTOC containerSelector="#blog-article" />}
      >
        <header className="mb-12 relative overflow-hidden rounded-[2rem] border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-white/5 p-8 md:p-12 shadow-sm" data-fade-section>
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-transparent to-transparent dark:from-primary-900/10 pointer-events-none" />

          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {meta.category && (
                <span className="inline-flex items-center rounded-full bg-primary-100 dark:bg-primary-900/30 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary-700 dark:text-primary-300">
                  {meta.category}
                </span>
              )}
              {meta.readingTime && (
                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  · {meta.readingTime}
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium leading-[1.1] tracking-tight text-neutral-900 dark:text-white mb-6">
              {meta.title || slug.replace(/-/g, ' ')}
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-center gap-6 border-t border-neutral-200 dark:border-white/10 pt-6">
              {meta.date && (
                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <span className="block h-1 w-1 rounded-full bg-neutral-400" />
                  Published on {formatDateLabel(meta.date)}
                </div>
              )}

              {meta.pillars && Array.isArray(meta.pillars) && meta.pillars.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {meta.pillars.map((pillar: any) => (
                    <PillarBadge key={pillar} pillar={pillar} href={`/blog?pillar=${pillar}`} size="sm" />
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        <article
          id="blog-article"
          className="blog-article prose prose-neutral dark:prose-invert max-w-none text-[1.05rem] leading-relaxed md:text-[1.12rem] md:leading-[1.8]"
        >
          <script
            type="application/ld+json"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Article',
                headline: meta.title || slug,
                datePublished: meta.date || new Date().toISOString(),
                dateModified: meta.date || new Date().toISOString(),
                description: meta.excerpt || excerpt,
                author: {
                  '@type': 'Person',
                  name: meta.author || 'NoStress AI',
                  url: 'https://www.nostress.ai/about'
                },
                publisher: {
                  '@type': 'Organization',
                  name: 'NoStress AI',
                  logo: {
                    '@type': 'ImageObject',
                    url: 'https://www.nostress.ai/favicon.svg'
                  }
                },
                mainEntityOfPage: {
                  '@type': 'WebPage',
                  '@id': `https://www.nostress.ai/blog/${slug}`
                }
              })
            }}
          />
          <script
            type="application/ld+json"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                itemListElement: [
                  {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Home',
                    item: 'https://www.nostress.ai'
                  },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Blog',
                    item: 'https://www.nostress.ai/blog'
                  },
                  {
                    '@type': 'ListItem',
                    position: 3,
                    name: meta.title || slug,
                    item: `https://www.nostress.ai/blog/${slug}`
                  }
                ]
              })
            }}
          />
          <MDXContent />

          {(interactiveHtml || meta.interactive) ? (
            <section className="mt-16 mb-12 flex flex-col items-center justify-center rounded-[3rem] border border-primary-200/60 dark:border-primary-700/40 bg-gradient-to-b from-primary-50/60 to-transparent dark:from-primary-900/10 dark:to-transparent px-6 py-20 text-center shadow-[inset_0_0_60px_-10px_rgba(var(--primary-500),0.1)] relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--primary-500),0.05),transparent_70%)] pointer-events-none" />
              <h2 className="mb-4 text-2xl font-serif font-medium text-primary-800 dark:text-primary-100">
                Want to try this yourself?
              </h2>
              <p className="mb-8 max-w-md text-neutral-600 dark:text-neutral-300">
                We&apos;ve built an interactive playground for you to experiment with the concepts from this article.
              </p>
              <InteractiveArticleModal
                htmlContent={interactiveHtml}
                iframeUrl={meta.interactive ? `/interactive/${meta.interactive}` : null}
              />
            </section>
          ) : null}
        </article>
      </ArticleShell>
      <BackToTop />
    </div>
  );
}
