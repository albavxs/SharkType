'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import BrandLogo from '@/components/brand/BrandLogo'
import Footer from '@/components/typing/Footer'
import { ArrowRightIcon, BookIcon, ChartIcon, DiscordIcon, GithubIcon, ShieldIcon } from '@/components/icons'
import { useAuth } from '@/hooks/useAuth'
import { useLocale } from '@/hooks/useLocale'
import { getTheme, getThemePref, applyTheme } from '@/lib/themes'
import { COMMUNITY_LINKS } from '@/lib/community'
import { codeLanguageMetas } from '@/data/metadata'
import sharkLogo from '@/icons/SharkSolo.png'

const ThemeSelector = dynamic(() => import('@/components/typing/ThemeSelector'))
const HelpModal = dynamic(() => import('@/components/typing/HelpModal'))
const SceneWrapper = dynamic(() => import('@/components/three/SceneWrapper'), { ssr: false })

const copy = {
  pt: {
    navTracks: 'Trilhas',
    navPlus: 'Plus',
    navLogin: 'Entrar',
    tagline: 'Aprenda. Digite. Domine.',
    body: 'Treine programação através de prática de digitação, trilhas estruturadas e desafios avançados Mastery.',
    start: 'Começar agora',
    continue: 'Continuar praticando',
    explore: 'Explorar trilhas',
    communityTitle: 'Comunidade SharkType',
    communityBody: 'Aprender é melhor quando não acontece sozinho.',
    discordTitle: 'Discord',
    discordBody: 'Converse, peça ajuda e compartilhe progresso.',
    githubTitle: 'GitHub',
    githubBody: 'Acompanhe desenvolvimento e contribua.',
    projectTitle: 'Projeto',
    projectBody: 'Conheça o ecossistema do SharkType.',
    open: 'Abrir',
    productTitle: 'Treino, trilhas e Mastery',
    productBody: 'Entre pela prática Base, siga por trilhas estruturadas e avance para Mastery quando quiser desafios premium separados.',
    practiceTitle: 'Prática Base',
    practiceBody: 'Sessões rápidas com snippets Base seguros para aquecer e manter ritmo.',
    tracksTitle: 'Trilhas',
    tracksBody: 'Fundamentos organizados por linguagem, conceito e stack.',
    masteryTitle: 'Mastery',
    masteryBody: 'Desafios avançados, estrelas e progressão premium sem misturar com Base.',
  },
  en: {
    navTracks: 'Tracks',
    navPlus: 'Plus',
    navLogin: 'Sign in',
    tagline: 'Learn. Type. Master.',
    body: 'Train programming through typing practice, structured tracks, and advanced Mastery challenges.',
    start: 'Start now',
    continue: 'Continue practicing',
    explore: 'Explore tracks',
    communityTitle: 'SharkType Community',
    communityBody: 'Learning is better when it does not happen alone.',
    discordTitle: 'Discord',
    discordBody: 'Talk, ask for help, and share progress.',
    githubTitle: 'GitHub',
    githubBody: 'Follow development and contribute.',
    projectTitle: 'Project',
    projectBody: 'Explore the SharkType ecosystem.',
    open: 'Open',
    productTitle: 'Practice, tracks, and Mastery',
    productBody: 'Start with Base practice, follow structured tracks, and move into Mastery when you want separate premium challenges.',
    practiceTitle: 'Base Practice',
    practiceBody: 'Fast sessions with safe Base snippets for warmups and steady rhythm.',
    tracksTitle: 'Tracks',
    tracksBody: 'Fundamentals organized by language, concept, and stack.',
    masteryTitle: 'Mastery',
    masteryBody: 'Advanced challenges, stars, and premium progression without mixing into Base.',
  },
} as const

const communityCards = [
  {
    key: 'discord',
    href: COMMUNITY_LINKS.discord,
    icon: DiscordIcon,
    title: 'discordTitle',
    body: 'discordBody',
  },
  {
    key: 'github',
    href: COMMUNITY_LINKS.github,
    icon: GithubIcon,
    title: 'githubTitle',
    body: 'githubBody',
  },
  {
    key: 'project',
    href: COMMUNITY_LINKS.website,
    icon: ShieldIcon,
    title: 'projectTitle',
    body: 'projectBody',
  },
] as const

