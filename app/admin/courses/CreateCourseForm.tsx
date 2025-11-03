'use client';

import { useFormState } from 'react-dom';
import { HOLISTIC_PILLARS } from '@/lib/pillars';
import type { FormationStatus } from '@/lib/types';
import { createCourse, type CreateCourseState } from './actions';

const statusOptions: { value: FormationStatus; label: string }[] = [
  { value: 'soon', label: 'Soon' },
  { value: 'prelaunch', label: 'Prelaunch' },
  { value: 'available', label: 'Available' }
];

export function CreateCourseForm() {
  const initialState: CreateCourseState = {};
  const [state, formAction] = useFormState<CreateCourseState, FormData>(createCourse, initialState);

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
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">New course</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">Link a structured learning path to Udemy or any external platform.</p>
      </div>

      {state?.error && (
        <div className="rounded-xl border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">{state.error}</div>
      )}
      {state?.success && (
        <div className="rounded-xl border border-success/40 bg-success/10 px-3 py-2 text-sm text-success">{state.success}</div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            className={fieldClass}
            placeholder="Stress recovery blueprint"
            required
            aria-invalid={Boolean(state?.fieldErrors?.title)}
            aria-describedby={state?.fieldErrors?.title ? 'title-error' : undefined}
          />
          {state?.fieldErrors?.title && <p id="title-error" className="text-xs text-danger">{state.fieldErrors.title}</p>}
        </div>
        <div className="space-y-2">
          <label htmlFor="slug" className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Slug (optional)</label>
          <input
            id="slug"
            name="slug"
            type="text"
            className={fieldClass}
            placeholder="auto-generated if empty"
            aria-invalid={Boolean(state?.fieldErrors?.slug)}
            aria-describedby={state?.fieldErrors?.slug ? 'slug-error' : undefined}
          />
          {state?.fieldErrors?.slug && <p id="slug-error" className="text-xs text-danger">{state.fieldErrors.slug}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="summary" className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Summary</label>
        <textarea
          id="summary"
          name="summary"
          rows={3}
          className={textAreaClass}
          placeholder="Short teaser shown on the listing."
          required
        />
        {state?.fieldErrors?.summary && <p className="text-xs text-danger">{state.fieldErrors.summary}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Description (MDX)</label>
        <textarea
          id="description"
          name="description"
          rows={10}
          className={textAreaClass}
          placeholder={"## Why this course\n\nExplain what learners will gain..."}
          required
          aria-invalid={Boolean(state?.fieldErrors?.description)}
          aria-describedby={state?.fieldErrors?.description ? 'description-error' : undefined}
        />
        {state?.fieldErrors?.description && <p id="description-error" className="text-xs text-danger">{state.fieldErrors.description}</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Status</label>
          <select id="status" name="status" className={fieldClass} defaultValue="soon">
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="level" className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Level</label>
          <input
            id="level"
            name="level"
            type="text"
            className={fieldClass}
            placeholder="intro / intermediate / advanced"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="duration" className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Duration</label>
          <input
            id="duration"
            name="duration"
            type="text"
            className={fieldClass}
            placeholder="e.g. 4 weeks"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="price" className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Price (USD)</label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            className={fieldClass}
            placeholder="Optional"
            aria-invalid={Boolean(state?.fieldErrors?.price)}
          />
          {state?.fieldErrors?.price && <p className="text-xs text-danger">{state.fieldErrors.price}</p>}
        </div>
        <div className="space-y-2">
          <label htmlFor="ctaUrl" className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Udemy / external URL</label>
          <input
            id="ctaUrl"
            name="ctaUrl"
            type="url"
            className={fieldClass}
            placeholder="https://www.udemy.com/..."
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="modules" className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Modules (one per line)</label>
        <textarea
          id="modules"
          name="modules"
          rows={6}
          className={textAreaClass}
          placeholder={'Week 1 – Foundations\nWeek 2 – Habit Loops'}
        />
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Pillars</p>
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          {HOLISTIC_PILLARS.map((pillar) => (
            <label
              key={pillar.id}
              className="flex items-start gap-3 rounded-2xl border border-neutral-200/60 bg-white/80 px-3 py-3 text-sm shadow-sm transition hover:border-primary-300/60 hover:shadow-md dark:border-neutral-800/70 dark:bg-neutral-900/70 dark:hover:border-primary-400/60"
            >
              <input
                type="checkbox"
                name="pillars"
                value={pillar.id}
                className="mt-1 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-900"
              />
              <span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">{pillar.name}</span>
                <span className="block text-xs text-neutral-500 dark:text-neutral-400">{pillar.tagline}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-neutral-900/15 transition hover:-translate-y-[1px] hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:shadow-white/10 dark:hover:bg-neutral-200"
        >
          Create course
        </button>
      </div>
    </form>
  );
}
