import type { GameStatus, Player } from '../types'
import { formatScore, formatTime } from '../utils'

interface GameUIProps {
  status: GameStatus
  score: number
  gameTime: number
  player: Player
  onStart: () => void
  onPause: () => void
}

export function GameUI({ status, score, gameTime, player, onStart, onPause }: GameUIProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* 顶部状态栏 */}
      <div className="flex items-center justify-between rounded-xl border border-dark-600 bg-dark-800/60 p-3 backdrop-blur">
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="text-slate-400">分数:</span>{' '}
            <span className="font-mono text-lg font-bold text-amber-400">
              {formatScore(score)}
            </span>
          </div>
          <div className="text-sm">
            <span className="text-slate-400">时间:</span>{' '}
            <span className="font-mono text-slate-200">{formatTime(gameTime)}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">HP:</span>
          <div className="flex gap-1">
            {Array.from({ length: player.maxHp }).map((_, i) => (
              <div
                key={i}
                className={`h-4 w-4 rounded-full ${
                  i < player.hp ? 'bg-red-500' : 'bg-dark-600'
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* 护盾显示 */}
        {(player.shield || 0) > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">护盾:</span>
            <div className="flex gap-1">
              {Array.from({ length: player.shield || 0 }).map((_, i) => (
                <div
                  key={i}
                  className="h-4 w-4 rounded-full bg-blue-500 ring-2 ring-blue-300"
                />
              ))}
            </div>
          </div>
        )}
        
        {/* 火力等级显示 */}
        {(player.powerLevel || 0) > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">火力:</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: player.powerLevel || 0 }).map((_, i) => (
                <span key={i} className="text-amber-400">🔥</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 游戏控制按钮 */}
      <div className="flex items-center justify-center gap-3">
        {status === 'idle' && (
          <button
            onClick={onStart}
            className="rounded-xl bg-indigo-600 px-8 py-3 text-lg font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-xl"
          >
            开始游戏
          </button>
        )}
        
        {status === 'playing' && (
          <button
            onClick={onPause}
            className="rounded-xl border border-dark-600 bg-dark-800 px-6 py-2 text-sm font-medium text-slate-100 transition hover:bg-dark-700"
          >
            暂停 (ESC)
          </button>
        )}
        
        {status === 'paused' && (
          <>
            <button
              onClick={onPause}
              className="rounded-xl bg-indigo-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
            >
              继续游戏
            </button>
            <div className="text-slate-400">游戏已暂停</div>
          </>
        )}
        
        {status === 'gameOver' && (
          <>
            <button
              onClick={onStart}
              className="rounded-xl bg-indigo-600 px-8 py-3 text-lg font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-xl"
            >
              再来一局
            </button>
            <div className="text-slate-400">游戏结束</div>
          </>
        )}
      </div>

      {/* 操作说明 */}
      <div className="rounded-xl border border-dark-600/50 bg-dark-800/40 p-4 text-sm text-slate-400">
        <div className="mb-2 font-medium text-slate-300">操作说明:</div>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>↑↓←→ 或 WASD: 移动飞机</div>
          <div>空格键: 发射子弹</div>
          <div>ESC: 暂停游戏</div>
        </div>
        <div className="mb-2 font-medium text-slate-300">道具说明:</div>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
            <span>回血 (+1 HP)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
            <span>火力 (多发子弹)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
            <span>护盾 (抵挡伤害)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
