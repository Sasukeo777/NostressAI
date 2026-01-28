'use client';

import Link from 'next/link';
import Image from 'next/image';
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
                <div className="relative h-full overflow-hidden rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-neutral-200/50 dark:hover:shadow-black/50">

                    {/* Hero Image */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                        {post.heroImage ? (
                            <Image
                                src={post.heroImage}
                                alt={post.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/20 dark:to-accent-900/20" />
                        )}
                        <span className="absolute top-3 right-3 text-neutral-400 transition-colors group-hover:text-primary-500 bg-white/80 dark:bg-black/50 rounded-full p-1.5 backdrop-blur-sm">
                            <ArrowUpRight className="h-4 w-4" />
                        </span>
                    </div>

                    <div className="p-5">
                        {/* Pillar badges */}
                        <div className="mb-3 flex flex-wrap gap-2">
                            {post.pillars?.slice(0, 2).map((pillar) => (
                                <PillarBadge key={pillar} pillar={pillar} size="sm" />
                            ))}
                        </div>

                        <h3 className="mb-2 font-serif text-lg font-medium leading-tight text-neutral-900 dark:text-white group-hover:underline decoration-primary-300/50 underline-offset-4 line-clamp-2">
                            {post.title}
                        </h3>

                        <p className="mb-4 flex-grow text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 line-clamp-2">
                            {post.excerpt}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-500 border-t border-neutral-100 dark:border-white/5 pt-3">
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
                </div>
            </Link>
        </motion.article>
    );
}
