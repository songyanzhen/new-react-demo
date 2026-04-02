import { useState } from 'react'
import type { GameCharacter } from '../../../data/gameCharacters'
import type { GameStatus } from '../types'
import { VictoryAnimation } from './VictoryAnimation'

interface AnswerImageProps {
  target: GameCharacter
  status: GameStatus
}

export function AnswerImage({ target, status }: AnswerImageProps) {
  const [imageLoading, setImageLoading] = useState(true)

  return (
    <div className="mt-4 flex flex-col items-center">
      {status === 'won' && <VictoryAnimation />}
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
          className={`h-full w-full object-contain transition-opacity duration-300 ${status === 'won' ? 'animate-in zoom-in duration-500' : ''}`}
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
  )
}
