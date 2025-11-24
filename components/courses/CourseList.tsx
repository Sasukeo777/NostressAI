'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { CourseCard } from './CourseCard';
import { PillarFilters } from '@/components/ui/PillarFilters';
import type { Formation, HolisticPillar } from '@/lib/types';

interface CourseListProps {
    initialCourses: Formation[];
    initialPillar?: HolisticPillar;
}

export function CourseList({ initialCourses, initialPillar }: CourseListProps) {
    const [activePillar, setActivePillar] = useState<HolisticPillar | undefined>(initialPillar);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCourses = useMemo(() => {
        return initialCourses.filter((course) => {
            const matchesPillar = activePillar ? course.pillars?.includes(activePillar) : true;
            const matchesSearch =
                course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.short.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesPillar && matchesSearch;
        });
    }, [initialCourses, activePillar, searchQuery]);

    return (
        <div className="space-y-8">
            {/* Controls */}
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <PillarFilters
                    active={activePillar}
                    onChange={setActivePillar}
                    className="w-full md:w-auto"
                />

                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-full border border-neutral-200 bg-white/50 py-2 pl-9 pr-4 text-sm placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-white/10 dark:bg-neutral-900/50 dark:text-white dark:focus:border-primary-400 backdrop-blur-sm"
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="min-h-[400px]">
                {filteredCourses.length > 0 ? (
                    <motion.div
                        layout
                        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredCourses.map((course) => (
                                <motion.div
                                    key={course.slug}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <CourseCard course={course} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-20 text-center"
                    >
                        <div className="mb-4 rounded-full bg-neutral-100 p-4 dark:bg-neutral-800">
                            <Search className="h-6 w-6 text-neutral-400" />
                        </div>
                        <h3 className="text-lg font-medium text-neutral-900 dark:text-white">No courses found</h3>
                        <p className="text-neutral-500 dark:text-neutral-400">
                            Try adjusting your search or filters to find what you&apos;re looking for.
                        </p>
                        <button
                            onClick={() => { setActivePillar(undefined); setSearchQuery(''); }}
                            className="mt-4 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
                        >
                            Clear all filters
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
