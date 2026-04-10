// 神器系统 - 极其稀有的强力装备
import type { Item } from '../types'

export interface Artifact extends Item {
  rarity: 'legendary' | 'mythic' | 'divine'
  specialEffect: string
  unlockCondition?: string
}

export const ARTIFACTS: Artifact[] = [
  // 传说级神器 (Legendary)
  {
    id: 'artifact_excalibur',
    name: '誓约胜利之剑',
    type: 'weapon',
    description: '传说中的王者之剑，拥有斩断一切邪恶的力量',
    icon: '⚔️',
    effect: { 
      statBoost: { 
        attack: 80, 
        strength: 15, 
        critRate: 25,
        critDamage: 50 
      } 
    },
    value: 10000,
    rarity: 'legendary',
    specialEffect: '攻击时有20%几率造成3倍伤害',
    unlockCondition: '击败恶魔领主后小概率获得',
  },
  {
    id: 'artifact_aegis',
    name: '埃癸斯神盾',
    type: 'armor',
    description: '众神打造的绝对防御之盾，可抵御一切攻击',
    icon: '🛡️',
    effect: { 
      statBoost: { 
        defense: 60, 
        magicDefense: 50,
        vitality: 20,
        fireResist: 30,
        iceResist: 30,
        poisonResist: 30
      } 
    },
    value: 10000,
    rarity: 'legendary',
    specialEffect: '受到伤害时有15%几率完全免疫',
    unlockCondition: '在隐藏Boss战中获胜',
  },
  {
    id: 'artifact_phoenix_feather',
    name: '凤凰之羽',
    type: 'accessory',
    description: '不死凤凰的尾羽，赋予佩戴者重生的力量',
    icon: '🪶',
    effect: { 
      statBoost: { 
        maxHp: 200,
        maxMp: 100,
        luck: 20
      } 
    },
    value: 8000,
    rarity: 'legendary',
    specialEffect: '死亡时30%几率满血复活（每场战斗1次）',
    unlockCondition: '在神秘事件中获得',
  },
  {
    id: 'artifact_mjolnir',
    name: '雷神之锤',
    type: 'weapon',
    description: '雷神托尔的神器，蕴含着毁灭性的雷电之力',
    icon: '🔨',
    effect: { 
      statBoost: { 
        attack: 70, 
        magicAttack: 40,
        strength: 12,
        dexterity: 12
      } 
    },
    value: 9500,
    rarity: 'legendary',
    specialEffect: '攻击时附带连锁闪电，对相邻敌人造成伤害',
    unlockCondition: '击败远古巨龙后获得',
  },

  // 神话级神器 (Mythic)
  {
    id: 'artifact_infinity_gauntlet',
    name: '无限手套',
    type: 'accessory',
    description: '镶嵌着六颗无限宝石的手套，拥有改写现实的力量',
    icon: '🧤',
    effect: { 
      statBoost: { 
        strength: 25,
        intelligence: 25,
        agility: 25,
        vitality: 25,
        dexterity: 25,
        luck: 25
      } 
    },
    value: 50000,
    rarity: 'mythic',
    specialEffect: '全属性+25%，所有技能冷却-1回合',
    unlockCondition: '集齐所有其他神器后解锁',
  },
  {
    id: 'artifact_grail',
    name: '圣杯',
    type: 'accessory',
    description: '可实现持有者愿望的神圣之杯',
    icon: '🏆',
    effect: { 
      statBoost: { 
        maxHp: 300,
        maxMp: 200,
        vitality: 15,
        intelligence: 15
      } 
    },
    value: 30000,
    rarity: 'mythic',
    specialEffect: '每回合自动恢复10% HP和MP',
    unlockCondition: '在许愿井投入1000金币后1%几率',
  },

  // 神级神器 (Divine)
  {
    id: 'artifact_creation_crystal',
    name: '创世水晶',
    type: 'accessory',
    description: '宇宙诞生之初的碎片，蕴含着创世之力',
    icon: '💎',
    effect: { 
      statBoost: { 
        attack: 150,
        magicAttack: 150,
        defense: 100,
        magicDefense: 100,
        maxHp: 500,
        maxMp: 300
      } 
    },
    value: 100000,
    rarity: 'divine',
    specialEffect: '攻击无视敌人50%防御，受到伤害减少30%',
    unlockCondition: '只能通过作弊模式或极端运气获得',
  },
]

