'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Home, BookOpen, Newspaper, Library, User, Sun, Moon } from 'lucide-react';
import Dock from '@/components/ui/Dock';
import { useAuth } from '@/lib/auth-context';
import { AuthDialog } from '@/components/auth/AuthDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/AvatarFallback';

export function DockNavbar() {
    const router = useRouter();
    const { user, profile } = useAuth();
    const [authOpen, setAuthOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [dark, setDark] = useState(false);

    // Theme logic
    useEffect(() => {
        setMounted(true);
        const isDark = document.documentElement.classList.contains('dark');
        setDark(isDark);

        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const onMedia = (e: MediaQueryListEvent) => {
            const ls = localStorage.getItem('theme');
            if (!ls) {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        };
        media.addEventListener('change', onMedia);

        const onStorage = (e: StorageEvent) => {
            if (e.key === 'theme' && e.newValue) {
                applyTheme(e.newValue as 'dark' | 'light');
            }
        };
        window.addEventListener('storage', onStorage);
        return () => {
            media.removeEventListener('change', onMedia);
            window.removeEventListener('storage', onStorage);
        };
    }, []);

    function applyTheme(mode: 'dark' | 'light') {
        setDark(mode === 'dark');
        document.documentElement.classList.toggle('dark', mode === 'dark');
        document.documentElement.dataset.theme = mode;
    }

    function toggleTheme() {
        const next = dark ? 'light' : 'dark';
        applyTheme(next);
        try { localStorage.setItem('theme', next); } catch { }
    }

    const isAuthenticated = !!user;
    const currentEmail = user?.email ?? undefined;
    const displayName = profile?.displayName ?? currentEmail ?? null;
    const avatarUrl = profile?.avatarUrl ?? null;

    const initials = useMemo(() => {
        const source = displayName || currentEmail || '??';
        return source
            .split(' ')
            .map((part) => part[0]?.toUpperCase())
            .join('')
            .slice(0, 2);
    }, [displayName, currentEmail]);

    const items = [
        {
            icon: <Home size={20} className="text-neutral-600 dark:text-neutral-300" />,
            label: 'Home',
            onClick: () => router.push('/'),
        },
        {
            icon: <BookOpen size={20} className="text-neutral-600 dark:text-neutral-300" />,
            label: 'Courses',
            onClick: () => router.push('/courses'),
        },
        {
            icon: <Newspaper size={20} className="text-neutral-600 dark:text-neutral-300" />,
            label: 'Blog',
            onClick: () => router.push('/blog'),
        },
        {
            icon: <Library size={20} className="text-neutral-600 dark:text-neutral-300" />,
            label: 'Resources',
            onClick: () => router.push('/resources'),
        },
        {
            icon: mounted ? (
                dark ? <Sun size={20} className="text-neutral-600 dark:text-neutral-300" /> : <Moon size={20} className="text-neutral-600 dark:text-neutral-300" />
            ) : (
                <Sun size={20} className="text-neutral-600 dark:text-neutral-300 opacity-0" />
            ),
            label: dark ? 'Light Mode' : 'Dark Mode',
            onClick: toggleTheme,
        },
        {
            icon: isAuthenticated ? (
                <Avatar className="h-6 w-6 overflow-hidden rounded-full border border-neutral-300 dark:border-neutral-600">
                    {avatarUrl ? (
                        <AvatarImage src={avatarUrl} alt={displayName ?? 'Profile'} className="h-full w-full object-cover" />
                    ) : (
                        <AvatarFallback className="flex h-full w-full items-center justify-center bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 text-[10px] font-semibold">
                            {initials}
                        </AvatarFallback>
                    )}
                </Avatar>
            ) : (
                <User size={20} className="text-neutral-600 dark:text-neutral-300" />
            ),
            label: isAuthenticated ? 'Profile' : 'Sign In',
            onClick: () => {
                setAuthOpen(true);
            },
        },
    ];

    return (
        <>
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
                <Dock
                    items={items}
                    panelHeight={60}
                    baseItemSize={45}
                    magnification={65}
                    distance={100}
                />
            </div>
            <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
        </>
    );
}
