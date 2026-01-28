'use client';

import { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, Infinity as InfinityIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/Button';
import { CheckoutButton } from '@/components/ui/CheckoutButton';
import Link from 'next/link';

// Features data
const freeFeatures = [
    'Limited access to resources',
    'Choose 2 pillars to track',
    'Basic self-scan tools',
    'Month-to-month progress'
];

const plusFeatures = [
    'Full library access',
    'All 9 pillars tracking',
    'Deep Dive Newsletter',
    'Priority alerts & insights',
    'Smart archive access'
];

const lifetimeFeatures = [
    'Everything in NoStress+',
    'One-time payment forever',
    'Early feature access',
    'Direct roadmap input',
    'Exclusive community badge'
];

// Interactive Tilt Card Component
function TiltCard({ children, className, glowColor = "from-primary-500/20 to-accent-500/20" }: { children: React.ReactNode, className?: string, glowColor?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className={cn("relative h-full transition-all duration-200 ease-out will-change-transform", className)}
        >
            <div
                style={{ transform: "translateZ(75px)" }}
                className={cn("absolute inset-4 rounded-3xl blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br -z-10", glowColor)}
            />
            {children}
        </motion.div>
    );
}

export function PremiumPricing() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'lifetime'>('monthly');

    return (
        <div className="w-full max-w-7xl mx-auto px-4 perspective-1000">

            {/* Plans Container */}
            <div className="grid gap-8 lg:grid-cols-3 lg:gap-10 items-stretch">

                {/* Free Plan */}
                <div className="group h-full">
                    <div className="h-full rounded-[2.5rem] bg-white/60 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 p-8 flex flex-col backdrop-blur-sm transition-all duration-300 hover:border-primary-200/50 dark:hover:border-primary-700/30">
                        <div className="mb-8">
                            <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">Basic</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-serif text-neutral-900 dark:text-white">$0</span>
                                <span className="text-sm text-neutral-500">/ month</span>
                            </div>
                            <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                                Dip your toes in. Good for casual tracking and exploring the basics of the method.
                            </p>
                        </div>

                        <ul className="space-y-4 mb-8 flex-grow">
                            {freeFeatures.map(item => (
                                <li key={item} className="flex items-start gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                                    <span className="shrink-0 mt-0.5 w-4 h-4 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                                        <Check className="w-2.5 h-2.5 text-neutral-500" />
                                    </span>
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <Link href="/profile" className="w-full">
                            <Button variant="outline" className="w-full rounded-xl h-12 border-neutral-200 dark:border-neutral-800">
                                Start for free
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Pro Plan (Featured) */}
                <div className="group h-full relative z-10 lg:-mt-6 lg:mb-6">
                    <TiltCard className="h-full" glowColor="from-primary-500/30 via-accent-400/20 to-transparent">
                        <div className="h-full rounded-[2.5rem] bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 p-1 ring-1 ring-black/5 dark:ring-white/10 shadow-2xl shadow-primary-900/20 dark:shadow-none">
                            <div className="h-full rounded-[2.3rem] bg-neutral-900 dark:bg-neutral-100 p-8 flex flex-col relative overflow-hidden">
                                {/* Gradient Overlay */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-500/20 to-accent-500/20 blur-[80px] rounded-full pointer-events-none" />

                                <div className="relative">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h3 className="text-lg font-medium text-white dark:text-neutral-900 mb-2 flex items-center gap-2">
                                                NoStress+ <Sparkles className="w-4 h-4 text-accent-300 dark:text-accent-600 animate-pulse" />
                                            </h3>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-5xl font-serif text-white dark:text-neutral-900">$5</span>
                                                <span className="text-sm text-neutral-400 dark:text-neutral-500">/ month</span>
                                            </div>
                                        </div>
                                        <div className="text-[10px] font-bold uppercase tracking-widest bg-white/10 dark:bg-neutral-900/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 dark:border-neutral-900/10">
                                            Most Popular
                                        </div>
                                    </div>

                                    <p className="text-sm text-neutral-300 dark:text-neutral-600 leading-relaxed mb-8">
                                        The complete toolkit. Get full access to the system, priority insights, and the deep-dive newsletter.
                                    </p>

                                    <ul className="space-y-4 mb-8">
                                        {plusFeatures.map(item => (
                                            <li key={item} className="flex items-start gap-3 text-sm text-neutral-200 dark:text-neutral-700 font-medium">
                                                <span className="shrink-0 mt-0.5 w-4 h-4 rounded-full bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/50">
                                                    <Check className="w-2.5 h-2.5 text-white" />
                                                </span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mt-auto relative z-10">
                                    <CheckoutButton
                                        plan="plus"
                                        className="w-full rounded-xl h-14 text-base bg-white text-neutral-900 hover:bg-neutral-100 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800 border-0 shadow-lg shadow-white/10 dark:shadow-neutral-900/10 font-bold tracking-wide"
                                    >
                                        Join NoStress+
                                    </CheckoutButton>
                                    <p className="mt-4 text-center text-[10px] uppercase tracking-widest opacity-50">7-day money-back guarantee</p>
                                </div>
                            </div>
                        </div>
                    </TiltCard>
                </div>

                {/* Lifetime Plan */}
                <div className="group h-full">
                    <TiltCard className="h-full" glowColor="from-amber-500/20 via-orange-400/20 to-transparent">
                        <div className="h-full rounded-[2.5rem] bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-950 border border-neutral-200 dark:border-neutral-800 p-8 flex flex-col relative overflow-hidden transition-all duration-300 group-hover:border-amber-500/30">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[50px] rounded-full pointer-events-none" />

                            <div className="mb-8 relative">
                                <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2 flex items-center gap-2">
                                    Lifetime <InfinityIcon className="w-4 h-4 text-amber-500" />
                                </h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-serif text-neutral-900 dark:text-white">$149</span>
                                    <span className="text-sm text-neutral-500">one-time</span>
                                </div>
                                <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                                    Avoid subscriptions. Own the entire system and all future updates forever.
                                </p>
                            </div>

                            <ul className="space-y-4 mb-8 flex-grow relative">
                                {lifetimeFeatures.map(item => (
                                    <li key={item} className="flex items-start gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                                        <span className="shrink-0 mt-0.5 w-4 h-4 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                                            <Check className="w-2.5 h-2.5" />
                                        </span>
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <div className="relative">
                                <CheckoutButton
                                    plan="lifetime"
                                    className="w-full rounded-xl h-12 bg-gradient-to-r from-amber-600 to-orange-600 text-white border-0 hover:shadow-lg hover:shadow-amber-500/25"
                                >
                                    Get Lifetime Access
                                </CheckoutButton>
                            </div>
                        </div>
                    </TiltCard>
                </div>

            </div>
        </div>
    );
}
