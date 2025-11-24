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

function Blockquote(props: any) {
  return <blockquote className="border-l-4 border-primary-400/60 pl-4 italic text-neutral-700 dark:text-neutral-300" {...props} />;
}

function Code(props: any) {
  return <code className="rounded bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 text-[13px]" {...props} />;
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
