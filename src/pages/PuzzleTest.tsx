import { type FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import {
  GAME_CHARACTERS_ZH as GAME_CHARACTERS,
  type GameCharacterZh as GameCharacter,
} from '../data/gameCharacters'

type MatchLevel = 'match' | 'partial' | 'none'

type CellResult = {
  level: MatchLevel
  text: string
  hint?: 'higher' | 'lower'
}

type GuessResult = {
  guess: GameCharacter
  cells: {
    name: CellResult
    gender: CellResult
    franchise: CellResult
    publisher: CellResult
    year: CellResult
    platform: CellResult
    role: CellResult
    species: CellResult
    origin: CellResult
  }
  isCorrect: boolean
}

function normalize(s: string) {
  return s.trim().toLowerCase()
}

function uniqueStrings(xs: string[]) {
  return Array.from(new Set(xs.map((x) => x.trim()).filter(Boolean)))
}

function arrayMatch(a: string[], b: string[]): MatchLevel {
  const aa = new Set(uniqueStrings(a).map((x) => x.toLowerCase()))
  const bb = new Set(uniqueStrings(b).map((x) => x.toLowerCase()))
  let intersection = 0
  for (const x of aa) if (bb.has(x)) intersection++
  if (intersection === 0) return 'none'
  if (intersection === aa.size && intersection === bb.size) return 'match'
  return 'partial'
}

function cellClass(level: MatchLevel) {
  if (level === 'match')
    return 'bg-emerald-50 text-emerald-900 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:ring-emerald-900/40'
  if (level === 'partial')
    return 'bg-amber-50 text-amber-900 ring-1 ring-amber-200 dark:bg-amber-950/35 dark:text-amber-200 dark:ring-amber-900/40'
  return 'bg-rose-50 text-rose-900 ring-1 ring-rose-200 dark:bg-rose-950/35 dark:text-rose-200 dark:ring-rose-900/40'
}

function compareGuess(target: GameCharacter, guess: GameCharacter): GuessResult {
  const yearHint: CellResult['hint'] =
    target.firstAppearanceYear > guess.firstAppearanceYear
      ? 'higher'
      : target.firstAppearanceYear < guess.firstAppearanceYear
        ? 'lower'
        : undefined

  const yearLevel: MatchLevel =
    target.firstAppearanceYear === guess.firstAppearanceYear ? 'match' : 'none'

  const same = (a: string, b: string): MatchLevel =>
    normalize(a) === normalize(b) ? 'match' : 'none'

  const genderLevel = target.gender === guess.gender ? 'match' : 'none'

  return {
    guess,
    isCorrect: target.id === guess.id,
    cells: {
      name: { level: target.id === guess.id ? 'match' : 'none', text: guess.name },
      gender: { level: genderLevel, text: guess.gender },
      franchise: { level: same(target.franchise, guess.franchise), text: guess.franchise },
      publisher: { level: same(target.publisher, guess.publisher), text: guess.publisher },
      origin: { level: same(target.origin, guess.origin), text: guess.origin },
      year: {
        level: yearLevel,
        text: String(guess.firstAppearanceYear),
        hint: yearHint,
      },
      platform: {
        level: arrayMatch(target.platform, guess.platform),
        text: uniqueStrings(guess.platform).join(', ') || '—',
      },
      role: {
        level: arrayMatch(target.role, guess.role),
        text: uniqueStrings(guess.role).join(', ') || '—',
      },
      species: {
        level: arrayMatch(target.species, guess.species),
        text: uniqueStrings(guess.species).join(', ') || '—',
      },
    },
  }
}

function pickRandomTarget(excludeId?: string) {
  const pool = excludeId
    ? GAME_CHARACTERS.filter((c) => c.id !== excludeId)
    : GAME_CHARACTERS
  return pool[Math.floor(Math.random() * pool.length)]
}

export function PuzzleTest() {
  const lastTargetIdRef = useRef<string | undefined>(undefined)
  const [target, setTarget] = useState<GameCharacter>(() => pickRandomTarget())
  const [status, setStatus] = useState<'playing' | 'won' | 'revealed'>('playing')
  const [revealed, setRevealed] = useState(false)
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [guesses, setGuesses] = useState<GuessResult[]>([])
  const [imageLoading, setImageLoading] = useState(true)
  const [hintLevel, setHintLevel] = useState(0) // 0-3，表示已解锁的提示数量
  const [titleClickCount, setTitleClickCount] = useState(0)
  const [showCheatBubble, setShowCheatBubble] = useState(false)

  // 当目标改变时重置状态
  useEffect(() => {
    setImageLoading(true)
    setHintLevel(0)
    setTitleClickCount(0)
    setShowCheatBubble(false)
  }, [target.id])

  const suggestions = useMemo(() => {
    const q = normalize(input)
    if (!q) return GAME_CHARACTERS.slice(0, 20)
    return GAME_CHARACTERS.filter((c) => normalize(c.name).includes(q)).slice(0, 20)
  }, [input])

  useEffect(() => {
    lastTargetIdRef.current = target.id
  }, [target.id])

  function onNewPuzzle() {
    const next = pickRandomTarget(lastTargetIdRef.current)
    setTarget(next)
    setGuesses([])
    setInput('')
    setError(null)
    setStatus('playing')
    setRevealed(false)
    setTitleClickCount(0)
    setShowCheatBubble(false)
  }

  function handleTitleClick() {
    if (showCheatBubble || revealed) return
    const newCount = titleClickCount + 1
    setTitleClickCount(newCount)
    if (newCount >= 5) {
      setShowCheatBubble(true)
    }
  }

  function onReveal() {
    setRevealed(true)
    setStatus((s) => (s === 'won' ? s : 'revealed'))
  }

  function onSubmitGuess(e: FormEvent) {
    e.preventDefault()
    if (status !== 'playing') return

    const q = normalize(input)
    if (!q) return

    const exact = GAME_CHARACTERS.find((c) => normalize(c.name) === q)
    if (!exact) {
      setError('人物库中没有找到该名称，请从下拉建议中选择。')
      return
    }

    if (guesses.some((g) => g.guess.id === exact.id)) {
      setError('你已经猜过这个人物了。')
      return
    }

    const result = compareGuess(target, exact)
    setGuesses((xs) => [result, ...xs])
    setError(null)

    if (result.isCorrect) {
      setStatus('won')
      setRevealed(true)
    } else {
      // 猜错了，解锁下一个提示（最多3个）
      setHintLevel((prev) => Math.min(prev + 1, 3))
    }
  }

  const answerBadge = (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs text-slate-700 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-200">
      <span className="font-medium text-slate-900 dark:text-slate-100">答案</span>
      <span className="h-3 w-px bg-slate-200 dark:bg-slate-800" />
      <span>{target.name}</span>
    </div>
  )

  // 提示显示组件
  const HintsDisplay = () => {
    if (hintLevel === 0 || revealed) return null
    
    const visibleHints = target.hints.slice(0, hintLevel)
    
    return (
      <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/70 p-3 shadow-sm backdrop-blur dark:border-amber-900/40 dark:bg-amber-950/30">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-amber-800 dark:text-amber-200">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m12.728 0l-.707.707M12 12a4 4 0 100-8 4 4 0 000 8z" />
          </svg>
          提示 {hintLevel}/3
        </div>
        <ul className="space-y-1.5">
          {visibleHints.map((hint, index) => (
            <li 
              key={index} 
              className="flex items-start gap-2 text-sm text-amber-900 dark:text-amber-100 animate-in fade-in slide-in-from-left-2 duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-800 dark:bg-amber-800 dark:text-amber-200">
                {index + 1}
              </span>
              <span>{hint}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  const answerImage = revealed ? (
    <div className="mt-4 flex flex-col items-center">
      <div className="relative flex h-48 w-48 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-md dark:border-slate-800 dark:bg-slate-950 sm:h-56 sm:w-56">
        {imageLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-slate-950/80">
            <div className="relative h-12 w-12">
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-500 dark:border-slate-700 dark:border-t-indigo-400" />
              <div className="absolute inset-2 animate-spin rounded-full border-4 border-slate-200 border-b-fuchsia-500 dark:border-slate-700 dark:border-b-fuchsia-400" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
            </div>
            <span className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">加载中...</span>
          </div>
        )}
        <img
          src={target.imageUrl}
          alt={target.name}
          className="h-full w-full object-contain transition-opacity duration-300"
          style={{ opacity: imageLoading ? 0 : 1 }}
          onLoad={() => setImageLoading(false)}
          onError={(e) => {
            setImageLoading(false)
            ;(e.target as HTMLImageElement).src = 'https://img2.baidu.com/it/u=2185229574,2020794694&fm=253&fmt=auto&app=138&f=GIF?w=417&h=454'
          }}
        />
      </div>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{target.franchise} · {target.publisher}</p>
    </div>
  ) : null

  return (
    <main className="px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <header className="relative rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/40 sm:p-8">
          {/* 背景光晕单独一层，避免 overflow-hidden 截断内容 */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
            <div
              aria-hidden="true"
              className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-300/35 via-fuchsia-300/25 to-sky-300/35 blur-3xl dark:from-indigo-500/15 dark:via-fuchsia-500/10 dark:to-sky-500/15"
            />
          </div>
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <span className="rounded-full bg-slate-900/5 px-2 py-1 dark:bg-white/10">
                  演示
                </span>
                <span className="rounded-full bg-slate-900/5 px-2 py-1 dark:bg-white/10">
                  已猜 {guesses.length} 次
                </span>
                <span className="rounded-full bg-slate-900/5 px-2 py-1 dark:bg-white/10">
                  {status === 'playing' ? '进行中' : status === 'won' ? '已猜中' : '已揭晓'}
                </span>
              </div>
              <div className="mt-4">
                <h1
                  className="cursor-default select-none text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100"
                  onClick={handleTitleClick}
                  title={titleClickCount > 0 ? `再点击${5 - titleClickCount}次解锁答案` : ''}
                >
                  <span className="relative inline-block">
                    猜电子游戏人物

                    {/* 作弊气泡 */}
                    {showCheatBubble && (
                      <span className="absolute left-1/2 top-full z-20 mt-2 block -translate-x-1/2 whitespace-nowrap">
                        <span className="relative flex items-center gap-1.5 rounded-full border border-fuchsia-200 bg-white px-3 py-1.5 shadow-lg dark:border-fuchsia-800 dark:bg-slate-900">
                          {/* 小三角 */}
                          <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-l border-t border-fuchsia-200 bg-white dark:border-fuchsia-800 dark:bg-slate-900" />

                          <span className="relative text-xs text-slate-500 dark:text-slate-400">答案是</span>
                          <span className="relative text-sm font-bold text-fuchsia-600 dark:text-fuchsia-400">{target.name}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowCheatBubble(false)
                            }}
                            className="relative ml-1 rounded-full p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                          >
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </span>
                      </span>
                    )}
                  </span>
                </h1>
              </div>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                输入人物名称，观察属性对比提示。
              </p>
              <div className="mt-4">{revealed ? answerBadge : null}</div>
              <HintsDisplay />
              {answerImage}
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:flex-shrink-0">
              <button
                type="button"
                onClick={onReveal}
                disabled={revealed}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              >
                查看答案
              </button>
              <button
                type="button"
                onClick={onNewPuzzle}
                className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white"
              >
                换一道新题
              </button>
            </div>
          </div>
        </header>

        <section className="mt-6 grid gap-4">
          <form
            onSubmit={onSubmitGuess}
            className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/40"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <label className="flex-1">
                <div className="mb-1 text-sm font-medium text-slate-900 dark:text-slate-100">
                  你的猜测
                </div>
                <input
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-0 transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-700 dark:focus:ring-indigo-950"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="输入人物名…"
                  list="character-suggestions"
                  disabled={status !== 'playing'}
                />
                <datalist id="character-suggestions">
                  {suggestions.map((c) => (
                    <option key={c.id} value={c.name} />
                  ))}
                </datalist>
              </label>

              <button
                type="submit"
                disabled={status !== 'playing'}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-500 dark:hover:bg-indigo-400"
              >
                猜！
              </button>
            </div>

            {error ? (
              <div className="mt-3 text-sm text-rose-700 dark:text-rose-300">
                {error}
              </div>
            ) : null}
          </form>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white/70 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/40">
            <table className="min-w-[980px] w-full text-left text-sm">
              <thead className="border-b border-slate-200/70 text-xs text-slate-600 dark:border-slate-800/70 dark:text-slate-300">
                <tr>
                  {[
                    '姓名',
                    '性别',
                    '系列',
                    '发行商',
                    '首登场年份',
                    '平台',
                    '阵营/角色',
                    '种族',
                    '出处/地区',
                  ].map((h) => (
                    <th key={h} className="px-3 py-3 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800/70">
                {guesses.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-3 py-10 text-center text-slate-600 dark:text-slate-300"
                    >
                      还没有猜测记录，先输入一个人物名开始吧。
                    </td>
                  </tr>
                ) : (
                  guesses.map((g) => (
                    <tr key={g.guess.id}>
                      <td className="px-3 py-3">
                        <div
                          className={`inline-flex items-center rounded-xl px-2 py-1 ${cellClass(
                            g.cells.name.level,
                          )}`}
                        >
                          {g.cells.name.text}
                        </div>
                      </td>
                      {(
                        [
                          'gender',
                          'franchise',
                          'publisher',
                          'year',
                          'platform',
                          'role',
                          'species',
                          'origin',
                        ] as const
                      ).map((k) => {
                        const cell = g.cells[k]
                        const arrow =
                          k === 'year' && cell.hint
                            ? cell.hint === 'higher'
                              ? ' ↑'
                              : ' ↓'
                            : ''
                        return (
                          <td key={k} className="px-3 py-3">
                            <div
                              className={`inline-flex items-center rounded-xl px-2 py-1 ${cellClass(
                                cell.level,
                              )}`}
                            >
                              {cell.text}
                              {arrow}
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}

