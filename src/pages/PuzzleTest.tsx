import { type FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import {
  GAME_CHARACTERS,
  type GameCharacter,
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
    return 'bg-emerald-950/40 text-emerald-200 ring-1 ring-emerald-900/40'
  if (level === 'partial')
    return 'bg-amber-950/35 text-amber-200 ring-1 ring-amber-900/40'
  return 'bg-rose-950/35 text-rose-200 ring-1 ring-rose-900/40'
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
  const [hintLevel, setHintLevel] = useState(0)
  const [titleClickCount, setTitleClickCount] = useState(0)
  const [showCheatBubble, setShowCheatBubble] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setImageLoading(true)
    setHintLevel(0)
    setTitleClickCount(0)
    setShowCheatBubble(false)
  }, [target.id])

  // 点击外部关闭下拉框
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (inputContainerRef.current && !inputContainerRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const suggestions = useMemo(() => {
    const q = normalize(input)
    // 匹配角色名或作品名
    const filtered = GAME_CHARACTERS.filter((c) => 
      normalize(c.name).includes(q) || normalize(c.franchise).includes(q)
    )
    // 空输入时按作品名分组排序，方便浏览
    if (!q) {
      return filtered.sort((a, b) => 
        a.franchise.localeCompare(b.franchise, 'zh') || 
        a.name.localeCompare(b.name, 'zh')
      )
    }
    return filtered.slice(0, 20)
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
      setHintLevel((prev) => Math.min(prev + 1, 3))
    }
    setInput('')
    setShowDropdown(false)
  }

  const answerBadge = (
    <div className="inline-flex items-center gap-2 rounded-full border border-dark-600 bg-dark-800/60 px-3 py-1 text-xs text-slate-300 shadow-sm backdrop-blur">
      <span className="font-medium text-slate-100">答案</span>
      <span className="h-3 w-px bg-dark-600" />
      <span>{target.name}</span>
    </div>
  )

  const HintsDisplay = () => {
    if (hintLevel === 0 || revealed) return null
    
    const visibleHints = target.hints.slice(0, hintLevel)
    
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

  const answerImage = revealed ? (
    <div className="mt-4 flex flex-col items-center">
      <div className="relative flex h-48 w-48 items-center justify-center overflow-hidden rounded-2xl border border-dark-600 bg-dark-900 p-2 shadow-md sm:h-56 sm:w-56">
        {imageLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-dark-900/80 backdrop-blur-sm">
            <div className="relative h-12 w-12">
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-dark-600 border-t-indigo-400" />
              <div className="absolute inset-2 animate-spin rounded-full border-4 border-dark-600 border-b-fuchsia-400" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
            </div>
            <span className="mt-3 text-xs font-medium text-slate-400">加载中...</span>
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
      <p className="mt-2 text-sm text-slate-400">{target.franchise} · {target.publisher}</p>
    </div>
  ) : null

  return (
    <main className="px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <header className="relative rounded-3xl border border-dark-600 bg-dark-800/40 p-6 shadow-sm backdrop-blur sm:p-8">
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
            <div
              aria-hidden="true"
              className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-500/15 via-fuchsia-500/10 to-sky-500/15 blur-3xl"
            />
          </div>
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                <span className="rounded-full bg-white/10 px-2 py-1">
                  演示
                </span>
                <span className="rounded-full bg-white/10 px-2 py-1">
                  已猜 {guesses.length} 次
                </span>
                <span className="rounded-full bg-white/10 px-2 py-1">
                  {status === 'playing' ? '进行中' : status === 'won' ? '已猜中' : '已揭晓'}
                </span>
              </div>
              <div className="mt-4">
                <h1
                  className="cursor-default select-none text-3xl font-semibold tracking-tight text-slate-100 sm:text-4xl"
                  onClick={handleTitleClick}
                  title={titleClickCount > 0 ? `再点击${5 - titleClickCount}次解锁答案` : ''}
                >
                  <span className="relative inline-block">
                    猜电子游戏人物

                    {showCheatBubble && (
                      <span className="absolute left-1/2 top-full z-20 mt-2 block -translate-x-1/2 whitespace-nowrap">
                        <span className="relative flex items-center gap-1.5 rounded-full border border-fuchsia-800 bg-dark-900 px-3 py-1.5 shadow-lg">
                          <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-l border-t border-fuchsia-800 bg-dark-900" />
                          <span className="relative text-xs text-slate-400">答案是</span>
                          <span className="relative text-sm font-bold text-fuchsia-400">{target.name}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowCheatBubble(false)
                            }}
                            className="relative ml-1 rounded-full p-0.5 text-slate-500 hover:bg-dark-700 hover:text-slate-300"
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
              <p className="mt-2 text-slate-400">
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

        <section className="mt-6 grid gap-4">
          <form
            onSubmit={onSubmitGuess}
            className="relative z-20 rounded-2xl border border-dark-600 bg-dark-800/40 p-4 shadow-sm backdrop-blur"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
              <label className="flex-1" ref={inputContainerRef}>
                <div className="mb-1 text-sm font-medium text-slate-100">
                  你的猜测
                </div>
                <div className="relative">
                  <input
                    className="w-full rounded-xl border border-dark-600 bg-dark-900 px-3 py-2 text-sm text-slate-100 shadow-sm outline-none ring-0 transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-950"
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value)
                      setShowDropdown(true)
                      setSelectedIndex(-1)
                    }}
                    onFocus={() => setShowDropdown(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowDown') {
                        e.preventDefault()
                        setSelectedIndex((prev) => 
                          prev < suggestions.length - 1 ? prev + 1 : prev
                        )
                      } else if (e.key === 'ArrowUp') {
                        e.preventDefault()
                        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
                      } else if (e.key === 'Enter' && selectedIndex >= 0) {
                        e.preventDefault()
                        setInput(suggestions[selectedIndex].name)
                        setShowDropdown(false)
                        setSelectedIndex(-1)
                      } else if (e.key === 'Escape') {
                        setShowDropdown(false)
                      }
                    }}
                    placeholder="输入人物名…"
                    disabled={status !== 'playing'}
                    autoComplete="off"
                  />
                  {/* 下拉列表 - 放在输入框下方 */}
                  {showDropdown && suggestions.length > 0 && (
                    <div className="absolute z-[9999] mt-1 max-h-80 w-full overflow-y-auto rounded-xl border border-dark-600 bg-dark-800 shadow-2xl">
                      {suggestions.map((c, index) => (
                        <div
                          key={c.id}
                          className={`cursor-pointer px-3 py-2 text-sm transition ${
                            index === selectedIndex
                              ? 'bg-indigo-600 text-white'
                              : 'text-slate-300 hover:bg-dark-700'
                          }`}
                          onClick={() => {
                            setInput(c.name)
                            setShowDropdown(false)
                            setSelectedIndex(-1)
                          }}
                          onMouseEnter={() => setSelectedIndex(index)}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate">{c.name}</span>
                            <span className="shrink-0 text-xs opacity-60">{c.franchise}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </label>

              <button
                type="submit"
                disabled={status !== 'playing'}
                className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-400 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
              >
                猜！
              </button>
            </div>

            {error ? (
              <div className="mt-3 text-sm text-rose-300">
                {error}
              </div>
            ) : null}
          </form>

          <div className="relative z-10 overflow-x-auto rounded-2xl border border-dark-600 bg-dark-800/40 shadow-sm backdrop-blur">
            <table className="min-w-[980px] w-full text-left text-sm">
              <thead className="border-b border-dark-600/70 text-xs text-slate-300">
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
              <tbody className="divide-y divide-dark-600/70">
                {guesses.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-3 py-10 text-center text-slate-400"
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
