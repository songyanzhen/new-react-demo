import { useRpgGame } from './hooks/useRpgGame'
import { CharacterCreate } from './components/CharacterCreate'
import { BattleScene } from './components/BattleScene'
import { ExploreScene } from './components/ExploreScene'

export { RpgGame }

function RpgGame() {
  const {
    gamePhase,
    player,
    battleState,
    inventory,
    gameLog,
    currentFloor,
    startGame,
    encounterEnemy,
    playerAction,
    selectEnemy,
    nextFloor,
    useItem,
  } = useRpgGame()

  return (
    <main className="px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-5xl">
        {/* 标题 */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
            🗡️ RPG 地牢探险
          </h1>
          <p className="mt-2 text-slate-400">创建角色，探索地牢，击败怪物！</p>
        </header>

        {/* 游戏内容 */}
        <div className="mx-auto max-w-4xl">
          {!player ? (
            <CharacterCreate onCreate={startGame} />
          ) : gamePhase === 'battle' && battleState ? (
            <BattleScene
              battleState={battleState}
              onAction={playerAction}
              onSelectEnemy={selectEnemy}
            />
          ) : gamePhase === 'gameOver' ? (
            <div className="rounded-2xl border border-red-500/50 bg-red-500/10 p-8 text-center">
              <div className="mb-4 text-6xl">💀</div>
              <h2 className="mb-2 text-2xl font-bold text-red-400">游戏结束</h2>
              <p className="mb-6 text-slate-400">你在第 {currentFloor} 层倒下了...</p>
              <button
                onClick={() => window.location.reload()}
                className="rounded-xl bg-gradient-to-r from-red-500 to-orange-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:shadow-xl"
              >
                重新开始
              </button>
            </div>
          ) : (
            <ExploreScene
              player={player}
              inventory={inventory}
              currentFloor={currentFloor}
              gameLog={gameLog}
              onEncounter={encounterEnemy}
              onNextFloor={nextFloor}
              onUseItem={useItem}
            />
          )}
        </div>

        {/* 操作说明 */}
        <div className="mx-auto mt-10 max-w-4xl rounded-2xl border border-dark-600 bg-dark-800/30 p-5">
          <h3 className="mb-3 font-semibold text-slate-200">🎮 游戏说明</h3>
          <div className="grid grid-cols-1 gap-2 text-sm text-slate-400 sm:grid-cols-2">
            <div>• 选择职业：战士（高防）、法师（高攻）、盗贼（高速）</div>
            <div>• 探索：寻找敌人战斗获得经验和金币</div>
            <div>• 战斗：点击敌人选择目标，使用技能消耗 MP</div>
            <div>• 升级：提升等级可增加属性和 HP/MP</div>
            <div>• 下一层：进入更深的地牢，敌人会更强</div>
            <div>• 逃跑：战斗中可以尝试逃跑（50%成功率）</div>
          </div>
        </div>
      </div>
    </main>
  )
}
