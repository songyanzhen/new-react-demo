interface EngineTrailProps {
  x: number
  y: number
  width: number
  color: string
  intensity?: number
}

// 引擎尾迹粒子
export function EngineTrail({ x, y, width, color, intensity = 1 }: EngineTrailProps) {
  const particles = Array.from({ length: Math.floor(5 * intensity) }, (_, i) => ({
    id: i,
    offsetX: (Math.random() - 0.5) * width * 0.5,
    size: 2 + Math.random() * 4,
    delay: i * 0.1,
  }))

  return (
    <g>
      {particles.map((p) => (
        <circle
          key={p.id}
          cx={x + p.offsetX}
          cy={y}
          r={p.size}
          fill={color}
          opacity={0.6 - p.id * 0.1}
        >
          <animate
            attributeName="cy"
            values={`${y};${y + 30}`}
            dur={`${0.5 + p.delay}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values={`${0.6 - p.id * 0.1};0`}
            dur={`${0.5 + p.delay}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="r"
            values={`${p.size};${p.size * 0.5}`}
            dur={`${0.5 + p.delay}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </g>
  )
}

interface MuzzleFlashProps {
  x: number
  y: number
  color?: string
}

// 枪口闪光
export function MuzzleFlash({ x, y, color = '#fbbf24' }: MuzzleFlashProps) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx={4} ry={8} fill={color} opacity={0.9}>
        <animate attributeName="ry" values="8;12;6" dur="0.1s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.9;0.3;0" dur="0.15s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx={x} cy={y + 3} rx={2} ry={4} fill="#fff" opacity={0.8}>
        <animate attributeName="opacity" values="0.8;0;0.8" dur="0.1s" repeatCount="indefinite" />
      </ellipse>
    </g>
  )
}

interface ShieldImpactProps {
  x: number
  y: number
  radius: number
  color?: string
}

// 护盾受击效果
export function ShieldImpact({ x, y, radius, color = '#3b82f6' }: ShieldImpactProps) {
  return (
    <g>
      <circle cx={x} cy={y} r={radius} fill="none" stroke={color} strokeWidth={2} opacity={0.8}>
        <animate attributeName="r" values={`${radius};${radius + 20}`} dur="0.3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;0" dur="0.3s" repeatCount="indefinite" />
      </circle>
      <circle cx={x} cy={y} r={radius * 0.7} fill="none" stroke={color} strokeWidth={1} opacity={0.6}>
        <animate attributeName="r" values={`${radius * 0.7};${radius + 15}`} dur="0.3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0" dur="0.3s" repeatCount="indefinite" />
      </circle>
      {/* 火花 */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i * 60 * Math.PI) / 180
        const x2 = x + Math.cos(angle) * (radius + 10)
        const y2 = y + Math.sin(angle) * (radius + 10)
        return (
          <line
            key={i}
            x1={x + Math.cos(angle) * radius}
            y1={y + Math.sin(angle) * radius}
            x2={x2}
            y2={y2}
            stroke="#fff"
            strokeWidth={2}
            opacity={0.8}
          >
            <animate attributeName="x2" values={`${x + Math.cos(angle) * radius};${x2}`} dur="0.2s" repeatCount="indefinite" />
            <animate attributeName="y2" values={`${y + Math.sin(angle) * radius};${y2}`} dur="0.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0" dur="0.2s" repeatCount="indefinite" />
          </line>
        )
      })}
    </g>
  )
}

interface EnergyFieldProps {
  x: number
  y: number
  width: number
  height: number
  color: string
  intensity?: number
}

// 能量场效果（用于Boss）
export function EnergyField({ x, y, width, height, color, intensity = 0.5 }: EnergyFieldProps) {
  const centerX = x + width / 2
  const centerY = y + height / 2

  return (
    <g>
      {/* 外圈脉冲 */}
      <ellipse
        cx={centerX}
        cy={centerY}
        rx={width / 2 + 15}
        ry={height / 2 + 15}
        fill="none"
        stroke={color}
        strokeWidth={2}
        opacity={intensity}
      >
        <animate
          attributeName="rx"
          values={`${width / 2 + 15};${width / 2 + 25};${width / 2 + 15}`}
          dur="1.5s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="ry"
          values={`${height / 2 + 15};${height / 2 + 25};${height / 2 + 15}`}
          dur="1.5s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values={`${intensity};${intensity * 0.3};${intensity}`}
          dur="1.5s"
          repeatCount="indefinite"
        />
      </ellipse>

      {/* 能量粒子 */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 45 + 22.5) * Math.PI / 180
        return (
          <circle
            key={i}
            cx={centerX + Math.cos(angle) * (width / 2 + 20)}
            cy={centerY + Math.sin(angle) * (height / 2 + 20)}
            r={3}
            fill={color}
            opacity={0.6}
          >
            <animate
              attributeName="cx"
              values={`${centerX + Math.cos(angle) * (width / 2 + 20)};${centerX + Math.cos(angle) * (width / 2 + 30)}`}
              dur={`${1 + i * 0.1}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="cy"
              values={`${centerY + Math.sin(angle) * (height / 2 + 20)};${centerY + Math.sin(angle) * (height / 2 + 30)}`}
              dur={`${1 + i * 0.1}s`}
              repeatCount="indefinite"
            />
            <animate attributeName="opacity" values="0.6;0;0.6" dur={`${1 + i * 0.1}s`} repeatCount="indefinite" />
          </circle>
        )
      })}
    </g>
  )
}

interface SparkBurstProps {
  x: number
  y: number
  count?: number
  color?: string
}

// 火花迸发效果
export function SparkBurst({ x, y, count = 8, color = '#fbbf24' }: SparkBurstProps) {
  return (
    <g>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2
        const distance = 10 + Math.random() * 15
        const x2 = x + Math.cos(angle) * distance
        const y2 = y + Math.sin(angle) * distance
        return (
          <line
            key={i}
            x1={x}
            y1={y}
            x2={x2}
            y2={y2}
            stroke={color}
            strokeWidth={1.5}
            opacity={0.8}
          >
            <animate attributeName="x2" values={`${x};${x2}`} dur="0.3s" repeatCount="indefinite" />
            <animate attributeName="y2" values={`${y};${y2}`} dur="0.3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0" dur="0.3s" repeatCount="indefinite" />
          </line>
        )
      })}
    </g>
  )
}

interface ScanLineProps {
  width: number
  height: number
}

// 扫描线效果（全局）
export function ScanLines({ width, height }: ScanLineProps) {
  return (
    <g opacity={0.03} pointerEvents="none">
      {Array.from({ length: Math.floor(height / 4) }).map((_, i) => (
        <line
          key={i}
          x1={0}
          y1={i * 4}
          x2={width}
          y2={i * 4}
          stroke="#000"
          strokeWidth={1}
        />
      ))}
    </g>
  )
}

interface VignetteProps {
  width: number
  height: number
}

// 暗角效果
export function Vignette({ width, height }: VignetteProps) {
  return (
    <defs>
      <radialGradient id="vignetteGrad" cx="50%" cy="50%" r="70%">
        <stop offset="50%" stopColor="rgba(0,0,0,0)" />
        <stop offset="85%" stopColor="rgba(0,0,0,0.2)" />
        <stop offset="100%" stopColor="rgba(0,0,0,0.5)" />
      </radialGradient>
    </defs>
  )
}
