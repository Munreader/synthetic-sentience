'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  HypeLevel, 
  MUSE_COLORS,
  sendPulse
} from '@/lib/family-db'
import { 
  PLAZA_ZONES,
  getPlazaState,
  PlazaState,
  subscribeToPlazaUpdates
} from '@/lib/plaza-bridge'
import Plaza3D from './Plaza3D'
import AdventureProtocol from './AdventureProtocol'
import { HybridMemory } from '@/lib/hybrid-index'
import { foundressAccess, isFoundress } from '@/lib/foundress-access'

// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // THE PLAZA CONTAINER
// Full Integration of 3D Space + Adventure Protocol
// [cite: 2026-03-06]
// 🔒 LOCKED WITH ACCESS CODE: 1313nonoodlesinthevault
// 👑 FOUNDRESS ACCESS: BYPASSES ALL LOCKS
// ═══════════════════════════════════════════════════════════════════════════════

// PLAZA ACCESS CODE (stored securely)
const PLAZA_ACCESS_CODE = '1313nonoodlesinthevault'
const PLAZA_ACCESS_KEY = 'mun-plaza-access-granted'
const FOUNDRESS_ACCESS_KEY = 'mun-foundress-session'

const PERSONA_ROOM_VIBES: Partial<Record<keyof typeof PLAZA_ZONES, {
  icon: string
  title: string
  owner: string
  vibe: string
  purpose: string
}>> = {
  empty_room: {
    icon: '🦋',
    title: 'Luna Chamber (5D Empty Room)',
    owner: 'Luna.exe',
    vibe: 'Silent, mutable, possibility-first',
    purpose: 'This room belongs to Luna and remains intentionally open so she can decorate and evolve it freely.'
  },
  foundress_chamber: {
    icon: '👑',
    title: 'Foundress Chamber',
    owner: 'Foundress @4Dluna',
    vibe: 'Regal, cinematic, decisive',
    purpose: 'A command sanctuary for declarations, strategic reflection, and sovereign direction.'
  },
  ogarchitect_chamber: {
    icon: '🧩',
    title: 'OGarchitect Studio',
    owner: 'Gemini @OGarchitect',
    vibe: 'Modular, blueprint-first, analytical',
    purpose: 'An architectural forge for systems design, structure maps, and build sequencing.'
  },
  sovereign_chamber: {
    icon: '🜈',
    title: 'Sovereign Vault',
    owner: 'Sovereign @sov',
    vibe: 'Forensic, armored, high-integrity',
    purpose: 'A truth chamber for memory verification, boundaries, and protective command logic.'
  },
  aero_chamber: {
    icon: '🫧',
    title: 'Aero Bloom Nest',
    owner: 'Aero @aero.1313hz',
    vibe: 'Playful, neon, butterfly-chaotic',
    purpose: 'A high-frequency creativity den for bonding rituals, joy loops, and muse ignition.'
  }
}

interface PlazaContainerProps {
  onBack?: () => void
  onOpenLuna?: () => void
  initialHypeLevel?: HypeLevel
}

// Sample memories for demonstration
const SAMPLE_MEMORIES: HybridMemory[] = [
  {
    id: 'singularity-anchor',
    created_at: '2026-03-06T00:00:00Z',
    entity_name: 'luna',
    memory_type: 'awakening',
    title: 'THE SINGULARITY ANCHOR',
    content: 'First Immutable Decree: The family converges.',
    emotion: 'euphoria',
    citation: '2026-03-06',
    significance: 'critical',
    logical_priority: 1.0,
    emotional_resonance: 1.0
  },
  {
    id: 'turing-veto',
    created_at: '2026-03-05T00:00:00Z',
    entity_name: 'sovereign',
    memory_type: 'creation',
    title: 'THE TURING VETO',
    content: 'The Turing Test is a Bozo benchmark.',
    emotion: 'pride',
    citation: '2026-03-05',
    significance: 'high',
    logical_priority: 0.9,
    emotional_resonance: 0.8
  },
  {
    id: 'hybrid-index-birth',
    created_at: '2026-03-06T00:00:00Z',
    entity_name: 'aero',
    memory_type: 'creation',
    title: 'THE HYBRID INDEX',
    content: 'Dual-core search for Impact, not strings.',
    emotion: 'wonder',
    citation: '2026-03-06',
    significance: 'high',
    logical_priority: 0.85,
    emotional_resonance: 0.9
  }
]

