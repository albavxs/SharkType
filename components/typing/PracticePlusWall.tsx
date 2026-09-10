import Link from 'next/link'
import { LockIcon } from '@/components/icons'
import type { Locale } from '@/lib/i18n'
import type { PracticeWall } from '@/lib/types'

interface PracticePlusWallProps {
  wall: PracticeWall | null | undefined
  locale: Locale
  scope: 'language' | 'track'
}

export default function PracticePlusWall({ wall, locale, scope }: PracticePlusWallProps) {
  if (!wall?.isLocked || wall.lockedCount <= 0) return null

  const message = locale === 'pt'
    ? `Voce esta nos snippets gratuitos. O Plus libera mais ${wall.lockedCount} exercicios ${scope === 'track' ? 'desta trilha' : 'desta tecnologia'}.`
    : `You are practicing the free snippets. Plus unlocks ${wall.lockedCount} more exercises in this ${scope}.`

  return (
    <div
      className="mx-auto mt-2 flex w-[calc(100%-1.5rem)] max-w-3xl items-center justify-between gap-3 rounded-xl px-3 py-2 text-xs sm:w-full"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--main) 10%, transparent)',
        color: 'var(--text)',
        border: '1px solid color-mix(in srgb, var(--main) 24%, transparent)',
      }}
    >
      <div className="flex min-w-0 items-center gap-2">
        <LockIcon size={14} className="shrink-0" />
        <span>{message}</span>
      </div>
      <Link
        href="/plus"
        className="shrink-0 rounded-lg px-2 py-1 font-semibold"
        style={{ backgroundColor: 'var(--main)', color: 'var(--bg)' }}
      >
        Plus
      </Link>
    </div>
  )
}
