'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { MotionWrapper } from '@/components/ui/MotionWrapper';
import Particles from '@/components/ui/Particles';


export function Hero() {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
    const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

    return (
        <motion.section
            ref={targetRef}
            style={{ opacity, scale, y }}
            className="relative min-h-[85vh] flex items-center overflow-hidden rounded-[3rem] bg-white dark:bg-neutral-900 p-8 md:p-20 border border-neutral-100 dark:border-neutral-800"
        >
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[image:var(--nature-glow)] dark:bg-[image:var(--nature-glow-dark)] opacity-60 pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.5),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(23,23,23,0.8),transparent_70%)] pointer-events-none" />
                <div className="absolute inset-0 opacity-50 dark:opacity-40">
                    <Particles
                        particleColors={['#56827C', '#D4A373', '#E6CCB2']}
                        particleCount={150}
                        particleSpread={10}
                        speed={0.05}
                        particleBaseSize={80}
                        moveParticlesOnHover={true}
                        alphaParticles={false}
                        disableRotation={false}
                    />
                </div>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center w-full max-w-4xl mx-auto">
                <MotionWrapper delay={0.1}>
                    <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-neutral-600 shadow-sm backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/80 dark:text-neutral-400 mb-8">
                        <span>New platform</span>
                        <span className="text-primary-500 dark:text-primary-400">•</span>
                        <span>Parents · AI · Calm systems</span>
                    </div>
                </MotionWrapper>

                <MotionWrapper delay={0.2} variant="slide-up">
                    <h1 className="font-serif text-6xl md:text-8xl font-medium leading-[1] text-neutral-900 dark:text-neutral-50 tracking-tight mb-8">
                        Reduce <br />
                        <span className="text-primary-600 dark:text-primary-400 italic">mental load.</span>
                    </h1>
                </MotionWrapper>

                <MotionWrapper delay={0.3} variant="slide-up">
                    <p className="max-w-xl text-xl leading-relaxed text-neutral-700 dark:text-neutral-300 font-serif mb-10 mx-auto">
                        Training, tools and micro-routines to transform your family day without adding another layer of digital stress.
                    </p>
                </MotionWrapper>

                <MotionWrapper delay={0.4} variant="fade-in">
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/courses">
                            <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-soft hover:shadow-lg transition-all">Browse courses</Button>
                        </Link>
                        <Link href="/blog">
                            <Button variant="ghost" size="lg" className="h-14 px-8 text-lg rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800">
                                Explore content
                            </Button>
                        </Link>
                    </div>
                </MotionWrapper>
            </div>
        </motion.section>
    );
}
