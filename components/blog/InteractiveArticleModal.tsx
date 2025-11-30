'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from '@/components/ui/Dialog';
import { Sparkles, Play } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface InteractiveArticleModalProps {
    htmlContent?: string | null;
    iframeUrl?: string | null;
}

export function InteractiveArticleModal({ htmlContent, iframeUrl }: InteractiveArticleModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    if (!htmlContent && !iframeUrl) return null;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button
                    className={cn(
                        "group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-10 py-5 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(var(--primary-500),0.5)]",
                        "bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500",
                        "dark:from-primary-500 dark:via-primary-400 dark:to-accent-400",
                        "shadow-lg shadow-primary-500/20 ring-1 ring-white/20"
                    )}
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="relative flex items-center gap-3 font-serif text-lg font-medium text-white tracking-wide">
                        <Sparkles className="h-5 w-5 animate-pulse text-accent-100" />
                        <span>Launch Interactive Experience</span>
                        <Play className="h-4 w-4 fill-current opacity-80" />
                    </div>
                </button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl w-[95vw] h-[85vh] overflow-hidden flex flex-col p-0 gap-0 bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 sm:rounded-[2.5rem] shadow-2xl">
                <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                    <DialogTitle className="text-xl font-serif text-primary-700 dark:text-primary-300 flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        Interactive Mode
                    </DialogTitle>
                    <DialogDescription className="mt-1">
                        Explore the concepts from this article in an interactive environment.
                    </DialogDescription>
                </div>
                <div className="flex-1 overflow-y-auto p-6 w-full h-full">
                    {htmlContent ? (
                        <div
                            className="interactive-embed space-y-4 w-full h-full"
                            dangerouslySetInnerHTML={{ __html: htmlContent }}
                        />
                    ) : iframeUrl ? (
                        <iframe
                            src={iframeUrl}
                            className="w-full h-full rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950"
                            title="Interactive Experience"
                        />
                    ) : null}
                </div>
            </DialogContent>
        </Dialog>
    );
}
