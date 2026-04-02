import { useState, useEffect, useRef, useMemo } from 'react'
import { GAME_CHARACTERS, type GameCharacter } from '../../../data/gameCharacters'
import type { GuessResult, GameStatus } from '../types'
import { normalize, compareGuess } from '../utils'

function pickRandomTarget(excludeId?: string): GameCharacter {
  const pool = excludeId
    ? GAME_CHARACTERS.filter((c) => c.id !== excludeId)
    : GAME_CHARACTERS
  return pool[Math.floor(Math.random() * pool.length)]
}

export function usePuzzleGame() {
  const lastTargetIdRef = useRef<string | undefined>(undefined)
  const inputContainerRef = useRef<HTMLDivElement>(null)
  
  const [target, setTarget] = useState<GameCharacter>(() => pickRandomTarget())
  const [status, setStatus] = useState<GameStatus>('playing')
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

  // 目标改变时重置状态
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

  // 更新 lastTargetIdRef
  useEffect(() => {
    lastTargetIdRef.current = target.id
  }, [target.id])

  const suggestions = useMemo(() => {
    const q = normalize(input)
    const filtered = GAME_CHARACTERS.filter((c) => 
      normalize(c.name).includes(q) || normalize(c.franchise).includes(q)
    )
    if (!q) {
      return filtered.sort((a, b) => 
        a.franchise.localeCompare(b.franchise, 'zh') || 
        a.name.localeCompare(b.name, 'zh')
      )
    }
    return filtered.slice(0, 20)
  }, [input])

  const onNewPuzzle = () => {
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

  const handleTitleClick = () => {
    if (showCheatBubble || revealed) return
    const newCount = titleClickCount + 1
    setTitleClickCount(newCount)
    if (newCount >= 5) {
      setShowCheatBubble(true)
    }
  }

  const onReveal = () => {
    setRevealed(true)
    setStatus((s) => (s === 'won' ? s : 'revealed'))
  }

  const onSubmitGuess = (character: GameCharacter) => {
    if (status !== 'playing') return

    if (guesses.some((g) => g.guess.id === character.id)) {
      setError('你已经猜过这个人物了。')
      return
    }

    const result = compareGuess(target, character)
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

  return {
    target,
    status,
    revealed,
    input,
    setInput,
    error,
    setError,
    guesses,
    imageLoading,
    setImageLoading,
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
    onSubmitGuess
  }
}