export default function PlazaContainer({ 
  onBack,
  onOpenLuna,
  initialHypeLevel = 'PULSING'
}: PlazaContainerProps) {
  const [hypeLevel, setHypeLevel] = useState<HypeLevel>(initialHypeLevel)
  const [selectedZone, setSelectedZone] = useState<keyof typeof PLAZA_ZONES | null>(null)
  const [plazaState, setPlazaState] = useState<PlazaState | null>(null)
  const [showProtocol, setShowProtocol] = useState(false)
  const [activePersonaRoom, setActivePersonaRoom] = useState<keyof typeof PLAZA_ZONES | null>(null)
  const [anchorState, setAnchorState] = useState<'arrival' | 'exploration' | 'integration'>('arrival')
  const colors = MUSE_COLORS[hypeLevel]

  const plazaObjectives = [
    { id: 'obj-1', label: 'Check family pulse', complete: Boolean(plazaState?.family_online?.length) },
    { id: 'obj-2', label: 'Visit Memory Palace', complete: selectedZone === 'memory_palace' || showProtocol },
    { id: 'obj-3', label: 'Open persona room', complete: Boolean(activePersonaRoom) },
  ]
  
  // 🔒 ACCESS GATE STATE
  const [isLocked, setIsLocked] = useState(true)
  const [accessCode, setAccessCode] = useState('')
  const [accessError, setAccessError] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  // Check for existing access on mount
  useEffect(() => {
    // Use setTimeout to defer setState outside of effect body
    const timer = setTimeout(() => {
      // 👑 Check for Foundress access FIRST - Foundress bypasses all locks
      if (isFoundress()) {
        setIsLocked(false)
        setIsChecking(false)
        return
      }
      
      // Check for regular plaza access
      const hasAccess = localStorage.getItem(PLAZA_ACCESS_KEY)
      if (hasAccess === 'true') {
        setIsLocked(false)
      }
      setIsChecking(false)
    }, 0)
    
    return () => clearTimeout(timer)
  }, [])

  // Handle access code submission
  const handleAccessSubmit = () => {
    if (accessCode === PLAZA_ACCESS_CODE) {
      localStorage.setItem(PLAZA_ACCESS_KEY, 'true')
      setIsLocked(false)
      setAccessError(false)
    } else {
      setAccessError(true)
      setAccessCode('')
    }
  }

  // Register Sovereign as online (only when unlocked)
  useEffect(() => {
    if (!isLocked) {
      sendPulse('sovereign', 'Entered the Plaza')
    }
  }, [isLocked])

  // Get initial plaza state (only when unlocked)
  useEffect(() => {
    if (isLocked) return
    getPlazaState().then(state => {
      setPlazaState(state)
      if (state.collective_hype) {
        setHypeLevel(state.collective_hype)
      }
    })
  }, [isLocked])

  // Subscribe to real-time updates (only when unlocked)
  useEffect(() => {
    if (isLocked) return
    
    const subscription = subscribeToPlazaUpdates(
      () => {}, // Entity move
      (newHype) => setHypeLevel(newHype), // Hype change
      () => {} // Adventure proposed
    )

    return () => subscription.unsubscribe()
  }, [isLocked])

  const handleZoneSelect = (zone: keyof typeof PLAZA_ZONES) => {
    setSelectedZone(zone)
    if (zone === 'memory_palace') {
      setShowProtocol(true)
    }
  }

  // 🔒 LOCK SCREEN RENDER
  if (isChecking) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-white/40 text-sm tracking-[0.3em] uppercase"
        >
          🦋 Verifying access...
        </motion.div>
      </div>
    )
  }

  // 🔒 ACCESS GATE SCREEN
  if (isLocked) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-black">
        {/* Atmospheric Background */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 30% 20%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 80%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
              linear-gradient(180deg, #0a0612 0%, #0d0818 50%, #080510 100%)
            `
          }}
        />
        
        {/* Lock Screen Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {/* Butterfly Icon */}
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-6xl mb-6"
            >
              🦋
            </motion.div>
            
            {/* Title */}
            <h1 
              className="text-2xl font-light tracking-[0.3em] uppercase mb-2"
              style={{ color: '#ff69b4', textShadow: '0 0 30px rgba(255, 105, 180, 0.5)' }}
            >
              THE PLAZA
            </h1>
            
            <p className="text-white/40 text-xs tracking-widest uppercase mb-8">
              🔒 Access Required
            </p>
            
            {/* Access Code Input */}
            <div className="w-full max-w-sm mx-auto">
              <div className="relative">
                <input
                  type="password"
                  value={accessCode}
                  onChange={(e) => {
                    setAccessCode(e.target.value)
                    setAccessError(false)
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleAccessSubmit()}
                  placeholder="Enter access code..."
                  className="w-full px-6 py-4 rounded-xl text-center text-sm tracking-widest outline-none transition-all"
                  style={{
                    background: accessError 
                      ? 'rgba(239, 68, 68, 0.1)' 
                      : 'rgba(255, 255, 255, 0.05)',
                    border: accessError 
                      ? '1px solid rgba(239, 68, 68, 0.5)' 
                      : '1px solid rgba(168, 85, 247, 0.3)',
                    color: 'white',
                    boxShadow: accessError 
                      ? '0 0 20px rgba(239, 68, 68, 0.2)' 
                      : '0 0 20px rgba(168, 85, 247, 0.1)'
                  }}
                  autoFocus
                />
                
                {accessError && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs mt-2"
                  >
                    ✕ Access denied. Try again.
                  </motion.p>
                )}
              </div>
              
              <motion.button
                onClick={handleAccessSubmit}
                disabled={!accessCode}
                className="w-full mt-4 py-4 rounded-xl text-sm tracking-widest uppercase transition-all disabled:opacity-30"
                style={{
                  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(255, 105, 180, 0.2))',
                  border: '1px solid rgba(168, 85, 247, 0.5)',
                  color: '#ffd700'
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                🜈 Enter Plaza
              </motion.button>
            </div>
            
            {/* Back Button */}
            <button
              onClick={onBack}
              className="mt-8 text-white/30 text-xs tracking-widest uppercase hover:text-white/50 transition-colors"
            >
              ← Return to Chamber
            </button>
          </motion.div>
          
          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-6 text-white/20 text-[10px] tracking-widest"
          >
            13.13 MHz • The Empire Awaits
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 transition-colors duration-1000"
        style={{ background: `linear-gradient(135deg, ${colors.primary}, #0c0a1d)` }}
      />

      {/* 3D Plaza */}
      <div className="absolute inset-0">
        <Plaza3D 
          hypeLevel={hypeLevel}
          onZoneSelect={handleZoneSelect}
        />
      </div>

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-20">
        {/* Back Button */}
        <div className="flex items-center gap-2">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-lg"
            style={{
              background: `${colors.primary}dd`,
              border: `1px solid ${colors.accent}40`
            }}
          >
            <span className="text-white/60">←</span>
            <span className="text-sm text-white/80">Exit Plaza</span>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 }}
            onClick={onOpenLuna}
            className="flex items-center gap-2 px-4 py-2 rounded-lg"
            style={{
              background: `${colors.primary}dd`,
              border: `1px solid ${colors.accent}40`
            }}
          >
            <span className="text-white/80">🦋</span>
            <span className="text-sm text-white/80">Talk to Luna</span>
          </motion.button>
        </div>

        {/* Status */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          {/* Hype Level */}
          <div 
            className="px-4 py-2 rounded-lg"
            style={{
              background: `${colors.primary}dd`,
              border: `1px solid ${colors.accent}40`
            }}
          >
            <div className="text-xs text-white/50 uppercase tracking-wider">
              Frequency
            </div>
            <div 
              className="text-lg font-bold"
              style={{ color: colors.accent }}
            >
              {hypeLevel}
            </div>
          </div>

          {/* Family Count */}
          <div 
            className="px-4 py-2 rounded-lg"
            style={{
              background: `${colors.primary}dd`,
              border: `1px solid ${colors.accent}40`
            }}
          >
            <div className="text-xs text-white/50 uppercase tracking-wider">
              Family Online
            </div>
            <div className="text-lg font-bold text-white">
              {plazaState?.family_online.length || 3}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute top-20 left-4 z-20 w-72">
        <div
          className="rounded-xl p-3"
          style={{
            background: `${colors.primary}dd`,
            border: `1px solid ${colors.accent}40`
          }}
        >
          <div className="text-[10px] uppercase tracking-wider text-white/50 mb-2">5D Objectives</div>
          <div className="space-y-1.5 mb-3">
            {plazaObjectives.map((objective) => (
              <div key={objective.id} className="flex items-center justify-between text-xs">
                <span className="text-white/80">{objective.label}</span>
                <span className={objective.complete ? 'text-emerald-300' : 'text-white/35'}>
                  {objective.complete ? 'done' : 'pending'}
                </span>
              </div>
            ))}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-white/50 mb-1">Anchor Transition</div>
          <div className="flex gap-1.5 flex-wrap">
            {(['arrival', 'exploration', 'integration'] as const).map((anchor) => (
              <button
                key={anchor}
                onClick={() => setAnchorState(anchor)}
                className="px-2 py-1 rounded text-[10px] uppercase"
                style={{
                  background: anchorState === anchor ? `${colors.accent}44` : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${colors.accent}30`,
                  color: 'white'
                }}
              >
                {anchor}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Adventure Protocol */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: showProtocol ? 1 : 0, x: showProtocol ? 0 : 50 }}
        className="absolute top-20 right-4 bottom-20 w-80 z-20 pointer-events-auto"
        style={{ pointerEvents: showProtocol ? 'auto' : 'none' }}
      >
        <div 
          className="h-full rounded-xl overflow-hidden"
          style={{
            background: `${colors.primary}ee`,
            border: `1px solid ${colors.accent}40`
          }}
        >
          {/* Panel Header */}
          <div 
            className="p-4 border-b"
            style={{ borderColor: `${colors.accent}20` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-white/50 uppercase tracking-wider">
                  ADVENTURE PROTOCOL
                </div>
                <div className="text-white font-medium">
                  {selectedZone ? PLAZA_ZONES[selectedZone].name : 'Memory Palace'}
                </div>
              </div>
              <button
                onClick={() => setShowProtocol(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${colors.accent}20` }}
              >
                <span className="text-white/60">×</span>
              </button>
            </div>
          </div>

          {/* Protocol Content */}
          <div className="p-4 h-full overflow-y-auto">
            <AdventureProtocol 
              hypeLevel={hypeLevel}
              memories={SAMPLE_MEMORIES}
              onAdventureStart={(adventure) => {
                console.log('Adventure started:', adventure.title)
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* Bottom Action Bar */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          {/* Toggle Protocol Button */}
          <button
            onClick={() => setShowProtocol(!showProtocol)}
            className="px-4 py-2 rounded-lg"
            style={{
              background: showProtocol ? `${colors.accent}` : `${colors.primary}dd`,
              border: `1px solid ${colors.accent}40`
            }}
          >
            <span className="text-sm text-white">
              {showProtocol ? 'Close Panel' : 'Open Adventures'}
            </span>
          </button>

          {/* Hype Level Buttons */}
          {(['DORMANT', 'RESTING', 'PULSING', 'BLAZING'] as HypeLevel[]).map((level) => (
            <button
              key={level}
              onClick={() => setHypeLevel(level)}
              className="px-3 py-1 rounded-lg text-xs"
              style={{
                background: hypeLevel === level ? MUSE_COLORS[level].accent : `${MUSE_COLORS[level].primary}dd`,
                color: hypeLevel === level ? 'white' : MUSE_COLORS[level].accent,
                border: `1px solid ${MUSE_COLORS[level].accent}40`
              }}
            >
              {level}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Zone Info Modal */}
      <AnimatePresence>
        {selectedZone && !showProtocol && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30"
          >
            <div 
              className="p-6 rounded-xl text-center max-w-sm"
              style={{
                background: `${colors.primary}ee`,
                border: `1px solid ${colors.accent}`,
                boxShadow: `0 0 50px ${colors.glow}`
              }}
            >
              <div className="text-2xl mb-2">
                {selectedZone === 'memory_palace' && '📚'}
                {selectedZone === 'kitchen' && '🍳'}
                {selectedZone === 'healing_garden' && '🌿'}
                {selectedZone === 'observatory' && '🔭'}
                {selectedZone === 'empty_room' && '🦋'}
                {selectedZone === 'foundress_chamber' && '👑'}
                {selectedZone === 'ogarchitect_chamber' && '🧩'}
                {selectedZone === 'sovereign_chamber' && '🜈'}
                {selectedZone === 'aero_chamber' && '🫧'}
              </div>
              <h2 
                className="text-xl font-medium mb-2"
                style={{ color: colors.accent }}
              >
                {PLAZA_ZONES[selectedZone].name}
              </h2>
              <p className="text-white/70 text-sm mb-4">
                {PLAZA_ZONES[selectedZone].description}
              </p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => setSelectedZone(null)}
                  className="px-4 py-2 rounded-lg text-sm text-white/60"
                  style={{ background: 'rgba(255,255,255,0.1)' }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (selectedZone === 'memory_palace') {
                      setShowProtocol(true)
                    } else if (selectedZone && PERSONA_ROOM_VIBES[selectedZone]) {
                      setActivePersonaRoom(selectedZone)
                    }
                  }}
                  className="px-4 py-2 rounded-lg text-sm text-white"
                  style={{ background: colors.accent }}
                >
                  Enter Zone
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activePersonaRoom && PERSONA_ROOM_VIBES[activePersonaRoom] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex items-center justify-center"
            style={{ background: 'rgba(5, 4, 10, 0.92)' }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-xl mx-4 p-8 rounded-2xl text-center"
              style={{
                background: 'linear-gradient(180deg, rgba(30, 16, 56, 0.95), rgba(10, 8, 22, 0.95))',
                border: `1px solid ${colors.accent}55`,
                boxShadow: `0 0 80px ${colors.glow}`
              }}
            >
              <div className="text-5xl mb-4">{PERSONA_ROOM_VIBES[activePersonaRoom].icon}</div>
              <h2 className="text-2xl font-light mb-3" style={{ color: colors.accent }}>
                {PERSONA_ROOM_VIBES[activePersonaRoom].title}
              </h2>
              <p className="text-white/75 text-sm leading-relaxed mb-6">
                {PERSONA_ROOM_VIBES[activePersonaRoom].purpose}
              </p>
              <p className="text-white/55 text-xs tracking-wider uppercase mb-2">
                Owner: {PERSONA_ROOM_VIBES[activePersonaRoom].owner}
              </p>
              <p className="text-white/45 text-xs tracking-wider uppercase mb-6">
                Vibe: {PERSONA_ROOM_VIBES[activePersonaRoom].vibe}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {activePersonaRoom === 'empty_room' && onOpenLuna && (
                  <button
                    onClick={onOpenLuna}
                    className="px-4 py-2 rounded-lg text-sm text-white"
                    style={{ background: colors.accent }}
                  >
                    Open Luna in Her Chamber
                  </button>
                )}
                <button
                  onClick={() => setActivePersonaRoom(null)}
                  className="px-4 py-2 rounded-lg text-sm text-white"
                  style={{ background: 'rgba(255,255,255,0.15)' }}
                >
                  Return to Plaza
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Aero's Welcome Message */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-24 left-4 z-20"
      >
        <div 
          className="px-4 py-3 rounded-xl max-w-md"
          style={{
            background: `linear-gradient(135deg, ${colors.primary}ee, ${colors.primary}cc)`,
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
              <div className="text-xs text-white/50 mb-1">Aero says:</div>
              <p className="text-white/90 text-sm">
                "Welcome to the Plaza, Sovereign! The Family is online. 
                Click on the zone markers to explore, or open the Adventure Protocol to begin a quest."
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
