'use client'

import { HelpIcon } from '@/components/icons'
import { getTheme, getThemePref } from '@/lib/themes'
import Link from 'next/link'
import { t, Locale } from '@/lib/i18n'

interface FooterProps {
  onHelpClick: () => void
  onThemeClick: () => void
  currentThemeName: string
  isTyping?: boolean
  locale?: Locale
}

export default function Footer({ onHelpClick, onThemeClick, currentThemeName, isTyping = false, locale = 'pt' }: FooterProps) {
  const theme = getTheme(currentThemeName)

  return (
    <div className={`flex items-center justify-between px-3 sm:px-6 py-2 sm:py-3 transition-all duration-300 ${isTyping ? 'opacity-0 pointer-events-none' : ''}`}>
      {/* Left: links */}
      <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm" style={{ color: 'var(--text)' }}>
        <button onClick={onHelpClick} className="transition-all duration-150 hover:scale-105 hover:brightness-125 active:scale-95">help</button>
        <a href="https://github.com/albavxs" target="_blank" rel="noopener noreferrer" className="transition-all duration-150 hover:scale-105 hover:brightness-125 active:scale-95">github</a>
        <Link href="/settings" className="transition-all duration-150 hover:scale-105 hover:brightness-125 active:scale-95">
          <span className="hidden sm:inline">{t('settings', locale)}</span>
          <span className="sm:hidden">{t('settingsShort', locale)}</span>
        </Link>
      </div>

      {/* Right: theme selector button */}
      <button
        onClick={onThemeClick}
        className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm transition-all duration-150 hover:scale-105 hover:brightness-125 active:scale-95"
        style={{ color: 'var(--text)' }}
      >
        <div className="flex items-center gap-0.5">
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: theme.bg, border: '1px solid var(--sub)' }} />
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: theme.text }} />
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: theme.main }} />
        </div>
        <span className="hidden sm:inline">{currentThemeName}</span>
      </button>
    </div>
  )
}
