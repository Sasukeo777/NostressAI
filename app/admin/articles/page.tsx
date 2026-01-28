import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getAuthContext } from '@/lib/auth';
import { listArticlesForAdmin } from '@/lib/server/articles';
import { setArticleListingVisibility } from './actions';
import { ArticleManagerTable } from './ArticleManagerTable';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Articles • Admin'
};

export default async function AdminArticlesPage() {
  const { role } = await getAuthContext();
  if (role !== 'admin') {
    redirect('/');
  }

  const articles = await listArticlesForAdmin();

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary-600 dark:border-primary-400/40 dark:bg-primary-400/10 dark:text-primary-300">
            Articles
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">Manage published articles</h1>
          <p className="text-base text-neutral-600 dark:text-neutral-400">
            Search, filter by pillars, toggle visibility, and jump into an editor to refine content. Hidden pieces stay editable but vanish from the public site.
          </p>
        </div>
        <div>
          <Link
            href="/admin/articles/new"
            className="inline-flex items-center rounded-full bg-neutral-900 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-neutral-900/15 transition hover:-translate-y-[1px] hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:shadow-white/10 dark:hover:bg-neutral-200"
          >
            New article
          </Link>
        </div>
      </div>

      <ArticleManagerTable articles={articles} onToggle={setArticleListingVisibility} />
    </div>
  );
}
