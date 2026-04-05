import type { Enemy } from '../types'

// 普通敌人
export const NORMAL_ENEMIES: Enemy[] = [
  {
    id: 'goblin',
    name: '哥布林',
    level: 1,
    hp: 30,
    maxHp: 30,
    mp: 10,
    maxMp: 10,
    stats: { strength: 5, intelligence: 2, agility: 6, defense: 3 },
    skills: [],
    expReward: 10,
    goldReward: 5,
    drops: [],
  },
  {
    id: 'slime',
    name: '史莱姆',
    level: 1,
    hp: 40,
    maxHp: 40,
    mp: 5,
    maxMp: 5,
    stats: { strength: 4, intelligence: 2, agility: 3, defense: 5 },
    skills: [],
    expReward: 8,
    goldReward: 3,
    drops: [],
  },
  {
    id: 'wolf',
    name: '野狼',
    level: 2,
    hp: 45,
    maxHp: 45,
    mp: 15,
    maxMp: 15,
    stats: { strength: 8, intelligence: 2, agility: 10, defense: 4 },
    skills: [],
    expReward: 15,
    goldReward: 8,
    drops: [],
  },
  {
    id: 'skeleton',
    name: '骷髅兵',
    level: 3,
    hp: 55,
    maxHp: 55,
    mp: 20,
    maxMp: 20,
    stats: { strength: 10, intelligence: 3, agility: 6, defense: 6 },
    skills: [],
    expReward: 20,
    goldReward: 12,
    drops: [],
  },
  {
    id: 'orc',
    name: '兽人',
    level: 4,
    hp: 80,
    maxHp: 80,
    mp: 25,
    maxMp: 25,
    stats: { strength: 14, intelligence: 4, agility: 7, defense: 8 },
    skills: [],
    expReward: 35,
    goldReward: 20,
    drops: [],
  },
]

// Boss 敌人
export const BOSS_ENEMIES: Enemy[] = [
  {
    id: 'goblin_king',
    name: '哥布林王',
    level: 5,
    hp: 150,
    maxHp: 150,
    mp: 50,
    maxMp: 50,
    stats: { strength: 18, intelligence: 8, agility: 12, defense: 10 },
    skills: [
      {
        id: 'heavy_strike',
        name: '重击',
        description: '造成150%物理伤害',
        mpCost: 10,
        damage: 1.5,
        target: 'single',
        type: 'physical',
      },
    ],
    expReward: 100,
    goldReward: 100,
    drops: [],
  },
  {
    id: 'dark_knight',
    name: '黑暗骑士',
    level: 10,
    hp: 300,
    maxHp: 300,
    mp: 80,
    maxMp: 80,
    stats: { strength: 30, intelligence: 15, agility: 18, defense: 20 },
    skills: [
      {
        id: 'dark_slash',
        name: '暗黑斩',
        description: '造成200%物理伤害',
        mpCost: 20,
        damage: 2,
        target: 'single',
        type: 'physical',
      },
    ],
    expReward: 300,
    goldReward: 300,
    drops: [],
  },
]

// 根据等级获取随机敌人
export function getRandomEnemy(playerLevel: number): Enemy {
  const availableEnemies = NORMAL_ENEMIES.filter(e => Math.abs(e.level - playerLevel) <= 2)
  const enemy = availableEnemies[Math.floor(Math.random() * availableEnemies.length)] || NORMAL_ENEMIES[0]
  
  // 创建副本以避免修改原数据
  return { ...enemy }
}

// 获取Boss
export function getBoss(bossId: string): Enemy | null {
  const boss = BOSS_ENEMIES.find(b => b.id === bossId)
  return boss ? { ...boss } : null
}
