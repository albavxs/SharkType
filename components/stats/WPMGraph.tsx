'use client'

interface WPMGraphProps {
  primarySamples: number[]
  secondarySamples?: number[]
  leftAxisLabel?: string
  animate?: boolean
}

export default function WPMGraph({
  primarySamples,
  secondarySamples = [],
  leftAxisLabel,
  animate = false,
}: WPMGraphProps) {
  if (primarySamples.length < 2) return null

  const allValues = [...primarySamples, ...secondarySamples]
  const maxWPM = Math.max(...allValues, 10)
  // Round up to a nice number for Y-axis
  const yMax = Math.ceil(maxWPM / 10) * 10
  const width = 500
  const height = 220
  const padLeft = 4
  const padRight = 4
  const padTop = 8
  const padBottom = 24

  const chartW = width - padLeft - padRight
  const chartH = height - padTop - padBottom

  function toPoints(samples: number[]) {
    return samples.map((wpm, i) => {
      const x = padLeft + (i / (samples.length - 1)) * chartW
      const y = padTop + chartH - (wpm / yMax) * chartH
      return { x, y }
    })
  }

  function toSmoothPath(points: { x: number; y: number }[]): string {
    let d = `M ${points[0].x} ${points[0].y}`
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1]
      const curr = points[i]
      const cpx = (prev.x + curr.x) / 2
      d += ` Q ${cpx} ${prev.y} ${curr.x} ${curr.y}`
    }
    return d
  }

  const netPoints = toPoints(primarySamples)
  const rawPoints = secondarySamples.length >= 2 ? toPoints(secondarySamples) : []
  const netPath = toSmoothPath(netPoints)
  const rawPath = rawPoints.length >= 2 ? toSmoothPath(rawPoints) : ''

  // Area fill under net line
  const lastPt = netPoints[netPoints.length - 1]
  const firstPt = netPoints[0]
  const areaPath = `${netPath} L ${lastPt.x} ${padTop + chartH} L ${firstPt.x} ${padTop + chartH} Z`

  // Y-axis ticks
  const yTickCount = 4
  const yTicks = Array.from({ length: yTickCount + 1 }, (_, i) => Math.round((yMax / yTickCount) * i))

  // X-axis labels (seconds)
  const totalSeconds = primarySamples.length
  const xLabelStep = totalSeconds <= 10 ? 1 : totalSeconds <= 30 ? 5 : totalSeconds <= 60 ? 10 : 30
  const xLabels: number[] = []
  for (let s = 0; s <= totalSeconds - 1; s += xLabelStep) {
    xLabels.push(s)
  }
  // Always include last
  if (xLabels[xLabels.length - 1] !== totalSeconds - 1) {
    xLabels.push(totalSeconds - 1)
  }

  return (
    <div className="w-full animate-fade-in relative">
      <div className="flex">
        {/* Y-axis labels (left) */}
        <div className="flex flex-col justify-between shrink-0 py-1 pr-1" style={{ height: '12rem', paddingTop: `${padTop}px`, paddingBottom: `${padBottom}px` }}>
          {leftAxisLabel ? (
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--sub)', writingMode: 'vertical-rl', transform: 'rotate(180deg)', height: '100%', alignSelf: 'center' }}>
              {leftAxisLabel}
            </span>
          ) : null}
          {[...yTicks].reverse().map((v, i) => (
            <span key={i} className="text-[9px] sm:text-[10px] tabular-nums leading-none text-right" style={{ color: 'var(--sub)', minWidth: '1.5rem' }}>{v}</span>
          ))}
        </div>

        {/* Chart */}
        <div className="flex-1 min-w-0">
          <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full block" style={{ height: '12rem' }}>
            <defs>
              <linearGradient id="netGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--main)" stopOpacity="0.2" />
                <stop offset="100%" stopColor="var(--main)" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Horizontal grid lines */}
            {yTicks.map((v, i) => {
              const y = padTop + chartH - (v / yMax) * chartH
              return <line key={i} x1={padLeft} y1={y} x2={width - padRight} y2={y} stroke="var(--sub)" strokeWidth="0.5" strokeOpacity="0.2" />
            })}

            {/* Vertical grid lines at X labels */}
            {xLabels.map((s, i) => {
              const x = padLeft + (s / (totalSeconds - 1)) * chartW
              return <line key={i} x1={x} y1={padTop} x2={x} y2={padTop + chartH} stroke="var(--sub)" strokeWidth="0.5" strokeOpacity="0.15" />
            })}

            {/* Area fill */}
            <path
              d={areaPath}
              fill="url(#netGradient)"
              style={{
                opacity: animate ? 1 : 0,
                transition: 'opacity 260ms ease 220ms',
              }}
            />

            {/* Raw WPM line — solid, sub color */}
            {rawPath && (
              <path
                d={rawPath}
                pathLength={1}
                fill="none"
                stroke="var(--sub)"
                strokeWidth="1.5"
                strokeOpacity="0.5"
                strokeLinecap="round"
                strokeDasharray={1}
                strokeDashoffset={animate ? 0 : 1}
                style={{
                  opacity: animate ? 1 : 0,
                  transition: 'stroke-dashoffset 420ms cubic-bezier(0.22, 1, 0.36, 1) 160ms, opacity 220ms ease 160ms',
                }}
              />
            )}

            {/* Net WPM line — main color */}
            <path
              d={netPath}
              pathLength={1}
              fill="none"
              stroke="var(--main)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={1}
              strokeDashoffset={animate ? 0 : 1}
              style={{
                opacity: animate ? 1 : 0.35,
                transition: 'stroke-dashoffset 460ms cubic-bezier(0.22, 1, 0.36, 1) 220ms, opacity 220ms ease 220ms',
              }}
            />

            {/* Data point dots on net line */}
            {netPoints.map((pt, i) => (
              <circle
                key={i}
                cx={pt.x}
                cy={pt.y}
                r="2.5"
                fill="var(--main)"
                opacity={animate ? 0.6 : 0}
                style={{
                  transition: `opacity 180ms ease ${280 + (i * 12)}ms`,
                }}
              />
            ))}

            {/* End point highlight */}
            <circle
              cx={lastPt.x}
              cy={lastPt.y}
              r="4"
              fill="var(--main)"
              opacity={animate ? 1 : 0}
              style={{
                transition: 'opacity 220ms ease 420ms',
              }}
            />

            {/* X-axis labels */}
            {xLabels.map((s, i) => {
              const x = padLeft + (s / (totalSeconds - 1)) * chartW
              return (
                <text key={i} x={x} y={height - 4} textAnchor="middle" fontSize="9" fill="var(--sub)" opacity="0.6">
                  {s + 1}
                </text>
              )
            })}
          </svg>
        </div>
      </div>
    </div>
  )
}
