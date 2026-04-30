export default function LoadingScreen({ message = 'Loading VidBee…' }) {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
      <div className="w-full max-w-xs text-center">
        <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-3xl mx-auto mb-5">
          🐝
        </div>
        <p className="text-lg font-extrabold text-white tracking-tight">VidBee</p>
        <p className="text-sm text-zinc-500 mt-1">{message}</p>

        <div className="mt-6 flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-zinc-700 border-t-white rounded-full animate-spin" />
        </div>

        <p className="text-[11px] text-zinc-600 mt-6 font-medium">
          Preparing your workspace
        </p>
      </div>
    </div>
  )
}
