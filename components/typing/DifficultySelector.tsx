'use client'

import { Difficulty } from '@/lib/types'

type DiffFilter = Difficulty | 'all'

interface DifficultySelectorProps {
  selected: DiffFilter
  onChange: (d: DiffFilter) => void
}

const options: { key: DiffFilter; label: string }[] = [
  { key: 'all', label: 'todos' },
  { key: 'easy', label: 'facil' },
  { key: 'medium', label: 'medio' },
  { key: 'hard', label: 'dificil' },
]

export default function DifficultySelector({ selected, onChange }: DifficultySelectorProps) {
  return (
    <div className="flex items-center gap-1 text-sm">
      {options.map((o) => (
        <button
          key={o.key}
          onClick={() => onChange(o.key)}
          className={`px-2 py-0.5 rounded transition-colors text-xs ${
            selected === o.key
              ? 'text-[#a78bfa]'
              : 'text-[#646669] hover:text-[#d1d0c5]'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
