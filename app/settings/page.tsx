'use client'

import { useState, useEffect } from 'react'
import { getSoundPref, setSoundPref, setAllSoundPrefs, SoundProfile, SoundEvent, soundProfiles, previewSound } from '@/lib/sounds'
import { ArrowLeftIcon } from '@/components/icons'
import { useLocale } from '@/hooks/useLocale'
import { t } from '@/lib/i18n'
import Link from 'next/link'
import { useProgress } from '@/hooks/useProgress'
import { useAuth } from '@/hooks/useAuth'
import { useFontScale } from '@/hooks/useFontScale'
import { useLenientKeyboard } from '@/hooks/useLenientKeyboard'
import { useIsMobile } from '@/hooks/useMediaQuery'
import SceneWrapper from '@/components/three/SceneWrapper'
import { getTheme, applyTheme, getThemePref } from '@/lib/themes'

function A11ySection({ locale }: { locale: 'pt' | 'en' }) {
  const font = useFontScale()
  const lenient = useLenientKeyboard()
  return (
    <div className="mt-6 space-y-4 rounded-2xl p-4 sm:p-6" style={{ backgroundColor: 'var(--sub-alt)' }}>
      <h2 className="text-sm font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--sub)' }}>
        {locale === 'pt' ? 'Acessibilidade' : 'Accessibility'}
      </h2>

      <div className="flex items-center justify-between gap-3">
        <span className="text-sm" style={{ color: 'var(--text)' }}>
          {locale === 'pt' ? 'Tamanho da fonte do código' : 'Code font size'}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={font.decrease}
            disabled={!font.canDecrease}
            className="rounded-full px-3 py-1 text-sm font-semibold transition-all enabled:cursor-pointer enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            style={{ backgroundColor: 'color-mix(in srgb, var(--bg) 60%, transparent)', color: 'var(--text)' }}
            title={t('fontSizeDecrease', locale)}
          >
            A-
          </button>
          <span className="w-12 text-center text-sm tabular-nums" style={{ color: 'var(--sub)' }}>
            {Math.round(font.scale * 100)}%
          </span>
          <button
            onClick={font.increase}
            disabled={!font.canIncrease}
            className="rounded-full px-3 py-1 text-sm font-semibold transition-all enabled:cursor-pointer enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            style={{ backgroundColor: 'color-mix(in srgb, var(--bg) 60%, transparent)', color: 'var(--text)' }}
            title={t('fontSizeIncrease', locale)}
          >
            A+
          </button>
        </div>
      </div>

      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={lenient.enabled}
          onChange={lenient.toggle}
          className="mt-1"
        />
        <div className="flex flex-col gap-1">
          <span className="text-sm" style={{ color: 'var(--text)' }}>
            {t('lenientKeyboard', locale)}
          </span>
          <span className="text-xs" style={{ color: 'var(--sub)' }}>
            {t('lenientKeyboardHint', locale)}
          </span>
        </div>
      </label>

      <p className="text-xs" style={{ color: 'var(--sub)' }}>
        {locale === 'pt'
          ? 'Temas para daltonismo: selecione "a11y deuteranopia" ou "a11y protanopia" no seletor de temas.'
          : 'Color-blind themes: choose "a11y deuteranopia" or "a11y protanopia" in the theme selector.'}
      </p>
    </div>
  )
}

const soundEvents: { key: SoundEvent; labelKey: string }[] = [
  { key: 'key', labelKey: 'soundKey' },
  { key: 'space', labelKey: 'soundSpace' },
  { key: 'error', labelKey: 'soundError' },
  { key: 'complete', labelKey: 'soundComplete' },
]

