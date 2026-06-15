'use client'

import { useEffect, useState } from 'react'
import { Snippet } from '@/lib/types'
import { calculateConsistency } from '@/lib/utils'
import { calculateRankedPoints } from '@/lib/gamification'
import { FlameIcon, ShareIcon, ArrowRightIcon, RefreshIcon } from '@/components/icons'
import WPMGraph from '@/components/stats/WPMGraph'
import ShareCardModal from './ShareCardModal'
import { Locale, t } from '@/lib/i18n'

interface ResultScreenProps {
  wpm: number; rawWpm: number; accuracy: number; errors: number; duration: number
  snippet: Snippet; languageLabel: string; languageId: string; wpmSamples: number[]; rawWpmSamples: number[]; errorSamples: number[]
  xpEarned: number; rankedPointsEarned: number; newLevel: number; leveledUp: boolean; levelPercent: number; streak: number
  onNext: () => void
  isSyncing?: boolean
  locale?: Locale
}

function useCountUp(target: number, duration: number = 800) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (target === 0) {
      const frameId = requestAnimationFrame(() => setValue(0))
      return () => cancelAnimationFrame(frameId)
    }
    let start: number | null = null
    let frameId = 0
    function step(ts: number) {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      setValue(Math.floor(p * target))
      if (p < 1) frameId = requestAnimationFrame(step)
    }
    frameId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frameId)
  }, [target, duration])
  return value
}

