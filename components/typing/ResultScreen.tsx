'use client'

import { useEffect, useState } from 'react'
import { Snippet } from '@/lib/types'
import { calculateConsistency } from '@/lib/utils'
import { FlameIcon, ShareIcon } from '@/components/icons'
import WPMGraph from '@/components/stats/WPMGraph'

interface ResultScreenProps {
  wpm: number
  rawWpm: number
  accuracy: number
  errors: number
  duration: number
  snippet: Snippet
  languageLabel: string
  wpmSamples: number[]
  rawWpmSamples: number[]
  xpEarned: number
  newLevel: number
  leveledUp: boolean
  levelPercent: number
  streak: number
}

function useCountUp(target: number, duration: number = 800) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (target === 0) { setValue(0); return }
    let start: number | null = null
    function step(ts: number) {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      setValue(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration])
  return value
}

export default function ResultScreen({
  wpm,
  rawWpm,
  accuracy,
  errors,
  duration,
  snippet,
  languageLabel,
  wpmSamples,
  rawWpmSamples,
  xpEarned,
  newLevel,
  leveledUp,
  levelPercent,
  streak,
}: ResultScreenProps) {
  const animatedWpm = useCountUp(wpm)
  const animatedXP = useCountUp(xpEarned)
  const consistency = calculateConsistency(wpmSamples)
  const [copied, setCopied] = useState(false)

  function handleShare() {
    const text = `GorillaType - ${languageLabel}\nWPM: ${wpm} | Raw: ${rawWpm} | Acc: ${accuracy}% | Consistency: ${consistency}%\n${snippet.concept} | ${duration}s`
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const diff = snippet.difficulty === 'easy' ? 'facil' : snippet.difficulty === 'medium' ? 'medio' : 'dificil'

  return (
    <div className="w-full max-w-3xl mx-auto animate-slide-up">
      {/* Big WPM */}
      <div className="text-center mb-8">
        <div className="text-6xl font-bold gradient-text tabular-nums">{animatedWpm}</div>
        <div className="text-xs text-[#646669] mt-1">wpm</div>
      </div>

      {/* Graph */}
      <WPMGraph netSamples={wpmSamples} rawSamples={rawWpmSamples} />

      {/* Stats grid */}
      <div className="grid grid-cols-6 gap-4 text-center mt-6 mb-6">
        <div>
          <div className="text-lg font-semibold text-[#d1d0c5] tabular-nums">{wpm}</div>
          <div className="text-[10px] text-[#646669]">net wpm</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-neutral-400 tabular-nums">{rawWpm}</div>
          <div className="text-[10px] text-[#646669]">raw wpm</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-[#d1d0c5] tabular-nums">{accuracy}%</div>
          <div className="text-[10px] text-[#646669]">accuracy</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-[#d1d0c5] tabular-nums">{consistency}%</div>
          <div className="text-[10px] text-[#646669]">consistency</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-red-400 tabular-nums">{errors}</div>
          <div className="text-[10px] text-[#646669]">erros</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-[#d1d0c5] tabular-nums">{duration}s</div>
          <div className="text-[10px] text-[#646669]">tempo</div>
        </div>
      </div>

      {/* XP + Level + Streak */}
      <div className="flex items-center justify-center gap-6 mb-6">
        <span className="text-sm font-bold text-[#a78bfa]">+{animatedXP} XP</span>
        {leveledUp && <span className="text-xs font-bold text-[#a78bfa] animate-fade-in">Level Up!</span>}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-[#646669]">Lv {newLevel}</span>
          <div className="w-20 h-1.5 rounded-full bg-[#3c3e42] overflow-hidden">
            <div className="h-full bg-[#a78bfa] rounded-full transition-all duration-700" style={{ width: `${levelPercent}%` }} />
          </div>
          <span className="text-xs text-[#646669]">Lv {newLevel + 1}</span>
        </div>
        {streak > 0 && (
          <div className="flex items-center gap-1 text-xs text-orange-400">
            <FlameIcon size={12} />
            <span>{streak}d</span>
          </div>
        )}
      </div>

      {/* Snippet info */}
      <div className="text-center text-sm text-[#d1d0c5] mb-6">
        <span className="text-[#a78bfa] font-medium">{languageLabel}</span>
        <span className="text-[#4a4d52] mx-2">/</span>
        <span className="font-medium">{snippet.concept}</span>
        <span className="text-[#4a4d52] mx-2">/</span>
        <span className="text-[#646669]">{diff}</span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-[#4a4d52] text-[#d1d0c5] hover:border-[#646669] transition-colors"
        >
          <ShareIcon size={14} />
          {copied ? 'Copiado!' : 'Compartilhar'}
        </button>
        <button
          onClick={() => {/* handled by Tab shortcut */}}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-[#a78bfa] text-[#323437] font-medium hover:bg-[#8b5cf6] transition-colors"
        >
          Proximo
          <span className="text-xs opacity-70">tab</span>
        </button>
      </div>
    </div>
  )
}
