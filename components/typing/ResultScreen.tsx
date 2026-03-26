'use client'

import { useEffect, useState } from 'react'
import { Snippet } from '@/lib/types'
import { calculateConsistency } from '@/lib/utils'
import { FlameIcon, ShareIcon, ArrowRightIcon } from '@/components/icons'
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
    <div className="w-full max-w-3xl mx-auto animate-slide-up">
      <div className="text-center mb-6">
        <div className="text-6xl font-bold tabular-nums" style={{ color: 'var(--main)' }}>{animatedWpm}</div>
        <div className="text-xs mt-1" style={{ color: 'var(--sub)' }}>wpm</div>
      </div>

      <WPMGraph netSamples={wpmSamples} rawSamples={rawWpmSamples} />

      <div className="grid grid-cols-6 gap-4 text-center mt-6 mb-6">
        {[
          { v: wpm,             l: t('netWpm', locale),      c: 'var(--text)' },
          { v: rawWpm,          l: t('rawWpm', locale),      c: 'var(--sub)' },
          { v: `${accuracy}%`,  l: t('accuracy', locale),    c: 'var(--text)' },
          { v: `${consistency}%`, l: t('consistency', locale), c: 'var(--text)' },
          { v: errors,          l: t('errors', locale),      c: 'var(--error)' },
          { v: `${duration}s`,  l: t('time', locale),        c: 'var(--text)' },
        ].map((s, i) => (
          <div key={i}>
            <div className="text-lg font-semibold tabular-nums" style={{ color: s.c }}>{s.v}</div>
            <div className="text-[10px]" style={{ color: 'var(--sub)' }}>{s.l}</div>
          </div>
        ))}
      </div>

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

      <div className="text-center text-sm mb-6">
        <span className="font-medium" style={{ color: 'var(--main)' }}>{languageLabel}</span>
        <span className="mx-2" style={{ color: 'var(--sub)', opacity: 0.3 }}>/</span>
        <span className="font-medium" style={{ color: 'var(--text)' }}>{snippet.concept}</span>
        <span className="mx-2" style={{ color: 'var(--sub)', opacity: 0.3 }}>/</span>
        <span style={{ color: 'var(--sub)' }}>{diff}</span>
      </div>

      <div className="flex items-center justify-center gap-3">
        <button onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2.5 text-sm rounded-lg transition-opacity hover:opacity-80"
          style={{ border: '1px solid var(--sub)', color: 'var(--text)' }}>
          <ShareIcon size={14} />
          {copied ? t('copied', locale) : t('share', locale)}
        </button>
        <button onClick={onNext}
          className="flex items-center gap-2 px-5 py-2.5 text-sm rounded-lg font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: 'var(--main)', color: 'var(--bg)' }}>
          {t('next', locale)}
          <ArrowRightIcon size={14} />
        </button>
      </div>
    </div>
  )
}
