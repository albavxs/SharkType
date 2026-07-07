'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookIcon,
  ChartIcon,
  CheckIcon,
  FlameIcon,
  HelpIcon,
  HomeIcon,
  ShieldIcon,
  TrophyIcon,
  XIcon,
} from '@/components/icons'
import { Locale, t } from '@/lib/i18n'

interface IntroTourModalProps {
  locale: Locale
  onClose: () => void
}

export default function IntroTourModal({ locale, onClose }: IntroTourModalProps) {
  const [step, setStep] = useState(0)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const slides = useMemo(() => ([
    {
      icon: HomeIcon,
      title: t('introTourWelcomeTitle', locale),
      body: t('introTourWelcomeBody', locale),
      highlights: [
        t('introTourWelcomePointPractice', locale),
        t('introTourWelcomePointTracks', locale),
        t('introTourWelcomePointProfile', locale),
      ],
    },
    {
      icon: TrophyIcon,
      title: t('introTourRankingTitle', locale),
      body: t('introTourRankingBody', locale),
      highlights: [
        t('introTourRankingPointEligible', locale),
        t('introTourRankingPointPrecision', locale),
        t('introTourRankingPointDifficulty', locale),
      ],
    },
    {
      icon: FlameIcon,
      title: t('introTourProgressTitle', locale),
      body: t('introTourProgressBody', locale),
      highlights: [
        t('introTourProgressPointXP', locale),
        t('introTourProgressPointStreak', locale),
        t('introTourProgressPointSync', locale),
      ],
    },
    {
      icon: ShieldIcon,
      title: t('introTourAccessibilityTitle', locale),
      body: t('introTourAccessibilityBody', locale),
      highlights: [
        t('introTourAccessibilityPointShortcuts', locale),
        t('introTourAccessibilityPointKeyboard', locale),
        t('introTourAccessibilityPointThemes', locale),
      ],
    },
    {
      icon: BookIcon,
      title: t('introTourCommunityTitle', locale),
      body: t('introTourCommunityBody', locale),
      highlights: [
        t('introTourCommunityPointFeed', locale),
        t('introTourCommunityPointLeaderboard', locale),
        t('introTourCommunityPointHelp', locale),
      ],
    },
  ]), [locale])

  const current = slides[step]
  const CurrentIcon = current.icon
  const isLast = step === slides.length - 1

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  useEffect(() => {
    const firstFocusable = containerRef.current?.querySelector<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])')
    firstFocusable?.focus()
  }, [step])

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (!containerRef.current) return

      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        setStep((currentStep) => Math.min(currentStep + 1, slides.length - 1))
        return
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        setStep((currentStep) => Math.max(currentStep - 1, 0))
        return
      }

      if (event.key !== 'Tab') return

      const focusable = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => !element.hasAttribute('disabled'))

      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement as HTMLElement | null

      if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [onClose, slides.length])

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6"
      style={{ backgroundColor: 'rgba(6, 10, 18, 0.82)', backdropFilter: 'blur(14px)' }}
    >
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="intro-tour-title"
        className="w-full max-w-4xl overflow-hidden rounded-[2rem] border shadow-2xl"
        style={{
          borderColor: 'color-mix(in srgb, var(--main) 18%, transparent)',
          background:
            'radial-gradient(circle at top left, color-mix(in srgb, var(--main) 14%, transparent), transparent 34%), linear-gradient(180deg, color-mix(in srgb, var(--sub-alt) 96%, transparent), color-mix(in srgb, var(--bg) 96%, transparent))',
        }}
      >
        <div className="flex items-center justify-between border-b px-5 py-4 sm:px-7" style={{ borderColor: 'color-mix(in srgb, var(--sub) 18%, transparent)' }}>
          <div className="flex items-center gap-3">
            <span
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl"
              style={{ backgroundColor: 'color-mix(in srgb, var(--main) 14%, transparent)', color: 'var(--main)' }}
            >
              <CurrentIcon size={20} />
            </span>
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em]" style={{ color: 'var(--main)' }}>
                {t('introTourEyebrow', locale)}
              </p>
              <h2 id="intro-tour-title" className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
                {current.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 transition-opacity hover:opacity-80"
            style={{ color: 'var(--sub)' }}
            aria-label={t('introTourClose', locale)}
          >
            <XIcon size={18} />
          </button>
        </div>

        <div className="grid gap-6 px-5 py-5 sm:px-7 sm:py-7 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
          <section className="rounded-[1.75rem] border p-5 sm:p-6" style={{ borderColor: 'color-mix(in srgb, var(--sub) 16%, transparent)', backgroundColor: 'color-mix(in srgb, var(--sub-alt) 72%, transparent)' }}>
            <p className="text-sm leading-7 sm:text-base" style={{ color: 'var(--sub)' }}>
              {current.body}
            </p>

            <div className="mt-6 grid gap-3">
              {current.highlights.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border px-4 py-3"
                  style={{
                    borderColor: 'color-mix(in srgb, var(--sub) 16%, transparent)',
                    backgroundColor: 'color-mix(in srgb, var(--bg) 55%, transparent)',
                  }}
                >
                  <span className="mt-0.5 inline-flex rounded-full p-1" style={{ backgroundColor: 'color-mix(in srgb, var(--main) 14%, transparent)', color: 'var(--main)' }}>
                    <CheckIcon size={12} />
                  </span>
                  <span className="text-sm leading-6" style={{ color: 'var(--text)' }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <aside className="flex flex-col justify-between rounded-[1.75rem] border p-5 sm:p-6" style={{ borderColor: 'color-mix(in srgb, var(--sub) 16%, transparent)', background: 'linear-gradient(180deg, color-mix(in srgb, var(--main) 10%, transparent), color-mix(in srgb, var(--sub-alt) 76%, transparent))' }}>
            <div>
              <div className="mb-4 inline-flex rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.24em]" style={{ backgroundColor: 'color-mix(in srgb, var(--main) 16%, transparent)', color: 'var(--main)' }}>
                {t('introTourStepLabel', locale).replace('{current}', String(step + 1)).replace('{total}', String(slides.length))}
              </div>

              <div className="space-y-3">
                {[
                  { icon: ChartIcon, label: t('introTourQuickRanked', locale) },
                  { icon: FlameIcon, label: t('introTourQuickStreak', locale) },
                  { icon: HelpIcon, label: t('introTourQuickHelp', locale) },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.label} className="flex items-center gap-3 rounded-2xl px-3 py-3" style={{ backgroundColor: 'color-mix(in srgb, var(--bg) 50%, transparent)' }}>
                      <span style={{ color: 'var(--main)' }}>
                        <Icon size={16} />
                      </span>
                      <span className="text-sm" style={{ color: 'var(--text)' }}>
                        {item.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-4 flex items-center gap-2" aria-label={t('introTourProgressDots', locale)}>
                {slides.map((slide, index) => (
                  <button
                    key={slide.title}
                    type="button"
                    onClick={() => setStep(index)}
                    className="h-2.5 rounded-full transition-all"
                    style={{
                      width: index === step ? '2.5rem' : '0.7rem',
                      backgroundColor: index === step ? 'var(--main)' : 'color-mix(in srgb, var(--sub) 22%, transparent)',
                    }}
                    aria-label={t('introTourGoToStep', locale).replace('{step}', String(index + 1))}
                  />
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={onClose}
                  className="text-sm font-medium transition-opacity hover:opacity-80"
                  style={{ color: 'var(--sub)' }}
                >
                  {t('introTourSkip', locale)}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setStep((currentStep) => Math.max(currentStep - 1, 0))}
                    disabled={step === 0}
                    className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all disabled:cursor-not-allowed disabled:opacity-40"
                    style={{
                      borderColor: 'color-mix(in srgb, var(--sub) 16%, transparent)',
                      color: 'var(--text)',
                    }}
                  >
                    <ArrowLeftIcon size={14} />
                    {t('introTourBack', locale)}
                  </button>

                  {isLast ? (
                    <button
                      onClick={onClose}
                      className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all hover:scale-[1.02]"
                      style={{ backgroundColor: 'var(--main)', color: 'var(--bg)' }}
                    >
                      {t('introTourStart', locale)}
                      <ArrowRightIcon size={14} />
                    </button>
                  ) : (
                    <button
                      onClick={() => setStep((currentStep) => Math.min(currentStep + 1, slides.length - 1))}
                      className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all hover:scale-[1.02]"
                      style={{ backgroundColor: 'var(--main)', color: 'var(--bg)' }}
                    >
                      {t('introTourNext', locale)}
                      <ArrowRightIcon size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
