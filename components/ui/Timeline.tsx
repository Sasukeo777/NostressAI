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
            className="relative w-full font-sans py-8"
            ref={containerRef}
        >
            {/* Warm earth-tone background */}
            <div className="absolute inset-0 -mx-4 sm:-mx-6 lg:-mx-8 rounded-[3rem] overflow-hidden pointer-events-none">
                {/* Base gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent-50/40 via-primary-50/20 to-neutral-50 dark:from-accent-950/20 dark:via-primary-950/10 dark:to-neutral-950" />

                {/* Decorative earth-tone shapes */}
                <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-accent-100/40 blur-3xl dark:bg-accent-900/20" />
                <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full bg-primary-100/30 blur-3xl dark:bg-primary-900/15" />
                <div className="absolute top-1/2 right-10 w-64 h-64 rounded-full bg-accent-200/30 blur-3xl dark:bg-accent-800/15" />

                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 50 L50 0 A50 50 0 0 1 100 50 L50 50' fill='%23000' fill-opacity='1'/%3E%3C/svg%3E")`,
                    backgroundSize: '30px 30px',
                }} />
            </div>

            {/* Section Header */}
            <div className="relative max-w-7xl mx-auto py-16 px-4 md:px-8 lg:px-10">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                    <div>
                        <span className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-accent-600 dark:text-accent-400 mb-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-accent-100 dark:bg-accent-900/50">
                                <Compass className="h-4 w-4" />
                            </div>
                            <span className="w-8 h-0.5 rounded-full bg-gradient-to-r from-accent-500 to-primary-500" />
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
                                <div className="h-14 w-14 absolute left-2 md:left-2 rounded-2xl bg-neutral-25 dark:bg-neutral-900 flex items-center justify-center border border-neutral-200/60 dark:border-neutral-800 shadow-lg shadow-accent-200/30 dark:shadow-black/30">
                                    <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-accent-400 to-primary-500 flex items-center justify-center shadow-inner">
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

                                {/* Content wrapper with warm card styling */}
                                <div className="relative rounded-2xl bg-neutral-25 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 p-6 md:p-8 shadow-sm hover:shadow-lg hover:shadow-accent-200/20 dark:hover:shadow-black/20 transition-shadow duration-300">
                                    {/* Decorative corner accent */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent-50/60 via-primary-50/30 to-transparent dark:from-accent-950/30 dark:via-primary-950/15 rounded-tr-2xl pointer-events-none" />

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
                        className="absolute inset-x-0 top-0 w-[3px] bg-gradient-to-b from-accent-500 via-primary-400 to-primary-300 rounded-full shadow-[0_0_20px_rgba(198,134,80,0.4)]"
                    />
                </div>
            </div>
        </div>
    );
};
