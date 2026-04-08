import { useState } from 'react'
import type { Character, Inventory } from '../types'

interface RestStationProps {
  player: Character
  inventory: Inventory
  onRest: (type: 'hp' | 'mp' | 'full', cost: number) => void
  onClose: () => void
}

export function RestStation({ player, inventory, onRest, onClose }: RestStationProps) {
  const [resting, setResting] = useState(false)
  
  const hpPercent = Math.floor((player.hp / player.maxHp) * 100)
  const mpPercent = Math.floor((player.mp / player.maxMp) * 100)
  
  // 计算恢复费用
  const hpNeeded = player.maxHp - player.hp
  const mpNeeded = player.maxMp - player.mp
  
  const hpCost = Math.ceil(hpNeeded * 0.5)  // 每点HP 0.5金币
  const mpCost = Math.ceil(mpNeeded * 0.8)  // 每点MP 0.8金币
  const fullCost = Math.ceil((hpCost + mpCost) * 0.8) // 全恢复8折
  
  const canAfford = (cost: number) => inventory.gold >= cost
  
  const handleRest = (type: 'hp' | 'mp' | 'full', cost: number) => {
    if (!canAfford(cost)) return
    setResting(true)
    setTimeout(() => {
      onRest(type, cost)
      setResting(false)
    }, 1000)
  }
  
  return (
    <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-6 shadow-lg">
      {/* 标题 */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏕️</span>
          <div>
            <h3 className="font-bold text-green-400">冒险者营地</h3>
            <p className="text-xs text-slate-400">休息恢复生命值和魔法值</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="rounded-lg bg-yellow-500/20 px-3 py-1 text-yellow-400">
            💰 {inventory.gold} G
          </div>
          <button
            onClick={onClose}
            className="rounded-lg bg-dark-700 px-3 py-1 text-sm text-slate-300 transition hover:bg-dark-600"
          >
            离开
          </button>
        </div>
      </div>
      
      {/* 当前状态 */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-dark-600 bg-dark-800/50 p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">生命值</span>
            <span className={hpPercent < 30 ? 'text-red-400' : 'text-green-400'}>
              {player.hp}/{player.maxHp}
            </span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-dark-700 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
              style={{ width: `${hpPercent}%` }}
            />
          </div>
        </div>
        <div className="rounded-xl border border-dark-600 bg-dark-800/50 p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">魔法值</span>
            <span className={mpPercent < 30 ? 'text-red-400' : 'text-blue-400'}>
              {player.mp}/{player.maxMp}
            </span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-dark-700 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all"
              style={{ width: `${mpPercent}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* 恢复选项 */}
      <div className="space-y-3">
        {/* 恢复生命 */}
        <div className="flex items-center gap-3 rounded-xl border border-dark-600 bg-dark-800/50 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/20 text-xl">
            ❤️
          </div>
          <div className="flex-1">
            <div className="font-medium text-slate-200">恢复生命</div>
            <div className="text-xs text-slate-400">
              恢复 {hpNeeded} 点生命值
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`font-mono font-bold ${canAfford(hpCost) ? 'text-yellow-400' : 'text-red-400'}`}>
              {hpCost} G
            </span>
            <button
              onClick={() => handleRest('hp', hpCost)}
              disabled={!canAfford(hpCost) || hpNeeded <= 0 || resting}
              className={`rounded-lg px-4 py-2 text-sm transition ${
                canAfford(hpCost) && hpNeeded > 0 && !resting
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/50'
                  : 'bg-dark-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              {resting ? '恢复中...' : '恢复'}
            </button>
          </div>
        </div>
        
        {/* 恢复魔法 */}
        <div className="flex items-center gap-3 rounded-xl border border-dark-600 bg-dark-800/50 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20 text-xl">
            💧
          </div>
          <div className="flex-1">
            <div className="font-medium text-slate-200">恢复魔法</div>
            <div className="text-xs text-slate-400">
              恢复 {mpNeeded} 点魔法值
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`font-mono font-bold ${canAfford(mpCost) ? 'text-yellow-400' : 'text-red-400'}`}>
              {mpCost} G
            </span>
            <button
              onClick={() => handleRest('mp', mpCost)}
              disabled={!canAfford(mpCost) || mpNeeded <= 0 || resting}
              className={`rounded-lg px-4 py-2 text-sm transition ${
                canAfford(mpCost) && mpNeeded > 0 && !resting
                  ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/50'
                  : 'bg-dark-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              {resting ? '恢复中...' : '恢复'}
            </button>
          </div>
        </div>
        
        {/* 完全恢复 */}
        <div className="flex items-center gap-3 rounded-xl border border-yellow-500/50 bg-yellow-500/10 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/20 text-xl">
            ✨
          </div>
          <div className="flex-1">
            <div className="font-medium text-yellow-400">完全恢复</div>
            <div className="text-xs text-yellow-400/70">
              恢复全部生命值和魔法值（8折优惠）
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`font-mono font-bold ${canAfford(fullCost) ? 'text-yellow-400' : 'text-red-400'}`}>
              {fullCost} G
            </span>
            <button
              onClick={() => handleRest('full', fullCost)}
              disabled={!canAfford(fullCost) || (hpNeeded <= 0 && mpNeeded <= 0) || resting}
              className={`rounded-lg px-4 py-2 text-sm transition ${
                canAfford(fullCost) && (hpNeeded > 0 || mpNeeded > 0) && !resting
                  ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border border-yellow-500/50'
                  : 'bg-dark-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              {resting ? '恢复中...' : '恢复'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
