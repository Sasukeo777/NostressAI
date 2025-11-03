import { notFound, redirect } from 'next/navigation';

import { getAuthContext } from '@/lib/auth';
import { getArticleForEdit } from '@/lib/server/articles';
import { EditArticleForm } from '../EditArticleForm';

export const metadata = {
  title: 'Edit Article • Admin'
};

interface AdminArticleEditPageProps {
  params: { slug: string };
}

export default async function AdminArticleEditPage({ params }: AdminArticleEditPageProps) {
  const { role } = await getAuthContext();
  if (role !== 'admin') {
    redirect('/');
  }

  const article = await getArticleForEdit(params.slug);
  if (!article) {
    notFound();
  }

  return (
    <div className="space-y-10">
      <div className="max-w-3xl space-y-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary-600 dark:border-primary-400/40 dark:bg-primary-400/10 dark:text-primary-300">
          Edit
        </span>
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">{article.title}</h1>
        <p className="text-base text-neutral-600 dark:text-neutral-400">
          Update copy, pillars, and metadata. Visibility controls live in the Articles dashboard.
        </p>
      </div>

      <EditArticleForm article={article} />
    </div>
  );
}
