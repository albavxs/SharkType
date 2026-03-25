'use client'

import { useState, useCallback, useRef } from 'react'
import { CharStatus, TypingState } from '@/lib/types'
import { calculateWPM, calculateAccuracy } from '@/lib/utils'

interface UseTypingEngineReturn {
  state: TypingState
  wpm: number
  accuracy: number
  handleKey: (key: string) => void
  reset: () => void
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
  const codeRef = useRef(code)
  const errorsRef = useRef(0)
  const totalKeypressesRef = useRef(0)
  const correctCharsRef = useRef(0)

  if (codeRef.current !== code) {
    codeRef.current = code
    errorsRef.current = 0
    totalKeypressesRef.current = 0
    correctCharsRef.current = 0
    setState(createInitialState(code.length))
  }

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

        // Ignore special keys
        if (key.length > 1 && key !== 'Tab' && key !== 'Enter') return prev

        const actualKey = key === 'Enter' ? '\n' : key === 'Tab' ? '  ' : key

        // For Tab (2 spaces), handle each space
        if (key === 'Tab') {
          let newState = { ...prev }
          for (const char of actualKey) {
            if (newState.currentIndex >= codeRef.current.length) break
            const idx = newState.currentIndex
            const isCorrect = char === codeRef.current[idx]
            const newStatuses = [...newState.charStatuses]
            newStatuses[idx] = isCorrect ? 'correct' : 'incorrect'
            totalKeypressesRef.current++
            if (isCorrect) {
              correctCharsRef.current++
            } else {
              errorsRef.current++
            }
            newState = {
              ...newState,
              input: newState.input + char,
              charStatuses: newStatuses,
              currentIndex: idx + 1,
              errors: errorsRef.current,
              status: newState.status === 'idle' ? 'running' : newState.status,
              startTime: newState.startTime ?? Date.now(),
            }
          }
          if (newState.currentIndex >= codeRef.current.length) {
            newState.status = 'finished'
            onFinish?.()
          }
          return newState
        }

        const idx = prev.currentIndex
        if (idx >= codeRef.current.length) return prev

        const expected = codeRef.current[idx]
        const isCorrect = actualKey === expected
        const newStatuses = [...prev.charStatuses]
        newStatuses[idx] = isCorrect ? 'correct' : 'incorrect'

        totalKeypressesRef.current++
        if (isCorrect) {
          correctCharsRef.current++
        } else {
          errorsRef.current++
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
          status: isFinished
            ? 'finished'
            : prev.status === 'idle'
              ? 'running'
              : prev.status,
          startTime: prev.startTime ?? Date.now(),
        }
      })
    },
    [onFinish]
  )

  const reset = useCallback(() => {
    errorsRef.current = 0
    totalKeypressesRef.current = 0
    correctCharsRef.current = 0
    setState(createInitialState(codeRef.current.length))
  }, [])

  const elapsed = state.startTime ? Date.now() - state.startTime : 0
  const wpm = calculateWPM(correctCharsRef.current, elapsed)
  const accuracy = calculateAccuracy(
    correctCharsRef.current,
    totalKeypressesRef.current
  )

  return { state, wpm, accuracy, handleKey, reset }
}
