// RPG 游戏类型定义

// 游戏状态
export type GamePhase = 'explore' | 'battle' | 'dialog' | 'menu' | 'gameOver'

// 角色职业
export type CharacterClass = 'warrior' | 'mage' | 'rogue'

// 角色属性
export interface Character {
  id: string
  name: string
  class: CharacterClass
  level: number
  exp: number
  maxExp: number
  hp: number
  maxHp: number
  mp: number
  maxMp: number
  stats: {
    strength: number  // 力量：影响物理攻击
    intelligence: number  // 智力：影响魔法攻击
    agility: number  // 敏捷：影响速度和闪避
    defense: number  // 防御：减少受到伤害
  }
  equipment: Equipment
  skills: Skill[]
}

// 装备
export interface Equipment {
  weapon: Item | null
  armor: Item | null
  accessory: Item | null
}

// 物品类型
export type ItemType = 'weapon' | 'armor' | 'accessory' | 'consumable' | 'material'

// 物品
export interface Item {
  id: string
  name: string
  type: ItemType
  description: string
  effect: {
    hpRestore?: number
    mpRestore?: number
    statBoost?: Partial<Character['stats']>
  }
  value: number  // 金币价值
}

// 技能
export interface Skill {
  id: string
  name: string
  description: string
  mpCost: number
  damage?: number
  heal?: number
  target: 'self' | 'single' | 'all'
  type: 'physical' | 'magical' | 'heal'
}

// 敌人
export interface Enemy {
  id: string
  name: string
  level: number
  hp: number
  maxHp: number
  mp: number
  maxMp: number
  stats: Character['stats']
  skills: Skill[]
  expReward: number
  goldReward: number
  drops: { item: Item; chance: number }[]
}

// 地图格子类型
export type TileType = 'empty' | 'enemy' | 'treasure' | 'boss' | 'heal' | 'event'

// 地图格子
export interface MapTile {
  x: number
  y: number
  type: TileType
  explored: boolean
  content?: Enemy | Item | string  // 敌人、物品或事件描述
}

// 游戏地图
export interface GameMap {
  width: number
  height: number
  tiles: MapTile[][]
  playerPosition: { x: number; y: number }
}

// 战斗状态
export interface BattleState {
  player: Character
  enemies: Enemy[]
  turn: number
  currentTurn: 'player' | 'enemy'
  selectedEnemyIndex: number
  battleLog: string[]
}

// 背包
export interface Inventory {
  items: { item: Item; quantity: number }[]
  gold: number
}

// 游戏存档
export interface GameSave {
  player: Character
  inventory: Inventory
  currentMap: GameMap
  gamePhase: GamePhase
}
