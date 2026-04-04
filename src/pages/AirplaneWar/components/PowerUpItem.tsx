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
        return { main: '#22c55e', light: '#86efac', glow: '#4ade80', label: '回血' }
      case 'power':
        return { main: '#f59e0b', light: '#fcd34d', glow: '#fbbf24', label: '火力' }
      case 'shield':
        return { main: '#3b82f6', light: '#93c5fd', glow: '#60a5fa', label: '护盾' }
    }
  }
  
  const colors = getColors()

  const getIcon = () => {
    switch (type) {
      case 'heal':
        return (
          <g>
            {/* 医疗十字 */}
            <rect x={centerX - 8} y={centerY - 2} width={16} height={4} fill="white" rx={1} />
            <rect x={centerX - 2} y={centerY - 8} width={4} height={16} fill="white" rx={1} />
            {/* 心跳线 */}
            <polyline 
              points={`${centerX - 12},${centerY + 8} ${centerX - 6},${centerY + 8} ${centerX - 3},${centerY + 4} ${centerX},${centerY + 10} ${centerX + 3},${centerY + 4} ${centerX + 6},${centerY + 8} ${centerX + 12},${centerY + 8}`}
              fill="none"
              stroke={colors.light}
              strokeWidth={1.5}
              opacity={0.8}
            />
          </g>
        )
      case 'power':
        return (
          <g>
            {/* 闪电 */}
            <path 
              d={`M ${centerX - 2} ${centerY - 8} L ${centerX + 4} ${centerY - 8} L ${centerX - 1} ${centerY} L ${centerX + 5} ${centerY} L ${centerX - 4} ${centerY + 8} L ${centerX - 1} ${centerY} L ${centerX - 7} ${centerY} Z`}
              fill="white"
            />
            {/* 火花 */}
            <circle cx={centerX + 8} cy={centerY - 6} r={2} fill={colors.light}>
              <animate attributeName="r" values="1;3;1" dur="0.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;0;1" dur="0.5s" repeatCount="indefinite" />
            </circle>
          </g>
        )
      case 'shield':
        return (
          <g>
            {/* 盾牌 */}
            <path
              d={`M ${centerX} ${centerY - 8} 
                  Q ${centerX + 8} ${centerY - 4} ${centerX + 8} ${centerY + 2} 
                  Q ${centerX + 8} ${centerY + 8} ${centerX} ${centerY + 10} 
                  Q ${centerX - 8} ${centerY + 8} ${centerX - 8} ${centerY + 2} 
                  Q ${centerX - 8} ${centerY - 4} ${centerX} ${centerY - 8}`}
              fill="white"
            />
            {/* 盾牌高光 */}
            <path
              d={`M ${centerX} ${centerY - 6} 
                  Q ${centerX + 5} ${centerY - 3} ${centerX + 5} ${centerY + 2} 
                  Q ${centerX + 5} ${centerY + 6} ${centerX} ${centerY + 7}`}
              fill="none"
              stroke={colors.main}
              strokeWidth={2}
            />
          </g>
        )
    }
  }

  return (
    <g>
      {/* 外发光 - 脉冲效果 */}
      <circle
        cx={centerX}
        cy={centerY}
        r={size / 2 + 5}
        fill={colors.glow}
        opacity={0.4}
      >
        <animate attributeName="r" values={`${size / 2 + 3};${size / 2 + 6};${size / 2 + 3}`} dur="1s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0.2;0.4" dur="1s" repeatCount="indefinite" />
      </circle>
      
      {/* 主体 */}
      <circle
        cx={centerX}
        cy={centerY}
        r={size / 2}
        fill={colors.main}
        stroke={colors.light}
        strokeWidth={2}
      />
      
      {/* 内圈旋转 */}
      <g>
        <animateTransform 
          attributeName="transform" 
          type="rotate" 
          from={`0 ${centerX} ${centerY}`} 
          to={`360 ${centerX} ${centerY}`} 
          dur="3s" 
          repeatCount="indefinite" 
        />
        <circle
          cx={centerX}
          cy={centerY}
          r={size / 2 - 5}
          fill="none"
          stroke={colors.light}
          strokeWidth={1}
          strokeDasharray="4 4"
          opacity={0.6}
        />
      </g>
      
      {/* 图标 */}
      {getIcon()}
      
      {/* 标签文字 */}
      <text
        x={centerX}
        y={centerY + size / 2 + 12}
        textAnchor="middle"
        fill={colors.light}
        fontSize="9"
        fontWeight="bold"
      >
        {colors.label}
      </text>
    </g>
  )
}
