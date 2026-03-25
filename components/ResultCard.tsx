'use client'

import { useEffect, useState, useRef } from 'react'
import { CheckIcon, RefreshIcon, ArrowRightIcon, FlameIcon, ShareIcon } from '@/components/icons'
import { Snippet } from '@/lib/types'

interface ResultCardProps {
  wpm: number
  accuracy: number
  errors: number
  duration: number
  snippet: Snippet
  language: string
  onRestart: () => void
  onNext: () => void
  xpEarned: number
  newLevel: number
  leveledUp: boolean
  levelPercent: number
  streak: number
}

function useCountUp(target: number, duration: number = 1000) {
  const [value, setValue] = useState(0)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    startRef.current = null
    if (target === 0) { setValue(0); return }

    function step(ts: number) {
      if (!startRef.current) startRef.current = ts
      const elapsed = ts - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      setValue(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration])

  return value
}

export default function ResultCard({
  wpm,
  accuracy,
  errors,
  duration,
  snippet,
  language,
  onRestart,
  onNext,
  xpEarned,
  newLevel,
  leveledUp,
  levelPercent,
  streak,
}: ResultCardProps) {
  const animatedXP = useCountUp(xpEarned)
  const [copied, setCopied] = useState(false)

  function handleShare() {
    const text = `Syntax.lang.IO - ${language}\nWPM: ${wpm} | Precisao: ${accuracy}% | Erros: ${errors}\n${snippet.concept} | ${duration}s`
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md mx-4 p-8 rounded-xl border border-neutral-800 light:border-neutral-200 bg-black light:bg-white shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-white light:text-black">
            <CheckIcon size={20} />
            <span className="text-lg font-medium">Concluido</span>
          </div>
          {leveledUp && (
            <span className="text-xs font-bold text-indigo-400 animate-count-up">
              Level Up!
            </span>
          )}
        </div>

        {/* Big stats */}
        <div className="flex gap-8 mb-4">
          <div>
            <div className="text-4xl font-bold text-white light:text-black tabular-nums">{wpm}</div>
            <div className="text-xs text-neutral-500 light:text-neutral-400 mt-1">WPM</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white light:text-black tabular-nums">{accuracy}%</div>
            <div className="text-xs text-neutral-500 light:text-neutral-400 mt-1">Precisao</div>
          </div>
        </div>

        {/* XP + Level + Streak */}
        <div className="flex items-center gap-4 mb-4 py-3 border-y border-neutral-800 light:border-neutral-200">
          <span className="text-sm font-bold text-indigo-400 animate-count-up">+{animatedXP} XP</span>
          <div className="flex-1">
            <div className="flex items-center justify-between text-[10px] text-neutral-500 light:text-neutral-400 mb-1">
              <span>Lv {newLevel}</span>
              <span>Lv {newLevel + 1}</span>
            </div>
            <div className="h-1.5 rounded-full bg-neutral-800 light:bg-neutral-200 overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${levelPercent}%` }}
              />
            </div>
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-1 text-xs text-orange-400">
              <FlameIcon size={14} />
              <span>{streak}d</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm mb-6">
          <div className="flex justify-between">
            <span className="text-neutral-500 light:text-neutral-400">Conceito</span>
            <span className="text-white light:text-black">{snippet.concept}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500 light:text-neutral-400">Linguagem</span>
            <span className="text-white light:text-black">{language}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500 light:text-neutral-400">Erros</span>
            <span className="text-white light:text-black">{errors}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500 light:text-neutral-400">Duracao</span>
            <span className="text-white light:text-black">{duration}s</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={onRestart}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-neutral-800 light:border-neutral-200 bg-neutral-900 light:bg-neutral-100 text-sm text-white light:text-black transition-colors duration-150 hover:border-neutral-600 light:hover:border-neutral-400"
          >
            <RefreshIcon size={14} />
            Tentar novamente
          </button>
          <button
            onClick={onNext}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-white light:bg-black text-black light:text-white text-sm font-medium transition-opacity duration-150 hover:opacity-90"
          >
            Proximo snippet
            <ArrowRightIcon size={14} />
          </button>
          <button
            onClick={handleShare}
            className="relative flex items-center justify-center gap-2 w-full py-2 rounded-lg text-xs text-neutral-500 light:text-neutral-400 transition-colors duration-150 hover:text-white light:hover:text-black"
          >
            <ShareIcon size={12} />
            {copied ? 'Copiado!' : 'Compartilhar'}
          </button>
        </div>
      </div>
    </div>
  )
}
