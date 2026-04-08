import { useState } from 'react'
import type { Character, Inventory, Item } from '../types'

interface BlacksmithProps {
  player: Character
  inventory: Inventory
  onUpgrade: (item: Item, cost: number) => void
  onClose: () => void
}

export function Blacksmith({ player, inventory, onUpgrade, onClose }: BlacksmithProps) {
  const [selectedSlot, setSelectedSlot] = useState<'weapon' | 'armor' | 'accessory' | null>(null)
  
  const getEquippedItem = (slot: 'weapon' | 'armor' | 'accessory') => {
    return player.equipment[slot]
  }
  
  const calculateUpgradeCost = (item: Item | null) => {
    if (!item) return 0
    return Math.floor(item.value * 0.6) // 升级费用为物品价值的60%
  }
  
  const getUpgradeBonus = (item: Item | null) => {
    if (!item) return null
    const upgradeLevel = item.upgradeLevel || 0
    const nextLevel = upgradeLevel + 1
    
    if (nextLevel > 5) return null // 最高5级
    
    const bonusPercent = nextLevel * 10 // 每级+10%
    return { level: nextLevel, bonus: bonusPercent }
  }
  
  const canAfford = (cost: number) => inventory.gold >= cost
  
  const slotLabels: Record<string, { label: string; icon: string }> = {
    weapon: { label: '武器', icon: '⚔️' },
    armor: { label: '护甲', icon: '🛡️' },
    accessory: { label: '饰品', icon: '💍' },
  }
  
  return (
    <div className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-6 shadow-lg">
      {/* 标题 */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔨</span>
          <div>
            <h3 className="font-bold text-orange-400">铁匠铺</h3>
            <p className="text-xs text-slate-400">强化装备提升属性</p>
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
      
      {/* 装备槽选择 */}
      <div className="mb-4 grid grid-cols-3 gap-3">
        {(Object.keys(slotLabels) as Array<'weapon' | 'armor' | 'accessory'>).map(slot => {
          const item = getEquippedItem(slot)
          const isSelected = selectedSlot === slot
          
          return (
            <button
              key={slot}
              onClick={() => setSelectedSlot(slot)}
              className={`rounded-xl border p-3 text-center transition ${
                isSelected
                  ? 'border-orange-500 bg-orange-500/20'
                  : 'border-dark-600 bg-dark-800/50 hover:bg-dark-700'
              }`}
            >
              <div className="text-2xl">{slotLabels[slot].icon}</div>
              <div className="text-sm text-slate-400">{slotLabels[slot].label}</div>
              {item ? (
                <div className="mt-1 text-xs text-orange-400">
                  {item.name}
                  {item.upgradeLevel && item.upgradeLevel > 0 && (
                    <span className="text-yellow-400"> +{item.upgradeLevel}</span>
                  )}
                </div>
              ) : (
                <div className="mt-1 text-xs text-slate-600">未装备</div>
              )}
            </button>
          )
        })}
      </div>
      
      {/* 强化详情 */}
      {selectedSlot && (
        <div className="rounded-xl border border-dark-600 bg-dark-800/50 p-4">
          {(() => {
            const item = getEquippedItem(selectedSlot)
            if (!item) {
              return (
                <div className="py-4 text-center text-slate-500">
                  请先装备{slotLabels[selectedSlot].label}
                </div>
              )
            }
            
            const cost = calculateUpgradeCost(item)
            const upgrade = getUpgradeBonus(item)
            
            if (!upgrade) {
              return (
                <div className="py-4 text-center">
                  <div className="text-yellow-400 font-bold">已达最高强化等级</div>
                  <div className="text-sm text-slate-500 mt-1">
                    {item.name} +5
                  </div>
                </div>
              )
            }
            
            return (
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <div className="font-medium text-slate-200">
                      {item.name}
                      {item.upgradeLevel && item.upgradeLevel > 0 && (
                        <span className="text-yellow-400"> +{item.upgradeLevel}</span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400">
                      强化至 +{upgrade.level}，属性提升 {upgrade.bonus}%
                    </div>
                  </div>
                </div>
                
                <div className="mb-3 rounded-lg bg-dark-700/50 p-2 text-xs text-slate-400">
                  <div className="mb-1 text-slate-300">当前效果：</div>
                  {item.effect.statBoost && Object.entries(item.effect.statBoost).map(([key, value]) => (
                    <span key={key} className="mr-3">
                      {getStatLabel(key)}: +{value}
                    </span>
                  ))}
                  <div className="mt-1 text-orange-400">
                    强化后: 属性提升 {upgrade.bonus}%
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`font-mono font-bold ${canAfford(cost) ? 'text-yellow-400' : 'text-red-400'}`}>
                    {cost} G
                  </span>
                  <button
                    onClick={() => onUpgrade(item, cost)}
                    disabled={!canAfford(cost)}
                    className={`rounded-lg px-4 py-2 text-sm transition ${
                      canAfford(cost)
                        ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 border border-orange-500/50'
                        : 'bg-dark-700 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    🔨 强化
                  </button>
                </div>
              </div>
            )
          })()}
        </div>
      )}
      
      {!selectedSlot && (
        <div className="py-4 text-center text-slate-500">
          选择上方装备槽位进行强化
        </div>
      )}
    </div>
  )
}

function getStatLabel(key: string): string {
  const labels: Record<string, string> = {
    attack: '攻击力',
    magicAttack: '魔攻',
    defense: '防御力',
    magicDefense: '魔防',
    strength: '力量',
    intelligence: '智力',
    agility: '敏捷',
    vitality: '体质',
    dexterity: '灵巧',
    luck: '幸运',
    critRate: '暴击率',
    critDamage: '暴伤',
    hitRate: '命中',
    evasion: '闪避',
    maxHp: '生命',
    maxMp: '魔法',
    fireResist: '火抗',
    iceResist: '冰抗',
    poisonResist: '毒抗',
  }
  return labels[key] || key
}
