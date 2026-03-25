'use client'

import { useRef, useEffect, useMemo } from 'react'
import { CharStatus } from '@/lib/types'
import { languageKeywords } from '@/data/keywords'

interface TypingAreaProps {
  code: string
  charStatuses: CharStatus[]
  currentIndex: number
  onKey: (key: string) => void
  disabled?: boolean
  languageId: string
  isTyping: boolean
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

export default function TypingArea({
  code,
  charStatuses,
  currentIndex,
  onKey,
  disabled,
  languageId,
  isTyping,
}: TypingAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const keywordMap = useMemo(() => buildKeywordMap(code, languageId), [code, languageId])

  const lines = useMemo(() => {
    const result: { text: string; startIndex: number }[] = []
    let offset = 0
    const splits = code.split('\n')
    for (let i = 0; i < splits.length; i++) {
      result.push({ text: splits[i], startIndex: offset })
      offset += splits[i].length + 1
    }
    return result
  }, [code])

  useEffect(() => {
    if (!disabled) textareaRef.current?.focus()
  }, [disabled])

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (disabled) return

    // Dead keys (US-International keyboard): let them through, don't preventDefault
    if (e.key === 'Dead') return

    if (e.key === 'Tab') { e.preventDefault(); onKey('Tab'); return }
    if (e.key === 'Enter') { e.preventDefault(); onKey('Enter'); return }
    if (e.key === 'Backspace') { e.preventDefault(); onKey('Backspace'); return }
    if (e.key.length === 1) { e.preventDefault(); onKey(e.key) }
  }

  // Fallback for dead key compositions — captures the final character
  function handleInput(e: React.FormEvent<HTMLTextAreaElement>) {
    const textarea = e.target as HTMLTextAreaElement
    const value = textarea.value
    if (value.length > 0) {
      // Process each new character
      for (const char of value) {
        onKey(char)
      }
      textarea.value = ''
    }
  }

  function getCharClass(status: CharStatus, index: number): string {
    const isCursor = index === currentIndex
    const base = 'relative whitespace-pre'

    if (isCursor) {
      return `${base} text-[#646669] ${isTyping ? 'cursor-char-solid' : 'cursor-char'}`
    }

    switch (status) {
      case 'correct':
        return `${base} text-[#d1d0c5] light:text-[#1a1a1a]`
      case 'incorrect':
        return `${base} text-[#ca4754] bg-[#ca4754]/10 rounded-sm`
      case 'pending':
      default:
        if (keywordMap[index]) {
          return `${base} text-[#5a5d62]`
        }
        return `${base} text-[#646669] light:text-[#b0b0b0]`
    }
  }

  const isIdle = currentIndex === 0 && !isTyping

  return (
    <div
      className="w-full max-w-3xl mx-auto cursor-text"
      onClick={() => textareaRef.current?.focus()}
    >
      <textarea
        ref={textareaRef}
        className="absolute opacity-0 w-0 h-0"
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        autoFocus
        tabIndex={0}
        aria-label="Typing input"
      />

      {/* Start hint */}
      {isIdle && (
        <div className="text-center mb-3 text-sm text-[#646669] animate-fade-in">
          Comece a digitar...
        </div>
      )}

      {/* Code with line numbers */}
      <div className="font-[family-name:var(--font-geist-mono)] text-xl leading-[1.8] overflow-x-auto">
        {lines.map((line, lineIdx) => (
          <div key={lineIdx} className="flex">
            {/* Line number */}
            <span className="select-none w-10 text-right pr-4 text-sm leading-[1.8] text-[#4a4d52] shrink-0 pt-[0.1em]">
              {lineIdx + 1}
            </span>
            {/* Line content */}
            <span>
              {line.text.split('').map((char, charIdx) => {
                const globalIdx = line.startIndex + charIdx
                return (
                  <span key={globalIdx} className={getCharClass(charStatuses[globalIdx], globalIdx)}>
                    {char}
                  </span>
                )
              })}
              {/* Newline cursor position */}
              {lineIdx < lines.length - 1 && (() => {
                const nlIdx = line.startIndex + line.text.length
                if (nlIdx === currentIndex) {
                  return <span className={`relative ${isTyping ? 'cursor-char-solid' : 'cursor-char'} text-[#646669]`}>{' '}</span>
                }
                return null
              })()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
