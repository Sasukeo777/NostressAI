'use client';

import Link from 'next/link';
import { CheckoutButton } from '@/components/ui/CheckoutButton';
import { Check, Sparkles, Zap, Brain, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function NewsletterShowcase() {
    return (
        <section className="relative">
            {/* Main container with gradient border effect */}
            <div className="relative rounded-[3rem] p-[1px] bg-gradient-to-br from-primary-200 via-neutral-200 to-accent-200 dark:from-primary-800/50 dark:via-neutral-800 dark:to-accent-800/50 overflow-hidden">
                <div className="relative rounded-[3rem] bg-white dark:bg-neutral-950 overflow-hidden">

                    {/* Ambient background effects */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-50 via-transparent to-transparent dark:from-primary-950/30" />
                    <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-accent-100/50 to-transparent blur-3xl dark:from-accent-900/20" />

                    {/* Grid pattern overlay */}
                    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }} />

                    <div className="relative z-10 p-8 md:p-12 lg:p-16">
                        {/* Header */}
                        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
                            <div className="space-y-4">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="inline-flex items-center gap-3 rounded-full border border-primary-200 bg-primary-50 px-4 py-2 dark:border-primary-800 dark:bg-primary-950/50"
                                >
                                    <Sparkles className="h-4 w-4 text-primary-500" />
                                    <span className="text-xs font-bold uppercase tracking-widest text-primary-700 dark:text-primary-300">Monthly Digest</span>
                                </motion.div>
                                <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tight text-neutral-900 dark:text-white">
                                    Information without<br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 dark:from-primary-400 dark:via-accent-400 dark:to-primary-400 bg-[length:200%_auto] animate-gradient">
                                        the noise.
                                    </span>
                                </h2>
                            </div>
                            <p className="max-w-sm text-lg text-neutral-600 dark:text-neutral-400 lg:text-right">
                                Your monthly cognitive download. Curated insights, zero fluff.
                            </p>
                        </div>

                        {/* Bento Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                            {/* Feature Card 1 */}
                            <motion.div
                                whileHover={{ scale: 1.02, y: -4 }}
                                transition={{ duration: 0.2 }}
                                className="group relative rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100/50 p-6 border border-primary-100 dark:from-primary-950/50 dark:to-primary-900/30 dark:border-primary-800/50 overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-200/50 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500 dark:bg-primary-500/20" />
                                <div className="relative">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary-500/10 text-primary-600 mb-4 dark:text-primary-400">
                                        <Zap className="h-6 w-6" />
                                    </div>
                                    <div className="text-4xl font-serif font-bold text-primary-700 dark:text-primary-300 mb-2">5</div>
                                    <div className="text-neutral-700 dark:text-neutral-300 font-medium">Curated AI News</div>
                                    <div className="text-sm text-neutral-500 dark:text-neutral-500 mt-1">Stripped of hype, ready to apply</div>
                                </div>
                            </motion.div>

                            {/* Feature Card 2 */}
                            <motion.div
                                whileHover={{ scale: 1.02, y: -4 }}
                                transition={{ duration: 0.2 }}
                                className="group relative rounded-2xl bg-gradient-to-br from-accent-50 to-accent-100/50 p-6 border border-accent-100 dark:from-accent-950/50 dark:to-accent-900/30 dark:border-accent-800/50 overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-200/50 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500 dark:bg-accent-500/20" />
                                <div className="relative">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-accent-500/10 text-accent-600 mb-4 dark:text-accent-400">
                                        <Brain className="h-6 w-6" />
                                    </div>
                                    <div className="text-4xl font-serif font-bold text-accent-700 dark:text-accent-300 mb-2">1</div>
                                    <div className="text-neutral-700 dark:text-neutral-300 font-medium">Deep Dive</div>
                                    <div className="text-sm text-neutral-500 dark:text-neutral-500 mt-1">Into a specific system or routine</div>
                                </div>
                            </motion.div>

                            {/* Feature Card 3 - What you get */}
                            <motion.div
                                whileHover={{ scale: 1.02, y: -4 }}
                                transition={{ duration: 0.2 }}
                                className="group relative rounded-2xl bg-neutral-50 p-6 border border-neutral-100 dark:bg-neutral-900/50 dark:border-neutral-800 overflow-hidden md:col-span-2 lg:col-span-1"
                            >
                                <div className="relative h-full flex flex-col justify-between">
                                    <div>
                                        <div className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">What you get</div>
                                        <ul className="space-y-3">
                                            {[
                                                'Actionable frameworks',
                                                'Tool recommendations',
                                                'Research summaries',
                                                'Exclusive templates'
                                            ].map((item, i) => (
                                                <li key={i} className="flex items-center gap-3 text-neutral-700 dark:text-neutral-300">
                                                    <Check className="h-4 w-4 text-primary-500 shrink-0" />
                                                    <span className="text-sm">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* CTA Section */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-neutral-50 border border-neutral-100 dark:bg-neutral-900/50 dark:border-neutral-800">
                            <div className="flex items-center gap-4">
                                <div className="hidden sm:flex -space-x-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                            className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-200 to-accent-200 border-2 border-white dark:border-neutral-900 dark:from-primary-800 dark:to-accent-800 flex items-center justify-center text-xs font-bold text-primary-700 dark:text-primary-300"
                                        >
                                            {['A', 'M', 'S', 'K'][i - 1]}
                                        </div>
                                    ))}
                                </div>
                                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                                    Join <span className="font-medium text-neutral-900 dark:text-white">1,200+</span> parents reducing mental load
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                                <CheckoutButton
                                    plan="newsletter"
                                    size="lg"
                                    className="w-full sm:w-auto h-12 px-6 text-sm font-medium bg-neutral-900 text-white hover:bg-neutral-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 rounded-xl group"
                                >
                                    <span>Subscribe $0.99/mo</span>
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </CheckoutButton>
                                <Link
                                    href="/pro"
                                    className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors dark:hover:text-white whitespace-nowrap"
                                >
                                    Compare plans →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
