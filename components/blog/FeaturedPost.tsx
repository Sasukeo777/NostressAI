'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { PillarBadge } from '@/components/ui/PillarBadge';
import type { BlogMeta } from '@/lib/types';
import { formatDateLabel } from '@/lib/utils/formatDate';

interface FeaturedPostProps {
    post: BlogMeta;
}

export function FeaturedPost({ post }: FeaturedPostProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="group relative overflow-hidden rounded-[2rem] border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-xl"
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-neutral-50 via-transparent to-transparent dark:from-white/5 dark:via-transparent dark:to-transparent opacity-50" />

            <div className="relative z-10 grid gap-8 p-8 md:grid-cols-2 md:p-12 lg:gap-12">
                <div className="flex flex-col justify-center space-y-6">
                    <div className="flex flex-wrap gap-2">
                        {post.pillars?.map((pillar) => (
                            <PillarBadge key={pillar} pillar={pillar} />
                        ))}
                    </div>

                    <div className="space-y-4">
                        <h2 className="font-serif text-3xl font-medium leading-tight text-neutral-900 dark:text-white md:text-4xl lg:text-5xl">
                            <Link href={`/blog/${post.slug}`} className="hover:underline decoration-primary-300 decoration-2 underline-offset-4 transition-all">
                                {post.title}
                            </Link>
                        </h2>
                        <p className="text-lg text-neutral-600 dark:text-neutral-400 line-clamp-3 leading-relaxed">
                            {post.excerpt}
                        </p>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-neutral-500 dark:text-neutral-400">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDateLabel(post.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>5 min read</span>
                        </div>
                    </div>

                    <div className="pt-4">
                        <Link
                            href={`/blog/${post.slug}`}
                            className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-105 active:scale-95 dark:bg-white dark:text-neutral-900"
                        >
                            Read article
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>

                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800 md:aspect-auto">
                    {post.heroImage ? (
                        <Image
                            src={post.heroImage}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                        />
                    ) : (
                        <>
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/20 dark:to-accent-900/20" />
                            <div className="absolute inset-0 flex items-center justify-center text-neutral-300 dark:text-neutral-700">
                                <span className="font-serif italic text-4xl opacity-20">NoStress AI</span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
