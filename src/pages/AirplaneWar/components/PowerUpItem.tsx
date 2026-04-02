interface PowerUpItemProps {
  x: number
  y: number
  size: number
  type: 'heal' | 'power' | 'shield'
}

export function PowerUpItem({ x, y, size, type }: PowerUpItemProps) {
  const centerX = x + size / 2
  const centerY = y + size / 2
  
  const getColors = () => {
    switch (type) {
      case 'heal':
        return { main: '#22c55e', light: '#86efac', glow: '#4ade80' }
      case 'power':
        return { main: '#f59e0b', light: '#fcd34d', glow: '#fbbf24' }
      case 'shield':
        return { main: '#3b82f6', light: '#93c5fd', glow: '#60a5fa' }
    }
  }
  
  const colors = getColors()
  
  const getIcon = () => {
    switch (type) {
      case 'heal':
        return (
          <path
            d={`M ${centerX} ${centerY - 6} L ${centerX} ${centerY + 6} M ${centerX - 6} ${centerY} L ${centerX + 6} ${centerY}`}
            stroke="white"
            strokeWidth={3}
            strokeLinecap="round"
          />
        )
      case 'power':
        return (
          <path
            d={`M ${centerX - 2} ${centerY - 6} L ${centerX + 4} ${centerY} L ${centerX - 2} ${centerY} L ${centerX + 2} ${centerY + 6} L ${centerX - 4} ${centerY} L ${centerX + 2} ${centerY} Z`}
            fill="white"
          />
        )
      case 'shield':
        return (
          <path
            d={`M ${centerX} ${centerY - 6} Q ${centerX + 6} ${centerY - 3} ${centerX + 6} ${centerY + 2} Q ${centerX + 6} ${centerY + 6} ${centerX} ${centerY + 6} Q ${centerX - 6} ${centerY + 6} ${centerX - 6} ${centerY + 2} Q ${centerX - 6} ${centerY - 3} ${centerX} ${centerY - 6}`}
            fill="none"
            stroke="white"
            strokeWidth={2}
          />
        )
    }
  }
  
  return (
    <g>
      {/* 外发光 */}
      <circle
        cx={centerX}
        cy={centerY}
        r={size / 2 + 3}
        fill={colors.glow}
        opacity={0.3}
      />
      
      {/* 主体 */}
      <circle
        cx={centerX}
        cy={centerY}
        r={size / 2}
        fill={colors.main}
        stroke={colors.light}
        strokeWidth={2}
      />
      
      {/* 内圈 */}
      <circle
        cx={centerX}
        cy={centerY}
        r={size / 2 - 4}
        fill="none"
        stroke={colors.light}
        strokeWidth={1}
        opacity={0.5}
      />
      
      {/* 图标 */}
      {getIcon()}
    </g>
  )
}
