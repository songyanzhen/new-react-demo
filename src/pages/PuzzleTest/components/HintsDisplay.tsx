interface HintsDisplayProps {
  hints: string[]
  hintLevel: number
  revealed: boolean
}

export function HintsDisplay({ hints, hintLevel, revealed }: HintsDisplayProps) {
  if (hintLevel === 0 || revealed) return null
  
  const visibleHints = hints.slice(0, hintLevel)
  
  return (
    <div className="mt-3 rounded-xl border border-amber-900/40 bg-amber-950/30 p-3 shadow-sm backdrop-blur">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-amber-200">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m12.728 0l-.707.707M12 12a4 4 0 100-8 4 4 0 000 8z" />
        </svg>
        提示 {hintLevel}/3
      </div>
      <ul className="space-y-1.5">
        {visibleHints.map((hint, index) => (
          <li 
            key={index} 
            className="flex items-start gap-2 text-sm text-amber-100 animate-in fade-in slide-in-from-left-2 duration-300"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-800 text-xs font-bold text-amber-200">
              {index + 1}
            </span>
            <span>{hint}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
