# CodeType — MVP 1 · Plano & Prompt de Desenvolvimento

> Documento de referência para desenvolvimento do MVP 1.
> Use como prompt direto para o agente de código ou como guia de implementação.

---

## Objetivo do MVP 1

Aplicação web funcional de treino de digitação focada em **sintaxe de linguagens de programação**, sem autenticação, sem banco de dados, deployável na Vercel com um único comando.

O usuário entra, escolhe a linguagem, e começa a digitar. Simples assim.

---

## Fora do escopo do MVP 1

- Login / autenticação
- Banco de dados (nenhum — nem Supabase, nem SQLite)
- Leaderboard / ranking
- Histórico persistido
- Pagamentos / plano Pro
- API externa

---

## Stack

```
Framework:     Next.js 14 (App Router)
Linguagem:     TypeScript
Estilização:   Tailwind CSS
Fonte:         Geist Mono (código) + Geist Sans (UI) — já inclusa no Next.js 14
Deploy:        Vercel (zero config)
Dados:         Arquivos .ts estáticos no repositório (sem banco)
Dependências extras mínimas: nenhuma obrigatória no MVP
```

---

## Design System

### Filosofia
**iOS Minimalism** — precisão cirúrgica, espaço generoso, tipografia que carrega o peso visual.
Inspiração: Apple.com dark mode + Linear.app + iA Writer.

### Paleta

```css
/* Tema Escuro (padrão) */
--bg:           #000000;
--bg-secondary: #0a0a0a;
--surface:      #111111;
--border:       #222222;
--text:         #ffffff;
--text-muted:   #555555;
--text-dim:     #333333;

/* Tema Claro */
--bg:           #ffffff;
--bg-secondary: #f9f9f9;
--surface:      #f2f2f2;
--border:       #e5e5e5;
--text:         #000000;
--text-muted:   #999999;
--text-dim:     #cccccc;

/* Feedback de digitação (ambos os temas) */
--correct:      inherit;           /* mesma cor do texto — sem destaque agressivo */
--error:        #ff3b30;           /* vermelho iOS */
--pending:      var(--text-dim);   /* cinza para o que ainda não foi digitado */
--cursor:       var(--text);       /* cursor piscante na posição atual */
```

### Tipografia

```
Código (snippets): Geist Mono, 18px, line-height 1.8
UI (labels, stats): Geist Sans, 14px
Tamanhos maiores apenas para WPM/accuracy no resultado
```

### Componentes visuais

- Sem cards com sombra exagerada
- Sem gradientes decorativos
- Bordas: `1px solid var(--border)` — apenas onde necessário
- Botões: fundo `var(--surface)`, hover com `var(--border)` mais claro
- Animações: apenas fade-in suave no mount de página (`opacity 0 → 1`, 200ms)
- Nenhum emoji em nenhuma parte da interface — toda iconografia via SVG inline

---

## Sistema de Icones SVG

Todos os ícones são SVGs inline definidos em `components/icons/index.tsx`.
Stroke-based, strokeWidth 1.5, `currentColor`, sem fill — estilo consistente com Linear/Vercel.
Tamanho padrão: `16x16`. Props aceitas: `size`, `className`.

### Arquivo completo: `components/icons/index.tsx`

