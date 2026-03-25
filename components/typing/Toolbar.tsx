'use client'

import { useState, useRef, useEffect } from 'react'
import { Language, Mode, Difficulty } from '@/lib/types'
import LanguageDropdown from './LanguageDropdown'
import ModeSelector from './ModeSelector'
import DifficultySelector from './DifficultySelector'
import { GearIcon, SunIcon, MoonIcon, ChartIcon, ClockIcon } from '@/components/icons'
import { formatTime } from '@/lib/utils'
import Link from 'next/link'

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
}

export default function Toolbar({
  language, mode, difficulty, seconds, isTimerRunning,
  onLanguageChange, onModeChange, onDifficultyChange, onHomeClick,
}: ToolbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isLight, setIsLight] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsLight(document.documentElement.classList.contains('light'))
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function toggleTheme() {
    const next = !isLight
    setIsLight(next)
    if (next) {
      document.documentElement.classList.add('light')
    } else {
      document.documentElement.classList.remove('light')
    }
    localStorage.setItem('theme', next ? 'light' : 'dark')
  }

  return (
    <div className="flex items-center px-6 py-4">
      {/* Left: Logo (clickable = home/reset) */}
      <div className="w-44">
        <button onClick={onHomeClick} className="text-xl font-bold font-[family-name:var(--font-geist-mono)] text-[#d1d0c5] light:text-[#1a1a1a] hover:opacity-80 transition-opacity">
          Gorilla<span className="text-[#a78bfa]">Type</span>
        </button>
      </div>

      {/* Center: controls (truly centered) */}
      <div className="flex-1 flex flex-col items-center gap-1">
        <div className="flex items-center gap-3">
          <LanguageDropdown selected={language} onSelect={onLanguageChange} />
          <span className="text-[#4a4d52]">|</span>
          <ModeSelector mode={mode} onModeChange={onModeChange} />
          <span className="text-[#4a4d52]">|</span>
          <DifficultySelector selected={difficulty} onChange={onDifficultyChange} />
          {/* Timer */}
          {(isTimerRunning || seconds > 0) && (
            <>
              <span className="text-[#4a4d52]">|</span>
              <div className="flex items-center gap-1 text-sm">
                <ClockIcon size={12} className="text-[#646669]" />
                <span className="text-[#a78bfa] tabular-nums font-medium">{formatTime(seconds)}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right: settings menu */}
      <div className="w-44 flex justify-end">
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded text-[#646669] hover:text-[#d1d0c5] transition-colors"
          >
            <GearIcon size={18} />
          </button>

          {menuOpen && (
            <div className="absolute top-full right-0 mt-1 w-44 py-1 rounded-lg border border-[#4a4d52] bg-[#2c2e31] shadow-xl animate-fade-in z-50">
              <button
                onClick={toggleTheme}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#d1d0c5] hover:bg-[#3c3e42] transition-colors"
              >
                {isLight ? <MoonIcon size={14} /> : <SunIcon size={14} />}
                {isLight ? 'Tema escuro' : 'Tema claro'}
              </button>
              <Link
                href="/stats"
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#d1d0c5] hover:bg-[#3c3e42] transition-colors"
              >
                <ChartIcon size={14} />
                Estatisticas
              </Link>
              <Link
                href="/settings"
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#d1d0c5] hover:bg-[#3c3e42] transition-colors"
              >
                <GearIcon size={14} />
                Configuracoes
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
