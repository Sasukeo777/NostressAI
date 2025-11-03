import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getAuthContext } from '@/lib/auth';
import { logoutAndRedirect } from '@/app/login/actions';
import { headers } from 'next/headers';

export const metadata = {
  title: 'Admin Dashboard'
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { user, role } = await getAuthContext();
  const headerList = headers();
  const rawPath = headerList.get('x-invoke-path') ?? headerList.get('next-url') ?? '';
  const currentPath = rawPath.startsWith('http') ? new URL(rawPath).pathname : rawPath;
  const navItems = [
    { href: '/admin', label: 'Overview' },
    { href: '/admin/articles', label: 'Articles' },
    { href: '/admin/courses', label: 'Courses' },
    { href: '/admin/resources', label: 'Resources' },
    { href: '/admin/about', label: 'About page' }
  ];

  if (!user) {
    redirect('/login');
  }

  if (role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_55%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.12),transparent_45%)] opacity-80 dark:bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08),transparent_55%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.08),transparent_45%)]" />
      <header className="border-b border-neutral-200/70 dark:border-neutral-800/70 bg-white/75 dark:bg-neutral-950/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 via-sky-500 to-emerald-500 text-white shadow-lg shadow-primary-500/30">
              <span className="text-sm font-semibold tracking-wide">NS</span>
            </div>
            <div>
              <Link href="/admin" className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                NoStress AI · Admin
              </Link>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Signed in as {user.email ?? 'admin'}.</p>
            </div>
          </div>
          <form action={logoutAndRedirect} className="flex items-center gap-4">
            <nav className="hidden items-center gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-300 md:flex">
              {navItems.map((item) => {
                const isActive = currentPath === item.href || (item.href !== '/admin' && currentPath.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-full px-4 py-2 transition ${
                      isActive
                        ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                        : 'bg-neutral-100/60 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800/60 dark:text-neutral-300 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <button
              type="submit"
              className="rounded-full border border-neutral-200/70 bg-white/70 px-4 py-2 text-xs font-semibold text-neutral-700 shadow-sm transition hover:-translate-y-[1px] hover:bg-white dark:border-neutral-700/70 dark:bg-neutral-900/60 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              Sign out
            </button>
          </form>
          <nav className="flex w-full items-center justify-between gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-300 md:hidden">
            {navItems.map((item) => {
              const isActive = currentPath === item.href || (item.href !== '/admin' && currentPath.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`w-full rounded-full px-3 py-2 text-center transition ${
                    isActive
                      ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                      : 'bg-neutral-100/70 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800/60 dark:text-neutral-300 dark:hover:bg-neutral-700'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-12">{children}</main>
    </div>
  );
}
