'use client'

import { Language, Difficulty } from '@/lib/types'
import { BookIcon, HelpIcon, SlidersIcon, TrophyIcon, FlameIcon, ClockIcon } from '@/components/icons'
import Link from 'next/link'
import { Locale } from '@/lib/i18n'
import { formatTime } from '@/lib/utils'
import LanguageDropdown from './LanguageDropdown'
import DifficultySelector from './DifficultySelector'

interface ToolbarProps {
  language: Language
  difficulty: Difficulty | 'all'
  seconds: number
  isTimerRunning: boolean
  onLanguageChange: (lang: Language) => void
  onDifficultyChange: (d: Difficulty | 'all') => void
  onHomeClick: () => void
  onHelpClick: () => void
  level: number | null
  streak: number
  locale?: Locale
  onLocaleToggle?: () => void
  isTyping?: boolean
  showControls?: boolean
}

export default function Toolbar({
  language, difficulty, seconds, isTimerRunning,
  onLanguageChange, onDifficultyChange,
  onHomeClick, onHelpClick, level, streak, locale, onLocaleToggle,
  isTyping = false, showControls = true,
}: ToolbarProps) {
  const hide = isTyping ? 'opacity-0 pointer-events-none' : 'opacity-100'

  return (
    <div className="relative flex items-center px-6 py-2">
      {/* Left: Logo (always visible) + nav icons (hide when typing) */}
      <div className="flex items-center gap-4 shrink-0">
        <button onClick={onHomeClick} className="text-2xl font-bold font-[family-name:var(--font-geist-mono)] whitespace-nowrap cursor-pointer transition-all duration-150 hover:scale-105 active:scale-95 hover:opacity-80" style={{ color: 'var(--text)' }}>
          Shark<span style={{ color: 'var(--main)' }}>Type</span>
        </button>
        <div className={`flex items-center gap-3 transition-all duration-300 ${hide}`}>
          <Link href="/tracks" className="p-2 rounded transition-all duration-150 hover:scale-110 hover:brightness-125 active:scale-90" style={{ color: 'var(--text)' }} title="Trilhas">
            <BookIcon size={22} />
          </Link>
          <Link href="/leaderboard" className="p-2 rounded transition-all duration-150 hover:scale-110 hover:brightness-125 active:scale-90" style={{ color: 'var(--text)' }} title="Ranking">
            <TrophyIcon size={22} />
          </Link>
          <button onClick={onHelpClick} className="p-2 rounded transition-all duration-150 hover:scale-110 hover:brightness-125 active:scale-90" style={{ color: 'var(--text)' }} title="Ajuda">
            <HelpIcon size={22} />
          </button>
          <Link href="/settings" className="p-2 rounded transition-all duration-150 hover:scale-110 hover:brightness-125 active:scale-90" style={{ color: 'var(--text)' }} title="Configurações">
            <SlidersIcon size={22} />
          </Link>
        </div>
      </div>

      {/* Center: language + difficulty — absolutely centered, hide when typing */}
      {showControls && <div className={`absolute left-1/2 -translate-x-1/2 transition-all duration-300 ${hide}`}>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
          style={{ backgroundColor: 'var(--sub-alt)' }}>
          <LanguageDropdown selected={language} onSelect={onLanguageChange} />
          <span style={{ color: 'var(--sub)', opacity: 0.3 }}>|</span>
          <DifficultySelector selected={difficulty} onChange={onDifficultyChange} locale={locale} />
          {(isTimerRunning || seconds > 0) && (
            <>
              <span style={{ color: 'var(--sub)', opacity: 0.3 }}>|</span>
              <div className="flex items-center gap-1 text-sm">
                <ClockIcon size={14} className="opacity-60" />
                <span className="tabular-nums font-medium" style={{ color: 'var(--main)' }}>{formatTime(seconds)}</span>
              </div>
            </>
          )}
        </div>
      </div>}

      {/* Right: locale toggle + level + streak — hide when typing */}
      <div className={`ml-auto flex items-center gap-4 shrink-0 transition-all duration-300 ${hide}`}>
        {onLocaleToggle && (
          <button
            onClick={onLocaleToggle}
            className="text-sm font-mono font-medium px-2 py-0.5 rounded transition-all duration-150 hover:scale-105 hover:brightness-125 active:scale-95"
            style={{ border: '1px solid var(--text)', color: locale === 'en' ? 'var(--main)' : 'var(--text)' }}
            title="Alternar idioma da interface"
          >
            {locale === 'pt' ? 'PT' : 'EN'}
          </button>
        )}
        {(level || streak > 0) && (
          <>
            {level && <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>Lv {level}</span>}
            {streak > 0 && (
              <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--main)' }}>
                <FlameIcon size={16} />
                {streak}d
              </span>
            )}
          </>
        )}
      </div>
    </div>
  )
}
