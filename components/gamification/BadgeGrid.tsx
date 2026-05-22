'use client'

import { useEffect, useState } from 'react'
import { t, type Locale } from '@/lib/i18n'

export interface Achievement {
  id: string
  category: string
  threshold: number | null
  icon: string
  name: { pt: string; en: string }
  description: { pt: string; en: string }
}

interface BadgeGridProps {
  unlockedIds: string[]
  locale: Locale
}

export default function BadgeGrid({ unlockedIds, locale }: BadgeGridProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch('/api/achievements')
      .then(res => res.ok ? res.json() : { achievements: [] })
      .then((data: { achievements: Achievement[] }) => {
        if (!cancelled) setAchievements(data.achievements ?? [])
      })
      .catch(() => {
        if (!cancelled) setAchievements([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) return null
  if (achievements.length === 0) return null

  const unlocked = new Set(unlockedIds)

  return (
    <div className="space-y-3 rounded-[2rem] border p-5 sm:p-7"
      style={{ borderColor: 'color-mix(in srgb, var(--sub) 24%, transparent)', backgroundColor: 'color-mix(in srgb, var(--sub-alt) 70%, transparent)' }}>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--sub)' }}>
          {t('achievements', locale)}
        </h2>
        <span className="text-xs tabular-nums" style={{ color: 'var(--sub)' }}>
          {unlocked.size} / {achievements.length}
        </span>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {achievements.map(a => {
          const isUnlocked = unlocked.has(a.id)
          return (
            <div
              key={a.id}
              className="rounded-2xl px-4 py-3 transition-all"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--bg) 42%, transparent)',
                opacity: isUnlocked ? 1 : 0.4,
                filter: isUnlocked ? 'none' : 'grayscale(1)',
              }}
              title={a.description[locale]}
            >
              <div className="text-xs font-semibold" style={{ color: isUnlocked ? 'var(--main)' : 'var(--sub)' }}>
                {a.name[locale]}
              </div>
              <div className="mt-1 text-[11px]" style={{ color: 'var(--sub)' }}>
                {a.description[locale]}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
