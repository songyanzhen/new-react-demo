import { useRef } from 'react'
import type { GameCharacter } from '../../../data/gameCharacters'
import type { GameStatus } from '../types'
import { normalize } from '../utils'
import { GAME_CHARACTERS } from '../../../data/gameCharacters'

interface GuessInputProps {
  input: string
  setInput: (value: string) => void
  status: GameStatus
  showDropdown: boolean
  setShowDropdown: (show: boolean) => void
  selectedIndex: number
  setSelectedIndex: (index: number | ((prev: number) => number)) => void
  suggestions: GameCharacter[]
  onSubmitGuess: (character: GameCharacter) => void
}

export function GuessInput({
  input,
  setInput,
  status,
  showDropdown,
  setShowDropdown,
  selectedIndex,
  setSelectedIndex,
  suggestions,
  onSubmitGuess
}: GuessInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev: number) => prev < suggestions.length - 1 ? prev + 1 : prev)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev: number) => prev > 0 ? prev - 1 : -1)
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      setInput(suggestions[selectedIndex].name)
      setShowDropdown(false)
      setSelectedIndex(-1)
    } else if (e.key === 'Escape') {
      setShowDropdown(false)
    }
  }

  const handleSelect = (character: GameCharacter) => {
    setInput(character.name)
    setSelectedIndex(-1)
    
    const exact = GAME_CHARACTERS.find(c => normalize(c.name) === normalize(character.name))
    if (exact) {
      onSubmitGuess(exact)
    }
    
    setTimeout(() => setShowDropdown(false), 0)
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        className="w-full rounded-xl border border-dark-600 bg-dark-900 px-3 py-2 text-sm text-slate-100 shadow-sm outline-none ring-0 transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-950"
        value={input}
        onChange={(e) => {
          setInput(e.target.value)
          setShowDropdown(true)
          setSelectedIndex(-1)
        }}
        onFocus={() => setShowDropdown(true)}
        onClick={() => setShowDropdown(true)}
        onKeyDown={handleKeyDown}
        placeholder="输入人物名…"
        disabled={status !== 'playing'}
        autoComplete="off"
      />
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
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              onClick={(e) => {
                e.stopPropagation()
                handleSelect(c)
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
  )
}
