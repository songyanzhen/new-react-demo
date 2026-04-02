interface CheatBubbleProps {
  targetName: string
  onClose: () => void
}

export function CheatBubble({ targetName, onClose }: CheatBubbleProps) {
  return (
    <span className="absolute left-1/2 top-full z-20 mt-2 block -translate-x-1/2 whitespace-nowrap">
      <span className="relative flex items-center gap-1.5 rounded-full border border-fuchsia-800 bg-dark-900 px-3 py-1.5 shadow-lg">
        <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-l border-t border-fuchsia-800 bg-dark-900" />
        <span className="relative text-xs text-slate-400">答案是</span>
        <span className="relative text-sm font-bold text-fuchsia-400">{targetName}</span>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
          className="relative ml-1 rounded-full p-0.5 text-slate-500 hover:bg-dark-700 hover:text-slate-300"
        >
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </span>
    </span>
  )
}
