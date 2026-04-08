import { useState } from 'react'
import type { Item, Inventory } from '../types'
import { getShopItems } from '../data/items'

interface ShopProps {
  currentFloor: number
  inventory: Inventory
  onBuy: (item: Item) => void
  onClose: () => void
}

export function Shop({ currentFloor, inventory, onBuy, onClose }: ShopProps) {
  const [activeTab, setActiveTab] = useState<'consumable' | 'weapon' | 'armor' | 'accessory' | 'skill'>('consumable')
  
  const shopItems = getShopItems(currentFloor)
  
  const filteredItems = shopItems.filter(item => {
    switch (activeTab) {
      case 'consumable': return item.type === 'consumable'
      case 'weapon': return item.type === 'weapon'
      case 'armor': return item.type === 'armor'
      case 'accessory': return item.type === 'accessory'
      case 'skill': return item.type === 'material'
      default: return true
    }
  })
  
  const canAfford = (price: number) => inventory.gold >= price
  
  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      consumable: '消耗品',
      weapon: '武器',
      armor: '护甲',
      accessory: '饰品',
      material: '技能书',
    }
    return labels[type] || type
  }
  
  const tabs = [
    { id: 'consumable', label: '消耗品', icon: '🧪' },
    { id: 'weapon', label: '武器', icon: '⚔️' },
    { id: 'armor', label: '护甲', icon: '🛡️' },
    { id: 'accessory', label: '饰品', icon: '💍' },
    { id: 'skill', label: '技能书', icon: '📚' },
  ] as const
  
  return (
    <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-6 shadow-lg">
      {/* 商店标题 */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏪</span>
          <div>
            <h3 className="font-bold text-yellow-400">神秘商人</h3>
            <p className="text-xs text-slate-400">第 {currentFloor} 层特产</p>
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
      
      {/* 分类标签 */}
      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-lg px-3 py-1.5 text-sm transition ${
              activeTab === tab.id
                ? 'bg-yellow-500/30 text-yellow-400 border border-yellow-500/50'
                : 'bg-dark-800/50 text-slate-400 border border-dark-600 hover:bg-dark-700'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>
      
      {/* 商品列表 */}
      <div className="max-h-64 overflow-y-auto space-y-2">
        {filteredItems.length === 0 ? (
          <div className="py-8 text-center text-slate-500">
            本层没有此类商品
          </div>
        ) : (
          filteredItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="flex items-center gap-3 rounded-xl border border-dark-600 bg-dark-800/50 p-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-dark-700 text-xl">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-200">{item.name}</span>
                  <span className="rounded bg-dark-700 px-1.5 py-0.5 text-xs text-slate-400">
                    {getTypeLabel(item.type)}
                  </span>
                </div>
                <p className="truncate text-xs text-slate-500">{item.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`font-mono font-bold ${canAfford(item.value) ? 'text-yellow-400' : 'text-red-400'}`}>
                  {item.value} G
                </span>
                <button
                  onClick={() => onBuy(item)}
                  disabled={!canAfford(item.value)}
                  className={`rounded-lg px-3 py-1.5 text-sm transition ${
                    canAfford(item.value)
                      ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border border-yellow-500/50'
                      : 'bg-dark-700 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  购买
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