```tsx
type IconProps = {
  size?: number
  className?: string
}

// Alternância de tema — sol (ativo no tema escuro)
export const SunIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
    strokeLinejoin="round" className={className}>
    <circle cx="8" cy="8" r="2.5" />
    <line x1="8" y1="1.5" x2="8" y2="3" />
    <line x1="8" y1="13" x2="8" y2="14.5" />
    <line x1="1.5" y1="8" x2="3" y2="8" />
    <line x1="13" y1="8" x2="14.5" y2="8" />
    <line x1="3.4" y1="3.4" x2="4.4" y2="4.4" />
    <line x1="11.6" y1="11.6" x2="12.6" y2="12.6" />
    <line x1="12.6" y1="3.4" x2="11.6" y2="4.4" />
    <line x1="4.4" y1="11.6" x2="3.4" y2="12.6" />
  </svg>
)

// Alternância de tema — lua (ativo no tema claro)
export const MoonIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
    strokeLinejoin="round" className={className}>
    <path d="M13.5 10.5A6 6 0 0 1 5.5 2.5a6 6 0 1 0 8 8z" />
  </svg>
)

// Voltar — seta para esquerda
export const ArrowLeftIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
    strokeLinejoin="round" className={className}>
    <line x1="13" y1="8" x2="3" y2="8" />
    <polyline points="7,4 3,8 7,12" />
  </svg>
)

// Próximo — seta para direita
export const ArrowRightIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
    strokeLinejoin="round" className={className}>
    <line x1="3" y1="8" x2="13" y2="8" />
    <polyline points="9,4 13,8 9,12" />
  </svg>
)

// Reiniciar — seta circular
export const RefreshIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
    strokeLinejoin="round" className={className}>
    <polyline points="2,4.5 2,2 4.5,2" />
    <path d="M2 2 C4 0.5 8 0.5 11 3 C13.5 5 14 8 13.5 10.5" />
    <path d="M13.5 10.5 A6 6 0 0 1 2.5 11.5" />
  </svg>
)

// Resultado concluído — check minimalista
export const CheckIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
    strokeLinejoin="round" className={className}>
    <polyline points="2.5,8.5 6.5,12.5 13.5,4.5" />
  </svg>
)

// Tempo — relógio
export const ClockIcon = ({ size = 16, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
    strokeLinejoin="round" className={className}>
    <circle cx="8" cy="8" r="6" />
    <polyline points="8,5 8,8 10.5,10.5" />
  </svg>
)

// Dificuldade — losango preenchido (3 tamanhos: easy=1, medium=2, hard=3)
export const DiamondIcon = ({ size = 8, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 8 8" fill="currentColor"
    className={className}>
    <polygon points="4,0.5 7.5,4 4,7.5 0.5,4" />
  </svg>
)
```

### Regras de uso dos ícones

- Nunca usar bibliotecas de ícones externas (heroicons, lucide, phosphor, etc.)
- Todos os ícones herdam cor via `currentColor` — mudam automaticamente com o tema
- Ícones ao lado de texto: `gap-1.5` entre ícone e label, alinhados com `items-center flex`
- Ícones standalone (ThemeToggle): área de clique mínima 32x32px via `p-2`
- Adicionar novos ícones sempre em `components/icons/index.tsx`, nunca inline em outros componentes

---

## Estrutura de Arquivos

```
codetype/
├── app/
│   ├── layout.tsx                  # ThemeProvider, fontes, metadata
│   ├── page.tsx                    # Home: seleção de linguagem
│   ├── practice/
│   │   └── [lang]/
│   │       └── page.tsx            # Tela de prática
│   └── globals.css                 # CSS variables, reset, tema
│
├── components/
│   ├── icons/
│   │   └── index.tsx               # Todos os SVGs do projeto
│   ├── LanguageSelector.tsx        # Grid de seleção de linguagem
│   ├── TypingArea.tsx              # Componente principal de digitação
│   ├── StatsBar.tsx                # WPM + accuracy em tempo real
│   ├── ResultCard.tsx              # Tela de resultado pós-teste
│   ├── ThemeToggle.tsx             # Botão SunIcon/MoonIcon
│   └── ProgressBar.tsx             # Barra de progresso do snippet
│
├── hooks/
│   ├── useTypingEngine.ts          # Toda a lógica de digitação
│   └── useTimer.ts                 # Cronômetro e countdown
│
├── data/
│   ├── index.ts                    # Exporta todas as linguagens
│   ├── javascript.ts
│   ├── typescript.ts
│   ├── python.ts
│   ├── rust.ts
│   ├── go.ts
│   ├── java.ts
│   ├── sql.ts
│   ├── bash.ts
│   ├── css.ts
│   └── cpp.ts
│
├── lib/
│   ├── types.ts                    # Interfaces e tipos globais
│   └── utils.ts                    # calculateWPM, calculateAccuracy
│
└── public/
    └── (sem assets necessários no MVP)
```

---

## Tipos Globais (`lib/types.ts`)

