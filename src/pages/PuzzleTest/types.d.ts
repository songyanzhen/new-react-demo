import type { GameCharacter } from '../../data/gameCharacters'

export {}

declare global {
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

  type GameStatus = 'playing' | 'won' | 'revealed'
}
