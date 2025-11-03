import { notFound, redirect } from 'next/navigation';

import { getAuthContext } from '@/lib/auth';
import { getResourceForEdit } from '@/lib/server/resources';
import { EditResourceForm } from '../EditResourceForm';

export const metadata = {
  title: 'Edit Resource • Admin'
};

interface AdminResourceEditPageProps {
  params: { slug: string };
}

export default async function AdminResourceEditPage({ params }: AdminResourceEditPageProps) {
  const { role } = await getAuthContext();
  if (role !== 'admin') {
    redirect('/');
  }

  const resource = await getResourceForEdit(params.slug);
  if (!resource) {
    notFound();
  }

  return (
    <div className="space-y-10">
      <div className="max-w-3xl space-y-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:border-emerald-300/40 dark:bg-emerald-300/10 dark:text-emerald-200">
          Edit
        </span>
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">{resource.title}</h1>
        <p className="text-base text-neutral-600 dark:text-neutral-400">
          Update metadata, body, and pillars. Visibility controls live in the Resources dashboard.
        </p>
      </div>

      <EditResourceForm resource={resource} />
    </div>
  );
}
