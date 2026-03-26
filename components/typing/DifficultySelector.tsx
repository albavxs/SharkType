'use client'

import { Difficulty } from '@/lib/types'
import { Locale, t } from '@/lib/i18n'

type DiffFilter = Difficulty | 'all'

interface DifficultySelectorProps {
  selected: DiffFilter
  onChange: (d: DiffFilter) => void
  locale?: Locale
}

const options: { key: DiffFilter; labelKey: string }[] = [
  { key: 'all',    labelKey: 'all' },
  { key: 'easy',   labelKey: 'easy' },
  { key: 'medium', labelKey: 'medium' },
  { key: 'hard',   labelKey: 'hard' },
]

export default function DifficultySelector({ selected, onChange, locale = 'pt' }: DifficultySelectorProps) {
  return (
    <div className="flex items-center gap-1 text-sm">
      {options.map(o => (
        <button key={o.key} onClick={() => onChange(o.key)}
          className="px-2 py-0.5 rounded transition-colors text-xs cursor-pointer hover:opacity-80"
          style={{ color: selected === o.key ? 'var(--main)' : 'var(--sub)' }}>
          {t(o.labelKey, locale)}
        </button>
      ))}
    </div>
  )
}
