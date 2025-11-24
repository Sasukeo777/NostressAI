'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowUpRight } from 'lucide-react';
import { PillarBadge } from '@/components/ui/PillarBadge';
import type { BlogMeta } from '@/lib/types';
import { formatDateLabel } from '@/lib/utils/formatDate';

interface ArticleCardProps {
    post: BlogMeta;
    index: number;
}

export function ArticleCard({ post, index }: ArticleCardProps) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="group flex flex-col h-full"
        >
            <Link href={`/blog/${post.slug}`} className="block h-full">
                <div className="relative h-full overflow-hidden rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-neutral-200/50 dark:hover:shadow-black/50">

                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                            {post.pillars?.slice(0, 2).map((pillar) => (
                                <PillarBadge key={pillar} pillar={pillar} size="sm" />
                            ))}
                        </div>
                        <span className="text-neutral-400 transition-colors group-hover:text-primary-500">
                            <ArrowUpRight className="h-5 w-5" />
                        </span>
                    </div>

                    <h3 className="mb-3 font-serif text-xl font-medium leading-tight text-neutral-900 dark:text-white group-hover:underline decoration-primary-300/50 underline-offset-4">
                        {post.title}
                    </h3>

                    <p className="mb-6 flex-grow text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 line-clamp-3">
                        {post.excerpt}
                    </p>

                    <div className="mt-auto flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-500 border-t border-neutral-100 dark:border-white/5 pt-4">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{formatDateLabel(post.date)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            <span>~5 min</span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.article>
    );
}
