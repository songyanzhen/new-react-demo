import type { CheatMode } from '../types'

interface CheatPanelProps {
  cheatMode: CheatMode
  onToggle: (option: keyof Omit<CheatMode, 'enabled'>) => void
  onGetArtifact?: (rarity: 'legendary' | 'mythic' | 'divine') => void
  onGetHiddenSkill?: () => void
  onGetStatBoost?: () => void
  onLevelUp?: () => void
  onAddGold?: (amount: number) => void
}

export function CheatPanel({ 
  cheatMode, 
  onToggle, 
  onGetArtifact,
  onGetHiddenSkill,
  onGetStatBoost,
  onLevelUp,
  onAddGold
}: CheatPanelProps) {
  const options: { key: keyof Omit<CheatMode, 'enabled'>; label: string; shortcut: string; color: string }[] = [
    { key: 'godMode', label: '无敌模式', shortcut: 'G', color: 'bg-green-500' },
    { key: 'oneHitKill', label: '一击必杀', shortcut: 'K', color: 'bg-red-500' },
    { key: 'infiniteMP', label: '无限MP', shortcut: 'M', color: 'bg-blue-500' },
    { key: 'maxDropRate', label: '10倍经验', shortcut: 'D', color: 'bg-purple-500' },
  ]

  return (
    <div className="mx-auto mb-6 max-w-4xl rounded-xl border border-yellow-500/50 bg-yellow-500/10 p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-xl">🎮</span>
        <span className="font-bold text-yellow-400">作弊控制台</span>
        <span className="text-xs text-yellow-400/70">(点击或按快捷键切换)</span>
      </div>
      
      {/* 基础作弊选项 */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {options.map(({ key, label, shortcut, color }) => (
          <button
            key={key}
            onClick={() => onToggle(key)}
            className={`flex items-center justify-between rounded-lg border px-3 py-2 transition ${
              cheatMode[key]
                ? `border-${color.replace('bg-', '')} ${color} text-white`
                : 'border-dark-600 bg-dark-800/50 text-slate-400 hover:bg-dark-700/50'
            }`}
          >
            <span className="text-sm font-medium">{label}</span>
            <span className="rounded bg-white/20 px-1.5 py-0.5 text-xs">{shortcut}</span>
          </button>
        ))}
      </div>

      {/* 高级作弊功能 */}
      <div className="border-t border-yellow-500/30 pt-3">
        <div className="mb-2 text-xs text-yellow-400/70">高级功能</div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {/* 获取神器 */}
          <button
            onClick={() => onGetArtifact?.('legendary')}
            className="rounded-lg border border-orange-500/50 bg-orange-500/10 px-2 py-2 text-xs text-orange-400 transition hover:bg-orange-500/20"
          >
            <div className="text-base">⚔️</div>
            <div>传说神器</div>
          </button>
          <button
            onClick={() => onGetArtifact?.('mythic')}
            className="rounded-lg border border-purple-500/50 bg-purple-500/10 px-2 py-2 text-xs text-purple-400 transition hover:bg-purple-500/20"
          >
            <div className="text-base">🏆</div>
            <div>神话神器</div>
          </button>
          <button
            onClick={() => onGetArtifact?.('divine')}
            className="rounded-lg border border-yellow-400/50 bg-yellow-400/10 px-2 py-2 text-xs text-yellow-300 transition hover:bg-yellow-400/20"
          >
            <div className="text-base">💎</div>
            <div>神级神器</div>
          </button>

          {/* 隐藏技能 */}
          <button
            onClick={onGetHiddenSkill}
            className="rounded-lg border border-cyan-500/50 bg-cyan-500/10 px-2 py-2 text-xs text-cyan-400 transition hover:bg-cyan-500/20"
          >
            <div className="text-base">☀️</div>
            <div>隐藏技能</div>
          </button>

          {/* 属性提升 */}
          <button
            onClick={onGetStatBoost}
            className="rounded-lg border border-green-500/50 bg-green-500/10 px-2 py-2 text-xs text-green-400 transition hover:bg-green-500/20"
          >
            <div className="text-base">💪</div>
            <div>属性提升</div>
          </button>

          {/* 升级 */}
          <button
            onClick={onLevelUp}
            className="rounded-lg border border-pink-500/50 bg-pink-500/10 px-2 py-2 text-xs text-pink-400 transition hover:bg-pink-500/20"
          >
            <div className="text-base">⬆️</div>
            <div>升1级</div>
          </button>

          {/* 金币 */}
          <button
            onClick={() => onAddGold?.(1000)}
            className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 px-2 py-2 text-xs text-yellow-400 transition hover:bg-yellow-500/20"
          >
            <div className="text-base">💰</div>
            <div>+1000G</div>
          </button>

          {/* 满血满蓝 */}
          <button
            onClick={() => onAddGold?.(-1)} // 特殊标记表示恢复
            className="rounded-lg border border-red-500/50 bg-red-500/10 px-2 py-2 text-xs text-red-400 transition hover:bg-red-500/20"
          >
            <div className="text-base">❤️</div>
            <div>满血满蓝</div>
          </button>
        </div>
      </div>
    </div>
  )
}
