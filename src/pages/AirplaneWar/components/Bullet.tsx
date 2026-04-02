interface BulletProps {
  x: number
  y: number
  width: number
  height: number
  isPlayer?: boolean
}

export function BulletSvg({ x, y, width, height, isPlayer = true }: BulletProps) {
  const centerX = x + width / 2
  
  if (isPlayer) {
    return (
      <g>
        {/* 子弹主体 - 发光效果 */}
        <defs>
          <linearGradient id="bulletGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <filter id="bulletGlow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* 光晕 */}
        <ellipse
          cx={centerX}
          cy={y + height / 2}
          rx={width * 1.5}
          ry={height * 0.6}
          fill="#fbbf24"
          opacity={0.3}
          filter="url(#bulletGlow)"
        />
        
        {/* 子弹核心 */}
        <ellipse
          cx={centerX}
          cy={y + height / 2}
          rx={width / 2}
          ry={height / 2}
          fill="url(#bulletGradient)"
        />
        
        {/* 高光 */}
        <ellipse
          cx={centerX - 1}
          cy={y + height / 2 - 2}
          rx={width / 4}
          ry={height / 4}
          fill="#fefce8"
          opacity={0.8}
        />
      </g>
    )
  }
  
  // 敌机子弹
  return (
    <g>
      <ellipse
        cx={centerX}
        cy={y + height / 2}
        rx={width / 2}
        ry={height / 2}
        fill="#ef4444"
      />
      <ellipse
        cx={centerX}
        cy={y + height / 2}
        rx={width / 3}
        ry={height / 3}
        fill="#fca5a5"
      />
    </g>
  )
}
