'use client'

import { useState, useRef, useEffect } from 'react'
import { themes, Theme, applyTheme, setThemePref } from '@/lib/themes'
import { XIcon } from '@/components/icons'

interface ThemeSelectorProps {
  currentTheme: string
  onSelect: (name: string) => void
  onClose: () => void
}

export default function ThemeSelector({ currentTheme, onSelect, onClose }: ThemeSelectorProps) {
  const [search, setSearch] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const prevThemeRef = useRef(currentTheme)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const filtered = themes.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase())
  )

  function handleHover(theme: Theme) {
    applyTheme(theme) // Preview on hover
  }

  function handleLeave() {
    // Revert to current theme
    const current = themes.find(t => t.name === currentTheme)
    if (current) applyTheme(current)
  }

  function handleSelect(theme: Theme) {
    applyTheme(theme)
    setThemePref(theme.name)
    // Cache for instant load
    const cache: Record<string, Theme> = {}
    cache[theme.name] = theme
    localStorage.setItem('sharktype-themes-cache', JSON.stringify(cache))
    onSelect(theme.name)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div
        className="w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-fade-in"
        style={{ backgroundColor: 'var(--sub-alt)', border: '1px solid var(--sub)' }}
      >
        {/* Search header */}
        <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid var(--sub)' }}>
          <span style={{ color: 'var(--sub)' }}>🔍</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Theme..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm font-[family-name:var(--font-geist-mono)]"
            style={{ color: 'var(--text)' }}
          />
          <button onClick={onClose} style={{ color: 'var(--sub)' }} className="hover:opacity-80">
            <XIcon size={16} />
          </button>
        </div>

        {/* Theme list */}
        <div className="max-h-80 overflow-y-auto">
          {filtered.map(theme => (
            <button
              key={theme.name}
              onClick={() => handleSelect(theme)}
              onMouseEnter={() => handleHover(theme)}
              onMouseLeave={handleLeave}
              className={`w-full flex items-center justify-between px-4 py-2 text-sm font-[family-name:var(--font-geist-mono)] transition-colors ${
                theme.name === currentTheme ? 'opacity-100' : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                color: 'var(--text)',
                backgroundColor: theme.name === currentTheme ? 'var(--bg)' : 'transparent',
              }}
            >
              <span>{theme.name}</span>
              <div className="flex items-center gap-0.5">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.bg, border: '1px solid rgba(128,128,128,0.3)' }} />
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.text }} />
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.main }} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
