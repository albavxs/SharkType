'use client'

import { useState } from 'react'
import { t, type Locale } from '@/lib/i18n'
import type { FeedEvent, ManualPostCategory } from '@/lib/server/feed-store'

interface ManualPostComposerProps {
  locale: Locale
  onCreated: (event: FeedEvent) => void
}

const categories: ManualPostCategory[] = ['ranked_tip', 'language_fact', 'announcement']

function getCategoryLabel(category: ManualPostCategory, locale: Locale): string {
  if (category === 'ranked_tip') return t('feedCategoryRankedTip', locale)
  if (category === 'language_fact') return t('feedCategoryLanguageFact', locale)
  return t('feedCategoryAnnouncement', locale)
}

export default function ManualPostComposer({ locale, onCreated }: ManualPostComposerProps) {
  const [category, setCategory] = useState<ManualPostCategory>('ranked_tip')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSuccess(null)
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/feed/manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category,
          title: { pt: title },
          body: { pt: body },
        }),
      })

      const payload = (await response.json()) as { error?: string; event?: FeedEvent }
      if (!response.ok || !payload.event) {
        setError(payload.error ?? 'Could not publish manual post.')
        return
      }

      setTitle('')
      setBody('')
      setSuccess(t('feedComposerSuccess', locale))
      onCreated(payload.event)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Could not publish manual post.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2rem] border p-5 sm:p-6"
      style={{
        borderColor: 'color-mix(in srgb, var(--sub) 22%, transparent)',
        backgroundColor: 'color-mix(in srgb, var(--sub-alt) 72%, transparent)',
      }}
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
          {t('feedComposerTitle', locale)}
        </h2>
        <p className="mt-1 text-sm" style={{ color: 'var(--sub)' }}>
          {t('feedComposerSubtitle', locale)}
        </p>
      </div>

      <div className="grid gap-4">
        <label className="grid gap-1.5 text-sm">
          <span style={{ color: 'var(--sub)' }}>{t('feedComposerCategory', locale)}</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value as ManualPostCategory)}
            className="rounded-2xl border px-3 py-3 text-sm outline-none"
            style={{ borderColor: 'color-mix(in srgb, var(--sub) 24%, transparent)', backgroundColor: 'color-mix(in srgb, var(--bg) 60%, transparent)', color: 'var(--text)' }}
          >
            {categories.map((value) => (
              <option key={value} value={value}>
                {getCategoryLabel(value, locale)}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1.5 text-sm">
          <span style={{ color: 'var(--sub)' }}>{t('feedComposerPostTitle', locale)}</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={120}
            required
            className="rounded-2xl border px-3 py-3 text-sm outline-none"
            style={{ borderColor: 'color-mix(in srgb, var(--sub) 24%, transparent)', backgroundColor: 'color-mix(in srgb, var(--bg) 60%, transparent)', color: 'var(--text)' }}
          />
        </label>

        <label className="grid gap-1.5 text-sm">
          <span style={{ color: 'var(--sub)' }}>{t('feedComposerBody', locale)}</span>
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            required
            rows={5}
            className="rounded-2xl border px-3 py-3 text-sm outline-none resize-y"
            style={{ borderColor: 'color-mix(in srgb, var(--sub) 24%, transparent)', backgroundColor: 'color-mix(in srgb, var(--bg) 60%, transparent)', color: 'var(--text)' }}
            placeholder={t('feedComposerBodyPlaceholder', locale)}
          />
        </label>
      </div>

      {error ? (
        <div className="mt-4 rounded-2xl px-3 py-2 text-sm" style={{ backgroundColor: 'color-mix(in srgb, var(--error) 14%, transparent)', color: 'var(--error)' }}>
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="mt-4 rounded-2xl px-3 py-2 text-sm" style={{ backgroundColor: 'color-mix(in srgb, var(--main) 12%, transparent)', color: 'var(--main)' }}>
          {success}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting || title.trim().length === 0 || body.trim().length === 0}
        className="mt-4 w-full rounded-2xl px-4 py-3 text-sm font-semibold transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        style={{ backgroundColor: 'var(--main)', color: 'var(--bg)' }}
      >
        {isSubmitting ? t('authWorking', locale) : t('feedComposerPublish', locale)}
      </button>
    </form>
  )
}
