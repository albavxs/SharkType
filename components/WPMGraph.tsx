interface WPMGraphProps {
  history: number[]
}

export default function WPMGraph({ history }: WPMGraphProps) {
  if (history.length < 2) return null

  const maxWPM = Math.max(...history, 1)
  const width = 200
  const height = 48
  const padding = 2

  const points = history.map((wpm, i) => {
    const x = padding + (i / (history.length - 1)) * (width - padding * 2)
    const y = height - padding - (wpm / maxWPM) * (height - padding * 2)
    return { x, y }
  })

  // Build smooth path using quadratic bezier
  let path = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const cpx = (prev.x + curr.x) / 2
    path += ` Q ${cpx} ${prev.y} ${curr.x} ${curr.y}`
  }

  // Area fill path
  const areaPath = `${path} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`

  return (
    <div className="w-full h-12 opacity-60">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full h-full">
        <path
          d={areaPath}
          className="fill-white/5 light:fill-black/5"
        />
        <path
          d={path}
          fill="none"
          className="stroke-white/40 light:stroke-black/40"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
