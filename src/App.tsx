import { useState } from 'react'
import './App.css'

// Types for wheel segments
type Segment = {
  label: string
  value: number | null // null for blank
  color: string
}

// Helper to generate random neon color
const randomNeonColor = () => {
  const neonColors = [
    '#39ff14', // neon green
    '#00eaff', // neon blue
    '#ff00de', // neon pink
    '#fff700', // neon yellow
    '#ff073a', // neon red
    '#00ffea', // neon cyan
    '#ff9900', // neon orange
    '#bc13fe', // neon purple
  ]
  return neonColors[Math.floor(Math.random() * neonColors.length)]
}

// Generate a new wheel with random prizes and blanks
function generateWheel(numSegments = 12) {
  const numPrizes = Math.floor(numSegments * 0.6)
  const numBlanks = numSegments - numPrizes
  const prizes = Array.from({ length: numPrizes }, () => {
    const value = Math.floor(Math.random() * 100) * 5 + 5 // $5 to $500
    return {
      label: `$${value}`,
      value,
      color: randomNeonColor(),
    }
  })
  const blanks = Array.from({ length: numBlanks }, () => ({
    label: '',
    value: null,
    color: randomNeonColor(),
  }))
  // Shuffle and return
  return [...prizes, ...blanks].sort(() => Math.random() - 0.5)
}

function App() {
  const [wheel, setWheel] = useState<Segment[]>(() => generateWheel())
  const [spinning, setSpinning] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  const [result, setResult] = useState<string | null>(null)

  // Spin the wheel
  const spin = () => {
    if (spinning) return
    setSpinning(true)
    setResult(null)
    const target = Math.floor(Math.random() * wheel.length)
    setSelected(target)
    setTimeout(() => {
      setSpinning(false)
      // Calculate the actual segment index after the wheel visually rotates
      // The pointer is always at the top (0 degrees), so the selected segment is:
      // (wheel.length - target) % wheel.length
      const segIndex = (wheel.length - target) % wheel.length
      const seg = wheel[segIndex]
      setResult(seg.value && seg.label ? `You won $${seg.value}!` : 'No prize, try again!')
    }, 3500)
  }

  // Reset the wheel
  const reset = () => {
    setWheel(generateWheel())
    setSelected(null)
    setResult(null)
  }

  // Wheel SVG rendering
  const size = 400
  const center = size / 2
  const radius = 170
  const segAngle = 360 / wheel.length

  return (
    <div className="neon-bg">
      <h1 className="neon-title">Neon Gambling Wheel</h1>
      <div className="wheel-container">
        <svg width={size} height={size} className={spinning ? 'spinning' : ''} style={{ transition: 'transform 3.5s cubic-bezier(.17,.67,.83,.67)', transform: selected !== null ? `rotate(${(360 * 5) + (360 - selected * segAngle - segAngle / 2)}deg)` : 'none' }}>
          <g transform={`translate(${center},${center})`}>
            {/* Add a dark background circle for contrast */}
            <circle cx={0} cy={0} r={radius + 8} fill="#181818" stroke="#fff" strokeWidth={4} />
            {wheel.map((seg, i) => {
              const startAngle = i * segAngle
              const endAngle = (i + 1) * segAngle
              const largeArc = segAngle > 180 ? 1 : 0
              const x1 = radius * Math.cos((Math.PI * startAngle) / 180)
              const y1 = radius * Math.sin((Math.PI * startAngle) / 180)
              const x2 = radius * Math.cos((Math.PI * endAngle) / 180)
              const y2 = radius * Math.sin((Math.PI * endAngle) / 180)
              return (
                <g key={i}>
                  <path
                    d={`M0,0 L${x1},${y1} A${radius},${radius} 0 ${largeArc} 1 ${x2},${y2} Z`}
                    fill={seg.color}
                    stroke="#fff"
                    strokeWidth={3}
                    filter="url(#neon-glow)"
                    opacity={selected === i ? 1 : 0.85}
                  />
                  {seg.label && (
                    <text
                      x={0.6 * radius * Math.cos((Math.PI * (startAngle + segAngle / 2)) / 180)}
                      y={0.6 * radius * Math.sin((Math.PI * (startAngle + segAngle / 2)) / 180)}
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      fontSize="1.3em"
                      fill="#fff"
                      stroke="#fff"
                      strokeWidth={0.5}
                      className="neon-text"
                    >
                      {seg.label}
                    </text>
                  )}
                </g>
              )
            })}
            <defs>
              <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#fff"/>
              </filter>
            </defs>
          </g>
        </svg>
        <div className="pointer">▼</div>
      </div>
      <div className="controls">
        <button className="neon-btn" onClick={spin} disabled={spinning}>Spin</button>
        <button className="neon-btn" onClick={reset} disabled={spinning}>Reset</button>
      </div>
      {result && <div className="result neon-text">{result}</div>}
    </div>
  )
}

export default App
