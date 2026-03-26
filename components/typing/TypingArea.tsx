'use client'

import { useRef, useEffect, useMemo } from 'react'
import { CharStatus } from '@/lib/types'
import { languageKeywords } from '@/data/keywords'
import { Locale, t } from '@/lib/i18n'

interface TypingAreaProps {
  code: string
  charStatuses: CharStatus[]
  currentIndex: number
  onKey: (key: string) => void
  disabled?: boolean
  languageId: string
  isTyping: boolean
  locale?: Locale
}

function buildKeywordMap(code: string, languageId: string): boolean[] {
  const map = new Array(code.length).fill(false)
  const keywords = languageKeywords[languageId] || []
  for (const kw of keywords) {
    let idx = 0
    while (idx < code.length) {
      const found = code.indexOf(kw, idx)
      if (found === -1) break
      const before = found > 0 ? code[found - 1] : ' '
      const after = found + kw.length < code.length ? code[found + kw.length] : ' '
      if (!/[a-zA-Z0-9_]/.test(before) && !/[a-zA-Z0-9_]/.test(after)) {
        for (let i = found; i < found + kw.length; i++) map[i] = true
      }
      idx = found + 1
    }
  }
  return map
}

function buildStringMap(code: string): boolean[] {
  const map = new Array(code.length).fill(false)
  let i = 0
  while (i < code.length) {
    const ch = code[i]
    if (ch === '"' || ch === "'" || ch === '`') {
      const quote = ch
      map[i] = true; i++
      while (i < code.length && code[i] !== quote) {
        if (code[i] === '\\') { map[i] = true; i++ }
        if (i < code.length) { map[i] = true; i++ }
      }
      if (i < code.length) { map[i] = true; i++ }
    } else { i++ }
  }
  return map
}

export default function TypingArea({ code, charStatuses, currentIndex, onKey, disabled, languageId, isTyping, locale = 'pt' }: TypingAreaProps) {
  const isTextMode = languageId.startsWith('text-')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isComposingRef = useRef(false)
  const keywordMap = useMemo(() => buildKeywordMap(code, languageId), [code, languageId])
  const stringMap = useMemo(() => buildStringMap(code), [code])

  const lines = useMemo(() => {
    const result: { text: string; startIndex: number }[] = []
    let offset = 0
    for (const line of code.split('\n')) {
      result.push({ text: line, startIndex: offset })
      offset += line.length + 1
    }
    return result
  }, [code])

  useEffect(() => { if (!disabled) textareaRef.current?.focus() }, [disabled])

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (disabled) return
    if (e.key === 'Dead') return
    if (e.isComposing) return
    if (e.key === 'Tab') { e.preventDefault(); onKey('Tab'); return }
    if (e.key === 'Enter') { e.preventDefault(); onKey('Enter'); return }
    if (e.key === 'Backspace') { e.preventDefault(); onKey('Backspace'); return }
    if (e.key.length === 1) { e.preventDefault(); onKey(e.key) }
  }

  function handleInput(e: React.FormEvent<HTMLTextAreaElement>) {
    if (isComposingRef.current) return
    const textarea = e.target as HTMLTextAreaElement
    if (textarea.value.length > 0) {
      for (const char of textarea.value) onKey(char)
      textarea.value = ''
    }
  }

  function handleCompositionEnd(e: React.CompositionEvent<HTMLTextAreaElement>) {
    isComposingRef.current = false
    const composed = e.data
    if (composed) {
      for (const char of composed) onKey(char)
      ;(e.target as HTMLTextAreaElement).value = ''
    }
  }

  function getCharStyle(status: CharStatus, index: number): React.CSSProperties {
    const isCursor = index === currentIndex
    if (isCursor) return { color: 'var(--sub)' }
    switch (status) {
      case 'correct':
        if (!isTextMode && keywordMap[index]) return { color: 'var(--syntax-keyword)' }
        if (!isTextMode && stringMap[index]) return { color: 'var(--syntax-string)' }
        return { color: 'var(--text)' }
      case 'incorrect':
        return { color: 'var(--error)', backgroundColor: 'color-mix(in srgb, var(--error) 10%, transparent)' }
      case 'pending':
      default:
        return { color: 'var(--sub)' }
    }
  }

  function getCharClass(status: CharStatus, index: number): string {
    const isCursor = index === currentIndex
    const base = isTextMode ? 'relative' : 'relative whitespace-pre'
    if (isCursor) return `${base} ${isTyping ? 'cursor-char-solid' : 'cursor-char'}`
    if (status === 'incorrect') return `${base} rounded-sm`
    return base
  }

  const isIdle = currentIndex === 0 && !isTyping

  return (
    <div className={`w-full mx-auto cursor-text ${isTextMode ? 'max-w-2xl' : 'max-w-3xl'}`} onClick={() => textareaRef.current?.focus()}>
      <textarea
        ref={textareaRef}
        className="absolute opacity-0 w-0 h-0"
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        onCompositionStart={() => { isComposingRef.current = true }}
        onCompositionEnd={handleCompositionEnd}
        autoFocus
        tabIndex={0}
        aria-label="Typing input"
      />

      {isIdle && (
        <div className="text-center mb-3 text-sm animate-fade-in" style={{ color: 'var(--sub)' }}>
          {t('startTyping', locale)}
        </div>
      )}

      {isTextMode ? (
        /* Text mode: centered prose, word wrap, MonkeyType style */
        <div className="font-[family-name:var(--font-geist-sans)] text-[1.75rem] leading-[2.4] w-full mx-auto" style={{ overflowWrap: 'break-word', wordBreak: 'normal' }}>
          {code.split('').map((char, i) => (
            <span key={i} className={getCharClass(charStatuses[i], i)} style={getCharStyle(charStatuses[i], i)}>
              {char}
            </span>
          ))}
        </div>
      ) : (
        /* Code mode: line numbers, monospace, wraps long lines */
        <div className="font-[family-name:var(--font-geist-mono)] text-[1.5rem] leading-[1.8]">
          {lines.map((line, lineIdx) => (
            <div key={lineIdx} className="flex min-w-0">
              <span className="select-none w-10 text-right pr-4 text-xs leading-[1.8] shrink-0 pt-[0.15em]" style={{ color: 'var(--sub)', opacity: 0.4 }}>
                {lineIdx + 1}
              </span>
              <span className="whitespace-pre-wrap break-words flex-1 min-w-0">
                {line.text.split('').map((char, charIdx) => {
                  const globalIdx = line.startIndex + charIdx
                  return (
                    <span key={globalIdx} className={getCharClass(charStatuses[globalIdx], globalIdx)} style={getCharStyle(charStatuses[globalIdx], globalIdx)}>
                      {char}
                    </span>
                  )
                })}
                {lineIdx < lines.length - 1 && (() => {
                  const nlIdx = line.startIndex + line.text.length
                  if (nlIdx === currentIndex) {
                    return <span className={`relative ${isTyping ? 'cursor-char-solid' : 'cursor-char'}`} style={{ color: 'var(--sub)' }}>{' '}</span>
                  }
                  return null
                })()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
