'use client'

interface WPMGraphProps {
  primarySamples: number[]
  animate?: boolean
}

export default function WPMGraph({
  primarySamples,
  animate = false,
}: WPMGraphProps) {
  if (primarySamples.length < 2) return null

  const maxWPM = Math.max(...primarySamples, 10)
  const yMax = Math.ceil(maxWPM / 10) * 10
  const width = 500
  const height = 220
  const padLeft = 4
  const padRight = 4
  const padTop = 8
  const padBottom = 8

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
  const netPath = toSmoothPath(netPoints)

  const lastPt = netPoints[netPoints.length - 1]
  const firstPt = netPoints[0]
  const areaPath = `${netPath} L ${lastPt.x} ${padTop + chartH} L ${firstPt.x} ${padTop + chartH} Z`

  const horizontalLines = Array.from({ length: 4 }, (_, i) => padTop + (chartH / 3) * i)
  const verticalLines = Array.from({ length: 5 }, (_, i) => padLeft + (chartW / 4) * i)

  return (
    <div className="w-full animate-fade-in relative">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full block" style={{ height: '12rem' }}>
        <defs>
          <linearGradient id="netGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--main)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--main)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {horizontalLines.map((y, i) => (
          <line key={`h-${i}`} x1={padLeft} y1={y} x2={width - padRight} y2={y} stroke="var(--sub)" strokeWidth="0.5" strokeOpacity="0.2" />
        ))}

        {verticalLines.map((x, i) => (
          <line key={`v-${i}`} x1={x} y1={padTop} x2={x} y2={padTop + chartH} stroke="var(--sub)" strokeWidth="0.5" strokeOpacity="0.15" />
        ))}

        <path
          d={areaPath}
          fill="url(#netGradient)"
          style={{
            opacity: animate ? 1 : 0,
            transition: 'opacity 260ms ease 220ms',
          }}
        />

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
      </svg>
    </div>
  )
}
