'use client';

import { useFormState } from 'react-dom';
import { useMemo } from 'react';

import { HOLISTIC_PILLARS } from '@/lib/pillars';
import { createArticle, type CreateArticleState } from './actions';

interface CreateArticleFormProps {
  defaultStatus?: 'draft' | 'published';
}

export function CreateArticleForm({ defaultStatus = 'draft' }: CreateArticleFormProps) {
  const initialState: CreateArticleState = {};
  const [state, formAction] = useFormState<CreateArticleState, FormData>(createArticle, initialState);

  const statusOptions = useMemo(
    () => [
      { value: 'draft', label: 'Draft' },
      { value: 'published', label: 'Published' }
    ],
    []
  );

  const fieldClass =
    'w-full rounded-xl border border-neutral-200/70 bg-white/90 px-3 py-2 text-sm shadow-sm transition focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-neutral-700/70 dark:bg-neutral-900/70 dark:focus:border-primary-400 dark:focus:ring-primary-500/20';
  const textAreaClass =
    'w-full rounded-xl border border-neutral-200/70 bg-white/90 px-3 py-2 text-sm shadow-sm font-mono transition focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-neutral-700/70 dark:bg-neutral-900/70 dark:focus:border-primary-400 dark:focus:ring-primary-500/20';

  return (
    <form
      action={formAction}
      className="space-y-7 rounded-3xl border border-white/40 bg-white/80 p-8 shadow-2xl ring-1 ring-primary-500/10 backdrop-blur dark:border-neutral-800/60 dark:bg-neutral-950/70 dark:ring-white/5"
    >
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Create a new article</h2>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          Write, categorise, and publish calm-first content with instant cache revalidation.
        </p>
      </div>

      {state?.error && (
        <div className="rounded-xl border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="rounded-xl border border-success/40 bg-success/10 px-3 py-2 text-sm text-success">
          {state.success}
        </div>
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
            className={fieldClass}
            placeholder="Article headline"
            required
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
          <label htmlFor="category" className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
            Category
          </label>
          <input
            id="category"
            name="category"
            type="text"
            className={fieldClass}
            placeholder="e.g. neuroscience"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="tags" className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
            Tags (comma separated)
          </label>
          <input
            id="tags"
            name="tags"
            type="text"
            className={fieldClass}
            placeholder="stress, burnout, recovery"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="heroImage" className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
            Hero image URL
          </label>
          <input
            id="heroImage"
            name="heroImage"
            type="url"
            className={fieldClass}
            placeholder="https://..."
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="interactiveSlug" className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
            Interactive slug (optional)
          </label>
          <input
            id="interactiveSlug"
            name="interactiveSlug"
            type="text"
            className={fieldClass}
            placeholder="resilient-child"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={defaultStatus}
            className={fieldClass}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="publishedAt" className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
            Published at
          </label>
          <input
            id="publishedAt"
            name="publishedAt"
            type="datetime-local"
            className={fieldClass}
            defaultValue={new Date().toISOString().slice(0, 16)}
          />
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
          placeholder="Short summary for listings and SEO."
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
                <span className="font-semibold text-neutral-900 dark:text-neutral-50">{pillar.name}</span>
                <span className="block text-xs text-neutral-500 dark:text-neutral-400">{pillar.tagline}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="body" className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
          Article body (MDX)
        </label>
        <div className="rounded-2xl border border-neutral-200/70 bg-white/80 px-3 py-3 text-xs text-neutral-600 shadow-sm dark:border-neutral-800/70 dark:bg-neutral-950/70 dark:text-neutral-400">
          <p className="font-semibold text-neutral-700 dark:text-neutral-200">Example syntax:</p>
          <pre className="mt-2 whitespace-pre-wrap rounded-xl bg-neutral-100/70 p-3 font-mono text-[11px] leading-relaxed text-neutral-700 dark:bg-neutral-900/70 dark:text-neutral-200">
            {`## Headline Section

Use **markdown** for emphasis, \`code\`, and component embeds:

<PillarBadge pillar="mind-body" />

- Bullet points
- Quotes
- Callouts with custom components`}
          </pre>
        </div>
        <textarea
          id="body"
          name="body"
          rows={18}
          className={textAreaClass}
          placeholder="## Introduction&#10;&#10;Write your article in MDX..."
          required
          aria-invalid={Boolean(state?.fieldErrors?.body)}
          aria-describedby={state?.fieldErrors?.body ? 'body-error' : undefined}
        />
        {state?.fieldErrors?.body && <p id="body-error" className="text-xs text-danger">{state.fieldErrors.body}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="interactiveHtml" className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
          Interactive embed (optional HTML)
        </label>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Paste trusted HTML such as an iframe, chart snippet, or custom widget. Rendered beneath the article body.
        </p>
        <textarea
          id="interactiveHtml"
          name="interactiveHtml"
          rows={6}
          className={textAreaClass}
          placeholder={'<iframe src="https://..." width="100%" height="480" />'}
        />
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          type="submit"
          className="inline-flex items-center rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-neutral-900/15 transition hover:-translate-y-[1px] hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:shadow-white/10 dark:hover:bg-neutral-200"
        >
          Publish article
        </button>
      </div>
    </form>
  );
}
