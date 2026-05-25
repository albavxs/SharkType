/**
 * Manifesto de linguagens do SharkType.
 *
 * Fonte unica de verdade para metadata (id, label, color) e referencia de modulo.
 * Para adicionar uma nova linguagem, basta adicionar uma entrada aqui — o
 * data/index.ts consome este manifesto automaticamente.
 *
 * Veja docs/contributing/CONTRIBUTING.pt-br.md para o passo a passo completo.
 */

export interface LanguageManifestEntry {
  id: string
  label: string
  color: string
  type: 'code' | 'text'
  /** Caminho relativo a este arquivo (sem extensao). Ex: './javascript' */
  module: string
  /**
   * Nome do export nomeado dentro do modulo.
   * Default: `<id>Snippets` em camelCase (ex: id 'javascript' -> 'javascriptSnippets').
   * Use quando um arquivo exporta varios arrays (ex: cybersec.ts).
   */
  exportName?: string
}

export const languageManifest: LanguageManifestEntry[] = [
  // ── Code languages ──────────────────────────────────────────────────────
  { id: 'cpp',        label: 'C++',        color: '#00599c', type: 'code', module: './cpp' },
  { id: 'javascript', label: 'JavaScript', color: '#f7df1e', type: 'code', module: './javascript' },
  { id: 'typescript', label: 'TypeScript', color: '#3178c6', type: 'code', module: './typescript' },
  { id: 'python',     label: 'Python',     color: '#3776ab', type: 'code', module: './python' },
  { id: 'rust',       label: 'Rust',       color: '#ce422b', type: 'code', module: './rust' },
  { id: 'go',         label: 'Go',         color: '#00add8', type: 'code', module: './go' },
  { id: 'java',       label: 'Java',       color: '#e76f00', type: 'code', module: './java' },
  { id: 'kotlin',     label: 'Kotlin',     color: '#7f52ff', type: 'code', module: './kotlin' },
  { id: 'scala',      label: 'Scala',      color: '#dc322f', type: 'code', module: './scala' },
  { id: 'swift',      label: 'Swift',      color: '#f05138', type: 'code', module: './swift' },
  { id: 'ruby',       label: 'Ruby',       color: '#cc342d', type: 'code', module: './ruby' },
  { id: 'lua',        label: 'Lua',        color: '#000080', type: 'code', module: './lua' },
  { id: 'html',       label: 'HTML',       color: '#e34c26', type: 'code', module: './html' },
  { id: 'css',        label: 'CSS',        color: '#264de4', type: 'code', module: './css' },
  { id: 'sql',        label: 'SQL',        color: '#336791', type: 'code', module: './sql' },
  { id: 'bash',       label: 'Bash',       color: '#4eaa25', type: 'code', module: './bash' },
  { id: 'docker',     label: 'Docker',     color: '#2496ed', type: 'code', module: './docker' },
  { id: 'git',        label: 'Git',        color: '#f05032', type: 'code', module: './git' },
  { id: 'linux',      label: 'Linux',      color: '#fcc624', type: 'code', module: './linux' },
  { id: 'kubernetes', label: 'Kubernetes', color: '#326ce5', type: 'code', module: './kubernetes' },
  { id: 'terraform',  label: 'Terraform',  color: '#7b42bc', type: 'code', module: './terraform' },
  { id: 'ansible',    label: 'Ansible',    color: '#ee0000', type: 'code', module: './ansible' },
  { id: 'cicd',       label: 'CI/CD',      color: '#fc6d26', type: 'code', module: './cicd' },

  // ── Cybersec (multi-export em data/cybersec.ts) ─────────────────────────
  { id: 'nmap',             label: 'Nmap',             color: '#4682b4', type: 'code', module: './cybersec', exportName: 'nmapSnippets' },
  { id: 'web-recon',        label: 'Web Recon',        color: '#00d4aa', type: 'code', module: './cybersec', exportName: 'webReconSnippets' },
  { id: 'firewall',         label: 'Firewall',         color: '#ff6347', type: 'code', module: './cybersec', exportName: 'firewallSnippets' },
  { id: 'network-analysis', label: 'Network Analysis', color: '#20b2aa', type: 'code', module: './cybersec', exportName: 'networkAnalysisSnippets' },
  { id: 'hardening',        label: 'Hardening',        color: '#daa520', type: 'code', module: './cybersec', exportName: 'hardeningSnippets' },
  { id: 'crypto',           label: 'Cryptography',     color: '#9370db', type: 'code', module: './cybersec', exportName: 'cryptoSnippets' },

  // ── Frameworks & tooling ────────────────────────────────────────────────
  { id: 'vue',        label: 'Vue.js',          color: '#42b883', type: 'code', module: './vue' },
  { id: 'react',      label: 'React',           color: '#61dafb', type: 'code', module: './react' },
  { id: 'nodejs',     label: 'Node.js',         color: '#339933', type: 'code', module: './nodejs' },
  { id: 'testing',    label: 'Testing',         color: '#22c55e', type: 'code', module: './testing' },
  { id: 'patterns',   label: 'Design Patterns', color: '#8b5cf6', type: 'code', module: './patterns' },
  { id: 'algorithms', label: 'Algorithms',      color: '#f7df1e', type: 'code', module: './algorithms' },
  { id: 'mongodb',    label: 'MongoDB',         color: '#47a248', type: 'code', module: './mongodb' },
  { id: 'jinja',      label: 'Jinja',           color: '#b41717', type: 'code', module: './jinja' },
  { id: 'nextjs',     label: 'Next.js',         color: '#b0b0b0', type: 'code', module: './nextjs' },
  { id: 'angular',    label: 'Angular',         color: '#dd0031', type: 'code', module: './angular' },

  // ── Text languages ──────────────────────────────────────────────────────
  { id: 'text-typing', label: 'Digitacao', color: '#10b981', type: 'text', module: './text-typing', exportName: 'typingSnippets' },
  { id: 'text-ptbr',   label: 'Portugues', color: '#009739', type: 'text', module: './text-ptbr',   exportName: 'ptbrSnippets' },
  { id: 'text-en',     label: 'English',   color: '#3c3b6e', type: 'text', module: './text-en',     exportName: 'enSnippets' },
  { id: 'text-es',     label: 'Espanol',   color: '#c60b1e', type: 'text', module: './text-es',     exportName: 'esSnippets' },
  { id: 'text-fr',     label: 'Francais',  color: '#002395', type: 'text', module: './text-fr',     exportName: 'frSnippets' },
]
