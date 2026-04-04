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

  // Boss击败胜利音效
  playBossVictory() {
    if (!this.enabled) return
    this.init()
    if (!this.audioContext || !this.masterGain) return

    // 播放胜利旋律 C-E-G-C5
    const notes = [523.25, 659.25, 783.99, 1046.5]
    notes.forEach((freq, i) => {
      const oscillator = this.audioContext!.createOscillator()
      const gainNode = this.audioContext!.createGain()

      oscillator.type = 'square'
      oscillator.frequency.setValueAtTime(freq, this.audioContext!.currentTime + i * 0.15)

      gainNode.gain.setValueAtTime(0, this.audioContext!.currentTime + i * 0.15)
      gainNode.gain.linearRampToValueAtTime(0.25, this.audioContext!.currentTime + i * 0.15 + 0.05)
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext!.currentTime + i * 0.15 + 0.4)

      oscillator.connect(gainNode)
      gainNode.connect(this.masterGain!)

      oscillator.start(this.audioContext!.currentTime + i * 0.15)
      oscillator.stop(this.audioContext!.currentTime + i * 0.15 + 0.4)
    })

    // 添加爆炸低音
    const osc = this.audioContext.createOscillator()
    const gain = this.audioContext.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(100, this.audioContext.currentTime)
    osc.frequency.exponentialRampToValueAtTime(30, this.audioContext.currentTime + 0.5)
    gain.gain.setValueAtTime(0.3, this.audioContext.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5)
    osc.connect(gain)
    gain.connect(this.masterGain)
    osc.start(this.audioContext.currentTime)
    osc.stop(this.audioContext.currentTime + 0.5)
  }

  // Boss警告音效
  playBossWarning() {
    if (!this.enabled) return
    this.init()
    if (!this.audioContext || !this.masterGain) return

    // 警报声 - 高低交替的警笛
    for (let i = 0; i < 6; i++) {
      const oscillator = this.audioContext!.createOscillator()
      const gainNode = this.audioContext!.createGain()

      oscillator.type = 'sawtooth'
      // 快速高低变化
      oscillator.frequency.setValueAtTime(880, this.audioContext!.currentTime + i * 0.25)
      oscillator.frequency.exponentialRampToValueAtTime(440, this.audioContext!.currentTime + i * 0.25 + 0.125)

      gainNode.gain.setValueAtTime(0, this.audioContext!.currentTime + i * 0.25)
      gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext!.currentTime + i * 0.25 + 0.05)
      gainNode.gain.linearRampToValueAtTime(0, this.audioContext!.currentTime + i * 0.25 + 0.25)

      oscillator.connect(gainNode)
      gainNode.connect(this.masterGain!)

      oscillator.start(this.audioContext!.currentTime + i * 0.25)
      oscillator.stop(this.audioContext!.currentTime + i * 0.25 + 0.25)
    }

    // 添加低沉的嗡嗡声作为背景
    const osc = this.audioContext.createOscillator()
    const gain = this.audioContext.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(100, this.audioContext.currentTime)
    gain.gain.setValueAtTime(0.1, this.audioContext.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1.5)
    osc.connect(gain)
    gain.connect(this.masterGain)
    osc.start(this.audioContext.currentTime)
    osc.stop(this.audioContext.currentTime + 1.5)
  }

  // 飞机爆炸音效（用于Boss被击败或玩家被击毁）
  playPlaneExplosion() {
    if (!this.enabled) return
    this.init()
    if (!this.audioContext || !this.masterGain) return

    // 创建噪声缓冲区
    const bufferSize = this.audioContext.sampleRate * 0.8
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate)
    const data = buffer.getChannelData(0)

    // 生成爆炸噪声
    for (let i = 0; i < bufferSize; i++) {
      const t = i / bufferSize
      // 前强后弱的噪声
      const amplitude = Math.pow(1 - t, 2)
      data[i] = (Math.random() * 2 - 1) * amplitude
    }

    const noise = this.audioContext.createBufferSource()
    noise.buffer = buffer

    const gainNode = this.audioContext.createGain()
    gainNode.gain.setValueAtTime(0.8, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.8)

    // 低通滤波器让声音更沉闷（爆炸声）
    const filter = this.audioContext.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(800, this.audioContext.currentTime)
    filter.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.5)

    noise.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(this.masterGain)

    noise.start(this.audioContext.currentTime)

    // 添加低频震动
    const osc = this.audioContext.createOscillator()
    const oscGain = this.audioContext.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(80, this.audioContext.currentTime)
    osc.frequency.exponentialRampToValueAtTime(20, this.audioContext.currentTime + 0.6)
    oscGain.gain.setValueAtTime(0.5, this.audioContext.currentTime)
    oscGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.6)
    osc.connect(oscGain)
    oscGain.connect(this.masterGain)
    osc.start(this.audioContext.currentTime)
    osc.stop(this.audioContext.currentTime + 0.6)
  }
}

// 单例导出
export const soundEffects = new SoundGenerator()
