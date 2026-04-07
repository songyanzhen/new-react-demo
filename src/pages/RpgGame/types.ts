// RPG 游戏类型定义

// 游戏状态
export type GamePhase = 'explore' | 'battle' | 'dialog' | 'menu' | 'gameOver'

// 角色职业
export type CharacterClass = 'warrior' | 'mage' | 'rogue' | 'paladin' | 'ranger'

// 战斗状态效果
export type StatusEffectType = 
  | 'poison'      // 中毒：每回合扣血
  | 'burn'        // 灼烧：每回合扣血
  | 'freeze'      // 冰冻：无法行动
  | 'stun'        // 眩晕：无法行动
  | 'bleed'       // 流血：每回合扣血
  | 'buff_atk'    // 攻击提升
  | 'buff_def'    // 防御提升
  | 'buff_spd'    // 速度提升
  | 'debuff_atk'  // 攻击降低
  | 'debuff_def'  // 防御降低
  | 'regen'       // 再生：每回合回血
  | 'shield'      // 护盾：吸收伤害

// 状态效果
export interface StatusEffect {
  type: StatusEffectType
  duration: number  // 持续回合数
  value: number     // 效果数值
}

// 完整属性系统
export interface BaseStats {
  // 基础属性
  strength: number      // 力量：影响物理攻击
  intelligence: number  // 智力：影响魔法攻击
  agility: number       // 敏捷：影响速度和闪避
  vitality: number      // 体质：影响生命值
  dexterity: number     // 灵巧：影响命中和暴击
  luck: number          // 幸运：影响暴击和掉落
  
  // 战斗属性（由基础属性计算得出）
  attack: number        // 攻击力
  magicAttack: number  // 魔法攻击力
  defense: number      // 防御力
  magicDefense: number // 魔法防御力
  
  // 高级属性
  critRate: number     // 暴击率 (0-100)
  critDamage: number   // 暴击伤害倍率 (默认150%)
  hitRate: number      // 命中率 (0-100)
  evasion: number      // 闪避率 (0-100)
  speed: number        // 速度：决定行动顺序
  
  // 抗性
  fireResist: number   // 火抗 (0-100)
  iceResist: number    // 冰抗 (0-100)
  poisonResist: number // 毒抗 (0-100)
}

// 角色
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
  
  // 基础属性点（可分配）
  baseStats: BaseStats
  
  // 当前战斗属性（包含装备加成）
  currentStats: BaseStats
  
  // 战斗状态
  statusEffects: StatusEffect[]
  
  equipment: Equipment
  skills: Skill[]
  
  // 外观
  appearance: CharacterAppearance
}

// 角色外观
export interface CharacterAppearance {
  bodyColor: string
  hairStyle: number
  hairColor: string
  weaponType: string
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
  icon: string
  effect: {
    hpRestore?: number
    mpRestore?: number
    statBoost?: Partial<BaseStats>
    statusEffect?: StatusEffect
  }
  value: number
}

// 技能目标
export type SkillTarget = 'self' | 'single' | 'all' | 'random'

// 技能类型
export type SkillType = 'physical' | 'magical' | 'heal' | 'buff' | 'debuff' | 'special'

// 技能
export interface Skill {
  id: string
  name: string
  description: string
  icon: string
  mpCost: number
  cooldown: number      // 冷却回合
  currentCooldown: number // 当前冷却
  
  // 伤害/治疗
  damage?: number       // 伤害倍率
  damageType?: 'physical' | 'magical' | 'true'  // 伤害类型
  heal?: number         // 治疗数值
  healPercent?: number  // 治疗百分比
  
  // 效果
  target: SkillTarget
  type: SkillType
  statusEffect?: StatusEffect  // 附加状态
  statChanges?: Partial<BaseStats>  // 属性变化
  
  // 特效
  animation: string     // 动画名称
  soundEffect?: string  // 音效
}

// 敌人AI类型
export type EnemyAIType = 'aggressive' | 'defensive' | 'support' | 'random' | 'boss'

// 敌人
export interface Enemy {
  id: string
  name: string
  level: number
  hp: number
  maxHp: number
  mp: number
  maxMp: number
  
  // 属性
  stats: BaseStats
  
  // 战斗
  skills: Skill[]
  statusEffects: StatusEffect[]
  
  // AI
  aiType: EnemyAIType
  
  // 奖励
  expReward: number
  goldReward: number
  drops: { item: Item; chance: number }[]
  
  // 外观
  appearance: EnemyAppearance
  
  // 特殊
  isBoss: boolean
  introText?: string    // 登场台词
  deathText?: string    // 死亡台词
}

// 敌人外观
export interface EnemyAppearance {
  type: 'humanoid' | 'beast' | 'undead' | 'elemental' | 'demon' | 'dragon'
  size: 'small' | 'medium' | 'large' | 'huge'
  color: string
  animationState: 'idle' | 'attack' | 'hurt' | 'dead'
}

// 地图格子类型
export type TileType = 'empty' | 'enemy' | 'treasure' | 'boss' | 'heal' | 'event' | 'shop'

// 地图格子
export interface MapTile {
  x: number
  y: number
  type: TileType
  explored: boolean
  content?: Enemy | Item | string
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
  selectedSkill?: Skill
  battleLog: BattleLogEntry[]
  isAnimating: boolean
}

// 战斗日志条目
export interface BattleLogEntry {
  id: string
  text: string
  type: 'normal' | 'damage' | 'heal' | 'crit' | 'miss' | 'buff' | 'debuff' | 'system'
  timestamp: number
}

// 背包
export interface Inventory {
  items: { item: Item; quantity: number }[]
  gold: number
  maxSlots: number
}

// 作弊模式状态
export interface CheatMode {
  enabled: boolean
  godMode: boolean        // 无敌
  oneHitKill: boolean     // 一击必杀
  infiniteMP: boolean     // 无限MP
  maxDropRate: boolean    // 最大掉率
}

// 游戏存档
export interface GameSave {
  player: Character
  inventory: Inventory
  currentMap: GameMap
  gamePhase: GamePhase
  currentFloor: number
  cheatMode: CheatMode
}
