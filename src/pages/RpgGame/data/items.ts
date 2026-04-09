import type { Item } from '../types'

// 消耗品
export const CONSUMABLES: Item[] = [
  {
    id: 'small_hp_potion',
    name: '小型生命药水',
    type: 'consumable',
    description: '恢复 50 点生命值',
    icon: '🧪',
    effect: { hpRestore: 50 },
    value: 20,
  },
  {
    id: 'medium_hp_potion',
    name: '中型生命药水',
    type: 'consumable',
    description: '恢复 100 点生命值',
    icon: '🧪',
    effect: { hpRestore: 100 },
    value: 50,
  },
  {
    id: 'large_hp_potion',
    name: '大型生命药水',
    type: 'consumable',
    description: '恢复 200 点生命值',
    icon: '🧪',
    effect: { hpRestore: 200 },
    value: 100,
  },
  {
    id: 'small_mp_potion',
    name: '小型魔法药水',
    type: 'consumable',
    description: '恢复 30 点魔法值',
    icon: '💧',
    effect: { mpRestore: 30 },
    value: 25,
  },
  {
    id: 'medium_mp_potion',
    name: '中型魔法药水',
    type: 'consumable',
    description: '恢复 60 点魔法值',
    icon: '💧',
    effect: { mpRestore: 60 },
    value: 60,
  },
  {
    id: 'large_mp_potion',
    name: '大型魔法药水',
    type: 'consumable',
    description: '恢复 120 点魔法值',
    icon: '💧',
    effect: { mpRestore: 120 },
    value: 120,
  },
  {
    id: 'full_restore',
    name: '完全恢复药剂',
    type: 'consumable',
    description: '完全恢复生命值和魔法值',
    icon: '🏺',
    effect: { hpRestore: 9999, mpRestore: 9999 },
    value: 200,
  },
]

// 武器
export const WEAPONS: Item[] = [
  // 战士武器
  {
    id: 'iron_sword',
    name: '铁剑',
    type: 'weapon',
    description: '战士基础武器，攻击力+10',
    icon: '⚔️',
    effect: { statBoost: { attack: 10 } },
    value: 100,
  },
  {
    id: 'steel_sword',
    name: '钢剑',
    type: 'weapon',
    description: '战士进阶武器，攻击力+20',
    icon: '⚔️',
    effect: { statBoost: { attack: 15, critRate: 3 } },
    value: 250,
  },
  {
    id: 'berserker_axe',
    name: '狂战士之斧',
    type: 'weapon',
    description: '战士高级武器，攻击力+35，暴击率+10%',
    icon: '🪓',
    effect: { statBoost: { attack: 22, critRate: 8, critDamage: 15 } },
    value: 600,
  },
  // 法师武器
  {
    id: 'wooden_staff',
    name: '木杖',
    type: 'weapon',
    description: '法师基础武器，魔法攻击+15',
    icon: '🪄',
    effect: { statBoost: { magicAttack: 15 } },
    value: 100,
  },
  {
    id: 'crystal_staff',
    name: '水晶法杖',
    type: 'weapon',
    description: '法师进阶武器，魔法攻击+30',
    icon: '🪄',
    effect: { statBoost: { magicAttack: 22, intelligence: 3 } },
    value: 280,
  },
  {
    id: 'archmage_staff',
    name: '大法师之杖',
    type: 'weapon',
    description: '法师高级武器，魔法攻击+50，智力+10',
    icon: '🔮',
    effect: { statBoost: { magicAttack: 32, intelligence: 6 } },
    value: 700,
  },
  // 盗贼武器
  {
    id: 'dagger',
    name: '匕首',
    type: 'weapon',
    description: '盗贼基础武器，攻击力+8，敏捷+5',
    icon: '🗡️',
    effect: { statBoost: { attack: 8, agility: 5 } },
    value: 100,
  },
  {
    id: 'shadow_blade',
    name: '暗影之刃',
    type: 'weapon',
    description: '盗贼进阶武器，攻击力+18，敏捷+10',
    icon: '🗡️',
    effect: { statBoost: { attack: 14, agility: 8, critRate: 8 } },
    value: 280,
  },
  {
    id: 'assassin_dagger',
    name: '刺客之匕',
    type: 'weapon',
    description: '盗贼高级武器，攻击力+25，暴击率+20%',
    icon: '🗡️',
    effect: { statBoost: { attack: 20, critRate: 15, critDamage: 25 } },
    value: 650,
  },
  // 通用武器
  {
    id: 'legendary_sword',
    name: '传说之剑',
    type: 'weapon',
    description: '传说中的武器，攻击力+50',
    icon: '🗡️',
    effect: { statBoost: { attack: 35, strength: 8, critRate: 12 } },
    value: 1200,
  },
]

