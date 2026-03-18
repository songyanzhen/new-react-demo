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
    }
  }

  const answerBadge = (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs text-slate-700 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-200">
      <span className="font-medium text-slate-900 dark:text-slate-100">答案</span>
      <span className="h-3 w-px bg-slate-200 dark:bg-slate-800" />
      <span>{target.name}</span>
    </div>
  )

  return (
    <main className="px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <header className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/40 sm:p-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-300/35 via-fuchsia-300/25 to-sky-300/35 blur-3xl dark:from-indigo-500/15 dark:via-fuchsia-500/10 dark:to-sky-500/15"
          />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
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
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100">
                猜电子游戏人物
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                输入人物名称，观察属性对比提示。
              </p>
              <div className="mt-4">{revealed ? answerBadge : null}</div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
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

