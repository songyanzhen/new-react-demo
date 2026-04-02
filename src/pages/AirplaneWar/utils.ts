import type { Position, Size } from './types'

// 生成唯一ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

// 检测两个物体是否碰撞（矩形碰撞检测）
export function checkCollision(
  pos1: Position,
  size1: Size,
  pos2: Position,
  size2: Size
): boolean {
  return (
    pos1.x < pos2.x + size2.width &&
    pos1.x + size1.width > pos2.x &&
    pos1.y < pos2.y + size2.height &&
    pos1.y + size1.height > pos2.y
  )
}

// 检测圆形碰撞（用于更精确的碰撞检测）
export function checkCircleCollision(
  pos1: Position,
  radius1: number,
  pos2: Position,
  radius2: number
): boolean {
  const dx = pos1.x - pos2.x
  const dy = pos1.y - pos2.y
  const distance = Math.sqrt(dx * dx + dy * dy)
  return distance < radius1 + radius2
}

// 限制值在范围内
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

// 随机范围
export function randomRange(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

// 随机整数
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// 根据时间格式化分数显示
export function formatScore(score: number): string {
  return score.toString().padStart(6, '0')
}

// 根据毫秒格式化时间显示
export function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}
