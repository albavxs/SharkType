'use client'

import { useEffect, useRef, useState } from 'react'
import { LanguageMeta, Difficulty, PracticeWall } from '@/lib/types'
import { BookIcon, HelpIcon, SlidersIcon, TrophyIcon, FlameIcon, ClockIcon, LogOutIcon, ChartIcon, MailIcon, ShieldIcon } from '@/components/icons'
import Link from 'next/link'
import { t, Locale } from '@/lib/i18n'
import { formatTime } from '@/lib/utils'
import BrandLogo from '@/components/brand/BrandLogo'
import LanguageDropdown from './LanguageDropdown'
import DifficultySelector from './DifficultySelector'
import PracticePlusWall from './PracticePlusWall'
import { useAuth } from '@/hooks/useAuth'
import CommunityTicker from './CommunityTicker'

interface ToolbarProps {
  language: LanguageMeta & { wall?: PracticeWall }
  difficulty: Difficulty | 'all'
  seconds: number
  isTimerRunning: boolean
  onLanguageChange: (lang: LanguageMeta) => void
  onDifficultyChange: (d: Difficulty | 'all') => void
  onHelpClick: () => void
  level: number | null
  streak: number
  locale?: Locale
  onLocaleToggle?: () => void
  isTyping?: boolean
  showControls?: boolean
  showLanguage?: boolean
  showCommunityBanner?: boolean
}

