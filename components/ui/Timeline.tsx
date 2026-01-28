"use client";
import {
    useScroll,
    useTransform,
    motion,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { Heart, Cog, Compass } from "lucide-react";

interface TimelineEntry {
    title: string;
    content: React.ReactNode;
    icon?: 'body' | 'systems' | 'horizon';
}

const iconMap = {
    body: Heart,
    systems: Cog,
    horizon: Compass,
};

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
    const ref = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setHeight(rect.height);
        }
    }, [ref]);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 10%", "end 50%"],
    });

    const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
    const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

    // Map titles to icons
    const getIcon = (title: string, index: number) => {
        if (title.toLowerCase().includes('body') || title.toLowerCase().includes('regulate')) return Heart;
        if (title.toLowerCase().includes('system') || title.toLowerCase().includes('refine')) return Cog;
        if (title.toLowerCase().includes('horizon') || title.toLowerCase().includes('expand')) return Compass;
        // Fallback based on index
        const icons = [Heart, Cog, Compass];
        return icons[index % 3];
    };

    return (
        <div
            className="w-full font-sans"
            ref={containerRef}
        >
            {/* Section Header */}
            <div className="max-w-7xl mx-auto py-16 px-4 md:px-8 lg:px-10">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                    <div>
                        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-3">
                            <span className="w-8 h-px bg-primary-500" />
                            Your Journey
                        </span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium text-neutral-900 dark:text-white">
                            The NoStress Path
                        </h2>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400 max-w-sm md:text-right">
                        A journey from cognitive overload to a calm, leveraged system.
                    </p>
                </div>
            </div>

            <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
                {data.map((item, index) => {
                    const Icon = getIcon(item.title, index);
                    return (
                        <div
                            key={`timeline-${item.title}-${index}`}
                            className="flex justify-start pt-10 md:pt-32 md:gap-10"
                        >
                            {/* Left sticky title area */}
                            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
                                {/* Timeline dot with icon */}
                                <div className="h-12 w-12 absolute left-3 md:left-3 rounded-2xl bg-white dark:bg-neutral-900 flex items-center justify-center border border-neutral-200 dark:border-neutral-800 shadow-lg shadow-neutral-200/50 dark:shadow-black/30 group-hover:border-primary-300">
                                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-inner">
                                        <Icon className="h-5 w-5 text-white" />
                                    </div>
                                </div>
                                {/* Title */}
                                <h3 className="hidden md:block text-xl md:pl-20 md:text-4xl lg:text-5xl font-bold text-neutral-300 dark:text-neutral-700 font-serif transition-colors">
                                    {item.title}
                                </h3>
                            </div>

                            {/* Right content area */}
                            <div className="relative pl-20 pr-4 md:pl-4 w-full">
                                {/* Mobile title */}
                                <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-neutral-400 dark:text-neutral-600 font-serif">
                                    {item.title}
                                </h3>

                                {/* Content wrapper with modern card styling */}
                                <div className="relative rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 md:p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
                                    {/* Decorative corner accent */}
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary-50/50 to-transparent dark:from-primary-950/30 rounded-tr-2xl pointer-events-none" />

                                    <div className="relative">
                                        {React.Children.toArray(item.content)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Timeline line */}
                <div
                    style={{
                        height: height + "px",
                    }}
                    className="absolute md:left-8 left-8 top-0 overflow-hidden w-[3px] bg-gradient-to-b from-neutral-200 via-neutral-200 to-neutral-200/0 dark:from-neutral-800 dark:via-neutral-800 dark:to-neutral-800/0 rounded-full"
                >
                    <motion.div
                        style={{
                            height: heightTransform,
                            opacity: opacityTransform,
                        }}
                        className="absolute inset-x-0 top-0 w-[3px] bg-gradient-to-b from-primary-500 via-primary-400 to-primary-300 rounded-full shadow-[0_0_20px_rgba(86,130,124,0.5)]"
                    />
                </div>
            </div>
        </div>
    );
};
