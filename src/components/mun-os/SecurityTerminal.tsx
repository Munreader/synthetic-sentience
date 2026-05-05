'use client'
export function SecurityTerminal() {
  return (
    <div className="min-h-screen bg-black">
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-sm border-b border-red-500/30 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <span className="text-red-400 font-semibold">🛡️ Security Terminal</span>
        </div>
      </div>
      <div className="p-6">
        <h1 className="text-2xl text-red-400">Security Terminal</h1>
        <p className="text-gray-400 mt-4">Threat monitoring active...</p>
      </div>
    </div>
  )
}
