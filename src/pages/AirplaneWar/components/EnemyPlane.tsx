interface EnemyPlaneProps {
  x: number
  y: number
  width: number
  height: number
  type: 'normal' | 'fast' | 'tank'
  hp: number
  maxHp: number
}

export function EnemyPlane({ x, y, width, height, type, hp, maxHp }: EnemyPlaneProps) {
  const centerX = x + width / 2
  const centerY = y + height / 2
  
  // 根据类型设置颜色
  const getColors = () => {
    switch (type) {
      case 'fast':
        return { main: '#f87171', dark: '#dc2626', light: '#fca5a5' }
      case 'tank':
        return { main: '#a78bfa', dark: '#7c3aed', light: '#c4b5fd' }
      default:
        return { main: '#94a3b8', dark: '#475569', light: '#cbd5e1' }
    }
  }
  
  const colors = getColors()
  
  return (
    <g>
      {/* HP 条背景 */}
      {hp < maxHp && (
        <>
          <rect x={x} y={y - 10} width={width} height={4} fill="#ef4444" rx={2} />
          <rect x={x} y={y - 10} width={width * (hp / maxHp)} height={4} fill="#22c55e" rx={2} />
        </>
      )}
      
      {/* 敌机主体 - 倒三角形设计 */}
      <path
        d={`M ${centerX} ${y + height} L ${x} ${y + 5} L ${centerX} ${y + 15} L ${x + width} ${y + 5} Z`}
        fill={colors.main}
        stroke={colors.dark}
        strokeWidth={1.5}
      />
      
      {/* 左翼 */}
      <path
        d={`M ${centerX} ${y + 20} L ${x - 5} ${y + 8} L ${x + 5} ${y + 12} L ${centerX - 3} ${y + 22} Z`}
        fill={colors.dark}
      />
      
      {/* 右翼 */}
      <path
        d={`M ${centerX} ${y + 20} L ${x + width + 5} ${y + 8} L ${x + width - 5} ${y + 12} L ${centerX + 3} ${y + 22} Z`}
        fill={colors.dark}
      />
      
      {/* 驾驶舱 */}
      <ellipse
        cx={centerX}
        cy={y + 10}
        rx={3}
        ry={5}
        fill="#fef08a"
      />
      <ellipse
        cx={centerX}
        cy={y + 10}
        rx={1.5}
        ry={3}
        fill="#f97316"
        opacity={0.8}
      />
      
      {/* 机身装饰 */}
      <path
        d={`M ${centerX} ${y + 18} L ${centerX} ${y + height - 5}`}
        stroke={colors.light}
        strokeWidth={1}
        opacity={0.6}
      />
      
      {/* 类型标记 */}
      {type === 'tank' && (
        <circle cx={centerX} cy={y + height - 8} r={3} fill="#f59e0b" />
      )}
      {type === 'fast' && (
        <path
          d={`M ${centerX - 3} ${y + height - 10} L ${centerX} ${y + height - 5} L ${centerX + 3} ${y + height - 10}`}
          fill="none"
          stroke="#fbbf24"
          strokeWidth={2}
        />
      )}
    </g>
  )
}
