"use client";

import { useFormState } from 'react-dom';

import { HOLISTIC_PILLARS } from '@/lib/pillars';
import { createResource, type CreateResourceState } from './actions';

interface CreateResourceFormProps {
  defaultStatus?: 'draft' | 'published';
}

export function CreateResourceForm({ defaultStatus = 'draft' }: CreateResourceFormProps) {
  const initialState: CreateResourceState = {};
  const [state, formAction] = useFormState<CreateResourceState, FormData>(createResource, initialState);

  const fieldClass =
    'w-full rounded-xl border border-neutral-200/70 bg-white/90 px-3 py-2 text-sm shadow-sm transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 dark:border-neutral-700/70 dark:bg-neutral-900/70 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20';
  const textAreaClass =
    'w-full rounded-xl border border-neutral-200/70 bg-white/90 px-3 py-2 text-sm shadow-sm font-mono transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 dark:border-neutral-700/70 dark:bg-neutral-900/70 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20';

  return (
    <form
      action={formAction}
      className="space-y-7 rounded-3xl border border-white/40 bg-white/80 p-8 shadow-2xl ring-1 ring-emerald-500/10 backdrop-blur dark:border-neutral-800/60 dark:bg-neutral-950/70 dark:ring-white/5"
    >
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Create a new resource</h2>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          Publish a practical tip or study summary with pillar tagging. Resources appear instantly on the public library when published.
        </p>
      </div>

      {state?.error && (
        <div className="rounded-xl border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">{state.error}</div>
      )}
      {state?.success && (
        <div className="rounded-xl border border-success/40 bg-success/10 px-3 py-2 text-sm text-success">{state.success}</div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className={fieldClass}
            placeholder="Resource title"
            aria-invalid={Boolean(state?.fieldErrors?.title)}
            aria-describedby={state?.fieldErrors?.title ? 'title-error' : undefined}
          />
          {state?.fieldErrors?.title && <p id="title-error" className="text-xs text-danger">{state.fieldErrors.title}</p>}
        </div>
        <div className="space-y-2">
          <label htmlFor="slug" className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
            Slug (optional)
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            className={fieldClass}
            placeholder="leave blank to auto-generate"
            aria-invalid={Boolean(state?.fieldErrors?.slug)}
            aria-describedby={state?.fieldErrors?.slug ? 'slug-error' : undefined}
          />
          {state?.fieldErrors?.slug && <p id="slug-error" className="text-xs text-danger">{state.fieldErrors.slug}</p>}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="type" className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
            Type
          </label>
          <select
            id="type"
            name="type"
            defaultValue="tip"
            className={fieldClass}
            aria-invalid={Boolean(state?.fieldErrors?.type)}
            aria-describedby={state?.fieldErrors?.type ? 'type-error' : undefined}
          >
            <option value="tip">Tip</option>
            <option value="study">Study</option>
          </select>
          {state?.fieldErrors?.type && <p id="type-error" className="text-xs text-danger">{state.fieldErrors.type}</p>}
        </div>
        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
            Status
          </label>
          <select id="status" name="status" defaultValue={defaultStatus} className={fieldClass}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="publishedAt" className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
            Published at
          </label>
          <input
            id="publishedAt"
            name="publishedAt"
            type="datetime-local"
            defaultValue={new Date().toISOString().slice(0, 16)}
            className={fieldClass}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="tags" className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
            Tags (comma separated)
          </label>
          <input id="tags" name="tags" type="text" className={fieldClass} placeholder="stress, focus, routines" />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="excerpt" className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
          Excerpt
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={3}
          className={textAreaClass}
          placeholder="Short summary shown on the resources listing."
        />
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Pillars</p>
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          {HOLISTIC_PILLARS.map((pillar) => (
            <label
              key={pillar.id}
              className="flex items-start gap-3 rounded-2xl border border-neutral-200/60 bg-white/80 px-3 py-3 text-sm shadow-sm transition hover:border-emerald-300/60 hover:shadow-md dark:border-neutral-800/70 dark:bg-neutral-900/70 dark:hover:border-emerald-400/60"
            >
              <input
                type="checkbox"
                name="pillars"
                value={pillar.id}
                className="mt-1 h-4 w-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500 dark:border-neutral-600 dark:bg-neutral-900"
              />
              <span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-50">{pillar.name}</span>
                <span className="block text-xs text-neutral-500 dark:text-neutral-400">{pillar.tagline}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="body" className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
          Resource body (MDX)
        </label>
        <textarea
          id="body"
          name="body"
          rows={16}
          required
          className={textAreaClass}
          placeholder="## Key insight&#10;&#10;Share the actionable steps or research summary..."
          aria-invalid={Boolean(state?.fieldErrors?.body)}
          aria-describedby={state?.fieldErrors?.body ? 'body-error' : undefined}
        />
        {state?.fieldErrors?.body && <p id="body-error" className="text-xs text-danger">{state.fieldErrors.body}</p>}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-neutral-900/15 transition hover:-translate-y-[1px] hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:shadow-white/10 dark:hover:bg-neutral-200"
        >
          Create resource
        </button>
      </div>
    </form>
  );
}
