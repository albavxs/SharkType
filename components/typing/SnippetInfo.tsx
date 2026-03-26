'use client'

import { useState } from 'react'
import { Snippet } from '@/lib/types'

interface SnippetInfoProps {
  snippet: Snippet
  languageLabel: string
  languageColor: string
  current: number
  total: number
}

export default function SnippetInfo({ snippet, languageLabel, languageColor, current, total }: SnippetInfoProps) {
  const [showDetail, setShowDetail] = useState(true)
  const diffLabel = snippet.difficulty === 'easy' ? 'Facil' : snippet.difficulty === 'medium' ? 'Medio' : 'Dificil'

  return (
    <div>
      {/* Metadata line */}
      <div className="flex items-center gap-3">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: languageColor }} />
        <span className="text-xs" style={{ color: 'var(--sub)' }}>{languageLabel}</span>
        <span style={{ color: 'var(--sub)', opacity: 0.3 }}>/</span>
        <span className="text-xs font-medium" style={{ color: 'var(--sub)' }}>{snippet.concept}</span>
        <span className="text-xs ml-auto" style={{ color: 'var(--sub)' }}>{current}/{total}</span>
        {snippet.prompt && (
          <button onClick={() => setShowDetail(p => !p)}
            className="text-xs font-medium cursor-pointer transition-all duration-150 hover:scale-105 hover:brightness-125 active:scale-95"
            style={{ color: 'var(--main)' }}>
            {showDetail ? 'ocultar' : 'mostrar'}
          </button>
        )}
      </div>

      {/* Expandable explanation card */}
      {showDetail && snippet.prompt && (
        <div className="mt-3 px-4 py-3 rounded-lg text-sm leading-relaxed animate-fade-in"
          style={{ backgroundColor: 'var(--sub-alt)', borderLeft: '3px solid var(--main)' }}>
          <div className="text-sm font-semibold mb-1.5" style={{ color: 'var(--main)' }}>{snippet.concept}</div>
          <p style={{ color: 'var(--text)' }}>{snippet.prompt}</p>
          <div className="mt-2 text-[10px]" style={{ color: 'var(--sub)' }}>{languageLabel} · {diffLabel}</div>
        </div>
      )}
    </div>
  )
}
