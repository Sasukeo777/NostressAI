import { redirect } from 'next/navigation';
import { getAuthContext } from '@/lib/auth';
import { getAboutContent } from './actions';
import { EditAboutForm } from './EditAboutForm';

export const metadata = {
  title: 'Edit About • Admin'
};

export default async function AdminAboutPage() {
  const { role } = await getAuthContext();
  if (role !== 'admin') {
    redirect('/');
  }

  const about = await getAboutContent();

  return (
    <div className="space-y-10">
      <div className="max-w-3xl space-y-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:border-sky-400/40 dark:bg-sky-400/10 dark:text-sky-300">
          About
        </span>
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">Edit the manifesto</h1>
        <p className="text-base text-neutral-600 dark:text-neutral-400">
          Craft the manifesto and story shown on the public About page. Changes are stored in Supabase and rendered as MDX.
        </p>
      </div>
      <EditAboutForm heading={about?.heading ?? 'About NoStress AI'} body={about?.body_mdx ?? '# About NoStress AI'} />
    </div>
  );
}
