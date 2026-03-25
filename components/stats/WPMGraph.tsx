interface WPMGraphProps {
  netSamples: number[]
  rawSamples: number[]
}

export default function WPMGraph({ netSamples, rawSamples }: WPMGraphProps) {
  if (netSamples.length < 2) return null

  const allValues = [...netSamples, ...rawSamples]
  const maxWPM = Math.max(...allValues, 1)
  const width = 400
  const height = 160
  const padX = 30
  const padY = 10

  function toPath(samples: number[]): string {
    const points = samples.map((wpm, i) => {
      const x = padX + (i / (samples.length - 1)) * (width - padX * 2)
      const y = height - padY - (wpm / maxWPM) * (height - padY * 2)
      return { x, y }
    })

    let d = `M ${points[0].x} ${points[0].y}`
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1]
      const curr = points[i]
      const cpx = (prev.x + curr.x) / 2
      d += ` Q ${cpx} ${prev.y} ${curr.x} ${curr.y}`
    }
    return d
  }

  const netPath = toPath(netSamples)
  const rawPath = rawSamples.length >= 2 ? toPath(rawSamples) : ''

  // Area fill for net
  const lastNetX = padX + ((netSamples.length - 1) / (netSamples.length - 1)) * (width - padX * 2)
  const firstNetX = padX
  const areaPath = `${netPath} L ${lastNetX} ${height - padY} L ${firstNetX} ${height - padY} Z`

  // Y axis labels
  const yLabels = [0, Math.round(maxWPM / 2), maxWPM]

  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full h-40">
        {/* Grid lines */}
        {yLabels.map((v, i) => {
          const y = height - padY - (v / maxWPM) * (height - padY * 2)
          return (
            <g key={i}>
              <line x1={padX} y1={y} x2={width - padX} y2={y} stroke="currentColor" className="text-neutral-800" strokeWidth="0.5" />
              <text x={padX - 4} y={y + 3} textAnchor="end" className="text-neutral-600 fill-current" fontSize="8">{v}</text>
            </g>
          )
        })}

        {/* Area fill */}
        <path d={areaPath} fill="url(#netGradient)" />

        {/* Gradient def */}
        <defs>
          <linearGradient id="netGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Raw WPM line */}
        {rawPath && (
          <path d={rawPath} fill="none" stroke="#525252" strokeWidth="1" strokeDasharray="4 2" />
        )}

        {/* Net WPM line */}
        <path d={netPath} fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />

        {/* End dot */}
        {netSamples.length > 0 && (() => {
          const lastX = padX + ((netSamples.length - 1) / (netSamples.length - 1)) * (width - padX * 2)
          const lastY = height - padY - (netSamples[netSamples.length - 1] / maxWPM) * (height - padY * 2)
          return <circle cx={lastX} cy={lastY} r="3" fill="#6366f1" />
        })()}
      </svg>
    </div>
  )
}
