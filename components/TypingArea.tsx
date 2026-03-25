'use client'

import { useRef, useEffect, useMemo, useState, useCallback } from 'react'
import { CharStatus } from '@/lib/types'
import { languageKeywords } from '@/data/keywords'

interface TypingAreaProps {
  code: string
  charStatuses: CharStatus[]
  currentIndex: number
  onKey: (key: string) => void
  disabled?: boolean
  languageId: string
  concept: string
  difficulty: string
  languageColor: string
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
      const isWordBoundary = !/[a-zA-Z0-9_]/.test(before) && !/[a-zA-Z0-9_]/.test(after)

      if (isWordBoundary) {
        for (let i = found; i < found + kw.length; i++) {
          map[i] = true
        }
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
      map[i] = true
      i++
      while (i < code.length && code[i] !== quote) {
        if (code[i] === '\\') {
          map[i] = true
          i++
        }
        if (i < code.length) {
          map[i] = true
          i++
        }
      }
      if (i < code.length) {
        map[i] = true
        i++
      }
    } else {
      i++
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
  concept,
  difficulty,
  languageColor,
}: TypingAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [shaking, setShaking] = useState(false)
  const prevErrorCount = useRef(0)

  const keywordMap = useMemo(() => buildKeywordMap(code, languageId), [code, languageId])
  const stringMap = useMemo(() => buildStringMap(code), [code])

  const lines = useMemo(() => {
    const result: { text: string; startIndex: number }[] = []
    let offset = 0
    const splits = code.split('\n')
    for (let i = 0; i < splits.length; i++) {
      result.push({ text: splits[i], startIndex: offset })
      offset += splits[i].length + 1 // +1 for \n
    }
    return result
  }, [code])

  useEffect(() => {
    if (!disabled) {
      textareaRef.current?.focus()
    }
  }, [disabled])

  // Shake on error
  const triggerShake = useCallback(() => {
    setShaking(true)
    const timer = setTimeout(() => setShaking(false), 200)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const errorCount = charStatuses.filter(s => s === 'incorrect').length
    if (errorCount > prevErrorCount.current) {
      triggerShake()
    }
    prevErrorCount.current = errorCount
  }, [charStatuses, triggerShake])

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (disabled) return

    if (e.key === 'Tab') {
      e.preventDefault()
      onKey('Tab')
      return
    }

    if (e.key === 'Enter') {
      e.preventDefault()
      onKey('Enter')
      return
    }

    if (e.key === 'Backspace') {
      e.preventDefault()
      onKey('Backspace')
      return
    }

    if (e.key.length === 1) {
      e.preventDefault()
      onKey(e.key)
    }
  }

  function getCharClass(status: CharStatus, index: number): string {
    const isCursor = index === currentIndex
    const base = 'relative whitespace-pre'

    if (isCursor) {
      return `${base} text-neutral-700 light:text-neutral-300 cursor-char`
    }

    switch (status) {
      case 'correct':
        return `${base} text-white light:text-black`
      case 'incorrect':
        return `${base} text-red-500 underline decoration-red-500`
      case 'pending':
      default:
        if (keywordMap[index]) {
          return `${base} text-purple-400 light:text-purple-600`
        }
        if (stringMap[index]) {
          return `${base} text-green-400 light:text-green-600`
        }
        return `${base} text-neutral-700 light:text-neutral-300`
    }
  }

  const difficultyLabel = difficulty === 'easy' ? 'Facil' : difficulty === 'medium' ? 'Medio' : 'Dificil'

  return (
    <div
      className={`relative rounded-lg border border-neutral-800 light:border-neutral-200 overflow-hidden ${shaking ? 'animate-shake' : ''}`}
      onClick={() => textareaRef.current?.focus()}
    >
      {/* File tab */}
      <div className="flex items-center gap-3 px-4 py-2 bg-neutral-900 light:bg-neutral-100 border-b border-neutral-800 light:border-neutral-200">
        <span
          className="inline-block w-2 h-2 rounded-full"
          style={{ backgroundColor: languageColor }}
        />
        <span className="text-xs text-neutral-500 light:text-neutral-400">{concept}</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 light:bg-neutral-200 text-neutral-500 light:text-neutral-400">
          {difficultyLabel}
        </span>
      </div>

      <textarea
        ref={textareaRef}
        className="absolute opacity-0 w-0 h-0"
        onKeyDown={handleKeyDown}
        autoFocus
        readOnly
        tabIndex={0}
        aria-label="Typing input"
      />

      {/* Code area with line numbers */}
      <div className="bg-neutral-950 light:bg-neutral-50 p-4 cursor-text overflow-x-auto">
        <div className="font-[family-name:var(--font-geist-mono)] text-lg leading-[1.8]">
          {lines.map((line, lineIdx) => (
            <div key={lineIdx} className="flex">
              {/* Line number */}
              <span className="select-none w-8 text-right pr-4 text-xs leading-[1.8] text-neutral-700 light:text-neutral-300 shrink-0 pt-[0.15em]">
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
                {/* Render the newline character position (cursor can be here) */}
                {lineIdx < lines.length - 1 && (() => {
                  const nlIdx = line.startIndex + line.text.length
                  if (nlIdx === currentIndex) {
                    return <span className="relative cursor-char">{' '}</span>
                  }
                  return null
                })()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
