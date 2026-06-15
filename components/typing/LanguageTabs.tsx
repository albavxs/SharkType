import type { LanguageMeta } from '@/lib/types'

interface LanguageTabsProps {
  languages: LanguageMeta[]
  selectedId: string | null
  onSelect: (lang: LanguageMeta) => void
  isTyping: boolean
}

export default function LanguageTabs({ languages, selectedId, onSelect, isTyping }: LanguageTabsProps) {
  if (languages.length === 0) return null
  return (
    <div className={`px-3 sm:px-6 pb-3 flex items-center gap-1.5 sm:gap-2 flex-wrap transition-all duration-300 ${isTyping ? 'opacity-0 pointer-events-none' : ''}`}>
      {languages.map(lang => {
        const isActive = lang.id === selectedId
        return (
          <button
            key={lang.id}
            onClick={() => onSelect(lang)}
            className="flex items-center gap-1.5 px-3 py-1 text-xs rounded-full transition-all duration-150 hover:brightness-110 hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              backgroundColor: isActive ? 'var(--main)' : 'var(--sub-alt)',
              color: isActive ? 'var(--bg)' : 'var(--text)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isActive ? 'var(--bg)' : lang.color }} />
            {lang.label}
          </button>
        )
      })}
    </div>
  )
}