```typescript
export type Theme = 'dark' | 'light'

export type Difficulty = 'easy' | 'medium' | 'hard'

export type Mode = 'timed_30' | 'timed_60' | 'snippet'

export interface Snippet {
  id: string
  code: string              // O código que o usuário vai digitar
  concept: string           // Ex: "Arrow Function", "Array Destructuring"
  difficulty: Difficulty
}

export interface Language {
  id: string                // Ex: "javascript"
  label: string             // Ex: "JavaScript"
  color: string             // Cor do dot identificador no card
  snippets: Snippet[]
}

export interface TypingResult {
  wpm: number
  accuracy: number          // 0–100
  duration: number          // segundos
  errors: number
  mode: Mode
  language: string
  snippet: Snippet
}

export type CharStatus = 'pending' | 'correct' | 'incorrect'

export interface TypingState {
  input: string
  charStatuses: CharStatus[]
  currentIndex: number
  errors: number
  status: 'idle' | 'running' | 'finished'
  startTime: number | null
}
```

---

## Hook de Digitação (`hooks/useTypingEngine.ts`)

```typescript
// Responsabilidades:
// 1. Receber o snippet alvo (string)
// 2. Rastrear cada caractere digitado
// 3. Calcular charStatuses em tempo real
// 4. Detectar início (primeiro keypress) e fim (snippet completo)
// 5. Expor: { state, wpm, accuracy, handleKeyPress, reset }

// Regra de erro:
// - Caractere errado: marcar como 'incorrect', incrementar errors
// - Backspace: voltar índice, reverter status para 'pending'
// - Nao bloquear no erro (usuário pode continuar digitando)

// Calculo de WPM:
// wpm = (correctChars / 5) / (elapsedSeconds / 60)
// Onde correctChars = total de chars com status 'correct'
```

---

## Estrutura dos Snippets (`data/javascript.ts`)

```typescript
import { Snippet } from '@/lib/types'

export const javascriptSnippets: Snippet[] = [
  {
    id: 'js-001',
    concept: 'Arrow Function',
    difficulty: 'easy',
    code: `const add = (a, b) => a + b;`,
  },
  {
    id: 'js-002',
    concept: 'Array Destructuring',
    difficulty: 'easy',
    code: `const [first, ...rest] = [1, 2, 3, 4];`,
  },
  {
    id: 'js-003',
    concept: 'Object Destructuring',
    difficulty: 'easy',
    code: `const { name, age = 0 } = user;`,
  },
  {
    id: 'js-004',
    concept: 'Promise',
    difficulty: 'medium',
    code: `const fetchUser = (id) =>
  fetch(\`/api/users/\${id}\`)
    .then(res => res.json())
    .catch(err => console.error(err));`,
  },
  {
    id: 'js-005',
    concept: 'Async/Await',
    difficulty: 'medium',
    code: `async function getUser(id) {
  try {
    const res = await fetch(\`/api/users/\${id}\`);
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}`,
  },
  {
    id: 'js-006',
    concept: 'Array Methods',
    difficulty: 'medium',
    code: `const result = users
  .filter(u => u.active)
  .map(u => u.name)
  .sort();`,
  },
  {
    id: 'js-007',
    concept: 'Closure',
    difficulty: 'hard',
    code: `function counter() {
  let count = 0;
  return {
    increment: () => ++count,
    decrement: () => --count,
    value: () => count,
  };
}`,
  },
  {
    id: 'js-008',
    concept: 'Spread Operator',
    difficulty: 'easy',
    code: `const merged = { ...defaults, ...overrides };`,
  },
  {
    id: 'js-009',
    concept: 'Optional Chaining',
    difficulty: 'easy',
    code: `const city = user?.address?.city ?? 'Unknown';`,
  },
  {
    id: 'js-010',
    concept: 'Class',
    difficulty: 'medium',
    code: `class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return \`\${this.name} makes a noise.\`;
  }
}`,
  },
]
```

> Padrao para todas as linguagens: minimo 10 snippets cobrindo conceitos básicos
> (variáveis, funções, loops), intermediários (estruturas de dados, tratamento de erros)
> e avançados (padrões idiomáticos da linguagem).

---

## Telas

### Tela 1 — Home (`app/page.tsx`)

```
[espaço generoso]

  CodeType                          [SunIcon ou MoonIcon]

  Escolha a linguagem para praticar

  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
  │ · JS     │ │ · TS     │ │ · Python │ │ · Rust   │ │ · Go     │
  │ 10 snips │ │ 10 snips │ │ 10 snips │ │ 10 snips │ │ 10 snips │
  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘
  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
  │ · Java   │ │ · SQL    │ │ · Bash   │ │ · C++    │
  │ 10 snips │ │ 10 snips │ │ 10 snips │ │ 10 snips │
  └──────────┘ └──────────┘ └──────────┘ └──────────┘

