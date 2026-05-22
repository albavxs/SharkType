'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FlameIcon } from '@/components/icons'
import { t, type Locale } from '@/lib/i18n'

interface StreakToastProps {
  /** Valor atual de streak. Toast aparece quando o valor incrementa. */
  streak: number
  locale: Locale
}

/**
 * Mostra toast/overlay quando streak incrementa.
 * Detecta diff usando ref interna — caller passa o valor crudo.
 */
export default function StreakToast({ streak, locale }: StreakToastProps) {
  const [visible, setVisible] = useState(false)
  const [displayStreak, setDisplayStreak] = useState(streak)
  const [prev, setPrev] = useState(streak)

  useEffect(() => {
    if (streak > prev) {
      setDisplayStreak(streak)
      setVisible(true)
      const timeout = setTimeout(() => setVisible(false), 2500)
      setPrev(streak)
      return () => clearTimeout(timeout)
    }
    setPrev(streak)
  }, [streak, prev])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -40, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 240, damping: 20 }}
          className="pointer-events-none fixed left-1/2 top-6 z-50 -translate-x-1/2"
        >
          <div
            className="flex items-center gap-3 rounded-full px-5 py-3 shadow-2xl"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--main) 90%, var(--bg))',
              color: 'var(--bg)',
              boxShadow: '0 18px 40px color-mix(in srgb, var(--main) 35%, transparent)',
            }}
          >
            <motion.span
              animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1.2, 1.2, 1] }}
              transition={{ duration: 0.6 }}
            >
              <FlameIcon size={22} />
            </motion.span>
            <div className="flex flex-col">
              <span className="text-sm font-bold uppercase tracking-wider">
                {t('streakIncreased', locale)}
              </span>
              <span className="text-2xl font-bold tabular-nums leading-none">
                {displayStreak} {displayStreak === 1 ? t('dayStreak', locale) : t('daysStreak', locale)}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
