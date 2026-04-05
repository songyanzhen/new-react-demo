import { useState, useCallback, useMemo } from 'react'
import type { Character, CharacterClass, GamePhase, BattleState, Enemy, Skill, Item, Inventory } from '../types'
import { getRandomEnemy, getBoss } from '../data/enemies'
import { getCharacterSkills } from '../data/skills'

// 初始角色创建
function createInitialCharacter(name: string, characterClass: CharacterClass): Character {
  const baseStats = {
    warrior: { strength: 10, intelligence: 4, agility: 6, defense: 8 },
    mage: { strength: 4, intelligence: 12, agility: 6, defense: 4 },
    rogue: { strength: 8, intelligence: 6, agility: 12, defense: 4 },
  }

  return {
    id: 'player',
    name,
    class: characterClass,
    level: 1,
    exp: 0,
    maxExp: 100,
    hp: 100,
    maxHp: 100,
    mp: 50,
    maxMp: 50,
    stats: baseStats[characterClass],
    equipment: { weapon: null, armor: null, accessory: null },
    skills: getCharacterSkills(characterClass),
  }
}

export function useRpgGame() {
  const [gamePhase, setGamePhase] = useState<GamePhase>('explore')
  const [player, setPlayer] = useState<Character | null>(null)
  const [battleState, setBattleState] = useState<BattleState | null>(null)
  const [inventory, setInventory] = useState<Inventory>({ items: [], gold: 100 })
  const [gameLog, setGameLog] = useState<string[]>(['欢迎来到 RPG 世界！'])
  const [currentFloor, setCurrentFloor] = useState(1)

  // 开始新游戏
  const startGame = useCallback((name: string, characterClass: CharacterClass) => {
    const newPlayer = createInitialCharacter(name, characterClass)
    setPlayer(newPlayer)
    setInventory({ items: [], gold: 100 })
    setGamePhase('explore')
    setCurrentFloor(1)
    setGameLog([`欢迎，${name}！你选择了${getClassName(characterClass)}职业。`])
  }, [])

  // 遭遇敌人
  const encounterEnemy = useCallback(() => {
    if (!player) return
    
    const enemyCount = Math.floor(Math.random() * 3) + 1 // 1-3个敌人
    const enemies: Enemy[] = []
    
    for (let i = 0; i < enemyCount; i++) {
      enemies.push(getRandomEnemy(player.level))
    }

    setBattleState({
      player: { ...player },
      enemies,
      turn: 1,
      currentTurn: 'player',
      selectedEnemyIndex: 0,
      battleLog: [`遭遇了 ${enemies.map(e => e.name).join('、')}!`],
    })
    setGamePhase('battle')
    addLog(`遭遇了 ${enemies.map(e => e.name).join('、')}!`)
  }, [player])

  // 玩家行动
  const playerAction = useCallback((action: 'attack' | 'skill' | 'item' | 'flee', skillOrItemId?: string) => {
    if (!battleState || !player) return

    let newBattleState = { ...battleState }
    let newPlayer = { ...battleState.player }
    let newEnemies = [...battleState.enemies]

    if (action === 'attack') {
      // 普通攻击
      const target = newEnemies[battleState.selectedEnemyIndex]
      const damage = calculateDamage(newPlayer, target, 'physical')
      target.hp -= damage
      newBattleState.battleLog.push(`${newPlayer.name} 对 ${target.name} 造成 ${damage} 点伤害！`)
    } else if (action === 'skill' && skillOrItemId) {
      const skill = newPlayer.skills.find(s => s.id === skillOrItemId)
      if (skill && newPlayer.mp >= skill.mpCost) {
        newPlayer.mp -= skill.mpCost
        
        if (skill.damage) {
          const target = newEnemies[battleState.selectedEnemyIndex]
          const damage = calculateDamage(newPlayer, target, skill.type, skill.damage)
          target.hp -= damage
          newBattleState.battleLog.push(`${newPlayer.name} 使用 ${skill.name} 对 ${target.name} 造成 ${damage} 点伤害！`)
        } else if (skill.heal) {
          const healAmount = skill.heal
          newPlayer.hp = Math.min(newPlayer.hp + healAmount, newPlayer.maxHp)
          newBattleState.battleLog.push(`${newPlayer.name} 使用 ${skill.name} 恢复了 ${healAmount} 点生命值！`)
        }
      }
    } else if (action === 'flee') {
      // 逃跑，50%成功率
      if (Math.random() > 0.5) {
        setGamePhase('explore')
        addLog('成功逃跑了！')
        return
      } else {
        newBattleState.battleLog.push('逃跑失败！')
      }
    }

    // 移除死亡的敌人
    newEnemies = newEnemies.filter(e => e.hp > 0)
    newBattleState.enemies = newEnemies

    // 检查战斗结束
    if (newEnemies.length === 0) {
      // 胜利
      const totalExp = battleState.enemies.reduce((sum, e) => sum + e.expReward, 0)
      const totalGold = battleState.enemies.reduce((sum, e) => sum + e.goldReward, 0)
      
      setInventory(prev => ({ ...prev, gold: prev.gold + totalGold }))
      
      const leveledUp = gainExp(totalExp)
      
      addLog(`战斗胜利！获得 ${totalExp} 经验值和 ${totalGold} 金币！${leveledUp ? '升级了！' : ''}`)
      setGamePhase('explore')
      return
    }

    newBattleState.player = newPlayer
    newBattleState.currentTurn = 'enemy'
    setBattleState(newBattleState)

    // 敌人回合（延迟执行）
    setTimeout(() => {
      enemyTurn(newBattleState)
    }, 1000)
  }, [battleState, player])

  // 敌人回合
  const enemyTurn = useCallback((currentState: BattleState) => {
    let newState = { ...currentState }
    let newPlayer = { ...currentState.player }

    currentState.enemies.forEach(enemy => {
      if (enemy.hp <= 0) return
      
      // 简单AI：随机选择攻击或技能
      const useSkill = enemy.skills.length > 0 && enemy.mp >= enemy.skills[0].mpCost && Math.random() > 0.5
      
      if (useSkill) {
        const skill = enemy.skills[0]
        enemy.mp -= skill.mpCost
        if (skill.damage) {
          const damage = calculateEnemyDamage(enemy, newPlayer, skill.damage)
          newPlayer.hp -= damage
          newState.battleLog.push(`${enemy.name} 使用 ${skill.name} 造成 ${damage} 点伤害！`)
        }
      } else {
        // 普通攻击
        const damage = calculateEnemyDamage(enemy, newPlayer)
        newPlayer.hp -= damage
        newState.battleLog.push(`${enemy.name} 造成 ${damage} 点伤害！`)
      }
    })

    // 检查玩家死亡
    if (newPlayer.hp <= 0) {
      newPlayer.hp = 0
      setGamePhase('gameOver')
      addLog('你倒下了...游戏结束。')
    }

    newState.player = newPlayer
    newState.currentTurn = 'player'
    newState.turn += 1
    setBattleState(newState)
    setPlayer(newPlayer)
  }, [])

  // 计算伤害
  const calculateDamage = (attacker: Character, defender: Enemy, type: 'physical' | 'magical', multiplier = 1): number => {
    const attackStat = type === 'physical' ? attacker.stats.strength : attacker.stats.intelligence
    const defenseStat = defender.stats.defense
    const baseDamage = Math.max(1, attackStat * 2 - defenseStat)
    const variance = 0.8 + Math.random() * 0.4 // 80%-120% 浮动
    return Math.floor(baseDamage * multiplier * variance)
  }

  // 计算敌人伤害
  const calculateEnemyDamage = (attacker: Enemy, defender: Character, multiplier = 1): number => {
    const defenseStat = defender.stats.defense + (defender.equipment.armor?.effect.statBoost?.defense || 0)
    const baseDamage = Math.max(1, attacker.stats.strength * 2 - defenseStat)
    const variance = 0.8 + Math.random() * 0.4
    return Math.floor(baseDamage * multiplier * variance)
  }

  // 获得经验值
  const gainExp = useCallback((amount: number): boolean => {
    if (!player) return false
    
    let newPlayer = { ...player }
    newPlayer.exp += amount
    
    let leveledUp = false
    while (newPlayer.exp >= newPlayer.maxExp) {
      newPlayer.exp -= newPlayer.maxExp
      newPlayer.level += 1
      newPlayer.maxExp = Math.floor(newPlayer.maxExp * 1.2)
      
      // 升级奖励
      newPlayer.maxHp += 10
      newPlayer.hp = newPlayer.maxHp
      newPlayer.maxMp += 5
      newPlayer.mp = newPlayer.maxMp
      newPlayer.stats.strength += 2
      newPlayer.stats.intelligence += 2
      newPlayer.stats.agility += 2
      newPlayer.stats.defense += 1
      
      leveledUp = true
    }
    
    setPlayer(newPlayer)
    return leveledUp
  }, [player])

  // 添加日志
  const addLog = useCallback((message: string) => {
    setGameLog(prev => [...prev.slice(-9), message])
  }, [])

  // 选择敌人
  const selectEnemy = useCallback((index: number) => {
    if (battleState) {
      setBattleState({ ...battleState, selectedEnemyIndex: index })
    }
  }, [battleState])

  // 下一层
  const nextFloor = useCallback(() => {
    setCurrentFloor(prev => prev + 1)
    // 恢复一些HP和MP
    if (player) {
      setPlayer({
        ...player,
        hp: Math.min(player.hp + 20, player.maxHp),
        mp: Math.min(player.mp + 10, player.maxMp),
      })
    }
    addLog(`进入第 ${currentFloor + 1} 层！`)
  }, [player, currentFloor])

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
    }
    if (item.effect.mpRestore) {
      setPlayer({
        ...player,
        mp: Math.min(player.mp + item.effect.mpRestore, player.maxMp),
      })
    }
    
    // 减少数量
    const newItems = [...inventory.items]
    newItems[itemIndex].quantity--
    if (newItems[itemIndex].quantity <= 0) {
      newItems.splice(itemIndex, 1)
    }
    setInventory({ ...inventory, items: newItems })
    
    addLog(`使用了 ${item.name}`)
  }, [player, inventory])

  return {
    gamePhase,
    player,
    battleState,
    inventory,
    gameLog,
    currentFloor,
    startGame,
    encounterEnemy,
    playerAction,
    selectEnemy,
    nextFloor,
    useItem,
  }
}

// 辅助函数
function getClassName(characterClass: CharacterClass): string {
  const names = { warrior: '战士', mage: '法师', rogue: '盗贼' }
  return names[characterClass]
}
