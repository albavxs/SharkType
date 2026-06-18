import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')
const dataDir = path.join(repoRoot, 'data')
const fixMode = process.argv.includes('--fix')

const curatedCorrections = {
  anonima: 'anônima',
  anonimas: 'anônimas',
  basico: 'básico',
  basicos: 'básicos',
  dinamica: 'dinâmica',
  dinamicas: 'dinâmicas',
  dinamico: 'dinâmico',
  dinamicos: 'dinâmicos',
  espaco: 'espaço',
  espacos: 'espaços',
  funcao: 'função',
  funcoes: 'funções',
  generica: 'genérica',
  genericas: 'genéricas',
  generico: 'genérico',
  genericos: 'genéricos',
  injecao: 'injeção',
  integracao: 'integração',
  interpolacao: 'interpolação',
  ligacao: 'ligação',
  logica: 'lógica',
  metodo: 'método',
  metodos: 'métodos',
  modulo: 'módulo',
  modulos: 'módulos',
  navegacao: 'navegação',
  operacoes: 'operações',
  opcao: 'opção',
  opcoes: 'opções',
  padrao: 'padrão',
  padroes: 'padrões',
  parametro: 'parâmetro',
  parametros: 'parâmetros',
  validacao: 'validação',
  validacoes: 'validações',
  variavel: 'variável',
  variaveis: 'variáveis',
  configuracao: 'configuração',
  configuracoes: 'configurações',
  composicao: 'composição',
  excecao: 'exceção',
  excecoes: 'exceções',
  correlacao: 'correlação',
  aplicacao: 'aplicação',
}

const ignoredFiles = new Set([
  'index.ts',
  'keywords.ts',
  'loaders.ts',
  'manifest.ts',
  'metadata.ts',
])

const sortedCorrections = Object.entries(curatedCorrections).sort((a, b) => b[0].length - a[0].length)

function listDataFiles(directory) {
  return fs
    .readdirSync(directory)
    .filter((file) => file.endsWith('.ts') && !ignoredFiles.has(file))
    .map((file) => path.join(directory, file))
    .sort()
}

function getPropertyName(node) {
  if (ts.isIdentifier(node) || ts.isStringLiteral(node)) return node.text
  return null
}

function getStringValue(node) {
  if (ts.isStringLiteralLike(node)) return node.text
  return null
}

function getScopedFields(filePath) {
  const fields = new Set(['concept', 'prompt'])
  if (path.basename(filePath) === 'tracks.ts') {
    fields.add('name')
    fields.add('description')
  }
  return fields
}

function preserveCase(original, corrected) {
  if (original.toUpperCase() === original) return corrected.toUpperCase()
  if (original[0] && original[0] === original[0].toUpperCase()) {
    return corrected[0].toUpperCase() + corrected.slice(1)
  }
  return corrected
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function applyCorrections(text) {
  const matches = []
  let nextText = text

  for (const [incorrect, corrected] of sortedCorrections) {
    const regex = new RegExp(`\\b${escapeRegex(incorrect)}\\b`, 'giu')
    nextText = nextText.replace(regex, (value) => {
      matches.push({
        incorrect: value,
        correct: preserveCase(value, corrected),
      })
      return preserveCase(value, corrected)
    })
  }

  return {
    nextText,
    matches,
  }
}

function quoteText(text, quoteChar) {
  if (quoteChar === '\'') {
    return `'${text
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/\r/g, '\\r')
      .replace(/\n/g, '\\n')
      .replace(/\t/g, '\\t')}'`
  }

  if (quoteChar === '`') {
    return `\`${text
      .replace(/\\/g, '\\\\')
      .replace(/`/g, '\\`')
      .replace(/\$\{/g, '\\${')}\``
  }

  return JSON.stringify(text)
}

function findId(objectLiteral) {
  for (const property of objectLiteral.properties) {
    if (!ts.isPropertyAssignment(property)) continue
    const name = getPropertyName(property.name)
    if (name !== 'id') continue
    const value = getStringValue(property.initializer)
    if (value) return value
  }
  return 'unknown'
}

function inspectFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const source = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  const scopedFields = getScopedFields(filePath)
  const violations = []
  const changes = []

  function visit(node) {
    if (ts.isObjectLiteralExpression(node)) {
      const entityId = findId(node)

      for (const property of node.properties) {
        if (!ts.isPropertyAssignment(property)) continue
        const fieldName = getPropertyName(property.name)
        if (!fieldName || !scopedFields.has(fieldName)) continue
        if (!ts.isObjectLiteralExpression(property.initializer)) continue

        const ptProperty = property.initializer.properties.find((candidate) => {
          return ts.isPropertyAssignment(candidate) && getPropertyName(candidate.name) === 'pt'
        })

        if (!ptProperty || !ts.isPropertyAssignment(ptProperty)) continue

        const ptNode = ptProperty.initializer
        const ptText = getStringValue(ptNode)
        if (ptText == null) continue

        const result = applyCorrections(ptText)
        if (result.matches.length === 0) continue

        const relativePath = path.relative(repoRoot, filePath)
        for (const match of result.matches) {
          violations.push({
            file: relativePath,
            id: entityId,
            field: `${fieldName}.pt`,
            incorrect: match.incorrect,
            correct: match.correct,
          })
        }

        if (fixMode && result.nextText !== ptText) {
          const start = ptNode.getStart(source)
          const end = ptNode.getEnd()
          const originalLiteral = content.slice(start, end)
          const quoteChar = originalLiteral[0] === '\'' || originalLiteral[0] === '`' ? originalLiteral[0] : '"'

          changes.push({
            start,
            end,
            replacement: quoteText(result.nextText, quoteChar),
          })
        }
      }
    }

    ts.forEachChild(node, visit)
  }

  visit(source)

  if (fixMode && changes.length > 0) {
    let nextContent = content
    for (const change of changes.sort((a, b) => b.start - a.start)) {
      nextContent = `${nextContent.slice(0, change.start)}${change.replacement}${nextContent.slice(change.end)}`
    }
    fs.writeFileSync(filePath, nextContent)
  }

  return {
    violations,
    changed: changes.length > 0,
  }
}

function runInspection() {
  return listDataFiles(dataDir).map(inspectFile)
}

let results = runInspection()

if (fixMode) {
  const changedFiles = results.filter((result) => result.changed).length
  if (changedFiles > 0) {
    console.log(`[check:pt-content] Corrigidos ${changedFiles} arquivo(s).`)
  }
  results = runInspection()
}

const violations = results.flatMap((result) => result.violations)

if (violations.length > 0) {
  console.error('[check:pt-content] Encontramos textos PT-BR sem acentuação no escopo validado:\n')
  for (const violation of violations) {
    console.error(`- ${violation.file} :: ${violation.id} :: ${violation.field} :: "${violation.incorrect}" -> "${violation.correct}"`)
  }
  process.exit(1)
}

console.log('[check:pt-content] OK')
