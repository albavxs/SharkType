'use client'

import { useState, useEffect, useRef } from 'react'

const demoSnippets = [
  { lang: 'JavaScript', color: '#f7df1e', code: 'const sum = (a, b) => a + b;' },
  { lang: 'Python', color: '#3776ab', code: 'squares = [x**2 for x in range(10)]' },
  { lang: 'Rust', color: '#ce422b', code: 'fn add(a: i32, b: i32) -> i32 { a + b }' },
  { lang: 'Go', color: '#00add8', code: 'func add(a, b int) int { return a + b }' },
]

export default function TypingDemo() {
  const [snippetIdx, setSnippetIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [fading, setFading] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const snippet = demoSnippets[snippetIdx]

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCharIdx(prev => {
        if (prev >= snippet.code.length) {
          // Pause, then switch snippet
          clearInterval(intervalRef.current!)
          setTimeout(() => {
            setFading(true)
            setTimeout(() => {
              setSnippetIdx(i => (i + 1) % demoSnippets.length)
              setCharIdx(0)
              setFading(false)
            }, 200)
          }, 800)
          return prev
        }
        return prev + 1
      })
    }, 55)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [snippetIdx, snippet.code.length])

  return (
    <div className={`transition-opacity duration-200 ${fading ? 'opacity-0' : 'opacity-100'}`}>
      <div className="flex items-center gap-2 mb-2">
        <span
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: snippet.color }}
        />
        <span className="text-[10px] text-neutral-500 light:text-neutral-400">{snippet.lang}</span>
      </div>
      <pre className="font-[family-name:var(--font-geist-mono)] text-sm leading-relaxed">
        <code>
          {snippet.code.split('').map((char, i) => (
            <span
              key={i}
              className={
                i < charIdx
                  ? 'text-white light:text-black'
                  : 'text-neutral-700 light:text-neutral-300'
              }
            >
              {char}
            </span>
          ))}
        </code>
      </pre>
    </div>
  )
}