export default function SettingsPage() {
  const [prefs, setPrefs] = useState<Record<SoundEvent, SoundProfile>>({ key: 'off', space: 'off', error: 'off', complete: 'off' })
  const [showConfirm, setShowConfirm] = useState(false)
  const { locale } = useLocale()
  const { resetCurrentProgress } = useProgress()
  const { user } = useAuth()
  const isMobile = useIsMobile()

  useEffect(() => {
    const themeName = getThemePref()
    applyTheme(getTheme(themeName))
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setPrefs({ key: getSoundPref('key'), space: getSoundPref('space'), error: getSoundPref('error'), complete: getSoundPref('complete') })
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [])

  function handleChange(event: SoundEvent, profile: SoundProfile) {
    setPrefs(p => ({ ...p, [event]: profile }))
    setSoundPref(event, profile)
    previewSound(event, profile)
  }

  function handleSetAll(profile: SoundProfile) {
    setAllSoundPrefs(profile)
    setPrefs({ key: profile, space: profile, error: profile, complete: profile })
    previewSound('key', profile)
  }

  async function handleReset() {
    await resetCurrentProgress()
    setShowConfirm(false)
    window.location.href = '/'
  }

  return (
    <main className="relative flex min-h-screen flex-1 flex-col" style={{ backgroundColor: 'var(--bg)' }}>
      {!isMobile && <SceneWrapper />}

      <div className="relative z-10 flex flex-1 flex-col">
        <div className="px-3 py-4 sm:px-6">
          <Link href="/" className="pointer-events-auto inline-flex w-fit cursor-pointer items-center gap-1.5 text-sm transition-opacity duration-150 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2" style={{ color: 'var(--sub)' }}>
            <ArrowLeftIcon size={14} />
            {t('back', locale)}
          </Link>
        </div>

        <div className="flex flex-1 flex-col items-center px-3 py-4 sm:px-6 sm:py-8">
          <div className="w-full max-w-lg space-y-6 sm:space-y-8">
            <h1 className="text-xl font-bold font-[family-name:var(--font-geist-mono)] sm:text-2xl" style={{ color: 'var(--text)' }}>
              {t('pageSettings', locale)}
            </h1>

            {user ? (
              <Link
                href="/settings/billing"
                className="group flex cursor-pointer items-center justify-between gap-4 rounded-2xl border p-4 transition-all hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 sm:p-5"
                style={{
                  borderColor: 'color-mix(in srgb, var(--main) 24%, transparent)',
                  background: 'linear-gradient(135deg, color-mix(in srgb, var(--main) 8%, transparent), transparent 50%), var(--sub-alt)',
                }}
              >
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--main)' }}>SharkType Plus</p>
                  <h2 className="mt-1 text-sm font-semibold" style={{ color: 'var(--text)' }}>
                    {locale === 'pt' ? 'Plano e assinatura' : 'Plan and subscription'}
                  </h2>
                  <p className="mt-1 text-xs leading-5" style={{ color: 'var(--sub)' }}>
                    {locale === 'pt' ? 'Veja seu acesso Plus e os dados da sua assinatura.' : 'Review your Plus access and subscription details.'}
                  </p>
                </div>
                <span className="shrink-0 text-lg transition-transform group-hover:translate-x-0.5" style={{ color: 'var(--main)' }} aria-hidden="true">→</span>
              </Link>
            ) : null}

            <A11ySection locale={locale} />

            <div className="py-3" style={{ borderBottom: '1px solid color-mix(in srgb, var(--sub) 30%, transparent)' }}>
              <span className="mb-3 block text-sm font-medium" style={{ color: 'var(--text)' }}>{t('soundAll', locale)}</span>
              <p className="mb-3 text-[10px]" style={{ color: 'var(--sub)' }}>{t('soundAllDesc', locale)}</p>
              <div className="flex flex-wrap gap-2">
                {soundProfiles.map(o => {
                  const allSame = prefs.key === o.key && prefs.space === o.key && prefs.error === o.key && prefs.complete === o.key
                  return (
                    <button key={o.key} onClick={() => handleSetAll(o.key)}
                      className="cursor-pointer rounded px-3 py-1.5 text-xs transition-all duration-150 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2"
                      style={{ border: `1px solid ${allSame ? 'var(--main)' : 'var(--sub)'}`, color: allSame ? 'var(--main)' : 'var(--sub)' }}>
                      {o.key === 'off' ? t('soundOff', locale) : o.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {soundEvents.map(ev => (
              <div key={ev.key} className="py-3" style={{ borderBottom: '1px solid color-mix(in srgb, var(--sub) 30%, transparent)' }}>
                <span className="mb-3 block text-sm" style={{ color: 'var(--text)' }}>{t('soundPrefix', locale)} — {t(ev.labelKey, locale)}</span>
                <div className="flex flex-wrap gap-2">
                  {soundProfiles.map(o => (
                    <button key={o.key} onClick={() => handleChange(ev.key, o.key)}
                      className="cursor-pointer rounded px-3 py-1.5 text-xs transition-all duration-150 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2"
                      style={{ border: `1px solid ${prefs[ev.key] === o.key ? 'var(--main)' : 'var(--sub)'}`, color: prefs[ev.key] === o.key ? 'var(--main)' : 'var(--sub)' }}>
                      {o.key === 'off' ? t('soundOff', locale) : o.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid color-mix(in srgb, var(--sub) 30%, transparent)' }}>
              <span className="text-sm" style={{ color: 'var(--text)' }}>{t('resetProgress', locale)}</span>
              {showConfirm ? (
                <div className="flex items-center gap-2">
                  <button onClick={handleReset} className="cursor-pointer rounded px-3 py-1 text-xs transition-all duration-150 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2" style={{ backgroundColor: 'color-mix(in srgb, var(--error) 20%, transparent)', color: 'var(--error)' }}>
                    {t('confirm', locale)}
                  </button>
                  <button onClick={() => setShowConfirm(false)} className="cursor-pointer rounded px-3 py-1 text-xs transition-all duration-150 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2" style={{ border: '1px solid var(--sub)', color: 'var(--sub)' }}>
                    {t('cancel', locale)}
                  </button>
                </div>
              ) : (
                <button onClick={() => setShowConfirm(true)} className="cursor-pointer rounded px-3 py-1 text-xs transition-all duration-150 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2" style={{ border: '1px solid var(--sub)', color: 'var(--error)' }}>
                  {t('resetBtn', locale)}
                </button>
              )}
            </div>

            <div className="pt-4">
              <Link href="/stats" className="cursor-pointer text-xs transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2" style={{ color: 'var(--sub)' }}>
                {t('viewStats', locale)} →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
