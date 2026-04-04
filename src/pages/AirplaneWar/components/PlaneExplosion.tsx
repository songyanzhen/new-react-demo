import { useEffect, useState } from 'react'

interface PlaneExplosionProps {
  x: number
  y: number
  width: number
  height: number
  color?: string
  isBoss?: boolean
  onComplete?: () => void
}

export function PlaneExplosion({ x, y, width, height, color = '#ef4444', isBoss = false, onComplete }: PlaneExplosionProps) {
  const [frame, setFrame] = useState(0)
  const centerX = x + width / 2
  const centerY = y + height / 2
  
  // Boss爆炸持续时间更长，帧数更多
  const totalFrames = isBoss ? 40 : 20
  const frameDuration = isBoss ? 80 : 50 // 毫秒
  
  useEffect(() => {
    const timer = setInterval(() => {
      setFrame((f) => {
        if (f >= totalFrames) {
          clearInterval(timer)
          onComplete?.()
          return f
        }
        return f + 1
      })
    }, frameDuration)
    
    return () => clearInterval(timer)
  }, [onComplete, totalFrames, frameDuration])
  
  const progress = frame / totalFrames
  const mainRadius = (width / 2) * (0.5 + progress * (isBoss ? 4 : 2))
  const opacity = Math.max(0, 1 - progress * (isBoss ? 0.8 : 1))
  
  // 多层爆炸环
  const ringCount = isBoss ? 5 : 3
  const rings = Array.from({ length: ringCount }, (_, i) => ({
    radius: mainRadius * (0.3 + i * 0.2),
    delay: i * 0.1,
    color: i % 2 === 0 ? color : '#fbbf24',
  }))
  
  // 碎片数量根据是否是Boss调整
  const fragmentCount = isBoss ? 24 : 12
  const fragments = Array.from({ length: fragmentCount }, (_, i) => {
    const baseAngle = (i / fragmentCount) * Math.PI * 2
    const angleVariation = Math.sin(progress * Math.PI * 3) * 0.3
    const angle = baseAngle + angleVariation
    const speed = 2 + Math.random() * (isBoss ? 4 : 2)
    const distance = speed * frame * (isBoss ? 0.8 : 0.5)
    const size = isBoss ? 8 + Math.random() * 12 : 5 + Math.random() * 10
    return {
      x: centerX + Math.cos(angle) * distance,
      y: centerY + Math.sin(angle) * distance * 0.7, // 稍微扁平化
      size: size * (1 - progress * 0.5),
      rotation: angle * (180 / Math.PI) + frame * 10,
      color: ['#ef4444', '#f59e0b', '#fbbf24', '#fff'][i % 4],
    }
  })
  
  // 火花粒子
  const sparkCount = isBoss ? 40 : 20
  const sparks = Array.from({ length: sparkCount }, (_, i) => {
    const sparkAngle = (i / sparkCount) * Math.PI * 2 + Math.random() * 0.5
    const sparkSpeed = 3 + Math.random() * (isBoss ? 6 : 3)
    const sparkDistance = sparkSpeed * frame * (isBoss ? 0.6 : 0.4)
    return {
      x: centerX + Math.cos(sparkAngle) * sparkDistance,
      y: centerY + Math.sin(sparkAngle) * sparkDistance,
      size: 2 + Math.random() * 3,
      color: ['#fef08a', '#fbbf24', '#f59e0b', '#ef4444', '#fff'][i % 5],
    }
  })
  
  // 冲击波环 - Boss有多重
  const shockwaveCount = isBoss ? 3 : 1
  const shockwaves = Array.from({ length: shockwaveCount }, (_, i) => ({
    radius: mainRadius * (1 + i * 0.3),
    delay: i * 0.15,
  }))
  
  return (
    <g>
      {/* 多层爆炸环 */}
      {rings.map((ring, i) => {
        const ringProgress = Math.max(0, Math.min(1, (progress - ring.delay) / 0.6))
        if (ringProgress <= 0) return null
        return (
          <circle
            key={`ring-${i}`}
            cx={centerX}
            cy={centerY}
            r={ring.radius * ringProgress}
            fill={ring.color}
            opacity={opacity * 0.6 * (1 - i * 0.15)}
          />
        )
      })}
      
      {/* 核心强光 - Boss有脉冲效果 */}
      <circle
        cx={centerX}
        cy={centerY}
        r={mainRadius * 0.4}
        fill="#fff"
        opacity={isBoss ? opacity * (0.8 + Math.sin(progress * 10) * 0.2) : opacity}
      >
        {isBoss && (
          <animate
            attributeName="r"
            values={`${mainRadius * 0.3};${mainRadius * 0.5};${mainRadius * 0.3}`}
            dur="0.1s"
            repeatCount="indefinite"
          />
        )}
      </circle>
      
      {/* 爆炸碎片 */}
      {fragments.map((frag, i) => (
        <g key={`frag-${i}`}>
          <rect
            x={frag.x - frag.size / 2}
            y={frag.y - frag.size / 2}
            width={frag.size}
            height={frag.size}
            fill={frag.color}
            opacity={opacity}
            transform={`rotate(${frag.rotation} ${frag.x} ${frag.y})`}
          />
          {/* 碎片拖尾 */}
          <line
            x1={frag.x}
            y1={frag.y}
            x2={frag.x - Math.cos(frag.rotation * Math.PI / 180) * frag.size * 2}
            y2={frag.y - Math.sin(frag.rotation * Math.PI / 180) * frag.size * 2}
            stroke={frag.color}
            strokeWidth={2}
            opacity={opacity * 0.5}
          />
        </g>
      ))}
      
      {/* 火花粒子 */}
      {sparks.map((spark, i) => (
        <circle
          key={`spark-${i}`}
          cx={spark.x}
          cy={spark.y}
          r={spark.size * (1 - progress)}
          fill={spark.color}
          opacity={opacity}
        >
          <animate
            attributeName="r"
            values={`${spark.size};0`}
            dur={`${0.2 + Math.random() * 0.3}s`}
            fill="freeze"
          />
        </circle>
      ))}
      
      {/* 多重冲击波环 */}
      {shockwaves.map((wave, i) => {
        const waveProgress = Math.max(0, Math.min(1, (progress - wave.delay) / 0.5))
        if (waveProgress <= 0) return null
        return (
          <g key={`shock-${i}`}>
            <circle
              cx={centerX}
              cy={centerY}
              r={wave.radius}
              fill="none"
              stroke="#fff"
              strokeWidth={isBoss ? 4 - i : 3}
              opacity={opacity * 0.6 * (1 - waveProgress)}
            />
            <circle
              cx={centerX}
              cy={centerY}
              r={wave.radius * 0.8}
              fill="none"
              stroke={color}
              strokeWidth={isBoss ? 2 - i * 0.5 : 2}
              opacity={opacity * 0.4 * (1 - waveProgress)}
            />
          </g>
        )
      })}
      
      {/* Boss特殊效果 - 能量泄漏 */}
      {isBoss && progress < 0.5 && (
        <>
          {Array.from({ length: 8 }).map((_, i) => {
            const leakAngle = (i / 8) * Math.PI * 2 + progress * Math.PI
            const leakDistance = mainRadius * 0.3 + progress * mainRadius
            return (
              <line
                key={`leak-${i}`}
                x1={centerX + Math.cos(leakAngle) * leakDistance * 0.3}
                y1={centerY + Math.sin(leakAngle) * leakDistance * 0.3}
                x2={centerX + Math.cos(leakAngle) * leakDistance}
                y2={centerY + Math.sin(leakAngle) * leakDistance}
                stroke={color}
                strokeWidth={3}
                opacity={opacity * 0.6}
              >
                <animate
                  attributeName="opacity"
                  values="0.6;0;0.6"
                  dur={`${0.1 + i * 0.02}s`}
                  repeatCount="indefinite"
                />
              </line>
            )
          })}
        </>
      )}
    </g>
  )
}