// 护甲
export const ARMORS: Item[] = [
  {
    id: 'leather_armor',
    name: '皮甲',
    type: 'armor',
    description: '基础护甲，防御+10，闪避+5',
    icon: '🦺',
    effect: { statBoost: { defense: 10, evasion: 5 } },
    value: 80,
  },
  {
    id: 'chain_mail',
    name: '锁子甲',
    type: 'armor',
    description: '进阶护甲，防御+20',
    icon: '👕',
    effect: { statBoost: { defense: 16, magicDefense: 8 } },
    value: 220,
  },
  {
    id: 'plate_armor',
    name: '板甲',
    type: 'armor',
    description: '重型护甲，防御+35，体质+10',
    icon: '🛡️',
    effect: { statBoost: { defense: 25, vitality: 8 } },
    value: 450,
  },
  {
    id: 'mage_robe',
    name: '法师长袍',
    type: 'armor',
    description: '法师护甲，魔法防御+25，智力+10',
    icon: '👘',
    effect: { statBoost: { magicDefense: 20, intelligence: 8, maxMp: 30 } },
    value: 320,
  },
  {
    id: 'shadow_cloak',
    name: '暗影斗篷',
    type: 'armor',
    description: '盗贼护甲，防御+15，闪避+15',
    icon: '🧥',
    effect: { statBoost: { defense: 14, evasion: 12, agility: 8 } },
    value: 380,
  },
  {
    id: 'dragon_scale',
    name: '龙鳞甲',
    type: 'armor',
    description: '传说护甲，防御+50，全抗性+20',
    icon: '🐉',
    effect: { statBoost: { defense: 35, magicDefense: 25, fireResist: 15, iceResist: 15 } },
    value: 1500,
  },
]

// 饰品
export const ACCESSORIES: Item[] = [
  {
    id: 'health_ring',
    name: '生命戒指',
    type: 'accessory',
    description: '最大生命值+50',
    icon: '💍',
    effect: { statBoost: { maxHp: 50 } },
    value: 150,
  },
  {
    id: 'mana_ring',
    name: '魔力戒指',
    type: 'accessory',
    description: '最大魔法值+30',
    icon: '💍',
    effect: { statBoost: { maxMp: 30 } },
    value: 150,
  },
  {
    id: 'power_ring',
    name: '力量戒指',
    type: 'accessory',
    description: '力量+5，攻击力+5',
    icon: '💍',
    effect: { statBoost: { strength: 5, attack: 5 } },
    value: 200,
  },
  {
    id: 'agility_ring',
    name: '敏捷戒指',
    type: 'accessory',
    description: '敏捷+5，闪避+5',
    icon: '💍',
    effect: { statBoost: { agility: 5, evasion: 5 } },
    value: 200,
  },
  {
    id: 'wisdom_ring',
    name: '智慧戒指',
    type: 'accessory',
    description: '智力+5，魔法攻击+10',
    icon: '💍',
    effect: { statBoost: { intelligence: 5, magicAttack: 10 } },
    value: 200,
  },
  {
    id: 'lucky_charm',
    name: '幸运护符',
    type: 'accessory',
    description: '幸运+10，暴击率+5%',
    icon: '🍀',
    effect: { statBoost: { luck: 10, critRate: 5 } },
    value: 300,
  },
  {
    id: 'crit_necklace',
    name: '暴击项链',
    type: 'accessory',
    description: '暴击率+15%，暴击伤害+20%',
    icon: '📿',
    effect: { statBoost: { critRate: 15, critDamage: 20 } },
    value: 500,
  },
  {
    id: 'resist_amulet',
    name: '抗性护符',
    type: 'accessory',
    description: '全元素抗性+15',
    icon: '📿',
    effect: { statBoost: { fireResist: 15, iceResist: 15, poisonResist: 15 } },
    value: 400,
  },
  {
    id: 'god_amulet',
    name: '神之护符',
    type: 'accessory',
    description: '全属性+5，全抗性+10',
    icon: '✨',
    effect: { statBoost: { strength: 5, intelligence: 5, agility: 5, vitality: 5, luck: 5, fireResist: 10, iceResist: 10, poisonResist: 10 } },
    value: 3000,
  },
]

