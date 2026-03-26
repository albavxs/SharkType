'use client'

import { XIcon } from '@/components/icons'

interface HelpModalProps {
  onClose: () => void
}

export default function HelpModal({ onClose }: HelpModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div
        className="w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-fade-in max-h-[80vh] overflow-y-auto"
        style={{ backgroundColor: 'var(--sub-alt)', border: '1px solid var(--sub)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--sub)' }}>
          <h2 className="text-lg font-bold font-[family-name:var(--font-geist-mono)]" style={{ color: 'var(--text)' }}>
            Como usar o SharkType
          </h2>
          <button onClick={onClose} style={{ color: 'var(--sub)' }} className="hover:opacity-80">
            <XIcon size={18} />
          </button>
        </div>

        <div className="px-6 py-4 space-y-6 text-sm" style={{ color: 'var(--text)' }}>
          {/* Shortcuts */}
          <div>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--main)' }}>Atalhos de teclado</h3>
            <div className="space-y-1" style={{ color: 'var(--sub)' }}>
              <div><Kbd>tab</Kbd> reiniciar teste / proximo snippet</div>
              <div><Kbd>enter</Kbd> nova linha (no codigo)</div>
              <div><Kbd>backspace</Kbd> apagar caractere</div>
              <div><Kbd>esc</Kbd> fechar modais</div>
            </div>
          </div>

          {/* Modes */}
          <div>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--main)' }}>Modos</h3>
            <div className="space-y-1" style={{ color: 'var(--sub)' }}>
              <div><strong>30 / 60</strong> — Modo cronometrado. Digite o maximo que conseguir no tempo.</div>
              <div><strong>snippet</strong> — Modo livre. Complete o snippet no seu ritmo.</div>
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--main)' }}>Dificuldade</h3>
            <div className="space-y-1" style={{ color: 'var(--sub)' }}>
              <div><strong>facil</strong> — Variaveis, declaracoes simples, one-liners</div>
              <div><strong>medio</strong> — Funcoes, loops, tratamento de erros</div>
              <div><strong>dificil</strong> — Patterns avancados, generics, closures</div>
            </div>
          </div>

          {/* Tracks */}
          <div>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--main)' }}>Trilhas</h3>
            <p style={{ color: 'var(--sub)' }}>
              Acesse as trilhas educacionais pelo icone de livro no header. Pratique conceitos especificos como Variaveis, Funcoes, Objetos e mais, em qualquer linguagem.
            </p>
          </div>

          {/* XP */}
          <div>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--main)' }}>XP e Niveis</h3>
            <p style={{ color: 'var(--sub)' }}>
              Ganhe XP ao completar snippets. Quanto maior o WPM e accuracy, mais XP. Snippets dificeis dao bonus multiplicador. Mantenha um streak diario para motivacao.
            </p>
          </div>

          {/* Themes */}
          <div>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--main)' }}>Temas</h3>
            <p style={{ color: 'var(--sub)' }}>
              Clique no nome do tema no canto inferior direito para trocar. Mais de 30 temas disponiveis. As cores do tema tambem afetam o syntax highlighting do codigo.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-block px-1.5 py-0.5 rounded text-[10px] font-mono mr-1"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--sub)' }}
    >
      {children}
    </span>
  )
}
