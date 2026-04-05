import type { Skill, CharacterClass } from '../types'

// 职业技能
export const CLASS_SKILLS: Record<CharacterClass, Skill[]> = {
  warrior: [
    {
      id: 'slash',
      name: '斩击',
      description: '造成120%物理伤害',
      mpCost: 5,
      damage: 1.2,
      target: 'single',
      type: 'physical',
    },
    {
      id: 'power_attack',
      name: '强力攻击',
      description: '造成180%物理伤害',
      mpCost: 15,
      damage: 1.8,
      target: 'single',
      type: 'physical',
    },
    {
      id: 'defend',
      name: '防御姿态',
      description: '本回合受到的伤害减半',
      mpCost: 8,
      target: 'self',
      type: 'physical',
    },
  ],
  mage: [
    {
      id: 'fireball',
      name: '火球术',
      description: '造成150%魔法伤害',
      mpCost: 10,
      damage: 1.5,
      target: 'single',
      type: 'magical',
    },
    {
      id: 'ice_shard',
      name: '冰锥术',
      description: '造成120%魔法伤害，有概率冰冻',
      mpCost: 8,
      damage: 1.2,
      target: 'single',
      type: 'magical',
    },
    {
      id: 'heal',
      name: '治疗术',
      description: '恢复30点生命值',
      mpCost: 12,
      heal: 30,
      target: 'self',
      type: 'heal',
    },
  ],
  rogue: [
    {
      id: 'stab',
      name: '背刺',
      description: '造成150%物理伤害',
      mpCost: 8,
      damage: 1.5,
      target: 'single',
      type: 'physical',
    },
    {
      id: 'poison_blade',
      name: '毒刃',
      description: '造成100%物理伤害，使敌人中毒',
      mpCost: 12,
      damage: 1.0,
      target: 'single',
      type: 'physical',
    },
    {
      id: 'evade',
      name: '闪避',
      description: '本回合闪避率大幅提升',
      mpCost: 10,
      target: 'self',
      type: 'physical',
    },
  ],
}

// 通用技能（所有职业都有）
export const COMMON_SKILLS: Skill[] = [
  {
    id: 'attack',
    name: '普通攻击',
    description: '造成100%物理伤害',
    mpCost: 0,
    damage: 1.0,
    target: 'single',
    type: 'physical',
  },
  {
    id: 'magic_attack',
    name: '魔法飞弹',
    description: '造成100%魔法伤害',
    mpCost: 5,
    damage: 1.0,
    target: 'single',
    type: 'magical',
  },
]

// 获取角色技能
export function getCharacterSkills(characterClass: CharacterClass): Skill[] {
  return [...COMMON_SKILLS, ...CLASS_SKILLS[characterClass]]
}
