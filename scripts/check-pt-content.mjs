import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
import { fileURLToPath } from 'node:url'

const scriptPath = fileURLToPath(import.meta.url)
const repoRoot = path.resolve(path.dirname(scriptPath), '..')
const dataDir = path.join(repoRoot, 'data')
const fixMode = process.argv.includes('--fix')

const corrections = {
  anonima: 'anônima', anonimas: 'anônimas', basico: 'básico', basicos: 'básicos',
  dinamica: 'dinâmica', dinamicas: 'dinâmicas', dinamico: 'dinâmico', dinamicos: 'dinâmicos',
  espaco: 'espaço', espacos: 'espaços', funcao: 'função', funcoes: 'funções',
  generica: 'genérica', genericas: 'genéricas', generico: 'genérico', genericos: 'genéricos',
  injecao: 'injeção', integracao: 'integração', interpolacao: 'interpolação', ligacao: 'ligação',
  logica: 'lógica', metodo: 'método', metodos: 'métodos', modulo: 'módulo', modulos: 'módulos',
  navegacao: 'navegação', operacoes: 'operações', opcao: 'opção', opcoes: 'opções',
  padrao: 'padrão', padroes: 'padrões', parametro: 'parâmetro', parametros: 'parâmetros',
  validacao: 'validação', validacoes: 'validações', variavel: 'variável', variaveis: 'variáveis',
  configuracao: 'configuração', configuracoes: 'configurações', composicao: 'composição',
  excecao: 'exceção', excecoes: 'exceções', correlacao: 'correlação', aplicacao: 'aplicação',
}

const ignoredFiles = new Set(['index.ts', 'keywords.ts', 'loaders.ts', 'manifest.ts', 'metadata.ts'])
const fieldsByFile = (filePath) => new Set(
  path.basename(filePath) === 'tracks.ts'
    ? ['concept', 'prompt', 'name', 'description']
    : ['concept', 'prompt'],
)

function propertyName(node) {
  return ts.isIdentifier(node) || ts.isStringLiteral(node) ? node.text : null
}

function stringValue(node) {
  return ts.isStringLiteralLike(node) ? node.text : null
}

function objectId(node) {
  const idProperty = node.properties.find((property) => (
    ts.isPropertyAssignment(property) && propertyName(property.name) === 'id'
  ))
  return idProperty && ts.isPropertyAssignment(idProperty) ? stringValue(idProperty.initializer) ?? 'unknown' : 'unknown'
}

function preserveCase(original, replacement) {
  if (original === original.toUpperCase()) return replacement.toUpperCase()
  if (original[0] && original[0] === original[0].toUpperCase()) {
    return replacement[0].toUpperCase() + replacement.slice(1)
  }
  return replacement
}

function applyCorrections(text) {
  const matches = []
  let corrected = text
  for (const [incorrect, replacement] of Object.entries(corrections).sort((a, b) => b[0].length - a[0].length)) {
    const pattern = new RegExp(`\\b${incorrect}\\b`, 'giu')
    corrected = corrected.replace(pattern, (value) => {
      matches.push({ incorrect: value, correct: preserveCase(value, replacement) })
      return preserveCase(value, replacement)
    })
  }
  return { corrected, matches }
}

function quoteText(value, quote) {
  if (quote === '`') return `\`${value.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')}\``
  if (quote === "'") return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
  return JSON.stringify(value)
}

function inspectFile(filePath) {
  const sourceText = fs.readFileSync(filePath, 'utf8')
  const source = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  const fields = fieldsByFile(filePath)
  const violations = []
  const changes = []

  function visit(node) {
    if (ts.isObjectLiteralExpression(node)) {
      const entityId = objectId(node)
      for (const field of node.properties) {
        if (!ts.isPropertyAssignment(field) || !fields.has(propertyName(field.name))) continue
        if (!ts.isObjectLiteralExpression(field.initializer)) continue
        const ptProperty = field.initializer.properties.find((property) => (
          ts.isPropertyAssignment(property) && propertyName(property.name) === 'pt'
        ))
        if (!ptProperty || !ts.isPropertyAssignment(ptProperty)) continue
        const original = stringValue(ptProperty.initializer)
        if (original === null) continue
        const result = applyCorrections(original)
        if (result.matches.length === 0) continue

        const relativePath = path.relative(repoRoot, filePath)
        for (const match of result.matches) {
          violations.push(`${relativePath} :: ${entityId} :: ${propertyName(field.name)}.pt :: "${match.incorrect}" -> "${match.correct}"`)
        }

        if (fixMode && result.corrected !== original) {
          const literal = sourceText.slice(ptProperty.initializer.getStart(source), ptProperty.initializer.getEnd())
          const quote = literal[0] === "'" || literal[0] === '`' ? literal[0] : '"'
          changes.push({ start: ptProperty.initializer.getStart(source), end: ptProperty.initializer.getEnd(), replacement: quoteText(result.corrected, quote) })
        }
      }
    }
    ts.forEachChild(node, visit)
  }

  visit(source)
  if (fixMode && changes.length > 0) {
    let nextText = sourceText
    for (const change of changes.sort((a, b) => b.start - a.start)) {
      nextText = `${nextText.slice(0, change.start)}${change.replacement}${nextText.slice(change.end)}`
    }
    fs.writeFileSync(filePath, nextText)
  }

  return violations
}

const violations = fs.readdirSync(dataDir)
  .filter((file) => file.endsWith('.ts') && !ignoredFiles.has(file))
  .sort()
  .flatMap((file) => inspectFile(path.join(dataDir, file)))

if (violations.length > 0) {
  console.error('[check:pt-content] Encontramos textos PT-BR sem acentuação:')
  for (const violation of violations) console.error(`- ${violation}`)
  process.exit(1)
}

console.log('[check:pt-content] OK')
