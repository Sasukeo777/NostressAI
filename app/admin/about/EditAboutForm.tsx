'use client';

import { useFormState } from 'react-dom';
import type { AboutActionState } from './actions';
import { saveAbout } from './actions';

interface EditAboutFormProps {
  heading: string;
  body: string;
}

export function EditAboutForm({ heading, body }: EditAboutFormProps) {
  const aboutInitialState: AboutActionState = {};
  const [state, formAction] = useFormState<AboutActionState, FormData>(saveAbout, aboutInitialState);

  const fieldClass =
    'w-full rounded-xl border border-neutral-200/70 bg-white/90 px-3 py-2 text-sm shadow-sm transition focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-neutral-700/70 dark:bg-neutral-900/70 dark:focus:border-primary-400 dark:focus:ring-primary-500/20';
  const textAreaClass =
    'w-full rounded-xl border border-neutral-200/70 bg-white/90 px-3 py-2 text-sm shadow-sm font-mono transition focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-neutral-700/70 dark:bg-neutral-900/70 dark:focus:border-primary-400 dark:focus:ring-primary-500/20';

  return (
    <form
      action={formAction}
      className="space-y-7 rounded-3xl border border-white/40 bg-white/80 p-8 shadow-2xl ring-1 ring-primary-500/10 backdrop-blur dark:border-neutral-800/60 dark:bg-neutral-950/70 dark:ring-white/5"
    >
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">Edit About page</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">Update the headline and MDX body rendered on the public About page.</p>
      </div>

      {state?.error && (
        <div className="rounded-xl border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">{state.error}</div>
      )}
      {state?.success && (
        <div className="rounded-xl border border-success/40 bg-success/10 px-3 py-2 text-sm text-success">{state.success}</div>
      )}

      <div className="space-y-2">
        <label htmlFor="heading" className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Heading</label>
        <input
          id="heading"
          name="heading"
          type="text"
          defaultValue={heading}
          required
          className={fieldClass}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="body" className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Body (MDX)</label>
        <textarea
          id="body"
          name="body"
          rows={18}
          defaultValue={body}
          required
          className={textAreaClass}
        />
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Supports Markdown, MDX components, and custom layouts. The first heading should be an <code>h2</code> for best results.
        </p>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-neutral-900/15 transition hover:-translate-y-[1px] hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:shadow-white/10 dark:hover:bg-neutral-200"
        >
          Save changes
        </button>
      </div>
    </form>
  );
}
