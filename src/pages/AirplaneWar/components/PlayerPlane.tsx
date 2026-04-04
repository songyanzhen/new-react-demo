interface PlayerPlaneProps {
  x: number
  y: number
  width: number
  height: number
  engineFrame?: number
  shield?: number
  isInvulnerable?: boolean
}

export function PlayerPlane({ 
  x, y, width, height, 
  engineFrame = 0, 
  shield = 0,
  isInvulnerable = false 
}: PlayerPlaneProps) {
  const centerX = x + width / 2
  const blinkOpacity = isInvulnerable ? 0.5 + Math.sin(engineFrame * 0.5) * 0.3 : 1
  
  // 引擎火焰多层动画
  const flamePhase = engineFrame % 6
  const flameLayers = [
    { rx: 10, ry: 18 + flamePhase * 2, color: '#3b82f6', opacity: 0.4 },
    { rx: 7, ry: 14 + flamePhase * 1.5, color: '#60a5fa', opacity: 0.6 },
    { rx: 4, ry: 10 + flamePhase, color: '#93c5fd', opacity: 0.8 },
    { rx: 2, ry: 6 + flamePhase * 0.5, color: '#dbeafe', opacity: 1 },
  ]

  return (
    <g style={{ opacity: blinkOpacity }}>
      <defs>
        {/* 机身金属渐变 */}
        <linearGradient id="playerBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="40%" stopColor="#3b82f6" />
          <stop offset="60%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        
        {/* 机翼渐变 */}
        <linearGradient id="playerWingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
        
        {/* 驾驶舱玻璃效果 */}
        <radialGradient id="playerCockpitGrad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </radialGradient>
        
        {/* 护盾渐变 */}
        <radialGradient id="playerShieldGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(59, 130, 246, 0)" />
          <stop offset="70%" stopColor="rgba(59, 130, 246, 0.1)" />
          <stop offset="90%" stopColor="rgba(59, 130, 246, 0.3)" />
          <stop offset="100%" stopColor="rgba(59, 130, 246, 0.5)" />
        </radialGradient>
        
        {/* 发光滤镜 */}
        <filter id="playerGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 护盾效果 */}
      {shield > 0 && (
        <>
          <ellipse
            cx={centerX}
            cy={y + height / 2}
            rx={width / 2 + 8}
            ry={height / 2 + 10}
            fill="url(#playerShieldGrad)"
            stroke="#3b82f6"
            strokeWidth={1 + shield * 0.5}
            strokeOpacity={0.6 + Math.sin(engineFrame * 0.3) * 0.2}
          >
            <animate
              attributeName="stroke-opacity"
              values="0.4;0.8;0.4"
              dur={`${1.5 - shield * 0.2}s`}
              repeatCount="indefinite"
            />
          </ellipse>
          {/* 护盾能量点 */}
          {Array.from({ length: shield }).map((_, i) => (
            <circle
              key={i}
              cx={centerX + Math.cos((engineFrame + i * 120) * Math.PI / 180) * (width / 2 + 5)}
              cy={y + height / 2 + Math.sin((engineFrame + i * 120) * Math.PI / 180) * (height / 2 + 8)}
              r={3}
              fill="#60a5fa"
              filter="url(#playerGlow)"
            />
          ))}
        </>
      )}

      {/* 引擎火焰 - 多层 */}
      <g filter="url(#playerGlow)">
        {flameLayers.map((layer, i) => (
          <ellipse
            key={i}
            cx={centerX}
            cy={y + height + layer.ry / 2 - 2}
            rx={layer.rx}
            ry={layer.ry / 2}
            fill={layer.color}
            opacity={layer.opacity * (0.8 + Math.sin(engineFrame * 0.5 + i) * 0.2)}
          >
            <animate
              attributeName="ry"
              values={`${layer.ry / 2};${layer.ry / 2 + 3};${layer.ry / 2}`}
              dur={`${0.15 + i * 0.05}s`}
              repeatCount="indefinite"
            />
          </ellipse>
        ))}
      </g>

      {/* 左翼 */}
      <path
        d={`M ${centerX} ${y + 12} 
            L ${x - 5} ${y + height - 8} 
            L ${x + 10} ${y + height - 3} 
            L ${centerX - 3} ${y + 22} Z`}
        fill="url(#playerWingGrad)"
        stroke="#1e40af"
        strokeWidth={1}
        filter="url(#playerGlow)"
      />
      
      {/* 右翼 */}
      <path
        d={`M ${centerX} ${y + 12} 
            L ${x + width + 5} ${y + height - 8} 
            L ${x + width - 10} ${y + height - 3} 
            L ${centerX + 3} ${y + 22} Z`}
        fill="url(#playerWingGrad)"
        stroke="#1e40af"
        strokeWidth={1}
        filter="url(#playerGlow)"
      />

      {/* 机身 */}
      <path
        d={`M ${centerX} ${y} 
            L ${centerX - 10} ${y + height - 18} 
            L ${centerX} ${y + height - 3} 
            L ${centerX + 10} ${y + height - 18} Z`}
        fill="url(#playerBodyGrad)"
        stroke="#1e3a8a"
        strokeWidth={1.5}
        filter="url(#playerGlow)"
      />

      {/* 机身高光 */}
      <path
        d={`M ${centerX - 4} ${y + 5} L ${centerX - 3} ${y + height - 25}`}
        stroke="#bfdbfe"
        strokeWidth={2.5}
        strokeLinecap="round"
        opacity={0.8}
      />
      <path
        d={`M ${centerX - 1} ${y + 8} L ${centerX} ${y + height - 20}`}
        stroke="#dbeafe"
        strokeWidth={1}
        strokeLinecap="round"
        opacity={0.6}
      />

      {/* 驾驶舱 */}
      <ellipse
        cx={centerX}
        cy={y + 16}
        rx={5}
        ry={10}
        fill="url(#playerCockpitGrad)"
        stroke="#1e3a8a"
        strokeWidth={1}
      />
      {/* 驾驶舱反光 */}
      <ellipse
        cx={centerX - 2}
        cy={y + 12}
        rx={2}
        ry={4}
        fill="#dbeafe"
        opacity={0.6}
      />

      {/* 尾翼 */}
      <path
        d={`M ${centerX - 3} ${y + height - 15} 
            L ${centerX - 12} ${y + height + 5} 
            L ${centerX - 3} ${y + height - 6} Z`}
        fill="#1e40af"
        stroke="#1e3a8a"
        strokeWidth={0.5}
      />
      <path
        d={`M ${centerX + 3} ${y + height - 15} 
            L ${centerX + 12} ${y + height + 5} 
            L ${centerX + 3} ${y + height - 6} Z`}
        fill="#1e40af"
        stroke="#1e3a8a"
        strokeWidth={0.5}
      />

      {/* 机身细节 - 能量核心 */}
      <circle
        cx={centerX}
        cy={y + height - 10}
        r={3}
        fill="#60a5fa"
        filter="url(#playerGlow)"
      >
        <animate
          attributeName="opacity"
          values="0.6;1;0.6"
          dur="0.5s"
          repeatCount="indefinite"
        />
      </circle>

      {/* 机翼细节 */}
      <path
        d={`M ${x + 5} ${y + height - 12} L ${centerX - 8} ${y + 18}`}
        stroke="#60a5fa"
        strokeWidth={1}
        opacity={0.5}
      />
      <path
        d={`M ${x + width - 5} ${y + height - 12} L ${centerX + 8} ${y + 18}`}
        stroke="#60a5fa"
        strokeWidth={1}
        opacity={0.5}
      />
    </g>
  )
}
