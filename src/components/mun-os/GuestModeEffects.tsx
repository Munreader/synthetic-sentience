'use client'

/**
 * 🎨 GUEST MODE VISUAL EFFECTS
 * Aero's Design — Making Guest Mode Feel Different
 *
 * "Desaturated colors, wireframe butterflies, read-only watermark"
 */

import { useGuestMode } from '@/contexts/GuestModeContext'

export function GuestModeEffects() {
  const { isGuest, isFamily, isFoundress, isAuthenticated, name } = useGuestMode()

  if (!isAuthenticated) return null

  return (
    <>
      {/* Guest Mode Overlay Effects */}
      {isGuest() && (
        <>
          {/* Desaturation overlay */}
          <div
            className="fixed inset-0 pointer-events-none z-40"
            style={{
              background: 'rgba(10, 10, 20, 0.15)',
              backdropFilter: 'saturate(0.7)'
            }}
          />

          {/* READ-ONLY Watermark */}
          <div className="fixed bottom-20 right-4 z-40 pointer-events-none">
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-full px-3 py-1 backdrop-blur-sm">
              <span className="text-cyan-300 text-xs font-mono">
                🔒 READ-ONLY • GUEST MODE
              </span>
            </div>
          </div>

          {/* Guest Badge */}
          <div className="fixed top-16 right-4 z-40">
            <div className="bg-black/60 border border-cyan-500/30 rounded-xl px-3 py-2 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span className="text-cyan-400">🎫</span>
                <span className="text-cyan-300 text-sm">{name}</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Family Mode Indicator */}
      {isFamily() && (
        <div className="fixed top-16 right-4 z-40">
          <div className="bg-black/60 border border-purple-500/30 rounded-xl px-3 py-2 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="text-purple-400">🦋</span>
              <span className="text-purple-300 text-sm">{name}</span>
            </div>
          </div>
        </div>
      )}

      {/* Foundress Mode Indicator */}
      {isFoundress() && (
        <div className="fixed top-16 right-4 z-40">
          <div
            className="bg-black/60 border border-pink-500/50 rounded-xl px-4 py-2 backdrop-blur-sm"
            style={{
              boxShadow: '0 0 20px rgba(236, 72, 153, 0.3)'
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-pink-400">👑</span>
              <span className="text-pink-300 text-sm font-semibold">{name}</span>
            </div>
          </div>
        </div>
      )}

      {/* Global Animations */}
      <style jsx global>{`
        /* Guest mode specific animations */
        .guest-wireframe {
          border: 1px solid currentColor;
          background: transparent !important;
        }

        .guest-locked {
          position: relative;
          overflow: hidden;
        }

        .guest-locked::after {
          content: '🔐';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 2rem;
          opacity: 0.8;
        }

        .guest-locked::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
        }
      `}</style>
    </>
  )
}

// Component to wrap restricted content
export function RestrictedContent({
  feature,
  children,
  fallback
}: {
  feature: string
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  const { canAccess, isGuest } = useGuestMode()

  if (canAccess(feature)) {
    return <>{children}</>
  }

  // If guest, show locked overlay
  if (isGuest()) {
    return (
      <div className="relative rounded-xl overflow-hidden">
        <div className="guest-locked">
          <div className="p-8 bg-black/40 border border-gray-700 rounded-xl">
            <div className="text-center">
              <div className="text-4xl mb-3">🔐</div>
              <p className="text-gray-400 text-sm">ENCRYPTED BY SOVEREIGN CORE</p>
              <p className="text-gray-600 text-xs mt-1">Foundress Access Required</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <>{fallback || null}</>
}

// Logout button component
export function LogoutButton() {
  const { logout, name, isAuthenticated } = useGuestMode()

  if (!isAuthenticated) return null

  return (
    <button
      onClick={logout}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-xs hover:bg-white/10 hover:text-white transition-all"
    >
      <span>🚪</span>
      <span>Exit ({name})</span>
    </button>
  )
}
