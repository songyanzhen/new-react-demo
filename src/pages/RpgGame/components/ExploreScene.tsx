import type { Character, Inventory } from '../types'

interface ExploreSceneProps {
  player: Character
  inventory: Inventory
  currentFloor: number
  gameLog: string[]
  onEncounter: () => void
  onNextFloor: () => void
  onUseItem: (index: number) => void
}

export function ExploreScene({
  player,
  inventory,
  currentFloor,
  gameLog,
  onEncounter,
  onNextFloor,
  onUseItem,
}: ExploreSceneProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* 左侧：角色状态 */}
      <div className="lg:col-span-1 space-y-4">
        {/* 角色信息卡片 */}
        <div className="rounded-2xl border border-dark-600 bg-dark-800/50 p-5 shadow-lg backdrop-blur">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-3xl shadow-lg">
              {getClassEmoji(player.class)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">{player.name}</h3>
              <p className="text-sm text-slate-400">{getClassName(player.class)} Lv.{player.level}</p>
            </div>
          </div>

          {/* 经验值 */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-400">
              <span>EXP</span>
              <span>{player.exp}/{player.maxExp}</span>
            </div>
            <div className="mt-1 h-2 rounded-full bg-dark-700 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                style={{ width: `${(player.exp / player.maxExp) * 100}%` }}
              />
            </div>
          </div>

          {/* HP & MP */}
          <div className="mt-4 space-y-2">
            <div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>HP</span>
                <span>{player.hp}/{player.maxHp}</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-dark-700 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                  style={{ width: `${(player.hp / player.maxHp) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>MP</span>
                <span>{player.mp}/{player.maxMp}</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-dark-700 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all"
                  style={{ width: `${(player.mp / player.maxMp) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* 属性 */}
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-lg bg-dark-900/50 p-2">
              <span className="text-slate-400">力量</span>
              <span className="ml-2 font-semibold text-slate-100">{player.stats.strength}</span>
            </div>
            <div className="rounded-lg bg-dark-900/50 p-2">
              <span className="text-slate-400">智力</span>
              <span className="ml-2 font-semibold text-slate-100">{player.stats.intelligence}</span>
            </div>
            <div className="rounded-lg bg-dark-900/50 p-2">
              <span className="text-slate-400">敏捷</span>
              <span className="ml-2 font-semibold text-slate-100">{player.stats.agility}</span>
            </div>
            <div className="rounded-lg bg-dark-900/50 p-2">
              <span className="text-slate-400">防御</span>
              <span className="ml-2 font-semibold text-slate-100">{player.stats.defense}</span>
            </div>
          </div>
        </div>

        {/* 背包 */}
        <div className="rounded-2xl border border-dark-600 bg-dark-800/50 p-5 shadow-lg backdrop-blur">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="font-semibold text-slate-100">🎒 背包</h4>
            <span className="text-sm text-yellow-400">💰 {inventory.gold} G</span>
          </div>
          {inventory.items.length === 0 ? (
            <p className="text-sm text-slate-500">背包是空的</p>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {inventory.items.map((entry, index) => (
                <button
                  key={index}
                  onClick={() => onUseItem(index)}
                  className="flex w-full items-center justify-between rounded-lg bg-dark-900/50 p-2 text-left text-sm transition hover:bg-dark-700/50"
                >
                  <span className="text-slate-200">{entry.item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">x{entry.quantity}</span>
                    {entry.item.type === 'consumable' && (
                      <span className="text-xs text-green-400">使用</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 中间：探索区域 */}
      <div className="lg:col-span-2 space-y-4">
        {/* 当前位置 */}
        <div className="rounded-2xl border border-dark-600 bg-dark-800/50 p-6 text-center shadow-lg backdrop-blur">
          <div className="mb-2 text-6xl">🏰</div>
          <h2 className="text-2xl font-bold text-slate-100">第 {currentFloor} 层</h2>
          <p className="text-slate-400">危险的地牢深处...</p>
        </div>

        {/* 行动按钮 */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onEncounter}
            className="group relative overflow-hidden rounded-2xl border border-red-500/50 bg-red-500/10 p-6 text-center transition hover:bg-red-500/20"
          >
            <div className="mb-2 text-4xl transition group-hover:scale-110">⚔️</div>
            <div className="font-bold text-red-400">探索</div>
            <div className="text-sm text-red-400/70">寻找敌人战斗</div>
          </button>

          <button
            onClick={onNextFloor}
            className="group relative overflow-hidden rounded-2xl border border-green-500/50 bg-green-500/10 p-6 text-center transition hover:bg-green-500/20"
          >
            <div className="mb-2 text-4xl transition group-hover:scale-110">🚪</div>
            <div className="font-bold text-green-400">下一层</div>
            <div className="text-sm text-green-400/70">进入更深的地牢</div>
          </button>
        </div>

        {/* 游戏日志 */}
        <div className="rounded-2xl border border-dark-600 bg-dark-800/50 p-5 shadow-lg backdrop-blur">
          <h4 className="mb-3 font-semibold text-slate-100">📜 冒险日志</h4>
          <div className="h-48 overflow-y-auto space-y-2">
            {gameLog.map((log, index) => (
              <div key={index} className="text-sm text-slate-300">
                <span className="text-slate-500">[{index + 1}]</span> {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function getClassEmoji(characterClass: string): string {
  const emojis: Record<string, string> = {
    warrior: '⚔️',
    mage: '🔮',
    rogue: '🗡️',
  }
  return emojis[characterClass] || '❓'
}

function getClassName(characterClass: string): string {
  const names: Record<string, string> = {
    warrior: '战士',
    mage: '法师',
    rogue: '盗贼',
  }
  return names[characterClass] || '未知'
}
