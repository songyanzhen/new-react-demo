import { useState, useCallback, useRef } from 'react'
import type { 
  Character, CharacterClass, GamePhase, BattleState, Enemy, Skill, 
  Inventory, BaseStats, CheatMode, BattleLogEntry, Item 
} from '../types'
import { getRandomEnemy, getBossForFloor } from '../data/enemies'
import { getCharacterSkills, LEARNABLE_SKILLS } from '../data/skills'
import { 
  getRandomExploreEvent, 
  getTreasureEvent, 
  getShrineEvent, 
  getMerchantEvent, 
  getMysteryEvent, 
  getTrapEvent, 
  getRestEvent,
  getEliteEvent,
  getHiddenBossEvent,
  type EventResult
} from '../data/events'
import { 
  getRandomArtifact, 
  getRandomHiddenSkill, 
  getRandomStatBoost
} from '../data/artifacts'

// ==================== 初始角色创建 ====================

function createInitialStats(characterClass: CharacterClass): BaseStats {
  const baseValues = {
    warrior: { str: 12, int: 4, agi: 6, vit: 10, dex: 6, luck: 4 },
    mage: { str: 4, int: 14, agi: 6, vit: 6, dex: 8, luck: 5 },
    rogue: { str: 8, int: 6, agi: 14, vit: 6, dex: 12, luck: 7 },
    paladin: { str: 10, int: 8, agi: 5, vit: 12, dex: 5, luck: 4 },
    ranger: { str: 8, int: 6, agi: 12, vit: 7, dex: 14, luck: 6 },
  }

  const v = baseValues[characterClass]
  
  return {
    strength: v.str,
    intelligence: v.int,
    agility: v.agi,
    vitality: v.vit,
    dexterity: v.dex,
    luck: v.luck,
    attack: v.str * 2 + v.agi,
    magicAttack: v.int * 2 + v.dex,
    defense: Math.floor(v.str * 0.5 + v.vit),
    magicDefense: Math.floor(v.int * 0.5 + v.vit * 0.5),
    critRate: Math.min(5 + v.luck + Math.floor(v.dex * 0.3), 50),
    critDamage: 150 + Math.floor(v.str * 0.5),
    hitRate: 90 + Math.floor(v.dex * 0.5),
    evasion: Math.min(v.agi, 40),
    speed: v.agi * 2 + Math.floor(v.str * 0.5),
    fireResist: 0,
    iceResist: 0,
    poisonResist: 0,
  }
}

function createInitialCharacter(name: string, characterClass: CharacterClass): Character {
  const baseStats = createInitialStats(characterClass)
  const maxHp = 80 + baseStats.vitality * 10
  const maxMp = 40 + baseStats.intelligence * 5

  return {
    id: 'player',
    name,
    class: characterClass,
    level: 1,
    exp: 0,
    maxExp: 100,
    hp: maxHp,
    maxHp,
    mp: maxMp,
    maxMp,
    baseStats,
    currentStats: { ...baseStats },
    statusEffects: [],
    equipment: { weapon: null, armor: null, accessory: null },
    skills: getCharacterSkills(characterClass),
    appearance: {
      bodyColor: getClassColor(characterClass),
      hairStyle: 1,
      hairColor: '#4a3728',
      weaponType: getClassWeapon(characterClass),
    },
  }
}

function getClassColor(c: CharacterClass): string {
  const colors = { warrior: '#ef4444', mage: '#3b82f6', rogue: '#22c55e', paladin: '#f59e0b', ranger: '#8b5cf6' }
  return colors[c]
}

function getClassWeapon(c: CharacterClass): string {
  const weapons = { warrior: 'sword', mage: 'staff', rogue: 'dagger', paladin: 'hammer', ranger: 'bow' }
  return weapons[c]
}

// ==================== 主 Hook ====================

