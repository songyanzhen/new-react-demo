import type { Boss } from '../types'
import { BOSS_CONFIGS } from '../data/bosses'

interface BossPlaneProps {
  boss: Boss
}

export function BossPlane({ boss }: BossPlaneProps) {
  const config = BOSS_CONFIGS[boss.type]
  const { x, y } = boss.position
  const { width, height } = boss.size
  const centerX = x + width / 2
  const centerY = y + height / 2
  const healthPercent = boss.hp / boss.maxHp
  const isEnraged = healthPercent < 0.5
  const isCritical = healthPercent < 0.25

  // 根据血量改变发光颜色
  const glowColor = isCritical ? '#ef4444' : isEnraged ? '#fbbf24' : config.colors.light
  const glowIntensity = isCritical ? 0.6 : isEnraged ? 0.4 : 0.2

  return (
    <g>
      {/* 外发光效果 */}
      <ellipse
        cx={centerX}
        cy={centerY}
        rx={width / 2 + 20}
        ry={height / 2 + 20}
        fill={glowColor}
        opacity={glowIntensity}
      >
        <animate
          attributeName="opacity"
          values={`${glowIntensity};${glowIntensity * 1.8};${glowIntensity}`}
          dur={isCritical ? '0.3s' : isEnraged ? '0.5s' : '1.5s'}
          repeatCount="indefinite"
        />
      </ellipse>

      {/* 能量场效果 */}
      {isEnraged && (
        <circle
          cx={centerX}
          cy={centerY}
          r={width / 2 + 30}
          fill="none"
          stroke={glowColor}
          strokeWidth={2}
          opacity={0.3}
        >
          <animate
            attributeName="r"
            values={`${width / 2 + 25};${width / 2 + 35};${width / 2 + 25}`}
            dur="1s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.3;0.1;0.3"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
      )}

      {/* HP条背景 */}
      <rect
        x={x - 15}
        y={y - 30}
        width={width + 30}
        height={12}
        fill="#1f2937"
        rx={6}
        stroke="#374151"
        strokeWidth={2}
      />
      {/* HP条 */}
      <defs>
        <linearGradient id={`hpGradient-${boss.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={healthPercent > 0.5 ? '#22c55e' : healthPercent > 0.25 ? '#f59e0b' : '#ef4444'} />
          <stop offset="100%" stopColor={healthPercent > 0.5 ? '#16a34a' : healthPercent > 0.25 ? '#d97706' : '#b91c1c'} />
        </linearGradient>
      </defs>
      <rect
        x={x - 15}
        y={y - 30}
        width={(width + 30) * healthPercent}
        height={12}
        fill={`url(#hpGradient-${boss.id})`}
        rx={6}
      />
      {/* HP百分比 */}
      <text
        x={centerX}
        y={y - 35}
        textAnchor="middle"
        fill="white"
        fontSize="11"
        fontWeight="bold"
        style={{ textShadow: '0 0 4px #000' }}
      >
        {Math.ceil(healthPercent * 100)}%
      </text>

      {/* ========== 毁灭者 (Destroyer) - 重装要塞型 ========== */}
      {boss.type === 'destroyer' && (
        <g>
          {/* 主体 - 重型装甲 */}
          <path
            d={`M ${centerX} ${y + 10} 
                L ${x + width - 15} ${y + 25}
                L ${x + width} ${y + height / 2}
                L ${x + width - 15} ${y + height - 25}
                L ${centerX} ${y + height - 10}
                L ${x + 15} ${y + height - 25}
                L ${x} ${y + height / 2}
                L ${x + 15} ${y + 25} Z`}
            fill={config.colors.main}
            stroke={glowColor}
            strokeWidth={isEnraged ? 4 : 2}
          />
          
          {/* 装甲板细节 */}
          <path d={`M ${x + 20} ${y + 30} L ${x + 35} ${y + 40} L ${x + 35} ${y + 60} L ${x + 20} ${y + 70} Z`} fill={config.colors.dark} />
          <path d={`M ${x + width - 20} ${y + 30} L ${x + width - 35} ${y + 40} L ${x + width - 35} ${y + 60} L ${x + width - 20} ${y + 70} Z`} fill={config.colors.dark} />

          {/* 中央核心 - 旋转 */}
          <g>
            <animateTransform attributeName="transform" type="rotate" from={`0 ${centerX} ${centerY}`} to={`360 ${centerX} ${centerY}`} dur={isEnraged ? '0.8s' : '2s'} repeatCount="indefinite" />
            <circle cx={centerX} cy={centerY} r={22} fill={config.colors.dark} stroke={glowColor} strokeWidth={3} />
            <path d={`M ${centerX - 15} ${centerY} L ${centerX + 15} ${centerY} M ${centerX} ${centerY - 15} L ${centerX} ${centerY + 15}`} stroke={glowColor} strokeWidth={4} />
          </g>

          {/* 三联装炮塔 */}
          <g>
            <rect x={centerX - 25} y={y + height - 12} width={12} height={18} fill="#4b5563" rx={2} />
            <rect x={centerX - 6} y={y + height - 15} width={12} height={22} fill="#6b7280" rx={2} />
            <rect x={centerX + 13} y={y + height - 12} width={12} height={18} fill="#4b5563" rx={2} />
            {/* 炮口发光 */}
            <circle cx={centerX - 19} cy={y + height + 3} r={4} fill={glowColor} opacity={0.8}>
              <animate attributeName="opacity" values="0.8;0.3;0.8" dur="0.5s" repeatCount="indefinite" />
            </circle>
            <circle cx={centerX} cy={y + height + 3} r={5} fill={glowColor} opacity={0.9}>
              <animate attributeName="opacity" values="0.9;0.4;0.9" dur="0.4s" repeatCount="indefinite" />
            </circle>
            <circle cx={centerX + 19} cy={y + height + 3} r={4} fill={glowColor} opacity={0.8}>
              <animate attributeName="opacity" values="0.8;0.3;0.8" dur="0.5s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* 狂暴尖刺 */}
          {isEnraged && (
            <>
              <path d={`M ${x} ${y + 20} L ${x - 20} ${y} L ${x + 10} ${y + 25} Z`} fill="#ef4444">
                <animate attributeName="opacity" values="1;0.5;1" dur="0.3s" repeatCount="indefinite" />
              </path>
              <path d={`M ${x + width} ${y + 20} L ${x + width + 20} ${y} L ${x + width - 10} ${y + 25} Z`} fill="#ef4444">
                <animate attributeName="opacity" values="1;0.5;1" dur="0.3s" repeatCount="indefinite" />
              </path>
            </>
          )}
        </g>
      )}

      {/* ========== 幽灵战机 (Phantom) - 高速隐形型 ========== */}
      {boss.type === 'phantom' && (
        <g>
          {/* 残影拖尾 */}
          {[...Array(3)].map((_, i) => (
            <ellipse
              key={i}
              cx={centerX}
              cy={centerY + i * 15}
              rx={width / 2 - i * 5}
              ry={height / 2 - i * 5}
              fill={config.colors.main}
              opacity={0.2 - i * 0.05}
            >
              <animate attributeName="rx" values={`${width / 2 - i * 5};${width / 2 - i * 5 + 8};${width / 2 - i * 5}`} dur="0.6s" repeatCount="indefinite" />
            </ellipse>
          ))}

          {/* 主体 - 尖锐流线型 */}
          <path
            d={`M ${centerX} ${y + height} L ${x + width - 5} ${y + 15} L ${centerX} ${y} L ${x + 5} ${y + 15} Z`}
            fill={config.colors.main}
            stroke={glowColor}
            strokeWidth={isEnraged ? 3 : 2}
          />

          {/* 能量脉络 */}
          <path d={`M ${centerX} ${y + height - 15} L ${centerX} ${y + 20}`} stroke={config.colors.light} strokeWidth={3} opacity={0.9}>
            <animate attributeName="stroke-width" values="3;5;3" dur="0.4s" repeatCount="indefinite" />
          </path>
          <path d={`M ${x + 15} ${y + 30} L ${centerX - 10} ${y + 50} L ${centerX + 10} ${y + 50} L ${x + width - 15} ${y + 30}`} 
            fill="none" stroke={config.colors.light} strokeWidth={2} opacity={0.7}>
            <animate attributeName="opacity" values="0.7;0.2;0.7" dur="0.3s" repeatCount="indefinite" />
          </path>

          {/* 侧翼能量刃 */}
          <path d={`M ${x + 10} ${y + 25} L ${x - 15} ${y + 45} L ${x + 15} ${y + 40} Z`} fill={config.colors.light} opacity={0.8}>
            <animate attributeName="opacity" values="0.8;0.3;0.8" dur="0.25s" repeatCount="indefinite" />
          </path>
          <path d={`M ${x + width - 10} ${y + 25} L ${x + width + 15} ${y + 45} L ${x + width - 15} ${y + 40} Z`} fill={config.colors.light} opacity={0.8}>
            <animate attributeName="opacity" values="0.8;0.3;0.8" dur="0.25s" repeatCount="indefinite" />
          </path>

          {/* 核心脉动 */}
          <circle cx={centerX} cy={centerY + 10} r={12} fill={isEnraged ? '#f59e0b' : config.colors.light}>
            <animate attributeName="r" values="10;14;10" dur={isEnraged ? '0.15s' : '0.4s'} repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0.6;1" dur={isEnraged ? '0.15s' : '0.4s'} repeatCount="indefinite" />
          </circle>

          {/* 尾迹粒子 */}
          <circle cx={centerX - 8} cy={y - 5} r={3} fill={config.colors.light} opacity={0.5}>
            <animate attributeName="cy" values={`${y - 5};${y + 20}`} dur="0.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0;0.5" dur="0.5s" repeatCount="indefinite" />
          </circle>
          <circle cx={centerX + 8} cy={y - 10} r={2} fill={config.colors.light} opacity={0.4}>
            <animate attributeName="cy" values={`${y - 10};${y + 15}`} dur="0.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0;0.4" dur="0.4s" repeatCount="indefinite" />
          </circle>
        </g>
      )}

      {/* ========== 虚空母舰 (Mothership) - 巨型航母型 ========== */}
      {boss.type === 'mothership' && (
        <g>
          {/* 主体圆环 */}
          <circle cx={centerX} cy={centerY} r={width / 2 - 5} fill={config.colors.main} stroke={glowColor} strokeWidth={isEnraged ? 5 : 3} />

          {/* 旋转外环 */}
          <g>
            <animateTransform attributeName="transform" type="rotate" from={`0 ${centerX} ${centerY}`} to={isEnraged ? `-360 ${centerX} ${centerY}` : `360 ${centerX} ${centerY}`} dur={isEnraged ? '1.5s' : '4s'} repeatCount="indefinite" />
            <circle cx={centerX} cy={centerY} r={width / 2 - 18} fill="none" stroke={config.colors.light} strokeWidth={3} strokeDasharray="15 8" />
            {/* 环上节点 */}
            <circle cx={centerX + width / 2 - 18} cy={centerY} r={6} fill={config.colors.light} />
            <circle cx={centerX - width / 2 + 18} cy={centerY} r={6} fill={config.colors.light} />
            <circle cx={centerX} cy={centerY + width / 2 - 18} r={6} fill={config.colors.light} />
            <circle cx={centerX} cy={centerY - width / 2 + 18} r={6} fill={config.colors.light} />
          </g>

          {/* 反向旋转内环 */}
          <g>
            <animateTransform attributeName="transform" type="rotate" from={`0 ${centerX} ${centerY}`} to={isEnraged ? `360 ${centerX} ${centerY}` : `-360 ${centerX} ${centerY}`} dur={isEnraged ? '1s' : '2.5s'} repeatCount="indefinite" />
            <circle cx={centerX} cy={centerY} r={width / 2 - 35} fill="none" stroke={config.colors.light} strokeWidth={2} />
          </g>

          {/* 核心 - 强脉动 */}
          <circle cx={centerX} cy={centerY} r={25} fill={isEnraged ? '#f59e0b' : config.colors.light}>
            <animate attributeName="r" values="22;28;22" dur={isEnraged ? '0.4s' : '1s'} repeatCount="indefinite" />
            <animate attributeName="fill-opacity" values="1;0.7;1" dur={isEnraged ? '0.4s' : '1s'} repeatCount="indefinite" />
          </circle>

          {/* 四个方向卫星 */}
          {[
            { angle: 0, label: 'N' },
            { angle: 90, label: 'E' },
            { angle: 180, label: 'S' },
            { angle: 270, label: 'W' },
          ].map((pos, i) => {
            const sx = centerX + Math.cos((pos.angle * Math.PI) / 180) * (width / 2 + 15)
            const sy = centerY + Math.sin((pos.angle * Math.PI) / 180) * (height / 2 + 15)
            return (
              <g key={i}>
                <circle cx={sx} cy={sy} r={10} fill={config.colors.dark} stroke={config.colors.light} strokeWidth={2}>
                  <animate attributeName="r" values="9;12;9" dur={`${0.8 + i * 0.15}s`} repeatCount="indefinite" />
                </circle>
                <circle cx={sx} cy={sy} r={4} fill={glowColor} />
              </g>
            )
          })}

          {/* 底部发射口 */}
          <g>
            <ellipse cx={centerX} cy={y + height - 5} rx={20} ry={8} fill="#374151" />
            <ellipse cx={centerX} cy={y + height - 5} rx={14} ry={5} fill={glowColor} opacity={0.9}>
              <animate attributeName="rx" values="14;18;14" dur="0.6s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;0.4;0.9" dur="0.6s" repeatCount="indefinite" />
            </ellipse>
          </g>
        </g>
      )}

      {/* ========== 虫群主宰 (Overlord) - 生物机械混合型 ========== */}
      {boss.type === 'overlord' && (
        <g>
          {/* 生物组织外膜 */}
          <ellipse cx={centerX} cy={centerY} rx={width / 2} ry={height / 2} fill={config.colors.main} opacity={0.9}>
            <animate attributeName="rx" values={`${width / 2};${width / 2 + 3};${width / 2}`} dur="1.2s" repeatCount="indefinite" />
            <animate attributeName="ry" values={`${height / 2};${height / 2 - 2};${height / 2}`} dur="1.2s" repeatCount="indefinite" />
          </ellipse>

          {/* 触手 */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => {
            const tx = centerX + Math.cos((angle * Math.PI) / 180) * (width / 2 - 10)
            const ty = centerY + Math.sin((angle * Math.PI) / 180) * (height / 2 - 10)
            const tx2 = centerX + Math.cos((angle * Math.PI) / 180) * (width / 2 + 20)
            const ty2 = centerY + Math.sin((angle * Math.PI) / 180) * (height / 2 + 20)
            return (
              <path
                key={i}
                d={`M ${tx} ${ty} Q ${tx2} ${ty2} ${tx2 + (Math.random() - 0.5) * 10} ${ty2 + (Math.random() - 0.5) * 10}`}
                stroke={config.colors.dark}
                strokeWidth={6}
                fill="none"
                opacity={0.8}
              >
                <animate attributeName="d" dur={`${1 + i * 0.1}s`} repeatCount="indefinite" />
              </path>
            )
          })}

          {/* 核心 - 眼球效果 */}
          <ellipse cx={centerX} cy={centerY} rx={30} ry={25} fill={config.colors.dark} stroke={config.colors.light} strokeWidth={2} />
          <ellipse cx={centerX} cy={centerY} rx={18} ry={15} fill={isEnraged ? '#ef4444' : '#22c55e'}>
            <animate attributeName="rx" values="16;20;16" dur="2s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx={centerX + 3} cy={centerY} rx={6} ry={8} fill="#000" opacity={0.7}>
            <animate attributeName="cx" values={`${centerX + 2};${centerX + 5};${centerX + 2}`} dur="3s" repeatCount="indefinite" />
          </ellipse>

          {/* 尖牙 */}
          <path d={`M ${centerX - 15} ${y + height - 20} L ${centerX - 8} ${y + height - 5} L ${centerX - 3} ${y + height - 18} Z`} fill="#fef08a" />
          <path d={`M ${centerX + 3} ${y + height - 18} L ${centerX + 8} ${y + height - 5} L ${centerX + 15} ${y + height - 20} Z`} fill="#fef08a" />

          {/* 毒液滴落 */}
          <circle cx={centerX - 20} cy={y + height} r={3} fill={config.colors.light} opacity={0.6}>
            <animate attributeName="cy" values={`${y + height};${y + height + 30}`} dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0;0.6" dur="1.5s" repeatCount="indefinite" />
          </circle>
        </g>
      )}

      {/* ========== 新星核心 (Nova) - 能量生命体型 ========== */}
      {boss.type === 'nova' && (
        <g>
          {/* 外层能量场 */}
          <circle cx={centerX} cy={centerY} r={width / 2} fill="none" stroke={config.colors.light} strokeWidth={1} opacity={0.4}>
            <animate attributeName="r" values={`${width / 2};${width / 2 + 15};${width / 2}`} dur="1s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0.1;0.4" dur="1s" repeatCount="indefinite" />
          </circle>

          {/* 中层能量场 */}
          <circle cx={centerX} cy={centerY} r={width / 2 - 10} fill="none" stroke={config.colors.main} strokeWidth={2} opacity={0.6}>
            <animate attributeName="r" values={`${width / 2 - 10};${width / 2 + 5};${width / 2 - 10}`} dur="0.7s" repeatCount="indefinite" />
          </circle>

          {/* 内核 - 太阳效果 */}
          <radialGradient id={`novaGradient-${boss.id}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="30%" stopColor={config.colors.light} />
            <stop offset="70%" stopColor={config.colors.main} />
            <stop offset="100%" stopColor={config.colors.dark} />
          </radialGradient>
          <circle cx={centerX} cy={centerY} r={width / 2 - 20} fill={`url(#novaGradient-${boss.id})`}>
            <animate attributeName="r" values={`${width / 2 - 22};${width / 2 - 18};${width / 2 - 22}`} dur={isEnraged ? '0.2s' : '0.5s'} repeatCount="indefinite" />
          </circle>

          {/* 日冕射线 */}
          {[...Array(8)].map((_, i) => {
            const angle = (i * 45 * Math.PI) / 180
            const x1 = centerX + Math.cos(angle) * (width / 2 - 25)
            const y1 = centerY + Math.sin(angle) * (height / 2 - 25)
            const x2 = centerX + Math.cos(angle) * (width / 2 + (isEnraged ? 25 : 10))
            const y2 = centerY + Math.sin(angle) * (height / 2 + (isEnraged ? 25 : 10))
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={config.colors.light}
                strokeWidth={3}
                opacity={0.8}
              >
                <animate attributeName="x2" values={`${x2};${centerX + Math.cos(angle) * (width / 2 + (isEnraged ? 35 : 15))};${x2}`} dur={`${0.3 + i * 0.05}s`} repeatCount="indefinite" />
                <animate attributeName="y2" values={`${y2};${centerY + Math.sin(angle) * (height / 2 + (isEnraged ? 35 : 15))};${y2}`} dur={`${0.3 + i * 0.05}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0.2;0.8" dur={`${0.3 + i * 0.05}s`} repeatCount="indefinite" />
              </line>
            )
          })}

          {/* 中心耀斑 */}
          <circle cx={centerX} cy={centerY} r={10} fill="#fff">
            <animate attributeName="r" values="8;12;8" dur="0.3s" repeatCount="indefinite" />
          </circle>
        </g>
      )}

      {/* ========== 远古泰坦 (Titan) - 传说级巨型 ========== */}
      {boss.type === 'titan' && (
        <g>
          {/* 岩石外壳 */}
          <path
            d={`M ${centerX} ${y + 10} 
                L ${x + width - 20} ${y + 30}
                L ${x + width} ${y + height / 2}
                L ${x + width - 15} ${y + height - 30}
                L ${centerX} ${y + height - 10}
                L ${x + 15} ${y + height - 30}
                L ${x} ${y + height / 2}
                L ${x + 20} ${y + 30} Z`}
            fill={config.colors.main}
            stroke={config.colors.dark}
            strokeWidth={3}
          />

          {/* 岩石纹理 */}
          <path d={`M ${x + 30} ${y + 40} L ${x + 50} ${y + 50} L ${x + 45} ${y + 70} Z`} fill={config.colors.dark} opacity={0.6} />
          <path d={`M ${x + width - 50} ${y + 45} L ${x + width - 30} ${y + 55} L ${x + width - 40} ${y + 75} Z`} fill={config.colors.dark} opacity={0.6} />
          <path d={`M ${centerX - 20} ${y + 60} L ${centerX} ${y + 70} L ${centerX - 10} ${y + 90} Z`} fill={config.colors.dark} opacity={0.6} />

          {/* 符文能量线 */}
          <g>
            <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
            <path d={`M ${centerX} ${y + 20} L ${centerX} ${y + height - 20}`} stroke={glowColor} strokeWidth={4} fill="none" />
            <path d={`M ${x + 40} ${y + 35} L ${centerX - 25} ${y + height / 2}`} stroke={glowColor} strokeWidth={2} fill="none" />
            <path d={`M ${x + width - 40} ${y + 35} L ${centerX + 25} ${y + height / 2}`} stroke={glowColor} strokeWidth={2} fill="none" />
          </g>

          {/* 核心符文 */}
          <g>
            <animateTransform attributeName="transform" type="rotate" from={`0 ${centerX} ${centerY}`} to={`360 ${centerX} ${centerY}`} dur={isEnraged ? '3s' : '8s'} repeatCount="indefinite" />
            <circle cx={centerX} cy={centerY} r={20} fill="none" stroke={glowColor} strokeWidth={3} />
            <path d={`M ${centerX - 12} ${centerY - 12} L ${centerX + 12} ${centerY + 12} M ${centerX + 12} ${centerY - 12} L ${centerX - 12} ${centerY + 12}`} stroke={glowColor} strokeWidth={3} />
          </g>

          {/* 肩部水晶 */}
          <g>
            <polygon points={`${x + 15},${y + 25} ${x + 25},${y + 15} ${x + 35},${y + 25} ${x + 25},${y + 40}`} fill={glowColor}>
              <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite" />
            </polygon>
            <polygon points={`${x + width - 35},${y + 25} ${x + width - 25},${y + 15} ${x + width - 15},${y + 25} ${x + width - 25},${y + 40}`} fill={glowColor}>
              <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite" />
            </polygon>
          </g>

          {/* 肩部能量粒子 */}
          <circle cx={x + 25} cy={y + 28} r={4} fill="#fff" opacity={0.8}>
            <animate attributeName="r" values="3;5;3" dur="1s" repeatCount="indefinite" />
          </circle>
          <circle cx={x + width - 25} cy={y + 28} r={4} fill="#fff" opacity={0.8}>
            <animate attributeName="r" values="3;5;3" dur="1s" repeatCount="indefinite" />
          </circle>
        </g>
      )}

      {/* Boss名称 */}
      <text
        x={centerX}
        y={y + height + 35}
        textAnchor="middle"
        fill={config.colors.light}
        fontSize={isCritical ? 16 : 14}
        fontWeight="bold"
        style={{ textShadow: `0 0 ${isCritical ? 15 : 8}px ${config.colors.main}` }}
      >
        {config.name}
        {isCritical && ' ☠️'}
        {isEnraged && !isCritical && ' ⚠️'}
      </text>
    </g>
  )
}
