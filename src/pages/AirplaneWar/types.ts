// 游戏状态
export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameOver'

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
