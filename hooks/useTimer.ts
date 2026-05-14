'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

interface UseTimerReturn {
  seconds: number
  isRunning: boolean
  start: () => void
  stop: () => void
  reset: (newDuration?: number) => void
}

export function useTimer(
  initialSeconds: number,
  countdown: boolean,
  onEnd?: () => void
): UseTimerReturn {
  const [seconds, setSeconds] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const onEndRef = useRef(onEnd)

  useEffect(() => {
    onEndRef.current = onEnd
  }, [onEnd])

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const start = useCallback(() => {
    setIsRunning(true)
  }, [])

  const stop = useCallback(() => {
    setIsRunning(false)
    clear()
  }, [clear])

  const reset = useCallback(
    (newDuration?: number) => {
      clear()
      setIsRunning(false)
      setSeconds(newDuration ?? initialSeconds)
    },
    [clear, initialSeconds]
  )

  useEffect(() => {
    if (!isRunning) return

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (countdown) {
          const next = prev - 1
          if (next <= 0) {
            onEndRef.current?.()
            return 0
          }
          return next
        }
        return prev + 1
      })
    }, 1000)

    return clear
  }, [isRunning, countdown, clear])

  // Stop interval when countdown reaches 0
  useEffect(() => {
    if (countdown && seconds <= 0 && isRunning) {
      // Use a small delay or a ref to avoid cascading renders warning
      const timeoutId = setTimeout(() => {
        setIsRunning(false)
        clear()
      }, 0)
      return () => clearTimeout(timeoutId)
    }
  }, [countdown, seconds, isRunning, clear])

  return { seconds, isRunning, start, stop, reset }
}
