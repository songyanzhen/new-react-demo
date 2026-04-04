import { useEffect, useState } from 'react'
import type { BossType } from '../types'
import { BOSS_CONFIGS } from '../data/bosses'

interface BossWarningProps {
  bossType: BossType
  onComplete: () => void
}

export function BossWarning({ bossType, onComplete }: BossWarningProps) {
  const [countdown, setCountdown] = useState(3)
  const config = BOSS_CONFIGS[bossType]
  
  console.log(`[BossWarning] Rendering warning for: ${bossType}`)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      onComplete()
    }
  }, [countdown, onComplete])

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80">
      {/* 警告闪烁背景 */}
      <div className="absolute inset-0 animate-pulse bg-red-900/20" />
      
      {/* 警告标志 */}
      <div className="relative text-center">
        {/* 警告图标 */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="flex h-24 w-24 animate-ping items-center justify-center rounded-full bg-red-500/30">
              <svg className="h-16 w-16 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="absolute inset-0 flex animate-pulse items-center justify-center">
              <svg className="h-16 w-16 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* 警告文字 */}
        <h2 className="mb-2 text-4xl font-black tracking-widest text-red-500 animate-pulse">
          WARNING
        </h2>
        <p className="mb-4 text-xl text-red-300">
          BOSS 接近中
        </p>

        {/* Boss信息 */}
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-950/50 px-8 py-4">
          <h3 className="mb-2 text-2xl font-bold" style={{ color: config.colors.light }}>
            {config.name}
          </h3>
          <p className="text-sm text-slate-300">{config.description}</p>
          <div className="mt-3 flex justify-center gap-4 text-xs text-slate-400">
            <span>HP: {config.hp}</span>
            <span>速度: {config.speed}</span>
            <span>奖励: {config.scoreReward}分</span>
          </div>
        </div>

        {/* 倒计时 */}
        <div className="text-6xl font-black text-white">
          {countdown > 0 ? countdown : 'GO!'}
        </div>
      </div>
    </div>
  )
}
