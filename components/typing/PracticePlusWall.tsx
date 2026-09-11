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

  const title = locale === 'pt'
    ? `+${wall.lockedCount} exercícios disponíveis com SharkType Plus`
    : `+${wall.lockedCount} exercises available with SharkType Plus`
  const description = locale === 'pt'
    ? `Desbloqueie o restante ${scope === 'track' ? 'desta trilha' : 'desta tecnologia'} e continue evoluindo.`
    : `Unlock the rest of this ${scope === 'track' ? 'track' : 'technology'} and keep progressing.`
  const action = locale === 'pt' ? 'Conhecer Plus' : 'Explore Plus'

  return (
    <Link
      href="/plus"
      aria-label={`${title}. ${action}`}
      className="group mx-auto mt-2 flex w-[calc(100%-1.5rem)] max-w-3xl items-center justify-between gap-4 rounded-xl px-4 py-3 text-xs transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 sm:w-full"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--main) 10%, transparent)',
        color: 'var(--text)',
        border: '1px solid color-mix(in srgb, var(--main) 28%, transparent)',
      }}
    >
      <span className="flex min-w-0 items-start gap-3">
        <span className="mt-0.5 shrink-0" style={{ color: 'var(--main)' }}>
          <LockIcon size={15} />
        </span>
        <span className="min-w-0">
          <span className="block font-semibold">{title}</span>
          <span className="mt-0.5 block leading-5" style={{ color: 'var(--sub)' }}>{description}</span>
        </span>
      </span>
      <span className="shrink-0 font-semibold transition-transform duration-200 group-hover:translate-x-0.5" style={{ color: 'var(--main)' }}>
        {action} →
      </span>
    </Link>
  )
}
