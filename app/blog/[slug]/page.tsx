import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/blog';
import { getPostMdx } from '@/lib/mdx';
import { mdxComponents } from '@/components/MDXComponents';
import { ArticleShell } from '@/components/layout/ArticleShell';
import { MiniTOC } from '@/components/ui/MiniTOC';
import { ReadingProgress } from '@/components/blog/ReadingProgress';
import { BackToTop } from '@/components/blog/BackToTop';
import { InteractiveCTA } from '@/components/blog/InteractiveCTA';
import { PillarBadge } from '@/components/ui/PillarBadge';
import * as runtime from 'react/jsx-runtime';
import React from 'react';
import { formatDateLabel } from '@/lib/utils/formatDate';

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostMdx(params.slug);
  if (!post) return {};
  const title = post.meta.title || params.slug.replace(/-/g, ' ');
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

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const compiled = await getPostMdx(params.slug);
  if (!compiled) return notFound();

  // Build the MDX component from the compiled code function body
  const { code, meta, excerpt, interactiveHtml } = compiled;
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
          {meta.title || params.slug.replace(/-/g, ' ')}
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
        <header className="mb-10" data-fade-section>
          {meta.category && (
            <p className="text-xs font-mono uppercase tracking-[0.25em] text-primary-600 dark:text-primary-400 mb-3">
              {meta.category}
            </p>
          )}
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight tracking-tight text-primary-700 dark:text-primary-200">
            {meta.title || params.slug.replace(/-/g, ' ')}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
            {meta.date && <span>Published on {formatDateLabel(meta.date)}</span>}
            {meta.readingTime && <span>{meta.readingTime}</span>}
          </div>
          {meta.pillars && Array.isArray(meta.pillars) && meta.pillars.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {meta.pillars.map((pillar: any) => (
                <PillarBadge key={pillar} pillar={pillar} href={`/blog?pillar=${pillar}`} />
              ))}
            </div>
          )}
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
                headline: meta.title || params.slug,
                datePublished: meta.date || new Date().toISOString(),
                dateModified: meta.date || new Date().toISOString(),
                description: meta.excerpt || excerpt,
                author: meta.author ? { '@type': 'Person', name: meta.author } : undefined,
                mainEntityOfPage: {
                  '@type': 'WebPage',
                  '@id': `https://www.nostress.ai/blog/${params.slug}`
                }
              })
            }}
          />
          <MDXContent />
          {interactiveHtml ? (
            <section className="mt-12 rounded-2xl border border-primary-200/60 dark:border-primary-700/40 bg-primary-50/60 dark:bg-primary-900/10 px-6 py-5">
              <h2 className="mb-3 text-lg font-semibold text-primary-700 dark:text-primary-200">Interactive version</h2>
              <div
                className="interactive-embed space-y-4 overflow-x-auto"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: interactiveHtml }}
              />
            </section>
          ) : null}
          {meta.interactive && <InteractiveCTA slug={meta.interactive} />}
        </article>
      </ArticleShell>
      <BackToTop />
    </div>
  );
}
