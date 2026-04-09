import type { Enemy, BaseStats } from '../types'
import { getEnemySkills } from './skills'

// 基础属性生成器
function createBaseStats(
  strength: number,
  intelligence: number,
  agility: number,
  vitality: number,
  dexterity: number,
  luck: number
): BaseStats {
  return {
    strength,
    intelligence,
    agility,
    vitality,
    dexterity,
    luck,
    attack: strength * 2 + agility,
    magicAttack: intelligence * 2 + dexterity,
    defense: Math.floor(strength * 0.5 + vitality),
    magicDefense: Math.floor(intelligence * 0.5 + vitality * 0.5),
    critRate: Math.min(5 + luck + Math.floor(dexterity * 0.3), 50),
    critDamage: 150 + Math.floor(strength * 0.5),
    hitRate: 90 + Math.floor(dexterity * 0.5),
    evasion: Math.min(agility, 40),
    speed: agility * 2 + Math.floor(strength * 0.5),
    fireResist: 0,
    iceResist: 0,
    poisonResist: 0,
  }
}

// 普通敌人
export const NORMAL_ENEMIES: Enemy[] = [
  {
    id: 'slime',
    name: '史莱姆',
    level: 1,
    hp: 30, maxHp: 30,
    mp: 10, maxMp: 10,
    stats: createBaseStats(3, 2, 2, 4, 2, 1),
    skills: [],
    statusEffects: [],
    aiType: 'random',
    expReward: 10,
    goldReward: 15,
    drops: [],
    appearance: { type: 'elemental', size: 'small', color: '#4ade80', animationState: 'idle' },
    isBoss: false,
  },
  {
    id: 'goblin',
    name: '哥布林',
    level: 1,
    hp: 35, maxHp: 35,
    mp: 15, maxMp: 15,
    stats: createBaseStats(5, 3, 6, 4, 5, 3),
    skills: getEnemySkills('goblin'),
    statusEffects: [],
    aiType: 'aggressive',
    expReward: 15,
    goldReward: 25,
    drops: [],
    appearance: { type: 'humanoid', size: 'small', color: '#22c55e', animationState: 'idle' },
    isBoss: false,
  },
  {
    id: 'rat',
    name: '巨型老鼠',
    level: 1,
    hp: 25, maxHp: 25,
    mp: 5, maxMp: 5,
    stats: createBaseStats(4, 1, 8, 3, 6, 2),
    skills: [],
    statusEffects: [],
    aiType: 'random',
    expReward: 8,
    goldReward: 12,
    drops: [],
    appearance: { type: 'beast', size: 'small', color: '#6b7280', animationState: 'idle' },
    isBoss: false,
  },
  {
    id: 'wolf',
    name: '野狼',
    level: 2,
    hp: 50, maxHp: 50,
    mp: 20, maxMp: 20,
    stats: createBaseStats(8, 3, 12, 6, 8, 4),
    skills: getEnemySkills('wolf'),
    statusEffects: [],
    aiType: 'aggressive',
    expReward: 22,
    goldReward: 35,
    drops: [],
    appearance: { type: 'beast', size: 'medium', color: '#9ca3af', animationState: 'idle' },
    isBoss: false,
  },
  {
    id: 'spider',
    name: '毒蜘蛛',
    level: 2,
    hp: 40, maxHp: 40,
    mp: 25, maxMp: 25,
    stats: createBaseStats(6, 4, 10, 5, 8, 3),
    skills: [{
      id: 'poison_bite', name: '毒咬', description: '造成100%物理伤害，中毒',
      icon: '🕷️', mpCost: 10, cooldown: 2, currentCooldown: 0,
      damage: 1.0, damageType: 'physical', target: 'single', type: 'physical',
      statusEffect: { type: 'poison', duration: 4, value: 6 },
      animation: 'bite',
    }],
    statusEffects: [],
    aiType: 'defensive',
    expReward: 18,
    goldReward: 30,
    drops: [],
    appearance: { type: 'beast', size: 'medium', color: '#7c3aed', animationState: 'idle' },
    isBoss: false,
  },
  {
    id: 'skeleton',
    name: '骷髅兵',
    level: 3,
    hp: 55, maxHp: 55,
    mp: 30, maxMp: 30,
    stats: createBaseStats(10, 3, 8, 7, 7, 2),
    skills: getEnemySkills('skeleton'),
    statusEffects: [],
    aiType: 'aggressive',
    expReward: 25,
    goldReward: 40,
    drops: [],
    appearance: { type: 'undead', size: 'medium', color: '#e5e7eb', animationState: 'idle' },
    isBoss: false,
  },
  {
    id: 'ghost',
    name: '幽灵',
    level: 3,
    hp: 45, maxHp: 45,
    mp: 50, maxMp: 50,
    stats: { ...createBaseStats(4, 12, 10, 4, 8, 5), evasion: 30 },
    skills: [{
      id: 'chill_touch', name: '寒冷之触', description: '造成100%魔法伤害，冰冻',
      icon: '👻', mpCost: 15, cooldown: 2, currentCooldown: 0,
      damage: 1.0, damageType: 'magical', target: 'single', type: 'magical',
      statusEffect: { type: 'freeze', duration: 1, value: 0 },
      animation: 'chill',
    }],
    statusEffects: [],
    aiType: 'defensive',
    expReward: 30,
    goldReward: 45,
    drops: [],
    appearance: { type: 'undead', size: 'medium', color: '#a5f3fc', animationState: 'idle' },
    isBoss: false,
  },
  {
    id: 'orc_warrior',
    name: '兽人战士',
    level: 4,
    hp: 90, maxHp: 90,
    mp: 30, maxMp: 30,
    stats: createBaseStats(15, 4, 8, 12, 7, 3),
    skills: getEnemySkills('orc'),
    statusEffects: [],
    aiType: 'aggressive',
    expReward: 40,
    goldReward: 55,
    drops: [],
    appearance: { type: 'humanoid', size: 'large', color: '#15803d', animationState: 'idle' },
    isBoss: false,
  },
  {
    id: 'ogre',
    name: '食人魔',
    level: 4,
    hp: 120, maxHp: 120,
    mp: 20, maxMp: 20,
    stats: createBaseStats(20, 2, 5, 18, 4, 2),
    skills: [{
      id: 'smash', name: '猛击', description: '造成160%物理伤害，眩晕',
      icon: '🔨', mpCost: 15, cooldown: 3, currentCooldown: 0,
      damage: 1.6, damageType: 'physical', target: 'single', type: 'physical',
      statusEffect: { type: 'stun', duration: 1, value: 0 },
      animation: 'smash',
    }],
    statusEffects: [],
    aiType: 'aggressive',
    expReward: 50,
    goldReward: 70,
    drops: [],
    appearance: { type: 'humanoid', size: 'large', color: '#92400e', animationState: 'idle' },
    isBoss: false,
  },
  {
    id: 'imp',
    name: '小恶魔',
    level: 5,
    hp: 60, maxHp: 60,
    mp: 60, maxMp: 60,
    stats: { ...createBaseStats(6, 12, 14, 5, 10, 8), fireResist: 50 },
    skills: [{
      id: 'firebolt', name: '小火球', description: '造成130%魔法伤害，灼烧',
      icon: '🔥', mpCost: 15, cooldown: 1, currentCooldown: 0,
      damage: 1.3, damageType: 'magical', target: 'single', type: 'magical',
      statusEffect: { type: 'burn', duration: 3, value: 8 },
      animation: 'fireball',
    }],
    statusEffects: [],
    aiType: 'defensive',
    expReward: 35,
    goldReward: 50,
    drops: [],
    appearance: { type: 'demon', size: 'small', color: '#ef4444', animationState: 'idle' },
    isBoss: false,
  },
  {
    id: 'demon_knight',
    name: '恶魔骑士',
    level: 6,
    hp: 150, maxHp: 150,
    mp: 60, maxMp: 60,
    stats: { ...createBaseStats(18, 10, 12, 15, 10, 5), fireResist: 30 },
    skills: getEnemySkills('dark_knight'),
    statusEffects: [],
    aiType: 'aggressive',
    expReward: 80,
    goldReward: 100,
    drops: [],
    appearance: { type: 'demon', size: 'large', color: '#7f1d1d', animationState: 'idle' },
    isBoss: false,
  },
]

