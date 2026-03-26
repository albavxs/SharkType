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
  const [sound, setSound] = useState<SoundType>('off')
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    setSound(getSoundPref())
  }, [])

  function handleSoundChange(s: SoundType) {
    setSound(s)
    setSoundPref(s)
    if (s !== 'off') {
      setTimeout(() => playKey(), 50)
    }
  }

  function handleReset() {
    resetProgress()
    setShowConfirm(false)
    window.location.href = '/'
  }

  return (
    <main className="flex-1 flex flex-col min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="px-6 py-4">
        <Link href="/" className="flex items-center gap-1.5 text-sm transition-opacity hover:opacity-80" style={{ color: 'var(--sub)' }}>
          <ArrowLeftIcon size={14} />
          Voltar
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-md space-y-8">
          <h1 className="text-2xl font-bold font-[family-name:var(--font-geist-mono)]" style={{ color: 'var(--text)' }}>
            Configuracoes
          </h1>

          {/* Sound */}
          <div className="py-3" style={{ borderBottom: '1px solid var(--sub)', borderBottomWidth: '1px', borderColor: 'color-mix(in srgb, var(--sub) 30%, transparent)' }}>
            <span className="text-sm mb-3 block" style={{ color: 'var(--text)' }}>Som do teclado</span>
            <div className="flex flex-wrap gap-2">
              {soundOptions.map(o => (
                <button
                  key={o.key}
                  onClick={() => handleSoundChange(o.key)}
                  className="px-3 py-1.5 text-xs rounded transition-colors"
                  style={{
                    border: `1px solid ${sound === o.key ? 'var(--main)' : 'var(--sub)'}`,
                    color: sound === o.key ? 'var(--main)' : 'var(--sub)',
                  }}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reset */}
          <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid color-mix(in srgb, var(--sub) 30%, transparent)' }}>
            <span className="text-sm" style={{ color: 'var(--text)' }}>Reset progresso</span>
            {showConfirm ? (
              <div className="flex items-center gap-2">
                <button onClick={handleReset} className="px-3 py-1 text-xs rounded transition-colors" style={{ backgroundColor: 'color-mix(in srgb, var(--error) 20%, transparent)', color: 'var(--error)' }}>
                  Confirmar
                </button>
                <button onClick={() => setShowConfirm(false)} className="px-3 py-1 text-xs rounded transition-colors" style={{ border: '1px solid var(--sub)', color: 'var(--sub)' }}>
                  Cancelar
                </button>
              </div>
            ) : (
              <button onClick={() => setShowConfirm(true)} className="px-3 py-1 text-xs rounded transition-colors" style={{ border: '1px solid var(--sub)', color: 'var(--error)' }}>
                Resetar
              </button>
            )}
          </div>

          <div className="pt-4">
            <Link href="/stats" className="text-xs transition-opacity hover:opacity-80" style={{ color: 'var(--sub)' }}>
              Ver estatisticas →
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
