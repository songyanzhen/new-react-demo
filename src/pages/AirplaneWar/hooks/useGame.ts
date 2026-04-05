import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  GameStatus,
  Player,
  Bullet,
  Enemy,
  Boss,
  PowerUp,
  Explosion,
  KeyState,
  BossType,
} from '../types'
import { generateId, checkCollision, clamp, randomInt } from '../utils'
import { BOSS_CONFIGS, BOSS_SPAWN_THRESHOLD, getRandomBossType, getBossHpMultiplier, getBossAttackInterval } from '../data/bosses'
import { calculateDifficulty } from '../data/difficulty'

// 游戏配置常量
const CANVAS_WIDTH = 400
const CANVAS_HEIGHT = 600
const PLAYER_SIZE = { width: 40, height: 40 }
const PLAYER_SPEED = 5
const BULLET_SIZE = { width: 4, height: 12 }
const BULLET_SPEED = 8
const ENEMY_SIZE = { width: 30, height: 30 }
const ENEMY_SPEED_BASE = 2
const POWERUP_SIZE = { width: 25, height: 25 }

// 玩家配置
const PLAYER_INITIAL_HP = 3
const PLAYER_MAX_HP = 3
const PLAYER_MAX_POWER = 3
const PLAYER_BULLET_COOLDOWN = 180 // 毫秒，射速（更慢）

interface UseGameOptions {
  onShoot?: () => void
  onHit?: () => void
  onExplosion?: () => void
  onPowerUp?: () => void
  onDamage?: () => void
  onGameStart?: () => void
  onGameOver?: () => void
  onBossVictory?: () => void
}

