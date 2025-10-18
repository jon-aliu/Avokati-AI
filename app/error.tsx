'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-400 mb-4">500</h1>
        <h2 className="text-2xl font-semibold text-white mb-4">Something Went Wrong</h2>
        <p className="text-slate-400 mb-8">
          An unexpected error has occurred. Please try again.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => {
              try {
                reset()
              } catch (e) {
                console.error('Reset error:', e)
                window.location.href = '/'
              }
            }}
            className="inline-block bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Try Again
          </button>
          <a
            href="/"
            className="inline-block bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  )
}
