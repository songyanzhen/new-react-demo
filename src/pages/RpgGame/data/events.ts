import type { Item } from '../types'
import { CONSUMABLES } from './items'

// 探索事件类型
export type ExploreEventType = 
  | 'combat'      // 普通战斗
  | 'elite'       // 精英怪
  | 'hidden_boss' // 隐藏Boss
  | 'treasure'    // 宝藏
  | 'shrine'      // 神秘祭坛
  | 'merchant'    // 旅行商人
  | 'mystery'     // 神秘事件
  | 'rest'        // 休息点
  | 'trap'        // 陷阱

// 事件结果
export interface EventResult {
  type: ExploreEventType
  title: string
  description: string
  icon: string
  options?: { text: string; action: string; value?: number }[]
  rewards?: { gold?: number; item?: Item; exp?: number }
  penalties?: { hp?: number; mp?: number; gold?: number }
}

// 宝藏事件
export function getTreasureEvent(floor: number): EventResult {
  const treasures: EventResult[] = [
    {
      type: 'treasure',
      title: '发现宝箱！',
      description: '你发现了一个古老的宝箱，里面似乎有东西在发光。',
      icon: '💎',
      rewards: { gold: 30 + floor * 10 },
    },
    {
      type: 'treasure',
      title: '隐藏的密室',
      description: '你触发了一个机关，墙壁上出现了一个隐藏的房间，里面堆满了金币！',
      icon: '💰',
      rewards: { gold: 50 + floor * 15 },
    },
    {
      type: 'treasure',
      title: '冒险者的遗骸',
      description: '你发现了一个倒下的冒险者，他身旁的背包里还有一些补给品。',
      icon: '🎒',
      rewards: { item: floor >= 3 ? CONSUMABLES[1] : CONSUMABLES[0] }, // 中型或小型药水
    },
    {
      type: 'treasure',
      title: '神秘水晶',
      description: '你发现了散发着魔法光芒的水晶，触碰后感觉充满了力量！',
      icon: '🔮',
      rewards: { exp: 20 + floor * 5 },
    },
  ]
  return treasures[Math.floor(Math.random() * treasures.length)]
}

// 神秘祭坛事件
export function getShrineEvent(): EventResult {
  const shrines: EventResult[] = [
    {
      type: 'shrine',
      title: '治愈祭坛',
      description: '一个散发着柔和光芒的祭坛，可以恢复你的生命值。',
      icon: '✨',
      options: [
        { text: '祈祷 (恢复50%生命)', action: 'heal_hp', value: 50 },
        { text: '离开', action: 'leave' },
      ],
    },
    {
      type: 'shrine',
      title: '智慧祭坛',
      description: '一个古老的祭坛，据说可以增强你的能力。',
      icon: '📿',
      options: [
        { text: '献祭50金币 (获得经验)', action: 'exp', value: 50 },
        { text: '离开', action: 'leave' },
      ],
    },
    {
      type: 'shrine',
      title: '财富祭坛',
      description: '一个闪烁着金光的祭坛，你可以用生命值换取金币。',
      icon: '💰',
      options: [
        { text: '献祭30生命 (获得100金币)', action: 'trade_hp_gold', value: 30 },
        { text: '离开', action: 'leave' },
      ],
    },
  ]
  return shrines[Math.floor(Math.random() * shrines.length)]
}

// 旅行商人事件
export function getMerchantEvent(floor: number): EventResult {
  const items = floor >= 5 
    ? [CONSUMABLES[2], CONSUMABLES[5]] // 高级药水
    : floor >= 3 
      ? [CONSUMABLES[1], CONSUMABLES[4]] // 中级药水
      : [CONSUMABLES[0], CONSUMABLES[3]] // 初级药水
  
  const selectedItem = items[Math.floor(Math.random() * items.length)]
  const discountPrice = Math.floor(selectedItem.value * 0.7) // 7折
  
  return {
    type: 'merchant',
    title: '旅行商人',
    description: `一个神秘的商人挡住了你的去路。"年轻人，我这里有便宜的${selectedItem.name}，只要${discountPrice}金币，要来一个吗？"`,
    icon: '🏪',
    options: [
      { text: `购买 (${discountPrice}金币)`, action: 'buy', value: discountPrice },
      { text: '离开', action: 'leave' },
    ],
    rewards: { item: selectedItem },
  }
}

// 神秘事件
export function getMysteryEvent(_floor: number): EventResult {
  const mysteries: EventResult[] = [
    {
      type: 'mystery',
      title: '神秘传送门',
      description: '你发现了一个闪烁着奇异光芒的传送门，不知道通向哪里...',
      icon: '🌀',
      options: [
        { text: '进入传送门', action: 'portal' },
        { text: '离开', action: 'leave' },
      ],
    },
    {
      type: 'mystery',
      title: '奇怪的雕像',
      description: '你发现了一个诡异的雕像，它的眼睛似乎在盯着你...',
      icon: '🗿',
      options: [
        { text: '触摸雕像', action: 'statue_touch' },
        { text: '献祭10金币', action: 'statue_gold', value: 10 },
        { text: '离开', action: 'leave' },
      ],
    },
    {
      type: 'mystery',
      title: '古老的卷轴',
      description: '你在地上发现了一个古老的卷轴，上面记载着某种秘密...',
      icon: '📜',
      options: [
        { text: '阅读卷轴', action: 'scroll_read' },
        { text: '烧毁卷轴', action: 'scroll_burn' },
        { text: '收起来', action: 'scroll_keep' },
      ],
    },
    {
      type: 'mystery',
      title: '许愿井',
      description: '你发现了一口古老的井，传说向里面投掷金币可以实现愿望。',
      icon: '🕳️',
      options: [
        { text: '投入10金币许愿', action: 'wish', value: 10 },
        { text: '投入50金币许愿', action: 'wish_big', value: 50 },
        { text: '离开', action: 'leave' },
      ],
    },
  ]
  return mysteries[Math.floor(Math.random() * mysteries.length)]
}

