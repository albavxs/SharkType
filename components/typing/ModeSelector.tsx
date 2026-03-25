'use client'

import { Mode } from '@/lib/types'

interface ModeSelectorProps {
  mode: Mode
  onModeChange: (mode: Mode) => void
}

const modes: { key: Mode; label: string; group: 'time' | 'other' }[] = [
  { key: 'timed_30', label: '30', group: 'time' },
  { key: 'timed_60', label: '60', group: 'time' },
  { key: 'snippet', label: 'snippet', group: 'other' },
]

export default function ModeSelector({ mode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="flex items-center gap-1 text-sm">
      <span className="text-[#4a4d52] text-xs mr-1">tempo</span>
      {modes.filter(m => m.group === 'time').map((m) => (
        <button
          key={m.key}
          onClick={() => onModeChange(m.key)}
          className={`px-2 py-0.5 rounded transition-colors ${
            mode === m.key ? 'text-[#a78bfa]' : 'text-[#646669] hover:text-[#d1d0c5]'
          }`}
        >
          {m.label}
        </button>
      ))}
      <span className="text-[#4a4d52] mx-1">|</span>
      {modes.filter(m => m.group === 'other').map((m) => (
        <button
          key={m.key}
          onClick={() => onModeChange(m.key)}
          className={`px-2 py-0.5 rounded transition-colors ${
            mode === m.key ? 'text-[#a78bfa]' : 'text-[#646669] hover:text-[#d1d0c5]'
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  )
}
