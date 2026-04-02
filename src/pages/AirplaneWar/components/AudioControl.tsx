interface AudioControlProps {
  enabled: boolean
  volume: number
  onToggle: () => void
  onVolumeChange: (volume: number) => void
}

export function AudioControl({ enabled, volume, onToggle, onVolumeChange }: AudioControlProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-dark-600/50 bg-dark-800/40 p-3">
      <button
        onClick={onToggle}
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
          enabled
            ? 'bg-indigo-600 text-white hover:bg-indigo-500'
            : 'bg-dark-700 text-slate-400 hover:bg-dark-600'
        }`}
        title={enabled ? '音效已开启' : '音效已关闭'}
      >
        {enabled ? (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 11H2.75a1.75 1.75 0 01-1.75-1.75v-2.5C1 5.784 1.784 5 2.75 5h1.836l3.707-5.653a1 1 0 011.09-.27zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 11H2.75a1.75 1.75 0 01-1.75-1.75v-2.5C1 5.784 1.784 5 2.75 5h1.836l3.707-5.653a1 1 0 011.09-.27zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>
      
      {enabled && (
        <>
          <svg className="h-4 w-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path
              fillRule="evenodd"
              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="h-1.5 w-24 cursor-pointer appearance-none rounded-full bg-dark-600 accent-indigo-500"
          />
          <span className="w-8 text-xs text-slate-400">{Math.round(volume * 100)}%</span>
        </>
      )}
      
      <span className="text-xs text-slate-500">{enabled ? '音效开启' : '静音'}</span>
    </div>
  )
}
