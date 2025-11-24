import Link from 'next/link';
import { listFormations } from '@/lib/server/formations';
import { getAllPosts } from '@/lib/blog';
import { getAllResources } from '@/lib/resources';
import { countContactMessages } from '@/lib/server/contactMessages';
import { countNewsletterSignups } from '@/lib/server/newsletter';
import {
  FileText,
  GraduationCap,
  Library,
  MessageSquare,
  Mail,
  ArrowRight,
  Plus,
  Settings
} from 'lucide-react';

export default async function AdminPage() {
  const [formations, posts, resources, contactCount, newsletterCount] = await Promise.all([
    listFormations(),
    getAllPosts(),
    getAllResources(),
    countContactMessages(),
    countNewsletterSignups()
  ]);

  const stats = [
    { label: 'Articles', count: posts.length, href: '/admin/articles', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Courses', count: formations.length, href: '/admin/courses', icon: GraduationCap, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Resources', count: resources.length, href: '/admin/resources', icon: Library, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Messages', count: contactCount, href: '/admin/messages', icon: MessageSquare, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Subscribers', count: newsletterCount, href: '/admin/newsletter', icon: Mail, color: 'text-pink-500', bg: 'bg-pink-500/10' }
  ];

  const quickActions = [
    {
      title: 'New Article',
      desc: 'Draft and publish a new blog post.',
      href: '/admin/articles',
      icon: FileText
    },
    {
      title: 'New Course',
      desc: 'Create a new learning module.',
      href: '/admin/courses',
      icon: GraduationCap
    },
    {
      title: 'New Resource',
      desc: 'Add a tip or tool to the library.',
      href: '/admin/resources/new',
      icon: Library
    },
    {
      title: 'Manage About',
      desc: 'Update the manifesto content.',
      href: '/admin/about',
      icon: Settings
    }
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-3xl font-medium text-neutral-900 dark:text-white">Dashboard</h1>
        <p className="text-neutral-600 dark:text-neutral-400">Overview of your platform's content and activity.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-neutral-400 transition-transform group-hover:translate-x-1" />
              </div>
              <p className="text-3xl font-semibold text-neutral-900 dark:text-white mb-1">{stat.count}</p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">{stat.label}</p>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <section>
        <h2 className="text-lg font-medium text-neutral-900 dark:text-white mb-6">Quick Actions</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                className="group flex flex-col gap-4 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm p-6 transition-all hover:border-primary-500/50 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-full bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-300 group-hover:bg-primary-50 group-hover:text-primary-600 dark:group-hover:bg-primary-900/20 dark:group-hover:text-primary-400 transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <Plus className="h-4 w-4 text-neutral-400" />
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900 dark:text-white mb-1">{action.title}</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{action.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
