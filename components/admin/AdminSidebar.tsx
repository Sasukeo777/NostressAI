'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import {
    LayoutDashboard,
    FileText,
    GraduationCap,
    Library,
    MessageSquare,
    Mail,
    Crown,
    Info,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { useState } from 'react';
import { logoutAndRedirect } from '@/app/login/actions';
import { Button } from '@/components/ui/Button';

const NAV_ITEMS = [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/articles', label: 'Articles', icon: FileText },
    { href: '/admin/courses', label: 'Courses', icon: GraduationCap },
    { href: '/admin/resources', label: 'Resources', icon: Library },
    { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
    { href: '/admin/newsletter', label: 'Newsletter', icon: Mail },
    { href: '/admin/premium', label: 'NoStress+', icon: Crown },
    { href: '/admin/about', label: 'About Page', icon: Info },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 right-4 z-50 p-2 rounded-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-200 dark:border-white/10 shadow-lg md:hidden"
            >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Sidebar Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-40 w-72 transform transition-transform duration-300 ease-in-out md:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="h-full flex flex-col bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-r border-neutral-200 dark:border-white/10">
                    {/* Header */}
                    <div className="p-6 border-b border-neutral-200 dark:border-white/10">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 via-sky-500 to-emerald-500 text-white shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform">
                                <span className="text-sm font-bold tracking-wide">NS</span>
                            </div>
                            <div>
                                <h1 className="font-serif text-lg font-medium text-neutral-900 dark:text-white">NoStress AI</h1>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">Admin Console</p>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                        isActive
                                            ? "bg-primary-50 text-primary-900 dark:bg-primary-900/20 dark:text-primary-100 shadow-sm ring-1 ring-primary-200 dark:ring-primary-800"
                                            : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-white/5 hover:translate-x-1"
                                    )}
                                >
                                    <Icon className={cn("h-5 w-5", isActive ? "text-primary-600 dark:text-primary-400" : "text-neutral-400")} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-neutral-200 dark:border-white/10">
                        <form action={logoutAndRedirect}>
                            <button
                                type="submit"
                                className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-neutral-600 hover:bg-red-50 hover:text-red-600 dark:text-neutral-400 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
                            >
                                <LogOut className="h-5 w-5" />
                                Sign Out
                            </button>
                        </form>
                    </div>
                </div>
            </aside>
        </>
    );
}
