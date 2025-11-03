import { redirect } from 'next/navigation';

import { getAuthContext } from '@/lib/auth';
import { CreateArticleForm } from '../CreateArticleForm';

export const metadata = {
  title: 'New Article • Admin'
};

export default async function AdminArticlesNewPage() {
  const { role } = await getAuthContext();
  if (role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="space-y-10">
      <div className="max-w-3xl space-y-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary-600 dark:border-primary-400/40 dark:bg-primary-400/10 dark:text-primary-300">
          Articles
        </span>
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">Create a new article</h1>
        <p className="text-base text-neutral-600 dark:text-neutral-400">
          Compose MDX with pillar tagging and optional interactive embeds. Publishing immediately revalidates the blog listing and article page.
        </p>
      </div>
      <CreateArticleForm defaultStatus="published" />
    </div>
  );
}
