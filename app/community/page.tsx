'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { COMMUNITY_LINKS } from '@/lib/community'
import { getTheme, getThemePref, applyTheme } from '@/lib/themes'
import { useLocale } from '@/hooks/useLocale'
import { t } from '@/lib/i18n'
import { useIsMobile } from '@/hooks/useMediaQuery'
import Toolbar from '@/components/typing/Toolbar'
import Footer from '@/components/typing/Footer'
import { codeLanguageMetas } from '@/data/metadata'
import { Difficulty } from '@/lib/types'
import { useProgress } from '@/hooks/useProgress'
import { DiscordIcon, GithubIcon, ShieldIcon, ArrowRightIcon } from '@/components/icons'
import { getLevel } from '@/lib/gamification'

const ThemeSelector = dynamic(() => import('@/components/typing/ThemeSelector'))
const HelpModal = dynamic(() => import('@/components/typing/HelpModal'))
const SceneWrapper = dynamic(() => import('@/components/three/SceneWrapper'), { ssr: false })

const communityCards = [
  {
    key: 'discord',
    href: COMMUNITY_LINKS.discord,
    icon: DiscordIcon,
    titleKey: 'communityDiscordTitle',
    bodyKey: 'communityDiscordBody',
    actionKey: 'communityDiscordAction',
  },
  {
    key: 'github',
    href: COMMUNITY_LINKS.github,
    icon: GithubIcon,
    titleKey: 'communityGithubTitle',
    bodyKey: 'communityGithubBody',
    actionKey: 'communityGithubAction',
  },
  {
    key: 'website',
    href: COMMUNITY_LINKS.website,
    icon: ShieldIcon,
    titleKey: 'communityWebsiteTitle',
    bodyKey: 'communityWebsiteBody',
    actionKey: 'communityWebsiteAction',
  },
] as const

export default function CommunityPage() {
  const router = useRouter()
  const [currentTheme, setCurrentTheme] = useState(() => getThemePref())
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const { locale, toggleLocale } = useLocale()
  const isMobile = useIsMobile()
  const { progress } = useProgress()
  const levelInfo = getLevel(progress.totalXP)

  useEffect(() => {
    applyTheme(getTheme(currentTheme))
  }, [currentTheme])

  return (
    <main className="flex-1 flex flex-col min-h-screen relative">
      {!isMobile && <SceneWrapper />}

      <div className="relative z-10 flex-1 flex flex-col min-h-screen">
        <Toolbar
          language={codeLanguageMetas[0]}
          difficulty={'all' as Difficulty | 'all'}
          seconds={0}
          isTimerRunning={false}
          onLanguageChange={() => {}}
          onDifficultyChange={() => {}}
          showControls={false}
          showCommunityBanner={false}
          onHomeClick={() => router.push('/')}
          onHelpClick={() => setShowHelp(true)}
          level={levelInfo.level}
          streak={progress.streak.current}
          locale={locale}
          onLocaleToggle={toggleLocale}
        />

        <div className="flex-1 px-3 py-4 sm:px-6 sm:py-8">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
            <section
              className="rounded-[28px] border px-5 py-6 sm:px-8 sm:py-9"
              style={{
                borderColor: 'color-mix(in srgb, var(--main) 24%, transparent)',
                background:
                  'linear-gradient(135deg, color-mix(in srgb, var(--sub-alt) 92%, transparent), color-mix(in srgb, var(--main) 10%, transparent))',
              }}
            >
              <div className="max-w-3xl">
                <p
                  className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em]"
                  style={{ color: 'var(--main)' }}
                >
                  {t('pageCommunityEyebrow', locale)}
                </p>
                <h1
                  className="text-3xl font-bold font-[family-name:var(--font-geist-mono)] sm:text-4xl"
                  style={{ color: 'var(--text)' }}
                >
                  {t('pageCommunity', locale)}
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 sm:text-base" style={{ color: 'var(--sub)' }}>
                  {t('communitySubtitle', locale)}
                </p>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              {communityCards.map((card) => {
                const Icon = card.icon

                return (
                  <a
                    key={card.key}
                    href={card.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-[24px] border p-5 transition-all duration-150 hover:-translate-y-1 hover:brightness-110"
                    style={{
                      borderColor: 'color-mix(in srgb, var(--sub) 22%, transparent)',
                      backgroundColor: 'color-mix(in srgb, var(--sub-alt) 78%, transparent)',
                    }}
                  >
                    <div
                      className="mb-4 inline-flex rounded-2xl p-3"
                      style={{
                        backgroundColor: 'color-mix(in srgb, var(--main) 14%, transparent)',
                        color: 'var(--main)',
                      }}
                    >
                      <Icon size={22} />
                    </div>
                    <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
                      {t(card.titleKey, locale)}
                    </h2>
                    <p className="mt-3 text-sm leading-7" style={{ color: 'var(--sub)' }}>
                      {t(card.bodyKey, locale)}
                    </p>
                    <span
                      className="mt-5 inline-flex items-center gap-2 text-sm font-medium"
                      style={{ color: 'var(--main)' }}
                    >
                      {t(card.actionKey, locale)}
                      <ArrowRightIcon size={14} />
                    </span>
                  </a>
                )
              })}
            </section>

            <section
              className="rounded-[24px] border px-5 py-5 sm:px-6"
              style={{
                borderColor: 'color-mix(in srgb, var(--sub) 18%, transparent)',
                backgroundColor: 'color-mix(in srgb, var(--sub-alt) 72%, transparent)',
              }}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
                    {t('communityContributionTitle', locale)}
                  </h2>
                  <p className="mt-2 text-sm leading-7" style={{ color: 'var(--sub)' }}>
                    {t('communityContributionBody', locale)}
                  </p>
                </div>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-150 hover:scale-[1.02]"
                  style={{ backgroundColor: 'var(--main)', color: 'var(--bg)' }}
                >
                  {t('communityBackHome', locale)}
                  <ArrowRightIcon size={14} />
                </Link>
              </div>
            </section>
          </div>
        </div>

        <Footer
          onHelpClick={() => setShowHelp(true)}
          onThemeClick={() => setShowThemeSelector(true)}
          currentThemeName={currentTheme}
          locale={locale}
        />
      </div>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} locale={locale} />}
      {showThemeSelector && (
        <ThemeSelector currentTheme={currentTheme} onSelect={setCurrentTheme} onClose={() => setShowThemeSelector(false)} />
      )}
    </main>
  )
}
