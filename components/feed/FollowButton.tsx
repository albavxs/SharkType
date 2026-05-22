'use client'

import { useState } from 'react'
import { t, type Locale } from '@/lib/i18n'

interface FollowButtonProps {
  username: string
  initiallyFollowing: boolean
  locale: Locale
  size?: 'sm' | 'md'
  onChange?: (isFollowing: boolean) => void
}

export default function FollowButton({ username, initiallyFollowing, locale, size = 'md', onChange }: FollowButtonProps) {
  const [following, setFollowing] = useState(initiallyFollowing)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleToggle() {
    setPending(true)
    setError(null)
    const next = !following
    try {
      const res = await fetch(`/api/me/follow/${encodeURIComponent(username)}`, {
        method: next ? 'POST' : 'DELETE',
      })
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}))
        throw new Error(payload.error ?? 'Action failed')
      }
      setFollowing(next)
      onChange?.(next)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Action failed')
    } finally {
      setPending(false)
    }
  }

  const padding = size === 'sm' ? 'px-3 py-1 text-xs' : 'px-4 py-1.5 text-sm'
  const label = following ? t('unfollow', locale) : t('follow', locale)

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleToggle}
        disabled={pending}
        className={`rounded-full font-semibold transition-all duration-150 hover:scale-105 active:scale-95 disabled:opacity-50 ${padding}`}
        style={{
          backgroundColor: following ? 'var(--sub-alt)' : 'var(--main)',
          color: following ? 'var(--text)' : 'var(--bg)',
        }}
      >
        {pending ? t('authWorking', locale) : label}
      </button>
      {error && <span className="text-[10px]" style={{ color: 'var(--error)' }}>{error}</span>}
    </div>
  )
}
