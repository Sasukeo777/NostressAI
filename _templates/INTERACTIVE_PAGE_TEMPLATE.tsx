import type { Metadata } from 'next';
import React from 'react';
import { InteractiveLayout } from '@/components/interactive/InteractiveLayout';
import { HorizontalBarChart, DonutChart } from '@/components/interactive/Charts';

// -----------------------------------------------------------------------------
// RULES & GUIDELINES
// -----------------------------------------------------------------------------
// 1. LOCATION: Save this file at `app/interactive/[slug]/page.tsx`
// 2. DESIGN: Use the InteractiveLayout wrapper. It handles the "Tabs" logic.
// 3. CHARTS: Use the pre-built chart components in `@/components/interactive/Charts`.
// 4. TONE: Data-rich, dashboard style. Less prose, more visuals.
// -----------------------------------------------------------------------------

export const metadata: Metadata = {
    title: 'Interactive Report: [Topic Name]',
    description: 'Interactive exploration of [Topic]...',
    alternates: { canonical: 'https://www.nostress.ai/interactive/[slug]' },
    openGraph: {
        title: 'Interactive Report: [Topic Name]',
        type: 'article',
    }
};

export default function InteractiveTemplatePage() {
    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
            {/* HEADER: Standardized Title Section */}
            <header className="text-center pt-12 mb-10 px-4">
                <p className="text-xs font-mono tracking-[0.25em] text-primary-600 dark:text-primary-400 mb-3">
                    INTERACTIVE REPORT
                </p>
                <h1 className="text-4xl md:text-5xl font-semibold tracking-tight bg-gradient-to-r from-primary-500 to-teal-500 bg-clip-text text-transparent mb-4">
                    [Main Title Here]
                </h1>
                <p className="text-lg md:text-xl max-w-3xl mx-auto text-neutral-600 dark:text-neutral-300">
                    [Subtitle describing what the user will explore]
                </p>
            </header>

            {/* CORE LAYOUT: Define your tabs here */}
            <InteractiveLayout
                tabs={[
                    { id: 'section-1', label: 'The Problem' },
                    { id: 'section-2', label: 'The Data' },
                    { id: 'section-3', label: 'The Solution' }
                ]}
            >
                {/* SECTION 1 CONTENT */}
                <section id="section-1" className="space-y-12">
                    <div className="text-center max-w-2xl mx-auto">
                        <h2 className="text-3xl font-bold tracking-tight mb-3">Section Title</h2>
                        <p className="text-neutral-600 dark:text-neutral-300">
                            Contextual description for this section.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
                            <h3 className="text-lg font-semibold mb-4">Chart Example</h3>
                            <div className="h-72 relative">
                                {/* Chart Data: Array of numbers */}
                                <HorizontalBarChart data={[20, 50, 30]} />
                            </div>
                        </div>

                        <div className="rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
                            <h3 className="text-lg font-semibold mb-4">Donut Example</h3>
                            <div className="h-72 relative">
                                <DonutChart
                                    labels={['Label A', 'Label B']}
                                    data={[60, 40]}
                                    colors={['#60A5FA', '#FBBF24']}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 2 CONTENT */}
                <section id="section-2" className="space-y-12">
                    {/* Add more content here... */}
                    <div className="p-8 text-center border-2 border-dashed border-neutral-200 rounded-3xl">
                        <p>More complex logic or simpler text sections go here.</p>
                    </div>
                </section>

            </InteractiveLayout>
        </div>
    );
}
