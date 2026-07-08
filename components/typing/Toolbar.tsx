'use client'

import { LanguageMeta, Difficulty } from '@/lib/types'
import { BookIcon, HelpIcon, SlidersIcon, TrophyIcon, FlameIcon, ClockIcon, LogOutIcon, UserIcon, ChartIcon, MailIcon } from '@/components/icons'
import Link from 'next/link'
import { t, Locale } from '@/lib/i18n'
import { formatTime } from '@/lib/utils'
import BrandLogo from '@/components/brand/BrandLogo'
import LanguageDropdown from './LanguageDropdown'
import DifficultySelector from './DifficultySelector'
import { useAuth } from '@/hooks/useAuth'
import CommunityTicker from './CommunityTicker'

interface ToolbarProps {
  language: LanguageMeta
  difficulty: Difficulty | 'all'
  seconds: number
  isTimerRunning: boolean
  onLanguageChange: (lang: LanguageMeta) => void
  onDifficultyChange: (d: Difficulty | 'all') => void
  onHomeClick: () => void
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
  onHomeClick, onHelpClick, level, streak, locale, onLocaleToggle,
  isTyping = false, showControls = true, showLanguage = true, showCommunityBanner = true,
}: ToolbarProps) {
  const hide = isTyping ? 'opacity-0 pointer-events-none' : 'opacity-100'
  const { profile, signOut } = useAuth()

  async function handleSignOut() {
    await signOut()
  }

  return (
    <div className="relative z-20 px-3 pt-3 pb-1 sm:px-6 sm:py-2">
      {showCommunityBanner && (
        <CommunityTicker locale={locale} className={`mb-3 transition-all duration-300 ${hide}`} />
      )}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-0">
      {/* Row 1 (mobile) / Left (desktop): Logo + nav icons */}
      <div className="flex flex-col gap-2 shrink-0 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex items-center justify-between gap-2 sm:justify-start sm:gap-4">
          <button onClick={onHomeClick} className={`text-lg sm:text-2xl font-bold font-[family-name:var(--font-geist-mono)] whitespace-nowrap cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 hover:opacity-80 ${isTyping ? 'sm:opacity-100 opacity-0 pointer-events-none sm:pointer-events-auto' : ''}`} style={{ color: 'var(--text)' }}>
            <BrandLogo size={30} textSizeClassName="text-lg sm:text-2xl" />
          </button>

          {/* Right side on mobile (locale + level + streak) */}
          <div className={`flex items-center gap-2 shrink-0 transition-all duration-300 sm:hidden ${hide}`}>
            {onLocaleToggle && (
              <button onClick={onLocaleToggle}
                className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded transition-all duration-150 hover:scale-105 active:scale-95"
                style={{ border: '1px solid var(--text)', color: locale === 'en' ? 'var(--main)' : 'var(--text)' }}>
                {locale === 'pt' ? 'PT' : 'EN'}
              </button>
            )}
            {profile ? (
              <Link
                href="/profile"
                className="flex items-center gap-1 rounded-full px-2 py-1 text-[10px] transition-all duration-150 hover:scale-105 active:scale-95"
                style={{ backgroundColor: 'var(--sub-alt)', color: 'var(--text)' }}
                title={locale === 'pt' ? 'Perfil' : 'Profile'}
              >
                <span
                  className="flex h-5 w-5 items-center justify-center overflow-hidden rounded-full text-[10px] font-semibold"
                  style={{ backgroundColor: 'color-mix(in srgb, var(--main) 16%, transparent)', color: 'var(--main)' }}
                >
                  {profile.avatarUrl ? (
                    <img src={profile.avatarUrl} alt={profile.username} className="h-full w-full object-cover" />
                  ) : (
                    profile.username.slice(0, 1).toUpperCase()
                  )}
                </span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="rounded-full px-2 py-1 text-[10px] font-medium transition-all duration-150 hover:scale-105 active:scale-95"
                style={{ backgroundColor: 'var(--sub-alt)', color: 'var(--text)' }}
              >
                {t('authSignInShort', locale)}
              </Link>
            )}
            {level && <span className="text-[10px] font-medium" style={{ color: 'var(--text)' }}>Lv {level}</span>}
            <span className="flex items-center gap-0.5 text-[10px]" style={{ color: streak > 0 ? 'var(--main)' : 'var(--sub)' }}>
                <FlameIcon size={12} />{streak}d
            </span>
          </div>
        </div>

        <div className={`hidden items-center gap-3 transition-all duration-300 sm:flex ${hide}`}>
          <Link href="/tracks" className="p-2 rounded transition-all duration-150 hover:scale-110 hover:brightness-125 active:scale-90" style={{ color: 'var(--text)' }} title={t('navTracks', locale)}>
            <BookIcon size={18} />
          </Link>
          <Link href="/leaderboard" className="p-2 rounded transition-all duration-150 hover:scale-110 hover:brightness-125 active:scale-90" style={{ color: 'var(--text)' }} title={t('navRanking', locale)}>
            <TrophyIcon size={18} />
          </Link>
          <Link href="/feed" className="p-2 rounded transition-all duration-150 hover:scale-110 hover:brightness-125 active:scale-90" style={{ color: 'var(--text)' }} title={t('navFeed', locale)}>
            <ChartIcon size={18} />
          </Link>
          <Link href="/community" className="p-2 rounded transition-all duration-150 hover:scale-110 hover:brightness-125 active:scale-90" style={{ color: 'var(--text)' }} title={t('navCommunity', locale)}>
            <MailIcon size={18} />
          </Link>
          {profile && (
            <Link href="/profile" className="p-2 rounded transition-all duration-150 hover:scale-110 hover:brightness-125 active:scale-90" style={{ color: 'var(--text)' }} title={locale === 'pt' ? 'Perfil' : 'Profile'}>
              <UserIcon size={18} />
            </Link>
          )}
          <button onClick={onHelpClick} className="hidden lg:block p-2 rounded transition-all duration-150 hover:scale-110 hover:brightness-125 active:scale-90" style={{ color: 'var(--text)' }} title={t('navHelp', locale)}>
            <HelpIcon size={22} />
          </button>
          <Link href="/settings" className="hidden lg:block p-2 rounded transition-all duration-150 hover:scale-110 hover:brightness-125 active:scale-90" style={{ color: 'var(--text)' }} title={t('navSettings', locale)}>
            <SlidersIcon size={22} />
          </Link>
        </div>

        <div className={`flex flex-wrap items-center gap-1 transition-all duration-300 sm:hidden ${hide}`}>
          <Link href="/tracks" className="p-1.5 rounded transition-all duration-150 hover:scale-110 hover:brightness-125 active:scale-90" style={{ color: 'var(--text)' }} title={t('navTracks', locale)}>
            <BookIcon size={18} />
          </Link>
          <Link href="/leaderboard" className="p-1.5 rounded transition-all duration-150 hover:scale-110 hover:brightness-125 active:scale-90" style={{ color: 'var(--text)' }} title={t('navRanking', locale)}>
            <TrophyIcon size={18} />
          </Link>
          <Link href="/feed" className="p-1.5 rounded transition-all duration-150 hover:scale-110 hover:brightness-125 active:scale-90" style={{ color: 'var(--text)' }} title={t('navFeed', locale)}>
            <ChartIcon size={18} />
          </Link>
          <Link href="/community" className="p-1.5 rounded transition-all duration-150 hover:scale-110 hover:brightness-125 active:scale-90" style={{ color: 'var(--text)' }} title={t('navCommunity', locale)}>
            <MailIcon size={18} />
          </Link>
          <button onClick={onHelpClick} className="p-1.5 rounded transition-all duration-150 hover:scale-110 hover:brightness-125 active:scale-90" style={{ color: 'var(--text)' }} title={t('navHelp', locale)}>
            <HelpIcon size={18} />
          </button>
          <Link href="/settings" className="p-1.5 rounded transition-all duration-150 hover:scale-110 hover:brightness-125 active:scale-90" style={{ color: 'var(--text)' }} title={t('navSettings', locale)}>
            <SlidersIcon size={18} />
          </Link>
        </div>
      </div>

      {/* Row 2 (mobile): controls centered */}
      {showControls && <div className={`sm:hidden flex justify-center transition-all duration-300 ${hide}`}>
        <div className="inline-flex max-w-full flex-wrap items-center justify-center gap-1.5 px-3 py-1 rounded-2xl text-xs"
          style={{ backgroundColor: 'var(--sub-alt)' }}>
          {showLanguage && <><LanguageDropdown selectedId={language.id} onSelect={onLanguageChange} locale={locale} />
          <span style={{ color: 'var(--sub)', opacity: 0.3 }}>|</span></>}
          <DifficultySelector selected={difficulty} onChange={onDifficultyChange} locale={locale} />
          {(isTimerRunning || seconds > 0) && (
            <>
              <span style={{ color: 'var(--sub)', opacity: 0.3 }}>|</span>
              <div className="flex items-center gap-1">
                <ClockIcon size={12} className="opacity-60" />
                <span className="tabular-nums font-medium" style={{ color: 'var(--main)' }}>{formatTime(seconds)}</span>
              </div>
            </>
          )}
        </div>
      </div>}

      {/* Center (desktop): language + difficulty — absolutely centered */}
      {showControls && <div className={`absolute left-1/2 -translate-x-1/2 hidden sm:block transition-all duration-300 ${hide}`}>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
          style={{ backgroundColor: 'var(--sub-alt)' }}>
          {showLanguage && <><LanguageDropdown selectedId={language.id} onSelect={onLanguageChange} locale={locale} />
          <span style={{ color: 'var(--sub)', opacity: 0.3 }}>|</span></>}
          <DifficultySelector selected={difficulty} onChange={onDifficultyChange} locale={locale} />
          {(isTimerRunning || seconds > 0) && (
            <>
              <span style={{ color: 'var(--sub)', opacity: 0.3 }}>|</span>
              <div className="flex items-center gap-1 text-sm">
                <ClockIcon size={14} className="opacity-60" />
                <span className="tabular-nums font-medium" style={{ color: 'var(--main)' }}>{formatTime(seconds)}</span>
              </div>
            </>
          )}
        </div>
      </div>}

      {/* Right (desktop): locale toggle + level + streak */}
      <div className={`ml-auto hidden sm:flex items-center gap-2 lg:gap-4 shrink-0 transition-all duration-300 ${hide}`}>
        {onLocaleToggle && (
          <button onClick={onLocaleToggle}
            className="text-sm font-mono font-medium px-2 py-0.5 rounded transition-all duration-150 hover:scale-105 hover:brightness-125 active:scale-95"
            style={{ border: '1px solid var(--text)', color: locale === 'en' ? 'var(--main)' : 'var(--text)' }}
            title={t('toggleLocale', locale)}>
            {locale === 'pt' ? 'PT' : 'EN'}
          </button>
        )}
        {profile ? (
          <div className="flex items-center gap-2">
            <Link
              href="/profile"
              className="flex items-center gap-2 rounded-full px-2 py-1 transition-all duration-150 hover:scale-105 active:scale-95"
              style={{ backgroundColor: 'var(--sub-alt)' }}
              title={locale === 'pt' ? 'Perfil' : 'Profile'}
            >
              <span
                className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full text-xs font-semibold"
                style={{ backgroundColor: 'color-mix(in srgb, var(--main) 16%, transparent)', color: 'var(--main)' }}
              >
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={profile.username} className="h-full w-full object-cover" />
                ) : (
                  profile.username.slice(0, 1).toUpperCase()
                )}
              </span>
              <span className="hidden lg:inline-block max-w-24 truncate text-sm" style={{ color: 'var(--text)' }}>
                {profile.username}
              </span>
            </Link>
            <button
              onClick={handleSignOut}
              className="rounded-full p-2 transition-all duration-150 hover:scale-105 active:scale-95"
              style={{ color: 'var(--sub)' }}
              title={t('authSignOut', locale)}
            >
              <LogOutIcon size={16} />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-150 hover:scale-105 active:scale-95"
            style={{ backgroundColor: 'var(--sub-alt)', color: 'var(--text)' }}
          >
            {t('authSignIn', locale)}
          </Link>
        )}
        {level && <span className="text-xs lg:text-sm font-medium" style={{ color: 'var(--text)' }}>Lv {level}</span>}
        <span className="flex items-center gap-1 text-xs lg:text-sm" style={{ color: streak > 0 ? 'var(--main)' : 'var(--sub)' }}>
          <FlameIcon size={16} />{streak}d
        </span>
      </div>
      </div>
    </div>
  )
}
