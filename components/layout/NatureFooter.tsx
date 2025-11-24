'use client';

import Link from 'next/link';
import { ManageCookiesButton } from '@/components/legal/ManageCookiesButton';
import { motion } from 'framer-motion';

const primaryLinks = [
    { href: '/approach', label: 'Approach' },
    { href: '/courses', label: 'Courses' },
    { href: '/blog', label: 'Blog' },
    { href: '/videos', label: 'Videos' },
    { href: '/pro', label: 'NoStress+' }
];

const supportLinks = [
    { href: '/resources', label: 'Resources' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/privacy', label: 'Privacy policy' },
    { href: '/legal-notice', label: 'Legal notice' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/privacy/california', label: 'California privacy notice' }
];

export function NatureFooter() {
    const year = new Date().getFullYear();

    return (
        <footer className="relative mt-32 overflow-hidden border-t border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[image:var(--nature-glow)] dark:bg-[image:var(--nature-glow-dark)] opacity-30" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-primary-200/30 dark:bg-primary-900/20 blur-[120px] rounded-full pointer-events-none" />
            </div>

            <div className="site-container relative z-10 px-6 py-20">
                <div className="grid gap-16 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link href="/" className="inline-block">
                            <span className="text-2xl font-serif font-medium text-neutral-900 dark:text-white tracking-tight">
                                NoStress <span className="text-primary-600 dark:text-primary-400">AI</span>
                            </span>
                        </Link>
                        <p className="max-w-sm text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
                            Holistic stress relief for modern families. We blend neuroscience, mindful routines, and intentional AI tools to build calmer systems.
                        </p>
                        <div className="pt-4">
                            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-white/10 bg-neutral-100/50 dark:bg-white/5 px-3 py-1 text-xs font-medium text-primary-700 dark:text-primary-300 backdrop-blur-sm">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                                </span>
                                Systems operational
                            </div>
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="lg:col-start-3">
                        <h3 className="font-serif text-lg font-medium text-neutral-900 dark:text-white mb-6">Explore</h3>
                        <ul className="space-y-4">
                            {primaryLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="group flex items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-white"
                                    >
                                        <span className="h-px w-0 bg-primary-500 transition-all group-hover:w-3" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-serif text-lg font-medium text-neutral-900 dark:text-white mb-6">Support</h3>
                        <ul className="space-y-4">
                            {supportLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="group flex items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-white"
                                    >
                                        <span className="h-px w-0 bg-primary-500 transition-all group-hover:w-3" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-20 pt-8 border-t border-neutral-200 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-neutral-500">
                    <p>© {year} NoStress AI. All rights reserved.</p>
                    <div className="flex flex-wrap justify-center gap-8">
                        <Link href="/privacy" className="hover:text-neutral-900 dark:hover:text-neutral-300 transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-neutral-900 dark:hover:text-neutral-300 transition-colors">Terms</Link>
                        <ManageCookiesButton className="hover:text-neutral-900 dark:hover:text-neutral-300 transition-colors" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
