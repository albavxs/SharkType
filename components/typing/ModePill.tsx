'use client'

import { Language, Mode, Difficulty } from '@/lib/types'
import { Locale } from '@/lib/i18n'
import LanguageDropdown from './LanguageDropdown'
import ModeSelector from './ModeSelector'
import DifficultySelector from './DifficultySelector'
import { ClockIcon } from '@/components/icons'
import { formatTime } from '@/lib/utils'

interface ModePillProps {
  language: Language
  mode: Mode
  difficulty: Difficulty | 'all'
  seconds: number
  isTimerRunning: boolean
  onLanguageChange: (lang: Language) => void
  onModeChange: (mode: Mode) => void
  onDifficultyChange: (d: Difficulty | 'all') => void
  locale?: Locale
}

export default function ModePill({
  language, mode, difficulty, seconds, isTimerRunning,
  onLanguageChange, onModeChange, onDifficultyChange, locale = 'pt',
}: ModePillProps) {
  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full mx-auto"
      style={{ backgroundColor: 'var(--sub-alt)', border: '1px solid transparent' }}
    >
      <LanguageDropdown selected={language} onSelect={onLanguageChange} />
      <span style={{ color: 'var(--sub)', opacity: 0.3 }}>|</span>
      <ModeSelector mode={mode} onModeChange={onModeChange} locale={locale} />
      <span style={{ color: 'var(--sub)', opacity: 0.3 }}>|</span>
      <DifficultySelector selected={difficulty} onChange={onDifficultyChange} locale={locale} />
      {(isTimerRunning || seconds > 0) && (
        <>
          <span style={{ color: 'var(--sub)', opacity: 0.3 }}>|</span>
          <div className="flex items-center gap-1 text-sm">
            <ClockIcon size={12} className="opacity-60" />
            <span className="tabular-nums font-medium" style={{ color: 'var(--main)' }}>{formatTime(seconds)}</span>
          </div>
        </>
      )}
    </div>
  )
}
