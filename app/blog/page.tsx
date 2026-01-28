import { getAllPosts } from '@/lib/blog';
import { BlogIndex } from '@/components/blog/BlogIndex';
import type { HolisticPillar } from '@/lib/types';
import { PILLAR_IDS } from '@/lib/pillars';

// export const dynamic = 'force-dynamic'; // Incompatible with cacheComponents

import { Suspense } from 'react';

async function BlogContent({ searchParams }: { searchParams: Promise<{ pillar?: string }> }) {
  const posts = await getAllPosts();
  const { pillar } = await searchParams;
  const initialPillar = pillar && PILLAR_IDS.includes(pillar as HolisticPillar)
    ? (pillar as HolisticPillar)
    : undefined;

  return <BlogIndex posts={posts} initialPillar={initialPillar} />;
}

export default function BlogPage({ searchParams }: { searchParams: Promise<{ pillar?: string }> }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div className="flex h-96 w-full items-center justify-center text-neutral-500">Loading articles...</div>}>
        <BlogContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
