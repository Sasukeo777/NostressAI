'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { MotionWrapper } from '@/components/ui/MotionWrapper';

export function Hero() {
    const targetRef = useRef<HTMLElement>(null);
    const [isMounted, setIsMounted] = useState(false);

    // Scroll-based parallax
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"]
    });

    const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
    const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const contentY = useTransform(scrollYProgress, [0, 0.5], [0, 80]);

    // Cursor-following effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
    const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

    useEffect(() => {
        setIsMounted(true);

        const handleMouseMove = (e: MouseEvent) => {
            if (!targetRef.current) return;
            const rect = targetRef.current.getBoundingClientRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            // Calculate offset from center (-1 to 1)
            const offsetX = (e.clientX - rect.left - centerX) / centerX;
            const offsetY = (e.clientY - rect.top - centerY) / centerY;
            // Subtle movement (max 20px)
            mouseX.set(offsetX * 20);
            mouseY.set(offsetY * 20);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <motion.section
            ref={targetRef}
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
            {/* Full-bleed background image with parallax */}
            <motion.div
                className="absolute inset-0 z-0"
                style={{ y: bgY }}
            >
                <motion.div
                    className="absolute inset-0 scale-110"
                    style={{
                        x: isMounted ? smoothX : 0,
                        y: isMounted ? smoothY : 0,
                    }}
                >
                    <Image
                        src="/images/homepage-hero.png"
                        alt="Serene wellness landscape"
                        fill
                        className="object-cover"
                        priority
                        sizes="100vw"
                        quality={90}
                    />
                </motion.div>

                {/* Gradient overlays for text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/40 to-white/80 dark:from-neutral-950/80 dark:via-neutral-950/50 dark:to-neutral-950/90" />
                <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-transparent to-transparent dark:from-neutral-950/70" />
            </motion.div>

            {/* Floating ambient particles effect */}
            <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-64 h-64 rounded-full blur-3xl"
                        style={{
                            background: i % 2 === 0
                                ? 'radial-gradient(circle, rgba(86,130,124,0.15) 0%, transparent 70%)'
                                : 'radial-gradient(circle, rgba(212,163,115,0.12) 0%, transparent 70%)',
                            left: `${15 + (i * 15)}%`,
                            top: `${20 + (i % 3) * 25}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            x: [0, 15, 0],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 8 + i * 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.5,
                        }}
                    />
                ))}
            </div>

            {/* Content */}
            <motion.div
                className="relative z-10 site-container py-20"
                style={{ opacity: contentOpacity, y: contentY }}
            >
                <div className="max-w-3xl mx-auto text-center">
                    <MotionWrapper delay={0.1}>
                        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200/80 bg-white/70 px-5 py-2 text-xs font-medium uppercase tracking-widest text-neutral-600 shadow-lg shadow-neutral-200/30 backdrop-blur-md dark:border-neutral-700/80 dark:bg-neutral-900/70 dark:text-neutral-400 dark:shadow-black/20 mb-8">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                            </span>
                            <span>Parents · AI · Calm systems</span>
                        </div>
                    </MotionWrapper>

                    <MotionWrapper delay={0.2} variant="slide-up">
                        <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl font-medium leading-[1] text-neutral-900 dark:text-neutral-50 tracking-tight mb-8">
                            Reduce <br />
                            <span className="text-primary-600 dark:text-primary-400 italic">mental load.</span>
                        </h1>
                    </MotionWrapper>

                    <MotionWrapper delay={0.3} variant="slide-up">
                        <p className="max-w-xl mx-auto text-xl md:text-2xl leading-relaxed text-neutral-700 dark:text-neutral-300 font-serif mb-12">
                            Training, tools and micro-routines to transform your family day without adding another layer of digital stress.
                        </p>
                    </MotionWrapper>

                    <MotionWrapper delay={0.4} variant="fade-in">
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/courses">
                                <Button size="lg" className="h-16 px-10 text-lg rounded-full shadow-xl shadow-primary-500/20 hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-300 hover:-translate-y-1">
                                    Browse courses
                                </Button>
                            </Link>
                            <Link href="/blog">
                                <Button variant="ghost" size="lg" className="h-16 px-10 text-lg rounded-full bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm border border-neutral-200 dark:border-neutral-700 hover:bg-white/80 dark:hover:bg-neutral-800/80 transition-all duration-300 hover:-translate-y-1">
                                    Explore content
                                </Button>
                            </Link>
                        </div>
                    </MotionWrapper>
                </div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
                style={{ opacity: contentOpacity }}
            >
                <motion.div
                    className="flex flex-col items-center gap-2 text-neutral-500 dark:text-neutral-400"
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <span className="text-xs uppercase tracking-widest">Scroll</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M19 12l-7 7-7-7" />
                    </svg>
                </motion.div>
            </motion.div>
        </motion.section>
    );
}
