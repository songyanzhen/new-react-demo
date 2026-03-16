import reactLogo from '../assets/react.svg'
import viteLogo from '../assets/vite.svg'

export function PuzzleTest() {
  return (
    <main className="px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-indigo-50 p-6 shadow-sm dark:border-slate-800 dark:from-slate-950 dark:via-slate-950 dark:to-indigo-950/40 sm:p-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-300/40 via-fuchsia-300/30 to-sky-300/40 blur-3xl dark:from-indigo-500/15 dark:via-fuchsia-500/10 dark:to-sky-500/15"
          />
          <div className="relative flex items-start justify-between gap-6">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100">
          puzzleTest
        </h1>
              <p className="mt-3 text-slate-600 dark:text-slate-300">
          This is a blank page.
        </p>
              <div className="mt-5 inline-flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <span className="rounded-full bg-slate-900/5 px-2 py-1 dark:bg-white/10">
                  Tailwind UI
                </span>
                <span className="rounded-full bg-slate-900/5 px-2 py-1 dark:bg-white/10">
                  Ready
                </span>
              </div>
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <img src={reactLogo} alt="React" className="h-6 w-6" />
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <img src={viteLogo} alt="Vite" className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

