'use client'

import { useState, useEffect } from 'react'
import { resetProgress } from '@/lib/gamification'
import { getSoundPref, setSoundPref, SoundType, playKey } from '@/lib/sounds'
import { ArrowLeftIcon } from '@/components/icons'
import Link from 'next/link'

const soundOptions: { key: SoundType; label: string }[] = [
  { key: 'off', label: 'Desligado' },
  { key: 'click', label: 'Click' },
  { key: 'pop', label: 'Pop' },
  { key: 'typewriter', label: 'Typewriter' },
  { key: 'nk-cream', label: 'NK Cream' },
]

export default function SettingsPage() {
  const [isLight, setIsLight] = useState(false)
  const [sound, setSound] = useState<SoundType>('off')
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    setIsLight(document.documentElement.classList.contains('light'))
    setSound(getSoundPref())
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

  function handleSoundChange(s: SoundType) {
    setSound(s)
    setSoundPref(s)
    if (s !== 'off') {
      // Preview
      setTimeout(() => playKey(), 50)
    }
  }

  function handleReset() {
    resetProgress()
    setShowConfirm(false)
    window.location.href = '/'
  }

  return (
    <main className="flex-1 flex flex-col min-h-screen bg-[#323437] light:bg-[#f5f5f5]">
      <div className="px-6 py-4">
        <Link href="/" className="flex items-center gap-1.5 text-sm text-[#646669] hover:text-[#d1d0c5] light:hover:text-[#1a1a1a] transition-colors">
          <ArrowLeftIcon size={14} />
          Voltar
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-md space-y-8">
          <h1 className="text-2xl font-bold font-[family-name:var(--font-geist-mono)] text-[#d1d0c5] light:text-[#1a1a1a]">
            Configuracoes
          </h1>

          {/* Theme */}
          <div className="flex items-center justify-between py-3 border-b border-[#3c3e42] light:border-[#d0d0d0]">
            <span className="text-sm text-[#d1d0c5] light:text-[#1a1a1a]">Tema</span>
            <button onClick={toggleTheme} className="px-3 py-1 text-xs rounded border border-[#4a4d52] text-[#d1d0c5] hover:border-[#646669] transition-colors">
              {isLight ? 'Claro' : 'Escuro'}
            </button>
          </div>

          {/* Sound */}
          <div className="py-3 border-b border-[#3c3e42] light:border-[#d0d0d0]">
            <span className="text-sm text-[#d1d0c5] light:text-[#1a1a1a] mb-3 block">Som do teclado</span>
            <div className="flex flex-wrap gap-2">
              {soundOptions.map(o => (
                <button
                  key={o.key}
                  onClick={() => handleSoundChange(o.key)}
                  className={`px-3 py-1.5 text-xs rounded border transition-colors ${
                    sound === o.key
                      ? 'border-[#a78bfa] text-[#a78bfa]'
                      : 'border-[#4a4d52] text-[#646669] hover:border-[#646669]'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reset */}
          <div className="flex items-center justify-between py-3 border-b border-[#3c3e42] light:border-[#d0d0d0]">
            <span className="text-sm text-[#d1d0c5] light:text-[#1a1a1a]">Reset progresso</span>
            {showConfirm ? (
              <div className="flex items-center gap-2">
                <button onClick={handleReset} className="px-3 py-1 text-xs rounded bg-[#ca4754]/20 text-[#ca4754] hover:bg-[#ca4754]/30 transition-colors">Confirmar</button>
                <button onClick={() => setShowConfirm(false)} className="px-3 py-1 text-xs rounded border border-[#4a4d52] text-[#646669] hover:border-[#646669] transition-colors">Cancelar</button>
              </div>
            ) : (
              <button onClick={() => setShowConfirm(true)} className="px-3 py-1 text-xs rounded border border-[#4a4d52] text-[#ca4754] hover:border-[#ca4754] transition-colors">Resetar</button>
            )}
          </div>

          <div className="pt-4">
            <Link href="/stats" className="text-xs text-[#646669] hover:text-[#d1d0c5] transition-colors">
              Ver estatisticas →
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
