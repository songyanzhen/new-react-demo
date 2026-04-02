import type { GuessResult } from '../types'
import { cellClass } from '../utils'

interface GuessTableProps {
  guesses: GuessResult[]
}

const TABLE_HEADERS = ['姓名', '性别', '系列', '发行商', '首登场年份', '平台', '阵营/角色', '种族', '出处/地区']
const CELL_KEYS = ['gender', 'franchise', 'publisher', 'year', 'platform', 'role', 'species', 'origin'] as const

export function GuessTable({ guesses }: GuessTableProps) {
  return (
    <div className="relative z-10 overflow-x-auto rounded-2xl border border-dark-600 bg-dark-800/40 shadow-sm backdrop-blur">
      <table className="min-w-[980px] w-full text-left text-sm">
        <thead className="border-b border-dark-600/70 text-xs text-slate-300">
          <tr>
            {TABLE_HEADERS.map((h) => (
              <th key={h} className="px-3 py-3 font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-dark-600/70">
          {guesses.length === 0 ? (
            <tr>
              <td colSpan={9} className="px-3 py-10 text-center text-slate-400">
                还没有猜测记录，先输入一个人物名开始吧。
              </td>
            </tr>
          ) : (
            guesses.map((g) => (
              <tr key={g.guess.id}>
                <td className="px-3 py-3">
                  <div className={`inline-flex items-center rounded-xl px-2 py-1 ${cellClass(g.cells.name.level)}`}>
                    {g.cells.name.text}
                  </div>
                </td>
                {CELL_KEYS.map((k) => {
                  const cell = g.cells[k]
                  const arrow = k === 'year' && cell.hint
                    ? cell.hint === 'higher' ? ' ↑' : ' ↓'
                    : ''
                  return (
                    <td key={k} className="px-3 py-3">
                      <div className={`inline-flex items-center rounded-xl px-2 py-1 ${cellClass(cell.level)}`}>
                        {cell.text}{arrow}
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
  )
}
