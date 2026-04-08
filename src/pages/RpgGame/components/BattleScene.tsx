import { useState, useEffect, useRef } from 'react'
import type { BattleState } from '../types'

interface BattleSceneProps {
  battleState: BattleState
  onAction: (action: 'attack' | 'skill' | 'item' | 'flee', skillOrItemId?: string) => void
  onSelectEnemy: (index: number) => void
  animation?: string | null
}

export function BattleScene({ battleState, onAction, onSelectEnemy, animation }: BattleSceneProps) {
  const { player, enemies, currentTurn, selectedEnemyIndex, battleLog, endingCountdown, endingMessage } = battleState
  const [showSkillMenu, setShowSkillMenu] = useState(false)
  const [animatingEnemy, setAnimatingEnemy] = useState<number | null>(null)
  const [countdown, setCountdown] = useState(endingCountdown || 0)
  const logRef = useRef<HTMLDivElement>(null)

  // 战斗日志自动滚动到底部
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [battleLog])

  // 战斗结束倒计时
  useEffect(() => {
    if (endingCountdown) {
      setCountdown(endingCountdown)
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [endingCountdown])

  // 动画效果
  useEffect(() => {
    if (animation) {
      setAnimatingEnemy(selectedEnemyIndex)
      const timer = setTimeout(() => setAnimatingEnemy(null), 500)
      return () => clearTimeout(timer)
    }
  }, [animation, selectedEnemyIndex])

  // 获取职业图标
  const getClassIcon = (className: string) => {
    const icons: Record<string, string> = {
      warrior: '⚔️',
      mage: '🔮',
      rogue: '🗡️',
      paladin: '🛡️',
      ranger: '🏹',
    }
    return icons[className] || '❓'
  }

  // 获取敌人图标
  const getEnemyIcon = (type: string) => {
    const icons: Record<string, string> = {
      humanoid: '👹',
      beast: '🐺',
      undead: '💀',
      elemental: '🔷',
      demon: '👿',
      dragon: '🐉',
    }
    return icons[type] || '👾'
  }

  return (
    <div className="rounded-2xl border border-dark-600 bg-dark-800/50 p-6 shadow-lg backdrop-blur">
      {/* 战斗回合提示 */}
      <div className="mb-4 text-center">
        <span className={`rounded-full px-4 py-1 text-sm font-medium ${
          currentTurn === 'player' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>
          {currentTurn === 'player' ? '你的回合' : '敌人回合'}
        </span>
        <span className="ml-2 text-xs text-slate-500">回合 {battleState.turn}</span>
      </div>

      {/* 敌人区域 */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        {enemies.map((enemy, index) => (
          <button
            key={`${enemy.id}-${index}`}
            onClick={() => currentTurn === 'player' && onSelectEnemy(index)}
            disabled={currentTurn !== 'player'}
            className={`relative rounded-xl border p-4 text-center transition ${
              selectedEnemyIndex === index
                ? 'border-red-500 bg-red-500/10'
                : 'border-dark-600 bg-dark-900/50 hover:bg-dark-700/50'
            } ${enemy.hp <= 0 ? 'opacity-50' : ''} ${animatingEnemy === index ? 'animate-shake' : ''}`}
          >
            {/* Boss标记 */}
            {enemy.isBoss && (
              <div className="absolute -top-2 -right-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 px-2 py-0.5 text-xs font-bold text-white">
                BOSS
              </div>
            )}
            
            <div className="mb-2 text-4xl">{getEnemyIcon(enemy.appearance.type)}</div>
            <div className="font-semibold text-slate-100">{enemy.name}</div>
            <div className="text-xs text-slate-400">Lv.{enemy.level}</div>
            
            {/* HP 条 */}
            <div className="mt-2 h-2 rounded-full bg-dark-700 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all"
                style={{ width: `${Math.max(0, (enemy.hp / enemy.maxHp) * 100)}%` }}
              />
            </div>
            <div className="mt-1 text-xs text-slate-400">
              {Math.max(0, enemy.hp)}/{enemy.maxHp} HP
            </div>
            
            {/* 状态效果 */}
            {enemy.statusEffects.length > 0 && (
              <div className="mt-2 flex justify-center gap-1">
                {enemy.statusEffects.map((effect, i) => (
                  <span key={i} className="text-xs" title={effect.type}>
                    {getStatusIcon(effect.type)}
                  </span>
                ))}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* 玩家状态 */}
      <div className="mb-6 rounded-xl border border-dark-600 bg-dark-900/50 p-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-3xl shadow-lg">
            {getClassIcon(player.class)}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-100">{player.name}</span>
              <span className="text-xs text-slate-400">Lv.{player.level} {getClassName(player.class)}</span>
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
                  style={{ width: `${Math.max(0, (player.hp / player.maxHp) * 100)}%` }}
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
                  style={{ width: `${Math.max(0, (player.mp / player.maxMp) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* 玩家状态效果 */}
        {player.statusEffects.length > 0 && (
          <div className="mt-3 flex gap-2">
            {player.statusEffects.map((effect, i) => (
              <span key={i} className="rounded-full bg-dark-700 px-2 py-0.5 text-xs text-slate-300">
                {getStatusIcon(effect.type)} {effect.type} ({effect.duration}回合)
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 战斗操作 / 结束提示 */}
      {endingCountdown ? (
        <div className="rounded-xl border border-yellow-500/50 bg-yellow-500/10 p-4 text-center">
          <div className="text-lg font-bold text-yellow-400">{endingMessage}</div>
          <div className="mt-1 text-sm text-yellow-400/70">{countdown} 秒后返回...</div>
        </div>
      ) : currentTurn === 'player' && (
        <div className="grid grid-cols-4 gap-3">
          <button
            onClick={() => onAction('attack')}
            className="rounded-xl border border-dark-600 bg-dark-900/50 px-4 py-3 font-medium text-slate-100 transition hover:bg-red-500/20 hover:border-red-500/50"
          >
            ⚔️ 攻击
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowSkillMenu(!showSkillMenu)}
              className="w-full rounded-xl border border-dark-600 bg-dark-900/50 px-4 py-3 font-medium text-slate-100 transition hover:bg-blue-500/20 hover:border-blue-500/50"
            >
              ✨ 技能
            </button>
            {/* 技能菜单 */}
            {showSkillMenu && (
              <div className="absolute bottom-full left-0 mb-2 w-64 rounded-xl border border-dark-600 bg-dark-800 p-2 shadow-xl z-10 max-h-80 overflow-y-auto">
                {player.skills.map((skill) => {
                  const isOnCooldown = skill.currentCooldown > 0
                  const canAfford = player.mp >= skill.mpCost
                  
                  return (
                    <button
                      key={skill.id}
                      onClick={() => {
                        if (!isOnCooldown && canAfford) {
                          onAction('skill', skill.id)
                          setShowSkillMenu(false)
                        }
                      }}
                      disabled={isOnCooldown || !canAfford}
                      className="w-full rounded-lg px-3 py-2 text-left text-sm transition hover:bg-dark-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-slate-200">
                          {skill.icon} {skill.name}
                          {isOnCooldown && (
                            <span className="ml-2 text-xs text-red-400">[冷却 {skill.currentCooldown}]</span>
                          )}
                        </span>
                        <span className={`text-xs ${canAfford ? 'text-blue-400' : 'text-red-400'}`}>
                          {skill.mpCost} MP
                        </span>
                      </div>
                      <div className="text-xs text-slate-400">{skill.description}</div>
                      {skill.cooldown > 0 && (
                        <div className="text-xs text-yellow-500">冷却: {skill.cooldown}回合</div>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
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
      <div ref={logRef} className="mt-6 h-40 overflow-y-auto rounded-xl border border-dark-600 bg-dark-900/30 p-3">
        {battleLog.length === 0 ? (
          <div className="text-sm text-slate-500">战斗开始！</div>
        ) : (
          battleLog.map((log) => (
            <div key={log.id} className={`mb-1 text-sm ${getLogColor(log.type)}`}>
              {log.text}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function getClassName(className: string): string {
  const names: Record<string, string> = {
    warrior: '战士',
    mage: '法师',
    rogue: '盗贼',
    paladin: '圣骑士',
    ranger: '游侠',
  }
  return names[className] || className
}

function getStatusIcon(type: string): string {
  const icons: Record<string, string> = {
    poison: '☠️',
    burn: '🔥',
    freeze: '❄️',
    stun: '💫',
    bleed: '🩸',
    buff_atk: '⚔️',
    buff_def: '🛡️',
    buff_spd: '💨',
    debuff_atk: '🔻',
    debuff_def: '🔻',
    regen: '💚',
    shield: '⭕',
  }
  return icons[type] || '❓'
}

function getLogColor(type: string): string {
  const colors: Record<string, string> = {
    normal: 'text-slate-300',
    damage: 'text-red-400',
    heal: 'text-green-400',
    crit: 'text-yellow-400 font-bold',
    miss: 'text-slate-500',
    buff: 'text-blue-400',
    debuff: 'text-purple-400',
    system: 'text-slate-400 italic',
  }
  return colors[type] || 'text-slate-300'
}
