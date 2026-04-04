// 动态难度系统

// 难度等级配置
export interface DifficultyConfig {
  enemySpeedMultiplier: number
  enemyHpMultiplier: number
  enemySpawnRate: number // 毫秒，越小生成越快
  enemyScoreMultiplier: number
  powerUpSpawnRate: number // 毫秒
}

// 根据分数计算难度等级
export function calculateDifficulty(score: number): DifficultyConfig {
  // 每500分提升一个难度等级
  const difficultyLevel = Math.floor(score / 500)
  
  // 计算各项数值（有上限）
  const speedMult = Math.min(1 + difficultyLevel * 0.15, 2.5) // 最高2.5倍速
  const hpMult = Math.min(1 + difficultyLevel * 0.1, 2) // 最高2倍血
  const spawnRate = Math.max(1500 - difficultyLevel * 100, 600) // 最快600毫秒
  const scoreMult = Math.min(1 + difficultyLevel * 0.1, 2) // 最高2倍分
  const powerRate = Math.max(10000 - difficultyLevel * 500, 5000) // 最快5秒
  
  return {
    enemySpeedMultiplier: speedMult,
    enemyHpMultiplier: hpMult,
    enemySpawnRate: spawnRate,
    enemyScoreMultiplier: scoreMult,
    powerUpSpawnRate: powerRate,
  }
}

// 获取当前难度等级描述
export function getDifficultyDescription(score: number): string {
  const level = Math.floor(score / 500)
  const descriptions = [
    '简单',
    '普通',
    '困难',
    '极难',
    '噩梦',
    '地狱',
    '炼狱',
    '毁灭',
  ]
  return descriptions[Math.min(level, descriptions.length - 1)]
}

// 获取难度颜色（Tailwind 类名）
export function getDifficultyColor(score: number): string {
  const level = Math.floor(score / 500)
  const colors = [
    'bg-green-500 text-white',      // 简单
    'bg-blue-500 text-white',       // 普通
    'bg-amber-500 text-white',      // 困难
    'bg-red-500 text-white',        // 极难
    'bg-red-600 text-white',        // 噩梦
    'bg-red-800 text-white',        // 地狱
    'bg-purple-600 text-white',     // 炼狱
    'bg-slate-900 text-red-500 border border-red-500', // 毁灭
  ]
  return colors[Math.min(level, colors.length - 1)]
}
