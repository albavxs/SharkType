'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import Footer from '@/components/typing/Footer'
import SharkTitleMark from '@/components/landing/SharkTitleMark'
import { ArrowRightIcon, BookIcon, ChartIcon, DiscordIcon, GithubIcon, ShieldIcon } from '@/components/icons'
import { useAuth } from '@/hooks/useAuth'
import { useLocale } from '@/hooks/useLocale'
import { DEFAULT_THEME, applyTheme, getTheme, getThemePref } from '@/lib/themes'
import { COMMUNITY_LINKS } from '@/lib/community'
import { codeLanguageMetas } from '@/data/metadata'

const ThemeSelector = dynamic(() => import('@/components/typing/ThemeSelector'))
const HelpModal = dynamic(() => import('@/components/typing/HelpModal'))
const SceneWrapper = dynamic(() => import('@/components/three/SceneWrapper'), { ssr: false })

const copy = {
  pt: {
    navTracks: 'Trilhas',
    navPlus: 'Plus',
    navLogin: 'Entrar',
    tagline: 'Aprenda. Digite. Domine.',
    body: 'Pratique código real, desenvolva memória muscular e avance por trilhas até os desafios Mastery.',
    start: 'Começar agora',
    continue: 'Continuar praticando',
    explore: 'Explorar trilhas',
    communityTitle: 'Comunidade SharkType',
    communityBody: 'Aprender é melhor quando não acontece sozinho.',
    discordTitle: 'Discord',
    discordBody: 'Converse, peça ajuda e compartilhe progresso.',
    githubTitle: 'GitHub',
    githubBody: 'Acompanhe o desenvolvimento e contribua.',
    projectTitle: 'Projeto',
    projectBody: 'Conheça o ecossistema e a evolução do SharkType.',
    open: 'Abrir',
    productTitle: 'Pratique. Evolua. Domine.',
    productBody: 'Entre pela prática Base, evolua pelas trilhas e avance para Mastery quando quiser desafios premium separados.',
    practiceTitle: 'Prática Base',
    practiceBody: 'Sessões rápidas com snippets Base para aquecer e manter ritmo.',
    tracksTitle: 'Trilhas',
    tracksBody: 'Fundamentos organizados por linguagem, conceito e stack.',
    masteryTitle: 'Mastery',
    masteryBody: 'Desafios avançados, estrelas e progressão premium sem misturar com Base.',
    scroll: 'Descobrir',
  },
  en: {
    navTracks: 'Tracks',
    navPlus: 'Plus',
    navLogin: 'Sign in',
    tagline: 'Learn. Type. Master.',
    body: 'Practice real code, build muscle memory, and progress through tracks into advanced Mastery challenges.',
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
    projectBody: 'Explore the SharkType ecosystem and its evolution.',
    open: 'Open',
    productTitle: 'Practice. Progress. Master.',
    productBody: 'Start with Base practice, progress through structured tracks, and move into separate premium Mastery challenges.',
    practiceTitle: 'Base Practice',
    practiceBody: 'Fast sessions with Base snippets for warmups and steady rhythm.',
    tracksTitle: 'Tracks',
    tracksBody: 'Fundamentals organized by language, concept, and stack.',
    masteryTitle: 'Mastery',
    masteryBody: 'Advanced challenges, stars, and premium progression without mixing into Base.',
    scroll: 'Discover',
  },
} as const

const communityCards = [
  { key: 'discord', href: COMMUNITY_LINKS.discord, icon: DiscordIcon, title: 'discordTitle', body: 'discordBody' },
  { key: 'github', href: COMMUNITY_LINKS.github, icon: GithubIcon, title: 'githubTitle', body: 'githubBody' },
  { key: 'project', href: COMMUNITY_LINKS.website, icon: ShieldIcon, title: 'projectTitle', body: 'projectBody' },
] as const

const productCards = [
  { key: 'practice', icon: ShieldIcon, title: 'practiceTitle', body: 'practiceBody', href: '/home' },
  { key: 'tracks', icon: BookIcon, title: 'tracksTitle', body: 'tracksBody', href: '/tracks' },
  { key: 'mastery', icon: ChartIcon, title: 'masteryTitle', body: 'masteryBody', href: null },
] as const

const demoLines = [
  'const sharktype = {',
  '  language: "TypeScript",',
  '  streak: 14,',
  '  mastery: true,',
  '}',
]
const demoCode = demoLines.join('\n')

