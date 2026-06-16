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
  wpm: number
  accuracy: number
  errors: number
  duration: number
  snippet: Snippet
  languageLabel: string
  languageId: string
  wpmSamples: number[]
  rawWpmSamples: number[]
  errorSamples: number[]
  xpEarned: number
  rankedPointsEarned: number
  newLevel: number
  leveledUp: boolean
  levelPercent: number
  streak: number
  onNext: () => void
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
      const progress = Math.min((ts - start) / duration, 1)
      setValue(Math.floor(progress * target))
      if (progress < 1) frameId = requestAnimationFrame(step)
    }

    frameId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frameId)
  }, [target, duration])

  return value
}

export default function ResultScreen({
  wpm,
  accuracy,
  errors,
  duration,
  snippet,
  languageLabel,
  languageId,
  wpmSamples,
  rawWpmSamples,
  errorSamples,
  xpEarned,
  rankedPointsEarned,
  newLevel,
  leveledUp,
  levelPercent,
  streak,
  onNext,
  locale = 'pt',
}: ResultScreenProps) {
  const animatedWpm = useCountUp(wpm)
  const animatedXP = useCountUp(xpEarned)
  const animatedRankedPoints = useCountUp(Math.max(0, rankedPointsEarned))
  const consistency = calculateConsistency(wpmSamples)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showGraph, setShowGraph] = useState(false)
  const diff = t(snippet.difficulty === 'easy' ? 'easy' : snippet.difficulty === 'medium' ? 'medium' : 'hard', locale)
  const shareRawWpm = rawWpmSamples.length > 0
    ? Math.round(rawWpmSamples.reduce((sum, sample) => sum + sample, 0) / rawWpmSamples.length)
    : wpm

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

  return (
    <div className="w-full mx-auto px-3 sm:px-6 animate-slide-up">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6">
        <div className="shrink-0 flex flex-col items-center sm:items-start justify-center">
          <div>
            <div className="text-xs mb-1 uppercase tracking-[0.18em]" style={{ color: 'var(--sub)' }}>
              {t('rankedPoints', locale)}
            </div>
            <div className="text-5xl sm:text-7xl font-bold tabular-nums leading-none" style={{ color: 'var(--main)' }}>
              {animatedRankedPoints}
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3 text-sm tabular-nums">
            <span style={{ color: 'var(--text)' }}>{animatedWpm} WPM</span>
            <span style={{ color: 'var(--sub)', opacity: 0.4 }}>•</span>
            <span style={{ color: 'var(--text)' }}>{accuracy}% ACC</span>
          </div>
        </div>

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
              <WPMGraph primarySamples={rankedPointSamples} animate={showGraph} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 text-center mb-6">
        {[
          { v: `${wpm}`, l: 'WPM', c: 'var(--text)' },
          { v: `${accuracy}%`, l: t('accuracy', locale), c: 'var(--text)' },
          { v: `${consistency}%`, l: t('consistency', locale), c: 'var(--text)' },
          { v: errors, l: t('errors', locale), c: 'var(--error)' },
          { v: `${duration}s`, l: t('time', locale), c: 'var(--text)' },
        ].map((stat, index) => (
          <div key={index}>
            <div className="text-lg font-semibold tabular-nums" style={{ color: stat.c }}>{stat.v}</div>
            <div className="text-[10px]" style={{ color: 'var(--sub)' }}>{stat.l}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mb-6">
        <span className="text-sm font-bold" style={{ color: 'var(--main)' }}>+{animatedXP} XP</span>
        {leveledUp ? (
          <span className="text-xs font-bold animate-fade-in" style={{ color: 'var(--main)' }}>
            {t('levelUp', locale)}
          </span>
        ) : null}
        <div className="flex items-center gap-1.5">
          <span className="text-xs" style={{ color: 'var(--sub)' }}>Lv {newLevel}</span>
          <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--sub-alt)' }}>
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${levelPercent}%`, backgroundColor: 'var(--main)' }} />
          </div>
          <span className="text-xs" style={{ color: 'var(--sub)' }}>Lv {newLevel + 1}</span>
        </div>
        {streak > 0 ? (
          <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--main)' }}>
            <FlameIcon size={12} />
            {streak}d
          </span>
        ) : null}
      </div>

      <div className="text-center text-sm mb-6">
        <span className="font-medium" style={{ color: 'var(--main)' }}>{languageLabel}</span>
        <span className="mx-2" style={{ color: 'var(--sub)', opacity: 0.3 }}>/</span>
        <span className="font-medium" style={{ color: 'var(--text)' }}>{snippet.concept[locale]}</span>
        <span className="mx-2" style={{ color: 'var(--sub)', opacity: 0.3 }}>/</span>
        <span style={{ color: 'var(--sub)' }}>{diff}</span>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setShowShareModal(true)}
          className="p-2.5 rounded-lg transition-all duration-150 hover:scale-110 active:scale-90"
          style={{ color: 'var(--sub)' }}
          onMouseEnter={(event) => { event.currentTarget.style.color = 'var(--main)' }}
          onMouseLeave={(event) => { event.currentTarget.style.color = 'var(--sub)' }}
          title={t('share', locale)}
        >
          <ShareIcon size={20} />
        </button>
        {showShareModal ? (
          <ShareCardModal
            wpm={wpm}
            rawWpm={shareRawWpm}
            accuracy={accuracy}
            errors={errors}
            duration={duration}
            snippet={snippet}
            languageLabel={languageLabel}
            locale={locale}
            onClose={() => setShowShareModal(false)}
          />
        ) : null}
        <button
          onClick={onNext}
          className="p-2.5 rounded-lg transition-all duration-150 hover:scale-110 active:scale-90"
          style={{ color: 'var(--sub)' }}
          onMouseEnter={(event) => { event.currentTarget.style.color = 'var(--main)' }}
          onMouseLeave={(event) => { event.currentTarget.style.color = 'var(--sub)' }}
          title={t('next', locale)}
        >
          <ArrowRightIcon size={20} />
        </button>
        <button
          onClick={onNext}
          className="p-2.5 rounded-lg transition-all duration-150 hover:scale-110 active:scale-90"
          style={{ color: 'var(--sub)' }}
          onMouseEnter={(event) => { event.currentTarget.style.color = 'var(--main)' }}
          onMouseLeave={(event) => { event.currentTarget.style.color = 'var(--sub)' }}
          title={t('restart', locale)}
        >
          <RefreshIcon size={20} />
        </button>
      </div>
    </div>
  )
}
