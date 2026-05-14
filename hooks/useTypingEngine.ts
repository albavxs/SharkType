'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { CharStatus, TypingState } from '@/lib/types'
import { calculateWPM, calculateAccuracy } from '@/lib/utils'

interface UseTypingEngineReturn {
  state: TypingState
  wpm: number
  rawWpm: number
  accuracy: number
  wpmSamples: number[]
  rawWpmSamples: number[]
  handleKey: (key: string) => void
  reset: () => void
  wpmRef: React.RefObject<number>
}

function createInitialState(codeLength: number): TypingState {
  return {
    input: '',
    charStatuses: new Array(codeLength).fill('pending') as CharStatus[],
    currentIndex: 0,
    errors: 0,
    status: 'idle',
    startTime: null,
  }
}

export function useTypingEngine(
  code: string,
  onFinish?: () => void
): UseTypingEngineReturn {
  const [state, setState] = useState<TypingState>(() =>
    createInitialState(code.length)
  )
  const [wpm, setWpm] = useState(0)
  const [rawWpm, setRawWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [wpmSamples, setWpmSamples] = useState<number[]>([])
  const [rawWpmSamples, setRawWpmSamples] = useState<number[]>([])

  const codeRef = useRef(code)
  const errorsRef = useRef(0)
  const totalKeypressesRef = useRef(0)
  const correctCharsRef = useRef(0)
  const rawCharsRef = useRef(0)
  const startTimeRef = useRef<number | null>(null)
  const wpmRef = useRef(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const samplerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Reset when code changes
  useEffect(() => {
    if (codeRef.current !== code) {
      codeRef.current = code
      errorsRef.current = 0
      totalKeypressesRef.current = 0
      correctCharsRef.current = 0
      rawCharsRef.current = 0
      startTimeRef.current = null
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (samplerRef.current) clearInterval(samplerRef.current)
      intervalRef.current = null
      samplerRef.current = null
      setState(createInitialState(code.length))
      setWpm(0)
      setRawWpm(0)
      setAccuracy(100)
      setWpmSamples([])
      setRawWpmSamples([])
    }
  }, [code])

  // Stable WPM update interval (fixes flicker)
  useEffect(() => {
    if (state.status === 'running' && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        const elapsed = startTimeRef.current ? Date.now() - startTimeRef.current : 0
        const net = calculateWPM(correctCharsRef.current, elapsed)
        const raw = calculateWPM(rawCharsRef.current, elapsed)
        const acc = calculateAccuracy(correctCharsRef.current, totalKeypressesRef.current)
        setWpm(net)
        setRawWpm(raw)
        setAccuracy(acc)
        wpmRef.current = net
      }, 500)

      // WPM sampler for graph (every 1s)
      samplerRef.current = setInterval(() => {
        const elapsed = startTimeRef.current ? Date.now() - startTimeRef.current : 0
        const net = calculateWPM(correctCharsRef.current, elapsed)
        const raw = calculateWPM(rawCharsRef.current, elapsed)
        setWpmSamples(prev => [...prev, net])
        setRawWpmSamples(prev => [...prev, raw])
      }, 1000)
    }

    if (state.status === 'finished' || state.status === 'idle') {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      if (samplerRef.current) {
        clearInterval(samplerRef.current)
        samplerRef.current = null
      }
      // Final calculation
      if (state.status === 'finished') {
        const elapsed = startTimeRef.current ? Date.now() - startTimeRef.current : 0
        const net = calculateWPM(correctCharsRef.current, elapsed)
        const raw = calculateWPM(rawCharsRef.current, elapsed)
        const acc = calculateAccuracy(correctCharsRef.current, totalKeypressesRef.current)
        setWpm(net)
        setRawWpm(raw)
        setAccuracy(acc)
        wpmRef.current = net
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (samplerRef.current) clearInterval(samplerRef.current)
      intervalRef.current = null
      samplerRef.current = null
    }
  }, [state.status])

  const handleKey = useCallback(
    (key: string) => {
      setState((prev) => {
        if (prev.status === 'finished') return prev

        if (key === 'Backspace') {
          if (prev.currentIndex === 0) return prev
          const newIndex = prev.currentIndex - 1
          const newStatuses = [...prev.charStatuses]
          if (newStatuses[newIndex] === 'correct') {
            correctCharsRef.current = Math.max(0, correctCharsRef.current - 1)
          }
          newStatuses[newIndex] = 'pending'
          return {
            ...prev,
            input: prev.input.slice(0, -1),
            charStatuses: newStatuses,
            currentIndex: newIndex,
          }
        }

        if (key.length > 1 && key !== 'Tab' && key !== 'Enter') return prev

        const actualKey = key === 'Enter' ? '\n' : key === 'Tab' ? '  ' : key

        if (key === 'Tab') {
          let newState = { ...prev }
          for (const char of actualKey) {
            if (newState.currentIndex >= codeRef.current.length) break
            const idx = newState.currentIndex
            const isCorrect = char === codeRef.current[idx]
            const newStatuses = [...newState.charStatuses]
            newStatuses[idx] = isCorrect ? 'correct' : 'incorrect'
            totalKeypressesRef.current++
            rawCharsRef.current++
            if (isCorrect) {
              correctCharsRef.current++
            } else {
              errorsRef.current++
            }
            const isFirst = newState.status === 'idle'
            if (isFirst) {
              startTimeRef.current = Date.now()
            }
            newState = {
              ...newState,
              input: newState.input + char,
              charStatuses: newStatuses,
              currentIndex: idx + 1,
              errors: errorsRef.current,
              status: isFirst ? 'running' : newState.status,
              startTime: startTimeRef.current,
            }
          }
          if (newState.currentIndex >= codeRef.current.length) {
            newState.status = 'finished'
            onFinish?.()
          }
          return newState
        }

        // Enter: process \n then auto-skip leading whitespace on next line
        if (key === 'Enter') {
          const idx = prev.currentIndex
          if (idx >= codeRef.current.length) return prev

          const expected = codeRef.current[idx]
          const isCorrect = actualKey === expected
          const newStatuses = [...prev.charStatuses]
          newStatuses[idx] = isCorrect ? 'correct' : 'incorrect'

          totalKeypressesRef.current++
          rawCharsRef.current++
          if (isCorrect) correctCharsRef.current++
          else errorsRef.current++

          const isFirst = prev.status === 'idle'
          if (isFirst) startTimeRef.current = Date.now()

          let newIndex = idx + 1
          let newInput = prev.input + actualKey

          // Auto-skip leading whitespace (not counted in WPM/accuracy)
          if (isCorrect) {
            while (newIndex < codeRef.current.length && (codeRef.current[newIndex] === ' ' || codeRef.current[newIndex] === '\n' || codeRef.current[newIndex] === '\t')) {
              newStatuses[newIndex] = 'correct'
              newInput += codeRef.current[newIndex]
              newIndex++
            }
          }

          const isFinished = newIndex >= codeRef.current.length
          if (isFinished) onFinish?.()

          return {
            ...prev,
            input: newInput,
            charStatuses: newStatuses,
            currentIndex: newIndex,
            errors: errorsRef.current,
            status: isFinished ? 'finished' : isFirst ? 'running' : prev.status,
            startTime: startTimeRef.current,
          }
        }

        const idx = prev.currentIndex
        if (idx >= codeRef.current.length) return prev

        const expected = codeRef.current[idx]
        const isCorrect = actualKey === expected
        const newStatuses = [...prev.charStatuses]
        newStatuses[idx] = isCorrect ? 'correct' : 'incorrect'

        totalKeypressesRef.current++
        rawCharsRef.current++
        if (isCorrect) {
          correctCharsRef.current++
        } else {
          errorsRef.current++
        }

        const isFirst = prev.status === 'idle'
        if (isFirst) {
          startTimeRef.current = Date.now()
        }

        const newIndex = idx + 1
        const isFinished = newIndex >= codeRef.current.length

        if (isFinished) {
          onFinish?.()
        }

        return {
          ...prev,
          input: prev.input + actualKey,
          charStatuses: newStatuses,
          currentIndex: newIndex,
          errors: errorsRef.current,
          status: isFinished ? 'finished' : isFirst ? 'running' : prev.status,
          startTime: startTimeRef.current,
        }
      })
    },
    [onFinish]
  )

  const reset = useCallback(() => {
    errorsRef.current = 0
    totalKeypressesRef.current = 0
    correctCharsRef.current = 0
    rawCharsRef.current = 0
    startTimeRef.current = null
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (samplerRef.current) clearInterval(samplerRef.current)
    intervalRef.current = null
    samplerRef.current = null
    setState(createInitialState(codeRef.current.length))
    setWpm(0)
    setRawWpm(0)
    setAccuracy(100)
    setWpmSamples([])
    setRawWpmSamples([])
    wpmRef.current = 0
  }, [])

  return { state, wpm, rawWpm, accuracy, wpmSamples, rawWpmSamples, handleKey, reset, wpmRef }
}
