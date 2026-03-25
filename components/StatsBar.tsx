import { ClockIcon } from '@/components/icons'
import { formatTime } from '@/lib/utils'

interface StatsBarProps {
  wpm: number
  accuracy: number
  seconds: number
  isRunning?: boolean
}

export default function StatsBar({ wpm, accuracy, seconds, isRunning }: StatsBarProps) {
  return (
    <div className="flex items-end gap-8 font-[family-name:var(--font-geist-sans)]">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold text-white light:text-black tabular-nums">{wpm}</span>
          {isRunning && (
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          )}
        </div>
        <span className="text-xs text-neutral-500 light:text-neutral-400">WPM</span>
      </div>
      <div>
        <span className="text-xl font-semibold text-white light:text-black tabular-nums">{accuracy}%</span>
        <div className="text-xs text-neutral-500 light:text-neutral-400">Precisao</div>
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <ClockIcon size={14} className="text-neutral-500 light:text-neutral-400" />
          <span className="text-xl font-semibold text-white light:text-black tabular-nums">{formatTime(seconds)}</span>
        </div>
        <div className="text-xs text-neutral-500 light:text-neutral-400">Tempo</div>
      </div>
    </div>
  )
}
