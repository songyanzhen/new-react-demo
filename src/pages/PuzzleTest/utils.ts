import type { MatchLevel, CellResult, GuessResult } from './types'
import type { GameCharacter } from '../../data/gameCharacters'

export function normalize(s: string): string {
  return s.trim().toLowerCase()
}

export function uniqueStrings(xs: string[]): string[] {
  return Array.from(new Set(xs.map((x) => x.trim()).filter(Boolean)))
}

export function arrayMatch(a: string[], b: string[]): MatchLevel {
  const aa = new Set(uniqueStrings(a).map((x) => x.toLowerCase()))
  const bb = new Set(uniqueStrings(b).map((x) => x.toLowerCase()))
  let intersection = 0
  for (const x of aa) if (bb.has(x)) intersection++
  if (intersection === 0) return 'none'
  if (intersection === aa.size && intersection === bb.size) return 'match'
  return 'partial'
}

export function cellClass(level: MatchLevel): string {
  if (level === 'match')
    return 'bg-emerald-950/40 text-emerald-200 ring-1 ring-emerald-900/40'
  if (level === 'partial')
    return 'bg-amber-950/35 text-amber-200 ring-1 ring-amber-900/40'
  return 'bg-rose-950/35 text-rose-200 ring-1 ring-rose-900/40'
}

export function compareGuess(target: GameCharacter, guess: GameCharacter): GuessResult {
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
