interface BulletProps {
  x: number
  y: number
  width: number
  height: number
  isPlayerBullet?: boolean
}

export function BulletSvg({ x, y, width, height, isPlayerBullet = true }: BulletProps) {
  const centerX = x + width / 2
  
  if (isPlayerBullet) {
    // 玩家子弹 - 简化渲染，使用纯色
    return (
      <g>
        {/* 简单光晕 */}
        <ellipse
          cx={centerX}
          cy={y + height / 2}
          rx={width * 1.2}
          ry={height * 0.7}
          fill="#fbbf24"
          opacity={0.4}
        />
        
        {/* 子弹核心 - 纯色替代渐变 */}
        <ellipse
          cx={centerX}
          cy={y + height / 2}
          rx={width / 2}
          ry={height / 2}
          fill="#f59e0b"
        />
        
        {/* 简化高光 */}
        <ellipse
          cx={centerX}
          cy={y + height / 2 - 1}
          rx={width / 3}
          ry={height / 3}
          fill="#fef08a"
          opacity={0.9}
        />
      </g>
    )
  }
  
  // 敌机子弹 - 简化
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
        rx={width / 4}
        ry={height / 4}
        fill="#fca5a5"
      />
    </g>
  )
}
