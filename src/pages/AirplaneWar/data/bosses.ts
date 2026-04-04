import type { BossType, BossConfig } from '../types'

// Boss 血量成长系数
export function getBossHpMultiplier(defeatedCount: number): number {
  // 每击败1个Boss，后续Boss血量增加20%，最高翻倍
  return Math.min(1 + defeatedCount * 0.2, 2.0)
}

// Boss 攻击间隔随难度调整
export function getBossAttackInterval(defeatedCount: number): number {
  // 每击败1个Boss，攻击间隔减少5%，最低700ms
  return Math.max(700, 900 - defeatedCount * 45)
}

export const BOSS_CONFIGS: Record<BossType, BossConfig> = {
  destroyer: {
    name: '毁灭者',
    description: '重装型要塞，火力覆盖全场',
    size: { width: 90, height: 90 },
    hp: 80,
    speed: 1.2,
    scoreReward: 600,
    colors: {
      main: '#dc2626',
      dark: '#991b1b',
      light: '#fca5a5',
    },
  },
  phantom: {
    name: '幽灵战机',
    description: '高速隐形单位，难以捉摸',
    size: { width: 70, height: 70 },
    hp: 55,
    speed: 2.5,
    scoreReward: 700,
    colors: {
      main: '#7c3aed',
      dark: '#5b21b6',
      light: '#c4b5fd',
    },
  },
  mothership: {
    name: '虚空母舰',
    description: '巨型航母，源源不断的援军',
    size: { width: 110, height: 110 },
    hp: 130,
    speed: 0.6,
    scoreReward: 1000,
    colors: {
      main: '#0891b2',
      dark: '#0e7490',
      light: '#67e8f9',
    },
  },
  // 新增Boss
  overlord: {
    name: '虫群主宰',
    description: '生物机械混合体，吞噬一切',
    size: { width: 100, height: 100 },
    hp: 100,
    speed: 1.0,
    scoreReward: 800,
    colors: {
      main: '#16a34a',
      dark: '#166534',
      light: '#86efac',
    },
  },
  nova: {
    name: '新星核心',
    description: '能量生命体，释放毁灭射线',
    size: { width: 80, height: 80 },
    hp: 70,
    speed: 1.8,
    scoreReward: 750,
    colors: {
      main: '#f59e0b',
      dark: '#d97706',
      light: '#fcd34d',
    },
  },
  titan: {
    name: '远古泰坦',
    description: '传说级存在，拥有再生能力',
    size: { width: 120, height: 120 },
    hp: 180,
    speed: 0.5,
    scoreReward: 1200,
    colors: {
      main: '#64748b',
      dark: '#475569',
      light: '#cbd5e1',
    },
  },
}

// Boss出现间隔（普通得分）
export const BOSS_SPAWN_THRESHOLD = 200

// 所有Boss类型
const ALL_BOSS_TYPES: BossType[] = ['destroyer', 'phantom', 'mothership', 'overlord', 'nova', 'titan']

// 随机获取Boss类型
export function getRandomBossType(): BossType {
  const randomIndex = Math.floor(Math.random() * ALL_BOSS_TYPES.length)
  const selectedBoss = ALL_BOSS_TYPES[randomIndex]
  console.log(`[Boss Random] Selected: ${selectedBoss} (index: ${randomIndex})`)
  return selectedBoss
}

// 基础攻击间隔（建议使用 getBossAttackInterval 函数）
export const BOSS_ATTACK_INTERVAL_BASE = 900
