interface ProgressBarProps {
  current: number
  total: number
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percent = total > 0 ? (current / total) * 100 : 0

  return (
    <div className="w-full h-0.5 bg-neutral-800 light:bg-neutral-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-white light:bg-black transition-all duration-100 ease-out"
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}