// 技能书
export const SKILL_BOOKS: Item[] = [
  {
    id: 'book_fireball',
    name: '火球术技能书',
    type: 'material',
    description: '学习技能：火球术（造成160%魔法伤害，30%灼烧）',
    icon: '📕',
    effect: {},
    value: 500,
  },
  {
    id: 'book_ice_shard',
    name: '冰锥术技能书',
    type: 'material',
    description: '学习技能：冰锥术（造成140%魔法伤害，25%冰冻）',
    icon: '📘',
    effect: {},
    value: 500,
  },
  {
    id: 'book_lightning',
    name: '连锁闪电技能书',
    type: 'material',
    description: '学习技能：连锁闪电（对所有敌人造成100%魔法伤害）',
    icon: '📙',
    effect: {},
    value: 800,
  },
  {
    id: 'book_heal',
    name: '治疗术技能书',
    type: 'material',
    description: '学习技能：治疗术（恢复40%最大生命值）',
    icon: '📗',
    effect: {},
    value: 600,
  },
  {
    id: 'book_whirlwind',
    name: '旋风斩技能书',
    type: 'material',
    description: '学习技能：旋风斩（对所有敌人造成80%物理伤害）',
    icon: '📕',
    effect: {},
    value: 700,
  },
  {
    id: 'book_power_attack',
    name: '强力打击技能书',
    type: 'material',
    description: '学习技能：强力打击（造成200%物理伤害，无视50%防御）',
    icon: '📘',
    effect: {},
    value: 600,
  },
]

// 根据楼层获取商店商品
export function getShopItems(floor: number): Item[] {
  const items: Item[] = []
  
  // 药水（每层都有）
  items.push(CONSUMABLES[0]) // 小型生命药水
  items.push(CONSUMABLES[3]) // 小型魔法药水
  
  if (floor >= 2) {
    items.push(CONSUMABLES[1]) // 中型生命药水
    items.push(CONSUMABLES[4]) // 中型魔法药水
  }
  
  if (floor >= 4) {
    items.push(CONSUMABLES[2]) // 大型生命药水
    items.push(CONSUMABLES[5]) // 大型魔法药水
  }
  
  // 装备（根据楼层）
  if (floor >= 1) {
    items.push(WEAPONS[0], WEAPONS[3], WEAPONS[6]) // 基础武器
    items.push(ARMORS[0]) // 基础护甲
    items.push(ACCESSORIES[0], ACCESSORIES[1]) // 基础饰品
  }
  
  if (floor >= 3) {
    items.push(WEAPONS[1], WEAPONS[4], WEAPONS[7]) // 进阶武器
    items.push(ARMORS[1], ARMORS[3], ARMORS[4]) // 进阶护甲
    items.push(ACCESSORIES[2], ACCESSORIES[3], ACCESSORIES[4], ACCESSORIES[5]) // 进阶饰品
  }
  
  if (floor >= 5) {
    items.push(WEAPONS[2], WEAPONS[5], WEAPONS[8]) // 高级武器
    items.push(ARMORS[2]) // 高级护甲
    items.push(ACCESSORIES[6], ACCESSORIES[7]) // 高级饰品
  }
  
  // 技能书（特定楼层）
  if (floor === 2 || floor === 6) items.push(SKILL_BOOKS[0]) // 火球术
  if (floor === 3 || floor === 7) items.push(SKILL_BOOKS[1]) // 冰锥术
  if (floor === 4 || floor === 8) items.push(SKILL_BOOKS[2]) // 连锁闪电
  if (floor === 2 || floor === 5) items.push(SKILL_BOOKS[3]) // 治疗术
  if (floor === 3 || floor === 6) items.push(SKILL_BOOKS[4]) // 旋风斩
  if (floor === 4 || floor === 7) items.push(SKILL_BOOKS[5]) // 强力打击
  
  return items
}
