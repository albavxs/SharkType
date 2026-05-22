'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { t, type Locale } from '@/lib/i18n'
import type { Achievement } from './BadgeGrid'

interface AchievementToastProps {
  /** Lista de achievements desbloqueados na ultima sessao. Toast mostra um por vez (queue). */
  newlyUnlocked: Achievement[]
  locale: Locale
}

export default function AchievementToast({ newlyUnlocked, locale }: AchievementToastProps) {
  const [queue, setQueue] = useState<Achievement[]>([])
  const [current, setCurrent] = useState<Achievement | null>(null)

  // Adiciona novos achievements ao queue quando a prop muda
  useEffect(() => {
    if (newlyUnlocked.length > 0) {
      setQueue(q => [...q, ...newlyUnlocked])
    }
  }, [newlyUnlocked])

  // Processa queue: mostra 1 por vez, 3s cada
  useEffect(() => {
    if (current || queue.length === 0) return
    const next = queue[0]
    setCurrent(next)
    setQueue(q => q.slice(1))
    const timeout = setTimeout(() => setCurrent(null), 3000)
    return () => clearTimeout(timeout)
  }, [queue, current])

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 40, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 220, damping: 22 }}
          className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
        >
          <div
            className="flex items-center gap-3 rounded-2xl px-5 py-4 shadow-2xl"
            style={{
              backgroundColor: 'var(--sub-alt)',
              border: '2px solid var(--main)',
              boxShadow: '0 18px 40px color-mix(in srgb, var(--main) 35%, transparent)',
            }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ backgroundColor: 'color-mix(in srgb, var(--main) 20%, transparent)', color: 'var(--main)' }}>
              <span className="text-2xl">🏆</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--main)' }}>
                {t('achievementUnlocked', locale)}
              </span>
              <span className="text-base font-bold" style={{ color: 'var(--text)' }}>
                {current.name[locale]}
              </span>
              <span className="text-xs" style={{ color: 'var(--sub)' }}>
                {current.description[locale]}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
