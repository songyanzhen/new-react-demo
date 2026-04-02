interface AnswerBadgeProps {
  targetName: string
}

export function AnswerBadge({ targetName }: AnswerBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-dark-600 bg-dark-800/60 px-3 py-1 text-xs text-slate-300 shadow-sm backdrop-blur">
      <span className="font-medium text-slate-100">答案</span>
      <span className="h-3 w-px bg-dark-600" />
      <span>{targetName}</span>
    </div>
  )
}
