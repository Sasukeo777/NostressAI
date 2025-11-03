'use client';

import { useMemo, useState } from 'react';
import { useFormState } from 'react-dom';

import { HOLISTIC_PILLARS } from '@/lib/pillars';
import type { AdminArticleDetail, HolisticPillar } from '@/lib/types';
import { updateArticle, type UpdateArticleState } from './actions';

interface EditArticleFormProps {
  article: AdminArticleDetail;
}

export function EditArticleForm({ article }: EditArticleFormProps) {
  const initialState: UpdateArticleState = {};
  const [state, formAction] = useFormState<UpdateArticleState, FormData>(updateArticle, initialState);
  const [selectedPillars, setSelectedPillars] = useState<Set<HolisticPillar>>(new Set(article.pillars ?? []));

  const togglePillar = (pillar: HolisticPillar) => {
    setSelectedPillars((prev) => {
      const next = new Set(prev);
      if (next.has(pillar)) {
        next.delete(pillar);
      } else {
        next.add(pillar);
      }
      return next;
    });
  };

  const publishedAtValue = useMemo(() => {
    if (article.publishedAt) {
      const date = new Date(article.publishedAt);
      if (!Number.isNaN(date.getTime())) {
        return date.toISOString().slice(0, 16);
      }
    }
    return '';
  }, [article.publishedAt]);

  const fieldClass =
    'w-full rounded-xl border border-neutral-200/70 bg-white/90 px-3 py-2 text-sm shadow-sm transition focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-neutral-700/70 dark:bg-neutral-900/70 dark:focus:border-primary-400 dark:focus:ring-primary-500/20';
  const textAreaClass =
    'w-full rounded-xl border border-neutral-200/70 bg-white/90 px-3 py-2 text-sm shadow-sm font-mono transition focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-neutral-700/70 dark:bg-neutral-900/70 dark:focus:border-primary-400 dark:focus:ring-primary-500/20';

  return (
    <form
      action={(formData) => {
        formData.delete('pillars');
        selectedPillars.forEach((pillar) => formData.append('pillars', pillar));
        formAction(formData);
      }}
      className="space-y-7 rounded-3xl border border-white/40 bg-white/80 p-8 shadow-2xl ring-1 ring-primary-500/10 backdrop-blur dark:border-neutral-800/60 dark:bg-neutral-950/70 dark:ring-white/5"
    >
      <input type="hidden" name="articleId" value={article.id} />
      <input type="hidden" name="originalSlug" value={article.slug} />

      <div className="flex flex-col gap-4 rounded-2xl border border-white/50 bg-white/70 px-4 py-3 shadow-inner dark:border-neutral-800/60 dark:bg-neutral-900/60 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400">Current status</p>
          <div className="mt-1 text-sm text-neutral-700 dark:text-neutral-200">
            {article.status ?? 'draft'} • {article.isListed ? 'Visible' : 'Hidden'}
          </div>
        </div>
        {article.publishedAt && (
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            Published {new Date(article.publishedAt).toLocaleString('en-GB')}
          </div>
        )}
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
            defaultValue={article.title}
            required
            className={fieldClass}
            aria-invalid={Boolean(state?.fieldErrors?.title)}
            aria-describedby={state?.fieldErrors?.title ? 'title-error' : undefined}
          />
          {state?.fieldErrors?.title && <p id="title-error" className="text-xs text-danger">{state.fieldErrors.title}</p>}
        </div>
        <div className="space-y-2">
          <label htmlFor="slug" className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            defaultValue={article.slug}
            required
            className={fieldClass}
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
            defaultValue={article.category ?? ''}
            className={fieldClass}
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
            defaultValue={article.tags?.join(', ') ?? ''}
            className={fieldClass}
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
            defaultValue={article.heroImage ?? ''}
            className={fieldClass}
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
            defaultValue={article.interactiveSlug ?? ''}
            className={fieldClass}
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
            defaultValue={article.status ?? 'draft'}
            className={fieldClass}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
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
            defaultValue={publishedAtValue}
            className={fieldClass}
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
          defaultValue={article.excerpt ?? ''}
          className={textAreaClass}
        />
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Pillars</p>
        <div className="flex flex-wrap gap-2">
          {HOLISTIC_PILLARS.map((pillar) => {
            const isSelected = selectedPillars.has(pillar.id);
            return (
              <button
                key={pillar.id}
                type="button"
                onClick={() => togglePillar(pillar.id)}
                className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  isSelected
                    ? 'bg-neutral-900 text-white shadow-sm dark:bg-white dark:text-neutral-900'
                    : 'bg-neutral-100/70 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800/60 dark:text-neutral-300 dark:hover:bg-neutral-700'
                }`}
              >
                {pillar.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="body" className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
          Article body (MDX)
        </label>
        <textarea
          id="body"
          name="body"
          rows={18}
          defaultValue={article.body}
          required
          className={textAreaClass}
          aria-invalid={Boolean(state?.fieldErrors?.body)}
          aria-describedby={state?.fieldErrors?.body ? 'body-error' : undefined}
        />
        {state?.fieldErrors?.body && <p id="body-error" className="text-xs text-danger">{state.fieldErrors.body}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="interactiveHtml" className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
          Interactive embed (optional HTML)
        </label>
        <textarea
          id="interactiveHtml"
          name="interactiveHtml"
          rows={6}
          defaultValue={article.interactiveHtml ?? ''}
          className={textAreaClass}
        />
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Paste trusted HTML such as an iframe, chart snippet, or custom widget. Rendered beneath the article body.
        </p>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-neutral-900/15 transition hover:-translate-y-[1px] hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:shadow-white/10 dark:hover:bg-neutral-200"
        >
          Save changes
        </button>
      </div>
    </form>
  );
}
