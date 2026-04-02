import type { GameCharacter } from '../../data/gameCharacters'

export type MatchLevel = 'match' | 'partial' | 'none'

export type CellResult = {
  level: MatchLevel
  text: string
  hint?: 'higher' | 'lower'
}

export type GuessResult = {
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

export type GameStatus = 'playing' | 'won' | 'revealed'
