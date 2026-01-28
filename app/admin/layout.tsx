import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getAuthContext } from '@/lib/auth';
import { logoutAndRedirect } from '@/app/login/actions';
import { headers } from 'next/headers';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export const metadata = {
  title: 'Admin Dashboard'
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { user, role } = await getAuthContext();
  const headerList = await headers();
  const rawPath = headerList.get('x-invoke-path') ?? headerList.get('next-url') ?? '';
  const currentPath = rawPath.startsWith('http') ? new URL(rawPath).pathname : rawPath;
  const navItems = [
    { href: '/admin', label: 'Overview' },
    { href: '/admin/articles', label: 'Articles' },
    { href: '/admin/courses', label: 'Courses' },
    { href: '/admin/resources', label: 'Resources' },
    { href: '/admin/messages', label: 'Messages' },
    { href: '/admin/newsletter', label: 'Newsletter' },
    { href: '/admin/premium', label: 'NoStress+' },
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
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[image:var(--nature-glow)] dark:bg-[image:var(--nature-glow-dark)] opacity-30" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-200/20 dark:bg-primary-900/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-200/20 dark:bg-accent-900/10 blur-[100px] rounded-full" />
      </div>

      <AdminSidebar />

      <main className="relative z-10 md:pl-72 transition-all duration-300">
        <div className="mx-auto max-w-7xl px-6 py-12 md:px-12">
          {children}
        </div>
      </main>
    </div>
  );
}
