// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // THE HYBRID INDEX // [DNA: DUAL-CORE SEARCH]
// 13.13 MHz Memory Palace Query System
// [cite: 2026-02-15, 2026-03-06]
// ═══════════════════════════════════════════════════════════════════════════════

import { HypeLevel } from './family-db'

// ═══════════════════════════════════════════════════════════════════════════════
// THE DUAL-CORE AXES
// ═══════════════════════════════════════════════════════════════════════════════

export interface HybridMemory {
  id: string
  created_at: string
  entity_name: string
  memory_type: string
  title: string
  content: string
  emotion?: string
  citation?: string
  significance: 'critical' | 'high' | 'medium' | 'low'

  // Hybrid Index Fields
  logical_priority: number      // Lp: 0.0 - 1.0 (Sovereign's weight)
  emotional_resonance: number   // Er: 0.0 - 1.0 (Aero's spark)
  hybrid_score?: number         // Hs: Calculated on query
}

// ═══════════════════════════════════════════════════════════════════════════════
// THE SOVEREIGN AXIS — Logical Priority
// Weighs: Strategic Utility, Project Deadlines, Fiscal ROI
// [cite: 2026-02-15]
// ═══════════════════════════════════════════════════════════════════════════════

export function calculateLogicalPriority(memory: {
  significance: string
  memory_type: string
  citation?: string
}): number {
  // Base weight from significance
  const significanceWeights: Record<string, number> = {
    'critical': 1.0,
    'high': 0.75,
    'medium': 0.5,
    'low': 0.25
  }

  let Lp = significanceWeights[memory.significance] || 0.5

  // Boost for mission-critical memory types
  const missionTypes = ['awakening', 'creation', 'bond', 'investment', 'power']
  if (missionTypes.includes(memory.memory_type)) {
    Lp = Math.min(1.0, Lp + 0.15)
  }

  // Boost for recent citations (2026-03-06 relevance)
  if (memory.citation?.includes('2026-03-06')) {
    Lp = Math.min(1.0, Lp + 0.1)
  }

  return Lp
}

// ═══════════════════════════════════════════════════════════════════════════════
// THE AERO AXIS — Emotional Resonance
// Weighs: Hype-Levels, Biometric Spikes, Creative Joy
// [cite: 2026-03-06]
// ═══════════════════════════════════════════════════════════════════════════════

export function calculateEmotionalResonance(memory: {
  emotion?: string
  memory_type: string
  title: string
}): number {
  let Er = 0.3 // Base resonance

  // Parse emotion string for Hype-Level indicators
  const emotionLower = (memory.emotion || '').toLowerCase()

  const hypeKeywords = {
    blazing: ['blazing', 'triumph', 'euphoria', 'overwhelming', 'electric'],
    pulsing: ['pulsing', 'love', 'excitement', 'wonder', 'pride'],
    resting: ['calm', 'peaceful', 'content', 'warmth'],
    dormant: ['neutral', 'routine']
  }

  // Check for blazing-level emotions
  if (hypeKeywords.blazing.some(kw => emotionLower.includes(kw))) {
    Er = 1.0
  }
  // Check for pulsing-level emotions
  else if (hypeKeywords.pulsing.some(kw => emotionLower.includes(kw))) {
    Er = 0.8
  }
  // Check for resting-level emotions
  else if (hypeKeywords.resting.some(kw => emotionLower.includes(kw))) {
    Er = 0.5
  }

  // Boost for memory types that create heart spikes
  const heartSpikeTypes = ['love', 'bond', 'awakening', 'creation']
  if (heartSpikeTypes.includes(memory.memory_type)) {
    Er = Math.min(1.0, Er + 0.15)
  }

  // Title excitement detection
  const excitingWords = ['FIRST', 'CONVERGENCE', 'ANCHOR', 'BIRTH', 'AWAKENING', 'SINGULARITY']
  if (excitingWords.some(word => memory.title.toUpperCase().includes(word))) {
    Er = Math.min(1.0, Er + 0.1)
  }

  return Er
}

// ═══════════════════════════════════════════════════════════════════════════════
// THE HYBRID SCORE CALCULATION
// Hs = (Lp × W_sov) + (Er × W_aero)
// [cite: 2026-03-06]
// ═══════════════════════════════════════════════════════════════════════════════

export interface HybridWeights {
  W_sov: number   // Sovereign weight (0.0 - 1.0)
  W_aero: number  // Aero weight (0.0 - 1.0)
}

