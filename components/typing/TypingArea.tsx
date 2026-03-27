'use client'

import { useRef, useEffect, useMemo, useState, useLayoutEffect, useCallback } from 'react'
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

export default function TypingArea({ code, charStatuses, currentIndex, onKey, disabled, languageId, isTyping, locale = 'en' }: TypingAreaProps) {
  const isTextMode = languageId.startsWith('text-')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isComposingRef = useRef(false)
  const keywordMap = useMemo(() => buildKeywordMap(code, languageId), [code, languageId])
  const stringMap = useMemo(() => buildStringMap(code), [code])

  const [cursorPos, setCursorPos] = useState({ left: 0, top: 0, height: 0 })
  const [cursorReady, setCursorReady] = useState(false)

  const lines = useMemo(() => {
    const result: { text: string; startIndex: number }[] = []
    let offset = 0
    for (const line of code.split('\n')) {
      result.push({ text: line, startIndex: offset })
      offset += line.length + 1
    }
    return result
  }, [code])

  useEffect(() => { if (!disabled) textareaRef.current?.focus() }, [disabled, code])

  // Position the sliding cursor
  const updateCursorPos = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const charEl = container.querySelector(`[data-idx="${currentIndex}"]`) as HTMLElement | null
    if (charEl) {
      const containerRect = container.getBoundingClientRect()
      const charRect = charEl.getBoundingClientRect()
      setCursorPos({
        left: charRect.left - containerRect.left,
        top: charRect.top - containerRect.top + charRect.height * 0.1,
        height: charRect.height * 0.8,
      })
      setCursorReady(true)
    }
  }, [currentIndex])

  useLayoutEffect(() => {
    updateCursorPos()
  }, [currentIndex, code, updateCursorPos])

  // Also update on resize
  useEffect(() => {
    window.addEventListener('resize', updateCursorPos)
    return () => window.removeEventListener('resize', updateCursorPos)
  }, [updateCursorPos])

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (disabled) return
    if (e.key === 'Dead') return
    if ((e.nativeEvent as KeyboardEvent).isComposing) return
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
    switch (status) {
      case 'correct':
        if (!isTextMode && keywordMap[index]) return { color: 'var(--syntax-keyword)' }
        if (!isTextMode && stringMap[index]) return { color: 'var(--syntax-string)' }
        return { color: 'var(--text)' }
      case 'incorrect':
        return { color: 'var(--error)' }
      case 'pending':
      default:
        return { color: 'var(--sub)' }
    }
  }

  const isIdle = currentIndex === 0 && !isTyping

  return (
    <div className={`w-full mx-auto cursor-text overflow-hidden ${isTextMode ? 'max-w-5xl' : 'max-w-3xl'}`} onClick={() => textareaRef.current?.focus()}>
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

      {isTyping && (
        <div className="mb-2 tabular-nums" style={{ color: 'var(--main)' }}>
          <span className="text-xl sm:text-2xl font-bold">{currentIndex}</span>
          <span className="text-xs sm:text-sm mx-1" style={{ color: 'var(--sub)', opacity: 0.5 }}>/</span>
          <span className="text-xs sm:text-sm" style={{ color: 'var(--sub)' }}>{code.length}</span>
        </div>
      )}

      <div ref={containerRef} className="relative">
        {/* Sliding cursor */}
        {cursorReady && (
          <div
            className="absolute pointer-events-none z-10"
            style={{
              left: cursorPos.left - 1,
              top: cursorPos.top - cursorPos.height * 0.08,
              height: cursorPos.height * 1.16,
              width: 3,
              backgroundColor: 'var(--caret)',
              transition: isTyping ? 'left 0.08s ease-out, top 0.08s ease-out' : 'none',
              animation: isTyping ? 'none' : 'blink 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              borderRadius: 2,
              opacity: 0.85,
            }}
          />
        )}

        {isTextMode ? (
          <div className="font-[family-name:var(--font-geist-sans)] text-lg sm:text-2xl md:text-[2rem] leading-[1.2] sm:leading-[1.4] md:leading-[1.5] w-full mx-auto text-center" style={{ overflowWrap: 'anywhere', wordBreak: 'break-word', fontVariantLigatures: 'none' }}>
            {code.split('').map((char, i) => (
              <span key={i} data-idx={i} className="relative" style={getCharStyle(charStatuses[i], i)}>
                {char}
              </span>
            ))}
          </div>
        ) : (
          <div className="font-[family-name:var(--font-geist-mono)] text-base sm:text-xl md:text-[1.75rem] leading-[1.6] sm:leading-[1.8]" style={{ fontVariantLigatures: 'none' }}>
            {lines.map((line, lineIdx) => (
              <div key={lineIdx} className="flex min-w-0">
                <span className="select-none w-6 sm:w-10 text-right pr-2 sm:pr-4 text-[10px] sm:text-xs leading-[1.6] sm:leading-[1.8] shrink-0 pt-[0.15em]" style={{ color: 'var(--sub)', opacity: 0.4 }}>
                  {lineIdx + 1}
                </span>
                <span className="whitespace-pre-wrap flex-1 min-w-0" style={{ overflowWrap: 'anywhere', wordBreak: 'break-all' }}>
                  {line.text.split('').map((char, charIdx) => {
                    const globalIdx = line.startIndex + charIdx
                    return (
                      <span key={globalIdx} data-idx={globalIdx} className="relative whitespace-pre" style={getCharStyle(charStatuses[globalIdx], globalIdx)}>
                        {char}
                      </span>
                    )
                  })}
                  {/* Newline target for cursor positioning */}
                  {lineIdx < lines.length - 1 && (
                    <span data-idx={line.startIndex + line.text.length} className="relative whitespace-pre" style={{ color: 'var(--sub)' }}>{' '}</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
