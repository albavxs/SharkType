export interface Track {
  id: string
  name: string
  description: string
  snippetIds: string[]
  textLanguages?: true
  difficultyFilter?: 'easy' | 'medium' | 'hard'
}

export const tracks: Track[] = [
  // ── Existing tracks (updated with new languages) ─────────────────────────
  {
    id: 'variables',
    name: 'Variaveis',
    description: 'Declaracao e uso de variaveis, constantes e tipos basicos',
    snippetIds: [
      'js-002', 'js-003', 'js-008', 'js-009',
      'ts-001', 'ts-002', 'ts-004', 'ts-009',
      'py-001', 'py-002', 'py-007', 'py-009',
      'rs-001', 'rs-007', 'rs-009',
      'go-002', 'go-009',
      'cpp-004', 'cpp-005', 'cpp-006',
      'bash-001',
      'css-003',
      'swift-001',
      'scala-001',
      'ruby-004',
      'lua-002',
    ],
  },
  {
    id: 'functions',
    name: 'Funcoes',
    description: 'Funcoes, arrow functions, lambdas, closures e callbacks',
    snippetIds: [
      'js-001', 'js-005', 'js-007',
      'ts-003', 'ts-007', 'ts-010',
      'py-003', 'py-004', 'py-010',
      'rs-001', 'rs-004', 'rs-005',
      'go-001', 'go-006',
      'java-003', 'java-005',
      'cpp-001', 'cpp-003',
      'bash-005',
      'ruby-001',
      'lua-001',
      'kotlin-007',
      'swift-008',
    ],
  },
  {
    id: 'objects',
    name: 'Objetos e Structs',
    description: 'Objetos, structs, classes, interfaces e tipos compostos',
    snippetIds: [
      'js-010',
      'ts-001', 'ts-006', 'ts-008',
      'py-006',
      'rs-006', 'rs-010',
      'go-002', 'go-003',
      'java-001', 'java-002', 'java-007',
      'cpp-006', 'cpp-007',
      'swift-005',
      'scala-002',
      'ruby-005',
      'lua-005',
    ],
  },
  {
    id: 'loops',
    name: 'Loops e Iteracao',
    description: 'For, while, iteradores, map, filter e array methods',
    snippetIds: [
      'js-006',
      'py-001', 'py-002',
      'rs-007',
      'go-008',
      'java-004',
      'cpp-004', 'cpp-008',
      'bash-003', 'bash-004',
      'css-002',
      'swift-004',
      'scala-006',
      'ruby-003',
      'lua-003', 'lua-007',
    ],
  },
  {
    id: 'types',
    name: 'Sistema de Tipos',
    description: 'Generics, type narrowing, utility types e type guards',
    snippetIds: [
      'ts-003', 'ts-005', 'ts-006', 'ts-007', 'ts-008', 'ts-010',
      'rs-004', 'rs-005',
      'java-003', 'java-006',
      'cpp-001', 'cpp-010',
      'kotlin-010',
      'scala-009',
      'swift-007', 'swift-009',
    ],
  },
  {
    id: 'errors',
    name: 'Tratamento de Erros',
    description: 'Try/catch, Result, Option, error handling patterns',
    snippetIds: [
      'js-004', 'js-005',
      'py-004',
      'rs-004', 'rs-005',
      'go-006', 'go-007',
      'java-009', 'java-010',
      'bash-002',
      'scala-007',
      'swift-003', 'swift-006',
      'lua-010',
      'kotlin-004',
      'cpp-010',
    ],
  },
  {
    id: 'classes',
    name: 'Classes e OOP',
    description: 'Classes, heranca, interfaces, impl blocks',
    snippetIds: [
      'js-010',
      'ts-009',
      'py-006',
      'rs-006',
      'go-003',
      'java-001', 'java-002', 'java-007',
      'cpp-006', 'cpp-007',
      'swift-005', 'swift-009',
      'scala-008',
      'kotlin-006',
      'ruby-005', 'ruby-007',
    ],
  },
  {
    id: 'advanced',
    name: 'Avancado',
    description: 'Patterns idiomaticos, async, generics avancados, macros',
    snippetIds: [
      'js-007',
      'ts-007', 'ts-008',
      'py-008', 'py-010',
      'rs-008', 'rs-010',
      'go-004', 'go-005', 'go-010',
      'java-008', 'java-010',
      'cpp-009', 'cpp-010',
      'bash-010',
      'css-007',
      'sql-005',
      'kotlin-009',
      'scala-010',
      'lua-008',
      'swift-010',
    ],
  },

  // ── New focused tracks ────────────────────────────────────────────────────
  {
    id: 'web',
    name: 'Web Frontend',
    description: 'HTML, CSS e JavaScript/TypeScript para desenvolvimento web',
    snippetIds: [
      'html-001', 'html-002', 'html-003', 'html-005', 'html-006',
      'css-001', 'css-002', 'css-003', 'css-004', 'css-005',
      'js-001', 'js-002', 'js-006', 'js-009',
      'ts-001', 'ts-002', 'ts-003',
    ],
  },
  {
    id: 'scripting',
    name: 'Scripting',
    description: 'Bash, Python, Ruby e Lua: linguagens de script e automacao',
    snippetIds: [
      'bash-001', 'bash-002', 'bash-003', 'bash-005', 'bash-006', 'bash-007',
      'py-003', 'py-004', 'py-005', 'py-007',
      'ruby-001', 'ruby-003', 'ruby-006', 'ruby-009',
      'lua-001', 'lua-003', 'lua-006',
    ],
  },
  {
    id: 'mobile',
    name: 'Mobile',
    description: 'Swift (iOS) e Kotlin (Android): padrao mobile moderno',
    snippetIds: [
      'swift-001', 'swift-002', 'swift-003', 'swift-004', 'swift-005',
      'swift-006', 'swift-007', 'swift-008', 'swift-009', 'swift-010',
      'kotlin-001', 'kotlin-002', 'kotlin-003', 'kotlin-004', 'kotlin-005',
      'kotlin-006', 'kotlin-007', 'kotlin-008', 'kotlin-009', 'kotlin-010',
    ],
  },
  {
    id: 'functional',
    name: 'Programacao Funcional',
    description: 'Pattern matching, monads, closures e imutabilidade',
    snippetIds: [
      'scala-005', 'scala-006', 'scala-007', 'scala-009',
      'rs-003', 'rs-004', 'rs-005', 'rs-008',
      'kotlin-007', 'kotlin-010',
      'swift-007', 'swift-008',
      'js-005', 'js-006', 'js-007',
      'py-003', 'py-010',
    ],
  },
  {
    id: 'concurrency',
    name: 'Concorrencia e Async',
    description: 'Goroutines, coroutines, promises, async/await e channels',
    snippetIds: [
      'go-004', 'go-005', 'go-007',
      'kotlin-009',
      'swift-010',
      'js-004', 'js-005',
      'rs-008',
      'java-004', 'java-008',
      'py-008',
    ],
  },
  {
    id: 'devops',
    name: 'DevOps',
    description: 'Docker, Linux, Git e Bash para infra e automacao de deploys',
    snippetIds: [
      'docker-001', 'docker-002', 'docker-003', 'docker-004', 'docker-005',
      'linux-004', 'linux-005', 'linux-006', 'linux-007', 'linux-008',
      'git-001', 'git-004', 'git-005', 'git-006',
      'bash-006', 'bash-007',
    ],
  },
  {
    id: 'database',
    name: 'Banco de Dados',
    description: 'SQL completo: SELECT, JOIN, agregacoes, CTEs e window functions',
    snippetIds: [
      'sql-001', 'sql-002', 'sql-003', 'sql-004', 'sql-005',
      'sql-006', 'sql-007', 'sql-008', 'sql-009', 'sql-010',
    ],
  },
  {
    id: 'strings',
    name: 'Strings e Texto',
    description: 'Interpolacao, formatacao e manipulacao de strings em multiplas linguagens',
    snippetIds: [
      'py-007',
      'ruby-002',
      'scala-003',
      'swift-002',
      'kotlin-003',
      'lua-004',
      'js-003', 'js-008',
      'bash-001',
      'cpp-005',
      'linux-009',
    ],
  },

  // ── Dedicated language tracks ─────────────────────────────────────────────
  {
    id: 'git',
    name: 'Git',
    description: 'Controle de versao: commits, branches, merge, rebase e workflows',
    snippetIds: [
      'git-001', 'git-002', 'git-003', 'git-004', 'git-005',
      'git-006', 'git-007', 'git-008', 'git-009', 'git-010',
    ],
  },
  {
    id: 'linux',
    name: 'Linux CLI',
    description: 'Comandos essenciais do terminal: arquivos, processos, rede e texto',
    snippetIds: [
      'linux-001', 'linux-002', 'linux-003', 'linux-004', 'linux-005',
      'linux-006', 'linux-007', 'linux-008', 'linux-009', 'linux-010',
    ],
  },
  {
    id: 'docker',
    name: 'Docker',
    description: 'Containers: Dockerfile, imagens, volumes e multi-stage builds',
    snippetIds: [
      'docker-001', 'docker-002', 'docker-003', 'docker-004', 'docker-005',
      'docker-006', 'docker-007', 'docker-008', 'docker-009', 'docker-010',
    ],
  },

  // ── Idiomas ─────────────────────────────────────────────────────────────
  {
    id: 'idioma-iniciante',
    name: 'Idiomas — Iniciante',
    description: 'Frases curtas e vocabulario basico para comecar a digitar rapido',
    snippetIds: [],
    textLanguages: true,
    difficultyFilter: 'easy',
  },
  {
    id: 'idioma-medio',
    name: 'Idiomas — Medio',
    description: 'Paragrafos sobre ciencia, tecnologia e cultura para ganhar velocidade',
    snippetIds: [],
    textLanguages: true,
    difficultyFilter: 'medium',
  },
  {
    id: 'idioma-dificil',
    name: 'Idiomas — Dificil',
    description: 'Textos densos de filosofia, historia e literatura para alta precisao',
    snippetIds: [],
    textLanguages: true,
    difficultyFilter: 'hard',
  },
]

export function getTrackById(id: string): Track | undefined {
  return tracks.find(t => t.id === id)
}