const productCards = [
  {
    key: 'practice',
    icon: ShieldIcon,
    title: 'practiceTitle',
    body: 'practiceBody',
    href: '/home',
  },
  {
    key: 'tracks',
    icon: BookIcon,
    title: 'tracksTitle',
    body: 'tracksBody',
    href: '/tracks',
  },
  {
    key: 'mastery',
    icon: ChartIcon,
    title: 'masteryTitle',
    body: 'masteryBody',
    href: null,
  },
] as const

export default function PublicHomePage() {
  const { profile, isLoading } = useAuth()
  const { locale, toggleLocale } = useLocale()
  const [currentTheme, setCurrentTheme] = useState(() => getThemePref())
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const text = copy[locale]
  const featuredLanguages = useMemo(
    () => codeLanguageMetas.filter((language) => ['javascript', 'python', 'linux', 'typescript', 'react', 'git'].includes(language.id)),
    [],
  )
  const primaryHref = profile ? '/home' : '/signup'
  const primaryLabel = profile ? text.continue : text.start
  const masteryHref = profile ? '/tracks' : '/plus'

  useEffect(() => {
    applyTheme(getTheme(currentTheme))
  }, [currentTheme])

  return (
    <main className="relative min-h-screen overflow-hidden">
      <SceneWrapper />
      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="transition-opacity hover:opacity-80">
            <BrandLogo size={32} textSizeClassName="text-xl sm:text-2xl" />
          </Link>

          <nav className="flex items-center gap-2 sm:gap-3">
            <Link href="/tracks" className="rounded-full px-3 py-2 text-xs font-medium transition-opacity hover:opacity-80 sm:text-sm" style={{ color: 'var(--text)' }}>
              {text.navTracks}
            </Link>
            <Link href="/plus" className="rounded-full px-3 py-2 text-xs font-medium transition-opacity hover:opacity-80 sm:text-sm" style={{ color: 'var(--text)' }}>
              {text.navPlus}
            </Link>
            <button
              onClick={toggleLocale}
              className="rounded-full px-3 py-2 text-xs font-mono font-medium transition-opacity hover:opacity-80"
              style={{ border: '1px solid color-mix(in srgb, var(--sub) 32%, transparent)', color: 'var(--text)' }}
            >
              {locale === 'pt' ? 'PT' : 'EN'}
            </button>
            {!profile && !isLoading ? (
              <Link href="/login" className="hidden rounded-full px-3 py-2 text-sm font-medium transition-opacity hover:opacity-80 sm:inline-flex" style={{ color: 'var(--main)' }}>
                {text.navLogin}
              </Link>
            ) : null}
          </nav>
        </header>

        <section className="mx-auto w-full max-w-5xl px-4 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8">
          <div
            className="rounded-[24px] border px-5 py-7 sm:px-8 sm:py-10"
            style={{
              borderColor: 'color-mix(in srgb, var(--main) 24%, transparent)',
              background:
                'linear-gradient(135deg, color-mix(in srgb, var(--sub-alt) 94%, transparent), color-mix(in srgb, var(--main) 10%, transparent))',
            }}
          >
            <div className="max-w-3xl">
              <h1
                className="flex flex-col gap-4 text-4xl font-bold leading-none font-[family-name:var(--font-geist-mono)] sm:flex-row sm:items-center sm:text-6xl"
                style={{ color: 'var(--text)' }}
              >
                <Image
                  src={sharkLogo}
                  alt=""
                  width={96}
                  height={96}
                  priority
                  className="h-20 w-20 shrink-0 sm:h-24 sm:w-24"
                />
                <span>
                  Shark<span style={{ color: 'var(--main)' }}>Type</span>
                </span>
              </h1>
              <p className="mt-5 text-2xl font-semibold sm:text-3xl" style={{ color: 'var(--text)' }}>
                {text.tagline}
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-7 sm:text-base" style={{ color: 'var(--sub)' }}>
                {text.body}
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link href={primaryHref} className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-transform hover:scale-[1.02]" style={{ backgroundColor: 'var(--main)', color: 'var(--bg)' }}>
                  {primaryLabel}
                  <ArrowRightIcon size={16} />
                </Link>
                <Link href="/tracks" className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-80" style={{ border: '1px solid color-mix(in srgb, var(--sub) 36%, transparent)', color: 'var(--text)' }}>
                  {text.explore}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="community" className="px-4 py-8 sm:px-6 sm:py-10">
          <div className="mx-auto w-full max-w-5xl">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold sm:text-3xl" style={{ color: 'var(--text)' }}>{text.communityTitle}</h2>
              <p className="mt-3 text-sm leading-7" style={{ color: 'var(--sub)' }}>{text.communityBody}</p>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
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
                    <span
                      className="mb-4 inline-flex rounded-2xl p-3"
                      style={{
                        backgroundColor: 'color-mix(in srgb, var(--main) 14%, transparent)',
                        color: 'var(--main)',
                      }}
                    >
                      <Icon size={22} />
                    </span>
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>{text[card.title]}</h3>
                    <p className="mt-3 text-sm leading-7" style={{ color: 'var(--sub)' }}>{text[card.body]}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--main)' }}>
                      {text.open}
                      <ArrowRightIcon size={14} />
                    </span>
                  </a>
                )
              })}
            </div>
          </div>
        </section>

        <section className="px-4 py-8 sm:px-6 sm:py-10">
          <div className="mx-auto w-full max-w-5xl rounded-[24px] border p-5 sm:p-6" style={{ borderColor: 'color-mix(in srgb, var(--sub) 18%, transparent)', backgroundColor: 'color-mix(in srgb, var(--sub-alt) 72%, transparent)' }}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{text.productTitle}</h2>
                <p className="mt-3 text-sm leading-7" style={{ color: 'var(--sub)' }}>{text.productBody}</p>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {featuredLanguages.map((language) => (
                  <span key={language.id} className="rounded-full px-3 py-1.5 text-xs font-semibold" style={{ backgroundColor: 'color-mix(in srgb, var(--sub-alt) 70%, transparent)', color: language.color, border: `1px solid ${language.color}` }}>
                    {language.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {productCards.map((card) => {
                const Icon = card.icon
                const href = card.key === 'mastery' ? masteryHref : card.href
                return (
                  <Link key={card.key} href={href} className="group rounded-[20px] border p-5 transition-all duration-150 hover:-translate-y-1 hover:brightness-110" style={{ borderColor: 'color-mix(in srgb, var(--sub) 22%, transparent)', backgroundColor: 'color-mix(in srgb, var(--bg) 30%, transparent)' }}>
                    <span className="inline-flex rounded-2xl p-3" style={{ backgroundColor: 'color-mix(in srgb, var(--main) 12%, transparent)', color: 'var(--main)' }}>
                      <Icon size={20} />
                    </span>
                    <h3 className="mt-4 text-lg font-semibold" style={{ color: 'var(--text)' }}>{text[card.title]}</h3>
                    <p className="mt-3 text-sm leading-7" style={{ color: 'var(--sub)' }}>{text[card.body]}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium transition-transform group-hover:translate-x-0.5" style={{ color: 'var(--main)' }}>
                      {card.key === 'tracks' ? text.explore : text.open}
                      <ArrowRightIcon size={14} />
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        <Footer onHelpClick={() => setShowHelp(true)} onThemeClick={() => setShowThemeSelector(true)} currentThemeName={currentTheme} locale={locale} />
      </div>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} locale={locale} />}
      {showThemeSelector && (
        <ThemeSelector currentTheme={currentTheme} onSelect={setCurrentTheme} onClose={() => setShowThemeSelector(false)} />
      )}
    </main>
  )
}
