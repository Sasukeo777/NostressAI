'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Clock, Users } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { Formation } from '@/lib/types';

interface CourseCardProps {
    course: Formation;
}

const statusColors = {
    soon: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    prelaunch: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    available: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
};

const statusLabels = {
    soon: 'Coming Soon',
    prelaunch: 'Pre-launch',
    available: 'Available Now',
};

export function CourseCard({ course }: CourseCardProps) {
    return (
        <Link href={`/courses/${course.slug}`} className="block h-full">
            <motion.div
                whileHover={{ y: -4 }}
                className="group relative h-full overflow-hidden rounded-3xl border border-neutral-200 bg-white/50 p-6 shadow-sm transition-all hover:border-primary-200 hover:shadow-xl dark:border-white/10 dark:bg-neutral-900/50 dark:hover:border-primary-700/50 backdrop-blur-sm"
            >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:from-primary-900/10" />

                <div className="relative z-10 flex h-full flex-col">
                    {/* Header */}
                    <div className="mb-4 flex items-start justify-between gap-4">
                        <span
                            className={cn(
                                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                                statusColors[course.status]
                            )}
                        >
                            {statusLabels[course.status]}
                        </span>
                        {course.pillars && course.pillars.length > 0 && (
                            <div className="flex gap-1">
                                {course.pillars.slice(0, 2).map((pillar) => (
                                    <span key={pillar} className="h-2 w-2 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <h3 className="mb-2 font-serif text-xl font-medium text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {course.title}
                    </h3>
                    <p className="mb-6 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400 flex-grow">
                        {course.short}
                    </p>

                    {/* Footer */}
                    <div className="mt-auto flex items-center justify-between border-t border-neutral-100 pt-4 dark:border-white/5">
                        <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-500">
                            <div className="flex items-center gap-1.5">
                                <BookOpen className="h-3.5 w-3.5" />
                                <span>{course.outline?.length ?? 0} modules</span>
                            </div>
                            {/* Placeholder for duration if available in future */}
                            {/* <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>4h</span>
              </div> */}
                        </div>

                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 transition-all group-hover:bg-primary-500 group-hover:text-white dark:bg-white/10 dark:group-hover:bg-primary-500">
                            <ArrowRight className="h-4 w-4" />
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}
