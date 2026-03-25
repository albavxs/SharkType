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
  const diffColor = snippet.difficulty === 'easy' ? '#4ade80' : snippet.difficulty === 'medium' ? '#a78bfa' : '#ca4754'

  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-[#2c2e31] light:bg-[#e8e8e8] border border-[#3c3e42] light:border-[#d0d0d0]">
      <div className="flex items-center gap-3">
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: languageColor }} />
        <span className="text-sm font-medium text-[#d1d0c5] light:text-[#1a1a1a]">{languageLabel}</span>
        <span className="text-[#4a4d52]">/</span>
        <span className="text-base font-semibold text-[#a78bfa]">{snippet.concept}</span>
        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ color: diffColor, backgroundColor: `${diffColor}15` }}>
          {diffLabel}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-[#646669]">{current}/{total}</span>
        <div className="w-16 h-1 rounded-full bg-[#3c3e42]">
          <div className="h-full rounded-full bg-[#a78bfa] transition-all duration-300" style={{ width: `${(current / total) * 100}%` }} />
        </div>
      </div>
    </div>
  )
}
