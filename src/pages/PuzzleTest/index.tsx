import type { FormEvent } from 'react'
import { usePuzzleGame } from './hooks/usePuzzleGame'
import {
  AnswerBadge,
  AnswerImage,
  CheatBubble,
  GuessInput,
  GuessTable,
  HintsDisplay,
} from './components'

export { PuzzleTest }

function PuzzleTest() {
  const {
    target,
    status,
    revealed,
    input,
    setInput,
    error,
    guesses,
    hintLevel,
    titleClickCount,
    showCheatBubble,
    setShowCheatBubble,
    showDropdown,
    setShowDropdown,
    selectedIndex,
    setSelectedIndex,
    suggestions,
    inputContainerRef,
    onNewPuzzle,
    handleTitleClick,
    onReveal,
    onSubmitGuess,
  } = usePuzzleGame()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    // GuessInput 组件会自动处理提交
  }

  return (
    <main className="px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <header className="relative rounded-3xl border border-dark-600 bg-dark-800/40 p-6 shadow-sm backdrop-blur sm:p-8">
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
            <div
              aria-hidden="true"
              className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-500/15 via-fuchsia-500/10 to-sky-500/15 blur-3xl"
            />
          </div>
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              {/* Status Badges */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                <span className="rounded-full bg-white/10 px-2 py-1">演示</span>
                <span className="rounded-full bg-white/10 px-2 py-1">
                  已猜 {guesses.length} 次
                </span>
                <span className="rounded-full bg-white/10 px-2 py-1">
                  {status === 'playing' ? '进行中' : status === 'won' ? '已猜中' : '已揭晓'}
                </span>
              </div>

              {/* Title */}
              <div className="mt-4">
                <h1
                  className="cursor-default select-none text-3xl font-semibold tracking-tight text-slate-100 sm:text-4xl"
                  onClick={handleTitleClick}
                  title={titleClickCount > 0 ? `再点击${5 - titleClickCount}次解锁答案` : ''}
                >
                  <span className="relative inline-block">
                    猜电子游戏人物
                    {showCheatBubble && (
                      <CheatBubble
                        targetName={target.name}
                        onClose={() => setShowCheatBubble(false)}
                      />
                    )}
                  </span>
                </h1>
              </div>

              <p className="mt-2 text-slate-400">输入人物名称，观察属性对比提示。</p>

              {/* Answer Badge */}
              <div className="mt-4">{revealed ? <AnswerBadge targetName={target.name} /> : null}</div>

              {/* Hints */}
              <HintsDisplay hints={target.hints} hintLevel={hintLevel} revealed={revealed} />

              {/* Answer Image */}
              {revealed && <AnswerImage target={target} status={status} />}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 sm:flex-shrink-0">
              <button
                type="button"
                onClick={onReveal}
                disabled={revealed}
                className="rounded-xl border border-dark-600 bg-dark-800 px-3 py-2 text-sm font-medium text-slate-100 shadow-sm transition hover:-translate-y-0.5 hover:bg-dark-700 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
              >
                查看答案
              </button>
              <button
                type="button"
                onClick={onNewPuzzle}
                className="rounded-xl bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow"
              >
                换一道新题
              </button>
            </div>
          </div>
        </header>

        {/* Game Section */}
        <section className="mt-6 grid gap-4">
          {/* Input Form */}
          <form
            onSubmit={handleSubmit}
            className="relative z-20 rounded-2xl border border-dark-600 bg-dark-800/40 p-4 shadow-sm backdrop-blur"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1" ref={inputContainerRef}>
                <div className="mb-1 text-sm font-medium text-slate-100">你的猜测</div>
                <GuessInput
                  input={input}
                  setInput={setInput}
                  status={status}
                  showDropdown={showDropdown}
                  setShowDropdown={setShowDropdown}
                  selectedIndex={selectedIndex}
                  setSelectedIndex={setSelectedIndex}
                  suggestions={suggestions}
                  onSubmitGuess={onSubmitGuess}
                />
              </div>

              <button
                type="submit"
                disabled={status !== 'playing'}
                className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-400 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
              >
                猜！
              </button>
            </div>

            {error ? <div className="mt-3 text-sm text-rose-300">{error}</div> : null}
          </form>

          {/* Guess Table */}
          <GuessTable guesses={guesses} />
        </section>
      </div>
    </main>
  )
}
