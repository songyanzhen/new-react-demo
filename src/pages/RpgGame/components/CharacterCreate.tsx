import { useState } from 'react'
import type { CharacterClass } from '../../types'

interface CharacterCreateProps {
  onCreate: (name: string, characterClass: CharacterClass) => void
}

const CLASSES: { id: CharacterClass; name: string; description: string; color: string }[] = [
  {
    id: 'warrior',
    name: '战士',
    description: '高生命值和防御力，擅长近战物理攻击',
    color: 'from-red-500 to-orange-500',
  },
  {
    id: 'mage',
    name: '法师',
    description: '高魔法伤害，可以使用治疗法术',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'rogue',
    name: '盗贼',
    description: '高敏捷和暴击率，擅长快速攻击',
    color: 'from-green-500 to-emerald-500',
  },
]

export function CharacterCreate({ onCreate }: CharacterCreateProps) {
  const [name, setName] = useState('')
  const [selectedClass, setSelectedClass] = useState<CharacterClass>('warrior')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onCreate(name.trim(), selectedClass)
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-dark-600 bg-dark-800/50 p-6 shadow-lg backdrop-blur">
      <h2 className="mb-6 text-center text-2xl font-bold text-slate-100">创建角色</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 角色名称 */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">角色名称</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={12}
            className="w-full rounded-xl border border-dark-600 bg-dark-900 px-4 py-3 text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            placeholder="输入角色名称..."
            required
          />
        </div>

        {/* 职业选择 */}
        <div>
          <label className="mb-3 block text-sm font-medium text-slate-300">选择职业</label>
          <div className="space-y-3">
            {CLASSES.map((cls) => (
              <button
                key={cls.id}
                type="button"
                onClick={() => setSelectedClass(cls.id)}
                className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
                  selectedClass === cls.id
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : 'border-dark-600 bg-dark-900/50 hover:bg-dark-700/50'
                }`}
              >
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${cls.color} flex items-center justify-center text-white font-bold text-lg`}>
                  {cls.name[0]}
                </div>
                <div>
                  <div className="font-semibold text-slate-100">{cls.name}</div>
                  <div className="text-sm text-slate-400">{cls.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={!name.trim()}
          className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          开始冒险
        </button>
      </form>
    </div>
  )
}
