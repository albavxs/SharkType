'use client'

import { getTheme } from '@/lib/themes'
import Link from 'next/link'
import { t, Locale } from '@/lib/i18n'
import { MailIcon, CodeBranchIcon, ShieldIcon, FileTextIcon } from '@/components/icons'

interface FooterProps {
  onHelpClick: () => void
  onThemeClick: () => void
  currentThemeName: string
  isTyping?: boolean
  locale?: Locale
}

export default function Footer({ onHelpClick, onThemeClick, currentThemeName, isTyping = false, locale = 'pt' }: FooterProps) {
  const theme = getTheme(currentThemeName)

  const linkClass = 'flex items-center gap-1 transition-all duration-150 hover:brightness-150 active:scale-95'

  return (
    <div className={`flex flex-col items-start gap-3 px-3 py-2 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-3 transition-all duration-300 ${isTyping ? 'opacity-0 pointer-events-none' : ''}`}>
      {/* Left: links with icons */}
      <div className="flex flex-wrap items-center gap-3 text-[11px] sm:gap-5 sm:text-xs" style={{ color: 'var(--sub)' }}>
        <a href="mailto:contact@sharktype.dev" className={linkClass}>
          <MailIcon size={14} /> contact
        </a>
        <a href="https://github.com/albavxs/SharkType" target="_blank" rel="noopener noreferrer" className={linkClass}>
          <CodeBranchIcon size={14} /> github
        </a>

        <button onClick={onHelpClick} className={linkClass}>
          <FileTextIcon size={14} /> help
        </button>
        <Link href="/stats" className={`hidden sm:flex ${linkClass}`}>
          <ShieldIcon size={14} /> {t('viewStats', locale).toLowerCase().replace(' →', '')}
        </Link>
      </div>

      {/* Right: theme selector button */}
      <button
        onClick={onThemeClick}
        className="flex items-center gap-1.5 text-[11px] transition-all duration-150 hover:brightness-150 active:scale-95 sm:gap-2 sm:text-xs"
        style={{ color: 'var(--sub)' }}
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
