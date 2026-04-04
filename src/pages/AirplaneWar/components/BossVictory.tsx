import { useEffect, useState } from 'react'
import type { BossType } from '../types'
import { BOSS_CONFIGS } from '../data/bosses'

interface BossVictoryProps {
  bossType: BossType
  scoreReward: number
  onComplete: () => void
}

export function BossVictory({ bossType, scoreReward, onComplete }: BossVictoryProps) {
  const [showContent, setShowContent] = useState(false)
  const config = BOSS_CONFIGS[bossType]

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300)
    const completeTimer = setTimeout(() => onComplete(), 3000)
    return () => {
      clearTimeout(timer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70">
      {/* 胜利光效 */}
      <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/10 via-transparent to-yellow-500/10 animate-pulse" />
      
      {/* 彩带效果 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 0.5}s`,
              animationDuration: `${0.5 + Math.random() * 0.5}s`,
            }}
          >
            {['✨', '🎉', '⭐', '🌟', '💫'][i % 5]}
          </div>
        ))}
      </div>

      {showContent && (
        <div className="relative text-center animate-in zoom-in-95 fade-in duration-500">
          {/* 胜利图标 */}
          <div className="mb-4 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 shadow-lg shadow-yellow-500/50 animate-bounce">
              <svg className="h-12 w-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* 胜利文字 */}
          <h2 className="mb-2 text-4xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300">
            BOSS 击破！
          </h2>
          
          {/* 击败的Boss */}
          <p className="mb-4 text-xl" style={{ color: config.colors.light }}>
            {config.name} 已被击败
          </p>

          {/* 奖励 */}
          <div className="rounded-xl border border-yellow-500/30 bg-gradient-to-b from-yellow-900/50 to-amber-950/50 px-8 py-4">
            <p className="mb-2 text-sm text-yellow-300">获得奖励</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl font-black text-yellow-400">+{scoreReward}</span>
              <span className="text-yellow-300">分</span>
            </div>
            <p className="mt-2 text-xs text-slate-400">游戏继续...</p>
          </div>
        </div>
      )}
    </div>
  )
}