export default function ResultScreen({ wpm, rawWpm, accuracy, errors, duration, snippet, languageLabel, languageId, wpmSamples, rawWpmSamples, errorSamples, xpEarned, rankedPointsEarned, newLevel, leveledUp, levelPercent, streak, onNext, isSyncing = false, locale = 'pt' }: ResultScreenProps) {
  const animatedWpm = useCountUp(wpm)
  const animatedXP = useCountUp(xpEarned)
  const animatedRankedPoints = useCountUp(Math.max(0, rankedPointsEarned))
  const consistency = calculateConsistency(wpmSamples)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showGraph, setShowGraph] = useState(false)
  const diff = t(snippet.difficulty === 'easy' ? 'easy' : snippet.difficulty === 'medium' ? 'medium' : 'hard', locale)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setShowGraph(true), 140)
    return () => window.clearTimeout(timeoutId)
  }, [])

  const rankedPointSamples = wpmSamples.map((net, index) => {
    const raw = rawWpmSamples[index] ?? net
    return calculateRankedPoints({
      languageId,
      wpm: net,
      rawWpm: raw,
      errors: errorSamples[index] ?? errors,
      difficulty: snippet.difficulty,
    })
  })

  const rawRankedPointSamples = rawWpmSamples.map((raw, index) =>
    calculateRankedPoints({
      languageId,
      wpm: raw,
      rawWpm: raw,
      errors: errorSamples[index] ?? errors,
      difficulty: snippet.difficulty,
    })
  )

  function handleShare() {
    setShowShareModal(true)
  }

  return (
    <div className="w-full mx-auto px-3 sm:px-6 animate-slide-up">
      {/* Top: WPM/ACC left + Graph right */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6">
        {/* Left stats */}
        <div className="shrink-0 flex flex-row sm:flex-col items-center sm:items-start gap-4 sm:gap-0 justify-center">
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--sub)' }}>wpm</div>
            <div className="text-5xl sm:text-7xl font-bold tabular-nums leading-none" style={{ color: 'var(--main)' }}>{animatedWpm}</div>
          </div>
          <div>
            <div className="text-xs sm:mt-4 mb-1" style={{ color: 'var(--sub)' }}>acc</div>
            <div className="text-3xl sm:text-5xl font-bold tabular-nums leading-none" style={{ color: 'var(--main)' }}>{accuracy}%</div>
          </div>
        </div>

        {/* Graph */}
        <div className="flex-1 min-w-0">
          <div className="relative min-h-48">
            <div
              aria-hidden
              className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${showGraph ? 'opacity-0' : 'opacity-100'}`}
              style={{
                background: 'linear-gradient(135deg, color-mix(in srgb, var(--sub-alt) 92%, transparent), color-mix(in srgb, var(--main) 10%, var(--sub-alt)))',
              }}
            />
            <div className={`transition-opacity duration-300 ${showGraph ? 'opacity-100' : 'opacity-0'}`}>
              <WPMGraph
                primarySamples={rankedPointSamples}
                secondarySamples={rawRankedPointSamples}
                leftAxisLabel={t('rankedPointsShort', locale)}
                animate={showGraph}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 sm:grid-cols-7 gap-3 sm:gap-4 text-center mb-6">
        {[
          { v: animatedRankedPoints, l: t('rankedPoints', locale), c: 'var(--main)' },
          { v: wpm,               l: t('netWpm', locale),      c: 'var(--text)' },
          { v: rawWpm,            l: t('rawWpm', locale),      c: 'var(--sub)' },
          { v: `${accuracy}%`,   l: t('accuracy', locale),    c: 'var(--text)' },
          { v: `${consistency}%`, l: t('consistency', locale), c: 'var(--text)' },
          { v: errors,            l: t('errors', locale),      c: 'var(--error)' },
          { v: `${duration}s`,   l: t('time', locale),        c: 'var(--text)' },
        ].map((s, i) => (
          <div key={i}>
            <div className="text-lg font-semibold tabular-nums" style={{ color: s.c }}>{s.v}</div>
            <div className="text-[10px]" style={{ color: 'var(--sub)' }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* XP / Level / Streak */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mb-6">
        <span className="text-sm font-bold" style={{ color: 'var(--main)' }}>+{animatedXP} XP</span>
        {leveledUp && <span className="text-xs font-bold animate-fade-in" style={{ color: 'var(--main)' }}>{t('levelUp', locale)}</span>}
        <div className="flex items-center gap-1.5">
          <span className="text-xs" style={{ color: 'var(--sub)' }}>Lv {newLevel}</span>
          <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--sub-alt)' }}>
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${levelPercent}%`, backgroundColor: 'var(--main)' }} />
          </div>
          <span className="text-xs" style={{ color: 'var(--sub)' }}>Lv {newLevel + 1}</span>
        </div>
        {streak > 0 && <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--main)' }}><FlameIcon size={12} />{streak}d</span>}
        {isSyncing && <span className="text-[10px] uppercase tracking-[0.18em]" style={{ color: 'var(--sub)' }}>{t('resultSyncing', locale)}</span>}
      </div>

      {/* Snippet info */}
      <div className="text-center text-sm mb-6">
        <span className="font-medium" style={{ color: 'var(--main)' }}>{languageLabel}</span>
        <span className="mx-2" style={{ color: 'var(--sub)', opacity: 0.3 }}>/</span>
        <span className="font-medium" style={{ color: 'var(--text)' }}>{snippet.concept[locale]}</span>
        <span className="mx-2" style={{ color: 'var(--sub)', opacity: 0.3 }}>/</span>
        <span style={{ color: 'var(--sub)' }}>{diff}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-4">
        <button onClick={handleShare}
          className="p-2.5 rounded-lg transition-all duration-150 hover:scale-110 active:scale-90"
          style={{ color: 'var(--sub)' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--main)' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--sub)' }}
          title={t('share', locale)}>
          <ShareIcon size={20} />
        </button>
        {showShareModal && (
          <ShareCardModal
            wpm={wpm} rawWpm={rawWpm} accuracy={accuracy} errors={errors} duration={duration}
            snippet={snippet} languageLabel={languageLabel} locale={locale}
            onClose={() => setShowShareModal(false)}
          />
        )}
        <button onClick={onNext}
          className="p-2.5 rounded-lg transition-all duration-150 hover:scale-110 active:scale-90"
          style={{ color: 'var(--sub)' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--main)' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--sub)' }}
          title={t('next', locale)}>
          <ArrowRightIcon size={20} />
        </button>
        <button onClick={onNext}
          className="p-2.5 rounded-lg transition-all duration-150 hover:scale-110 active:scale-90"
          style={{ color: 'var(--sub)' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--main)' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--sub)' }}
          title={t('restart', locale)}>
          <RefreshIcon size={20} />
        </button>
      </div>
    </div>
  )
}
