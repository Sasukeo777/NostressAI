'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PillarFilters } from '@/components/ui/PillarFilters';
import { FeaturedPost } from '@/components/blog/FeaturedPost';
import { ArticleCard } from '@/components/blog/ArticleCard';
import type { BlogMeta, HolisticPillar } from '@/lib/types';
import { PILLAR_IDS } from '@/lib/pillars';

interface BlogIndexProps {
    posts: BlogMeta[];
    initialPillar?: HolisticPillar;
}

export function BlogIndex({ posts, initialPillar }: BlogIndexProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activePillar, setActivePillar] = useState<HolisticPillar | undefined>(initialPillar);

    // Filter posts based on search query and active pillar
    const filteredPosts = useMemo(() => {
        return posts.filter((post) => {
            const matchesSearch =
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesPillar = activePillar
                ? post.pillars?.includes(activePillar)
                : true;

            return matchesSearch && matchesPillar;
        });
    }, [posts, searchQuery, activePillar]);

    // Determine featured post (first post if no filters are active)
    const showFeatured = !searchQuery && !activePillar && filteredPosts.length > 0;
    const featuredPost = showFeatured ? filteredPosts[0] : null;
    const gridPosts = showFeatured ? filteredPosts.slice(1) : filteredPosts;

    return (
        <div className="site-container pb-20">
            <SectionHeading title="Articles & Analysis" eyebrow="Blog" />

            {/* Controls */}
            <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <PillarFilters
                    active={activePillar}
                    onChange={(pillar) => setActivePillar(pillar as HolisticPillar | undefined)}
                    className="mb-0"
                />

                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-full border border-neutral-200 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:focus:border-primary-400"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="space-y-16">
                {featuredPost && (
                    <section>
                        <FeaturedPost post={featuredPost} />
                    </section>
                )}

                {gridPosts.length > 0 ? (
                    <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {gridPosts.map((post, index) => (
                            <ArticleCard key={post.slug} post={post} index={index} />
                        ))}
                    </section>
                ) : (
                    <div className="py-20 text-center">
                        <p className="text-neutral-500 dark:text-neutral-400">
                            No articles found matching your criteria.
                        </p>
                        <button
                            onClick={() => { setSearchQuery(''); setActivePillar(undefined); }}
                            className="mt-4 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
