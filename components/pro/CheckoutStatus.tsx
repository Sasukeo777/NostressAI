'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';

export function CheckoutStatus() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const status = searchParams.get('checkout');

    useEffect(() => {
        if (status) {
            // Clear the param after showing the message
            const timer = setTimeout(() => {
                router.replace('/pro', { scroll: false });
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [status, router]);

    if (!status) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-24 left-1/2 z-50 -translate-x-1/2"
            >
                <div className={`flex items-center gap-3 rounded-full px-6 py-3 shadow-xl backdrop-blur-md ${status === 'success'
                        ? 'bg-emerald-100/90 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/90 dark:text-emerald-100 dark:border-emerald-800'
                        : 'bg-red-100/90 text-red-800 border border-red-200 dark:bg-red-900/90 dark:text-red-100 dark:border-red-800'
                    }`}>
                    {status === 'success' ? (
                        <>
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-200 dark:bg-emerald-800">
                                <Check className="h-4 w-4" />
                            </div>
                            <span className="font-medium">Subscription active! Welcome to NoStress+.</span>
                        </>
                    ) : (
                        <>
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-200 dark:bg-red-800">
                                <X className="h-4 w-4" />
                            </div>
                            <span className="font-medium">Checkout cancelled. No charges were made.</span>
                        </>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
