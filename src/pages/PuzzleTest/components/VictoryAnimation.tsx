export function VictoryAnimation() {
  return (
    <div className="mb-4 text-center">
      <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-500/20 via-amber-500/20 to-orange-500/20 px-4 py-2 text-lg font-bold text-amber-300 animate-in zoom-in duration-500">
        <svg className="h-6 w-6 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span className="bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-300 bg-clip-text text-transparent">
          🎉 恭喜你，猜对了！
        </span>
        <svg className="h-6 w-6 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      </div>
      {/* 彩带动画 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 50}%`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: '1s'
            }}
          >
            <span style={{ fontSize: `${Math.random() * 20 + 10}px` }}>
              {['🎊', '🎉', '✨', '⭐', '🌟'][i % 5]}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
