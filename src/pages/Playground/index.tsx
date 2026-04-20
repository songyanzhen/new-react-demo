import { useState } from 'react'

/**
 * 空白测试页面 - Playground
 * 
 * 用于测试 React、JS、CSS 等各种代码
 * 可以自由修改此文件进行实验
 */
export function Playground() {
  // 示例状态，可删除或修改
  const [count, setCount] = useState(0)
  const [text, setText] = useState('')

  return (
    <div className="min-h-screen bg-dark-900 p-6">
      <div className="mx-auto max-w-4xl">
        {/* 标题区域 */}
        <h1 className="mb-6 text-3xl font-bold text-slate-100">
          🧪 代码实验室
        </h1>
        <p className="mb-8 text-slate-400">
          在这里自由测试 React、JavaScript、CSS 代码。修改 src/pages/Playground/index.tsx 开始实验。
        </p>

        {/* 测试区域 1：基础交互 */}
        <section className="mb-6 rounded-xl border border-dark-600 bg-dark-800/50 p-6">
          <h2 className="mb-4 text-xl font-semibold text-slate-200">
            计数器示例
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCount(c => c - 1)}
              className="rounded-lg bg-red-500/20 px-4 py-2 text-red-300 transition hover:bg-red-500/30"
            >
              -1
            </button>
            <span className="min-w-[3rem] text-center text-2xl font-bold text-slate-100">
              {count}
            </span>
            <button
              onClick={() => setCount(c => c + 1)}
              className="rounded-lg bg-green-500/20 px-4 py-2 text-green-300 transition hover:bg-green-500/30"
            >
              +1
            </button>
            <button
              onClick={() => setCount(0)}
              className="ml-4 rounded-lg bg-dark-700 px-4 py-2 text-slate-400 transition hover:bg-dark-600"
            >
              重置
            </button>
          </div>
        </section>

        {/* 测试区域 2：输入绑定 */}
        <section className="mb-6 rounded-xl border border-dark-600 bg-dark-800/50 p-6">
          <h2 className="mb-4 text-xl font-semibold text-slate-200">
            输入绑定示例
          </h2>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="输入一些文字..."
            className="w-full rounded-lg border border-dark-600 bg-dark-900 px-4 py-3 text-slate-100 placeholder-slate-500 outline-none transition focus:border-blue-500"
          />
          <p className="mt-3 text-slate-400">
            你输入了：<span className="text-blue-400">{text || '（空）'}</span>
          </p>
        </section>

        {/* 测试区域 3：CSS 样式实验 */}
        <section className="mb-6 rounded-xl border border-dark-600 bg-dark-800/50 p-6">
          <h2 className="mb-4 text-xl font-semibold text-slate-200">
            CSS 样式实验
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex h-24 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 font-bold text-white shadow-lg">
              渐变
            </div>
            <div className="flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-yellow-500/50 bg-yellow-500/10 font-bold text-yellow-400">
              边框
            </div>
            <div className="flex h-24 items-center justify-center rounded-lg bg-dark-700 font-bold text-slate-300 shadow-inner transition hover:scale-105 hover:bg-dark-600">
              悬停
            </div>
          </div>
        </section>

        {/* 空白区域：自由发挥 */}
        <section className="rounded-xl border-2 border-dashed border-dark-600 bg-dark-800/30 p-6">
          <h2 className="mb-4 text-xl font-semibold text-slate-200">
            🎨 你的代码在这里
          </h2>
          <p className="text-slate-500">
            开始编写你自己的 React 组件、Hook、动画效果...
          </p>
          
          {/* 在下面添加你的代码 */}
          
        </section>
      </div>
    </div>
  )
}

export default Playground