function CodePreview() {
  const reduceMotion = useReducedMotion()
  const [visibleCode, setVisibleCode] = useState(reduceMotion ? demoCode : '')

  useEffect(() => {
    if (reduceMotion) {
      setVisibleCode(demoCode)
      return
    }

    let index = 0
    const interval = window.setInterval(() => {
      index += 1
      setVisibleCode(demoCode.slice(0, index))
      if (index >= demoCode.length) window.clearInterval(interval)
    }, 95)

    return () => window.clearInterval(interval)
  }, [reduceMotion])

  const visibleLines = visibleCode.split('\n')

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 20, rotateX: -3 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduceMotion ? undefined : { y: -4, rotateX: 1, rotateY: -1.2 }}
      className="relative z-20 w-full max-w-[540px] overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl"
      style={{
        borderColor: 'color-mix(in srgb, var(--main) 24%, color-mix(in srgb, var(--sub) 24%, transparent))',
        backgroundColor: 'color-mix(in srgb, var(--bg) 90%, transparent)',
        boxShadow: '0 24px 80px color-mix(in srgb, var(--main) 9%, transparent)',
        transformStyle: 'preserve-3d',
      }}
    >
      <div className="flex items-center gap-2 border-b px-4 py-3" style={{ borderColor: 'color-mix(in srgb, var(--sub) 18%, transparent)', backgroundColor: 'color-mix(in srgb, var(--sub-alt) 78%, transparent)' }}>
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#ff625f' }} />
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#ffbe3f' }} />
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#2bcf65' }} />
        <span className="ml-auto font-mono text-[10px] tracking-wide" style={{ color: 'var(--sub)' }}>practice.ts · TypeScript</span>
      </div>

      <div className="min-h-[245px] p-5 sm:p-6">
        <div className="font-mono text-[13px] leading-7 sm:text-sm">
          {visibleLines.map((line, index) => (
            <div key={`${index}-${line}`} className="grid grid-cols-[24px_1fr] gap-3">
              <span className="select-none text-right text-[10px]" style={{ color: 'var(--sub)', opacity: 0.45 }}>{index + 1}</span>
              <pre className="whitespace-pre-wrap" style={{ color: 'var(--text)' }}>
                {line}
                {index === visibleLines.length - 1 && visibleCode.length < demoCode.length ? (
                  <span className="animate-pulse" style={{ color: 'var(--main)' }}>▌</span>
                ) : null}
              </pre>
            </div>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-3 text-xs">
          <span className="rounded-full px-3 py-1.5 font-semibold" style={{ backgroundColor: 'color-mix(in srgb, var(--main) 14%, transparent)', color: 'var(--main)' }}>72 WPM</span>
          <span style={{ color: 'var(--sub)' }}>98% accuracy</span>
          <span style={{ color: 'var(--sub)' }}>0 errors</span>
        </div>
      </div>
    </motion.div>
  )
}

export default function PublicHomePage() {
  const { profile, isLoading } = useAuth()
  const { locale, toggleLocale } = useLocale()
  const [currentTheme, setCurrentTheme] = useState(DEFAULT_THEME)
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const heroTextY = useTransform(scrollYProgress, [0, 0.22], [0, reduceMotion ? 0 : 36])
  const heroVisualY = useTransform(scrollYProgress, [0, 0.22], [0, reduceMotion ? 0 : 62])
  const text = copy[locale]
  const featuredLanguages = useMemo(
    () => codeLanguageMetas.filter((language) => ['javascript', 'python', 'linux', 'typescript', 'react', 'git'].includes(language.id)),
    [],
  )
  const primaryHref = profile ? '/home' : '/signup'
  const primaryLabel = profile ? text.continue : text.start
  const masteryHref = profile ? '/tracks' : '/plus'

  useEffect(() => {
    const preferredTheme = getThemePref()
    setCurrentTheme(preferredTheme)
    applyTheme(getTheme(preferredTheme))
  }, [])

  useEffect(() => {
    applyTheme(getTheme(currentTheme))
  }, [currentTheme])

  const reveal = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 26 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
      }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <SceneWrapper variant="landing" />
      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="absolute inset-x-0 top-0 z-40 mx-auto flex w-full max-w-6xl items-center justify-end px-4 py-5 sm:px-6 sm:py-6">
          <nav className="flex items-center gap-2 sm:gap-3">
            <Link href="/tracks" className="rounded-full px-3 py-2 text-xs font-medium transition-all hover:opacity-80 sm:text-sm" style={{ color: 'var(--text)' }}>
              {text.navTracks}
            </Link>
            <Link
              href="/plus"
              className="rounded-full px-4 py-2 text-xs font-bold transition-all hover:scale-[1.04] hover:brightness-110 sm:text-sm"
              style={{ backgroundColor: 'var(--main)', color: 'var(--bg)', boxShadow: '0 0 24px color-mix(in srgb, var(--main) 18%, transparent)' }}
            >
              {text.navPlus}
            </Link>
            <button
              onClick={toggleLocale}
              className="rounded-full px-3 py-2 text-xs font-mono font-medium transition-all hover:brightness-110"
              style={{ border: '1px solid color-mix(in srgb, var(--sub) 32%, transparent)', color: 'var(--text)', backgroundColor: 'color-mix(in srgb, var(--bg) 60%, transparent)' }}
            >
              {locale === 'pt' ? 'PT' : 'EN'}
            </button>
            {!profile && !isLoading ? (
              <Link href="/login" className="hidden rounded-full px-3 py-2 text-sm font-medium transition-opacity hover:opacity-80 md:inline-flex" style={{ color: 'var(--text)' }}>
                {text.navLogin}
              </Link>
            ) : null}
          </nav>
        </header>

        <section className="relative flex min-h-[86svh] items-center px-4 pb-16 pt-24 sm:px-6 lg:min-h-[88vh] lg:pb-20 lg:pt-28">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[0.96fr_1.04fr] lg:gap-14">
            <motion.div style={{ y: heroTextY }} className="relative z-20 max-w-xl">
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, x: -30, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-2 sm:gap-3"
              >
                <SharkTitleMark themeSignal={currentTheme} />
                <h1
                  className="text-5xl font-black leading-[0.94] tracking-[-0.055em] font-[family-name:var(--font-geist-mono)] sm:text-6xl lg:text-7xl xl:text-[5.35rem]"
                  style={{ color: 'var(--text)' }}
                >
                  Shark<span style={{ color: 'var(--main)' }}>Type</span>
                </h1>
              </motion.div>

              <motion.p
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.24 }}
                className="mt-6 text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl"
                style={{ color: 'var(--text)' }}
              >
                {text.tagline}
              </motion.p>

              <motion.p
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.34 }}
                className="mt-5 max-w-lg text-sm leading-7 sm:text-base sm:leading-8"
                style={{ color: 'var(--sub)' }}
              >
                {text.body}
              </motion.p>

              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.44 }}
                className="mt-8 flex flex-col gap-3 sm:flex-row"
              >
                <Link href={primaryHref} className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-transform hover:scale-[1.03]" style={{ backgroundColor: 'var(--main)', color: 'var(--bg)' }}>
                  {primaryLabel}
                  <ArrowRightIcon size={16} />
                </Link>
                <Link href="/tracks" className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold backdrop-blur-sm transition-all hover:brightness-110" style={{ border: '1px solid color-mix(in srgb, var(--sub) 36%, transparent)', color: 'var(--text)', backgroundColor: 'color-mix(in srgb, var(--bg) 44%, transparent)' }}>
                  {text.explore}
                </Link>
              </motion.div>
            </motion.div>

            <motion.div style={{ y: heroVisualY }} className="relative z-20 flex min-h-[360px] items-center justify-center lg:min-h-[480px] lg:justify-end">
              <div className="pointer-events-none absolute inset-[-14%_-12%] rounded-full opacity-70 blur-3xl" style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--main) 10%, transparent), transparent 64%)' }} />
              <CodePreview />
            </motion.div>
          </div>

          <motion.a
            href="#community"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1, y: reduceMotion ? 0 : [0, 7, 0] }}
            transition={reduceMotion ? { duration: 0.3 } : { opacity: { delay: 0.8, duration: 0.5 }, y: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' } }}
            className="absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-[10px] font-medium uppercase tracking-[0.18em]"
            style={{ color: 'var(--sub)' }}
          >
            <span>{text.scroll}</span>
            <span className="text-2xl leading-none">⌄</span>
          </motion.a>
        </section>

        <section id="community" className="scroll-mt-10 px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto w-full max-w-5xl">
            <motion.div {...reveal} className="max-w-2xl">
              <h2 className="text-3xl font-bold sm:text-4xl" style={{ color: 'var(--text)' }}>{text.communityTitle}</h2>
              <p className="mt-3 text-sm leading-7 sm:text-base" style={{ color: 'var(--sub)' }}>{text.communityBody}</p>
            </motion.div>

            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {communityCards.map((card, index) => {
                const Icon = card.icon
                return (
                  <motion.a
                    key={card.key}
                    href={card.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.55, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={reduceMotion ? undefined : { y: -5 }}
                    className="group relative overflow-hidden rounded-[24px] border p-5 backdrop-blur-sm"
                    style={{
                      borderColor: 'color-mix(in srgb, var(--sub) 22%, transparent)',
                      backgroundColor: 'color-mix(in srgb, var(--sub-alt) 78%, transparent)',
                    }}
                  >
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: 'radial-gradient(circle at 25% 15%, color-mix(in srgb, var(--main) 12%, transparent), transparent 48%)' }} />
                    <span className="relative mb-4 inline-flex rounded-2xl p-3 transition-all duration-200 group-hover:scale-105" style={{ backgroundColor: 'color-mix(in srgb, var(--main) 14%, transparent)', color: 'var(--main)' }}>
                      <Icon size={22} />
                    </span>
                    <h3 className="relative text-lg font-semibold" style={{ color: 'var(--text)' }}>{text[card.title]}</h3>
                    <p className="relative mt-3 text-sm leading-7" style={{ color: 'var(--sub)' }}>{text[card.body]}</p>
                    <span className="relative mt-5 inline-flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--main)' }}>
                      {text.open}
                      <span className="transition-transform duration-200 group-hover:translate-x-1"><ArrowRightIcon size={14} /></span>
                    </span>
                  </motion.a>
                )
              })}
            </div>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 sm:py-16">
          <motion.div {...reveal} className="mx-auto w-full max-w-5xl rounded-[28px] border p-5 backdrop-blur-sm sm:p-7" style={{ borderColor: 'color-mix(in srgb, var(--sub) 18%, transparent)', backgroundColor: 'color-mix(in srgb, var(--sub-alt) 70%, transparent)' }}>
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold sm:text-4xl" style={{ color: 'var(--text)' }}>{text.productTitle}</h2>
              <p className="mt-3 text-sm leading-7 sm:text-base" style={{ color: 'var(--sub)' }}>{text.productBody}</p>
            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {productCards.map((card) => {
                const Icon = card.icon
                const href = card.key === 'mastery' ? masteryHref : card.href
                return (
                  <motion.div key={card.key} whileHover={reduceMotion ? undefined : { y: -4 }}>
                    <Link href={href} className="group block h-full rounded-[22px] border p-5 transition-all hover:brightness-110" style={{ borderColor: card.key === 'mastery' ? 'color-mix(in srgb, var(--main) 35%, transparent)' : 'color-mix(in srgb, var(--sub) 22%, transparent)', backgroundColor: 'color-mix(in srgb, var(--bg) 32%, transparent)' }}>
                      <span className="inline-flex rounded-2xl p-3" style={{ backgroundColor: 'color-mix(in srgb, var(--main) 12%, transparent)', color: 'var(--main)' }}><Icon size={20} /></span>
                      <h3 className="mt-4 text-lg font-semibold" style={{ color: 'var(--text)' }}>{text[card.title]}</h3>
                      <p className="mt-3 text-sm leading-7" style={{ color: 'var(--sub)' }}>{text[card.body]}</p>
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--main)' }}>
                        {card.key === 'tracks' ? text.explore : text.open}
                        <span className="transition-transform group-hover:translate-x-1"><ArrowRightIcon size={14} /></span>
                      </span>
                    </Link>
                  </motion.div>
                )
              })}
            </div>

            <div className="relative mt-7 overflow-hidden border-t pt-6" style={{ borderColor: 'color-mix(in srgb, var(--sub) 15%, transparent)' }}>
              <motion.div
                className="flex w-max gap-2"
                animate={reduceMotion ? undefined : { x: ['0%', '-50%'] }}
                transition={reduceMotion ? undefined : { duration: 34, ease: 'linear', repeat: Infinity }}
              >
                {[...featuredLanguages, ...featuredLanguages].map((language, index) => (
                  <span key={`${language.id}-${index}`} className="rounded-full px-3 py-1.5 text-xs font-semibold" style={{ backgroundColor: 'color-mix(in srgb, var(--sub-alt) 72%, transparent)', color: language.color, border: `1px solid color-mix(in srgb, ${language.color} 60%, transparent)` }}>
                    {language.label}
                  </span>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </section>

        <Footer onHelpClick={() => setShowHelp(true)} onThemeClick={() => setShowThemeSelector(true)} currentThemeName={currentTheme} locale={locale} />
      </div>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} locale={locale} />}
      {showThemeSelector && <ThemeSelector currentTheme={currentTheme} onSelect={setCurrentTheme} onClose={() => setShowThemeSelector(false)} />}
    </main>
  )
}
