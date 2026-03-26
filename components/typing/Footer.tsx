'use client'

import { HelpIcon } from '@/components/icons'
import { getTheme, getThemePref } from '@/lib/themes'
import Link from 'next/link'

interface FooterProps {
  onHelpClick: () => void
  onThemeClick: () => void
  currentThemeName: string
  isTyping?: boolean
}

export default function Footer({ onHelpClick, onThemeClick, currentThemeName, isTyping = false }: FooterProps) {
  const theme = getTheme(currentThemeName)

  return (
    <div className={`flex items-center justify-between px-6 py-3 transition-all duration-300 ${isTyping ? 'opacity-0 pointer-events-none' : ''}`}>
      {/* Left: links */}
      <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text)' }}>
        <button onClick={onHelpClick} className="transition-all duration-150 hover:scale-105 hover:brightness-125 active:scale-95">help</button>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="transition-all duration-150 hover:scale-105 hover:brightness-125 active:scale-95">github</a>
        <Link href="/settings" className="transition-all duration-150 hover:scale-105 hover:brightness-125 active:scale-95">configurações</Link>
      </div>

      {/* Right: theme selector button */}
      <button
        onClick={onThemeClick}
        className="flex items-center gap-2 text-sm transition-all duration-150 hover:scale-105 hover:brightness-125 active:scale-95"
        style={{ color: 'var(--text)' }}
      >
        <div className="flex items-center gap-0.5">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.bg, border: '1px solid var(--sub)' }} />
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.text }} />
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.main }} />
        </div>
        {currentThemeName}
      </button>
    </div>
  )
}