// Boss 敌人
export const BOSS_ENEMIES: Enemy[] = [
  {
    id: 'goblin_king',
    name: '哥布林王',
    level: 5,
    hp: 150, maxHp: 150,
    mp: 80, maxMp: 80,
    stats: createBaseStats(14, 6, 12, 12, 10, 5),
    skills: [{
      id: 'goblin_rush', name: '哥布林冲锋', description: '对所有敌人造成100%物理伤害',
      icon: '👑', mpCost: 30, cooldown: 3, currentCooldown: 0,
      damage: 1.0, damageType: 'physical', target: 'all', type: 'physical',
      animation: 'rush',
    }, {
      id: 'summon_goblins', name: '召唤小弟', description: '召唤2个哥布林助战',
      icon: '👥', mpCost: 50, cooldown: 5, currentCooldown: 0,
      target: 'self', type: 'special', animation: 'summon',
    }],
    statusEffects: [],
    aiType: 'boss',
    expReward: 200,
    goldReward: 250,
    drops: [],
    appearance: { type: 'humanoid', size: 'large', color: '#fbbf24', animationState: 'idle' },
    isBoss: true,
    introText: '嘿嘿嘿，胆敢闯入我的领地！',
    deathText: '不可能...本王怎么会输...',
  },
  {
    id: 'lich',
    name: '巫妖',
    level: 8,
    hp: 220, maxHp: 220,
    mp: 200, maxMp: 200,
    stats: { ...createBaseStats(8, 20, 12, 15, 12, 6), iceResist: 50, poisonResist: 100 },
    skills: [{
      id: 'frost_nova', name: '冰霜新星', description: '对所有敌人造成120%魔法伤害，冰冻',
      icon: '❄️', mpCost: 50, cooldown: 4, currentCooldown: 0,
      damage: 1.2, damageType: 'magical', target: 'all', type: 'magical',
      statusEffect: { type: 'freeze', duration: 1, value: 0 },
      animation: 'nova',
    }, {
      id: 'death_decay', name: '死亡凋零', description: '每回合对所有敌人造成20伤害，持续5回合',
      icon: '☠️', mpCost: 80, cooldown: 6, currentCooldown: 0,
      target: 'all', type: 'debuff',
      statusEffect: { type: 'poison', duration: 5, value: 20 },
      animation: 'decay',
    }],
    statusEffects: [],
    aiType: 'boss',
    expReward: 500,
    goldReward: 600,
    drops: [],
    appearance: { type: 'undead', size: 'large', color: '#06b6d4', animationState: 'idle' },
    isBoss: true,
    introText: '死亡...只是开始...',
    deathText: '我的不死军团...终将归来...',
  },
  {
    id: 'dragon',
    name: '远古巨龙',
    level: 10,
    hp: 400, maxHp: 400,
    mp: 300, maxMp: 300,
    stats: { ...createBaseStats(22, 20, 16, 28, 12, 8), fireResist: 80, iceResist: 40 },
    skills: getEnemySkills('dragon'),
    statusEffects: [],
    aiType: 'boss',
    expReward: 1500,
    goldReward: 1500,
    drops: [],
    appearance: { type: 'dragon', size: 'huge', color: '#dc2626', animationState: 'idle' },
    isBoss: true,
    introText: '渺小的凡人，感受龙焰的愤怒吧！',
    deathText: '这不可能...龙族...竟然败了...',
  },
  {
    id: 'demon_lord',
    name: '恶魔领主',
    level: 12,
    hp: 550, maxHp: 550,
    mp: 400, maxMp: 400,
    stats: { ...createBaseStats(26, 28, 24, 28, 16, 12), fireResist: 100 },
    skills: [{
      id: 'hellfire', name: '地狱火', description: '对所有敌人造成150%魔法伤害，灼烧3回合',
      icon: '🔥', mpCost: 100, cooldown: 4, currentCooldown: 0,
      damage: 1.5, damageType: 'magical', target: 'all', type: 'magical',
      statusEffect: { type: 'burn', duration: 3, value: 35 },
      animation: 'hellfire',
    }, {
      id: 'demon_armor', name: '恶魔护甲', description: '防御力翻倍，持续5回合',
      icon: '⭕', mpCost: 80, cooldown: 6, currentCooldown: 0,
      target: 'self', type: 'buff',
      statChanges: { defense: 100 },
      animation: 'armor',
    }],
    statusEffects: [],
    aiType: 'boss',
    expReward: 2500,
    goldReward: 3000,
    drops: [],
    appearance: { type: 'demon', size: 'huge', color: '#000000', animationState: 'idle' },
    isBoss: true,
    introText: '跪下，臣服于我，或者死！',
    deathText: '不！！我还会回来的！！',
  },
]

