import { useState, useCallback, useMemo, useRef } from 'react'
import type { 
  Character, CharacterClass, GamePhase, BattleState, Enemy, Skill, 
  Item, Inventory, StatusEffect, BaseStats, CheatMode, BattleLogEntry 
} from '../types'
import { getRandomEnemy, getBoss, getBossForFloor } from '../data/enemies'
import { getCharacterSkills } from '../data/skills'

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
  const [battleAnimation, setBattleAnimation] = useState<string | null>(null)
  
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

  // 添加日志
  const addLog = useCallback((text: string, type: BattleLogEntry['type'] = 'normal') => {
    setGameLog(prev => [...prev.slice(-19), {
      id: Math.random().toString(36).substr(2, 9),
      text,
      type,
      timestamp: Date.now(),
    }])
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

  // 开始新游戏
  const startGame = useCallback((name: string, characterClass: CharacterClass) => {
    const newPlayer = createInitialCharacter(name, characterClass)
    setPlayer(newPlayer)
    setInventory({ items: [], gold: 100, maxSlots: 20 })
    setGamePhase('explore')
    setCurrentFloor(1)
    setGameLog([{ id: '1', text: `欢迎，${name}！你选择了${getClassName(characterClass)}职业。`, type: 'system', timestamp: Date.now() }])
  }, [])

  // 计算实际属性（包含装备加成）
  const calculateStats = useCallback((character: Character): BaseStats => {
    let stats = { ...character.baseStats }
    
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
    
    // 状态效果加成
    character.statusEffects.forEach(effect => {
      if (effect.type === 'buff_atk') stats.attack = Math.floor(stats.attack * (1 + effect.value / 100))
      if (effect.type === 'buff_def') stats.defense = Math.floor(stats.defense * (1 + effect.value / 100))
      if (effect.type === 'buff_spd') stats.speed = Math.floor(stats.speed * (1 + effect.value / 100))
    })
    
    return stats
  }, [])

  // 遭遇敌人
  const encounterEnemy = useCallback(() => {
    if (!player) return
    
    // 检查是否触发Boss战
    const boss = getBossForFloor(currentFloor)
    if (boss) {
      setBattleState({
        player: { ...player },
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
    
    // 普通敌人
    const enemyCount = Math.floor(Math.random() * 3) + 1
    const enemies: Enemy[] = []
    
    for (let i = 0; i < enemyCount; i++) {
      enemies.push(getRandomEnemy(player.level, currentFloor))
    }

    setBattleState({
      player: { ...player },
      enemies,
      turn: 1,
      currentTurn: 'player',
      selectedEnemyIndex: 0,
      battleLog: [],
      isAnimating: false,
    })
    setGamePhase('battle')
    addLog(`遭遇了 ${enemies.map(e => e.name).join('、')}!`, 'system')
  }, [player, currentFloor, addLog])

  // 玩家行动
  const playerAction = useCallback((action: 'attack' | 'skill' | 'item' | 'flee', skillOrItemId?: string) => {
    if (!battleState || !player) return

    let newBattleState = { ...battleState }
    let newPlayer = { ...battleState.player }
    let newEnemies = [...battleState.enemies]

    // 处理状态效果（如冰冻、眩晕）
    const canAct = !newPlayer.statusEffects.some(e => e.type === 'freeze' || e.type === 'stun')
    if (!canAct) {
      addLog('你无法行动！', 'system')
      endPlayerTurn(newBattleState, newPlayer, newEnemies)
      return
    }

    // 作弊模式：一击必杀
    if (cheatMode.enabled && cheatMode.oneHitKill && action === 'attack') {
      newEnemies.forEach(e => e.hp = 0)
      addLog('作弊：一击必杀！', 'system')
    }

    if (action === 'attack') {
      const target = newEnemies[battleState.selectedEnemyIndex]
      const result = performAttack(newPlayer, target, false)
      target.hp -= result.damage
      
      addLog(`${newPlayer.name} 对 ${target.name} 造成 ${result.damage} 点伤害${result.isCrit ? '（暴击！）' : ''}!`, result.isCrit ? 'crit' : 'damage')
      setBattleAnimation('attack')
      
      if (result.isCrit) {
        addLog('暴击！', 'crit')
      }
    } else if (action === 'skill' && skillOrItemId) {
      const skill = newPlayer.skills.find(s => s.id === skillOrItemId)
      if (skill && (cheatMode.infiniteMP || newPlayer.mp >= skill.mpCost)) {
        if (!cheatMode.infiniteMP) {
          newPlayer.mp -= skill.mpCost
        }
        
        // 执行技能
        executeSkill(skill, newPlayer, newEnemies, battleState.selectedEnemyIndex, addLog)
        setBattleAnimation(skill.animation)
      }
    } else if (action === 'flee') {
      if (Math.random() > 0.5) {
        setGamePhase('explore')
        addLog('成功逃跑了！', 'system')
        return
      } else {
        addLog('逃跑失败！', 'system')
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
        addLog(`${boss.name}: "${boss.deathText}"`, 'system')
      }
      
      addLog(`战斗胜利！获得 ${totalExp} 经验值和 ${totalGold} 金币！${leveledUp ? '升级了！' : ''}`, 'system')
      setGamePhase('explore')
      return
    }

    newBattleState.player = newPlayer
    newBattleState.enemies = aliveEnemies
    endPlayerTurn(newBattleState, newPlayer, aliveEnemies)
  }, [battleState, player, cheatMode, addLog])

  // 执行攻击
  const performAttack = (attacker: Character | Enemy, defender: Character | Enemy, isMagic: boolean) => {
    const attackerStats = 'currentStats' in attacker ? attacker.currentStats : attacker.stats
    const defenderStats = 'currentStats' in defender ? defender.currentStats : defender.stats
    
    // 计算命中率
    const hitChance = attackerStats.hitRate - defenderStats.evasion
    if (Math.random() * 100 > hitChance) {
      return { damage: 0, isCrit: false, isMiss: true }
    }
    
    // 计算伤害
    const attackStat = isMagic ? attackerStats.magicAttack : attackerStats.attack
    const defenseStat = isMagic ? defenderStats.magicDefense : defenderStats.defense
    let damage = Math.max(1, attackStat - defenseStat)
    
    // 暴击判定
    let isCrit = Math.random() * 100 < attackerStats.critRate
    if (isCrit) {
      damage = Math.floor(damage * (attackerStats.critDamage / 100))
    }
    
    // 随机浮动
    damage = Math.floor(damage * (0.9 + Math.random() * 0.2))
    
    return { damage, isCrit, isMiss: false }
  }

  // 执行技能
  const executeSkill = (skill: Skill, player: Character, enemies: Enemy[], targetIndex: number, log: typeof addLog) => {
    switch (skill.target) {
      case 'single':
        const target = enemies[targetIndex]
        if (skill.damage) {
          const result = performAttack(player, target, skill.damageType === 'magical')
          target.hp -= result.damage * skill.damage
          log(`${player.name} 使用 ${skill.name} 对 ${target.name} 造成 ${Math.floor(result.damage * skill.damage)} 点伤害！`, 'damage')
        }
        if (skill.heal || skill.healPercent) {
          const healAmount = skill.heal || Math.floor(player.maxHp * (skill.healPercent! / 100))
          player.hp = Math.min(player.hp + healAmount, player.maxHp)
          log(`${player.name} 使用 ${skill.name} 恢复了 ${healAmount} 点生命值！`, 'heal')
        }
        break
      case 'all':
        enemies.forEach(e => {
          if (skill.damage) {
            const result = performAttack(player, e, skill.damageType === 'magical')
            e.hp -= result.damage * skill.damage
          }
        })
        log(`${player.name} 使用 ${skill.name} 对所有敌人造成伤害！`, 'damage')
        break
      case 'self':
        if (skill.heal || skill.healPercent) {
          const healAmount = skill.heal || Math.floor(player.maxHp * (skill.healPercent! / 100))
          player.hp = Math.min(player.hp + healAmount, player.maxHp)
          log(`${player.name} 使用 ${skill.name} 恢复了 ${healAmount} 点生命值！`, 'heal')
        }
        if (skill.statusEffect) {
          player.statusEffects.push({ ...skill.statusEffect })
          log(`${player.name} 获得了 ${skill.statusEffect.type} 效果！`, 'buff')
        }
        break
    }
  }

  // 结束玩家回合
  const endPlayerTurn = (state: BattleState, player: Character, enemies: Enemy[]) => {
    // 处理状态效果（如中毒、灼烧）
    processStatusEffects(player, enemies)
    
    state.currentTurn = 'enemy'
    state.player = player
    state.enemies = enemies
    setBattleState(state)
    setPlayer(player)

    setTimeout(() => {
      enemyTurn({ ...state, player, enemies })
    }, 1000)
  }

  // 处理状态效果
  const processStatusEffects = (player: Character, enemies: Enemy[]) => {
    // 玩家状态
    player.statusEffects = player.statusEffects.filter(effect => {
      if (effect.type === 'poison' || effect.type === 'burn' || effect.type === 'bleed') {
        player.hp -= effect.value
        addLog(`${player.name} 受到 ${effect.value} 点 ${effect.type} 伤害！`, 'damage')
      } else if (effect.type === 'regen') {
        const heal = Math.floor(player.maxHp * (effect.value / 100))
        player.hp = Math.min(player.hp + heal, player.maxHp)
        addLog(`${player.name} 恢复了 ${heal} 点生命值！`, 'heal')
      }
      effect.duration--
      return effect.duration > 0
    })

    // 敌人状态
    enemies.forEach(enemy => {
      enemy.statusEffects = enemy.statusEffects.filter(effect => {
        effect.duration--
        return effect.duration > 0
      })
    })
  }

  // 敌人回合
  const enemyTurn = (currentState: BattleState) => {
    let newState = { ...currentState }
    let newPlayer = { ...currentState.player }

    currentState.enemies.forEach(enemy => {
      if (enemy.hp <= 0) return
      
      // 检查是否可以行动
      const canAct = !enemy.statusEffects.some(e => e.type === 'freeze' || e.type === 'stun')
      if (!canAct) {
        addLog(`${enemy.name} 无法行动！`, 'system')
        return
      }
      
      // 作弊模式：无敌
      if (cheatMode.enabled && cheatMode.godMode) {
        addLog('作弊：无敌模式，敌人攻击无效！', 'system')
        return
      }
      
      // AI 选择行动
      const useSkill = enemy.skills.length > 0 && enemy.mp >= 10 && Math.random() > 0.6
      
      if (useSkill && enemy.skills[0]) {
        const skill = enemy.skills[0]
        enemy.mp -= skill.mpCost
        if (skill.damage) {
          const result = performAttack(enemy, newPlayer, skill.damageType === 'magical')
          const damage = Math.floor(result.damage * (skill.damage || 1))
          newPlayer.hp -= damage
          addLog(`${enemy.name} 使用 ${skill.name} 造成 ${damage} 点伤害！`, 'damage')
        }
      } else {
        const result = performAttack(enemy, newPlayer, false)
        newPlayer.hp -= result.damage
        addLog(`${enemy.name} 造成 ${result.damage} 点伤害！`, 'damage')
      }
    })

    // 检查玩家死亡
    if (newPlayer.hp <= 0 && !(cheatMode.enabled && cheatMode.godMode)) {
      newPlayer.hp = 0
      setGamePhase('gameOver')
      addLog('你倒下了...游戏结束。', 'system')
    }

    newState.player = newPlayer
    newState.currentTurn = 'player'
    newState.turn += 1
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
    setCurrentFloor(prev => {
      const newFloor = prev + 1
      addLog(`进入第 ${newFloor} 层！`, 'system')
      return newFloor
    })
    
    if (player) {
      setPlayer({
        ...player,
        hp: Math.min(player.hp + 20, player.maxHp),
        mp: Math.min(player.mp + 10, player.maxMp),
      })
    }
  }, [player, addLog])

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

  return {
    gamePhase,
    player,
    battleState,
    inventory,
    gameLog,
    currentFloor,
    cheatMode,
    battleAnimation,
    startGame,
    encounterEnemy,
    playerAction,
    selectEnemy,
    nextFloor,
    useItem,
    handleTitleClick,
    toggleCheatOption,
  }
}

function getClassName(characterClass: CharacterClass): string {
  const names = { warrior: '战士', mage: '法师', rogue: '盗贼', paladin: '圣骑士', ranger: '游侠' }
  return names[characterClass]
}
