interface ExplosionEffectProps {
  x: number
  y: number
  size: number
  progress: number // 0 到 1
}

export function ExplosionEffect({ x, y, size, progress }: ExplosionEffectProps) {
  const centerX = x + size / 2
  const centerY = y + size / 2
  const maxRadius = size * 1.2
  const currentRadius = maxRadius * progress
  const alpha = 1 - progress
  
  return (
    <g>
      {/* 外层爆炸 */}
      <circle
        cx={centerX}
        cy={centerY}
        r={currentRadius}
        fill={`rgba(251, 191, 36, ${alpha * 0.5})`}
      />
      
      {/* 中层爆炸 */}
      <circle
        cx={centerX}
        cy={centerY}
        r={currentRadius * 0.7}
        fill={`rgba(239, 68, 68, ${alpha * 0.6})`}
      />
      
      {/* 内层爆炸 */}
      <circle
        cx={centerX}
        cy={centerY}
        r={currentRadius * 0.4}
        fill={`rgba(254, 252, 232, ${alpha})`}
      />
      
      {/* 爆炸碎片 */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const distance = currentRadius * 0.8
        const fragmentX = centerX + Math.cos(angle) * distance
        const fragmentY = centerY + Math.sin(angle) * distance
        
        return (
          <circle
            key={i}
            cx={fragmentX}
            cy={fragmentY}
            r={3 * (1 - progress)}
            fill={`rgba(251, 191, 36, ${alpha})`}
          />
        )
      })}
    </g>
  )
}
