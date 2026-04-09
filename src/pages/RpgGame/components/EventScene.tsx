import type { EventResult } from '../data/events'

interface EventSceneProps {
  event: EventResult
  onOptionSelect: (action: string, value?: number) => void
  onCollectTreasure: () => void
}

export function EventScene({ event, onOptionSelect, onCollectTreasure }: EventSceneProps) {
  // 获取事件背景色
  const getEventBgColor = () => {
    switch (event.type) {
      case 'treasure': return 'border-yellow-500/50 bg-yellow-500/10'
      case 'shrine': return 'bg-blue-500/10 border-blue-500/50'
      case 'merchant': return 'border-purple-500/50 bg-purple-500/10'
      case 'mystery': return 'border-pink-500/50 bg-pink-500/10'
      case 'rest': return 'border-green-500/50 bg-green-500/10'
      case 'trap': return 'border-red-500/50 bg-red-500/10'
      case 'elite': return 'border-orange-500/50 bg-orange-500/10'
      case 'hidden_boss': return 'border-red-600/50 bg-red-600/10'
      default: return 'border-dark-600 bg-dark-800/50'
    }
  }

  // 获取事件标题颜色
  const getTitleColor = () => {
    switch (event.type) {
      case 'treasure': return 'text-yellow-400'
      case 'shrine': return 'text-blue-400'
      case 'merchant': return 'text-purple-400'
      case 'mystery': return 'text-pink-400'
      case 'rest': return 'text-green-400'
      case 'trap': return 'text-red-400'
      case 'elite': return 'text-orange-400'
      case 'hidden_boss': return 'text-red-500'
      default: return 'text-slate-100'
    }
  }

  // 获取事件类型标签
  const getEventTypeLabel = () => {
    const labels: Record<string, string> = {
      treasure: '💎 宝藏',
      shrine: '✨ 祭坛',
      merchant: '🏪 商人',
      mystery: '❓ 神秘',
      rest: '🔥 休息',
      trap: '⚠️ 陷阱',
      elite: '👹 精英',
      hidden_boss: '👿 隐藏Boss',
    }
    return labels[event.type] || '❓ 事件'
  }

  return (
    <div className={`rounded-2xl border p-6 shadow-lg ${getEventBgColor()}`}>
      {/* 事件类型标签 */}
      <div className="mb-3">
        <span className="rounded-full bg-dark-800/50 px-3 py-1 text-xs text-slate-400">
          {getEventTypeLabel()}
        </span>
      </div>

      {/* 事件图标和标题 */}
      <div className="mb-4 text-center">
        <div className="mb-2 text-6xl">{event.icon}</div>
        <h2 className={`text-xl font-bold ${getTitleColor()}`}>{event.title}</h2>
      </div>

      {/* 事件描述 */}
      <p className="mb-6 text-center text-slate-300">{event.description}</p>

      {/* 奖励/惩罚显示 */}
      {event.rewards && (
        <div className="mb-4 rounded-lg bg-dark-800/50 p-3 text-center">
          <div className="text-sm text-slate-400">可能获得:</div>
          <div className="mt-1 flex justify-center gap-4">
            {event.rewards.gold && (
              <span className="text-yellow-400">💰 {event.rewards.gold} 金币</span>
            )}
            {event.rewards.exp && (
              <span className="text-purple-400">✨ {event.rewards.exp} 经验</span>
            )}
            {event.rewards.item && (
              <span className="text-blue-400">{event.rewards.item.icon} {event.rewards.item.name}</span>
            )}
          </div>
        </div>
      )}

      {event.penalties && (
        <div className="mb-4 rounded-lg bg-red-900/20 p-3 text-center">
          <div className="text-sm text-red-400">⚠️ 注意:</div>
          <div className="mt-1 flex justify-center gap-4">
            {event.penalties.hp && (
              <span className="text-red-400">❤️ -{event.penalties.hp} 生命</span>
            )}
            {event.penalties.gold && (
              <span className="text-red-400">💰 -{event.penalties.gold} 金币</span>
            )}
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex flex-wrap justify-center gap-3">
        {/* 宝藏类型直接显示收集按钮 */}
        {event.type === 'treasure' ? (
          <button
            onClick={onCollectTreasure}
            className="rounded-xl bg-yellow-500/20 px-6 py-3 text-yellow-400 transition hover:bg-yellow-500/30 border border-yellow-500/50"
          >
            🎁 收集奖励
          </button>
        ) : (
          /* 其他类型显示选项 */
          event.options?.map((option, index) => (
            <button
              key={index}
              onClick={() => onOptionSelect(option.action, option.value)}
              className={`rounded-xl px-4 py-3 text-sm transition border ${
                option.action.includes('fight')
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border-red-500/50'
                  : option.action.includes('flee')
                  ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border-yellow-500/50'
                  : option.action === 'leave'
                  ? 'bg-dark-700 text-slate-400 hover:bg-dark-600 border-dark-600'
                  : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border-blue-500/50'
              }`}
            >
              {option.text}
            </button>
          ))
        )}
      </div>
    </div>
  )
}
