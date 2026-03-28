import { Difficulty, I18nString } from '@/lib/types'

export type TrackSection = 'concept' | 'focused' | 'cyberdevops'

export interface Track {
  id: string
  name: I18nString
  description: I18nString
  snippetIds: string[]
  slots?: string[]
  textLanguages?: true
  difficultyFilter?: Difficulty
  section?: TrackSection
}

export const tracks: Track[] = [
  // ── Concept tracks — Iniciante ───────────────────────────────────────────
  {
    id: 'conditionals',
    name: { pt: 'If e Else', en: 'If & Else' },
    description: {
      pt: 'Condicionais, operadores ternários, casamento de padrões e controle de fluxo',
      en: 'Conditionals, ternary operators, pattern matching, and flow control',
    },
    snippetIds: [],
    slots: ['cond-basic-if', 'cond-if-else', 'cond-ternary', 'cond-switch', 'cond-guard'],
    section: 'concept',
  },
  {
    id: 'variables',
    name: { pt: 'Variáveis', en: 'Variables' },
    description: {
      pt: 'Declaração e uso de variáveis, constantes e tipos básicos',
      en: 'Declaring and using variables, constants, and basic types',
    },
    snippetIds: [],
    slots: ['var-declare', 'var-const', 'var-types', 'var-interpolation', 'var-array', 'var-destructure'],
    section: 'concept',
  },
  {
    id: 'functions',
    name: { pt: 'Funções', en: 'Functions' },
    description: {
      pt: 'Funções, arrow functions, lambdas, closures e callbacks',
      en: 'Functions, arrow functions, lambdas, closures, and callbacks',
    },
    snippetIds: [],
    slots: ['fn-basic', 'fn-arrow', 'fn-callback', 'fn-closure', 'fn-default-params'],
    section: 'concept',
  },
  // ── Concept tracks — Intermediário ──────────────────────────────────────
  {
    id: 'objects',
    name: { pt: 'Objetos e Structs', en: 'Objects & Structs' },
    description: {
      pt: 'Objetos, structs, classes, interfaces e tipos compostos',
      en: 'Objects, structs, classes, interfaces, and composite types',
    },
    snippetIds: [],
    slots: ['obj-create', 'obj-methods', 'obj-interface', 'obj-nested'],
    section: 'concept',
  },
  {
    id: 'loops',
    name: { pt: 'Loops e Iteração', en: 'Loops & Iteration' },
    description: {
      pt: 'For, while, iteradores, map, filter e array methods',
      en: 'For, while, iterators, map, filter, and array methods',
    },
    snippetIds: [],
    slots: ['loop-for', 'loop-while', 'loop-foreach', 'loop-filter', 'loop-range'],
    section: 'concept',
  },
  {
    id: 'types',
    name: { pt: 'Sistema de Tipos', en: 'Type System' },
    description: {
      pt: 'Generics, type narrowing, utility types e type guards',
      en: 'Generics, type narrowing, utility types, and type guards',
    },
    snippetIds: [],
    slots: ['type-generic', 'type-union', 'type-constraint', 'type-utility'],
    section: 'concept',
  },
  {
    id: 'errors',
    name: { pt: 'Tratamento de Erros', en: 'Error Handling' },
    description: {
      pt: 'Try/catch, Result, Option e patterns de tratamento de erros',
      en: 'Try/catch, Result, Option, and error handling patterns',
    },
    snippetIds: [],
    slots: ['err-try-catch', 'err-custom', 'err-result', 'err-finally'],
    section: 'concept',
  },
  {
    id: 'classes',
    name: { pt: 'Classes e OOP', en: 'Classes & OOP' },
    description: {
      pt: 'Classes, herança, interfaces e impl blocks',
      en: 'Classes, inheritance, interfaces, and impl blocks',
    },
    snippetIds: [],
    slots: ['class-basic', 'class-inherit', 'class-override', 'class-abstract'],
    section: 'concept',
  },
  // ── Concept tracks — Avançado ───────────────────────────────────────────
  {
    id: 'advanced',
    name: { pt: 'Avançado', en: 'Advanced' },
    description: {
      pt: 'Patterns idiomáticos, async, generics avançados e macros',
      en: 'Idiomatic patterns, async, advanced generics, and macros',
    },
    snippetIds: [],
    slots: ['adv-async', 'adv-pattern', 'adv-macro', 'adv-concurrent'],
    section: 'concept',
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
    section: 'focused',
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
    section: 'focused',
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
    section: 'focused',
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
    section: 'focused',
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
    section: 'focused',
  },
  // ── Cybersecurity & DevOps ──────────────────────────────────────────────
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
    section: 'cyberdevops',
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
    section: 'focused',
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
    section: 'focused',
  },

  // ── Dedicated language tracks (Cyber & DevOps) ─────────────────────────
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
    section: 'cyberdevops',
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
    section: 'cyberdevops',
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
    section: 'cyberdevops',
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
    section: 'cyberdevops',
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
    section: 'cyberdevops',
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
    section: 'cyberdevops',
  },

  // ── Language tracks (text typing) ───────────────────────────────────────
  {
    id: 'comece-aqui',
    name: { pt: 'Comece Aqui', en: 'Start Here' },
    description: {
      pt: 'Aprenda a posição de cada tecla e memorize o teclado passo a passo',
      en: 'Learn key positions and memorize the keyboard step by step',
    },
    snippetIds: [
      'typing-011', 'typing-012', 'typing-013', 'typing-014',
      'typing-001', 'typing-002',
      'typing-015', 'typing-016', 'typing-017',
      'typing-003', 'typing-004', 'typing-005',
      'typing-018', 'typing-019', 'typing-020',
      'typing-006', 'typing-007', 'typing-008', 'typing-009', 'typing-010',
    ],
    textLanguages: true,
  },
  {
    id: 'idioma-iniciante',
    name: { pt: 'Iniciante', en: 'Beginner' },
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
    name: { pt: 'Intermediário', en: 'Intermediate' },
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
    name: { pt: 'Avançado', en: 'Advanced' },
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