// 陷阱事件
export function getTrapEvent(floor: number): EventResult {
  const traps: EventResult[] = [
    {
      type: 'trap',
      title: '陷阱！',
      description: '你不小心触发了一个陷阱！地板上的尖刺突然弹出！',
      icon: '⚠️',
      penalties: { hp: 15 + floor * 3 },
    },
    {
      type: 'trap',
      title: '毒气陷阱',
      description: '你踩到了一块松动的石板，毒气从墙壁的孔洞中喷出！',
      icon: '☠️',
      penalties: { hp: 10 + floor * 2 },
    },
    {
      type: 'trap',
      title: '落石陷阱',
      description: '你听到了轰隆声，天花板上开始掉落石块！',
      icon: '🪨',
      penalties: { hp: 20 + floor * 2 },
    },
    {
      type: 'trap',
      title: '诅咒陷阱',
      description: '你打开了一个看起来很诱人的箱子，但它是被诅咒的！',
      icon: '👻',
      penalties: { gold: 20 },
    },
  ]
  return traps[Math.floor(Math.random() * traps.length)]
}

// 休息点事件
export function getRestEvent(): EventResult {
  return {
    type: 'rest',
    title: '安全区域',
    description: '你找到了一个相对安全的角落，可以在这里稍作休息恢复体力。',
    icon: '🔥',
    options: [
      { text: '休息 (恢复20% HP/MP)', action: 'rest', value: 20 },
      { text: '深入冥想 (恢复40% MP)', action: 'meditate', value: 40 },
      { text: '包扎伤口 (恢复40% HP)', action: 'heal', value: 40 },
      { text: '继续探索', action: 'leave' },
    ],
  }
}

// 精英怪事件
export function getEliteEvent(floor: number): EventResult {
  const elites = [
    { name: '精英哥布林战士', icon: '👹', hpMult: 1.5, dmgMult: 1.3 },
    { name: '暗影刺客', icon: '🥷', hpMult: 1.3, dmgMult: 1.5 },
    { name: '狂暴狼王', icon: '🐺', hpMult: 1.8, dmgMult: 1.2 },
    { name: '骷髅将军', icon: '💀', hpMult: 1.6, dmgMult: 1.3 },
    { name: '火焰元素', icon: '🔥', hpMult: 1.4, dmgMult: 1.4 },
  ]
  const elite = elites[Math.floor(Math.random() * elites.length)]
  
  return {
    type: 'elite',
    title: `遭遇 ${elite.name}！`,
    description: `一只强大的${elite.name}挡住了你的去路！它散发着危险的气息...`,
    icon: elite.icon,
    options: [
      { text: '战斗！', action: 'fight_elite' },
      { text: '尝试逃跑', action: 'flee_elite' },
    ],
    rewards: { 
      gold: 80 + floor * 20, 
      exp: 40 + floor * 10 
    },
  }
}

// 隐藏Boss事件
export function getHiddenBossEvent(floor: number): EventResult {
  const hiddenBosses = [
    { name: '深渊监视者', icon: '👁️' },
    { name: '时空行者', icon: '⏳' },
    { name: '吞噬者', icon: '👹' },
  ]
  const boss = hiddenBosses[Math.floor(Math.random() * hiddenBosses.length)]
  
  return {
    type: 'hidden_boss',
    title: `隐藏Boss: ${boss.name}！`,
    description: `你意外触发了一个古老的封印，传说中的${boss.name}出现了！击败它将获得丰厚的奖励！`,
    icon: boss.icon,
    options: [
      { text: '接受挑战！', action: 'fight_hidden_boss' },
      { text: '逃跑！', action: 'flee_hidden_boss' },
    ],
    rewards: { 
      gold: 200 + floor * 50, 
      exp: 100 + floor * 20 
    },
  }
}

// 获取随机事件
export function getRandomExploreEvent(floor: number, exploreCount: number): ExploreEventType {
  // 基础概率
  const weights: Record<ExploreEventType, number> = {
    combat: 35,      // 普通战斗
    elite: 15,       // 精英怪
    hidden_boss: 3,  // 隐藏Boss (稀有)
    treasure: 12,    // 宝藏
    shrine: 8,       // 祭坛
    merchant: 10,    // 商人
    mystery: 8,      // 神秘事件
    rest: 5,         // 休息点
    trap: 4,         // 陷阱
  }
  
  // 根据探索次数调整概率
  if (exploreCount >= 4) {
    weights.combat += 10
    weights.elite += 5
  }
  if (floor % 5 === 0) {
    weights.hidden_boss += 2 // Boss层附近更容易遇到隐藏Boss
  }
  
  const total = Object.values(weights).reduce((a, b) => a + b, 0)
  let random = Math.random() * total
  
  for (const [type, weight] of Object.entries(weights)) {
    random -= weight
    if (random <= 0) return type as ExploreEventType
  }
  
  return 'combat'
}