export function useRpgGame() {
  // 游戏状态
  const [gamePhase, setGamePhase] = useState<GamePhase>('explore')
  const [player, setPlayer] = useState<Character | null>(null)
  const [battleState, setBattleState] = useState<BattleState | null>(null)
  const [inventory, setInventory] = useState<Inventory>({ items: [], gold: 100, maxSlots: 20 })
  const [gameLog, setGameLog] = useState<BattleLogEntry[]>([{ id: '1', text: '欢迎来到 RPG 世界！', type: 'system', timestamp: Date.now() }])
  const [currentFloor, setCurrentFloor] = useState(1)
  const [floorExploreCount, setFloorExploreCount] = useState(0)  // 当前楼层探索次数（最多5次）
  const [battleAnimation, setBattleAnimation] = useState<string | null>(null)
  
  // 当前探索事件
  const [currentEvent, setCurrentEvent] = useState<EventResult | null>(null)
  
  // 探索场景状态: 'main' | 'shop' | 'rest' | 'blacksmith'
  const [exploreScene, setExploreScene] = useState<'main' | 'shop' | 'rest' | 'blacksmith'>('main')
  
  // 作弊模式
  const [cheatMode, setCheatMode] = useState<CheatMode>({
    enabled: false,
    godMode: false,
    oneHitKill: false,
    infiniteMP: false,
    maxDropRate: false,
  })
  
  // 彩蛋点击计数器
  const titleClickCount = useRef(0)
  const lastClickTime = useRef(0)

  // 添加日志（同时更新 gameLog 和 battleState.battleLog）
  const addLog = useCallback((text: string, type: BattleLogEntry['type'] = 'normal') => {
    const newEntry: BattleLogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      type,
      timestamp: Date.now(),
    }
    
    // 更新探索日志
    setGameLog(prev => [...prev.slice(-19), newEntry])
    
    // 如果在战斗中，也更新战斗日志
    setBattleState(prev => {
      if (!prev) return null
      return {
        ...prev,
        battleLog: [...prev.battleLog.slice(-19), newEntry]
      }
    })
  }, [])

  // 彩蛋：连续点击标题5次激活作弊模式
  const handleTitleClick = useCallback(() => {
    const now = Date.now()
    if (now - lastClickTime.current > 2000) {
      titleClickCount.current = 0
    }
    lastClickTime.current = now
    titleClickCount.current++
    
    if (titleClickCount.current >= 5) {
      titleClickCount.current = 0
      const newCheatMode = { ...cheatMode, enabled: !cheatMode.enabled }
      setCheatMode(newCheatMode)
      addLog(newCheatMode.enabled ? '作弊模式已激活！按 C 键切换选项' : '作弊模式已关闭', 'system')
    }
  }, [cheatMode, addLog])

  // 切换作弊选项
  const toggleCheatOption = useCallback((option: keyof Omit<CheatMode, 'enabled'>) => {
    if (!cheatMode.enabled) return
    setCheatMode(prev => ({ ...prev, [option]: !prev[option] }))
  }, [cheatMode.enabled])

  // 计算实际属性（包含装备加成和状态效果）
  const calculateStats = useCallback((character: Character): BaseStats => {
    const base = character.baseStats
    let stats: BaseStats = {
      // 基础属性直接复制
      strength: base.strength,
      intelligence: base.intelligence,
      agility: base.agility,
      vitality: base.vitality,
      dexterity: base.dexterity,
      luck: base.luck,
      // 重新计算战斗属性
      attack: base.strength * 2 + base.agility,
      magicAttack: base.intelligence * 2 + base.dexterity,
      defense: Math.floor(base.strength * 0.5 + base.vitality),
      magicDefense: Math.floor(base.intelligence * 0.5 + base.vitality * 0.5),
      // 重新计算高级属性
      critRate: Math.min(5 + base.luck + Math.floor(base.dexterity * 0.3), 50),
      critDamage: 150 + Math.floor(base.strength * 0.5),
      hitRate: 90 + Math.floor(base.dexterity * 0.5),
      evasion: Math.min(base.agility, 40),
      speed: base.agility * 2 + Math.floor(base.strength * 0.5),
      // 抗性（基础为0，可由装备加成）
      fireResist: 0,
      iceResist: 0,
      poisonResist: 0,
    }
    
    // 装备加成
    Object.values(character.equipment).forEach(item => {
      if (item?.effect.statBoost) {
        Object.entries(item.effect.statBoost).forEach(([key, value]) => {
          if (value && key in stats) {
            (stats as any)[key] += value
          }
        })
      }
    })
    
    // 状态效果加成（增益/减益）
    character.statusEffects.forEach(effect => {
      switch (effect.type) {
        case 'buff_atk':
          stats.attack = Math.floor(stats.attack * (1 + effect.value / 100))
          break
        case 'buff_def':
          stats.defense = Math.floor(stats.defense * (1 + effect.value / 100))
          break
        case 'buff_spd':
          stats.speed = Math.floor(stats.speed * (1 + effect.value / 100))
          break
        case 'debuff_atk':
          stats.attack = Math.floor(stats.attack * (1 - effect.value / 100))
          break
        case 'debuff_def':
          stats.defense = Math.floor(stats.defense * (1 - effect.value / 100))
          break
      }
    })
    
    // 确保属性不低于1
    stats.attack = Math.max(1, stats.attack)
    stats.magicAttack = Math.max(1, stats.magicAttack)
    stats.defense = Math.max(0, stats.defense)
    stats.magicDefense = Math.max(0, stats.magicDefense)
    
    return stats
  }, [])

  // 作弊：获取神器
  const cheatGetArtifact = useCallback((rarity: 'legendary' | 'mythic' | 'divine') => {
    if (!player) return
    const artifact = getRandomArtifact(rarity)
    if (artifact) {
      setInventory(prev => ({
        ...prev,
        items: [...prev.items, { item: artifact, quantity: 1 }]
      }))
      addLog(`[作弊] 获得了${rarity === 'legendary' ? '传说' : rarity === 'mythic' ? '神话' : '神级'}神器：${artifact.name}！`, 'buff')
    }
  }, [player, addLog])

  // 作弊：获取隐藏技能
  const cheatGetHiddenSkill = useCallback(() => {
    if (!player) return
    const hiddenSkill = getRandomHiddenSkill()
    // 创建技能对象
    const newSkill: Skill = {
      id: hiddenSkill.id,
      name: hiddenSkill.name,
      description: hiddenSkill.description,
      icon: hiddenSkill.icon,
      mpCost: 50,
      cooldown: 5,
      currentCooldown: 0,
      damage: 5.0,
      damageType: 'true',
      target: 'single',
      type: 'special',
      animation: 'ultimate',
    }
    setPlayer({
      ...player,
      skills: [...player.skills, newSkill]
    })
    addLog(`[作弊] 领悟了隐藏技能：${hiddenSkill.name}！`, 'buff')
  }, [player, addLog])

  // 作弊：属性提升
  const cheatGetStatBoost = useCallback(() => {
    if (!player) return
    const boost = getRandomStatBoost()
    // 永久提升基础属性
    const newBaseStats = { ...player.baseStats }
    Object.entries(boost.statBoost).forEach(([key, value]) => {
      if (value && key in newBaseStats) {
        (newBaseStats as any)[key] += value
      }
    })
    setPlayer({
      ...player,
      baseStats: newBaseStats,
      currentStats: calculateStats({ ...player, baseStats: newBaseStats })
    })
    addLog(`[作弊] 获得了${boost.name}！属性永久提升！`, 'buff')
  }, [player, addLog, calculateStats])

  // 作弊：升级
  const cheatLevelUp = useCallback(() => {
    if (!player) return
    const newPlayer = { ...player }
    newPlayer.exp = 0
    newPlayer.level += 1
    newPlayer.maxExp = Math.floor(newPlayer.maxExp * 1.3)
    // 升级奖励
    newPlayer.baseStats.strength += 2
    newPlayer.baseStats.intelligence += 2
    newPlayer.baseStats.agility += 2
    newPlayer.baseStats.vitality += 2
    newPlayer.baseStats.dexterity += 1
    newPlayer.baseStats.luck += 1
    // 重新计算属性
    const newMaxHp = 80 + newPlayer.baseStats.vitality * 10
    const newMaxMp = 40 + newPlayer.baseStats.intelligence * 5
    newPlayer.maxHp = newMaxHp
    newPlayer.hp = newMaxHp
    newPlayer.maxMp = newMaxMp
    newPlayer.mp = newMaxMp
    newPlayer.currentStats = calculateStats(newPlayer)
    setPlayer(newPlayer)
    addLog(`[作弊] 升级了！达到 ${newPlayer.level} 级！`, 'system')
  }, [player, addLog, calculateStats])

  // 作弊：添加金币
  const cheatAddGold = useCallback((amount: number) => {
    if (amount === -1) {
      // 特殊标记：恢复满血满蓝
      if (player) {
        setPlayer({ ...player, hp: player.maxHp, mp: player.maxMp })
        addLog('[作弊] 恢复满血满蓝！', 'heal')
      }
    } else {
      setInventory(prev => ({ ...prev, gold: prev.gold + amount }))
      addLog(`[作弊] 获得了 ${amount} 金币！`, 'buff')
    }
  }, [player, addLog])

  // 开始新游戏
  const startGame = useCallback((name: string, characterClass: CharacterClass) => {
    const newPlayer = createInitialCharacter(name, characterClass)
    setPlayer(newPlayer)
    setInventory({ items: [], gold: 100, maxSlots: 20 })
    setGamePhase('explore')
    setCurrentFloor(1)
    setGameLog([{ id: '1', text: `欢迎，${name}！你选择了${getClassName(characterClass)}职业。`, type: 'system', timestamp: Date.now() }])
  }, [])

  // 探索事件处理
  const encounterEnemy = useCallback(() => {
    if (!player) return
    
    // 检查探索次数（最多5次）
    if (floorExploreCount >= 5) {
      addLog('本层已经探索完毕，请前往下一层！', 'system')
      return
    }
    
    // 增加探索次数
    setFloorExploreCount(prev => prev + 1)
    
    // 确保玩家当前属性是最新的
    const updatedPlayer = { ...player }
    updatedPlayer.currentStats = calculateStats(updatedPlayer)
    setPlayer(updatedPlayer)
    
    // 检查是否触发Boss战
    const boss = getBossForFloor(currentFloor)
    if (boss) {
      setBattleState({
        player: updatedPlayer,
        enemies: [{ ...boss }],
        turn: 1,
        currentTurn: 'player',
        selectedEnemyIndex: 0,
        battleLog: [{ id: '1', text: `BOSS战！${boss.introText || ''}`, type: 'system', timestamp: Date.now() }],
        isAnimating: false,
      })
      setGamePhase('battle')
      addLog(`BOSS 战开始！遭遇 ${boss.name}！`, 'system')
      return
    }
    
    // 获取随机事件类型
    const eventType = getRandomExploreEvent(currentFloor, floorExploreCount)
    
    switch (eventType) {
      case 'treasure': {
        const event = getTreasureEvent(currentFloor)
        setCurrentEvent(event)
        setGamePhase('event')
        addLog(event.description, 'system')
        break
      }
      case 'shrine': {
        const event = getShrineEvent()
        setCurrentEvent(event)
        setGamePhase('event')
        addLog(event.description, 'system')
        break
      }
      case 'merchant': {
        const event = getMerchantEvent(currentFloor)
        setCurrentEvent(event)
        setGamePhase('event')
        addLog(event.description, 'system')
        break
      }
      case 'mystery': {
        const event = getMysteryEvent(currentFloor)
        setCurrentEvent(event)
        setGamePhase('event')
        addLog(event.description, 'system')
        break
      }
      case 'rest': {
        const event = getRestEvent()
        setCurrentEvent(event)
        setGamePhase('event')
        addLog(event.description, 'system')
        break
      }
      case 'trap': {
        const event = getTrapEvent(currentFloor)
        setCurrentEvent(event)
        setGamePhase('event')
        // 立即应用陷阱伤害
        if (event.penalties) {
          if (event.penalties.hp) {
            setPlayer({ ...player, hp: Math.max(1, player.hp - event.penalties.hp) })
            addLog(`受到 ${event.penalties.hp} 点陷阱伤害！`, 'damage')
          }
          if (event.penalties.gold) {
            setInventory(prev => ({ ...prev, gold: Math.max(0, prev.gold - event.penalties!.gold!) }))
            addLog(`丢失了 ${event.penalties.gold} 金币！`, 'damage')
          }
        }
        break
      }
      case 'elite': {
        const event = getEliteEvent(currentFloor)
        setCurrentEvent(event)
        setGamePhase('event')
        addLog(event.description, 'system')
        break
      }
      case 'hidden_boss': {
        const event = getHiddenBossEvent(currentFloor)
        setCurrentEvent(event)
        setGamePhase('event')
        addLog(event.description, 'system')
        break
      }
      case 'combat':
      default: {
        // 普通战斗
        const enemyCount = Math.floor(Math.random() * 3) + 1
        const enemies: Enemy[] = []
        
        for (let i = 0; i < enemyCount; i++) {
          enemies.push(getRandomEnemy(player.level, currentFloor))
        }

        setBattleState({
          player: updatedPlayer,
          enemies,
          turn: 1,
          currentTurn: 'player',
          selectedEnemyIndex: 0,
          battleLog: [],
          isAnimating: false,
        })
        setGamePhase('battle')
        addLog(`遭遇了 ${enemies.map(e => e.name).join('、')}!`, 'system')
        break
      }
    }
  }, [player, currentFloor, floorExploreCount, addLog, calculateStats])

  // 玩家行动
  const playerAction = useCallback((action: 'attack' | 'skill' | 'item' | 'flee', skillOrItemId?: string) => {
    if (!battleState || !player) return

    let newBattleState = { ...battleState }
    let newPlayer = { ...battleState.player }
    let newEnemies = [...battleState.enemies]
    let newBattleLog = [...battleState.battleLog]  // 本地管理 battleLog

    // 辅助函数：添加战斗日志到本地
    const addBattleLog = (text: string, type: BattleLogEntry['type'] = 'normal') => {
      const entry: BattleLogEntry = {
        id: Math.random().toString(36).substr(2, 9),
        text,
        type,
        timestamp: Date.now(),
      }
      newBattleLog.push(entry)
      // 同时更新探索日志
      setGameLog(prev => [...prev.slice(-19), entry])
    }

    // 处理状态效果（如冰冻、眩晕）
    const canAct = !newPlayer.statusEffects.some(e => e.type === 'freeze' || e.type === 'stun')
    if (!canAct) {
      addBattleLog('你无法行动！', 'system')
      endPlayerTurn({ ...newBattleState, battleLog: newBattleLog }, newPlayer, newEnemies)
      return
    }

    // 作弊模式：一击必杀
    if (cheatMode.enabled && cheatMode.oneHitKill && action === 'attack') {
      newEnemies.forEach(e => e.hp = 0)
      addBattleLog('作弊：一击必杀！', 'system')
    }

    if (action === 'attack') {
      const target = newEnemies[battleState.selectedEnemyIndex]
      const result = performAttack(newPlayer, target, false)
      
      if (result.isMiss) {
        addBattleLog(`${target.name} 闪避了 ${newPlayer.name} 的攻击！`, 'miss')
      } else {
        target.hp -= result.damage
        
        let attackText = `${newPlayer.name} 对 ${target.name} 造成 ${result.damage} 点伤害`
        if (result.isCrit) attackText += '（暴击！）'
        addBattleLog(attackText, result.isCrit ? 'crit' : 'damage')
        
        // 检查敌人是否被击败
        if (target.hp <= 0) {
          addBattleLog(`${target.name} 被击败了！`, 'system')
        }
      }
      setBattleAnimation('attack')
    } else if (action === 'skill' && skillOrItemId) {
      const skill = newPlayer.skills.find(s => s.id === skillOrItemId)
      if (skill && (cheatMode.infiniteMP || newPlayer.mp >= skill.mpCost)) {
        if (!cheatMode.infiniteMP) {
          newPlayer.mp -= skill.mpCost
        }
        
        // 执行技能（传递本地日志函数）
        executeSkill(skill, newPlayer, newEnemies, battleState.selectedEnemyIndex, addBattleLog)
        setBattleAnimation(skill.animation)
      }
    } else if (action === 'flee') {
      if (Math.random() > 0.5) {
        addBattleLog('成功逃跑了！', 'system')
        setGamePhase('explore')
        return
      } else {
        addBattleLog('逃跑失败！', 'system')
      }
    }

    // 检查战斗结束
    const aliveEnemies = newEnemies.filter(e => e.hp > 0)
    
    if (aliveEnemies.length === 0) {
      // 胜利
      const totalExp = battleState.enemies.reduce((sum, e) => sum + e.expReward, 0)
      const totalGold = battleState.enemies.reduce((sum, e) => sum + e.goldReward, 0)
      
      setInventory(prev => ({ ...prev, gold: prev.gold + totalGold }))
      
      const leveledUp = gainExp(totalExp)
      
      // Boss死亡台词
      const boss = battleState.enemies.find(e => e.isBoss)
      if (boss?.deathText) {
        addBattleLog(`${boss.name}: "${boss.deathText}"`, 'system')
      }
      
      addBattleLog(`战斗胜利！获得 ${totalExp} 经验值和 ${totalGold} 金币！${leveledUp ? '升级了！' : ''}`, 'system')
      addBattleLog('战斗结束，3秒后返回探索...', 'system')
      
      // 设置战斗结束状态（倒计时）
      newBattleState.player = newPlayer
      newBattleState.enemies = aliveEnemies
      newBattleState.battleLog = newBattleLog
      newBattleState.currentTurn = 'player'
      newBattleState.endingCountdown = 3
      newBattleState.endingMessage = '战斗胜利！'
      setBattleState(newBattleState)
      
      // 3秒后返回探索
      setTimeout(() => {
        setGamePhase('explore')
        setBattleState(null)
      }, 3000)
      return
    }

    newBattleState.player = newPlayer
    newBattleState.enemies = aliveEnemies
    newBattleState.battleLog = newBattleLog
    endPlayerTurn(newBattleState, newPlayer, aliveEnemies)
  }, [battleState, player, cheatMode, addLog])

  // 执行攻击（带元素抗性支持）
  const performAttack = (
    attacker: Character | Enemy, 
    defender: Character | Enemy, 
    isMagic: boolean,
    damageType?: 'physical' | 'magical' | 'true',
    elementType?: 'fire' | 'ice' | 'poison'
  ) => {
    const attackerStats = 'currentStats' in attacker ? attacker.currentStats : attacker.stats
    const defenderStats = 'currentStats' in defender ? defender.currentStats : defender.stats
    
    // 真实伤害无视防御和闪避
    if (damageType === 'true') {
      const attackStat = attackerStats.attack
      let damage = Math.max(1, attackStat)
      
      // 暴击判定
      let isCrit = Math.random() * 100 < attackerStats.critRate
      if (isCrit) {
        damage = Math.floor(damage * (attackerStats.critDamage / 100))
      }
      
      damage = Math.floor(damage * (0.9 + Math.random() * 0.2))
      return { damage, isCrit, isMiss: false }
    }
    
    // 计算命中率（基础命中率 - 目标闪避）
    const hitChance = Math.max(5, Math.min(95, attackerStats.hitRate - defenderStats.evasion))
    if (Math.random() * 100 > hitChance) {
      return { damage: 0, isCrit: false, isMiss: true }
    }
    
    // 计算伤害
    const attackStat = isMagic ? attackerStats.magicAttack : attackerStats.attack
    const defenseStat = isMagic ? defenderStats.magicDefense : defenderStats.defense
    let damage = Math.max(1, attackStat - defenseStat)
    
    // 元素抗性减免
    if (elementType) {
      let resist = 0
      switch (elementType) {
        case 'fire': resist = defenderStats.fireResist; break
        case 'ice': resist = defenderStats.iceResist; break
        case 'poison': resist = defenderStats.poisonResist; break
      }
      damage = Math.floor(damage * (1 - resist / 100))
    }
    
    // 暴击判定
    let isCrit = Math.random() * 100 < attackerStats.critRate
    if (isCrit) {
      damage = Math.floor(damage * (attackerStats.critDamage / 100))
    }
    
    // 随机浮动 (90%-110%)
    damage = Math.floor(damage * (0.9 + Math.random() * 0.2))
    
    return { damage, isCrit, isMiss: false }
  }

  // 执行技能（支持冷却、元素伤害、减益效果）
  const executeSkill = (skill: Skill, player: Character, enemies: Enemy[], targetIndex: number, log: typeof addLog) => {
    // 设置冷却
    skill.currentCooldown = skill.cooldown
    
    // 确定元素类型（从状态效果类型推断）
    let elementType: 'fire' | 'ice' | 'poison' | undefined
    if (skill.statusEffect?.type === 'burn') elementType = 'fire'
    if (skill.statusEffect?.type === 'freeze') elementType = 'ice'
    if (skill.statusEffect?.type === 'poison') elementType = 'poison'
    
    // 安全获取伤害倍率（默认为1）
    const damageMultiplier = skill.damage || 1
    
    switch (skill.target) {
      case 'single':
        const target = enemies[targetIndex]
        if (!target) return // 目标不存在
        
        if (skill.damage) {
          const result = performAttack(
            player, 
            target, 
            skill.damageType === 'magical',
            skill.damageType,
            elementType
          )
          
          if (result.isMiss) {
            log(`${player.name} 使用 ${skill.name}，但 ${target.name} 闪避了攻击！`, 'miss')
          } else {
            const totalDamage = Math.floor(result.damage * damageMultiplier)
            target.hp -= totalDamage
            
            let damageText = `${player.name} 使用 ${skill.name} 对 ${target.name} 造成 ${totalDamage} 点伤害`
            if (result.isCrit) damageText += '（暴击！）'
            log(damageText, result.isCrit ? 'crit' : 'damage')
            
            // 检查敌人是否被击败
            if (target.hp <= 0) {
              log(`${target.name} 被击败了！`, 'system')
            }
          }
        }
        
        // 给敌人附加状态效果（伤害技能和减益技能）
        if (skill.statusEffect && skill.type !== 'buff' && skill.type !== 'heal' && target.hp > 0) {
          // 检查是否已有相同效果，有则刷新
          const existingIndex = target.statusEffects.findIndex(e => e.type === skill.statusEffect!.type)
          if (existingIndex >= 0) {
            target.statusEffects[existingIndex] = { ...skill.statusEffect }
          } else {
            target.statusEffects.push({ ...skill.statusEffect })
          }
          log(`${target.name} 受到了 ${skill.statusEffect.type} 效果！`, 'debuff')
        }
        break
        
      case 'all':
        let totalDamageDealt = 0
        let hitCount = 0
        let missCount = 0
        let defeatedEnemies: string[] = []
        
        enemies.forEach(e => {
          if (skill.damage) {
            const result = performAttack(
              player, 
              e, 
              skill.damageType === 'magical',
              skill.damageType,
              elementType
            )
            if (result.isMiss) {
              missCount++
              log(`${e.name} 闪避了 ${skill.name}！`, 'miss')
            } else {
              const dmg = Math.floor(result.damage * damageMultiplier)
              e.hp -= dmg
              totalDamageDealt += dmg
              hitCount++
              
              let hitText = `${skill.name} 对 ${e.name} 造成 ${dmg} 点伤害`
              if (result.isCrit) hitText += '（暴击！）'
              log(hitText, result.isCrit ? 'crit' : 'damage')
              
              // 检查敌人是否被击败
              if (e.hp <= 0) {
                defeatedEnemies.push(e.name)
                log(`${e.name} 被击败了！`, 'system')
              }
            }
          }
          // 群攻技能也附加状态
          if (skill.statusEffect && skill.type !== 'buff' && skill.type !== 'heal' && e.hp > 0) {
            const existingIndex = e.statusEffects.findIndex(ef => ef.type === skill.statusEffect!.type)
            if (existingIndex >= 0) {
              e.statusEffects[existingIndex] = { ...skill.statusEffect }
            } else {
              e.statusEffects.push({ ...skill.statusEffect })
            }
            log(`${e.name} 受到了 ${skill.statusEffect.type} 效果！`, 'debuff')
          }
        })
        
        // 汇总信息
        let summaryText = `${player.name} 使用 ${skill.name} `
        if (hitCount > 0) summaryText += `命中 ${hitCount} 个目标`
        if (missCount > 0) summaryText += `${hitCount > 0 ? '，' : ''}${missCount} 个闪避`
        summaryText += `，共造成 ${totalDamageDealt} 点伤害`
        log(summaryText, 'damage')
        break
        
      case 'random':
        // 随机攻击（技能damage字段表示攻击次数）
        const attackCount = Math.floor(skill.damage || 1)
        let randomTotalDamage = 0
        
        for (let i = 0; i < attackCount; i++) {
          // 过滤出存活的敌人
          const aliveEnemies = enemies.filter(e => e.hp > 0)
          if (aliveEnemies.length === 0) break
          
          const randomTarget = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)]
          const result = performAttack(player, randomTarget, skill.damageType === 'magical')
          
          if (result.isMiss) {
            log(`第 ${i + 1} 击：${randomTarget.name} 闪避了！`, 'miss')
          } else {
            randomTarget.hp -= result.damage
            randomTotalDamage += result.damage
            
            let hitMsg = `第 ${i + 1} 击对 ${randomTarget.name} 造成 ${result.damage} 点伤害`
            if (result.isCrit) hitMsg += '（暴击！）'
            log(hitMsg, result.isCrit ? 'crit' : 'damage')
            
            // 检查敌人是否被击败
            if (randomTarget.hp <= 0) {
              log(`${randomTarget.name} 被击败了！`, 'system')
            }
          }
        }
        log(`${player.name} 使用 ${skill.name} 进行 ${attackCount} 次随机攻击，总计造成 ${randomTotalDamage} 点伤害！`, 'damage')
        break
        
      case 'self':
        // 治疗
        if (skill.heal || skill.healPercent) {
          const healAmount = skill.heal || Math.floor(player.maxHp * ((skill.healPercent || 0) / 100))
          player.hp = Math.min(player.hp + healAmount, player.maxHp)
          log(`${player.name} 使用 ${skill.name} 恢复了 ${healAmount} 点生命值！`, 'heal')
        }
        
        // 状态效果（增益）
        if (skill.statusEffect) {
          const existingIndex = player.statusEffects.findIndex(e => e.type === skill.statusEffect!.type)
          if (existingIndex >= 0) {
            player.statusEffects[existingIndex] = { ...skill.statusEffect }
          } else {
            player.statusEffects.push({ ...skill.statusEffect })
          }
          const type = skill.type === 'buff' ? 'buff' : 'debuff'
          log(`${player.name} 获得了 ${skill.statusEffect.type} 效果（${skill.statusEffect.duration}回合）！`, type)
        }
        
        // 属性变化效果（通过calculateStats处理，这里只显示提示）
        if (skill.statChanges) {
          Object.entries(skill.statChanges).forEach(([key, value]) => {
            if (value) {
              const changeText = value > 0 ? '提升' : '降低'
              const label = getStatLabel(key)
              log(`${player.name} 的 ${label} ${changeText}了 ${Math.abs(value)}%！`, value > 0 ? 'buff' : 'debuff')
            }
          })
        }
        break
    }
  }
  
  // 辅助函数：获取属性中文名
  const getStatLabel = (key: string): string => {
    const labels: Record<string, string> = {
      attack: '攻击力',
      defense: '防御力',
      speed: '速度',
      critRate: '暴击率',
      hitRate: '命中率',
      evasion: '闪避率',
    }
    return labels[key] || key
  }

  // 结束玩家回合
  const endPlayerTurn = (state: BattleState, player: Character, enemies: Enemy[]) => {
    let battleLog = [...state.battleLog]  // 本地管理 battleLog

    // 辅助函数：添加战斗日志到本地
    const addBattleLog = (text: string, type: BattleLogEntry['type'] = 'normal') => {
      const entry: BattleLogEntry = {
        id: Math.random().toString(36).substr(2, 9),
        text,
        type,
        timestamp: Date.now(),
      }
      battleLog.push(entry)
      // 同时更新探索日志
      setGameLog(prev => [...prev.slice(-19), entry])
    }

    // 处理状态效果（如中毒、灼烧）
    processStatusEffects(player, enemies, addBattleLog)
    
    state.currentTurn = 'enemy'
    state.player = player
    state.enemies = enemies
    state.battleLog = battleLog  // 更新 battleLog
    setBattleState(state)
    setPlayer(player)

    setTimeout(() => {
      enemyTurn({ ...state, player, enemies, battleLog })
    }, 1000)
  }

  // 处理状态效果（包括伤害、治疗、护盾等）
  const processStatusEffects = (player: Character, enemies: Enemy[], log?: typeof addLog) => {
    // 先处理护盾吸收（护盾不在这里减duration，在各自效果里处理）
    let activeShield = player.statusEffects.find(e => e.type === 'shield')
    
    // 玩家状态
    player.statusEffects = player.statusEffects.filter(effect => {
      // 护盾单独处理duration
      if (effect.type === 'shield') {
        effect.duration--
        return effect.duration > 0
      }
      
      switch (effect.type) {
        case 'poison':
        case 'burn':
        case 'bleed':
          // 护盾吸收伤害
          if (activeShield && activeShield.value > 0) {
            activeShield.value -= effect.value
            if (log) {
              log(`护盾吸收了 ${effect.value} 点伤害！剩余 ${Math.max(0, activeShield.value)}`, 'buff')
            }
            if (activeShield.value <= 0) {
              if (log) log('护盾破碎了！', 'system')
              activeShield = undefined // 护盾已破
            }
          } else {
            player.hp -= effect.value
            if (log) log(`${player.name} 受到 ${effect.value} 点 ${effect.type} 伤害！`, 'damage')
          }
          break
        case 'regen':
          const heal = Math.floor(player.maxHp * (effect.value / 100))
          player.hp = Math.min(player.hp + heal, player.maxHp)
          if (log) log(`${player.name} 恢复了 ${heal} 点生命值！`, 'heal')
          break
        case 'freeze':
        case 'stun':
          if (log) log(`${player.name} 处于 ${effect.type} 状态，无法行动！`, 'debuff')
          break
        case 'buff_atk':
        case 'buff_def':
        case 'buff_spd':
          // 增益效果由calculateStats处理，这里只记录
          break
        case 'debuff_atk':
        case 'debuff_def':
          // 减益效果由calculateStats处理，这里只记录
          break
      }
      effect.duration--
      return effect.duration > 0
    })

    // 敌人状态（同样处理伤害类效果）
    enemies.forEach(enemy => {
      let enemyShield = enemy.statusEffects.find(e => e.type === 'shield')
      
      enemy.statusEffects = enemy.statusEffects.filter(effect => {
        if (effect.type === 'shield') {
          effect.duration--
          if (enemyShield && enemyShield.value <= 0) {
            if (log) log(`${enemy.name} 的护盾破碎了！`, 'system')
          }
          return effect.duration > 0
        }
        
        if (effect.type === 'poison' || effect.type === 'burn' || effect.type === 'bleed') {
          if (enemyShield && enemyShield.value > 0) {
            enemyShield.value -= effect.value
            if (log) log(`${enemy.name} 的护盾吸收了 ${effect.value} 点伤害！`, 'buff')
            if (enemyShield.value <= 0) {
              if (log) log(`${enemy.name} 的护盾破碎了！`, 'system')
              enemyShield = undefined
            }
          } else {
            enemy.hp -= effect.value
            if (log) log(`${enemy.name} 受到 ${effect.value} 点 ${effect.type} 伤害！`, 'damage')
            // 检查敌人是否被击败
            if (enemy.hp <= 0) {
              if (log) log(`${enemy.name} 被击败了！`, 'system')
            }
          }
        }
        effect.duration--
        return effect.duration > 0
      })
    })
    
    // 处理技能冷却（玩家）
    player.skills.forEach(skill => {
      if (skill.currentCooldown > 0) {
        skill.currentCooldown--
      }
    })
    
    // 处理技能冷却（敌人）
    enemies.forEach(enemy => {
      enemy.skills.forEach(skill => {
        if (skill.currentCooldown > 0) {
          skill.currentCooldown--
        }
      })
    })
  }

  // 敌人回合
  const enemyTurn = (currentState: BattleState) => {
    let newState = { ...currentState }
    let newPlayer = { ...currentState.player }
    let newBattleLog = [...currentState.battleLog]  // 本地管理 battleLog

    // 辅助函数：添加战斗日志到本地
    const addBattleLog = (text: string, type: BattleLogEntry['type'] = 'normal') => {
      const entry: BattleLogEntry = {
        id: Math.random().toString(36).substr(2, 9),
        text,
        type,
        timestamp: Date.now(),
      }
      newBattleLog.push(entry)
      // 同时更新探索日志
      setGameLog(prev => [...prev.slice(-19), entry])
    }

    currentState.enemies.forEach(enemy => {
      if (enemy.hp <= 0) return
      
      // 检查是否可以行动
      const canAct = !enemy.statusEffects.some(e => e.type === 'freeze' || e.type === 'stun')
      if (!canAct) {
        addBattleLog(`${enemy.name} 无法行动！`, 'system')
        return
      }
      
      // 作弊模式：无敌
      if (cheatMode.enabled && cheatMode.godMode) {
        addBattleLog('作弊：无敌模式，敌人攻击无效！', 'system')
        return
      }
      
      // AI 根据类型选择行动
      let actionTaken = false
      
      // 支援型AI：优先治疗
      if (enemy.aiType === 'support' && enemy.skills.some(s => s.type === 'heal' || s.heal)) {
        const healSkill = enemy.skills.find(s => s.type === 'heal' && enemy.mp >= s.mpCost)
        if (healSkill && enemy.hp < enemy.maxHp * 0.5) {
          const healAmount = healSkill.heal || Math.floor(enemy.maxHp * (healSkill.healPercent! / 100))
          enemy.hp = Math.min(enemy.hp + healAmount, enemy.maxHp)
          enemy.mp -= healSkill.mpCost
          addBattleLog(`${enemy.name} 使用 ${healSkill.name} 恢复了生命值！`, 'heal')
          actionTaken = true
        }
      }
      
      // 防御型AI：低血量时使用防御技能
      if (!actionTaken && enemy.aiType === 'defensive' && enemy.hp < enemy.maxHp * 0.3) {
        const buffSkill = enemy.skills.find(s => s.type === 'buff' && enemy.mp >= s.mpCost)
        if (buffSkill) {
          enemy.statusEffects.push({ ...buffSkill.statusEffect! })
          enemy.mp -= buffSkill.mpCost
          addBattleLog(`${enemy.name} 使用 ${buffSkill.name}！`, 'buff')
          actionTaken = true
        }
      }
      
      // Boss AI：更频繁使用技能
      const skillChance = enemy.aiType === 'boss' ? 0.8 : 0.6
      
      if (!actionTaken && enemy.skills.length > 0 && Math.random() < skillChance) {
        // 选择可用的最强技能
        const availableSkills = enemy.skills.filter(s => enemy.mp >= s.mpCost && s.currentCooldown === 0)
        if (availableSkills.length > 0) {
          // 按伤害排序，优先使用高伤害技能
          const bestSkill = availableSkills.sort((a, b) => (b.damage || 0) - (a.damage || 0))[0]
          enemy.mp -= bestSkill.mpCost
          bestSkill.currentCooldown = bestSkill.cooldown
          
          if (bestSkill.damage) {
            const result = performAttack(
              enemy, 
              newPlayer, 
              bestSkill.damageType === 'magical',
              bestSkill.damageType
            )
            if (result.isMiss) {
              addBattleLog(`${newPlayer.name} 闪避了 ${enemy.name} 的 ${bestSkill.name}！`, 'miss')
            } else {
              const damage = Math.floor(result.damage * (bestSkill.damage || 1))
              newPlayer.hp -= damage
              let skillText = `${enemy.name} 使用 ${bestSkill.name} 造成 ${damage} 点伤害`
              if (result.isCrit) skillText += '（暴击！）'
              addBattleLog(skillText, result.isCrit ? 'crit' : 'damage')
            }
          }
          actionTaken = true
        }
      }
      
      // 普通攻击
      if (!actionTaken) {
        const result = performAttack(enemy, newPlayer, false)
        if (result.isMiss) {
          addBattleLog(`${newPlayer.name} 闪避了 ${enemy.name} 的攻击！`, 'miss')
        } else {
          newPlayer.hp -= result.damage
          let attackText = `${enemy.name} 造成 ${result.damage} 点伤害`
          if (result.isCrit) attackText += '（暴击！）'
          addBattleLog(attackText, result.isCrit ? 'crit' : 'damage')
        }
      }
    })

    // 检查玩家死亡
    if (newPlayer.hp <= 0 && !(cheatMode.enabled && cheatMode.godMode)) {
      newPlayer.hp = 0
      addBattleLog('你倒下了...', 'system')
      addBattleLog('战斗结束，3秒后返回...', 'system')
      
      newState.player = newPlayer
      newState.currentTurn = 'player'
      newState.battleLog = newBattleLog
      newState.endingCountdown = 3
      newState.endingMessage = '战斗失败...'
      setBattleState(newState)
      setPlayer(newPlayer)
      
      // 3秒后跳转到游戏结束
      setTimeout(() => {
        setGamePhase('gameOver')
        setBattleState(null)
      }, 3000)
      return
    }

    newState.player = newPlayer
    newState.currentTurn = 'player'
    newState.turn += 1
    newState.battleLog = newBattleLog
    setBattleState(newState)
    setPlayer(newPlayer)
  }

  // 获得经验值
  const gainExp = useCallback((amount: number): boolean => {
    if (!player) return false
    
    let newPlayer = { ...player }
    // 作弊模式：经验翻倍
    const expGain = cheatMode.enabled && cheatMode.maxDropRate ? amount * 10 : amount
    newPlayer.exp += expGain
    
    let leveledUp = false
    while (newPlayer.exp >= newPlayer.maxExp) {
      newPlayer.exp -= newPlayer.maxExp
      newPlayer.level += 1
      newPlayer.maxExp = Math.floor(newPlayer.maxExp * 1.3)
      
      // 升级奖励
      newPlayer.baseStats.strength += 2
      newPlayer.baseStats.intelligence += 2
      newPlayer.baseStats.agility += 2
      newPlayer.baseStats.vitality += 2
      newPlayer.baseStats.dexterity += 1
      newPlayer.baseStats.luck += 1
      
      // 重新计算属性
      const newMaxHp = 80 + newPlayer.baseStats.vitality * 10
      const newMaxMp = 40 + newPlayer.baseStats.intelligence * 5
      newPlayer.maxHp = newMaxHp
      newPlayer.hp = newMaxHp
      newPlayer.maxMp = newMaxMp
      newPlayer.mp = newMaxMp
      
      // 更新当前属性
      newPlayer.currentStats = calculateStats(newPlayer)
      
      leveledUp = true
      addLog(`升级！${newPlayer.name} 达到了 ${newPlayer.level} 级！`, 'system')
    }
    
    setPlayer(newPlayer)
    return leveledUp
  }, [player, cheatMode.enabled, cheatMode.maxDropRate, addLog, calculateStats])

  // 选择敌人
  const selectEnemy = useCallback((index: number) => {
    if (battleState) {
      setBattleState({ ...battleState, selectedEnemyIndex: index })
    }
  }, [battleState])

  // 下一层
  const nextFloor = useCallback(() => {
    // 检查是否至少探索过一次
    if (floorExploreCount === 0) {
      addLog('请先探索本层至少一次！', 'system')
      return
    }
    
    const newFloor = currentFloor + 1
    setCurrentFloor(newFloor)
    setFloorExploreCount(0)  // 重置探索计数
    addLog(`进入第 ${newFloor} 层！`, 'system')
    
    if (player) {
      setPlayer({
        ...player,
        hp: Math.min(player.hp + 20, player.maxHp),
        mp: Math.min(player.mp + 10, player.maxMp),
      })
    }
  }, [currentFloor, floorExploreCount, player, addLog])

  // 使用物品
  const useItem = useCallback((itemIndex: number) => {
    if (!player || !inventory.items[itemIndex]) return
    
    const itemEntry = inventory.items[itemIndex]
    const item = itemEntry.item
    
    if (item.effect.hpRestore) {
      setPlayer({
        ...player,
        hp: Math.min(player.hp + item.effect.hpRestore, player.maxHp),
      })
      addLog(`使用了 ${item.name}，恢复了 ${item.effect.hpRestore} HP`, 'heal')
    }
    if (item.effect.mpRestore) {
      setPlayer({
        ...player,
        mp: Math.min(player.mp + item.effect.mpRestore, player.maxMp),
      })
      addLog(`使用了 ${item.name}，恢复了 ${item.effect.mpRestore} MP`, 'heal')
    }
    
    const newItems = [...inventory.items]
    newItems[itemIndex].quantity--
    if (newItems[itemIndex].quantity <= 0) {
      newItems.splice(itemIndex, 1)
    }
    setInventory({ ...inventory, items: newItems })
  }, [player, inventory, addLog])

  // 购买物品
  const buyItem = useCallback((item: Item) => {
    if (!player || inventory.gold < item.value) return
    
    // 检查背包空间
    const existingItem = inventory.items.find(i => i.item.id === item.id)
    if (!existingItem && inventory.items.length >= inventory.maxSlots) {
      addLog('背包已满！', 'system')
      return
    }
    
    // 扣除金币
    setInventory(prev => ({
      ...prev,
      gold: prev.gold - item.value,
      items: existingItem
        ? prev.items.map(i => i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev.items, { item: { ...item }, quantity: 1 }]
    }))
    
    addLog(`购买了 ${item.name}，花费 ${item.value} 金币`, 'system')
  }, [player, inventory, addLog])

  // 休息恢复
  const restAtCamp = useCallback((type: 'hp' | 'mp' | 'full', cost: number) => {
    if (!player || inventory.gold < cost) return
    
    let healedHp = 0
    let healedMp = 0
    
    if (type === 'hp' || type === 'full') {
      healedHp = player.maxHp - player.hp
      setPlayer({ ...player, hp: player.maxHp })
    }
    if (type === 'mp' || type === 'full') {
      healedMp = player.maxMp - player.mp
      setPlayer({ ...player, mp: player.maxMp })
    }
    
    setInventory(prev => ({ ...prev, gold: prev.gold - cost }))
    
    if (type === 'full') {
      addLog(`完全恢复！花费 ${cost} 金币`, 'heal')
    } else if (type === 'hp') {
      addLog(`恢复 ${healedHp} 生命值，花费 ${cost} 金币`, 'heal')
    } else {
      addLog(`恢复 ${healedMp} 魔法值，花费 ${cost} 金币`, 'heal')
    }
  }, [player, inventory, addLog])

  // 强化装备
  const upgradeEquipment = useCallback((item: Item, cost: number) => {
    if (!player || inventory.gold < cost) return
    
    const currentLevel = item.upgradeLevel || 0
    if (currentLevel >= 5) {
      addLog('该装备已达到最高强化等级！', 'system')
      return
    }
    
    const upgradeLevel = currentLevel + 1
    
    // 更新装备属性
    const upgradedItem: Item = {
      ...item,
      upgradeLevel,
      value: Math.floor(item.value * 1.2), // 强化后价值提升
      effect: {
        ...item.effect,
        statBoost: item.effect.statBoost 
          ? Object.fromEntries(
              Object.entries(item.effect.statBoost).map(([key, value]) => [
                key,
                typeof value === 'number' ? Math.floor(value * (1 + 0.1)) : value
              ])
            ) as any
          : undefined
      }
    }
    
    // 更新玩家装备
    const slot = player.equipment.weapon?.id === item.id ? 'weapon' 
      : player.equipment.armor?.id === item.id ? 'armor'
      : player.equipment.accessory?.id === item.id ? 'accessory'
      : null
    
    if (slot) {
      setPlayer({
        ...player,
        equipment: { ...player.equipment, [slot]: upgradedItem },
        currentStats: calculateStats({ ...player, equipment: { ...player.equipment, [slot]: upgradedItem } })
      })
    }
    
    setInventory(prev => ({ ...prev, gold: prev.gold - cost }))
    addLog(`${item.name} 强化成功！+${upgradeLevel}`, 'buff')
  }, [player, inventory, addLog, calculateStats])

  // 穿戴/卸下装备
  const equipItem = useCallback((item: Item, itemIndex: number) => {
    if (!player) return
    
    const slot = item.type === 'weapon' ? 'weapon' 
      : item.type === 'armor' ? 'armor'
      : item.type === 'accessory' ? 'accessory'
      : null
    
    if (!slot) return
    
    const currentEquip = player.equipment[slot]
    
    // 从背包移除要装备的物品
    const newItems = [...inventory.items]
    newItems[itemIndex].quantity--
    if (newItems[itemIndex].quantity <= 0) {
      newItems.splice(itemIndex, 1)
    }
    
    // 如果该位置已有装备，卸下到背包
    if (currentEquip) {
      // 卸下当前装备到背包
      newItems.push({ item: currentEquip, quantity: 1 })
    }
    
    setInventory({ ...inventory, items: newItems })
    
    // 穿上新装备
    setPlayer({
      ...player,
      equipment: { ...player.equipment, [slot]: item },
      currentStats: calculateStats({ ...player, equipment: { ...player.equipment, [slot]: item } })
    })
    
    addLog(`装备了 ${item.name}`, 'buff')
  }, [player, inventory, addLog, calculateStats])

  // 卸下装备
  const unequipItem = useCallback((slot: 'weapon' | 'armor' | 'accessory') => {
    if (!player || !player.equipment[slot]) return
    
    const item = player.equipment[slot]!
    
    // 检查背包空间
    if (inventory.items.length >= inventory.maxSlots) {
      addLog('背包已满，无法卸下装备！', 'system')
      return
    }
    
    // 卸下装备到背包
    setInventory({
      ...inventory,
      items: [...inventory.items, { item, quantity: 1 }]
    })
    
    setPlayer({
      ...player,
      equipment: { ...player.equipment, [slot]: null },
      currentStats: calculateStats({ ...player, equipment: { ...player.equipment, [slot]: null } })
    })
    
    addLog(`卸下了 ${item.name}`, 'system')
  }, [player, inventory, addLog, calculateStats])

  // 学习技能
  const learnSkill = useCallback((skillBook: Item, itemIndex: number) => {
    if (!player) return
    
    // 从技能书ID解析技能
    const skillId = skillBook.id.replace('book_', '')
    
    // 检查是否已学习
    if (player.skills.some(s => s.id === skillId)) {
      addLog(`已经学会了该技能！`, 'system')
      return
    }
    
    // 从可学习技能中查找
    const newSkill = LEARNABLE_SKILLS.find(s => s.id === skillId)
    
    if (newSkill) {
      // 消耗技能书
      const newItems = [...inventory.items]
      newItems[itemIndex].quantity--
      if (newItems[itemIndex].quantity <= 0) {
        newItems.splice(itemIndex, 1)
      }
      setInventory({ ...inventory, items: newItems })
      
      // 学习技能
      setPlayer({
        ...player,
        skills: [...player.skills, { ...newSkill }]
      })
      addLog(`学会了新技能：${newSkill.name}！`, 'buff')
    }
  }, [player, inventory, addLog])

  // 切换探索场景
  const setExploreView = useCallback((scene: 'main' | 'shop' | 'rest' | 'blacksmith') => {
    setExploreScene(scene)
  }, [])

  // 处理事件选项
  const handleEventOption = useCallback((action: string, value?: number) => {
    if (!player || !currentEvent) return
    
    switch (action) {
      case 'heal_hp': {
        const healAmount = Math.floor(player.maxHp * (value || 50) / 100)
        setPlayer({ ...player, hp: Math.min(player.hp + healAmount, player.maxHp) })
        addLog(`治愈祭坛恢复了 ${healAmount} 点生命值！`, 'heal')
        break
      }
      case 'exp': {
        const cost = value || 50
        if (inventory.gold >= cost) {
          setInventory(prev => ({ ...prev, gold: prev.gold - cost }))
          const expGain = 30 + currentFloor * 5
          addLog(`献祭获得 ${expGain} 经验值！`, 'buff')
          // 直接加经验
          const newPlayer = { ...player, exp: player.exp + expGain }
          if (newPlayer.exp >= newPlayer.maxExp) {
            // 升级处理简化版
            newPlayer.exp -= newPlayer.maxExp
            newPlayer.level += 1
            newPlayer.maxExp = Math.floor(newPlayer.maxExp * 1.3)
            addLog(`升级了！达到 ${newPlayer.level} 级！`, 'system')
          }
          setPlayer(newPlayer)
        }
        break
      }
      case 'trade_hp_gold': {
        const hpCost = value || 30
        const goldGain = 100
        setPlayer({ ...player, hp: Math.max(1, player.hp - hpCost) })
        setInventory(prev => ({ ...prev, gold: prev.gold + goldGain }))
        addLog(`献祭 ${hpCost} 生命值获得 ${goldGain} 金币！`, 'system')
        break
      }
      case 'buy': {
        const cost = value || 0
        if (inventory.gold >= cost && currentEvent.rewards?.item) {
          setInventory(prev => ({
            ...prev,
            gold: prev.gold - cost,
            items: [...prev.items, { item: currentEvent.rewards!.item!, quantity: 1 }]
          }))
          addLog(`购买了 ${currentEvent.rewards.item.name}！`, 'system')
        }
        break
      }
      case 'portal': {
        // 传送门：随机传送，可能传送到下一层或获得奖励
        const roll = Math.random()
        if (roll < 0.3) {
          // 30% 传送到下一层
          addLog('传送门将你送到了下一层！', 'buff')
          setCurrentFloor(prev => prev + 1)
          setFloorExploreCount(0)
        } else if (roll < 0.6) {
          // 30% 获得奖励
          const goldReward = 50 + currentFloor * 20
          setInventory(prev => ({ ...prev, gold: prev.gold + goldReward }))
          addLog(`传送门中掉出了 ${goldReward} 金币！`, 'buff')
        } else {
          // 40% 遭遇战斗
          addLog('传送门将你送到了危险的地方！', 'damage')
          const enemy = getRandomEnemy(player.level, currentFloor + 1)
          setBattleState({
            player,
            enemies: [{ ...enemy, hp: enemy.hp + 20, maxHp: enemy.maxHp + 20 }],
            turn: 1,
            currentTurn: 'player',
            selectedEnemyIndex: 0,
            battleLog: [],
            isAnimating: false,
          })
          setGamePhase('battle')
        }
        break
      }
      case 'statue_touch': {
        const roll = Math.random()
        if (roll < 0.4) {
          setPlayer({ ...player, hp: Math.min(player.hp + 30, player.maxHp) })
          addLog('雕像赐予了你治愈之力！', 'heal')
        } else if (roll < 0.7) {
          addLog('雕像没有反应...', 'system')
        } else {
          setPlayer({ ...player, hp: Math.max(1, player.hp - 20) })
          addLog('雕像诅咒了你！', 'damage')
        }
        break
      }
      case 'statue_gold': {
        const goldCost = value || 10
        if (inventory.gold >= goldCost) {
          setInventory(prev => ({ ...prev, gold: prev.gold - goldCost }))
          setPlayer({ ...player, mp: Math.min(player.mp + 40, player.maxMp) })
          addLog('雕像赐予了你魔力！', 'buff')
        }
        break
      }
      case 'scroll_read': {
        const roll = Math.random()
        if (roll < 0.5) {
          const expGain = 25
          setPlayer({ ...player, exp: player.exp + expGain })
          addLog(`卷轴记载着古老的知识，获得 ${expGain} 经验！`, 'buff')
        } else {
          addLog('卷轴上写着你已经知道的知识...', 'system')
        }
        break
      }
      case 'scroll_burn': {
        addLog('你烧毁了卷轴，获得了一丝温暖...', 'system')
        break
      }
      case 'scroll_keep': {
        addLog('你收起了卷轴，也许以后有用...', 'system')
        break
      }
      case 'wish': {
        const goldCost = value || 10
        if (inventory.gold >= goldCost) {
          setInventory(prev => ({ ...prev, gold: prev.gold - goldCost }))
          const roll = Math.random()
          if (roll < 0.4) {
            setInventory(prev => ({ ...prev, gold: prev.gold + 30 }))
            addLog('井中涌出了金币！', 'buff')
          } else if (roll < 0.7) {
            setPlayer({ ...player, hp: Math.min(player.hp + 25, player.maxHp) })
            addLog('井水治愈了你的伤口！', 'heal')
          } else {
            addLog('井水毫无反应...', 'system')
          }
        }
        break
      }
      case 'wish_big': {
        const goldCost = value || 50
        if (inventory.gold >= goldCost) {
          setInventory(prev => ({ ...prev, gold: prev.gold - goldCost }))
          const roll = Math.random()
          if (roll < 0.3) {
            setInventory(prev => ({ ...prev, gold: prev.gold + 150 }))
            addLog('井中涌出了大量金币！', 'buff')
          } else if (roll < 0.6) {
            setPlayer({ ...player, hp: player.maxHp, mp: player.maxMp })
            addLog('井水完全治愈了你！', 'heal')
          } else {
            setPlayer({ ...player, hp: Math.max(1, player.hp - 30) })
            addLog('井水变成了酸液！', 'damage')
          }
        }
        break
      }
      case 'rest': {
        const restorePercent = value || 20
        const hpRestore = Math.floor(player.maxHp * restorePercent / 100)
        const mpRestore = Math.floor(player.maxMp * restorePercent / 100)
        setPlayer({ 
          ...player, 
          hp: Math.min(player.hp + hpRestore, player.maxHp),
          mp: Math.min(player.mp + mpRestore, player.maxMp)
        })
        addLog(`休息恢复了 ${hpRestore} HP 和 ${mpRestore} MP！`, 'heal')
        break
      }
      case 'meditate': {
        const mpRestore = Math.floor(player.maxMp * (value || 40) / 100)
        setPlayer({ ...player, mp: Math.min(player.mp + mpRestore, player.maxMp) })
        addLog(`冥想恢复了 ${mpRestore} MP！`, 'buff')
        break
      }
      case 'heal': {
        const hpRestore = Math.floor(player.maxHp * (value || 40) / 100)
        setPlayer({ ...player, hp: Math.min(player.hp + hpRestore, player.maxHp) })
        addLog(`包扎伤口恢复了 ${hpRestore} HP！`, 'heal')
        break
      }
      case 'fight_elite': {
        // 触发精英战斗
        if (currentEvent) {
          const enemy = getRandomEnemy(player.level, currentFloor)
          const eliteEnemy = { 
            ...enemy, 
            name: currentEvent.title.replace('遭遇 ', '').replace('！', ''),
            hp: Math.floor(enemy.hp * 1.5),
            maxHp: Math.floor(enemy.maxHp * 1.5),
            stats: { ...enemy.stats, attack: Math.floor(enemy.stats.attack * 1.3) }
          }
          setBattleState({
            player,
            enemies: [eliteEnemy],
            turn: 1,
            currentTurn: 'player',
            selectedEnemyIndex: 0,
            battleLog: [],
            isAnimating: false,
          })
          setGamePhase('battle')
          addLog(`精英战开始！`, 'system')
        }
        break
      }
      case 'flee_elite': {
        // 尝试逃跑
        if (Math.random() < 0.6) {
          addLog('成功逃离了精英怪！', 'system')
        } else {
          addLog('逃跑失败！被迫战斗！', 'damage')
          if (currentEvent) {
            const enemy = getRandomEnemy(player.level, currentFloor)
            const eliteEnemy = { 
              ...enemy, 
              name: currentEvent.title.replace('遭遇 ', '').replace('！', ''),
              hp: Math.floor(enemy.hp * 1.5),
              maxHp: Math.floor(enemy.maxHp * 1.5),
            }
            setBattleState({
              player,
              enemies: [eliteEnemy],
              turn: 1,
              currentTurn: 'player',
              selectedEnemyIndex: 0,
              battleLog: [],
              isAnimating: false,
            })
            setGamePhase('battle')
          }
        }
        break
      }
      case 'fight_hidden_boss': {
        // 触发隐藏Boss战斗
        if (currentEvent) {
          const bossLevel = currentFloor + 2
          const enemy = getRandomEnemy(player.level, bossLevel)
          const hiddenBoss = { 
            ...enemy, 
            name: currentEvent.title.replace('隐藏Boss: ', '').replace('！', ''),
            hp: Math.floor(enemy.hp * 2),
            maxHp: Math.floor(enemy.maxHp * 2),
            stats: { 
              ...enemy.stats, 
              attack: Math.floor(enemy.stats.attack * 1.5),
              defense: Math.floor(enemy.stats.defense * 1.3)
            },
            expReward: Math.floor(enemy.expReward * 2.5),
            goldReward: Math.floor(enemy.goldReward * 3)
          }
          setBattleState({
            player,
            enemies: [hiddenBoss],
            turn: 1,
            currentTurn: 'player',
            selectedEnemyIndex: 0,
            battleLog: [],
            isAnimating: false,
          })
          setGamePhase('battle')
          addLog(`隐藏Boss战开始！`, 'system')
        }
        break
      }
      case 'flee_hidden_boss': {
        // 60% 逃跑成功
        if (Math.random() < 0.6) {
          addLog('成功逃离了隐藏Boss！', 'system')
        } else {
          addLog('逃跑失败！被迫战斗！', 'damage')
          if (currentEvent) {
            const bossLevel = currentFloor + 2
            const enemy = getRandomEnemy(player.level, bossLevel)
            const hiddenBoss = { 
              ...enemy, 
              name: currentEvent.title.replace('隐藏Boss: ', '').replace('！', ''),
              hp: Math.floor(enemy.hp * 2),
              maxHp: Math.floor(enemy.maxHp * 2),
            }
            setBattleState({
              player,
              enemies: [hiddenBoss],
              turn: 1,
              currentTurn: 'player',
              selectedEnemyIndex: 0,
              battleLog: [],
              isAnimating: false,
            })
            setGamePhase('battle')
          }
        }
        break
      }
      case 'leave':
      default: {
        // 离开事件
        addLog('你选择了离开...', 'system')
        break
      }
    }
    
    // 关闭事件
    setCurrentEvent(null)
    setGamePhase('explore')
  }, [player, currentEvent, inventory, currentFloor, addLog])

  // 收集宝藏奖励
  const collectTreasure = useCallback(() => {
    if (!currentEvent?.rewards) return
    
    if (currentEvent.rewards.gold) {
      setInventory(prev => ({ ...prev, gold: prev.gold + currentEvent.rewards!.gold! }))
      addLog(`获得了 ${currentEvent.rewards.gold} 金币！`, 'buff')
    }
    
    if (currentEvent.rewards.item) {
      setInventory(prev => ({
        ...prev,
        items: [...prev.items, { item: currentEvent.rewards!.item!, quantity: 1 }]
      }))
      addLog(`获得了 ${currentEvent.rewards.item.name}！`, 'buff')
    }
    
    if (currentEvent.rewards.exp) {
      if (player) {
        setPlayer({ ...player, exp: player.exp + currentEvent.rewards.exp })
        addLog(`获得了 ${currentEvent.rewards.exp} 经验值！`, 'buff')
      }
    }
    
    setCurrentEvent(null)
    setGamePhase('explore')
  }, [currentEvent, player, addLog])

  return {
    gamePhase,
    player,
    battleState,
    inventory,
    gameLog,
    currentFloor,
    floorExploreCount,
    exploreScene,
    cheatMode,
    battleAnimation,
    startGame,
    encounterEnemy,
    playerAction,
    selectEnemy,
    nextFloor,
    useItem,
    buyItem,
    restAtCamp,
    upgradeEquipment,
    equipItem,
    unequipItem,
    learnSkill,
    setExploreView,
    handleTitleClick,
    toggleCheatOption,
    currentEvent,
    handleEventOption,
    collectTreasure,
    cheatGetArtifact,
    cheatGetHiddenSkill,
    cheatGetStatBoost,
    cheatLevelUp,
    cheatAddGold,
  }
}

function getClassName(characterClass: CharacterClass): string {
  const names = { warrior: '战士', mage: '法师', rogue: '盗贼', paladin: '圣骑士', ranger: '游侠' }
  return names[characterClass]
}