// 辅助函数
export function getRandomEnemy(_playerLevel: number, floor: number): Enemy {
  let availableEnemies: Enemy[] = []
  
  if (floor <= 1) {
    availableEnemies = NORMAL_ENEMIES.filter(e => e.level <= 2)
  } else if (floor <= 2) {
    availableEnemies = NORMAL_ENEMIES.filter(e => e.level >= 1 && e.level <= 3)
  } else if (floor <= 3) {
    availableEnemies = NORMAL_ENEMIES.filter(e => e.level >= 2 && e.level <= 4)
  } else if (floor <= 4) {
    availableEnemies = NORMAL_ENEMIES.filter(e => e.level >= 3 && e.level <= 5)
  } else {
    availableEnemies = NORMAL_ENEMIES.filter(e => e.level >= 4)
  }
  
  if (availableEnemies.length === 0) {
    availableEnemies = NORMAL_ENEMIES.slice(0, 3)
  }
  
  const enemy = availableEnemies[Math.floor(Math.random() * availableEnemies.length)]
  const scaledEnemy = { ...enemy }
  const levelDiff = Math.max(0, Math.floor(floor / 2) - 1)
  
  if (levelDiff > 0) {
    scaledEnemy.level += levelDiff
    scaledEnemy.hp = Math.floor(scaledEnemy.hp * (1 + levelDiff * 0.2))
    scaledEnemy.maxHp = scaledEnemy.hp
    scaledEnemy.expReward = Math.floor(scaledEnemy.expReward * (1 + levelDiff * 0.1))
    scaledEnemy.goldReward = Math.floor(scaledEnemy.goldReward * (1 + levelDiff * 0.1))
  }
  
  return scaledEnemy
}

export function getBoss(bossId: string): Enemy | null {
  const boss = BOSS_ENEMIES.find(b => b.id === bossId)
  return boss ? { ...boss } : null
}

export function getBossForFloor(floor: number): Enemy | null {
  if (floor === 5) return getBoss('goblin_king')
  if (floor === 10) return getBoss('lich')
  if (floor === 15) return getBoss('dragon')
  if (floor === 20) return getBoss('demon_lord')
  return null
}