// 隐藏技能
export interface HiddenSkill {
  id: string
  name: string
  description: string
  icon: string
  effect: string
  unlockCondition: string
}

export const HIDDEN_SKILLS: HiddenSkill[] = [
  {
    id: 'hidden_omnislash',
    name: '究极奥义·无限斩',
    description: '传说中的剑术奥义，瞬间斩出无数剑',
    icon: '⚔️',
    effect: '对单个敌人造成500%物理伤害',
    unlockCondition: '装备誓约胜利之剑后领悟',
  },
  {
    id: 'hidden_apocalypse',
    name: '末日审判',
    description: '召唤神圣之力毁灭一切敌人',
    icon: '☀️',
    effect: '对所有敌人造成300%魔法伤害，50%即死',
    unlockCondition: '击败恶魔领主后领悟',
  },
  {
    id: 'hidden_time_stop',
    name: '时间停止',
    description: '冻结时间，只有你能行动',
    icon: '⏱️',
    effect: '敌人无法行动3回合',
    unlockCondition: '击败时空行者后领悟',
  },
  {
    id: 'hidden_resurrection',
    name: '完全复活术',
    description: '逆转生死的禁忌之术',
    icon: '✨',
    effect: '满血满蓝复活，清除所有负面状态',
    unlockCondition: '持有凤凰之羽后领悟',
  },
]

// 属性提升奖励
export interface StatBoostReward {
  id: string
  name: string
  description: string
  icon: string
  statBoost: Partial<Record<string, number>>
  permanent: boolean
}

export const STAT_BOOSTS: StatBoostReward[] = [
  {
    id: 'boost_strength_of_heroes',
    name: '英雄之力',
    description: '你感受到了古代英雄的力量在体内觉醒',
    icon: '💪',
    statBoost: { strength: 5, attack: 10 },
    permanent: true,
  },
  {
    id: 'boost_wisdom_of_sages',
    name: '贤者智慧',
    description: '你领悟了古老的智慧',
    icon: '📚',
    statBoost: { intelligence: 5, magicAttack: 15 },
    permanent: true,
  },
  {
    id: 'boost_agility_of_wind',
    name: '疾风步',
    description: '你的身体变得如风般轻盈',
    icon: '💨',
    statBoost: { agility: 5, evasion: 10, speed: 20 },
    permanent: true,
  },
  {
    id: 'boost_vitality_of_dragons',
    name: '龙血觉醒',
    description: '龙族的血脉在你体内觉醒',
    icon: '🐉',
    statBoost: { vitality: 8, maxHp: 100, fireResist: 20 },
    permanent: true,
  },
  {
    id: 'boost_luck_of_fortune',
    name: '幸运女神的祝福',
    description: '幸运女神对你微笑',
    icon: '🍀',
    statBoost: { luck: 10, critRate: 10 },
    permanent: true,
  },
]

// 获取随机神器
export function getRandomArtifact(rarity?: 'legendary' | 'mythic' | 'divine'): Artifact | null {
  let pool = ARTIFACTS
  if (rarity) {
    pool = ARTIFACTS.filter(a => a.rarity === rarity)
  }
  if (pool.length === 0) return null
  return pool[Math.floor(Math.random() * pool.length)]
}

// 获取随机属性提升
export function getRandomStatBoost(): StatBoostReward {
  return STAT_BOOSTS[Math.floor(Math.random() * STAT_BOOSTS.length)]
}

// 获取随机隐藏技能
export function getRandomHiddenSkill(): HiddenSkill {
  return HIDDEN_SKILLS[Math.floor(Math.random() * HIDDEN_SKILLS.length)]
}

// 检查解锁条件（简化版）
export function checkArtifactUnlock(artifactId: string, _player: any): boolean {
  const artifact = ARTIFACTS.find(a => a.id === artifactId)
  if (!artifact) return false
  
  // 根据稀有度设置基础概率
  const baseChance: Record<string, number> = {
    legendary: 0.01,  // 1%
    mythic: 0.005,    // 0.5%
    divine: 0.001,    // 0.1%
  }
  
  return Math.random() < (baseChance[artifact.rarity] || 0)
}
