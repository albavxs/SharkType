'use client'

import Link from 'next/link'
import SceneWrapper from '@/components/three/SceneWrapper'
import { useIsMobile } from '@/hooks/useMediaQuery'

interface AuthShellProps {
  title: string
  subtitle: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export default function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  const isMobile = useIsMobile()

  return (
    <main className="relative min-h-screen overflow-hidden">
      {!isMobile && <SceneWrapper />}

      <div className="relative z-10 flex min-h-screen flex-col px-4 py-6 sm:px-6">
        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center">
          <Link
            href="/"
            className="mb-8 w-fit text-2xl font-bold font-[family-name:var(--font-geist-mono)] transition-opacity hover:opacity-80"
            style={{ color: 'var(--text)' }}
          >
            Shark<span style={{ color: 'var(--main)' }}>Type</span>
          </Link>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <section className="hidden rounded-[2rem] border p-8 lg:block" style={{ borderColor: 'color-mix(in srgb, var(--sub) 24%, transparent)', background: 'linear-gradient(180deg, color-mix(in srgb, var(--sub-alt) 92%, transparent), color-mix(in srgb, var(--bg) 96%, transparent))' }}>
              <div className="mb-6 inline-flex rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.24em]" style={{ backgroundColor: 'color-mix(in srgb, var(--main) 14%, transparent)', color: 'var(--main)' }}>
                code. focus. streak.
              </div>
              <h1 className="max-w-xl text-4xl font-bold leading-tight font-[family-name:var(--font-geist-mono)]" style={{ color: 'var(--text)' }}>
                Sua evolução no SharkType agora pode viver além do navegador.
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7" style={{ color: 'var(--sub)' }}>
                Entre com GitHub ou crie sua conta para sincronizar XP, streak, histórico e competir no ranking global sem perder a fluidez do modo guest.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  { label: 'Streak diário', value: 'sync' },
                  { label: 'Ranking global', value: 'live' },
                  { label: 'Perfil persistente', value: 'cloud' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border px-4 py-4"
                    style={{
                      borderColor: 'color-mix(in srgb, var(--sub) 18%, transparent)',
                      backgroundColor: 'color-mix(in srgb, var(--sub-alt) 65%, transparent)',
                    }}
                  >
                    <div className="text-[11px] uppercase tracking-[0.2em]" style={{ color: 'var(--main)' }}>
                      {item.value}
                    </div>
                    <div className="mt-2 text-sm font-medium" style={{ color: 'var(--text)' }}>
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section
              className="rounded-[2rem] border p-5 sm:p-7"
              style={{
                borderColor: 'color-mix(in srgb, var(--sub) 24%, transparent)',
                background: 'linear-gradient(180deg, color-mix(in srgb, var(--sub-alt) 92%, transparent), color-mix(in srgb, var(--bg) 96%, transparent))',
                boxShadow: '0 24px 80px color-mix(in srgb, var(--bg) 78%, transparent)',
              }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold font-[family-name:var(--font-geist-mono)]" style={{ color: 'var(--text)' }}>
                  {title}
                </h2>
                <p className="mt-2 text-sm leading-6" style={{ color: 'var(--sub)' }}>
                  {subtitle}
                </p>
              </div>
              {children}
              {footer ? <div className="mt-6">{footer}</div> : null}
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
