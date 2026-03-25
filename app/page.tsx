import LanguageSelector from '@/components/LanguageSelector'
import ThemeToggle from '@/components/ThemeToggle'
import TypingDemo from '@/components/TypingDemo'
import UserStatsBar from '@/components/UserStatsBar'

export default function Home() {
  return (
    <main className="flex-1 flex flex-col animate-fade-in">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-3xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-16">
            <h1 className="text-xl font-medium tracking-tight font-[family-name:var(--font-geist-mono)]">
              Syntax<span className="text-indigo-500">.lang</span>.IO
            </h1>
            <ThemeToggle />
          </div>

          {/* Hero */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold tracking-tight mb-4 font-[family-name:var(--font-geist-mono)]">
              Domine a sintaxe<span className="text-indigo-500">.</span>
            </h2>
            <p className="text-neutral-500 light:text-neutral-400 text-lg mb-8">
              Pratique digitacao de codigo em 10 linguagens de programacao.
            </p>

            {/* Typing demo */}
            <div className="inline-block text-left p-4 rounded-lg border border-neutral-800 light:border-neutral-200 bg-neutral-950 light:bg-neutral-50 mb-8">
              <TypingDemo />
            </div>
          </div>

          {/* User stats (returning users only) */}
          <div className="mb-8">
            <UserStatsBar />
          </div>

          {/* Language grid */}
          <p className="text-sm text-neutral-500 light:text-neutral-400 mb-4">
            Escolha a linguagem
          </p>
          <LanguageSelector />

          {/* Footer */}
          <footer className="text-center mt-16 text-xs text-neutral-700 light:text-neutral-300">
            Feito com codigo e cafe
          </footer>
        </div>
      </div>
    </main>
  )
}
