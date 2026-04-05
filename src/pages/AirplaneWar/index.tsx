import { useEffect } from 'react'
import { useGame } from './hooks/useGame'
import { useAudio } from './hooks/useAudio'
import { GameCanvas, GameUI, AudioControl, GameOverScreen, BossWarning, BossVictory, PlaneExplosion } from './components'
import { getDifficultyDescription, getDifficultyColor } from './data/difficulty'

export { AirplaneWar }

function AirplaneWar() {
  const {
    enabled: audioEnabled,
    volume,
    setVolume,
    toggleEnabled: toggleAudio,
    playShoot,
    playHit,
    playExplosion,
    playPowerUp,
    playDamage,
    playGameStart,
    playGameOver,
    playBossVictory,
    playBossWarning,
    playPlaneExplosion,
  } = useAudio()

  const {
    status,
    score,
    gameTime,
    player,
    bullets,
    enemies,
    boss,
    powerUps,
    explosions,
    pendingBossType,
    scoreSinceLastBoss,
    canvasWidth,
    canvasHeight,
    startGame,
    togglePause,
    startBossBattle,
  } = useGame({
    onShoot: playShoot,
    onHit: playHit,
    onExplosion: playExplosion,
    onPowerUp: playPowerUp,
    onDamage: playDamage,
    onGameStart: playGameStart,
    onGameOver: playGameOver,
    onBossVictory: playBossVictory,
  })

  // 监听 Enter 键重新开始
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Enter' && status === 'gameOver') {
        startGame()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [status, startGame])

  // Boss警告时播放音效
  useEffect(() => {
    if (status === 'bossWarning') {
      playBossWarning()
    }
  }, [status, playBossWarning])

  // Boss爆炸时播放音效
  useEffect(() => {
    if (status === 'bossExploding') {
      playPlaneExplosion()
    }
  }, [status, playPlaneExplosion])

  // 玩家爆炸时播放音效
  useEffect(() => {
    if (status === 'playerExploding') {
      playPlaneExplosion()
    }
  }, [status, playPlaneExplosion])

  // 计算距离下一个Boss的进度（每300分触发）
  const bossProgress = Math.min(100, (scoreSinceLastBoss / 300) * 100)
  
  // 获取当前难度信息
  const difficultyDesc = getDifficultyDescription(score)
  const difficultyColor = getDifficultyColor(score)

  return (
    <main className="px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-2xl">
        {/* 标题 */}
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
            飞机大战
          </h1>
          <p className="mt-2 text-slate-400">驾驶战机，击落敌机，生存下去！</p>
        </header>

        {/* Boss进度条和难度显示 */}
        {(status === 'playing' || status === 'bossBattle') && (
          <div className="mb-4">
            {/* 难度徽章 */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${difficultyColor}`}>
                  {difficultyDesc}
                </span>
                <span className="text-xs text-slate-500">难度随分数提升</span>
              </div>
              <span className="text-xs text-slate-400">{scoreSinceLastBoss}/300 分</span>
            </div>
            <div className="h-2 rounded-full bg-dark-700 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300"
                style={{ width: `${bossProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* 游戏区域 */}
        <div className="relative flex flex-col items-center gap-4">
          {/* 游戏画布容器 */}
          <div className="relative">
            <GameCanvas
              width={canvasWidth}
              height={canvasHeight}
              player={player}
              bullets={bullets}
              enemies={enemies}
              boss={boss}
              powerUps={powerUps}
              explosions={explosions}
              isPlaying={status === 'playing' || status === 'bossBattle'}
            />
            
            {/* Boss爆炸动画 */}
            {status === 'bossExploding' && boss && (
              <svg
                className="absolute inset-0 pointer-events-none"
                width={canvasWidth}
                height={canvasHeight}
                viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
              >
                <PlaneExplosion
                  x={boss.position.x}
                  y={boss.position.y}
                  width={boss.size.width}
                  height={boss.size.height}
                  color={boss.hp <= 0 ? '#ef4444' : '#f59e0b'}
                  isBoss={true}
                />
              </svg>
            )}

            {/* 玩家爆炸动画 */}
            {status === 'playerExploding' && (
              <svg
                className="absolute inset-0 pointer-events-none"
                width={canvasWidth}
                height={canvasHeight}
                viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
              >
                <PlaneExplosion
                  x={player.position.x}
                  y={player.position.y}
                  width={player.size.width}
                  height={player.size.height}
                  color="#3b82f6"
                  isBoss={false}
                />
              </svg>
            )}

            {/* Boss警告界面 */}
            {status === 'bossWarning' && pendingBossType && (
              <BossWarning 
                bossType={pendingBossType} 
                onComplete={startBossBattle}
              />
            )}

            {/* Boss胜利界面 */}
            {status === 'bossVictory' && boss && (
              <BossVictory
                bossType={boss.type}
                scoreReward={boss.scoreReward}
                onComplete={() => {}}
              />
            )}
            
            {/* 游戏结束覆盖层 */}
            {status === 'gameOver' && (
              <GameOverScreen
                score={score}
                gameTime={gameTime}
                onRestart={startGame}
              />
            )}
          </div>

          {/* 游戏 UI */}
          <GameUI
            status={status}
            score={score}
            gameTime={gameTime}
            player={player}
            onStart={startGame}
            onPause={togglePause}
          />

          {/* 音效控制 */}
          <AudioControl
            enabled={audioEnabled}
            volume={volume}
            onToggle={toggleAudio}
            onVolumeChange={setVolume}
          />
        </div>
      </div>
    </main>
  )
}
