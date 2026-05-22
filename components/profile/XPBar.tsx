import { getLevel } from '@/lib/gamification'

interface XPBarProps {
  totalXP: number
  accent?: string
}

export default function XPBar({ totalXP, accent = 'var(--main)' }: XPBarProps) {
  const info = getLevel(totalXP)
  const xpInLevel = info.currentXP - (info.nextLevelXP - (info.nextLevelXP - info.currentXP))
  // Simpler: percent ja vem calculado em getLevel
  return (
    <div className="w-full space-y-1.5">
      <div className="flex items-center justify-between text-xs" style={{ color: 'var(--sub)' }}>
        <span>Level {info.level}</span>
        <span className="tabular-nums">{info.currentXP} / {info.nextLevelXP} XP</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full" style={{ backgroundColor: 'color-mix(in srgb, var(--sub) 20%, transparent)' }}>
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{ width: `${info.percent}%`, backgroundColor: accent }}
        />
      </div>
    </div>
  )
}
