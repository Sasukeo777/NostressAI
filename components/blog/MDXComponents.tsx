import React from 'react';
import { PreCode } from '@/components/blog/PreCode';

const Heading = (Tag: any) => function H(props: any) {
  const raw = props.children;
  const text = typeof raw === 'string' ? raw : Array.isArray(raw) ? raw.filter(Boolean).join(' ') : '';
  const generatedId = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const id = props.id || generatedId;
  const Comp: any = Tag;
  return (
    <Comp id={id} className="group scroll-mt-24 relative">
      <span>{props.children}</span>
      <a href={`#${id}`} className="opacity-0 group-hover:opacity-100 ml-2 text-primary-500 no-underline text-sm absolute -right-6 top-1/2 -translate-y-1/2" aria-label="Lien vers ce titre">#</a>
    </Comp>
  );
};

import { Quote } from 'lucide-react';

function Blockquote(props: any) {
  return (
    <div className="relative my-8 rounded-2xl bg-primary-50/50 dark:bg-primary-900/10 p-6 sm:p-8">
      <Quote className="absolute top-6 left-6 h-8 w-8 text-primary-200 dark:text-primary-800/50 -z-10" />
      <blockquote className="relative z-10 text-lg font-medium italic leading-relaxed text-primary-900 dark:text-primary-100" {...props} />
    </div>
  );
}

function Code(props: any) {
  return (
    <code
      className="rounded-md bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 text-[0.9em] font-mono text-primary-700 dark:text-primary-300 border border-neutral-200 dark:border-neutral-700"
      {...props}
    />
  );
}

// Pre wrapper now delegated to client component PreCode to keep this module server-compatible
function Pre(props: any) { return <PreCode {...props} />; }

export const mdxComponents = {
  h1: Heading('h1'),
  h2: Heading('h2'),
  h3: Heading('h3'),
  h4: Heading('h4'),
  blockquote: Blockquote,
  code: Code,
  pre: Pre
};
