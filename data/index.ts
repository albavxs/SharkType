import { Language, Snippet } from '@/lib/types'
import { validateLanguages } from '@/lib/schemas'
import { validateTypingCatalog } from '@/lib/typing-content'
import { languageManifest } from './manifest'
import { tracks } from './tracks'

// ── Imports estaticos (Next/webpack exige top-level imports) ─────────────
import { cSnippets } from './c'
import { cppSnippets } from './cpp'
import { csharpSnippets } from './csharp'
import { javascriptSnippets } from './javascript'
import { typescriptSnippets } from './typescript'
import { pythonSnippets } from './python'
import { rustSnippets } from './rust'
import { goSnippets } from './go'
import { javaSnippets } from './java'
import { kotlinSnippets } from './kotlin'
import { scalaSnippets } from './scala'
import { swiftSnippets } from './swift'
import { rubySnippets } from './ruby'
import { luaSnippets } from './lua'
import { htmlSnippets } from './html'
import { cssSnippets } from './css'
import { sqlSnippets } from './sql'
import { bashSnippets } from './bash'
import { dockerSnippets } from './docker'
import { gitSnippets } from './git'
import { linuxSnippets } from './linux'
import { kubernetesSnippets } from './kubernetes'
import { terraformSnippets } from './terraform'
import { ansibleSnippets } from './ansible'
import { cicdSnippets } from './cicd'

import {
  nmapSnippets,
  webReconSnippets,
  firewallSnippets,
  networkAnalysisSnippets,
  hardeningSnippets,
  cryptoSnippets,
} from './cybersec'

import { vueSnippets } from './vue'
import { reactSnippets } from './react'
import { nodejsSnippets } from './nodejs'
import { testingSnippets } from './testing'
import { patternsSnippets } from './patterns'
import { algorithmsSnippets } from './algorithms'
import { mongodbSnippets } from './mongodb'
import { jinjaSnippets } from './jinja'
import { nextjsSnippets } from './nextjs'
import { angularSnippets } from './angular'

import { typingSnippets } from './text-typing'
import { ptbrSnippets } from './text-ptbr'
import { enSnippets } from './text-en'
import { esSnippets } from './text-es'
import { frSnippets } from './text-fr'

const snippetRegistry: Record<string, Snippet[]> = {
  './c:cSnippets': cSnippets,
  './cpp:cppSnippets': cppSnippets,
  './csharp:csharpSnippets': csharpSnippets,
  './javascript:javascriptSnippets': javascriptSnippets,
  './typescript:typescriptSnippets': typescriptSnippets,
  './python:pythonSnippets': pythonSnippets,
  './rust:rustSnippets': rustSnippets,
  './go:goSnippets': goSnippets,
  './java:javaSnippets': javaSnippets,
  './kotlin:kotlinSnippets': kotlinSnippets,
  './scala:scalaSnippets': scalaSnippets,
  './swift:swiftSnippets': swiftSnippets,
  './ruby:rubySnippets': rubySnippets,
  './lua:luaSnippets': luaSnippets,
  './html:htmlSnippets': htmlSnippets,
  './css:cssSnippets': cssSnippets,
  './sql:sqlSnippets': sqlSnippets,
  './bash:bashSnippets': bashSnippets,
  './docker:dockerSnippets': dockerSnippets,
  './git:gitSnippets': gitSnippets,
  './linux:linuxSnippets': linuxSnippets,
  './kubernetes:kubernetesSnippets': kubernetesSnippets,
  './terraform:terraformSnippets': terraformSnippets,
  './ansible:ansibleSnippets': ansibleSnippets,
  './cicd:cicdSnippets': cicdSnippets,
  './cybersec:nmapSnippets': nmapSnippets,
  './cybersec:webReconSnippets': webReconSnippets,
  './cybersec:firewallSnippets': firewallSnippets,
  './cybersec:networkAnalysisSnippets': networkAnalysisSnippets,
  './cybersec:hardeningSnippets': hardeningSnippets,
  './cybersec:cryptoSnippets': cryptoSnippets,
  './vue:vueSnippets': vueSnippets,
  './react:reactSnippets': reactSnippets,
  './nodejs:nodejsSnippets': nodejsSnippets,
  './testing:testingSnippets': testingSnippets,
  './patterns:patternsSnippets': patternsSnippets,
  './algorithms:algorithmsSnippets': algorithmsSnippets,
  './mongodb:mongodbSnippets': mongodbSnippets,
  './jinja:jinjaSnippets': jinjaSnippets,
  './nextjs:nextjsSnippets': nextjsSnippets,
  './angular:angularSnippets': angularSnippets,
  './text-typing:typingSnippets': typingSnippets,
  './text-ptbr:ptbrSnippets': ptbrSnippets,
  './text-en:enSnippets': enSnippets,
  './text-es:esSnippets': esSnippets,
  './text-fr:frSnippets': frSnippets,
}

function buildLanguagesByType(type: 'code' | 'text'): Language[] {
  return languageManifest
    .filter(entry => entry.type === type)
    .map(entry => {
      const exportName = entry.exportName ?? `${entry.id}Snippets`
      const key = `${entry.module}:${exportName}`
      const snippets = snippetRegistry[key]

      if (!snippets) {
        throw new Error(`Snippet array not found for ${key}. Check data/index.ts imports.`)
      }

      return {
        id: entry.id,
        label: entry.label,
        color: entry.color,
        snippets,
      }
    })
}

export const codeLanguages: Language[] = validateLanguages(buildLanguagesByType('code'), 'codeLanguages')
export const textLanguages: Language[] = validateLanguages(buildLanguagesByType('text'), 'textLanguages')

const typingLanguage = textLanguages.find((language) => language.id === 'text-typing')
if (!typingLanguage) {
  throw new Error('[typing-content] Linguagem text-typing não encontrada')
}

const typingAudit = validateTypingCatalog(typingLanguage.snippets, tracks)
if (process.env.TYPING_CONTENT_AUDIT === '1') {
  console.info(JSON.stringify({ event: 'typing.content_audit', items: typingAudit }))
}

export const languages: Language[] = [...codeLanguages, ...textLanguages]

export function getLanguageById(id: string): Language | undefined {
  return languages.find(l => l.id === id)
}
