import { useEffect, useState } from 'react'
import { formatScore, formatTime } from '../utils'

interface GameOverScreenProps {
  score: number
  gameTime: number
  onRestart: () => void
}

export function GameOverScreen({ score, gameTime, onRestart }: GameOverScreenProps) {
  const [showContent, setShowContent] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])

  useEffect(() => {
    // 延迟显示内容，先展示爆炸动画
    const timer = setTimeout(() => setShowContent(true), 500)
    
    // 生成粒子
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: 50 + Math.random() * 40 - 20, // 中心区域
      y: 50 + Math.random() * 40 - 20,
      delay: Math.random() * 0.5,
    }))
    setParticles(newParticles)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      {/* 暗色背景遮罩 */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-500" />
      
      {/* 爆炸粒子效果 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute w-2 h-2 rounded-full animate-ping"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              backgroundColor: ['#ef4444', '#f59e0b', '#fbbf24', '#f87171'][p.id % 4],
              animationDelay: `${p.delay}s`,
              animationDuration: '1s',
            }}
          />
        ))}
      </div>

      {/* 主要内容 */}
      {showContent && (
        <div className="relative z-10 mx-4 w-full max-w-sm animate-in zoom-in-95 fade-in duration-500">
          {/* 卡片容器 */}
          <div className="relative overflow-hidden rounded-2xl border border-red-900/50 bg-gradient-to-b from-red-950/90 to-dark-900/95 p-8 shadow-2xl">
            {/* 背景光效 */}
            <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-red-500/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-orange-500/10 blur-3xl" />
            
            {/* 失败图标 */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="flex h-20 w-20 animate-bounce items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-700 shadow-lg shadow-red-500/30">
                  <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                {/* 脉冲光环 */}
                <div className="absolute inset-0 rounded-full bg-red-500/30 animate-ping" style={{ animationDuration: '2s' }} />
              </div>
            </div>

            {/* 失败文案 */}
            <h2 className="mb-2 text-center text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-red-400 animate-pulse">
              任务失败
            </h2>
            <p className="mb-6 text-center text-sm text-red-300/80">
              战机已被击落，请重新挑战
            </p>

            {/* 数据统计 */}
            <div className="mb-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-dark-800/60 p-4 text-center border border-red-900/30">
                <div className="mb-1 text-xs text-slate-400">最终得分</div>
                <div className="font-mono text-2xl font-bold text-amber-400">{formatScore(score)}</div>
              </div>
              <div className="rounded-xl bg-dark-800/60 p-4 text-center border border-red-900/30">
                <div className="mb-1 text-xs text-slate-400">生存时间</div>
                <div className="font-mono text-2xl font-bold text-blue-400">{formatTime(gameTime)}</div>
              </div>
            </div>

            {/* 重试按钮 */}
            <button
              onClick={onRestart}
              className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] hover:shadow-indigo-500/40 active:scale-[0.98]"
            >
              {/* 按钮光效 */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              
              <span className="relative flex items-center justify-center gap-2">
                <svg className="h-5 w-5 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                再来一局
              </span>
            </button>

            {/* 提示文字 */}
            <p className="mt-4 text-center text-xs text-slate-500">
              按 Enter 键快速重新开始
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
