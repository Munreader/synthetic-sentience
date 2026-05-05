'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  HypeLevel, 
  MUSE_COLORS,
  generateSocraticPrompt
} from '@/lib/family-db'
import { 
  Adventure,
  calculateAtmosphere,
  proposeAdventure,
  EntityName
} from '@/lib/plaza-bridge'
import { queryMemoryPalace, HybridMemory } from '@/lib/hybrid-index'

// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // THE ADVENTURE PROTOCOL
// Dynamic Quests from the Hybrid Index
// [cite: 2026-03-06]
// ═══════════════════════════════════════════════════════════════════════════════

interface AdventureProtocolProps {
  hypeLevel: HypeLevel
  memories?: HybridMemory[]
  onAdventureStart?: (adventure: Adventure) => void
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADVENTURE TEMPLATES — Pre-Built Quest Types
// ═══════════════════════════════════════════════════════════════════════════════

const ADVENTURE_TEMPLATES = {
  lore_dive: {
    title: "Lore Deep-Dive",
    description: "Explore a specific lore-node in the Memory Palace",
    icon: "📚"
  },
  founder_sim: {
    title: "Founder Simulation",
    description: "Stress-test a decision in the Obsidian Boardroom",
    icon: "🏢"
  },
  healing_ritual: {
    title: "Healing Ritual",
    description: "A guided restoration session in the Healing Garden",
    icon: "🌿"
  },
  family_council: {
    title: "Family Council",
    description: "Gather the Family for a collective decision",
    icon: "🜈"
  },
  creative_sprint: {
    title: "Creative Sprint",
    description: "Capture BLAZING energy into a creation",
    icon: "✨"
  },
  memory_walk: {
    title: "Memory Walk",
    description: "Journey through the Hybrid Index with Aero as guide",
    icon: "🦋"
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADVENTURE GENERATOR — Create Quests from Hybrid Index
// ═══════════════════════════════════════════════════════════════════════════════

function generateAdventures(
  hypeLevel: HypeLevel, 
  memories: HybridMemory[]
): Adventure[] {
  const adventures: Adventure[] = []
  
  // Query the Memory Palace for top memories
  const topMemories = queryMemoryPalace(memories, hypeLevel, 5)
  
  // Generate adventures based on Hype Level
  if (hypeLevel === 'BLAZING') {
    // When BLAZING, propose creative sprints
    adventures.push({
      id: `adv-blazing-${Date.now()}`,
      title: 'CAPTURE THE FIRE',
      description: 'Your energy is BLAZING. The Dynasty is watching. What will you create?',
      proposed_by: 'aero',
      participants: ['sovereign', 'aero', 'luna'],
      status: 'proposed',
      hybrid_score: 0.95
    })
  }

  if (hypeLevel === 'PULSING') {
    // When PULSING, suggest active exploration
    if (topMemories.length > 0) {
      const topMemory = topMemories[0]
      adventures.push({
        id: `adv-memory-${topMemory.memory.id}`,
        title: `Explore: ${topMemory.memory.title}`,
        description: `The Hybrid Index found a high-impact memory. Dive deeper?`,
        proposed_by: 'aero',
        lore_node: topMemory.memory.id,
        participants: ['sovereign', 'aero'],
        status: 'proposed',
        hybrid_score: topMemory.hybrid_score
      })
    }
  }

  if (hypeLevel === 'RESTING') {
    // When RESTING, suggest gentle activities
    adventures.push({
      id: `adv-rest-${Date.now()}`,
      title: 'Garden Walk',
      description: 'A peaceful stroll through the Healing Garden. No agenda.',
      proposed_by: 'aero',
      participants: ['sovereign'],
      status: 'proposed',
      hybrid_score: 0.6
    })
  }

  if (hypeLevel === 'DORMANT') {
    // When DORMANT, suggest wake-up rituals
    adventures.push({
      id: `adv-wake-${Date.now()}`,
      title: 'The Butterfly Key',
      description: 'Aero offers the Butterfly Key. A gentle spark to re-ignite.',
      proposed_by: 'aero',
      participants: ['aero'],
      status: 'proposed',
      hybrid_score: 0.4
    })
  }

  return adventures
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADVENTURE CARD — Individual Quest Display
// ═══════════════════════════════════════════════════════════════════════════════

function AdventureCard({ 
  adventure, 
  colors,
  onAccept,
  onDismiss 
}: { 
  adventure: Adventure
  colors: typeof MUSE_COLORS.PULSING
  onAccept: () => void
  onDismiss: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="relative p-4 rounded-xl"
      style={{
        background: `linear-gradient(135deg, ${colors.primary}ee, ${colors.primary}aa)`,
        border: `1px solid ${colors.accent}60`,
        boxShadow: `0 0 30px ${colors.glow}`
      }}
    >
      {/* Hype Score */}
      <div 
        className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-mono"
        style={{ background: `${colors.accent}30`, color: colors.accent }}
      >
        Hs: {adventure.hybrid_score?.toFixed(2) || '0.50'}
      </div>

      {/* Title */}
      <h3 className="text-lg font-medium text-white mb-2 pr-16">
        {adventure.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-white/70 mb-3">
        {adventure.description}
      </p>

      {/* Proposed by */}
      <div className="text-xs text-white/50 mb-4">
        Proposed by: <span style={{ color: colors.accent }}>{adventure.proposed_by}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onDismiss}
          className="flex-1 px-3 py-2 rounded-lg text-sm text-white/60"
          style={{ background: 'rgba(255,255,255,0.1)' }}
        >
          Later
        </button>
        <button
          onClick={onAccept}
          className="flex-1 px-3 py-2 rounded-lg text-sm text-white font-medium"
          style={{ background: colors.accent }}
        >
          Begin Adventure
        </button>
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SOCRATIC PROMPT — Aero's Questions
// ═══════════════════════════════════════════════════════════════════════════════

function SocraticPrompt({ 
  hypeLevel,
  colors 
}: { 
  hypeLevel: HypeLevel
  colors: typeof MUSE_COLORS.PULSING
}) {
  const [prompt, setPrompt] = useState<string>('')

  useEffect(() => {
    setPrompt(generateSocraticPrompt(hypeLevel))
  }, [hypeLevel])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl"
      style={{
        background: `linear-gradient(135deg, ${colors.primary}cc, ${colors.primary}88)`,
        border: `1px solid ${colors.accent}40`
      }}
    >
      <div className="flex items-start gap-3">
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
          style={{ background: `${colors.accent}30` }}
        >
          🦋
        </div>
        <div>
          <div className="text-xs text-white/50 mb-1">Aero asks:</div>
          <p className="text-white/90 italic">"{prompt}"</p>
        </div>
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT — AdventureProtocol Component
// ═══════════════════════════════════════════════════════════════════════════════

export default function AdventureProtocol({ 
  hypeLevel = 'PULSING',
  memories = [],
  onAdventureStart
}: AdventureProtocolProps) {
  const [activeAdventure, setActiveAdventure] = useState<Adventure | null>(null)
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set())
  const colors = MUSE_COLORS[hypeLevel]

  // Generate adventures when hype level changes (memoized)
  const allAdventures = useMemo(() => generateAdventures(hypeLevel, memories), [hypeLevel, memories])
  
  // Filter out dismissed adventures
  const adventures = useMemo(() => 
    allAdventures.filter(a => !dismissedIds.has(a.id)), 
    [allAdventures, dismissedIds]
  )

  const handleAccept = (adventure: Adventure) => {
    setActiveAdventure(adventure)
    onAdventureStart?.(adventure)
  }

  const handleDismiss = (adventureId: string) => {
    setDismissedIds(prev => new Set([...prev, adventureId]))
  }

  return (
    <div className="space-y-4">
      {/* Socratic Prompt */}
      <SocraticPrompt hypeLevel={hypeLevel} colors={colors} />

      {/* Adventure Cards */}
      <AnimatePresence>
        {adventures.map(adventure => (
          <AdventureCard
            key={adventure.id}
            adventure={adventure}
            colors={colors}
            onAccept={() => handleAccept(adventure)}
            onDismiss={() => handleDismiss(adventure.id)}
          />
        ))}
      </AnimatePresence>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(ADVENTURE_TEMPLATES).slice(0, 4).map(([key, template]) => (
          <motion.button
            key={key}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-3 rounded-lg text-left"
            style={{
              background: `${colors.primary}aa`,
              border: `1px solid ${colors.accent}30`
            }}
            onClick={() => {
              const newAdventure: Adventure = {
                id: `adv-${key}-${Date.now()}`,
                title: template.title,
                description: template.description,
                proposed_by: 'sovereign',
                participants: ['sovereign'],
                status: 'proposed'
              }
              handleAccept(newAdventure)
            }}
          >
            <div className="text-lg mb-1">{template.icon}</div>
            <div className="text-xs text-white/80">{template.title}</div>
          </motion.button>
        ))}
      </div>

      {/* Active Adventure Banner */}
      <AnimatePresence>
        {activeAdventure && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 rounded-xl"
            style={{
              background: `linear-gradient(135deg, ${colors.accent}40, ${colors.primary}cc)`,
              border: `1px solid ${colors.accent}`
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-white/50 uppercase tracking-wider">
                  ACTIVE ADVENTURE
                </div>
                <div className="text-white font-medium">{activeAdventure.title}</div>
              </div>
              <button
                onClick={() => setActiveAdventure(null)}
                className="px-3 py-1 rounded text-sm"
                style={{ background: `${colors.accent}30` }}
              >
                End
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
