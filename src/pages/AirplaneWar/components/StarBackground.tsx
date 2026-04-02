interface Star {
  x: number
  y: number
  size: number
  speed: number
  opacity: number
}

interface StarBackgroundProps {
  width: number
  height: number
  offset: number
}

// 生成固定的星星
function generateStars(count: number, width: number, height: number): Star[] {
  const stars: Star[] = []
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.5 + 0.2,
      opacity: Math.random() * 0.5 + 0.3,
    })
  }
  return stars
}

// 缓存星星位置
const starCache = new Map<string, Star[]>()

export function StarBackground({ width, height, offset }: StarBackgroundProps) {
  const cacheKey = `${width}-${height}`
  
  if (!starCache.has(cacheKey)) {
    starCache.set(cacheKey, generateStars(60, width, height))
  }
  
  const stars = starCache.get(cacheKey)!
  
  return (
    <g>
      {/* 深空背景 */}
      <rect x={0} y={0} width={width} height={height} fill="#0f172a" />
      
      {/* 星星 */}
      {stars.map((star, i) => {
        const y = (star.y + offset * star.speed) % height
        return (
          <circle
            key={i}
            cx={star.x}
            cy={y}
            r={star.size}
            fill="#e2e8f0"
            opacity={star.opacity}
          />
        )
      })}
      
      {/* 远处的星云效果 */}
      <ellipse
        cx={width * 0.2}
        cy={height * 0.3}
        rx={100}
        ry={60}
        fill="#4c1d95"
        opacity={0.1}
      />
      <ellipse
        cx={width * 0.8}
        cy={height * 0.7}
        rx={80}
        ry={50}
        fill="#1e3a8a"
        opacity={0.08}
      />
    </g>
  )
}
