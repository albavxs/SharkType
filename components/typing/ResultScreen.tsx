'use client'

import { useEffect, useState } from 'react'
import { Snippet } from '@/lib/types'
import { calculateConsistency } from '@/lib/utils'
import { FlameIcon, ShareIcon, ArrowRightIcon, RefreshIcon } from '@/components/icons'
import WPMGraph from '@/components/stats/WPMGraph'
import { Locale, t } from '@/lib/i18n'

interface ResultScreenProps {
  wpm: number; rawWpm: number; accuracy: number; errors: number; duration: number
  snippet: Snippet; languageLabel: string; wpmSamples: number[]; rawWpmSamples: number[]
  xpEarned: number; newLevel: number; leveledUp: boolean; levelPercent: number; streak: number
  onNext: () => void
  locale?: Locale
}

function useCountUp(target: number, duration: number = 800) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (target === 0) { setValue(0); return }
    let start: number | null = null
    function step(ts: number) { if (!start) start = ts; const p = Math.min((ts - start) / duration, 1); setValue(Math.floor(p * target)); if (p < 1) requestAnimationFrame(step) }
    requestAnimationFrame(step)
  }, [target, duration])
  return value
}

export default function ResultScreen({ wpm, rawWpm, accuracy, errors, duration, snippet, languageLabel, wpmSamples, rawWpmSamples, xpEarned, newLevel, leveledUp, levelPercent, streak, onNext, locale = 'pt' }: ResultScreenProps) {
  const animatedWpm = useCountUp(wpm)
  const animatedXP = useCountUp(xpEarned)
  const consistency = calculateConsistency(wpmSamples)
  const [copied, setCopied] = useState(false)
  const diff = t(snippet.difficulty === 'easy' ? 'easy' : snippet.difficulty === 'medium' ? 'medium' : 'hard', locale)

  function handleShare() {
    const text = `SharkType - ${languageLabel}\nWPM: ${wpm} | Raw: ${rawWpm} | Acc: ${accuracy}% | Consistency: ${consistency}%\n${snippet.concept} | ${duration}s`
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  return (
    <div className="w-full mx-auto px-6 animate-slide-up">
      {/* Top: WPM/ACC left + Graph right */}
      <div className="flex gap-6 mb-6">
        {/* Left stats */}
        <div className="shrink-0 flex flex-col justify-center">
          <div className="text-xs mb-1" style={{ color: 'var(--sub)' }}>wpm</div>
          <div className="text-7xl font-bold tabular-nums leading-none" style={{ color: 'var(--main)' }}>{animatedWpm}</div>
          <div className="text-xs mt-4 mb-1" style={{ color: 'var(--sub)' }}>acc</div>
          <div className="text-5xl font-bold tabular-nums leading-none" style={{ color: 'var(--main)' }}>{accuracy}%</div>
        </div>

        {/* Graph */}
        <div className="flex-1 min-w-0">
          <WPMGraph netSamples={wpmSamples} rawSamples={rawWpmSamples} />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-6 gap-4 text-center mb-6">
        {[
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
      <div className="flex items-center justify-center gap-6 mb-6">
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
      </div>

      {/* Snippet info */}
      <div className="text-center text-sm mb-6">
        <span className="font-medium" style={{ color: 'var(--main)' }}>{languageLabel}</span>
        <span className="mx-2" style={{ color: 'var(--sub)', opacity: 0.3 }}>/</span>
        <span className="font-medium" style={{ color: 'var(--text)' }}>{snippet.concept}</span>
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
          title={copied ? t('copied', locale) : t('share', locale)}>
          <ShareIcon size={20} />
        </button>
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