export default function Toolbar({
  language, difficulty, seconds, isTimerRunning,
  onLanguageChange, onDifficultyChange,
  onHelpClick, level, streak, locale, onLocaleToggle,
  isTyping = false, showControls = true, showLanguage = true, showCommunityBanner = true,
}: ToolbarProps) {
  const hide = isTyping ? 'opacity-0 pointer-events-none' : 'opacity-100'
  const { profile, signOut } = useAuth()
  const [isPlus, setIsPlus] = useState(false)

  useEffect(() => {
    if (!profile) {
      queueMicrotask(() => setIsPlus(false))
      return
    }

    let active = true
    void (async () => {
      try {
        const response = await fetch('/api/me/access', { cache: 'no-store' })
        const payload = await response.json() as { access?: { isPlus?: boolean } }
        if (active) setIsPlus(response.ok && payload.access?.isPlus === true)
      } catch {
        if (active) setIsPlus(false)
      }
    })()

    return () => {
      active = false
    }
  }, [profile])

  async function handleSignOut() {
    await signOut()
  }

  const plusHref = isPlus ? '/plus' : '/plus'
  const plusTitle = isPlus
    ? locale === 'pt' ? 'Gerenciar assinatura Plus' : 'Manage Plus subscription'
    : locale === 'pt' ? 'Assinar SharkType Plus' : 'Subscribe to SharkType Plus'
  const plusLabel = isPlus
    ? locale === 'pt' ? 'Gerenciar Plus' : 'Manage Plus'
    : locale === 'pt' ? 'Assinar Plus' : 'Subscribe Plus'

  const [moreOpen, setMoreOpen] = useState(false)
  const moreRef = useRef<HTMLDivElement>(null)
  const moreButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!moreOpen) return

    function closeOnOutsideClick(event: MouseEvent) {
      if (!moreRef.current?.contains(event.target as Node)) setMoreOpen(false)
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      setMoreOpen(false)
      moreButtonRef.current?.focus()
    }

    document.addEventListener('mousedown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [moreOpen])

  const navIconClass = 'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-[var(--sub-alt)] focus-visible:outline-2 focus-visible:outline-offset-2'
  const menuItemClass = 'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-[var(--sub-alt)] focus-visible:outline-2 focus-visible:outline-offset-2'

  return (
    <div className="relative z-20 px-3 pt-3 pb-1 sm:px-6 sm:py-2">
      {showCommunityBanner && (
        <CommunityTicker locale={locale} className={'mb-3 transition-opacity duration-300 ' + hide} />
      )}

      {/* Left navigation and right account actions always share row 1 and the same vertical center.
          The typing controls enter that same row on wide screens, or row 2 below on smaller ones. */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <div className="col-start-1 row-start-1 flex min-w-0 items-center gap-2 sm:gap-3">
          <Link href="/home" className="inline-flex shrink-0 items-center transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2" aria-label="SharkType — Home">
            <span className="sm:hidden"><BrandLogo compact size={28} /></span>
            <span className="hidden sm:inline-flex"><BrandLogo size={30} textSizeClassName="text-lg lg:text-xl" /></span>
          </Link>

          <nav aria-label={locale === 'pt' ? 'Navegação principal' : 'Main navigation'}
            className={'hidden min-w-0 items-center gap-1 transition-opacity duration-300 md:flex ' + hide}>
            <Link href="/tracks" className={navIconClass} style={{ color: 'var(--text)' }} title={t('navTracks', locale)} aria-label={t('navTracks', locale)}>
              <BookIcon size={19} />
            </Link>
            <Link href="/leaderboard" className={navIconClass} style={{ color: 'var(--text)' }} title={t('navRanking', locale)} aria-label={t('navRanking', locale)}>
              <TrophyIcon size={19} />
            </Link>
          </nav>

          <div ref={moreRef} className={'relative shrink-0 transition-opacity duration-300 ' + hide}>
            <button ref={moreButtonRef} type="button" onClick={() => setMoreOpen(value => !value)}
              aria-haspopup="true" aria-controls="toolbar-more-navigation" aria-expanded={moreOpen}
              aria-label={locale === 'pt' ? 'Mais opções de navegação' : 'More navigation options'}
              title={locale === 'pt' ? 'Mais opções' : 'More options'}
              className={navIconClass} style={{ color: 'var(--text)' }}>
              <SlidersIcon size={19} />
            </button>
            {moreOpen && (
              <nav id="toolbar-more-navigation"
                aria-label={locale === 'pt' ? 'Mais opções' : 'More options'}
                className="absolute left-0 top-full z-[80] mt-2 w-56 rounded-xl border p-1.5 shadow-xl"
                style={{ borderColor: 'var(--sub)', backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
                <Link href="/tracks" className={menuItemClass + ' md:hidden'} onClick={() => setMoreOpen(false)}>
                  <BookIcon size={17} />{t('navTracks', locale)}
                </Link>
                <Link href="/leaderboard" className={menuItemClass + ' md:hidden'} onClick={() => setMoreOpen(false)}>
                  <TrophyIcon size={17} />{t('navRanking', locale)}
                </Link>
                <Link href="/feed" className={menuItemClass} onClick={() => setMoreOpen(false)}>
                  <ChartIcon size={17} />{t('navFeed', locale)}
                </Link>
                <Link href="/community" className={menuItemClass} onClick={() => setMoreOpen(false)}>
                  <MailIcon size={17} />{t('navCommunity', locale)}
                </Link>
                <button type="button" className={menuItemClass} onClick={() => { setMoreOpen(false); onHelpClick() }}>
                  <HelpIcon size={17} />{t('navHelp', locale)}
                </button>
                <Link href="/settings" className={menuItemClass} onClick={() => setMoreOpen(false)}>
                  <SlidersIcon size={17} />{t('navSettings', locale)}
                </Link>
                {profile?.isSuperUser && (
                  <Link href="/admin/plus" className={menuItemClass} onClick={() => setMoreOpen(false)}>
                    <ShieldIcon size={17} />{locale === 'pt' ? 'Administrar Plus' : 'Manage Plus'}
                  </Link>
                )}
                {profile && (
                  <button type="button" className={menuItemClass + ' sm:hidden'}
                    onClick={() => { setMoreOpen(false); void handleSignOut() }}>
                    <LogOutIcon size={17} />{t('authSignOut', locale)}
                  </button>
                )}
              </nav>
            )}
          </div>
        </div>

        {/* Right side always stays on the same top row as the left navigation. */}
        <div className={'col-start-2 row-start-1 flex min-w-0 items-center justify-self-end gap-1.5 transition-opacity duration-300 sm:gap-2 xl:col-start-3 ' + hide}>
          {onLocaleToggle && (
            <button type="button" onClick={onLocaleToggle}
              className="shrink-0 rounded-lg border px-2 py-1 text-xs font-medium transition-colors hover:bg-[var(--sub-alt)] focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ borderColor: 'var(--sub)', color: locale === 'en' ? 'var(--main)' : 'var(--text)' }}
              title={t('toggleLocale', locale)}>
              {locale === 'pt' ? 'PT' : 'EN'}
            </button>
          )}
          {profile && (
            <Link href={plusHref}
              className="inline-flex shrink-0 items-center rounded-full px-2.5 py-1.5 text-[11px] font-semibold transition-colors hover:brightness-110 sm:px-3"
              style={{ backgroundColor: 'color-mix(in srgb, var(--main) 12%, transparent)', border: '1px solid color-mix(in srgb, var(--main) 28%, transparent)', color: 'var(--main)' }}
              title={plusTitle}>
              <span className="sm:hidden">Plus</span>
              <span className="hidden sm:inline">{plusLabel}</span>
            </Link>
          )}
          {profile ? (
            <Link href="/profile" aria-label={locale === 'pt' ? 'Meu perfil' : 'My profile'}
              className="inline-flex min-w-0 shrink-0 items-center gap-2 rounded-full px-1.5 py-1 transition-colors hover:bg-[var(--sub-alt)] sm:px-2"
              title={locale === 'pt' ? 'Meu perfil' : 'My profile'} style={{ color: 'var(--text)' }}>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full text-xs font-semibold"
                style={{ backgroundColor: 'color-mix(in srgb, var(--main) 16%, transparent)', color: 'var(--main)' }}>
                {profile.avatarUrl
                  ? <img src={profile.avatarUrl} alt="" className="h-full w-full object-cover" />
                  : profile.username.slice(0, 1).toUpperCase()}
              </span>
              <span className="hidden max-w-20 truncate text-xs 2xl:inline" style={{ color: 'var(--text)' }}>
                {profile.username}
              </span>
            </Link>
          ) : (
            <Link href="/login" className="shrink-0 rounded-full px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-[var(--sub-alt)]"
              style={{ backgroundColor: 'var(--sub-alt)', color: 'var(--text)' }}>
              {t('authSignInShort', locale)}
            </Link>
          )}
          {profile && (
            <button type="button" onClick={handleSignOut}
              className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-[var(--sub-alt)] sm:inline-flex"
              style={{ color: 'var(--sub)' }} title={t('authSignOut', locale)} aria-label={t('authSignOut', locale)}>
              <LogOutIcon size={16} />
            </button>
          )}
          <div className="hidden shrink-0 items-center gap-2 2xl:flex">
            {Boolean(level) && <span className="text-xs font-medium" style={{ color: 'var(--text)' }}>{'Lv ' + level}</span>}
            <span className="inline-flex items-center gap-0.5 text-xs"
              style={{ color: streak > 0 ? 'var(--main)' : 'var(--sub)' }}>
              <FlameIcon size={15} />{streak}d
            </span>
          </div>
        </div>

        {/* One intentional second row below xl; never use absolute centering or flex wrapping. */}
        {showControls && (
          <div className={'col-span-2 col-start-1 row-start-2 flex min-w-0 max-w-full justify-self-center transition-opacity duration-300 xl:col-span-1 xl:col-start-2 xl:row-start-1 ' + hide}>
            <div className="flex max-w-full min-w-0 items-center gap-1 overflow-x-auto whitespace-nowrap rounded-full px-2 py-1.5 text-xs sm:gap-2 sm:px-3"
              style={{ backgroundColor: 'var(--sub-alt)', scrollbarWidth: 'thin' }}>
              {showLanguage && (
                <>
                  <LanguageDropdown selectedId={language.id} onSelect={onLanguageChange} locale={locale} />
                  <span aria-hidden="true" className="shrink-0 opacity-40" style={{ color: 'var(--sub)' }}>|</span>
                </>
              )}
              <DifficultySelector selected={difficulty} onChange={onDifficultyChange} locale={locale} />
              {(isTimerRunning || seconds > 0) && (
                <>
                  <span aria-hidden="true" className="shrink-0 opacity-40" style={{ color: 'var(--sub)' }}>|</span>
                  <div className="flex shrink-0 items-center gap-1 text-xs tabular-nums" style={{ color: 'var(--main)' }}>
                    <ClockIcon size={14} />
                    <span>{formatTime(seconds)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {showLanguage && !isTyping && (
        <PracticePlusWall wall={language.wall} locale={locale ?? 'pt'} scope="language" />
      )}
    </div>
  )
}
