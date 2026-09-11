import Link from 'next/link'
import BrandLogo from '@/components/brand/BrandLogo'

interface IntentLandingProps {
  eyebrow: string
  title: string
  description: string
  points: string[]
}

export default function IntentLanding({ eyebrow, title, description, points }: IntentLandingProps) {
  return (
    <main className="min-h-screen px-4 py-8" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <section className="mx-auto flex max-w-4xl flex-col gap-8">
        <nav className="flex items-center justify-between">
          <BrandLogo size={40} />
          <Link href="/tracks" className="rounded-lg px-3 py-2 text-sm font-semibold" style={{ backgroundColor: 'var(--main)', color: 'var(--bg)' }}>
            Start
          </Link>
        </nav>

        <div className="py-10 sm:py-16">
          <p className="mb-3 text-sm font-semibold uppercase" style={{ color: 'var(--main)' }}>{eyebrow}</p>
          <h1 className="mb-5 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">{title}</h1>
          <p className="max-w-2xl text-base leading-7" style={{ color: 'var(--sub)' }}>{description}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {points.map((point) => (
            <div key={point} className="rounded-xl p-4 text-sm leading-6" style={{ backgroundColor: 'var(--sub-alt)' }}>
              {point}
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
