import { Link, Route, Routes } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import { PuzzleTest } from './pages/PuzzleTest'

function App() {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="relative mx-auto min-h-screen max-w-5xl overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-300/40 via-fuchsia-300/30 to-sky-300/40 blur-3xl dark:from-indigo-500/15 dark:via-fuchsia-500/10 dark:to-sky-500/15"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-36 left-6 h-80 w-80 rounded-full bg-gradient-to-tr from-emerald-300/35 via-cyan-300/20 to-transparent blur-3xl dark:from-emerald-500/10 dark:via-cyan-500/10"
        />
        <nav className="sticky top-0 z-10 border-b border-slate-200/70 bg-white/80 backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/70">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <Link
              to="/"
              className="font-semibold tracking-tight text-slate-900 hover:text-slate-700 dark:text-slate-100 dark:hover:text-slate-300"
            >
              new-react-demo
            </Link>
            <div className="flex items-center gap-2">
              <Link
                to="/puzzleTest"
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:shadow dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-100 dark:hover:bg-slate-900"
              >
                猜人物
              </Link>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/puzzleTest" element={<PuzzleTest />} />
        </Routes>
      </div>
    </div>
  )
}

function Home() {
  return (
    <main className="px-4 py-10 sm:px-6 sm:py-14">
      <header className="mx-auto max-w-2xl text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs text-slate-700 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-200">
          <span className="inline-flex items-center gap-2">
            <img src={reactLogo} alt="React" className="h-4 w-4" />
            <span>React</span>
          </span>
          <span className="h-3 w-px bg-slate-200 dark:bg-slate-800" />
          <span className="inline-flex items-center gap-2">
            <img src={viteLogo} alt="Vite" className="h-4 w-4" />
            <span>Vite</span>
          </span>
        </div>
        <h1 className="mt-5 bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl dark:from-slate-100 dark:via-slate-300 dark:to-slate-100">
          菜单
        </h1>
        <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
          选择一个页面开始。
        </p>
      </header>

      <section
        className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2"
        aria-label="菜单"
      >
        <Link
          className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/70 p-5 text-left shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950/40"
          to="/puzzleTest"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full bg-gradient-to-br from-fuchsia-300/35 via-indigo-300/25 to-sky-300/35 blur-2xl dark:from-fuchsia-500/10 dark:via-indigo-500/10 dark:to-sky-500/10"
          />
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                猜人物
              </div>
              <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                通过属性提示来猜出目标电子游戏人物。
              </div>
              <div className="mt-4 inline-flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="rounded-full bg-slate-900/5 px-2 py-1 dark:bg-white/10">
                  /puzzleTest
                </span>
                <span className="rounded-full bg-slate-900/5 px-2 py-1 dark:bg-white/10">
                  路由
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:flex">
                <img src={reactLogo} alt="" className="h-5 w-5" />
              </div>
              <div className="mt-0.5 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300">
                →
              </div>
            </div>
          </div>
        </Link>
      </section>
    </main>
  )
}

export default App
