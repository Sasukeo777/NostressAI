import { redirect } from 'next/navigation';

import { getAuthContext } from '@/lib/auth';
import { CreateResourceForm } from '../CreateResourceForm';

export const metadata = {
  title: 'New Resource • Admin'
};

export default async function AdminResourcesNewPage() {
  const { role } = await getAuthContext();
  if (role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="space-y-10">
      <div className="max-w-3xl space-y-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:border-emerald-300/40 dark:bg-emerald-300/10 dark:text-emerald-200">
          Resources
        </span>
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">Create a new resource</h1>
        <p className="text-base text-neutral-600 dark:text-neutral-400">
          Publish a tip or research summary with associated pillars. Items appear instantly on the Resources page once marked as published and visible.
        </p>
      </div>
      <CreateResourceForm defaultStatus="published" />
    </div>
  );
}
