import { getAllPosts } from '@/lib/blog';
import { BlogIndex } from '@/components/blog/BlogIndex';
import type { HolisticPillar } from '@/lib/types';
import { PILLAR_IDS } from '@/lib/pillars';

export const dynamic = 'force-dynamic';

export default async function BlogPage({ searchParams }: { searchParams?: { pillar?: string } }) {
  const posts = await getAllPosts();
  const pillarParam = searchParams?.pillar;
  const initialPillar = pillarParam && PILLAR_IDS.includes(pillarParam as HolisticPillar)
    ? (pillarParam as HolisticPillar)
    : undefined;

  return <BlogIndex posts={posts} initialPillar={initialPillar} />;
}
