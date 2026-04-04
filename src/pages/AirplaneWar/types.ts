// 游戏状态
export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameOver' | 'bossWarning' | 'bossBattle' | 'bossExploding' | 'bossVictory' | 'playerExploding'

// 位置
export interface Position {
  x: number
  y: number
}

// 大小
export interface Size {
  width: number
  height: number
}

// 玩家飞机
export interface Player {
  position: Position
  size: Size
  speed: number
  hp: number
  maxHp: number
  powerLevel?: number
  shield?: number // 护盾值
}

// 子弹
export interface Bullet {
  id: string
  position: Position
  size: Size
  speed: number
  damage: number
  isPlayerBullet: boolean
}

// 敌机
export interface Enemy {
  id: string
  position: Position
  size: Size
  speed: number
  hp: number
  maxHp: number
  score: number
  type: 'normal' | 'fast' | 'tank'
}

// Boss类型
export type BossType = 'destroyer' | 'phantom' | 'mothership' | 'overlord' | 'nova' | 'titan'

// Boss
export interface Boss {
  id: string
  position: Position
  size: Size
  speed: number
  hp: number
  maxHp: number
  type: BossType
  phase: number // 阶段（血量降低后可能变强）
  lastShotTime: number
  attackPattern: number // 攻击模式
  scoreReward: number
}

// 道具
export interface PowerUp {
  id: string
  position: Position
  size: Size
  speed: number
  type: 'heal' | 'power' | 'shield'
}

// 爆炸效果
export interface Explosion {
  id: string
  position: Position
  size: Size
  duration: number
  maxDuration: number
}

// 游戏配置
export interface GameConfig {
  canvasWidth: number
  canvasHeight: number
  playerSpeed: number
  bulletSpeed: number
  enemySpawnInterval: number
  powerUpSpawnInterval: number
}

// 键盘状态
export interface KeyState {
  ArrowUp: boolean
  ArrowDown: boolean
  ArrowLeft: boolean
  ArrowRight: boolean
  KeyW: boolean
  KeyS: boolean
  KeyA: boolean
  KeyD: boolean
  Space: boolean
}

// Boss配置
export interface BossConfig {
  name: string
  description: string
  size: Size
  hp: number
  speed: number
  scoreReward: number
  colors: {
    main: string
    dark: string
    light: string
  }
}
