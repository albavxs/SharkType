import { Language } from '@/lib/types'
import { javascriptSnippets } from './javascript'
import { typescriptSnippets } from './typescript'
import { pythonSnippets } from './python'
import { rustSnippets } from './rust'
import { goSnippets } from './go'
import { javaSnippets } from './java'
import { sqlSnippets } from './sql'
import { bashSnippets } from './bash'
import { cssSnippets } from './css'
import { cppSnippets } from './cpp'
import { swiftSnippets } from './swift'
import { scalaSnippets } from './scala'
import { rubySnippets } from './ruby'
import { luaSnippets } from './lua'
import { htmlSnippets } from './html'
import { kotlinSnippets } from './kotlin'
import { dockerSnippets } from './docker'
import { gitSnippets } from './git'
import { linuxSnippets } from './linux'
import { kubernetesSnippets } from './kubernetes'
import { terraformSnippets } from './terraform'
import { ansibleSnippets } from './ansible'
import { cicdSnippets } from './cicd'
import { nmapSnippets, webReconSnippets, firewallSnippets, networkAnalysisSnippets, hardeningSnippets, cryptoSnippets } from './cybersec'
import { typingSnippets } from './text-typing'
import { ptbrSnippets } from './text-ptbr'
import { enSnippets } from './text-en'
import { esSnippets } from './text-es'
import { frSnippets } from './text-fr'

export const codeLanguages: Language[] = [
  { id: 'cpp',        label: 'C++',        color: '#00599c', snippets: cppSnippets },
  { id: 'javascript', label: 'JavaScript', color: '#f7df1e', snippets: javascriptSnippets },
  { id: 'typescript', label: 'TypeScript', color: '#3178c6', snippets: typescriptSnippets },
  { id: 'python',     label: 'Python',     color: '#3776ab', snippets: pythonSnippets },
  { id: 'rust',       label: 'Rust',       color: '#ce422b', snippets: rustSnippets },
  { id: 'go',         label: 'Go',         color: '#00add8', snippets: goSnippets },
  { id: 'java',       label: 'Java',       color: '#e76f00', snippets: javaSnippets },
  { id: 'kotlin',     label: 'Kotlin',     color: '#7f52ff', snippets: kotlinSnippets },
  { id: 'scala',      label: 'Scala',      color: '#dc322f', snippets: scalaSnippets },
  { id: 'swift',      label: 'Swift',      color: '#f05138', snippets: swiftSnippets },
  { id: 'ruby',       label: 'Ruby',       color: '#cc342d', snippets: rubySnippets },
  { id: 'lua',        label: 'Lua',        color: '#000080', snippets: luaSnippets },
  { id: 'html',       label: 'HTML',       color: '#e34c26', snippets: htmlSnippets },
  { id: 'css',        label: 'CSS',        color: '#264de4', snippets: cssSnippets },
  { id: 'sql',        label: 'SQL',        color: '#336791', snippets: sqlSnippets },
  { id: 'bash',       label: 'Bash',       color: '#4eaa25', snippets: bashSnippets },
  { id: 'docker',     label: 'Docker',     color: '#2496ed', snippets: dockerSnippets },
  { id: 'git',        label: 'Git',        color: '#f05032', snippets: gitSnippets },
  { id: 'linux',      label: 'Linux',      color: '#fcc624', snippets: linuxSnippets },
  { id: 'kubernetes', label: 'Kubernetes', color: '#326ce5', snippets: kubernetesSnippets },
  { id: 'terraform',  label: 'Terraform',  color: '#7b42bc', snippets: terraformSnippets },
  { id: 'ansible',    label: 'Ansible',    color: '#ee0000', snippets: ansibleSnippets },
  { id: 'cicd',       label: 'CI/CD',      color: '#fc6d26', snippets: cicdSnippets },
  { id: 'nmap',             label: 'Nmap',             color: '#4682b4', snippets: nmapSnippets },
  { id: 'web-recon',        label: 'Web Recon',        color: '#00d4aa', snippets: webReconSnippets },
  { id: 'firewall',         label: 'Firewall',         color: '#ff6347', snippets: firewallSnippets },
  { id: 'network-analysis', label: 'Network Analysis', color: '#20b2aa', snippets: networkAnalysisSnippets },
  { id: 'hardening',        label: 'Hardening',        color: '#daa520', snippets: hardeningSnippets },
  { id: 'crypto',           label: 'Cryptography',     color: '#9370db', snippets: cryptoSnippets },
]

export const textLanguages: Language[] = [
  { id: 'text-typing', label: 'Digitacao', color: '#10b981', snippets: typingSnippets },
  { id: 'text-ptbr', label: 'Portugues', color: '#009739', snippets: ptbrSnippets },
  { id: 'text-en',   label: 'English',   color: '#3c3b6e', snippets: enSnippets },
  { id: 'text-es',   label: 'Espanol',   color: '#c60b1e', snippets: esSnippets },
  { id: 'text-fr',   label: 'Francais',  color: '#002395', snippets: frSnippets },
]

export const languages: Language[] = [...codeLanguages, ...textLanguages]

export function getLanguageById(id: string): Language | undefined {
  return languages.find(l => l.id === id)
}