export function useGame(options: UseGameOptions = {}) {
  const { 
    onShoot, onHit, onExplosion, onPowerUp, onDamage, 
    onGameStart, onGameOver, onBossVictory 
  } = options

  // 游戏状态
  const [status, setStatus] = useState<GameStatus>('idle')
  const [score, setScore] = useState(0)
  const [gameTime, setGameTime] = useState(0)
  
  // Boss相关状态
  const [boss, setBoss] = useState<Boss | null>(null)
  const [bossDefeatedCount, setBossDefeatedCount] = useState(0)
  const [scoreSinceLastBoss, setScoreSinceLastBoss] = useState(0)
  const [pendingBossType, setPendingBossType] = useState<BossType | null>(null)
  
  // 玩家
  const [player, setPlayer] = useState<Player>({
    position: { x: CANVAS_WIDTH / 2 - PLAYER_SIZE.width / 2, y: CANVAS_HEIGHT - 80 },
    size: PLAYER_SIZE,
    speed: PLAYER_SPEED,
    hp: PLAYER_INITIAL_HP,
    maxHp: PLAYER_MAX_HP,
    powerLevel: 0,
    shield: 0,
  })
  
  // 游戏对象 - 用于渲染的 state
  const [bullets, setBullets] = useState<Bullet[]>([])
  const [enemies, setEnemies] = useState<Enemy[]>([])
  const [powerUps, setPowerUps] = useState<PowerUp[]>([])
  const [explosions, setExplosions] = useState<Explosion[]>([])
  
  // 游戏对象的 refs - 用于游戏逻辑计算
  const bulletsRef = useRef<Bullet[]>([])
  const enemiesRef = useRef<Enemy[]>([])
  const powerUpsRef = useRef<PowerUp[]>([])
  const explosionsRef = useRef<Explosion[]>([])
  const bossRef = useRef<Boss | null>(null)
  const playerRef = useRef(player)
  const scoreSinceLastBossRef = useRef(0)
  const accumulatedScoreRef = useRef(0) // 用于追踪Boss触发
  
  // 同步 state 到 ref
  useEffect(() => { bulletsRef.current = bullets }, [bullets])
  useEffect(() => { enemiesRef.current = enemies }, [enemies])
  useEffect(() => { powerUpsRef.current = powerUps }, [powerUps])
  useEffect(() => { explosionsRef.current = explosions }, [explosions])
  useEffect(() => { bossRef.current = boss }, [boss])
  useEffect(() => { playerRef.current = player }, [player])
  useEffect(() => { scoreSinceLastBossRef.current = scoreSinceLastBoss }, [scoreSinceLastBoss])
  
  // 键盘状态
  const [keys, setKeys] = useState<KeyState>({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    KeyW: false,
    KeyS: false,
    KeyA: false,
    KeyD: false,
    Space: false,
  })
  
  // 用于游戏循环的 refs
  const gameLoopRef = useRef<number | undefined>(undefined)
  const lastTimeRef = useRef<number>(0)
  const enemySpawnTimerRef = useRef<number>(0)
  const powerUpSpawnTimerRef = useRef<number>(0)
  const bulletCooldownRef = useRef<number>(0)
  const bossMovePhaseRef = useRef<number>(0) // Boss移动相位

  // 开始游戏
  const startGame = useCallback(() => {
    setStatus('playing')
    setScore(0)
    setGameTime(0)
    setScoreSinceLastBoss(0)
    setBossDefeatedCount(0)
    setBoss(null)
    setPendingBossType(null)
    setBullets([])
    setEnemies([])
    setPowerUps([])
    setExplosions([])
    bulletsRef.current = []
    enemiesRef.current = []
    powerUpsRef.current = []
    explosionsRef.current = []
    bossRef.current = null
    scoreSinceLastBossRef.current = 0
    accumulatedScoreRef.current = 0
    bossMovePhaseRef.current = 0
    setPlayer({
      position: { x: CANVAS_WIDTH / 2 - PLAYER_SIZE.width / 2, y: CANVAS_HEIGHT - 80 },
      size: PLAYER_SIZE,
      speed: PLAYER_SPEED,
      hp: PLAYER_INITIAL_HP,
      maxHp: PLAYER_MAX_HP,
      powerLevel: 0,
      shield: 0,
    })
    lastTimeRef.current = performance.now()
    enemySpawnTimerRef.current = 0
    powerUpSpawnTimerRef.current = 0
    bulletCooldownRef.current = 0
    onGameStart?.()
  }, [onGameStart])

  // 暂停/继续游戏
  const togglePause = useCallback(() => {
    setStatus((prev) => {
      if (prev === 'playing') return 'paused'
      if (prev === 'paused') return 'playing'
      if (prev === 'bossBattle') return 'paused'
      return prev
    })
  }, [])

  // 游戏结束 - 进入爆炸动画状态
  const gameOver = useCallback(() => {
    // 进入玩家爆炸状态
    setStatus('playerExploding')
    
    // 停止游戏对象更新
    setBullets([])
    setEnemies([])
    setPowerUps([])
    bulletsRef.current = []
    enemiesRef.current = []
    powerUpsRef.current = []
    
    // 延迟后显示游戏结束界面（等待爆炸动画）
    setTimeout(() => {
      setStatus('gameOver')
      setBoss(null)
      bossRef.current = null
      onGameOver?.()
    }, 1200) // 1.2秒爆炸动画
  }, [onGameOver])

  // 触发Boss战
  const triggerBossBattle = useCallback(() => {
    const randomType = getRandomBossType()
    setPendingBossType(randomType)
    setStatus('bossWarning')
    accumulatedScoreRef.current = 0 // 重置累积分数
  }, [])

  // 开始Boss战
  const startBossBattle = useCallback(() => {
    if (!pendingBossType) return
    
    const config = BOSS_CONFIGS[pendingBossType]
    // Boss血量随击败次数增加
    const hpMultiplier = getBossHpMultiplier(bossDefeatedCount)
    const scaledHp = Math.floor(config.hp * hpMultiplier)
    
    const newBoss: Boss = {
      id: generateId(),
      position: { x: CANVAS_WIDTH / 2 - config.size.width / 2, y: -config.size.height },
      size: config.size,
      speed: config.speed,
      hp: scaledHp,
      maxHp: scaledHp,
      type: pendingBossType,
      phase: 1,
      lastShotTime: 0,
      attackPattern: 0,
      scoreReward: config.scoreReward,
    }
    
    setBoss(newBoss)
    bossRef.current = newBoss
    bossMovePhaseRef.current = 0
    setStatus('bossBattle')
    setPendingBossType(null)
    // 清理场上的敌机
    setEnemies([])
    enemiesRef.current = []
  }, [pendingBossType])

  // Boss被击败 - 进入爆炸动画状态
  const defeatBoss = useCallback(() => {
    const currentBoss = bossRef.current
    if (!currentBoss) return

    // 进入爆炸状态
    setStatus('bossExploding')
    
    // 给予奖励
    setScore((s) => s + currentBoss.scoreReward)
    
    // 恢复玩家部分HP（+1，不超过最大值的60%）
    setPlayer((prev) => ({ 
      ...prev, 
      hp: Math.min(prev.hp + 1, Math.floor(prev.maxHp * 0.6))
    }))
    
    // 清理场上的所有子弹和敌机（防止击败Boss后立刻受伤）
    setBullets([])
    setEnemies([])
    bulletsRef.current = []
    enemiesRef.current = []
    
    // 延迟后显示胜利界面（等待爆炸动画）
    setTimeout(() => {
      setStatus('bossVictory')
      onBossVictory?.()
      
      // 延迟后恢复游戏
      setTimeout(() => {
        setBoss(null)
        bossRef.current = null
        setBossDefeatedCount((c) => c + 1)
        setScoreSinceLastBoss(0)
        scoreSinceLastBossRef.current = 0
        accumulatedScoreRef.current = 0
        setStatus('playing')
      }, 3000)
    }, 1000) // 1秒后显示胜利界面
  }, [onBossVictory])

  // 键盘事件处理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowUp') setKeys((k) => ({ ...k, ArrowUp: true }))
      if (e.code === 'ArrowDown') setKeys((k) => ({ ...k, ArrowDown: true }))
      if (e.code === 'ArrowLeft') setKeys((k) => ({ ...k, ArrowLeft: true }))
      if (e.code === 'ArrowRight') setKeys((k) => ({ ...k, ArrowRight: true }))
      if (e.code === 'KeyW') setKeys((k) => ({ ...k, KeyW: true }))
      if (e.code === 'KeyS') setKeys((k) => ({ ...k, KeyS: true }))
      if (e.code === 'KeyA') setKeys((k) => ({ ...k, KeyA: true }))
      if (e.code === 'KeyD') setKeys((k) => ({ ...k, KeyD: true }))
      if (e.code === 'Space') {
        e.preventDefault()
        setKeys((k) => ({ ...k, Space: true }))
      }
      if (e.code === 'Escape' && (status === 'playing' || status === 'bossBattle')) {
        togglePause()
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowUp') setKeys((k) => ({ ...k, ArrowUp: false }))
      if (e.code === 'ArrowDown') setKeys((k) => ({ ...k, ArrowDown: false }))
      if (e.code === 'ArrowLeft') setKeys((k) => ({ ...k, ArrowLeft: false }))
      if (e.code === 'ArrowRight') setKeys((k) => ({ ...k, ArrowRight: false }))
      if (e.code === 'KeyW') setKeys((k) => ({ ...k, KeyW: false }))
      if (e.code === 'KeyS') setKeys((k) => ({ ...k, KeyS: false }))
      if (e.code === 'KeyA') setKeys((k) => ({ ...k, KeyA: false }))
      if (e.code === 'KeyD') setKeys((k) => ({ ...k, KeyD: false }))
      if (e.code === 'Space') setKeys((k) => ({ ...k, Space: false }))
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [status, togglePause])

  // 游戏主循环
  useEffect(() => {
    // 爆炸状态也需要渲染动画
    const isExploding = status === 'bossExploding' || status === 'playerExploding'
    
    if (status !== 'playing' && status !== 'bossBattle' && !isExploding) {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
      return
    }

    const isBossBattle = status === 'bossBattle' || status === 'bossExploding'

    const gameLoop = (currentTime: number) => {
      const deltaTime = currentTime - lastTimeRef.current
      lastTimeRef.current = currentTime

      // 爆炸状态只更新爆炸效果
      if (isExploding) {
        setExplosions((prev) => 
          prev
            .map((exp) => ({ ...exp, duration: exp.duration - deltaTime }))
            .filter((exp) => exp.duration > 0)
        )
        gameLoopRef.current = requestAnimationFrame(gameLoop)
        return
      }

      // 更新游戏时间
      setGameTime((prev) => prev + deltaTime)

      // 获取当前游戏对象
      let currentBullets = bulletsRef.current
      let currentEnemies = enemiesRef.current
      let currentPowerUps = powerUpsRef.current
      let currentExplosions = explosionsRef.current
      let currentBoss = bossRef.current
      const currentPlayer = playerRef.current

      // 更新玩家位置
      setPlayer((prev) => {
        let newX = prev.position.x
        let newY = prev.position.y

        if (keys.ArrowLeft || keys.KeyA) newX -= prev.speed
        if (keys.ArrowRight || keys.KeyD) newX += prev.speed
        if (keys.ArrowUp || keys.KeyW) newY -= prev.speed
        if (keys.ArrowDown || keys.KeyS) newY += prev.speed

        return {
          ...prev,
          position: {
            x: clamp(newX, 0, CANVAS_WIDTH - prev.size.width),
            y: clamp(newY, 0, CANVAS_HEIGHT - prev.size.height),
          },
        }
      })

      // 发射子弹
      let hasShot = false
      bulletCooldownRef.current += deltaTime
      if (keys.Space && bulletCooldownRef.current > PLAYER_BULLET_COOLDOWN) {
        bulletCooldownRef.current = 0
        const powerLevel = currentPlayer.powerLevel || 0
        // 火力等级伤害：0级=1，1级=2，2级=3，3级=4
        const damage = powerLevel >= 3 ? 4 : (1 + powerLevel)
        const newBullets: Bullet[] = []
        
        // 根据火力等级发射不同数量/类型的子弹
        if (powerLevel === 0) {
          // 普通子弹 - 1发居中
          newBullets.push({
            id: generateId(),
            position: {
              x: currentPlayer.position.x + currentPlayer.size.width / 2 - BULLET_SIZE.width / 2,
              y: currentPlayer.position.y,
            },
            size: BULLET_SIZE,
            speed: BULLET_SPEED,
            damage,
            isPlayerBullet: true,
          })
        } else if (powerLevel === 1) {
          // 2发子弹 - 稍微分散
          newBullets.push(
            {
              id: generateId(),
              position: { x: currentPlayer.position.x + 5, y: currentPlayer.position.y + 3 },
              size: BULLET_SIZE,
              speed: BULLET_SPEED,
              damage,
              isPlayerBullet: true,
            },
            {
              id: generateId(),
              position: { x: currentPlayer.position.x + currentPlayer.size.width - 10, y: currentPlayer.position.y + 3 },
              size: BULLET_SIZE,
              speed: BULLET_SPEED,
              damage,
              isPlayerBullet: true,
            }
          )
        } else if (powerLevel === 2) {
          // 3发子弹（中间+两侧）
          newBullets.push(
            {
              id: generateId(),
              position: { x: currentPlayer.position.x + currentPlayer.size.width / 2 - BULLET_SIZE.width / 2, y: currentPlayer.position.y },
              size: BULLET_SIZE,
              speed: BULLET_SPEED,
              damage,
              isPlayerBullet: true,
            },
            {
              id: generateId(),
              position: { x: currentPlayer.position.x + 3, y: currentPlayer.position.y + 5 },
              size: BULLET_SIZE,
              speed: BULLET_SPEED,
              damage,
              isPlayerBullet: true,
            },
            {
              id: generateId(),
              position: { x: currentPlayer.position.x + currentPlayer.size.width - 8, y: currentPlayer.position.y + 5 },
              size: BULLET_SIZE,
              speed: BULLET_SPEED,
              damage,
              isPlayerBullet: true,
            }
          )
        } else {
          // 满级火力 - 3发（中间+两侧），伤害提升到4
          const centerX = currentPlayer.position.x + currentPlayer.size.width / 2
          const baseY = currentPlayer.position.y
          newBullets.push(
            {
              id: generateId(),
              position: { x: centerX - BULLET_SIZE.width / 2, y: baseY },
              size: BULLET_SIZE,
              speed: BULLET_SPEED + 1,
              damage,
              isPlayerBullet: true,
            },
            {
              id: generateId(),
              position: { x: currentPlayer.position.x + 5, y: baseY + 5 },
              size: BULLET_SIZE,
              speed: BULLET_SPEED,
              damage,
              isPlayerBullet: true,
            },
            {
              id: generateId(),
              position: { x: currentPlayer.position.x + currentPlayer.size.width - 10, y: baseY + 5 },
              size: BULLET_SIZE,
              speed: BULLET_SPEED,
              damage,
              isPlayerBullet: true,
            }
          )
        }
        
        // 限制子弹数量防止性能问题（最多50发玩家子弹）
        const playerBulletCount = currentBullets.filter(b => b.isPlayerBullet).length
        if (playerBulletCount < 50) {
          currentBullets = [...currentBullets, ...newBullets]
        }
        hasShot = true
      }
      
      if (hasShot) {
        onShoot?.()
      }

      // Boss战逻辑
      if (isBossBattle && currentBoss) {
        // Boss入场动画
        const targetY = 80 // Boss停留的Y位置
        if (currentBoss.position.y < targetY) {
          currentBoss = {
            ...currentBoss,
            position: {
              ...currentBoss.position,
              y: Math.min(targetY, currentBoss.position.y + 3),
            },
          }
        } else {
          // Boss移动模式 - 使用平滑的正弦波移动
          bossMovePhaseRef.current += deltaTime * 0.001 * currentBoss.speed
          
          // 计算目标位置（不考虑边界）
          const time = bossMovePhaseRef.current
          const moveWidth = CANVAS_WIDTH - currentBoss.size.width - 60 // 留出60px边距
          const targetX = 30 + moveWidth / 2 + Math.sin(time) * (moveWidth / 2)
          const targetY = 80 + Math.sin(time * 1.3) * 15
          
          // 平滑插值到目标位置
          const smoothFactor = 0.08 // 插值系数，越小越平滑
          const newX = currentBoss.position.x + (targetX - currentBoss.position.x) * smoothFactor
          const newY = currentBoss.position.y + (targetY - currentBoss.position.y) * smoothFactor
          
          currentBoss = {
            ...currentBoss,
            position: {
              x: newX,
              y: newY,
            },
          }
        }

        // Boss射击 - 使用动态攻击间隔
        currentBoss.lastShotTime += deltaTime
        const attackInterval = getBossAttackInterval(bossDefeatedCount)
        if (currentBoss.lastShotTime > attackInterval) {
          currentBoss.lastShotTime = 0
          
          // 根据类型发射不同子弹
          if (currentBoss.type === 'destroyer') {
            // 毁灭者：散射5发子弹（扇形，左右展开）
            const spreadAngles = [-0.3, -0.15, 0, 0.15, 0.3] // 弧度，约±17度
            for (let i = 0; i < 5; i++) {
              const angle = spreadAngles[i]
              const speed = 5
              const newBullet: Bullet = {
                id: generateId(),
                position: {
                  x: currentBoss.position.x + currentBoss.size.width / 2,
                  y: currentBoss.position.y + currentBoss.size.height,
                },
                size: { width: 6, height: 12 },
                speed: speed,
                damage: 1,
                isPlayerBullet: false,
                // 添加速度向量用于斜向子弹
                velocityX: Math.sin(angle) * speed,
                velocityY: Math.cos(angle) * speed,
              }
              currentBullets = [...currentBullets, newBullet]
            }
          } else if (currentBoss.type === 'phantom') {
            // 幽灵战机：快速连续5发 + 追踪玩家方向 + 随机散布
            const playerX = playerRef.current.position.x + playerRef.current.size.width / 2
            const bossCenterX = currentBoss.position.x + currentBoss.size.width / 2
            const baseOffset = playerX > bossCenterX ? 20 : -20
            
            for (let i = 0; i < 5; i++) {
              const randomOffset = (Math.random() - 0.5) * 30
              const angle = (baseOffset > 0 ? 0.1 : -0.1) + (Math.random() - 0.5) * 0.2
              const speed = 6 + i * 0.5
              const newBullet: Bullet = {
                id: generateId(),
                position: {
                  x: currentBoss.position.x + currentBoss.size.width / 2 + baseOffset * (i - 2) * 0.5 + randomOffset,
                  y: currentBoss.position.y + currentBoss.size.height,
                },
                size: { width: 5, height: 14 },
                speed: speed,
                damage: 1,
                isPlayerBullet: false,
                velocityX: Math.sin(angle) * speed,
                velocityY: Math.cos(angle) * speed,
              }
              currentBullets = [...currentBullets, newBullet]
            }
          } else if (currentBoss.type === 'mothership') {
            // 母舰：召唤小兵 + 激光束
            const laserBullet: Bullet = {
              id: generateId(),
              position: {
                x: currentBoss.position.x + currentBoss.size.width / 2 - 10,
                y: currentBoss.position.y + currentBoss.size.height,
              },
              size: { width: 20, height: 30 },
              speed: 4,
              damage: 1,
              isPlayerBullet: false,
            }
            currentBullets = [...currentBullets, laserBullet]
            
            if (Math.random() < 0.4) {
              const newEnemy: Enemy = {
                id: generateId(),
                position: { 
                  x: randomInt(0, CANVAS_WIDTH - ENEMY_SIZE.width), 
                  y: -ENEMY_SIZE.height 
                },
                size: ENEMY_SIZE,
                speed: ENEMY_SPEED_BASE * 1.5,
                hp: 1,
                maxHp: 1,
                score: 5,
                type: 'fast',
              }
              currentEnemies = [...currentEnemies, newEnemy]
            }
          } else if (currentBoss.type === 'overlord') {
            // 虫群主宰：喷吐毒液（散射）+ 召唤虫群
            for (let i = -1; i <= 1; i++) {
              const newBullet: Bullet = {
                id: generateId(),
                position: {
                  x: currentBoss.position.x + currentBoss.size.width / 2 + i * 15,
                  y: currentBoss.position.y + currentBoss.size.height,
                },
                size: { width: 10, height: 14 },
                speed: 4 + Math.abs(i),
                damage: 1,
                isPlayerBullet: false,
              }
              currentBullets = [...currentBullets, newBullet]
            }
            if (Math.random() < 0.5) {
              for (let i = 0; i < 2; i++) {
                const newEnemy: Enemy = {
                  id: generateId(),
                  position: { 
                    x: randomInt(0, CANVAS_WIDTH - ENEMY_SIZE.width), 
                    y: -ENEMY_SIZE.height 
                  },
                  size: { width: 20, height: 20 },
                  speed: ENEMY_SPEED_BASE * 2,
                  hp: 1,
                  maxHp: 1,
                  score: 3,
                  type: 'fast',
                }
                currentEnemies = [...currentEnemies, newEnemy]
              }
            }
          } else if (currentBoss.type === 'nova') {
            // 新星核心：真正的8方向旋转射线
            currentBoss.attackPattern = (currentBoss.attackPattern + 1) % 8
            const baseAngle = (currentBoss.attackPattern / 8) * Math.PI * 2
            const directions = 8
            
            for (let i = 0; i < directions; i++) {
              const angle = baseAngle + (i / directions) * Math.PI * 2
              const speed = 5
              const newBullet: Bullet = {
                id: generateId(),
                position: {
                  x: currentBoss.position.x + currentBoss.size.width / 2,
                  y: currentBoss.position.y + currentBoss.size.height / 2,
                },
                size: { width: 8, height: 16 },
                speed: speed,
                damage: 1,
                isPlayerBullet: false,
                velocityX: Math.cos(angle) * speed,
                velocityY: Math.sin(angle) * speed,
              }
              currentBullets = [...currentBullets, newBullet]
            }
          } else if (currentBoss.type === 'titan') {
            // 远古泰坦：巨石投掷（慢速大子弹）
            const playerX = playerRef.current.position.x + playerRef.current.size.width / 2
            const bossCenterX = currentBoss.position.x + currentBoss.size.width / 2
            const targetOffset = playerX > bossCenterX ? 20 : -20
            
            const boulder: Bullet = {
              id: generateId(),
              position: {
                x: currentBoss.position.x + currentBoss.size.width / 2 + targetOffset,
                y: currentBoss.position.y + currentBoss.size.height,
              },
              size: { width: 24, height: 24 },
              speed: 3,
              damage: 2,
              isPlayerBullet: false,
            }
            currentBullets = [...currentBullets, boulder]
            
            // 两侧小石子
            const pebble1: Bullet = {
              id: generateId(),
              position: {
                x: currentBoss.position.x + 20,
                y: currentBoss.position.y + currentBoss.size.height - 10,
              },
              size: { width: 10, height: 10 },
              speed: 5,
              damage: 1,
              isPlayerBullet: false,
            }
            const pebble2: Bullet = {
              id: generateId(),
              position: {
                x: currentBoss.position.x + currentBoss.size.width - 30,
                y: currentBoss.position.y + currentBoss.size.height - 10,
              },
              size: { width: 10, height: 10 },
              speed: 5,
              damage: 1,
              isPlayerBullet: false,
            }
            currentBullets = [...currentBullets, pebble1, pebble2]
          }
        }

        // 更新Boss状态
        bossRef.current = currentBoss
        setBoss(currentBoss)
      }

      // 非Boss战时生成敌机（使用动态难度）
      if (!isBossBattle) {
        const difficulty = calculateDifficulty(score)
        enemySpawnTimerRef.current += deltaTime
        if (enemySpawnTimerRef.current > difficulty.enemySpawnRate) {
          enemySpawnTimerRef.current = 0
          const enemyType = randomInt(1, 10)
          let type: Enemy['type'] = 'normal'
          let hp = 1
          let speed = ENEMY_SPEED_BASE * difficulty.enemySpeedMultiplier
          let scoreValue = Math.floor(10 * difficulty.enemyScoreMultiplier)

          if (enemyType === 9) {
            type = 'fast'
            hp = 1
            speed *= 2.5
            scoreValue = Math.floor(25 * difficulty.enemyScoreMultiplier)
          } else if (enemyType === 10) {
            type = 'tank'
            hp = Math.floor(5 * difficulty.enemyHpMultiplier)
            speed *= 0.5
            scoreValue = Math.floor(60 * difficulty.enemyScoreMultiplier)
          } else {
            // 普通敌机根据难度增加血量
            if (difficulty.enemyHpMultiplier > 1.3) {
              hp = Math.floor(1 * (difficulty.enemyHpMultiplier * 0.8))
            }
          }

          const newEnemy: Enemy = {
            id: generateId(),
            position: { x: randomInt(0, CANVAS_WIDTH - ENEMY_SIZE.width), y: -ENEMY_SIZE.height },
            size: ENEMY_SIZE,
            speed,
            hp: Math.max(1, hp),
            maxHp: Math.max(1, hp),
            score: scoreValue,
            type,
          }
          currentEnemies = [...currentEnemies, newEnemy]
        }
      }

      // 生成道具（使用动态难度）- 难度越高生成越快
      const difficulty = calculateDifficulty(score)
      powerUpSpawnTimerRef.current += deltaTime
      if (powerUpSpawnTimerRef.current > difficulty.powerUpSpawnRate) {
        powerUpSpawnTimerRef.current = 0
        // 道具掉落加权：低血量时增加治疗掉落率
        const playerHpRatio = currentPlayer.hp / currentPlayer.maxHp
        let powerUpTypes: PowerUp['type'][]
        if (playerHpRatio <= 0.3) {
          // 低血量时60%概率掉落治疗
          powerUpTypes = ['heal', 'heal', 'heal', 'power', 'shield']
        } else if (currentPlayer.powerLevel >= PLAYER_MAX_POWER) {
          // 满火力时减少火力道具，增加护盾
          powerUpTypes = ['heal', 'shield', 'shield', 'power', 'heal']
        } else {
          powerUpTypes = ['heal', 'power', 'shield', 'heal', 'power']
        }
        const newPowerUp: PowerUp = {
          id: generateId(),
          position: { x: randomInt(0, CANVAS_WIDTH - POWERUP_SIZE.width), y: -POWERUP_SIZE.height },
          size: POWERUP_SIZE,
          speed: 2,
          type: powerUpTypes[randomInt(0, powerUpTypes.length - 1)],
        }
        currentPowerUps = [...currentPowerUps, newPowerUp]
      }

      // 更新子弹位置 - 支持斜向子弹（velocityX/velocityY）
      currentBullets = currentBullets
        .map((bullet) => {
          // 如果有速度向量则使用，否则按原逻辑直行
          const vx = bullet.velocityX ?? 0
          const vy = bullet.velocityY ?? (bullet.isPlayerBullet ? -bullet.speed : bullet.speed)
          return {
            ...bullet,
            position: { 
              x: bullet.position.x + vx, 
              y: bullet.position.y + vy 
            },
          }
        })
        .filter((bullet) => {
          // 扩大边界检查范围以适应斜向子弹
          const margin = 50
          if (bullet.isPlayerBullet) return bullet.position.y > -bullet.size.height - margin
          return bullet.position.y < CANVAS_HEIGHT + bullet.size.height + margin &&
                 bullet.position.x > -margin &&
                 bullet.position.x < CANVAS_WIDTH + margin
        })

      // 更新敌机位置
      currentEnemies = currentEnemies
        .map((enemy) => ({
          ...enemy,
          position: { ...enemy.position, y: enemy.position.y + enemy.speed },
        }))
        .filter((enemy) => enemy.position.y < CANVAS_HEIGHT + enemy.size.height)

      // 更新道具位置
      currentPowerUps = currentPowerUps
        .map((powerUp) => ({
          ...powerUp,
          position: { ...powerUp.position, y: powerUp.position.y + powerUp.speed },
        }))
        .filter((powerUp) => powerUp.position.y < CANVAS_HEIGHT + powerUp.size.height)

      // 更新爆炸效果
      currentExplosions = currentExplosions
        .map((exp) => ({ ...exp, duration: exp.duration - deltaTime }))
        .filter((exp) => exp.duration > 0)

      // 碰撞检测 - 子弹击中Boss（Boss战时也检测小怪）
      if (isBossBattle && currentBoss) {
        let bossHit = false
        const remainingBullets: Bullet[] = []
        let updatedBoss = currentBoss

        currentBullets.forEach((bullet) => {
          if (bullet.isPlayerBullet && checkCollision(bullet.position, bullet.size, updatedBoss.position, updatedBoss.size)) {
            bossHit = true
            updatedBoss = { ...updatedBoss, hp: updatedBoss.hp - bullet.damage }
          } else {
            remainingBullets.push(bullet)
          }
        })

        currentBullets = remainingBullets

        if (bossHit) {
          onHit?.()
          if (updatedBoss.hp <= 0) {
            defeatBoss()
            currentBoss = null
          } else {
            currentBoss = updatedBoss
            bossRef.current = updatedBoss
            setBoss(updatedBoss)
          }
        }
      }

      // 碰撞检测 - 子弹击中敌机（包括Boss战时的小怪）
      let hasHit = false
      let hasExplosion = false
      let scoreDelta = 0
      const newExplosions: Explosion[] = []
      
      // 预过滤玩家子弹，减少遍历
      const playerBullets = currentBullets.filter(b => b.isPlayerBullet)
      const playerBulletIds = new Set<string>()
      
      // 检查每个敌机与玩家子弹的碰撞
      currentEnemies = currentEnemies.map((enemy) => {
        let enemyHp = enemy.hp
        
        for (const bullet of playerBullets) {
          if (playerBulletIds.has(bullet.id)) continue
          
          if (checkCollision(bullet.position, bullet.size, enemy.position, enemy.size)) {
            enemyHp -= bullet.damage
            playerBulletIds.add(bullet.id)
            hasHit = true
            if (enemyHp <= 0) break
          }
        }
        
        if (enemyHp <= 0) {
          scoreDelta += enemy.score
          newExplosions.push({
            id: generateId(),
            position: enemy.position,
            size: enemy.size,
            duration: 300,
            maxDuration: 300,
          })
          hasExplosion = true
          return null // 标记为已销毁
        }
        
        return { ...enemy, hp: enemyHp }
      }).filter(Boolean) as Enemy[]
      
      // 移除已使用的子弹
      currentBullets = currentBullets.filter(b => !playerBulletIds.has(b.id))

      if (scoreDelta > 0) {
        // 累积分数用于触发Boss战
        accumulatedScoreRef.current += scoreDelta
        
        // 更新显示分数
        setScore((s) => s + scoreDelta)
        
        // 更新自上次Boss以来的分数显示
        setScoreSinceLastBoss((prev) => {
          const newValue = prev + scoreDelta
          // 检查是否达到Boss触发条件
          if (accumulatedScoreRef.current >= BOSS_SPAWN_THRESHOLD) {
            triggerBossBattle()
          }
          return newValue
        })
      }
      if (newExplosions.length > 0) {
        currentExplosions = [...currentExplosions, ...newExplosions]
      }
      if (hasHit) onHit?.()
      if (hasExplosion) onExplosion?.()

      // 碰撞检测 - 玩家碰到敌机或Boss
      let playerHit = false
      const enemiesAfterCollision: Enemy[] = []

      currentEnemies.forEach((enemy) => {
        if (checkCollision(currentPlayer.position, currentPlayer.size, enemy.position, enemy.size)) {
          playerHit = true
          currentExplosions.push({
            id: generateId(),
            position: enemy.position,
            size: enemy.size,
            duration: 300,
            maxDuration: 300,
          })
        } else {
          enemiesAfterCollision.push(enemy)
        }
      })

      currentEnemies = enemiesAfterCollision

      // 玩家碰到Boss
      if (isBossBattle && currentBoss && checkCollision(currentPlayer.position, currentPlayer.size, currentBoss.position, currentBoss.size)) {
        playerHit = true
      }

      // 处理玩家受伤（统一函数）
      const handlePlayerDamage = () => {
        onDamage?.()
        setPlayer((prev) => {
          const currentShield = prev.shield || 0
          if (currentShield > 0) {
            // 有护盾时先扣护盾
            return { ...prev, shield: currentShield - 1 }
          } else {
            // 无护盾时扣血
            const newHp = prev.hp - 1
            if (newHp <= 0) {
              gameOver()
            }
            return { ...prev, hp: newHp }
          }
        })
      }

      if (playerHit) {
        handlePlayerDamage()
      }

      // 碰撞检测 - 敌机/Boss子弹击中玩家
      const playerHitByBullet = currentBullets.some((bullet) => 
        !bullet.isPlayerBullet && checkCollision(bullet.position, bullet.size, currentPlayer.position, currentPlayer.size)
      )
      
      if (playerHitByBullet) {
        // 移除击中玩家的子弹
        currentBullets = currentBullets.filter((bullet) => {
          if (!bullet.isPlayerBullet) {
            return !checkCollision(bullet.position, bullet.size, currentPlayer.position, currentPlayer.size)
          }
          return true
        })
        
        handlePlayerDamage()
      }

      // 碰撞检测 - 玩家拾取道具
      let powerUpPicked = false
      const powerUpsAfterPickup: PowerUp[] = []

      currentPowerUps.forEach((powerUp) => {
        if (checkCollision(currentPlayer.position, currentPlayer.size, powerUp.position, powerUp.size)) {
          powerUpPicked = true
          setPlayer((prev) => {
            switch (powerUp.type) {
              case 'heal':
                // 治疗：恢复1点HP或30%最大HP（取较高值）
                const healAmount = Math.max(1, Math.floor(prev.maxHp * 0.3))
                return { ...prev, hp: Math.min(prev.hp + healAmount, prev.maxHp) }
              case 'power':
                // 火力增强：提升子弹伤害（最高3级）
                return { ...prev, powerLevel: Math.min((prev.powerLevel || 0) + 1, PLAYER_MAX_POWER) }
              case 'shield':
                // 护盾：增加1点护盾值（上限2点）
                return { ...prev, shield: Math.min((prev.shield || 0) + 1, 2) }
              default:
                return prev
            }
          })
        } else {
          powerUpsAfterPickup.push(powerUp)
        }
      })

      currentPowerUps = powerUpsAfterPickup
      
      if (powerUpPicked) {
        onPowerUp?.()
      }

      // 同步到 refs 和 state
      bulletsRef.current = currentBullets
      enemiesRef.current = currentEnemies
      powerUpsRef.current = currentPowerUps
      explosionsRef.current = currentExplosions

      setBullets(currentBullets)
      setEnemies(currentEnemies)
      setPowerUps(currentPowerUps)
      setExplosions(currentExplosions)

      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop)
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [status, keys, score, defeatBoss, gameOver, onShoot, onHit, onExplosion, onPowerUp, onDamage, triggerBossBattle])

  return {
    // 游戏状态
    status,
    score,
    gameTime,
    
    // Boss相关
    boss,
    bossDefeatedCount,
    pendingBossType,
    scoreSinceLastBoss,
    
    // 游戏对象
    player,
    bullets,
    enemies,
    powerUps,
    explosions,
    
    // 游戏配置
    canvasWidth: CANVAS_WIDTH,
    canvasHeight: CANVAS_HEIGHT,
    
    // 操作方法
    startGame,
    togglePause,
    startBossBattle,
    
    // 按键状态（用于显示）
    keys,
  }
}
