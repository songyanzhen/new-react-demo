import { useRef, useEffect, useState, useCallback } from 'react'
import type { Player, Bullet, Enemy, PowerUp, Explosion } from '../types'
import { PlayerPlane, EnemyPlane, BulletSvg, PowerUpItem, ExplosionEffect, StarBackground } from './'

interface GameCanvasProps {
  width: number
  height: number
  player: Player
  bullets: Bullet[]
  enemies: Enemy[]
  powerUps: PowerUp[]
  explosions: Explosion[]
  isPlaying: boolean
}

export function GameCanvas({
  width,
  height,
  player,
  bullets,
  enemies,
  powerUps,
  explosions,
  isPlaying,
}: GameCanvasProps) {
  const animationRef = useRef<number>()
  const [starOffset, setStarOffset] = useState(0)
  const [engineFrame, setEngineFrame] = useState(0)

  // 动画循环 - 驱动背景滚动和引擎动画
  const animate = useCallback(() => {
    if (isPlaying) {
      setStarOffset((prev) => (prev + 1) % height)
      setEngineFrame((prev) => prev + 1)
    }
    animationRef.current = requestAnimationFrame(animate)
  }, [isPlaying, height])

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [animate])

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="rounded-xl border border-dark-600 bg-dark-900"
      style={{ display: 'block' }}
    >
      {/* 星空背景 */}
      <StarBackground width={width} height={height} offset={starOffset} />

      {/* 爆炸效果 */}
      {explosions.map((explosion) => {
        const progress = 1 - explosion.duration / explosion.maxDuration
        return (
          <ExplosionEffect
            key={explosion.id}
            x={explosion.position.x}
            y={explosion.position.y}
            size={explosion.size.width}
            progress={progress}
          />
        )
      })}

      {/* 道具 */}
      {powerUps.map((powerUp) => (
        <PowerUpItem
          key={powerUp.id}
          x={powerUp.position.x}
          y={powerUp.position.y}
          size={powerUp.size.width}
          type={powerUp.type}
        />
      ))}

      {/* 子弹 */}
      {bullets.map((bullet) => (
        <BulletSvg
          key={bullet.id}
          x={bullet.position.x}
          y={bullet.position.y}
          width={bullet.size.width}
          height={bullet.size.height}
          isPlayerBullet={bullet.isPlayerBullet}
        />
      ))}

      {/* 敌机 */}
      {enemies.map((enemy) => (
        <EnemyPlane
          key={enemy.id}
          x={enemy.position.x}
          y={enemy.position.y}
          width={enemy.size.width}
          height={enemy.size.height}
          type={enemy.type}
          hp={enemy.hp}
          maxHp={enemy.maxHp}
        />
      ))}

      {/* 玩家飞机 */}
      {player.hp > 0 && (
        <PlayerPlane
          x={player.position.x}
          y={player.position.y}
          width={player.size.width}
          height={player.size.height}
          engineFrame={engineFrame}
        />
      )}
    </svg>
  )
}
