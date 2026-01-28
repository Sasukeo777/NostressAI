import { redirect } from 'next/navigation';
import { getAuthContext } from '@/lib/auth';
import { listFormationsForAdmin } from '@/lib/server/formations';
import { CreateCourseForm } from './CreateCourseForm';
import { CourseVisibilityManager } from './CourseVisibilityManager';
import { setFormationListingVisibility } from './actions';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Create Course • Admin'
};

export default async function AdminCoursesPage() {
  const { role } = await getAuthContext();
  if (role !== 'admin') {
    redirect('/');
  }

  const formations = await listFormationsForAdmin();

  return (
    <div className="space-y-10">
      <div className="max-w-3xl space-y-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:border-emerald-400/40 dark:bg-emerald-400/10 dark:text-emerald-300">
          Courses
        </span>
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">Create a new learning path</h1>
        <p className="text-base text-neutral-600 dark:text-neutral-400">
          Publish a structured learning path and direct learners to Udemy (or another platform) via the call-to-action link.
        </p>
      </div>
      <CreateCourseForm />
      <CourseVisibilityManager formations={formations} onToggle={setFormationListingVisibility} />
    </div>
  );
}
