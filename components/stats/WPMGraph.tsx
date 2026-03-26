interface WPMGraphProps {
  netSamples: number[]
  rawSamples: number[]
}

export default function WPMGraph({ netSamples, rawSamples }: WPMGraphProps) {
  if (netSamples.length < 2) return null

  const allValues = [...netSamples, ...rawSamples]
  const maxWPM = Math.max(...allValues, 1)
  const width = 400
  const height = 200
  const pad = 4

  function toPath(samples: number[]): string {
    const points = samples.map((wpm, i) => {
      const x = pad + (i / (samples.length - 1)) * (width - pad * 2)
      const y = height - pad - (wpm / maxWPM) * (height - pad * 2)
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

  const lastNetX = pad + ((netSamples.length - 1) / (netSamples.length - 1)) * (width - pad * 2)
  const firstNetX = pad
  const areaPath = `${netPath} L ${lastNetX} ${height - pad} L ${firstNetX} ${height - pad} Z`

  const yLabels = [0, Math.round(maxWPM / 2), maxWPM]

  return (
    <div className="w-full animate-fade-in relative">
      {/* Y-axis labels as HTML to avoid SVG distortion */}
      <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between py-1 pointer-events-none" style={{ width: '2rem' }}>
        {[...yLabels].reverse().map((v, i) => (
          <span key={i} className="text-[10px] text-right pr-1 leading-none" style={{ color: 'var(--sub)' }}>{v}</span>
        ))}
      </div>

      {/* Grid lines + chart */}
      <div className="ml-8">
        <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full h-28 sm:h-40 md:h-48 block">
          {yLabels.map((v, i) => {
            const y = height - pad - (v / maxWPM) * (height - pad * 2)
            return <line key={i} x1={0} y1={y} x2={width} y2={y} stroke="var(--sub)" strokeWidth="0.5" strokeOpacity="0.3" />
          })}

          <path d={areaPath} fill="url(#netGradient)" />

          <defs>
            <linearGradient id="netGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--main)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--main)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {rawPath && (
            <path d={rawPath} fill="none" stroke="var(--sub)" strokeWidth="1.5" strokeDasharray="6 3" strokeOpacity="0.4" />
          )}

          <path d={netPath} fill="none" stroke="var(--main)" strokeWidth="2.5" strokeLinecap="round" />

          {netSamples.length > 0 && (() => {
            const lastX = pad + ((netSamples.length - 1) / (netSamples.length - 1)) * (width - pad * 2)
            const lastY = height - pad - (netSamples[netSamples.length - 1] / maxWPM) * (height - pad * 2)
            return <circle cx={lastX} cy={lastY} r="5" fill="var(--main)" />
          })()}
        </svg>
      </div>
    </div>
  )
}
