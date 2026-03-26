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
    <div className="flex flex-col sm:flex-row sm:items-center sm:relative px-3 sm:px-6 pt-3 pb-1 sm:py-2 gap-2 sm:gap-0">
      {/* Row 1 (mobile) / Left (desktop): Logo + nav icons */}
      <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-4 shrink-0">
        <div className="flex items-center gap-2 sm:gap-4">
          <button onClick={onHomeClick} className={`text-lg sm:text-2xl font-bold font-[family-name:var(--font-geist-mono)] whitespace-nowrap cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 hover:opacity-80 ${isTyping ? 'sm:opacity-100 opacity-0 pointer-events-none sm:pointer-events-auto' : ''}`} style={{ color: 'var(--text)' }}>
            Shark<span style={{ color: 'var(--main)' }}>Type</span>
          </button>
          <div className={`flex items-center gap-1 sm:gap-3 transition-all duration-300 ${hide}`}>
            <Link href="/tracks" className="p-1.5 sm:p-2 rounded transition-all duration-150 hover:scale-110 hover:brightness-125 active:scale-90" style={{ color: 'var(--text)' }} title="Trilhas">
              <BookIcon size={18} />
            </Link>
            <Link href="/leaderboard" className="p-1.5 sm:p-2 rounded transition-all duration-150 hover:scale-110 hover:brightness-125 active:scale-90" style={{ color: 'var(--text)' }} title="Ranking">
              <TrophyIcon size={18} />
            </Link>
            <button onClick={onHelpClick} className="hidden sm:block p-2 rounded transition-all duration-150 hover:scale-110 hover:brightness-125 active:scale-90" style={{ color: 'var(--text)' }} title="Ajuda">
              <HelpIcon size={22} />
            </button>
            <Link href="/settings" className="hidden sm:block p-2 rounded transition-all duration-150 hover:scale-110 hover:brightness-125 active:scale-90" style={{ color: 'var(--text)' }} title="Configurações">
              <SlidersIcon size={22} />
            </Link>
          </div>
        </div>

        {/* Right side on mobile (locale + level + streak) */}
        <div className={`flex sm:hidden items-center gap-2 transition-all duration-300 ${hide}`}>
          {onLocaleToggle && (
            <button onClick={onLocaleToggle}
              className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded transition-all duration-150 hover:scale-105 active:scale-95"
              style={{ border: '1px solid var(--text)', color: locale === 'en' ? 'var(--main)' : 'var(--text)' }}>
              {locale === 'pt' ? 'PT' : 'EN'}
            </button>
          )}
          {level && <span className="text-[10px] font-medium" style={{ color: 'var(--text)' }}>Lv {level}</span>}
          {streak > 0 && (
            <span className="flex items-center gap-0.5 text-[10px]" style={{ color: 'var(--main)' }}>
              <FlameIcon size={12} />{streak}d
            </span>
          )}
        </div>
      </div>

      {/* Row 2 (mobile): controls centered */}
      {showControls && <div className={`sm:hidden flex justify-center transition-all duration-300 ${hide}`}>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs"
          style={{ backgroundColor: 'var(--sub-alt)' }}>
          <LanguageDropdown selected={language} onSelect={onLanguageChange} />
          <span style={{ color: 'var(--sub)', opacity: 0.3 }}>|</span>
          <DifficultySelector selected={difficulty} onChange={onDifficultyChange} locale={locale} />
          {(isTimerRunning || seconds > 0) && (
            <>
              <span style={{ color: 'var(--sub)', opacity: 0.3 }}>|</span>
              <div className="flex items-center gap-1">
                <ClockIcon size={12} className="opacity-60" />
                <span className="tabular-nums font-medium" style={{ color: 'var(--main)' }}>{formatTime(seconds)}</span>
              </div>
            </>
          )}
        </div>
      </div>}

      {/* Center (desktop): language + difficulty — absolutely centered */}
      {showControls && <div className={`absolute left-1/2 -translate-x-1/2 hidden sm:block transition-all duration-300 ${hide}`}>
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

      {/* Right (desktop): locale toggle + level + streak */}
      <div className={`ml-auto hidden sm:flex items-center gap-4 shrink-0 transition-all duration-300 ${hide}`}>
        {onLocaleToggle && (
          <button onClick={onLocaleToggle}
            className="text-sm font-mono font-medium px-2 py-0.5 rounded transition-all duration-150 hover:scale-105 hover:brightness-125 active:scale-95"
            style={{ border: '1px solid var(--text)', color: locale === 'en' ? 'var(--main)' : 'var(--text)' }}
            title="Alternar idioma da interface">
            {locale === 'pt' ? 'PT' : 'EN'}
          </button>
        )}
        {(level || streak > 0) && (
          <>
            {level && <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>Lv {level}</span>}
            {streak > 0 && (
              <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--main)' }}>
                <FlameIcon size={16} />{streak}d
              </span>
            )}
          </>
        )}
      </div>
    </div>
  )
}
