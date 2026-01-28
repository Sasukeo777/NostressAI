'use client';

import Link from 'next/link';
import { CheckoutButton } from '@/components/ui/CheckoutButton';
import { Check, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function NewsletterShowcase() {
    return (
        <section className="relative overflow-hidden rounded-[2.5rem] bg-white border border-neutral-200 text-neutral-900 shadow-xl shadow-neutral-200/50 dark:bg-neutral-900 dark:border-neutral-800 dark:text-white dark:shadow-neutral-950/50 transition-colors duration-300">
            {/* Backgrounds */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-neutral-50 via-white to-neutral-100 dark:from-neutral-800 dark:via-neutral-900 dark:to-neutral-950 opacity-100 transition-opacity duration-300" />

            {/* Ambient Glows */}
            <div className="absolute top-0 right-0 h-[600px] w-[600px] -translate-y-1/2 translate-x-1/3 rounded-full bg-primary-200/40 blur-[100px] opacity-70 dark:bg-primary-900/20" />
            <div className="absolute bottom-0 left-0 h-[400px] w-[400px] translate-y-1/3 -translate-x-1/3 rounded-full bg-accent-200/40 blur-[80px] dark:bg-accent-900/10" />

            <div className="relative z-10 grid gap-16 lg:grid-cols-2 lg:items-center p-10 md:p-16 lg:p-20">
                <div className="space-y-8">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2.5 rounded-full border border-primary-500/30 bg-primary-50/50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary-700 backdrop-blur-md shadow-sm dark:bg-primary-500/10 dark:text-primary-300 dark:shadow-[0_0_15px_-3px_rgba(var(--primary-500),0.3)]">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-600 opacity-75 dark:bg-primary-400"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                        </span>
                        Monthly Digest
                    </div>

                    <h2 className="font-serif text-4xl font-medium leading-[1.1] md:text-5xl lg:text-6xl tracking-tight text-neutral-900 dark:text-white">
                        Information without the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-200 dark:to-accent-200">
                            noise.
                        </span>
                    </h2>

                    <p className="max-w-md text-lg text-neutral-600 leading-relaxed font-light dark:text-neutral-400">
                        Your monthly cognitive download. No fluff, just structure.
                    </p>

                    <ul className="space-y-4">
                        <li className="flex items-start gap-4 text-neutral-700 dark:text-neutral-300">
                            <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary-500/20 text-primary-600 shrink-0 dark:text-primary-400">
                                <Check className="h-3.5 w-3.5" />
                            </div>
                            <span className="text-lg font-light"><strong>5 Curated AI News</strong> stripped of hype</span>
                        </li>
                        <li className="flex items-start gap-4 text-neutral-700 dark:text-neutral-300">
                            <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary-500/20 text-primary-600 shrink-0 dark:text-primary-400">
                                <Check className="h-3.5 w-3.5" />
                            </div>
                            <span className="text-lg font-light"><strong>1 Deep Dive</strong> into a specific system</span>
                        </li>
                    </ul>

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center pt-6">
                        <CheckoutButton plan="newsletter" size="lg" className="h-14 px-8 text-base bg-neutral-900 text-white hover:bg-neutral-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 dark:shadow-[0_0_20px_-5px_theme(colors.white)] dark:hover:shadow-[0_0_30px_-5px_theme(colors.white)]">
                            Subscribe ($0.99/mo)
                        </CheckoutButton>
                        <Link href="/pro" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors px-4 dark:text-neutral-500 dark:hover:text-white">
                            Compare plans →
                        </Link>
                    </div>
                </div>

                {/* 3D Floating Card Visual */}
                <div className="relative hidden lg:flex items-center justify-center" style={{ perspective: "1000px" }}>
                    <motion.div
                        animate={{
                            y: [0, -20, 0],
                            rotateX: [5, 0, 5],
                            rotateY: [-5, 0, -5]
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="relative w-full max-w-sm"
                        style={{ transformStyle: "preserve-3d" }}
                    >
                        {/* Glass Card */}
                        <div className="relative rounded-[32px] border border-white/40 bg-white/60 p-8 backdrop-blur-2xl shadow-xl shadow-neutral-200/50 dark:border-white/10 dark:bg-gradient-to-br dark:from-white/10 dark:to-white/5 dark:shadow-black/80">
                            {/* Card Header */}
                            <div className="flex items-center justify-between mb-8 border-b border-neutral-200/50 dark:border-white/5 pb-6">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-white border border-neutral-200 flex items-center justify-center shadow-sm dark:bg-neutral-950 dark:border-white/10 dark:shadow-inner">
                                        <span className="font-serif font-bold text-neutral-900 text-xl dark:text-white">N</span>
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-neutral-900 tracking-wide dark:text-white">NoStress.ai</div>
                                        <div className="text-[10px] text-primary-600 uppercase tracking-widest font-semibold mt-0.5 dark:text-primary-300">Monthly Reset</div>
                                    </div>
                                </div>
                                <div className="text-xs text-neutral-500 font-mono bg-neutral-100 px-2 py-1 rounded dark:bg-white/5">Dec 01</div>
                            </div>

                            {/* Card Content Skeleton */}
                            <div className="space-y-6">
                                <div className="aspect-video w-full rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center relative overflow-hidden group dark:bg-neutral-900/50 dark:border-white/5">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary-200/40 via-transparent to-accent-200/40 opacity-50 dark:from-primary-500/20 dark:to-accent-500/20" />
                                    <span className="relative text-xs font-mono text-neutral-600 uppercase tracking-widest border border-white/50 px-3 py-1 rounded-full bg-white/50 backdrop-blur-sm dark:text-white/50 dark:border-white/10 dark:bg-black/40">Featured Deep Dive</span>
                                </div>

                                <div className="space-y-3">
                                    <div className="h-2 w-3/4 rounded-full bg-neutral-200 dark:bg-white/20" />
                                    <div className="h-2 w-1/2 rounded-full bg-neutral-100 dark:bg-white/10" />
                                </div>

                                <div className="pt-6 flex gap-2 opacity-50">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-1.5 flex-1 rounded-full bg-neutral-200 dark:bg-white/10" />
                                    ))}
                                </div>
                            </div>

                            {/* Reflection/Glow */}
                            <div className="absolute inset-0 rounded-[32px] ring-1 ring-inset ring-white/40 pointer-events-none dark:ring-white/10" />
                            <div className="absolute -inset-0.5 rounded-[33px] bg-gradient-to-br from-white/40 to-transparent opacity-50 blur-md -z-10 dark:from-white/20 dark:opacity-10" />
                        </div>
                    </motion.div>

                    {/* Ambient Shadow under card */}
                    <div className="absolute -bottom-16 w-3/4 h-8 bg-neutral-200/80 blur-2xl rounded-[100%] pointer-events-none dark:bg-black/40" />
                </div>
            </div>
        </section>
    );
}
