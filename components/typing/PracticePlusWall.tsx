'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LockIcon } from '@/components/icons'
import { getTrackById, tracks } from '@/data/tracks'
import type { Locale } from '@/lib/i18n'
import type { PracticeWall } from '@/lib/types'

interface PracticePlusWallProps {
  wall: PracticeWall | null | undefined
  locale: Locale
  scope: 'language' | 'track'
  subjectName?: string | null
}

const premiumTrackCount = tracks.filter(
  (track) => (track.accessPolicy ?? 'plus_after_limit') === 'plus_after_limit'
).length

export default function PracticePlusWall({ wall, locale, scope, subjectName }: PracticePlusWallProps) {
  const pathname = usePathname()

  if (!wall || wall.hasPlusAccess) return null

  const trackId = scope === 'track' && pathname.startsWith('/tracks/')
    ? decodeURIComponent(pathname.split('/')[2] ?? '')
    : null
  const track = trackId ? getTrackById(trackId) : null
  const resolvedSubject = subjectName?.trim() || track?.name[locale] || null

  if (scope === 'language') {
    if (premiumTrackCount <= 0) return null

    const title = locale === 'pt' ? 'Mais conteúdo com SharkType Plus' : 'More content with SharkType Plus'
    const description = locale === 'pt'
      ? `Explore desafios avançados e recursos Plus em ${premiumTrackCount} trilhas elegíveis.`
      : `Explore advanced challenges and Plus features across ${premiumTrackCount} eligible tracks.`
    const action = locale === 'pt' ? 'Conhecer Plus' : 'Explore Plus'

    return <PlusWallLink title={title} description={description} action={action} />
  }

  if (!wall.hasPlusContent) return null

  const quantity = `+ ${wall.premiumCount}`
  const title = locale === 'pt'
    ? resolvedSubject
      ? `${quantity} desafios avançados para ${resolvedSubject}`
      : `${quantity} desafios avançados disponíveis`
    : resolvedSubject
      ? `${quantity} advanced ${resolvedSubject} challenges`
      : `${quantity} advanced challenges available`
  const description = locale === 'pt'
    ? 'Continue no Mastery com SharkType Plus.'
    : 'Continue in Mastery with SharkType Plus.'
  const action = locale === 'pt' ? 'Conhecer Plus' : 'Explore Plus'

  return <PlusWallLink title={title} description={description} action={action} />
}

function PlusWallLink({ title, description, action }: { title: string; description: string; action: string }) {
  return (
    <Link
      href="/plus"
      aria-label={`${title}. ${action}`}
      className="group mx-auto mt-2 grid w-[calc(100%-1.5rem)] max-w-3xl cursor-pointer grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-2 rounded-xl px-4 py-3 text-xs transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 sm:w-full sm:grid-cols-[auto_minmax(0,1fr)_auto]"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--main) 10%, transparent)',
        color: 'var(--text)',
        border: '1px solid color-mix(in srgb, var(--main) 28%, transparent)',
      }}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center self-center rounded-lg" style={{ color: 'var(--main)', backgroundColor: 'color-mix(in srgb, var(--main) 9%, transparent)' }} aria-hidden="true">
        <LockIcon size={15} />
      </span>
      <span className="min-w-0 self-center">
        <span className="block font-semibold leading-5">{title}</span>
        <span className="block leading-5" style={{ color: 'var(--sub)' }}>{description}</span>
      </span>
      <span className="col-start-2 shrink-0 self-center whitespace-nowrap font-semibold transition-transform duration-200 group-hover:translate-x-0.5 sm:col-start-auto" style={{ color: 'var(--main)' }}>
        {action} →
      </span>
    </Link>
  )
}
