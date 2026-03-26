'use client'

import { Mode } from '@/lib/types'
import { Locale, t } from '@/lib/i18n'

interface ModeSelectorProps {
  mode: Mode
  onModeChange: (mode: Mode) => void
  locale?: Locale
}

const modes: { key: Mode; label: string; group: 'time' | 'other' }[] = [
  { key: 'timed_30', label: '30',      group: 'time' },
  { key: 'timed_60', label: '60',      group: 'time' },
  { key: 'snippet',  label: 'snippet', group: 'other' },
]

export default function ModeSelector({ mode, onModeChange, locale = 'pt' }: ModeSelectorProps) {
  return (
    <div className="flex items-center gap-1 text-sm">
      <span className="text-xs mr-1" style={{ color: 'var(--sub)' }}>{t('timeLabel', locale)}</span>
      {modes.filter(m => m.group === 'time').map(m => (
        <button key={m.key} onClick={() => onModeChange(m.key)}
          className="px-2 py-0.5 rounded transition-colors cursor-pointer hover:opacity-80"
          style={{ color: mode === m.key ? 'var(--main)' : 'var(--sub)' }}>
          {m.label}
        </button>
      ))}
      <span className="mx-1" style={{ color: 'var(--sub)', opacity: 0.3 }}>|</span>
      {modes.filter(m => m.group === 'other').map(m => (
        <button key={m.key} onClick={() => onModeChange(m.key)}
          className="px-2 py-0.5 rounded transition-colors cursor-pointer hover:opacity-80"
          style={{ color: mode === m.key ? 'var(--main)' : 'var(--sub)' }}>
          {m.label}
        </button>
      ))}
    </div>
  )
}