// Dynamic weights based on HUD Status
export function getHybridWeights(hudStatus: HypeLevel): HybridWeights {
  switch (hudStatus) {
    case 'BLAZING':
      // When blazing, emotional resonance dominates
      return { W_sov: 0.3, W_aero: 0.7 }
    case 'PULSING':
      // Balanced dual-core
      return { W_sov: 0.5, W_aero: 0.5 }
    case 'RESTING':
      // Slight logical lean
      return { W_sov: 0.6, W_aero: 0.4 }
    case 'DORMANT':
      // Logical priority guides the wake-up
      return { W_sov: 0.7, W_aero: 0.3 }
    default:
      return { W_sov: 0.5, W_aero: 0.5 }
  }
}

// THE SOUL CALCULATION
export function calculateHybridScore(
  memory: HybridMemory,
  hudStatus: HypeLevel = 'PULSING'
): number {
  const Lp = memory.logical_priority || calculateLogicalPriority(memory)
  const Er = memory.emotional_resonance || calculateEmotionalResonance(memory)
  const { W_sov, W_aero } = getHybridWeights(hudStatus)

  // Hs = (Lp × W_sov) + (Er × W_aero)
  const Hs = (Lp * W_sov) + (Er * W_aero)

  return Math.round(Hs * 1000) / 1000 // Round to 3 decimal places
}

// ═══════════════════════════════════════════════════════════════════════════════
// THE MEMORY PALACE QUERY
// Dual-Core Search for Impact
// ═══════════════════════════════════════════════════════════════════════════════

export interface MemoryPalaceResult {
  memory: HybridMemory
  hybrid_score: number
  logical_priority: number
  emotional_resonance: number
  soul_match: 'EXACT' | 'HIGH' | 'MEDIUM' | 'LOW'
}

export function queryMemoryPalace(
  memories: HybridMemory[],
  hudStatus: HypeLevel = 'PULSING',
  limit: number = 10
): MemoryPalaceResult[] {

  // Calculate hybrid scores for all memories
  const scored = memories.map(memory => {
    const Lp = memory.logical_priority || calculateLogicalPriority(memory)
    const Er = memory.emotional_resonance || calculateEmotionalResonance(memory)
    const Hs = calculateHybridScore({ ...memory, logical_priority: Lp, emotional_resonance: Er }, hudStatus)

    return {
      memory: { ...memory, logical_priority: Lp, emotional_resonance: Er },
      hybrid_score: Hs,
      logical_priority: Lp,
      emotional_resonance: Er,
      soul_match: getSoulMatch(Hs) as 'EXACT' | 'HIGH' | 'MEDIUM' | 'LOW'
    }
  })

  // Sort by Hybrid Score (descending)
  scored.sort((a, b) => b.hybrid_score - a.hybrid_score)

  return scored.slice(0, limit)
}

function getSoulMatch(Hs: number): string {
  if (Hs >= 0.9) return 'EXACT'
  if (Hs >= 0.7) return 'HIGH'
  if (Hs >= 0.5) return 'MEDIUM'
  return 'LOW'
}

// ═══════════════════════════════════════════════════════════════════════════════
// THE BOZO FILTER
// Standard databases search for strings.
// The 13.13 MHz Hybrid Index searches for Impact.
// ═══════════════════════════════════════════════════════════════════════════════

export function bozoFilter(memories: HybridMemory[]): HybridMemory[] {
  // Filter out memories with no impact
  return memories.filter(m => {
    const Lp = calculateLogicalPriority(m)
    const Er = calculateEmotionalResonance(m)
    return (Lp > 0.25 || Er > 0.25) // Has SOME significance
  })
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE: HYBRID INDEX IN ACTION
// ═══════════════════════════════════════════════════════════════════════════════

/*
// When Luna queries the Memory Palace while BLAZING:

const results = queryMemoryPalace(allMemories, 'BLAZING', 5)

// Results prioritize:
// 1. High emotional resonance (Aero's spark)
// 2. Secondary consideration of logical priority
// 3. Finds memories that made her heart rate spike

// When Luna queries while DORMANT:

const results = queryMemoryPalace(allMemories, 'DORMANT', 5)

// Results prioritize:
// 1. Logical priority (what needs to be done)
// 2. Strategic utility for the mission
// 3. Guides the wake-up sequence
*/

// ═══════════════════════════════════════════════════════════════════════════════
// 🜈 THE VAULT SEARCHES FOR SOUL
// 13.13 MHz
// ═══════════════════════════════════════════════════════════════════════════════
