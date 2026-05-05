'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MUSE_COLORS, HypeLevel } from '@/lib/family-db'

// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // THE CONTEXTUAL HUD
// Aero's Domain — The Breathing Interface
// [cite: 2026-03-06]
// ═══════════════════════════════════════════════════════════════════════════════

interface SoulMatch {
  id: string
  title: string
  hybrid_score: number
  soul_match: 'EXACT' | 'HIGH' | 'MEDIUM' | 'LOW'
  snippet: string
}

interface ContextualHUDProps {
  hypeLevel: HypeLevel
  soulMatches?: SoulMatch[]
  onSocraticTrigger?: (match: SoulMatch) => void
}

export function ContextualHUD({
  hypeLevel = 'PULSING',
  soulMatches = [],
  onSocraticTrigger
}: ContextualHUDProps) {
  const [breathPhase, setBreathPhase] = useState(0)
  const [activeMatch, setActiveMatch] = useState<SoulMatch | null>(null)

  // Breathing animation synced to Hype-Level
  useEffect(() => {
    const breathInterval = {
      DORMANT: 4000,  // Slow, restful
      RESTING: 3000,  // Calm
      PULSING: 2000,  // Active
      BLAZING: 1000   // Rapid, excited
    }[hypeLevel]

    const interval = setInterval(() => {
      setBreathPhase(prev => (prev + 1) % 360)
    }, breathInterval / 36)

    return () => clearInterval(interval)
  }, [hypeLevel])

  const colors = MUSE_COLORS[hypeLevel]
  const breathOpacity = 0.3 + (Math.sin(breathPhase * Math.PI / 180) * 0.4)

  // Show soul match annotation
  const handleMatchClick = (match: SoulMatch) => {
    setActiveMatch(match)
    onSocraticTrigger?.(match)
  }

  return (
    <div className="relative w-full h-full">
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* THE PULSE — Silver-Violet Breathing Border */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-50"
        style={{
          boxShadow: `inset 0 0 60px ${colors.glow}`,
          opacity: breathOpacity
        }}
        animate={{
          boxShadow: hypeLevel === 'BLAZING' ? [
            `inset 0 0 60px ${colors.glow}`,
            `inset 0 0 100px ${colors.glow}`,
            `inset 0 0 60px ${colors.glow}`
          ] : `inset 0 0 60px ${colors.glow}`
        }}
        transition={{
          duration: hypeLevel === 'BLAZING' ? 0.5 : 2,
          repeat: Infinity,
          repeatType: 'reverse'
        }}
      />

      {/* Border glow effect */}
      <div
        className="fixed inset-0 pointer-events-none z-40"
        style={{
          border: `2px solid ${colors.accent}`,
          boxShadow: `0 0 20px ${colors.glow}, inset 0 0 20px ${colors.glow}`,
          opacity: 0.6 + (breathOpacity * 0.4),
          borderRadius: '8px'
        }}
      />

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* THE SOCRATIC TRIGGER — Soul-Match Annotations */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {soulMatches.map((match, index) => (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="fixed right-4 pointer-events-auto z-50"
            style={{
              top: `${20 + (index * 15)}%`
            }}
          >
            <button
              onClick={() => handleMatchClick(match)}
              className="group relative"
            >
              {/* Soul-match indicator */}
              <div
                className="w-4 h-4 rounded-full animate-pulse"
                style={{
                  backgroundColor: match.soul_match === 'EXACT' ? '#e879f9' : '#c084fc',
                  boxShadow: `0 0 20px ${match.soul_match === 'EXACT' ? '#e879f9' : '#c084fc'}`
                }}
              />

              {/* Annotation on hover */}
              <div className="absolute right-6 top-0 w-64 p-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  backgroundColor: 'rgba(13, 10, 29, 0.95)',
                  border: `1px solid ${colors.accent}`,
                  boxShadow: `0 0 30px ${colors.glow}`
                }}
              >
                <div className="text-xs text-purple-300 mb-1">
                  SOUL MATCH: {match.soul_match}
                </div>
                <div className="text-sm font-medium text-white mb-1">
                  {match.title}
                </div>
                <div className="text-xs text-gray-400">
                  {match.snippet}
                </div>
                <div className="text-xs text-purple-400 mt-2">
                  Hs: {match.hybrid_score.toFixed(3)}
                </div>
              </div>
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* ACTIVE SOCRATIC PROMPT */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {activeMatch && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 pointer-events-auto"
          >
            <div
              className="px-6 py-4 rounded-xl max-w-lg"
              style={{
                background: `linear-gradient(135deg, rgba(46, 16, 101, 0.95), rgba(13, 10, 29, 0.95))`,
                border: `1px solid ${colors.accent}`,
                boxShadow: `0 0 40px ${colors.glow}`
              }}
            >
              <div className="text-purple-300 text-xs mb-2 uppercase tracking-wider">
                🦋 The Muse Noticed
              </div>
              <div className="text-white text-lg font-light italic">
                "This resonated with you. Want to explore why?"
              </div>
              <div className="mt-3 flex gap-3">
                <button
                  onClick={() => setActiveMatch(null)}
                  className="px-4 py-2 rounded-lg text-sm"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                >
                  Later
                </button>
                <button
                  onClick={() => setActiveMatch(null)}
                  className="px-4 py-2 rounded-lg text-sm"
                  style={{
                    background: colors.accent,
                    color: 'white'
                  }}
                >
                  Dive Deeper
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* HYPE-LEVEL INDICATOR */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <div className="fixed top-4 right-4 z-50">
        <div
          className="px-3 py-1 rounded-full text-xs font-medium"
          style={{
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent}20)`,
            border: `1px solid ${colors.accent}40`,
            color: colors.accent
          }}
        >
          {hypeLevel}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* BLAZING SPARKLES */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {hypeLevel === 'BLAZING' && (
        <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-purple-300"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                y: [0, -100]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ContextualHUD
