"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        Sentry.captureException(error);
    }, [error]);

    return (
        <html>
            <body>
                <div className="min-h-screen flex items-center justify-center px-4 bg-neutral-50">
                    <div className="max-w-md mx-auto text-center">
                        {/* Error icon */}
                        <div className="mb-8 flex justify-center">
                            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                                <AlertTriangle className="h-10 w-10 text-red-500" />
                            </div>
                        </div>

                        {/* Message */}
                        <h1 className="text-2xl font-serif font-medium text-neutral-900 mb-4">
                            Something went wrong
                        </h1>
                        <p className="text-neutral-600 mb-8">
                            We apologize for the inconvenience. Our team has been notified and is working on a fix.
                        </p>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={reset}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 transition-colors font-medium"
                            >
                                <RotateCcw className="h-4 w-4" />
                                Try again
                            </button>
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors font-medium"
                            >
                                <Home className="h-4 w-4" />
                                Go home
                            </Link>
                        </div>

                        {/* Error ID for support */}
                        {error.digest && (
                            <p className="mt-8 text-xs text-neutral-400">
                                Error ID: {error.digest}
                            </p>
                        )}
                    </div>
                </div>
            </body>
        </html>
    );
}
