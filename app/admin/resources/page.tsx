import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getAuthContext } from '@/lib/auth';
import { listResourcesForAdmin } from '@/lib/server/resources';
import { setResourceListingVisibility } from './actions';
import { ResourceManagerTable } from './ResourceManagerTable';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Resources • Admin'
};

export default async function AdminResourcesPage() {
  const { role } = await getAuthContext();
  if (role !== 'admin') {
    redirect('/');
  }

  const resources = await listResourcesForAdmin();

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:border-emerald-300/40 dark:bg-emerald-300/10 dark:text-emerald-200">
            Resources
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">Manage resource library</h1>
          <p className="text-base text-neutral-600 dark:text-neutral-400">
            Filter by pillar, type, or title, toggle public visibility, and jump into editing. Hidden resources stay editable but disappear from the public catalog.
          </p>
        </div>
        <div>
          <Link
            href="/admin/resources/new"
            className="inline-flex items-center rounded-full bg-neutral-900 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-neutral-900/15 transition hover:-translate-y-[1px] hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:shadow-white/10 dark:hover:bg-neutral-200"
          >
            New resource
          </Link>
        </div>
      </div>

      <ResourceManagerTable resources={resources} onToggle={setResourceListingVisibility} />
    </div>
  );
}