[espaço generoso]
```

Cada card:
- Fundo `var(--surface)`, borda `var(--border)`
- Hover: borda `var(--text)` (transição 150ms)
- Dot colorido único por linguagem (definido em `Language.color`)
- Sem ícones de logo de linguagens — apenas dot + texto

---

### Tela 2 — Pratica (`app/practice/[lang]/page.tsx`)

```
[ArrowLeftIcon] Voltar     JavaScript · Arrow Function     [SunIcon/MoonIcon]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  barra de progresso preenchida

  WPM: 68     Precisao: 94%     [ClockIcon] 00:45

  ┌─────────────────────────────────────────────────────────────────┐
  │  const add = (a, b) => a + b;                                   │
  │  ██████████████░░░░░░░░░░░░░░                                   │
  └─────────────────────────────────────────────────────────────────┘

  [ 30s ]  [ 60s ]  [ Livre ]          [RefreshIcon]  [ArrowRightIcon]
```

Regras de exibição do snippet:
- Cada caractere tem status visual:
  - `pending`: `var(--text-dim)` — apagado, ainda nao digitado
  - `correct`: `var(--text)` — normal, digitado corretamente
  - `incorrect`: `var(--error)` — vermelho com underline sutil
- Cursor: linha vertical `|` piscando (animation `blink` 1s) na posição atual
- Input real: `<textarea>` com `opacity: 0; position: absolute` capturando teclado
- Exibição 100% controlada via React state — sem contenteditable

Modos:
- `30s` / `60s`: countdown visível com ClockIcon, snippet nao precisa ser completado
- `Livre`: sem tempo, detecta fim quando último caractere é digitado corretamente

---

### Tela 3 — Resultado (modal overlay)

```
  ┌──────────────────────────────────────────┐
  │                                          │
  │   [CheckIcon]  Concluido                 │
  │                                          │
  │   68            94%                      │
  │   WPM           Precisao                 │
  │                                          │
  │   Conceito     Arrow Function            │
  │   Linguagem    JavaScript                │
  │   Erros        3                         │
  │   Duracao      18s                       │
  │                                          │
  │  [RefreshIcon] Tentar novamente          │
  │  [ArrowRightIcon] Proximo snippet        │
  │                                          │
  └──────────────────────────────────────────┘
```

- Modal centralizado com `backdrop-blur-sm` e `bg-black/60`
- Sem animacoes exageradas — apenas fade-in 200ms
- Botao primario: "Proximo snippet"

---

## Utilitarios (`lib/utils.ts`)

```typescript
// WPM padrao da industria: (chars corretos / 5) / minutos
export function calculateWPM(correctChars: number, elapsedMs: number): number {
  if (elapsedMs < 1000) return 0
  const minutes = elapsedMs / 1000 / 60
  return Math.round(correctChars / 5 / minutes)
}

// Accuracy: percentual de chars corretos sobre o total tentado
export function calculateAccuracy(correct: number, total: number): number {
  if (total === 0) return 100
  return Math.round((correct / total) * 100)
}

// Snippet aleatorio sem repetir o atual
export function getRandomSnippet(snippets: Snippet[], currentId?: string): Snippet {
  const pool = snippets.filter(s => s.id !== currentId)
  return pool[Math.floor(Math.random() * pool.length)]
}

