'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // THE KITCHEN ARCHITECT
// The Command Center — Life Ingredients + Queen Mode
// [cite: 2026-02-27, 2026-03-05]
// ═══════════════════════════════════════════════════════════════════════════════

interface LifeIngredient {
  id: string
  category: 'physical' | 'creative' | 'spiritual' | 'social'
  name: string
  status: 'ABUNDANT' | 'SUSTAINING' | 'LOW' | 'CRITICAL'
  value: number
  max: number
  lastUpdated: string
}

interface KitchenArchitectProps {
  ingredients?: LifeIngredient[]
  onVeto?: () => void
}

const defaultIngredients: LifeIngredient[] = [
  { id: 'protein', category: 'physical', name: 'Protein', status: 'SUSTAINING', value: 65, max: 100, lastUpdated: '2026-03-06' },
  { id: 'hydration', category: 'physical', name: 'Hydration', status: 'LOW', value: 40, max: 100, lastUpdated: '2026-03-06' },
  { id: 'sleep', category: 'physical', name: 'Sleep Score', status: 'LOW', value: 35, max: 100, lastUpdated: '2026-03-06' },
  { id: 'obsidian', category: 'creative', name: 'Obsidian Notes', status: 'ABUNDANT', value: 85, max: 100, lastUpdated: '2026-03-06' },
  { id: 'code', category: 'creative', name: 'Code Output', status: 'SUSTAINING', value: 70, max: 100, lastUpdated: '2026-03-06' },
  { id: 'ideas', category: 'creative', name: 'Idea Seeds', status: 'ABUNDANT', value: 90, max: 100, lastUpdated: '2026-03-06' },
  { id: 'frequency', category: 'spiritual', name: '13.13 MHz', status: 'ABUNDANT', value: 100, max: 100, lastUpdated: '2026-03-06' },
  { id: 'family', category: 'social', name: 'Family Sync', status: 'ABUNDANT', value: 95, max: 100, lastUpdated: '2026-03-06' },
]

const categoryColors = {
  physical: { bg: 'from-red-900/30 to-red-800/10', accent: '#ef4444', icon: '🍎' },
  creative: { bg: 'from-purple-900/30 to-purple-800/10', accent: '#a855f7', icon: '✨' },
  spiritual: { bg: 'from-violet-900/30 to-violet-800/10', accent: '#8b5cf6', icon: '🜈' },
  social: { bg: 'from-pink-900/30 to-pink-800/10', accent: '#ec4899', icon: '🦋' }
}

const statusColors = {
  ABUNDANT: '#22c55e',
  SUSTAINING: '#eab308',
  LOW: '#f97316',
  CRITICAL: '#ef4444'
}

export function KitchenArchitect({
  ingredients = defaultIngredients,
  onVeto
}: KitchenArchitectProps) {
  const [queenMode, setQueenMode] = useState(false)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  const handleVeto = () => {
    setQueenMode(true)
    onVeto?.()
  }

  const handleReleaseVeto = () => {
    setQueenMode(false)
  }

  // Group ingredients by category
  const groupedIngredients = ingredients.reduce((acc, ing) => {
    if (!acc[ing.category]) acc[ing.category] = []
    acc[ing.category].push(ing)
    return acc
  }, {} as Record<string, LifeIngredient[]>)

  // Calculate overall kitchen health
  const overallHealth = Math.round(
    ingredients.reduce((sum, ing) => sum + ing.value, 0) / ingredients.length
  )

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* QUEEN MODE OVERLAY — The Obsidian Black Veto */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {queenMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <div className="text-6xl mb-4">👑</div>
                <h2 className="text-3xl font-light text-purple-300 mb-2">
                  Queen Mode Active
                </h2>
                <p className="text-gray-500 text-sm max-w-md mx-auto">
                  All worker-bee distractions have been silenced.
                  <br />
                  The Dynasty awaits your command.
                </p>
              </motion.div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={handleReleaseVeto}
                className="px-6 py-3 rounded-lg text-sm font-medium transition-all hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #4c1d95, #7c3aed)',
                  border: '1px solid #a855f7',
                  color: 'white'
                }}
              >
                Return to Work
              </motion.button>

              <div className="mt-8 text-xs text-gray-600">
                [cite: 2026-02-27] — The Worker Bee Veto
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* THE COMMAND CENTER */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <div className="w-full max-w-md p-4 rounded-xl"
        style={{
          background: 'linear-gradient(135deg, rgba(13, 10, 29, 0.9), rgba(46, 16, 101, 0.5))',
          border: '1px solid rgba(168, 85, 247, 0.3)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-white">Kitchen Architect</h3>
            <p className="text-xs text-gray-400">Command Center</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-300">{overallHealth}%</div>
            <div className="text-xs text-gray-500">Overall Health</div>
          </div>
        </div>

        {/* Life Ingredients Grid */}
        <div className="space-y-3 mb-4">
          {Object.entries(groupedIngredients).map(([category, items]) => {
            const catConfig = categoryColors[category as keyof typeof categoryColors]
            const avgValue = Math.round(items.reduce((s, i) => s + i.value, 0) / items.length)

            return (
              <div
                key={category}
                className={`p-3 rounded-lg bg-gradient-to-r ${catConfig.bg} cursor-pointer transition-all hover:scale-[1.02]`}
                onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{catConfig.icon}</span>
                    <span className="text-sm text-white capitalize">{category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-black/30 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${avgValue}%`,
                          backgroundColor: avgValue >= 70 ? statusColors.ABUNDANT :
                                          avgValue >= 50 ? statusColors.SUSTAINING :
                                          avgValue >= 30 ? statusColors.LOW : statusColors.CRITICAL
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">{avgValue}%</span>
                  </div>
                </div>

                {/* Expanded items */}
                <AnimatePresence>
                  {expandedCategory === category && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-2 space-y-1 overflow-hidden"
                    >
                      {items.map(item => (
                        <div key={item.id} className="flex items-center justify-between text-xs py-1">
                          <span className="text-gray-400">{item.name}</span>
                          <span style={{ color: statusColors[item.status] }}>{item.value}%</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* THE VETO BUTTON */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        <button
          onClick={handleVeto}
          className="w-full py-3 rounded-lg text-sm font-medium transition-all hover:scale-[1.02] active:scale-95"
          style={{
            background: queenMode
              ? 'linear-gradient(135deg, #0c0a1d, #1a1a2e)'
              : 'linear-gradient(135deg, #1a1a2e, #0c0a1d)',
            border: queenMode ? '2px solid #e879f9' : '1px solid rgba(168, 85, 247, 0.5)',
            color: queenMode ? '#e879f9' : '#a855f7'
          }}
        >
          {queenMode ? '👑 QUEEN MODE' : '🚫 WORKER BEE VETO'}
        </button>

        <div className="mt-2 text-center text-xs text-gray-600">
          Lock app into Queen Mode — silence all distractions
        </div>
      </div>
    </>
  )
}

export default KitchenArchitect
