'use client'

import { HelpIcon } from '@/components/icons'
import { getTheme, getThemePref } from '@/lib/themes'
import Link from 'next/link'

interface FooterProps {
  onHelpClick: () => void
  onThemeClick: () => void
  currentThemeName: string
}

export default function Footer({ onHelpClick, onThemeClick, currentThemeName }: FooterProps) {
  const theme = getTheme(currentThemeName)

  return (
    <div className="flex items-center justify-between px-6 py-3">
      {/* Left: links */}
      <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--sub)' }}>
        <button onClick={onHelpClick} className="hover:opacity-80 transition-opacity">help</button>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">github</a>
        <Link href="/settings" className="hover:opacity-80 transition-opacity">configuracoes</Link>
      </div>

      {/* Right: theme selector button */}
      <button
        onClick={onThemeClick}
        className="flex items-center gap-2 text-xs hover:opacity-80 transition-opacity"
        style={{ color: 'var(--sub)' }}
      >
        <div className="flex items-center gap-0.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.bg, border: '1px solid var(--sub)' }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.text }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.main }} />
        </div>
        {currentThemeName}
      </button>
    </div>
  )
}
