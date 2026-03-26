import { Difficulty, I18nString } from '@/lib/types'

export interface Track {
  id: string
  name: I18nString
  description: I18nString
  snippetIds: string[]
  textLanguages?: true
  difficultyFilter?: Difficulty
}

export const tracks: Track[] = [
  // ── Concept tracks ──────────────────────────────────────────────────────
  {
    id: 'variables',
    name: { pt: 'Variáveis', en: 'Variables' },
    description: {
      pt: 'Declaração e uso de variáveis, constantes e tipos básicos',
      en: 'Declaring and using variables, constants, and basic types',
    },
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
    name: { pt: 'Funções', en: 'Functions' },
    description: {
      pt: 'Funções, arrow functions, lambdas, closures e callbacks',
      en: 'Functions, arrow functions, lambdas, closures, and callbacks',
    },
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
    name: { pt: 'Objetos e Structs', en: 'Objects & Structs' },
    description: {
      pt: 'Objetos, structs, classes, interfaces e tipos compostos',
      en: 'Objects, structs, classes, interfaces, and composite types',
    },
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
    name: { pt: 'Loops e Iteração', en: 'Loops & Iteration' },
    description: {
      pt: 'For, while, iteradores, map, filter e array methods',
      en: 'For, while, iterators, map, filter, and array methods',
    },
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
    name: { pt: 'Sistema de Tipos', en: 'Type System' },
    description: {
      pt: 'Generics, type narrowing, utility types e type guards',
      en: 'Generics, type narrowing, utility types, and type guards',
    },
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
    name: { pt: 'Tratamento de Erros', en: 'Error Handling' },
    description: {
      pt: 'Try/catch, Result, Option e patterns de tratamento de erros',
      en: 'Try/catch, Result, Option, and error handling patterns',
    },
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
    name: { pt: 'Classes e OOP', en: 'Classes & OOP' },
    description: {
      pt: 'Classes, herança, interfaces e impl blocks',
      en: 'Classes, inheritance, interfaces, and impl blocks',
    },
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
    name: { pt: 'Avançado', en: 'Advanced' },
    description: {
      pt: 'Patterns idiomáticos, async, generics avançados e macros',
      en: 'Idiomatic patterns, async, advanced generics, and macros',
    },
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

  // ── Focused tracks ──────────────────────────────────────────────────────
  {
    id: 'web',
    name: { pt: 'Web Frontend', en: 'Web Frontend' },
    description: {
      pt: 'HTML, CSS e JavaScript/TypeScript pra desenvolvimento web',
      en: 'HTML, CSS, and JavaScript/TypeScript for web development',
    },
    snippetIds: [
      'html-001', 'html-002', 'html-003', 'html-005', 'html-006',
      'css-001', 'css-002', 'css-003', 'css-004', 'css-005',
      'js-001', 'js-002', 'js-006', 'js-009',
      'ts-001', 'ts-002', 'ts-003',
    ],
  },
  {
    id: 'scripting',
    name: { pt: 'Scripting', en: 'Scripting' },
    description: {
      pt: 'Bash, Python, Ruby e Lua: linguagens de script e automação',
      en: 'Bash, Python, Ruby, and Lua: scripting and automation languages',
    },
    snippetIds: [
      'bash-001', 'bash-002', 'bash-003', 'bash-005', 'bash-006', 'bash-007',
      'py-003', 'py-004', 'py-005', 'py-007',
      'ruby-001', 'ruby-003', 'ruby-006', 'ruby-009',
      'lua-001', 'lua-003', 'lua-006',
    ],
  },
  {
    id: 'mobile',
    name: { pt: 'Mobile', en: 'Mobile' },
    description: {
      pt: 'Swift (iOS) e Kotlin (Android): padrão mobile moderno',
      en: 'Swift (iOS) and Kotlin (Android): modern mobile development',
    },
    snippetIds: [
      'swift-001', 'swift-002', 'swift-003', 'swift-004', 'swift-005',
      'swift-006', 'swift-007', 'swift-008', 'swift-009', 'swift-010',
      'kotlin-001', 'kotlin-002', 'kotlin-003', 'kotlin-004', 'kotlin-005',
      'kotlin-006', 'kotlin-007', 'kotlin-008', 'kotlin-009', 'kotlin-010',
    ],
  },
  {
    id: 'functional',
    name: { pt: 'Programação Funcional', en: 'Functional Programming' },
    description: {
      pt: 'Pattern matching, monads, closures e imutabilidade',
      en: 'Pattern matching, monads, closures, and immutability',
    },
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
    name: { pt: 'Concorrência e Async', en: 'Concurrency & Async' },
    description: {
      pt: 'Goroutines, coroutines, promises, async/await e channels',
      en: 'Goroutines, coroutines, promises, async/await, and channels',
    },
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
    name: { pt: 'DevOps', en: 'DevOps' },
    description: {
      pt: 'Docker, Kubernetes, Terraform, Ansible e CI/CD pra infra e automação',
      en: 'Docker, Kubernetes, Terraform, Ansible, and CI/CD for infrastructure and automation',
    },
    snippetIds: [
      'docker-001', 'docker-002', 'docker-003', 'docker-004', 'docker-005',
      'k8s-001', 'k8s-002', 'k8s-003', 'k8s-004', 'k8s-005', 'k8s-006',
      'tf-001', 'tf-002', 'tf-003', 'tf-004',
      'ans-001', 'ans-002', 'ans-003',
      'cicd-001', 'cicd-002',
      'linux-004', 'linux-005', 'linux-006', 'linux-007', 'linux-008',
      'git-001', 'git-004', 'git-005', 'git-006',
      'bash-006', 'bash-007',
    ],
  },
  {
    id: 'database',
    name: { pt: 'Banco de Dados', en: 'Database' },
    description: {
      pt: 'SQL completo: SELECT, JOIN, agregações, CTEs e window functions',
      en: 'Full SQL: SELECT, JOIN, aggregations, CTEs, and window functions',
    },
    snippetIds: [
      'sql-001', 'sql-002', 'sql-003', 'sql-004', 'sql-005',
      'sql-006', 'sql-007', 'sql-008', 'sql-009', 'sql-010',
    ],
  },
  {
    id: 'strings',
    name: { pt: 'Strings e Texto', en: 'Strings & Text' },
    description: {
      pt: 'Interpolação, formatação e manipulação de strings em várias linguagens',
      en: 'Interpolation, formatting, and string manipulation across languages',
    },
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

  // ── Dedicated language tracks ───────────────────────────────────────────
  {
    id: 'git',
    name: { pt: 'Git', en: 'Git' },
    description: {
      pt: 'Controle de versão: commits, branches, merge, rebase e workflows',
      en: 'Version control: commits, branches, merge, rebase, and workflows',
    },
    snippetIds: [
      'git-001', 'git-002', 'git-003', 'git-004', 'git-005',
      'git-006', 'git-007', 'git-008', 'git-009', 'git-010',
      'git-011', 'git-012', 'git-013', 'git-014', 'git-015',
      'git-016', 'git-017', 'git-018', 'git-019', 'git-020',
    ],
  },
  {
    id: 'linux',
    name: { pt: 'Linux CLI', en: 'Linux CLI' },
    description: {
      pt: 'Comandos essenciais do terminal: arquivos, processos, rede e texto',
      en: 'Essential terminal commands: files, processes, networking, and text',
    },
    snippetIds: [
      'linux-001', 'linux-002', 'linux-003', 'linux-004', 'linux-005',
      'linux-006', 'linux-007', 'linux-008', 'linux-009', 'linux-010',
      'linux-011', 'linux-012', 'linux-013', 'linux-014', 'linux-015',
      'linux-016', 'linux-017',
    ],
  },
  {
    id: 'docker',
    name: { pt: 'Docker', en: 'Docker' },
    description: {
      pt: 'Containers: Dockerfile, imagens, volumes e multi-stage builds',
      en: 'Containers: Dockerfile, images, volumes, and multi-stage builds',
    },
    snippetIds: [
      'docker-001', 'docker-002', 'docker-003', 'docker-004', 'docker-005',
      'docker-006', 'docker-007', 'docker-008', 'docker-009', 'docker-010',
    ],
  },
  {
    id: 'red-team',
    name: { pt: 'Red Team', en: 'Red Team' },
    description: {
      pt: 'Reconhecimento, scanning e enumeração — Nmap, curl, whois, dig',
      en: 'Reconnaissance, scanning, and enumeration — Nmap, curl, whois, dig',
    },
    snippetIds: [
      'sec-001', 'sec-002', 'sec-003', 'sec-004', 'sec-005', 'sec-006',
      'sec-017', 'sec-018',
    ],
  },
  {
    id: 'blue-team',
    name: { pt: 'Blue Team', en: 'Blue Team' },
    description: {
      pt: 'Defesa, firewalls, monitoramento de rede e hardening de sistemas',
      en: 'Defense, firewalls, network monitoring, and system hardening',
    },
    snippetIds: [
      'sec-007', 'sec-008', 'sec-009', 'sec-010',
      'sec-014', 'sec-015', 'sec-016',
    ],
  },
  {
    id: 'crypto',
    name: { pt: 'Criptografia', en: 'Cryptography' },
    description: {
      pt: 'OpenSSL, certificados, chaves SSH e cadeia de confiança',
      en: 'OpenSSL, certificates, SSH keys, and trust chains',
    },
    snippetIds: [
      'sec-011', 'sec-012', 'sec-013',
    ],
  },

  // ── Language tracks (text typing) ───────────────────────────────────────
  {
    id: 'idioma-iniciante',
    name: { pt: 'Idiomas — Iniciante', en: 'Languages — Beginner' },
    description: {
      pt: 'Frases curtas e vocabulário básico pra começar a digitar rápido',
      en: 'Short phrases and basic vocabulary to get you typing fast',
    },
    snippetIds: [],
    textLanguages: true,
    difficultyFilter: 'easy',
  },
  {
    id: 'idioma-medio',
    name: { pt: 'Idiomas — Médio', en: 'Languages — Intermediate' },
    description: {
      pt: 'Parágrafos sobre ciência, tecnologia e cultura pra ganhar velocidade',
      en: 'Paragraphs on science, tech, and culture to build your speed',
    },
    snippetIds: [],
    textLanguages: true,
    difficultyFilter: 'medium',
  },
  {
    id: 'idioma-dificil',
    name: { pt: 'Idiomas — Difícil', en: 'Languages — Hard' },
    description: {
      pt: 'Textos densos de filosofia, história e literatura pra alta precisão',
      en: 'Dense philosophy, history, and literature texts for high precision',
    },
    snippetIds: [],
    textLanguages: true,
    difficultyFilter: 'hard',
  },
]

export function getTrackById(id: string): Track | undefined {
  return tracks.find(t => t.id === id)
}
