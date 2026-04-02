import { useState, useCallback, useEffect } from 'react'
import { soundEffects } from '../audio/soundEffects'

export function useAudio() {
  const [enabled, setEnabled] = useState(() => {
    // 从 localStorage 读取设置
    const saved = localStorage.getItem('airplane-war-audio-enabled')
    return saved !== null ? saved === 'true' : true
  })
  
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('airplane-war-audio-volume')
    return saved !== null ? parseFloat(saved) : 0.3
  })

  // 同步到 soundEffects
  useEffect(() => {
    soundEffects.setEnabled(enabled)
    localStorage.setItem('airplane-war-audio-enabled', enabled.toString())
  }, [enabled])

  useEffect(() => {
    soundEffects.setVolume(volume)
    localStorage.setItem('airplane-war-audio-volume', volume.toString())
  }, [volume])

  const toggleEnabled = useCallback(() => {
    setEnabled((prev) => !prev)
  }, [])

  const playShoot = useCallback(() => {
    soundEffects.playShoot()
  }, [])

  const playHit = useCallback(() => {
    soundEffects.playHit()
  }, [])

  const playExplosion = useCallback(() => {
    soundEffects.playExplosion()
  }, [])

  const playPowerUp = useCallback(() => {
    soundEffects.playPowerUp()
  }, [])

  const playDamage = useCallback(() => {
    soundEffects.playDamage()
  }, [])

  const playGameStart = useCallback(() => {
    soundEffects.playGameStart()
  }, [])

  const playGameOver = useCallback(() => {
    soundEffects.playGameOver()
  }, [])

  return {
    enabled,
    volume,
    setVolume,
    toggleEnabled,
    playShoot,
    playHit,
    playExplosion,
    playPowerUp,
    playDamage,
    playGameStart,
    playGameOver,
  }
}
