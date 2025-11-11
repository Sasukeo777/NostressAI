"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ui/ThemeToggle';
import { MobileMenu } from './ui/MobileMenu';
import { ProfileMenu } from '@/components/ui/ProfileMenu';

const navLinks = [
  { href: '/approach', label: 'Approach' },
  { href: '/courses', label: 'Courses' },
  { href: '/blog', label: 'Blog' },
  { href: '/videos', label: 'Videos' },
  { href: '/resources', label: 'Resources' },
  { href: '/pro', label: 'NoStress+' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' }
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-100/80 bg-neutral-25/80 backdrop-blur-lg supports-[backdrop-filter]:bg-neutral-25/80 dark:border-neutral-800/60 dark:bg-neutral-900/70">
      <div className="site-container relative flex h-16 items-center justify-center px-4">
        <div className="absolute inset-y-0 left-4 flex items-center md:left-6">
          <MobileMenu links={navLinks} />
        </div>
        <nav aria-label="Primary navigation" className="flex flex-col items-center">
          <Link href="/" className="relative mb-1 inline-flex items-center font-semibold text-lg tracking-tight text-neutral-700 dark:text-neutral-100">
            <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-accent-400 bg-clip-text text-transparent">NoStress AI</span>
          </Link>
          <ul className="hidden gap-2 text-sm font-medium md:flex">
            {navLinks.map((l) => {
              const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={`rounded-full px-3.5 py-1.5 transition-colors ${
                      active
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-800/40 dark:text-primary-200'
                        : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800/60 dark:hover:text-neutral-100'
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="absolute inset-y-0 right-4 flex items-center gap-2 md:right-6">
          <ProfileMenu />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
