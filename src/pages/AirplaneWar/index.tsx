import { useEffect } from 'react'
import { useGame } from './hooks/useGame'
import { useAudio } from './hooks/useAudio'
import { GameCanvas, GameUI, AudioControl, GameOverScreen } from './components'

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
  } = useAudio()

  const {
    status,
    score,
    gameTime,
    player,
    bullets,
    enemies,
    powerUps,
    explosions,
    canvasWidth,
    canvasHeight,
    startGame,
    togglePause,
  } = useGame({
    onShoot: playShoot,
    onHit: playHit,
    onExplosion: playExplosion,
    onPowerUp: playPowerUp,
    onDamage: playDamage,
    onGameStart: playGameStart,
    onGameOver: playGameOver,
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
              powerUps={powerUps}
              explosions={explosions}
              isPlaying={status === 'playing'}
            />
            
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
