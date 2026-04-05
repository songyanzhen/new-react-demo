import type { BattleState } from '../types'

interface BattleSceneProps {
  battleState: BattleState
  onAction: (action: 'attack' | 'skill' | 'item' | 'flee', skillOrItemId?: string) => void
  onSelectEnemy: (index: number) => void
}

export function BattleScene({ battleState, onAction, onSelectEnemy }: BattleSceneProps) {
  const { player, enemies, currentTurn, selectedEnemyIndex, battleLog } = battleState

  return (
    <div className="rounded-2xl border border-dark-600 bg-dark-800/50 p-6 shadow-lg backdrop-blur">
      {/* 战斗回合提示 */}
      <div className="mb-4 text-center">
        <span className={`rounded-full px-4 py-1 text-sm font-medium ${
          currentTurn === 'player' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>
          {currentTurn === 'player' ? '你的回合' : '敌人回合'}
        </span>
      </div>

      {/* 敌人区域 */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        {enemies.map((enemy, index) => (
          <button
            key={`${enemy.id}-${index}`}
            onClick={() => currentTurn === 'player' && onSelectEnemy(index)}
            disabled={currentTurn !== 'player'}
            className={`rounded-xl border p-4 text-center transition ${
              selectedEnemyIndex === index
                ? 'border-red-500 bg-red-500/10'
                : 'border-dark-600 bg-dark-900/50 hover:bg-dark-700/50'
            } ${enemy.hp <= 0 ? 'opacity-50' : ''}`}
          >
            <div className="mb-2 text-3xl">👹</div>
            <div className="font-semibold text-slate-100">{enemy.name}</div>
            <div className="text-xs text-slate-400">Lv.{enemy.level}</div>
            
            {/* HP 条 */}
            <div className="mt-2 h-2 rounded-full bg-dark-700 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all"
                style={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }}
              />
            </div>
            <div className="mt-1 text-xs text-slate-400">
              {enemy.hp}/{enemy.maxHp} HP
            </div>
          </button>
        ))}
      </div>

      {/* 玩家状态 */}
      <div className="mb-6 rounded-xl border border-dark-600 bg-dark-900/50 p-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-2xl">
            🧙‍♂️
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-100">{player.name}</span>
              <span className="text-xs text-slate-400">Lv.{player.level}</span>
            </div>
            
            {/* HP 条 */}
            <div className="mt-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>HP</span>
                <span>{player.hp}/{player.maxHp}</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-dark-700 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                  style={{ width: `${(player.hp / player.maxHp) * 100}%` }}
                />
              </div>
            </div>
            
            {/* MP 条 */}
            <div className="mt-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>MP</span>
                <span>{player.mp}/{player.maxMp}</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-dark-700 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all"
                  style={{ width: `${(player.mp / player.maxMp) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 战斗操作 */}
      {currentTurn === 'player' && (
        <div className="grid grid-cols-4 gap-3">
          <button
            onClick={() => onAction('attack')}
            className="rounded-xl border border-dark-600 bg-dark-900/50 px-4 py-3 font-medium text-slate-100 transition hover:bg-red-500/20 hover:border-red-500/50"
          >
            ⚔️ 攻击
          </button>
          
          <div className="relative group">
            <button className="w-full rounded-xl border border-dark-600 bg-dark-900/50 px-4 py-3 font-medium text-slate-100 transition hover:bg-blue-500/20 hover:border-blue-500/50">
              ✨ 技能
            </button>
            {/* 技能菜单 */}
            <div className="absolute bottom-full left-0 mb-2 hidden w-48 rounded-xl border border-dark-600 bg-dark-800 p-2 shadow-xl group-hover:block">
              {player.skills.map((skill) => (
                <button
                  key={skill.id}
                  onClick={() => onAction('skill', skill.id)}
                  disabled={player.mp < skill.mpCost}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm transition hover:bg-dark-700 disabled:opacity-50"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-slate-200">{skill.name}</span>
                    <span className="text-xs text-blue-400">{skill.mpCost} MP</span>
                  </div>
                  <div className="text-xs text-slate-400">{skill.description}</div>
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={() => onAction('flee')}
            className="rounded-xl border border-dark-600 bg-dark-900/50 px-4 py-3 font-medium text-slate-100 transition hover:bg-yellow-500/20 hover:border-yellow-500/50"
          >
            🏃 逃跑
          </button>
        </div>
      )}

      {/* 战斗日志 */}
      <div className="mt-6 h-32 overflow-y-auto rounded-xl border border-dark-600 bg-dark-900/30 p-3">
        {battleLog.map((log, index) => (
          <div key={index} className="mb-1 text-sm text-slate-300">
            {log}
          </div>
        ))}
      </div>
    </div>
  )
}
