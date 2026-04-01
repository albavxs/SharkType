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
  // ── Concept tracks -- Iniciante ───────────────────────────────────────────
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
  // ── Concept tracks -- Intermediário ──────────────────────────────────────
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
  // ── Concept tracks -- Avançado ───────────────────────────────────────────
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
      'k8s-007', 'k8s-008', 'k8s-009', 'k8s-010', 'k8s-011', 'k8s-012',
      'tf-001', 'tf-002', 'tf-003', 'tf-004', 'tf-005', 'tf-006',
      'tf-007', 'tf-008', 'tf-009', 'tf-010', 'tf-011', 'tf-012',
      'ans-001', 'ans-002', 'ans-003', 'ans-004', 'ans-005', 'ans-006',
      'ans-007', 'ans-008', 'ans-009', 'ans-010', 'ans-011', 'ans-012',
      'cicd-001', 'cicd-002', 'cicd-003', 'cicd-004', 'cicd-005',
      'cicd-006', 'cicd-007', 'cicd-008', 'cicd-009', 'cicd-010',
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
      pt: 'SQL e MongoDB: SELECT, JOIN, agregações, pipelines e Mongoose',
      en: 'SQL and MongoDB: SELECT, JOIN, aggregations, pipelines, and Mongoose',
    },
    snippetIds: [
      'sql-001', 'sql-002', 'sql-003', 'sql-004', 'sql-005',
      'sql-006', 'sql-007', 'sql-008', 'sql-009', 'sql-010',
      'mongo-001', 'mongo-002', 'mongo-003', 'mongo-004', 'mongo-005',
      'mongo-006', 'mongo-007', 'mongo-008', 'mongo-009', 'mongo-010',
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
      pt: 'Reconhecimento, scanning e enumeração -- Nmap, curl, whois, dig',
      en: 'Reconnaissance, scanning, and enumeration -- Nmap, curl, whois, dig',
    },
    snippetIds: [
      'sec-001', 'sec-002', 'sec-003', 'sec-004', 'sec-005', 'sec-006',
      'sec-017', 'sec-018', 'sec-019', 'sec-020', 'sec-021',
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
      'sec-007', 'sec-008', 'sec-022', 'sec-023', 'sec-024',
      'sec-009', 'sec-010', 'sec-025', 'sec-026', 'sec-027',
      'sec-014', 'sec-015', 'sec-016', 'sec-028', 'sec-029', 'sec-030',
    ],
    section: 'cyberdevops',
  },
  {
    id: 'crypto',
    name: { pt: 'Criptografia', en: 'Cryptography' },
    description: {
      pt: 'OpenSSL, certificados, chaves SSH, hashing e criptografia de arquivos',
      en: 'OpenSSL, certificates, SSH keys, hashing, and file encryption',
    },
    snippetIds: [
      'sec-011', 'sec-012', 'sec-013', 'sec-031', 'sec-032', 'sec-033',
    ],
    section: 'cyberdevops',
  },

  // ── Frontend & Frameworks ────────────────────────────────────────────────
  {
    id: 'react',
    name: { pt: 'React', en: 'React' },
    description: {
      pt: 'Hooks, contexto, memoização, custom hooks e error boundaries',
      en: 'Hooks, context, memoization, custom hooks, and error boundaries',
    },
    snippetIds: [
      'react-001', 'react-002', 'react-003', 'react-004', 'react-005',
      'react-006', 'react-007', 'react-008', 'react-009', 'react-010',
      'react-011', 'react-012',
    ],
    section: 'focused',
  },
  {
    id: 'vue',
    name: { pt: 'Vue.js', en: 'Vue.js' },
    description: {
      pt: 'Composition API, reatividade, diretivas, Pinia e Vue Router',
      en: 'Composition API, reactivity, directives, Pinia, and Vue Router',
    },
    snippetIds: [
      'vue-001', 'vue-002', 'vue-003', 'vue-004', 'vue-005',
      'vue-006', 'vue-007', 'vue-008', 'vue-009', 'vue-010',
      'vue-011', 'vue-012',
    ],
    section: 'focused',
  },
  {
    id: 'nodejs',
    name: { pt: 'Node.js', en: 'Node.js' },
    description: {
      pt: 'APIs REST, Express, Fastify, middleware e streams',
      en: 'REST APIs, Express, Fastify, middleware, and streams',
    },
    snippetIds: [
      'node-001', 'node-002', 'node-003', 'node-004', 'node-005',
      'node-006', 'node-007', 'node-008', 'node-009', 'node-010',
    ],
    section: 'focused',
  },
  {
    id: 'nextjs',
    name: { pt: 'Next.js', en: 'Next.js' },
    description: {
      pt: 'App Router, Server Components, Server Actions, cache e middleware',
      en: 'App Router, Server Components, Server Actions, caching, and middleware',
    },
    snippetIds: [
      'next-001', 'next-002', 'next-003', 'next-004', 'next-005',
      'next-006', 'next-007', 'next-008', 'next-009', 'next-010',
      'next-011', 'next-012',
    ],
    section: 'focused',
  },
  {
    id: 'dom',
    name: { pt: 'DOM & Web APIs', en: 'DOM & Web APIs' },
    description: {
      pt: 'Manipulação de DOM, eventos, fetch e Web APIs do navegador',
      en: 'DOM manipulation, events, fetch, and browser Web APIs',
    },
    snippetIds: [
      'js-037', 'js-038', 'js-039', 'js-040', 'js-041',
      'js-042', 'js-043', 'js-044', 'js-045', 'js-046',
    ],
    section: 'focused',
  },
  {
    id: 'templates',
    name: { pt: 'Template Engines', en: 'Template Engines' },
    description: {
      pt: 'Jinja, herança de templates e sistemas de template server-side',
      en: 'Jinja, template inheritance, and server-side template systems',
    },
    snippetIds: [
      'jinja-001', 'jinja-002', 'jinja-003', 'jinja-004', 'jinja-005',
      'jinja-006', 'jinja-007', 'jinja-008', 'jinja-009', 'jinja-010',
    ],
    section: 'focused',
  },
  // ── Engenharia de Software ──────────────────────────────────────────────
  {
    id: 'design-patterns',
    name: { pt: 'Design Patterns & SOLID', en: 'Design Patterns & SOLID' },
    description: {
      pt: 'SOLID, DRY, Clean Code e padrões de projeto com exemplos em JS/TS',
      en: 'SOLID, DRY, Clean Code, and design patterns with JS/TS examples',
    },
    snippetIds: [
      'pat-001', 'pat-002', 'pat-003', 'pat-004', 'pat-005',
      'pat-006', 'pat-007', 'pat-008', 'pat-009', 'pat-010',
      'pat-011', 'pat-012',
    ],
    section: 'focused',
  },
  {
    id: 'algorithms',
    name: { pt: 'Algoritmos & Estruturas de Dados', en: 'Algorithms & Data Structures' },
    description: {
      pt: 'Big O, ordenação, busca, árvores, grafos e estruturas de dados',
      en: 'Big O, sorting, searching, trees, graphs, and data structures',
    },
    snippetIds: [
      'algo-001', 'algo-002', 'algo-003', 'algo-004', 'algo-005',
      'algo-006', 'algo-007', 'algo-008', 'algo-009', 'algo-010',
      'algo-011', 'algo-012',
      'py-040', 'py-041', 'py-042', 'py-043', 'py-044', 'py-045',
      'py-046', 'py-047', 'py-048', 'py-049', 'py-050', 'py-051',
      'ts-044', 'ts-045', 'ts-046', 'ts-047', 'ts-048', 'ts-049',
      'ts-050', 'ts-051', 'ts-052', 'ts-053', 'ts-054', 'ts-055',
      'go-042', 'go-043', 'go-044', 'go-045', 'go-046', 'go-047',
      'go-048', 'go-049', 'go-050', 'go-051', 'go-052', 'go-053',
      'java-042', 'java-043', 'java-044', 'java-045', 'java-046', 'java-047',
      'java-048', 'java-049', 'java-050', 'java-051', 'java-052', 'java-053',
      'cpp-042', 'cpp-043', 'cpp-044', 'cpp-045', 'cpp-046', 'cpp-047',
      'cpp-048', 'cpp-049', 'cpp-050', 'cpp-051', 'cpp-052', 'cpp-053',
      'rs-044', 'rs-045', 'rs-046', 'rs-047', 'rs-048', 'rs-049',
      'rs-050', 'rs-051', 'rs-052', 'rs-053', 'rs-054', 'rs-055',
      'kotlin-043', 'kotlin-044', 'kotlin-045', 'kotlin-046', 'kotlin-047', 'kotlin-048',
      'kotlin-049', 'kotlin-050', 'kotlin-051', 'kotlin-052', 'kotlin-053', 'kotlin-054',
      'ruby-042', 'ruby-043', 'ruby-044', 'ruby-045', 'ruby-046', 'ruby-047',
      'ruby-048', 'ruby-049', 'ruby-050', 'ruby-051', 'ruby-052', 'ruby-053',
      'scala-042', 'scala-043', 'scala-044', 'scala-045', 'scala-046', 'scala-047',
      'scala-048', 'scala-049', 'scala-050', 'scala-051', 'scala-052', 'scala-053',
      'swift-042', 'swift-043', 'swift-044', 'swift-045', 'swift-046', 'swift-047',
      'swift-048', 'swift-049', 'swift-050', 'swift-051', 'swift-052', 'swift-053',
    ],
    section: 'focused',
  },
  {
    id: 'testing',
    name: { pt: 'Testes', en: 'Testing' },
    description: {
      pt: 'Unit, integração, e2e e TDD com Jest, Vitest, Cypress e Testing Library',
      en: 'Unit, integration, e2e, and TDD with Jest, Vitest, Cypress, and Testing Library',
    },
    snippetIds: [
      'test-001', 'test-002', 'test-003', 'test-004', 'test-005',
      'test-006', 'test-007', 'test-008', 'test-009', 'test-010',
    ],
    section: 'focused',
  },
  {
    id: 'backend',
    name: { pt: 'Backend Basics', en: 'Backend Basics' },
    description: {
      pt: 'Async, concorrência e padrões de servidor em Python, Go, Java e Ruby',
      en: 'Async, concurrency, and server patterns in Python, Go, Java, and Ruby',
    },
    snippetIds: [
      'py-004', 'py-038', 'py-039',
      'go-006', 'go-007', 'go-040', 'go-041',
      'java-004', 'java-006', 'java-039', 'java-041',
      'ruby-006', 'ruby-007', 'ruby-031', 'ruby-035',
    ],
    section: 'focused',
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
