import { useState, useRef, useEffect } from 'react'
import type { Character, Inventory } from '../types'

interface ExploreSceneProps {
  player: Character
  inventory: Inventory
  currentFloor: number
  gameLog: { id: string; text: string; type: string; timestamp: number }[]
  floorExploreCount: number  // 当前楼层探索次数
  onEncounter: () => void
  onNextFloor: () => void
  onUseItem: (index: number) => void
}

export function ExploreScene({
  player,
  inventory,
  currentFloor,
  gameLog,
  floorExploreCount,
  onEncounter,
  onNextFloor,
  onUseItem,
}: ExploreSceneProps) {
  const [showStats, setShowStats] = useState(false)
  const logRef = useRef<HTMLDivElement>(null)

  // 冒险日志自动滚动到底部
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [gameLog])

  // 获取职业图标
  const getClassIcon = (className: string) => {
    const icons: Record<string, string> = {
      warrior: '⚔️',
      mage: '🔮',
      rogue: '🗡️',
      paladin: '🛡️',
      ranger: '🏹',
    }
    return icons[className] || '❓'
  }

  // 获取职业名称
  const getClassName = (className: string) => {
    const names: Record<string, string> = {
      warrior: '战士',
      mage: '法师',
      rogue: '盗贼',
      paladin: '圣骑士',
      ranger: '游侠',
    }
    return names[className] || className
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* 左侧：角色状态 */}
      <div className="lg:col-span-1 space-y-4">
        {/* 角色信息卡片 */}
        <div className="rounded-2xl border border-dark-600 bg-dark-800/50 p-5 shadow-lg backdrop-blur">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-3xl shadow-lg">
              {getClassIcon(player.class)}
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

          {/* 基础属性 */}
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-lg bg-dark-900/50 p-2">
              <span className="text-slate-400">力量</span>
              <span className="ml-2 font-semibold text-slate-100">{player.baseStats.strength}</span>
            </div>
            <div className="rounded-lg bg-dark-900/50 p-2">
              <span className="text-slate-400">智力</span>
              <span className="ml-2 font-semibold text-slate-100">{player.baseStats.intelligence}</span>
            </div>
            <div className="rounded-lg bg-dark-900/50 p-2">
              <span className="text-slate-400">敏捷</span>
              <span className="ml-2 font-semibold text-slate-100">{player.baseStats.agility}</span>
            </div>
            <div className="rounded-lg bg-dark-900/50 p-2">
              <span className="text-slate-400">体质</span>
              <span className="ml-2 font-semibold text-slate-100">{player.baseStats.vitality}</span>
            </div>
          </div>

          {/* 展开详细属性 */}
          <button
            onClick={() => setShowStats(!showStats)}
            className="mt-3 w-full rounded-lg bg-dark-700/50 py-1.5 text-xs text-slate-400 transition hover:bg-dark-600/50"
          >
            {showStats ? '隐藏详细属性 ▲' : '显示详细属性 ▼'}
          </button>

          {showStats && (
            <div className="mt-3 space-y-1 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>攻击力</span>
                <span className="text-slate-200">{player.currentStats.attack}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>魔法攻击</span>
                <span className="text-slate-200">{player.currentStats.magicAttack}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>防御力</span>
                <span className="text-slate-200">{player.currentStats.defense}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>暴击率</span>
                <span className="text-slate-200">{player.currentStats.critRate}%</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>闪避率</span>
                <span className="text-slate-200">{player.currentStats.evasion}%</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>命中率</span>
                <span className="text-slate-200">{player.currentStats.hitRate}%</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>速度</span>
                <span className="text-slate-200">{player.currentStats.speed}</span>
              </div>
            </div>
          )}
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
                  <span className="text-slate-200">{entry.item.icon || '📦'} {entry.item.name}</span>
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
          {currentFloor % 5 === 0 && (
            <div className="mt-2 inline-block rounded-full bg-red-500/20 px-3 py-1 text-sm text-red-400">
              ⚠️ BOSS 区域
            </div>
          )}
        </div>

        {/* 行动按钮 */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onEncounter}
            disabled={floorExploreCount >= 3}
            className={`group relative overflow-hidden rounded-2xl border p-6 text-center transition ${
              floorExploreCount >= 3
                ? 'border-slate-600 bg-slate-800/30 cursor-not-allowed opacity-60'
                : 'border-red-500/50 bg-red-500/10 hover:bg-red-500/20'
            }`}
          >
            <div className={`mb-2 text-4xl transition ${floorExploreCount >= 3 ? '' : 'group-hover:scale-110'}`}>
              {floorExploreCount >= 3 ? '✅' : '⚔️'}
            </div>
            <div className={`font-bold ${floorExploreCount >= 3 ? 'text-slate-400' : 'text-red-400'}`}>
              {floorExploreCount >= 3 ? '已探索' : '探索'}
            </div>
            <div className={`text-sm ${floorExploreCount >= 3 ? 'text-slate-500' : 'text-red-400/70'}`}>
              {floorExploreCount >= 3 
                ? '本层已清理' 
                : `寻找敌人 (${floorExploreCount}/3)`}
            </div>
          </button>

          <button
            onClick={onNextFloor}
            disabled={floorExploreCount === 0}
            className={`group relative overflow-hidden rounded-2xl border p-6 text-center transition ${
              floorExploreCount === 0
                ? 'border-slate-600 bg-slate-800/30 cursor-not-allowed opacity-60'
                : 'border-green-500/50 bg-green-500/10 hover:bg-green-500/20'
            }`}
          >
            <div className={`mb-2 text-4xl transition ${floorExploreCount === 0 ? '' : 'group-hover:scale-110'}`}>
              🚪
            </div>
            <div className={`font-bold ${floorExploreCount === 0 ? 'text-slate-400' : 'text-green-400'}`}>
              下一层
            </div>
            <div className={`text-sm ${floorExploreCount === 0 ? 'text-slate-500' : 'text-green-400/70'}`}>
              {floorExploreCount === 0 ? '需先探索' : '进入更深的地牢'}
            </div>
          </button>
        </div>

        {/* 游戏日志 */}
        <div className="rounded-2xl border border-dark-600 bg-dark-800/50 p-5 shadow-lg backdrop-blur">
          <h4 className="mb-3 font-semibold text-slate-100">📜 冒险日志</h4>
          <div ref={logRef} className="h-48 overflow-y-auto space-y-2">
            {gameLog.map((log) => (
              <div key={log.id} className={`text-sm ${getLogColor(log.type)}`}>
                <span className="text-slate-600">[{new Date(log.timestamp).toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>{' '}
                {log.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function getLogColor(type: string): string {
  const colors: Record<string, string> = {
    normal: 'text-slate-300',
    damage: 'text-red-400',
    heal: 'text-green-400',
    crit: 'text-yellow-400',
    buff: 'text-blue-400',
    debuff: 'text-purple-400',
    system: 'text-slate-400 italic',
  }
  return colors[type] || 'text-slate-300'
}
