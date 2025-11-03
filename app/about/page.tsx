import type { Metadata } from 'next';
import { cache } from 'react';
import * as runtime from 'react/jsx-runtime';
import React from 'react';

import { ArticleShell } from '@/components/layout/ArticleShell';
import { MiniTOC } from '@/components/ui/MiniTOC';
import { NewsletterSignup } from '@/components/ui/NewsletterSignup';
import { getAboutContentWithFallback } from '@/lib/server/about';
import { compile } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import { getHighlighter } from 'shiki';
import { mdxComponents } from '@/components/MDXComponents';

export const metadata: Metadata = {
  title: 'About | NoStress AI',
  description: 'NoStress AI manifesto – intentional AI, cognitive sobriety, clarity and human rhythms.',
  alternates: {
    canonical: 'https://www.nostress.ai/about'
  },
  openGraph: {
    type: 'article',
    title: 'About | NoStress AI',
    description: 'NoStress AI manifesto – intentional AI, cognitive sobriety, clarity and human rhythms.',
    url: 'https://www.nostress.ai/about'
  }
};

const getAboutContent = cache(async () => getAboutContentWithFallback());

async function compileAboutMdx(source: string) {
  const highlighter = await getHighlighter({
    themes: ['github-light', 'github-dark'],
    langs: ['javascript', 'typescript', 'tsx', 'bash', 'json', 'markdown']
  });

  const transformed = source.replace(/```(\w+)?\n([\s\S]*?)```/g, (_match: string, lang?: string, codeBlock?: string) => {
    const language = (lang || 'text').toLowerCase();
    const block = codeBlock ?? '';
    try {
      const htmlLight = highlighter.codeToHtml(block.trim(), { lang: language, theme: 'github-light' });
      const htmlDark = highlighter.codeToHtml(block.trim(), { lang: language, theme: 'github-dark' });
      return `\n<div class="code-block not-prose"><div class="hidden dark:block">${htmlDark}</div><div class="dark:hidden">${htmlLight}</div></div>\n`;
    } catch {
      return _match;
    }
  });

  const compiled = await compile(transformed, {
    outputFormat: 'function-body',
    development: false,
    jsxRuntime: 'automatic',
    remarkPlugins: [remarkGfm]
  });

  // eslint-disable-next-line no-new-func
  return new Function(String(compiled))({ ...runtime, components: mdxComponents }).default as React.ComponentType;
}

export default async function AboutPage() {
  const about = await getAboutContent();
  const MDXContent = about ? await compileAboutMdx(about.body_mdx) : null;

  const breadcrumb = (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap gap-1 text-neutral-500 dark:text-neutral-400">
        <li><a href="/" className="hover:text-primary-600 dark:hover:text-primary-400">Home</a></li>
        <li className="opacity-50">/</li>
        <li aria-current="page" className="font-medium text-neutral-700 dark:text-neutral-300">About</li>
      </ol>
    </nav>
  );

  return (
    <ArticleShell breadcrumb={breadcrumb} toc={<MiniTOC containerSelector="#about-article" />}>
      <header className="mb-16" data-fade-section>
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-primary-600 dark:text-primary-400 mb-4">Manifesto</p>
        <h1 className="text-5xl md:text-6xl font-semibold leading-[1.05] tracking-tight mb-6 bg-gradient-to-r from-primary-500 via-teal-500 to-sky-500 bg-clip-text text-transparent">
          {about.heading}
        </h1>
        <p className="text-xl md:text-2xl leading-relaxed text-neutral-700 dark:text-neutral-200 max-w-3xl font-light">
          Cognitive clarity. Human rhythms. Intentional AI. We help design lean systems that lighten the mind instead of cluttering it.
        </p>
      </header>

      <article id="about-article" className="prose prose-neutral dark:prose-invert max-w-none text-[1.125rem] leading-relaxed md:text-[1.17rem] md:leading-[1.75]">
        {MDXContent ? <MDXContent /> : <p>About content coming soon.</p>}
        <section id="newsletter" className="scroll-mt-32" data-fade-section>
          <div className="not-prose relative overflow-hidden rounded-2xl border border-primary-500/25 bg-gradient-to-br from-primary-600/15 via-teal-500/10 to-sky-500/10 dark:from-primary-500/20 dark:via-teal-500/15 p-8 md:p-10">
            <div className="absolute inset-0 [mask-image:radial-gradient(circle_at_30%_35%,black,transparent)] opacity-40 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,.4),transparent_60%)] dark:opacity-30" />
            <div className="relative">
              <NewsletterSignup />
            </div>
          </div>
        </section>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            name: 'About NoStress AI',
            url: 'https://www.nostress.ai/about',
            inLanguage: 'en',
            description: 'NoStress AI manifesto – intentional AI, cognitive sobriety and attention ecology.'
          })
        }}
      />
    </ArticleShell>
  );
}