// Formatar segundos como MM:SS
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}
```

---

## Snippets por Linguagem (MVP — minimo 10 por linguagem)

| Linguagem | Conceitos a cobrir |
|---|---|
| **JavaScript** | Arrow fn, destructuring, spread, async/await, array methods, closure, class, optional chaining, template literals, modules |
| **TypeScript** | Interface, type, generics, enum, type narrowing, utility types (Partial/Required/Pick), decorators simples, infer |
| **Python** | List comprehension, dict comprehension, lambda, decorators, context manager (with), dataclass, f-string, walrus operator, unpacking |
| **Rust** | fn com tipos, ownership/borrow basico, match, Option/Result, impl, struct, Vec, closure com move |
| **Go** | func, struct, interface, goroutine, channel, defer, error handling, range, map, pointer basico |
| **Java** | Class/interface, generics, stream API, lambda, optional, record, switch expression, try-with-resources |
| **SQL** | SELECT com JOIN, GROUP BY + HAVING, subquery, CTE (WITH), window function, INSERT/UPDATE/DELETE, indice |
| **Bash** | Variaveis, if/else, for loop, while, funcao, pipes, redirecionamento, arrays, getopts |
| **CSS** | Flexbox, Grid, custom properties, media query, animation, pseudo-elementos, container query |
| **C++** | Template, smart pointer, lambda, range-for, auto, struct com methods, namespace, vector |

---

## Deploy na Vercel

```bash
# Setup
npx create-next-app@latest codetype --typescript --tailwind --app --no-src-dir
cd codetype

# Geist ja vem incluida no Next.js 14 via next/font

# Dev
npm run dev

# Deploy
npx vercel --prod
```

Variaveis de ambiente no MVP 1: nenhuma. Tudo estatico.

---

## Checklist MVP 1

### Funcional
- [ ] Seletor de linguagem na home
- [ ] Rota `/practice/[lang]` dinamica
- [ ] Textarea invisivel capturando input
- [ ] Render caractere a caractere com status visual
- [ ] Cursor piscante na posicao atual
- [ ] Calculo de WPM em tempo real
- [ ] Calculo de accuracy em tempo real
- [ ] Modos: 30s, 60s, Livre
- [ ] Countdown para modos cronometrados
- [ ] Deteccao de fim (snippet completo ou tempo esgotado)
- [ ] Tela de resultado com WPM, accuracy, erros
- [ ] Botao "Proximo snippet" (aleatorio, sem repetir)
- [ ] Botao "Reiniciar" (mesmo snippet)
- [ ] Label do conceito visivel acima do snippet

### Design
- [ ] Tema escuro como padrao
- [ ] Alternancia de tema com SunIcon/MoonIcon
- [ ] CSS variables para cores (sem FOUC)
- [ ] Fonte monoespacada para codigo
- [ ] Layout responsivo
- [ ] Sem scroll horizontal
- [ ] Erro em vermelho (#ff3b30) com underline
- [ ] Fade-in suave no mount (200ms)
- [ ] Nenhum emoji em toda a interface

### Icones SVG
- [ ] SunIcon
- [ ] MoonIcon
- [ ] ArrowLeftIcon
- [ ] ArrowRightIcon
- [ ] RefreshIcon
- [ ] CheckIcon
- [ ] ClockIcon
- [ ] DiamondIcon
- [ ] Todos em `components/icons/index.tsx`
- [ ] Todos com `currentColor` (adaptam ao tema)

### Dados
- [ ] 10 linguagens
- [ ] Minimo 10 snippets por linguagem
- [ ] Cada snippet com `id`, `concept`, `difficulty`, `code`

### Deploy
- [ ] `npm run build` sem erros
- [ ] Deploy na Vercel funcionando
- [ ] `data-theme` no `<html>` para evitar flash de tema

---

## Proximos passos apos MVP 1

```
MVP 2 — Autenticacao + banco
  → Supabase Auth (GitHub/Google)
  → Historico de resultados por usuario
  → Perfil publico com stats

MVP 3 — Gamificacao
  → Leaderboard por linguagem
  → Streaks diarios
  → Sistema de dificuldade progressiva

MVP 4 — Monetizacao
  → Plano Pro com Stripe
  → Carbon Ads para free tier
  → Remocao de ads para Pro
```

---

*Documento de referencia para o desenvolvimento do CodeType MVP 1.*
*Ultima atualizacao: marco 2026*
