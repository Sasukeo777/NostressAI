import Link from 'next/link';
import { Home, ArrowLeft, Search, BookOpen, MessageCircle } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="max-w-2xl mx-auto text-center">
                {/* Decorative background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-100/30 rounded-full blur-3xl dark:bg-primary-900/20" />
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-100/30 rounded-full blur-3xl dark:bg-accent-900/20" />
                </div>

                <div className="relative z-10">
                    {/* 404 Number with gradient */}
                    <div className="mb-8">
                        <span className="text-[120px] md:text-[180px] font-serif font-bold leading-none text-transparent bg-clip-text bg-gradient-to-br from-primary-400 via-primary-500 to-accent-500 dark:from-primary-300 dark:via-primary-400 dark:to-accent-400">
                            404
                        </span>
                    </div>

                    {/* Message */}
                    <h1 className="text-3xl md:text-4xl font-serif font-medium text-neutral-900 dark:text-white mb-4">
                        Page not found
                    </h1>
                    <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-10 max-w-md mx-auto">
                        It looks like this page took a break to de-stress. Let&apos;s help you find your way back.
                    </p>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 transition-colors dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 font-medium"
                        >
                            <Home className="h-4 w-4" />
                            Go home
                        </Link>
                        <button
                            onClick={() => window.history.back()}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 font-medium"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Go back
                        </button>
                    </div>

                    {/* Helpful links */}
                    <div className="border-t border-neutral-200 dark:border-neutral-800 pt-8">
                        <p className="text-sm text-neutral-500 dark:text-neutral-500 mb-6">
                            Or try one of these:
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-6">
                            <Link
                                href="/blog"
                                className="group inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400 transition-colors"
                            >
                                <BookOpen className="h-4 w-4" />
                                Read our blog
                            </Link>
                            <Link
                                href="/courses"
                                className="group inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400 transition-colors"
                            >
                                <Search className="h-4 w-4" />
                                Browse courses
                            </Link>
                            <Link
                                href="/contact"
                                className="group inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400 transition-colors"
                            >
                                <MessageCircle className="h-4 w-4" />
                                Contact us
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
