interface PlayerPlaneProps {
  x: number
  y: number
  width: number
  height: number
  engineFrame?: number
}

export function PlayerPlane({ x, y, width, height, engineFrame = 0 }: PlayerPlaneProps) {
  const centerX = x + width / 2
  
  // 简化引擎火焰 - 使用预设值减少计算
  const flameIndex = engineFrame % 4
  const flameSizes = [12, 15, 18, 15]
  const flameHeight = flameSizes[flameIndex]
  
  return (
    <g>
      {/* 引擎火焰 - 简化 */}
      <ellipse
        cx={centerX}
        cy={y + height + flameHeight / 2 - 3}
        rx={8}
        ry={flameHeight / 2}
        fill="#f59e0b"
        opacity={0.7}
      />
      <ellipse
        cx={centerX}
        cy={y + height + flameHeight / 3 - 3}
        rx={4}
        ry={flameHeight / 3}
        fill="#fef3c7"
        opacity={0.9}
      />
      
      {/* 左翼 */}
      <path
        d={`M ${centerX} ${y + 15} L ${x} ${y + height - 10} L ${x + 8} ${y + height - 5} L ${centerX - 5} ${y + 25} Z`}
        fill="#3b82f6"
        stroke="#1d4ed8"
        strokeWidth={1}
      />
      
      {/* 右翼 */}
      <path
        d={`M ${centerX} ${y + 15} L ${x + width} ${y + height - 10} L ${x + width - 8} ${y + height - 5} L ${centerX + 5} ${y + 25} Z`}
        fill="#3b82f6"
        stroke="#1d4ed8"
        strokeWidth={1}
      />
      
      {/* 机身 */}
      <path
        d={`M ${centerX} ${y} L ${centerX - 8} ${y + height - 15} L ${centerX} ${y + height} L ${centerX + 8} ${y + height - 15} Z`}
        fill="#60a5fa"
        stroke="#2563eb"
        strokeWidth={1}
      />
      
      {/* 驾驶舱 */}
      <ellipse
        cx={centerX}
        cy={y + 18}
        rx={4}
        ry={8}
        fill="#1e3a8a"
      />
      <ellipse
        cx={centerX}
        cy={y + 18}
        rx={2}
        ry={5}
        fill="#60a5fa"
        opacity={0.6}
      />
      
      {/* 尾翼 */}
      <path
        d={`M ${centerX - 2} ${y + height - 12} L ${centerX - 10} ${y + height + 3} L ${centerX - 2} ${y + height - 5} Z`}
        fill="#2563eb"
      />
      <path
        d={`M ${centerX + 2} ${y + height - 12} L ${centerX + 10} ${y + height + 3} L ${centerX + 2} ${y + height - 5} Z`}
        fill="#2563eb"
      />
      
      {/* 机身高光 */}
      <path
        d={`M ${centerX - 3} ${y + 8} L ${centerX - 2} ${y + height - 20}`}
        stroke="#93c5fd"
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.7}
      />
    </g>
  )
}
