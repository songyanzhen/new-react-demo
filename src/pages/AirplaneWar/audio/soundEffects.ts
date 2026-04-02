// 音效生成器 - 使用 Web Audio API

class SoundGenerator {
  private audioContext: AudioContext | null = null
  private masterGain: GainNode | null = null
  private enabled = true
  private volume = 0.3

  constructor() {
    // 延迟初始化，等待用户交互
  }

  private init() {
    if (this.audioContext) return
    
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.masterGain = this.audioContext.createGain()
      this.masterGain.gain.value = this.volume
      this.masterGain.connect(this.audioContext.destination)
    } catch (e) {
      console.warn('Web Audio API not supported')
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume))
    if (this.masterGain) {
      this.masterGain.gain.value = this.volume
    }
  }

  // 开火音效 - 高频短促的咻声
  playShoot() {
    if (!this.enabled) return
    this.init()
    if (!this.audioContext || !this.masterGain) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.type = 'square'
    oscillator.frequency.setValueAtTime(880, this.audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(110, this.audioContext.currentTime + 0.1)

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1)

    oscillator.connect(gainNode)
    gainNode.connect(this.masterGain)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + 0.1)
  }

  // 击中音效 - 短促的砰声
  playHit() {
    if (!this.enabled) return
    this.init()
    if (!this.audioContext || !this.masterGain) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.type = 'sawtooth'
    oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.08)

    gainNode.gain.setValueAtTime(0.4, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.08)

    oscillator.connect(gainNode)
    gainNode.connect(this.masterGain)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + 0.08)
  }

  // 击落/爆炸音效 - 低沉的爆炸声
  playExplosion() {
    if (!this.enabled) return
    this.init()
    if (!this.audioContext || !this.masterGain) return

    // 使用噪声缓冲区创建爆炸声
    const bufferSize = this.audioContext.sampleRate * 0.3
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2)
    }

    const noise = this.audioContext.createBufferSource()
    noise.buffer = buffer

    const gainNode = this.audioContext.createGain()
    gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3)

    // 低通滤波器让声音更沉闷
    const filter = this.audioContext.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(1000, this.audioContext.currentTime)
    filter.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.3)

    noise.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(this.masterGain)

    noise.start(this.audioContext.currentTime)
  }

  // 拾取道具音效 - 清脆的叮声
  playPowerUp() {
    if (!this.enabled) return
    this.init()
    if (!this.audioContext || !this.masterGain) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime) // C5
    oscillator.frequency.setValueAtTime(659.25, this.audioContext.currentTime + 0.05) // E5
    oscillator.frequency.setValueAtTime(783.99, this.audioContext.currentTime + 0.1) // G5

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3)

    oscillator.connect(gainNode)
    gainNode.connect(this.masterGain)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + 0.3)
  }

  // 玩家受伤音效
  playDamage() {
    if (!this.enabled) return
    this.init()
    if (!this.audioContext || !this.masterGain) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.type = 'sawtooth'
    oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime)
    oscillator.frequency.linearRampToValueAtTime(80, this.audioContext.currentTime + 0.2)

    gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2)

    oscillator.connect(gainNode)
    gainNode.connect(this.masterGain)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + 0.2)
  }

  // 游戏开始音效
  playGameStart() {
    if (!this.enabled) return
    this.init()
    if (!this.audioContext || !this.masterGain) return

    const notes = [440, 554, 659, 880] // A4, C#5, E5, A5
    notes.forEach((freq, i) => {
      const oscillator = this.audioContext!.createOscillator()
      const gainNode = this.audioContext!.createGain()

      oscillator.type = 'square'
      oscillator.frequency.setValueAtTime(freq, this.audioContext!.currentTime + i * 0.1)

      gainNode.gain.setValueAtTime(0, this.audioContext!.currentTime + i * 0.1)
      gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext!.currentTime + i * 0.1 + 0.05)
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext!.currentTime + i * 0.1 + 0.3)

      oscillator.connect(gainNode)
      gainNode.connect(this.masterGain!)

      oscillator.start(this.audioContext!.currentTime + i * 0.1)
      oscillator.stop(this.audioContext!.currentTime + i * 0.1 + 0.3)
    })
  }

  // 游戏结束音效
  playGameOver() {
    if (!this.enabled) return
    this.init()
    if (!this.audioContext || !this.masterGain) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.type = 'sawtooth'
    oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(55, this.audioContext.currentTime + 1)

    gainNode.gain.setValueAtTime(0.4, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1)

    oscillator.connect(gainNode)
    gainNode.connect(this.masterGain)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + 1)
  }
}

// 单例导出
export const soundEffects = new SoundGenerator()
