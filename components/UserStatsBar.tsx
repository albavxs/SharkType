'use client'

import { useEffect, useState } from 'react'
import { loadProgress, getLevel, UserProgress } from '@/lib/gamification'
import { FlameIcon } from '@/components/icons'

export default function UserStatsBar() {
  const [progress, setProgress] = useState<UserProgress | null>(null)

  useEffect(() => {
    const p = loadProgress()
    if (p.totalXP > 0) setProgress(p)
  }, [])

  if (!progress) return null

  const { level, percent } = getLevel(progress.totalXP)
  const langsUsed = Object.keys(progress.languages).length

  return (
    <div className="flex items-center gap-6 py-3 px-4 rounded-lg bg-neutral-900 light:bg-neutral-100 border border-neutral-800 light:border-neutral-200">
      {/* Level badge */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-indigo-500/20 flex items-center justify-center">
          <span className="text-xs font-bold text-indigo-400">{level}</span>
        </div>
        <div>
          <div className="text-xs font-medium text-white light:text-black">{progress.totalXP} XP</div>
          <div className="w-16 h-1 rounded-full bg-neutral-800 light:bg-neutral-200 mt-0.5">
            <div
              className="h-full bg-indigo-500 rounded-full"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Streak */}
      {progress.streak.current > 0 && (
        <div className="flex items-center gap-1 text-xs text-orange-400">
          <FlameIcon size={14} />
          <span>{progress.streak.current}d streak</span>
        </div>
      )}

      {/* Languages */}
      <span className="text-xs text-neutral-500 light:text-neutral-400">
        {langsUsed} linguagem{langsUsed !== 1 ? 's' : ''}
      </span>
    </div>
  )
}
