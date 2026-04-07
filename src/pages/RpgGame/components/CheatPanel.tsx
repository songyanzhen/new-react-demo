import type { CheatMode } from '../types'

interface CheatPanelProps {
  cheatMode: CheatMode
  onToggle: (option: keyof Omit<CheatMode, 'enabled'>) => void
}

export function CheatPanel({ cheatMode, onToggle }: CheatPanelProps) {
  const options: { key: keyof Omit<CheatMode, 'enabled'>; label: string; shortcut: string; color: string }[] = [
    { key: 'godMode', label: '无敌模式', shortcut: 'G', color: 'bg-green-500' },
    { key: 'oneHitKill', label: '一击必杀', shortcut: 'K', color: 'bg-red-500' },
    { key: 'infiniteMP', label: '无限MP', shortcut: 'M', color: 'bg-blue-500' },
    { key: 'maxDropRate', label: '10倍经验', shortcut: 'D', color: 'bg-purple-500' },
  ]

  return (
    <div className="mx-auto mb-6 max-w-4xl rounded-xl border border-yellow-500/50 bg-yellow-500/10 p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-xl">🎮</span>
        <span className="font-bold text-yellow-400">作弊控制台</span>
        <span className="text-xs text-yellow-400/70">(点击或按快捷键切换)</span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {options.map(({ key, label, shortcut, color }) => (
          <button
            key={key}
            onClick={() => onToggle(key)}
            className={`flex items-center justify-between rounded-lg border px-3 py-2 transition ${
              cheatMode[key]
                ? `border-${color.replace('bg-', '')} ${color} text-white`
                : 'border-dark-600 bg-dark-800/50 text-slate-400 hover:bg-dark-700/50'
            }`}
          >
            <span className="text-sm font-medium">{label}</span>
            <span className="rounded bg-white/20 px-1.5 py-0.5 text-xs">{shortcut}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
