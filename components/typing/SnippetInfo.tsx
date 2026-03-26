import { Snippet } from '@/lib/types'

interface SnippetInfoProps {
  snippet: Snippet
  languageLabel: string
  languageColor: string
  current: number
  total: number
}

export default function SnippetInfo({ snippet, languageLabel, languageColor, current, total }: SnippetInfoProps) {
  const diffLabel = snippet.difficulty === 'easy' ? 'Facil' : snippet.difficulty === 'medium' ? 'Medio' : 'Dificil'

  return (
    <div>
      {snippet.prompt && (
        <div className="mb-3 px-4 py-3 rounded-lg text-sm leading-relaxed"
          style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--sub)', borderLeft: '3px solid var(--main)', color: 'var(--sub)', opacity: 0.9 }}>
          {snippet.prompt}
        </div>
      )}
      <div className="flex items-center justify-between py-3 px-4 rounded-lg" style={{ backgroundColor: 'var(--sub-alt)' }}>
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: languageColor }} />
          <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{languageLabel}</span>
          <span style={{ color: 'var(--sub)', opacity: 0.3 }}>/</span>
          <span className="text-base font-semibold" style={{ color: 'var(--main)' }}>{snippet.concept}</span>
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ color: 'var(--sub)', backgroundColor: 'var(--bg)' }}>
            {diffLabel}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: 'var(--sub)' }}>{current}/{total}</span>
          <div className="w-16 h-1 rounded-full" style={{ backgroundColor: 'var(--bg)' }}>
            <div className="h-full rounded-full transition-all duration-300" style={{ width: `${(current / total) * 100}%`, backgroundColor: 'var(--main)' }} />
          </div>
        </div>
      </div>
    </div>
  )
}
