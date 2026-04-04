interface EnemyPlaneProps {
  x: number
  y: number
  width: number
  height: number
  type: 'normal' | 'fast' | 'tank'
  hp: number
  maxHp: number
  frame?: number
}

export function EnemyPlane({ x, y, width, height, type, hp, maxHp, frame = 0 }: EnemyPlaneProps) {
  const centerX = x + width / 2
  
  // 根据类型设置配色方案
  const getTheme = () => {
    switch (type) {
      case 'fast':
        return {
          main: '#f87171',
          dark: '#dc2626',
          light: '#fca5a5',
          glow: '#ef4444',
          engine: '#fbbf24',
        }
      case 'tank':
        return {
          main: '#a78bfa',
          dark: '#7c3aed',
          light: '#c4b5fd',
          glow: '#8b5cf6',
          engine: '#a78bfa',
        }
      default:
        return {
          main: '#94a3b8',
          dark: '#475569',
          light: '#cbd5e1',
          glow: '#64748b',
          engine: '#94a3b8',
        }
    }
  }
  
  const theme = getTheme()
  const isDamaged = hp < maxHp
  const damageRatio = hp / maxHp

  return (
    <g>
      <defs>
        {/* 机身渐变 */}
        <linearGradient id={`enemyBody-${type}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={theme.light} />
          <stop offset="50%" stopColor={theme.main} />
          <stop offset="100%" stopColor={theme.dark} />
        </linearGradient>
        
        {/* 发光滤镜 */}
        <filter id={`enemyGlow-${type}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={type === 'tank' ? 2 : 1.5} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        {/* 受损纹理 */}
        <pattern id={`damagePattern-${type}`} x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="10" y2="10" stroke="#000" strokeWidth="1" opacity={0.3} />
        </pattern>
      </defs>

      {/* HP 条 - 受损时显示 */}
      {isDamaged && (
        <g transform={`translate(0, ${type === 'tank' ? -15 : -10})`}>
          <rect 
            x={x - 2} 
            y={y - 6} 
            width={width + 4} 
            height={6} 
            fill="#1f2937" 
            rx={3}
            stroke="#374151"
            strokeWidth={1}
          />
          <rect 
            x={x} 
            y={y - 4} 
            width={width * damageRatio} 
            height={4} 
            fill={damageRatio > 0.5 ? '#22c55e' : damageRatio > 0.25 ? '#f59e0b' : '#ef4444'}
            rx={2}
          >
            <animate
              attributeName="opacity"
              values="0.8;1;0.8"
              dur="0.5s"
              repeatCount="indefinite"
            />
          </rect>
        </g>
      )}

      {/* 引擎尾焰 */}
      <g filter={`url(#enemyGlow-${type})`}>
        {type === 'fast' && (
          // 高速机 - 长尾焰
          <>
            <ellipse
              cx={centerX}
              cy={y - 8}
              rx={4}
              ry={12 + (frame % 3) * 2}
              fill={theme.engine}
              opacity={0.7}
            >
              <animate attributeName="ry" values="12;16;12" dur="0.1s" repeatCount="indefinite" />
            </ellipse>
            <ellipse
              cx={centerX}
              cy={y - 5}
              rx={2}
              ry={6}
              fill="#fef3c7"
              opacity={0.9}
            />
          </>
        )}
        
        {type === 'tank' && (
          // 坦克机 - 双引擎
          <>
            <ellipse cx={centerX - 8} cy={y - 5} rx={3} ry={8} fill={theme.engine} opacity={0.6}>
              <animate attributeName="opacity" values="0.4;0.7;0.4" dur="0.3s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx={centerX + 8} cy={y - 5} rx={3} ry={8} fill={theme.engine} opacity={0.6}>
              <animate attributeName="opacity" values="0.7;0.4;0.7" dur="0.3s" repeatCount="indefinite" />
            </ellipse>
          </>
        )}
        
        {type === 'normal' && (
          // 普通机 - 单引擎
          <ellipse
            cx={centerX}
            cy={y - 4}
            rx={3}
            ry={6 + (frame % 2)}
            fill={theme.engine}
            opacity={0.6}
          />
        )}
      </g>

      {/* 机身主体 */}
      <path
        d={type === 'tank' 
          ? `M ${centerX} ${y + height} 
             L ${x} ${y + 10} 
             L ${x + 5} ${y} 
             L ${x + width - 5} ${y} 
             L ${x + width} ${y + 10} Z`
          : `M ${centerX} ${y + height} 
             L ${x} ${y + 5} 
             L ${centerX} ${y + 15} 
             L ${x + width} ${y + 5} Z`
        }
        fill={`url(#enemyBody-${type})`}
        stroke={theme.dark}
        strokeWidth={type === 'tank' ? 2 : 1}
        filter={`url(#enemyGlow-${type})`}
      />

      {/* 受损覆盖层 */}
      {isDamaged && (
        <path
          d={type === 'tank' 
            ? `M ${centerX} ${y + height} L ${x} ${y + 10} L ${x + 5} ${y} L ${x + width - 5} ${y} L ${x + width} ${y + 10} Z`
            : `M ${centerX} ${y + height} L ${x} ${y + 5} L ${centerX} ${y + 15} L ${x + width} ${y + 5} Z`
          }
          fill={`url(#damagePattern-${type})`}
          opacity={(1 - damageRatio) * 0.5}
        />
      )}

      {/* 机翼/装甲细节 */}
      {type === 'tank' && (
        // 坦克机 - 厚重装甲板
        <>
          <rect x={x + 5} y={y + 15} width={width - 10} height={8} fill={theme.dark} rx={2} opacity={0.6} />
          <circle cx={centerX - 10} cy={y + 19} r={2} fill={theme.light} />
          <circle cx={centerX + 10} cy={y + 19} r={2} fill={theme.light} />
          {/* 装甲纹路 */}
          <line x1={x + 8} y1={y + 25} x2={x + width - 8} y2={y + 25} stroke={theme.dark} strokeWidth={1} opacity={0.5} />
          <line x1={centerX} y1={y + 30} x2={centerX} y2={y + height - 5} stroke={theme.dark} strokeWidth={1} opacity={0.5} />
        </>
      )}
      
      {type === 'fast' && (
        // 高速机 - 流线型侧翼
        <>
          <path
            d={`M ${centerX} ${y + 20} L ${x - 12} ${y + 5} L ${x + 3} ${y + 10} L ${centerX - 5} ${y + 22} Z`}
            fill={theme.dark}
            opacity={0.8}
          />
          <path
            d={`M ${centerX} ${y + 20} L ${x + width + 12} ${y + 5} L ${x + width - 3} ${y + 10} L ${centerX + 5} ${y + 22} Z`}
            fill={theme.dark}
            opacity={0.8}
          />
          {/* 速度线 */}
          <line x1={centerX - 5} y1={y + 8} x2={centerX - 8} y2={y - 2} stroke={theme.light} strokeWidth={1} opacity={0.6}>
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="0.2s" repeatCount="indefinite" />
          </line>
          <line x1={centerX + 5} y1={y + 8} x2={centerX + 8} y2={y - 2} stroke={theme.light} strokeWidth={1} opacity={0.6}>
            <animate attributeName="opacity" values="0.8;0.3;0.8" dur="0.2s" repeatCount="indefinite" />
          </line>
        </>
      )}
      
      {type === 'normal' && (
        // 普通机 - 标准侧翼
        <>
          <path d={`M ${centerX} ${y + 18} L ${x - 3} ${y + 6} L ${x + 8} ${y + 10} L ${centerX - 3} ${y + 20} Z`} fill={theme.dark} />
          <path d={`M ${centerX} ${y + 18} L ${x + width + 3} ${y + 6} L ${x + width - 8} ${y + 10} L ${centerX + 3} ${y + 20} Z`} fill={theme.dark} />
        </>
      )}

      {/* 驾驶舱 */}
      <ellipse
        cx={centerX}
        cy={y + (type === 'tank' ? 12 : 10)}
        rx={type === 'tank' ? 5 : 3}
        ry={type === 'tank' ? 7 : 5}
        fill="#fef08a"
        stroke={theme.dark}
        strokeWidth={1}
      >
        {type === 'fast' && (
          <animate attributeName="fill" values="#fef08a;#f97316;#fef08a" dur="0.3s" repeatCount="indefinite" />
        )}
      </ellipse>
      <ellipse
        cx={centerX - (type === 'tank' ? 2 : 1)}
        cy={y + (type === 'tank' ? 10 : 8)}
        rx={type === 'tank' ? 2 : 1.5}
        ry={type === 'tank' ? 3 : 2}
        fill="#f97316"
        opacity={0.8}
      />

      {/* 机身装饰线 */}
      <path
        d={`M ${centerX} ${y + (type === 'tank' ? 20 : 15)} L ${centerX} ${y + height - 5}`}
        stroke={theme.light}
        strokeWidth={type === 'tank' ? 2 : 1}
        opacity={0.5}
      />

      {/* 类型标记 */}
      {type === 'tank' && (
        <>
          <circle cx={centerX} cy={y + height - 8} r={4} fill="#f59e0b" stroke="#78350f" strokeWidth={1}>
            <animate attributeName="r" values="4;5;4" dur="1s" repeatCount="indefinite" />
          </circle>
          <path d={`M ${centerX} ${y + height - 11} L ${centerX} ${y + height - 5} M ${centerX - 3} ${y + height - 8} L ${centerX + 3} ${y + height - 8}`} stroke="#78350f" strokeWidth={1.5} />
        </>
      )}
      
      {type === 'fast' && (
        <path
          d={`M ${centerX - 4} ${y + height - 10} L ${centerX} ${y + height - 4} L ${centerX + 4} ${y + height - 10}`}
          fill="none"
          stroke="#fbbf24"
          strokeWidth={2}
        >
          <animate attributeName="stroke-opacity" values="1;0.3;1" dur="0.4s" repeatCount="indefinite" />
        </path>
      )}

      {/* 警告闪烁 - 低血量 */}
      {damageRatio <= 0.25 && (
        <ellipse
          cx={centerX}
          cy={y + height / 2}
          rx={width / 2 + 3}
          ry={height / 2 + 3}
          fill="none"
          stroke="#ef4444"
          strokeWidth={1}
          opacity={0.5 + Math.sin(frame * 0.5) * 0.3}
        />
      )}
    </g>
  )
}
