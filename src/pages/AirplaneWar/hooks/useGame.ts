import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  GameStatus,
  Player,
  Bullet,
  Enemy,
  PowerUp,
  Explosion,
  KeyState,
} from '../types'
import { generateId, checkCollision, clamp, randomInt } from '../utils'

// 游戏配置常量
const CANVAS_WIDTH = 400
const CANVAS_HEIGHT = 600
const PLAYER_SIZE = { width: 40, height: 40 }
const PLAYER_SPEED = 5
const BULLET_SIZE = { width: 4, height: 12 }
const BULLET_SPEED = 8
const ENEMY_SIZE = { width: 30, height: 30 }
const ENEMY_SPEED_BASE = 2
const ENEMY_SPAWN_INTERVAL_BASE = 1500
const POWERUP_SIZE = { width: 25, height: 25 }

interface UseGameOptions {
  onShoot?: () => void
  onHit?: () => void
  onExplosion?: () => void
  onPowerUp?: () => void
  onDamage?: () => void
  onGameStart?: () => void
  onGameOver?: () => void
}

export function useGame(options: UseGameOptions = {}) {
  const { onShoot, onHit, onExplosion, onPowerUp, onDamage, onGameStart, onGameOver } = options
  // 游戏状态
  const [status, setStatus] = useState<GameStatus>('idle')
  const [score, setScore] = useState(0)
  const [gameTime, setGameTime] = useState(0)
  
  // 玩家
  const [player, setPlayer] = useState<Player>({
    position: { x: CANVAS_WIDTH / 2 - PLAYER_SIZE.width / 2, y: CANVAS_HEIGHT - 80 },
    size: PLAYER_SIZE,
    speed: PLAYER_SPEED,
    hp: 3,
    maxHp: 3,
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
  const playerRef = useRef(player)
  
  // 同步 state 到 ref
  useEffect(() => { bulletsRef.current = bullets }, [bullets])
  useEffect(() => { enemiesRef.current = enemies }, [enemies])
  useEffect(() => { powerUpsRef.current = powerUps }, [powerUps])
  useEffect(() => { explosionsRef.current = explosions }, [explosions])
  useEffect(() => { playerRef.current = player }, [player])
  
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
  const gameLoopRef = useRef<number>()
  const lastTimeRef = useRef<number>(0)
  const enemySpawnTimerRef = useRef<number>(0)
  const powerUpSpawnTimerRef = useRef<number>(0)
  const bulletCooldownRef = useRef<number>(0)

  // 开始游戏
  const startGame = useCallback(() => {
    setStatus('playing')
    setScore(0)
    setGameTime(0)
    setBullets([])
    setEnemies([])
    setPowerUps([])
    setExplosions([])
    bulletsRef.current = []
    enemiesRef.current = []
    powerUpsRef.current = []
    explosionsRef.current = []
    setPlayer({
      position: { x: CANVAS_WIDTH / 2 - PLAYER_SIZE.width / 2, y: CANVAS_HEIGHT - 80 },
      size: PLAYER_SIZE,
      speed: PLAYER_SPEED,
      hp: 3,
      maxHp: 3,
    })
    lastTimeRef.current = performance.now()
    enemySpawnTimerRef.current = 0
    powerUpSpawnTimerRef.current = 0
    bulletCooldownRef.current = 0
    onGameStart?.()
  }, [onGameStart])

  // 暂停/继续游戏
  const togglePause = useCallback(() => {
    setStatus((prev) => (prev === 'playing' ? 'paused' : 'playing'))
  }, [])

  // 游戏结束
  const gameOver = useCallback(() => {
    setStatus('gameOver')
    setBullets([])
    setEnemies([])
    setPowerUps([])
    bulletsRef.current = []
    enemiesRef.current = []
    powerUpsRef.current = []
    onGameOver?.()
  }, [onGameOver])

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
      if (e.code === 'Escape' && status === 'playing') {
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
    if (status !== 'playing') {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
      return
    }

    const gameLoop = (currentTime: number) => {
      const deltaTime = currentTime - lastTimeRef.current
      lastTimeRef.current = currentTime

      // 更新游戏时间
      setGameTime((prev) => prev + deltaTime)

      // 获取当前游戏对象
      let currentBullets = bulletsRef.current
      let currentEnemies = enemiesRef.current
      let currentPowerUps = powerUpsRef.current
      let currentExplosions = explosionsRef.current
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
      if (keys.Space && bulletCooldownRef.current > 150) {
        bulletCooldownRef.current = 0
        const newBullet: Bullet = {
          id: generateId(),
          position: {
            x: currentPlayer.position.x + currentPlayer.size.width / 2 - BULLET_SIZE.width / 2,
            y: currentPlayer.position.y,
          },
          size: BULLET_SIZE,
          speed: BULLET_SPEED,
          damage: 1,
          isPlayerBullet: true,
        }
        currentBullets = [...currentBullets, newBullet]
        hasShot = true
      }
      
      if (hasShot) {
        onShoot?.()
      }

      // 生成敌机
      const difficultyMultiplier = 1 + Math.floor(score / 1000) * 0.1
      enemySpawnTimerRef.current += deltaTime
      if (enemySpawnTimerRef.current > ENEMY_SPAWN_INTERVAL_BASE / difficultyMultiplier) {
        enemySpawnTimerRef.current = 0
        const enemyType = randomInt(1, 10)
        let type: Enemy['type'] = 'normal'
        let hp = 1
        let speed = ENEMY_SPEED_BASE * difficultyMultiplier
        let scoreValue = 10

        if (enemyType === 9) {
          type = 'fast'
          hp = 1
          speed *= 2
          scoreValue = 20
        } else if (enemyType === 10) {
          type = 'tank'
          hp = 3
          speed *= 0.5
          scoreValue = 50
        }

        const newEnemy: Enemy = {
          id: generateId(),
          position: { x: randomInt(0, CANVAS_WIDTH - ENEMY_SIZE.width), y: -ENEMY_SIZE.height },
          size: ENEMY_SIZE,
          speed,
          hp,
          maxHp: hp,
          score: scoreValue,
          type,
        }
        currentEnemies = [...currentEnemies, newEnemy]
      }

      // 生成道具
      powerUpSpawnTimerRef.current += deltaTime
      if (powerUpSpawnTimerRef.current > 10000) {
        powerUpSpawnTimerRef.current = 0
        const powerUpTypes: PowerUp['type'][] = ['heal', 'power', 'shield']
        const newPowerUp: PowerUp = {
          id: generateId(),
          position: { x: randomInt(0, CANVAS_WIDTH - POWERUP_SIZE.width), y: -POWERUP_SIZE.height },
          size: POWERUP_SIZE,
          speed: 2,
          type: powerUpTypes[randomInt(0, 2)],
        }
        currentPowerUps = [...currentPowerUps, newPowerUp]
      }

      // 更新子弹位置
      currentBullets = currentBullets
        .map((bullet) => ({
          ...bullet,
          position: { ...bullet.position, y: bullet.position.y - bullet.speed },
        }))
        .filter((bullet) => bullet.position.y > -bullet.size.height)

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

      // 碰撞检测 - 子弹击中敌机
      const remainingBullets: Bullet[] = []
      const remainingEnemies: Enemy[] = []
      let scoreDelta = 0
      const newExplosions: Explosion[] = []

      // 标记哪些子弹已经被使用
      const bulletUsed = new Set<string>()

      let hasHit = false
      let hasExplosion = false
      
      currentEnemies.forEach((enemy) => {
        let enemyHp = enemy.hp
        let hit = false

        for (const bullet of currentBullets) {
          if (bulletUsed.has(bullet.id)) continue
          
          if (checkCollision(bullet.position, bullet.size, enemy.position, enemy.size)) {
            enemyHp -= bullet.damage
            bulletUsed.add(bullet.id)
            hit = true
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
        } else {
          remainingEnemies.push({ ...enemy, hp: enemyHp })
        }
      })
      
      if (hasHit) {
        onHit?.()
      }
      if (hasExplosion) {
        onExplosion?.()
      }

      // 收集未使用的子弹
      currentBullets.forEach((bullet) => {
        if (!bulletUsed.has(bullet.id)) {
          remainingBullets.push(bullet)
        }
      })

      currentBullets = remainingBullets
      currentEnemies = remainingEnemies

      if (scoreDelta > 0) {
        setScore((s) => s + scoreDelta)
      }
      if (newExplosions.length > 0) {
        currentExplosions = [...currentExplosions, ...newExplosions]
      }

      // 碰撞检测 - 玩家碰到敌机
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

      if (playerHit) {
        onDamage?.()
        setPlayer((prev) => {
          const newHp = prev.hp - 1
          if (newHp <= 0) {
            gameOver()
          }
          return { ...prev, hp: newHp }
        })
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
                return { ...prev, hp: Math.min(prev.hp + 1, prev.maxHp) }
              case 'power':
                return { ...prev }
              case 'shield':
                return { ...prev }
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
  }, [status, keys, score, gameOver])

  return {
    // 游戏状态
    status,
    score,
    gameTime,
    
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
    
    // 按键状态（用于显示）
    keys,
  }
}
