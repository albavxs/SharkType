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

export const languages: Language[] = [
  { id: 'javascript', label: 'JavaScript', color: '#f7df1e', snippets: javascriptSnippets },
  { id: 'typescript', label: 'TypeScript', color: '#3178c6', snippets: typescriptSnippets },
  { id: 'python', label: 'Python', color: '#3776ab', snippets: pythonSnippets },
  { id: 'rust', label: 'Rust', color: '#ce422b', snippets: rustSnippets },
  { id: 'go', label: 'Go', color: '#00add8', snippets: goSnippets },
  { id: 'java', label: 'Java', color: '#e76f00', snippets: javaSnippets },
  { id: 'sql', label: 'SQL', color: '#336791', snippets: sqlSnippets },
  { id: 'bash', label: 'Bash', color: '#4eaa25', snippets: bashSnippets },
  { id: 'css', label: 'CSS', color: '#264de4', snippets: cssSnippets },
  { id: 'cpp', label: 'C++', color: '#00599c', snippets: cppSnippets },
]

export function getLanguageById(id: string): Language | undefined {
  return languages.find(l => l.id === id)
}
