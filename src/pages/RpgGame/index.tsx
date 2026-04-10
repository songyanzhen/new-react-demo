import { useEffect } from 'react'
import { useRpgGame } from './hooks/useRpgGame'
import { CharacterCreate } from './components/CharacterCreate'
import { BattleScene } from './components/BattleScene'
import { ExploreScene } from './components/ExploreScene'
import { CheatPanel } from './components/CheatPanel'
import { EventScene } from './components/EventScene'


export { RpgGame }

function RpgGame() {
  const {
    gamePhase,
    player,
    battleState,
    inventory,
    gameLog,
    currentFloor,
    floorExploreCount,
    exploreScene,
    cheatMode,
    battleAnimation,
    startGame,
    encounterEnemy,
    playerAction,
    selectEnemy,
    nextFloor,
    useItem,
    buyItem,
    restAtCamp,
    upgradeEquipment,
    equipItem,
    unequipItem,
    learnSkill,
    setExploreView,
    handleTitleClick,
    toggleCheatOption,
    currentEvent,
    handleEventOption,
    collectTreasure,
    cheatGetArtifact,
    cheatGetHiddenSkill,
    cheatGetStatBoost,
    cheatLevelUp,
    cheatAddGold,
  } = useRpgGame()

  // 键盘监听（作弊模式快捷键）
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (cheatMode.enabled) {
        switch (e.key.toLowerCase()) {
          case 'g':
            toggleCheatOption('godMode')
            break
          case 'k':
            toggleCheatOption('oneHitKill')
            break
          case 'm':
            toggleCheatOption('infiniteMP')
            break
          case 'd':
            toggleCheatOption('maxDropRate')
            break
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [cheatMode.enabled, toggleCheatOption])

  return (
    <main className="px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-5xl">
        {/* 标题 - 点击5次激活作弊模式 */}
        <header className="mb-8 text-center">
          <h1 
            className="text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl cursor-pointer select-none"
            onClick={handleTitleClick}
            title="点击5次激活彩蛋"
          >
            {cheatMode.enabled ? '🎮 RPG 地牢探险 [作弊模式]' : '🗡️ RPG 地牢探险'}
          </h1>
          <p className="mt-2 text-slate-400">
            {cheatMode.enabled 
              ? '作弊模式已激活！按 G/K/M/D 切换选项' 
              : '创建角色，探索地牢，回合制战斗！'}
          </p>
        </header>

        {/* 作弊面板 */}
        {cheatMode.enabled && (
          <CheatPanel 
            cheatMode={cheatMode} 
            onToggle={toggleCheatOption}
            onGetArtifact={cheatGetArtifact}
            onGetHiddenSkill={cheatGetHiddenSkill}
            onGetStatBoost={cheatGetStatBoost}
            onLevelUp={cheatLevelUp}
            onAddGold={cheatAddGold}
          />
        )}

        {/* 游戏内容 */}
        <div className="mx-auto max-w-4xl">
          {!player ? (
            <CharacterCreate onCreate={startGame} />
          ) : gamePhase === 'battle' && battleState ? (
            <BattleScene
              battleState={battleState}
              onAction={playerAction}
              onSelectEnemy={selectEnemy}
              animation={battleAnimation}
            />
          ) : gamePhase === 'event' && currentEvent ? (
            <EventScene
              event={currentEvent}
              onOptionSelect={handleEventOption}
              onCollectTreasure={collectTreasure}
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
              floorExploreCount={floorExploreCount}
              exploreScene={exploreScene}
              onEncounter={encounterEnemy}
              onNextFloor={nextFloor}
              onUseItem={useItem}
              onBuyItem={buyItem}
              onRest={restAtCamp}
              onUpgrade={upgradeEquipment}
              onEquip={equipItem}
              onUnequip={unequipItem}
              onLearnSkill={learnSkill}
              onSetScene={setExploreView}
            />
          )}
        </div>

        {/* 操作说明 */}
        <div className="mx-auto mt-10 max-w-4xl rounded-2xl border border-dark-600 bg-dark-800/30 p-5">
          <h3 className="mb-3 font-semibold text-slate-200">🎮 游戏说明</h3>
          <div className="grid grid-cols-1 gap-2 text-sm text-slate-400 sm:grid-cols-2">
            <div>• 职业：战士(高防)、法师(高攻)、盗贼(高速)、圣骑士(坦克)、游侠(远程)</div>
            <div>• 属性：力量/智力/敏捷/体质/灵巧/幸运影响不同能力</div>
            <div>• 技能：攻击、增益、减益、治疗、群攻等多种类型</div>
            <div>• 状态：中毒/灼烧/冰冻/眩晕/流血/再生等</div>
            <div>• 探索：每层最多探索5次，包含战斗、事件、宝藏等随机遭遇</div>
            <div>• Boss：第5/10/15/20层有强力Boss，击败后可继续深入</div>
            <div>• 彩蛋：连续点击标题5次激活作弊模式</div>
          </div>
        </div>
      </div>
    </main>
  )
}
