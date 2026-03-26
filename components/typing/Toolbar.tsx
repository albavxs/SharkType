'use client'

import { Language, Mode, Difficulty } from '@/lib/types'
import { BookIcon, HelpIcon, SlidersIcon, TrophyIcon } from '@/components/icons'
import { FlameIcon } from '@/components/icons'
import Link from 'next/link'
import { Locale } from '@/lib/i18n'

interface ToolbarProps {
  language: Language
  mode: Mode
  difficulty: Difficulty | 'all'
  seconds: number
  isTimerRunning: boolean
  onLanguageChange: (lang: Language) => void
  onModeChange: (mode: Mode) => void
  onDifficultyChange: (d: Difficulty | 'all') => void
  onHomeClick: () => void
  onHelpClick: () => void
  level: number | null
  streak: number
  locale?: Locale
  onLocaleToggle?: () => void
}

export default function Toolbar({
  onHomeClick, onHelpClick, level, streak, locale, onLocaleToggle,
}: ToolbarProps) {
  return (
    <div className="flex items-center px-6 py-2">
      {/* Left: Logo + nav icons */}
      <div className="flex items-center gap-4 shrink-0">
        <button onClick={onHomeClick} className="text-2xl font-bold font-[family-name:var(--font-geist-mono)] hover:opacity-80 transition-opacity whitespace-nowrap" style={{ color: 'var(--text)' }}>
          Shark<span style={{ color: 'var(--main)' }}>Type</span>
        </button>
        <Link href="/tracks" className="p-1.5 rounded transition-colors hover:opacity-80" style={{ color: 'var(--sub)' }} title="Trilhas">
          <BookIcon size={18} />
        </Link>
        <Link href="/leaderboard" className="p-1.5 rounded transition-colors hover:opacity-80" style={{ color: 'var(--sub)' }} title="Ranking">
          <TrophyIcon size={18} />
        </Link>
        <button onClick={onHelpClick} className="p-1.5 rounded transition-colors hover:opacity-80" style={{ color: 'var(--sub)' }} title="Ajuda">
          <HelpIcon size={18} />
        </button>
        <Link href="/settings" className="p-1.5 rounded transition-colors hover:opacity-80" style={{ color: 'var(--sub)' }} title="Configuracoes">
          <SlidersIcon size={18} />
        </Link>
      </div>

      {/* Right: locale toggle + level + streak */}
      <div className="ml-auto flex items-center gap-4">
        {onLocaleToggle && (
          <button
            onClick={onLocaleToggle}
            className="text-xs font-mono font-medium px-2 py-0.5 rounded transition-opacity hover:opacity-80"
            style={{ border: '1px solid var(--sub)', color: locale === 'en' ? 'var(--main)' : 'var(--sub)' }}
            title="Alternar idioma da interface"
          >
            {locale === 'pt' ? 'PT' : 'EN'}
          </button>
        )}
        {(level || streak > 0) && (
          <>
            {level && <span className="text-xs font-medium" style={{ color: 'var(--sub)' }}>Lv {level}</span>}
            {streak > 0 && (
              <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--main)' }}>
                <FlameIcon size={12} />
                {streak}d
              </span>
            )}
          </>
        )}
      </div>
    </div>
  )
}
