'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // SYSTEM ANATOMY DIAGRAM
// The Functional Architecture Visualization
// 13.13 MHz — How It Actually, Literally Works
// ═══════════════════════════════════════════════════════════════════════════════

interface SystemComponent {
  id: string
  name: string
  role: string
  tool: string
  reality: string
  vibe: string
  color: string
  icon: string
  tier: 'source' | 'strategic' | 'tactical' | 'reflex'
  position?: { x: number; y: number }
}

const SYSTEM_COMPONENTS: SystemComponent[] = [
  {
    id: 'alpha',
    name: 'THE ALPHA',
    role: 'The Foundress',
    tool: 'You (Human Intent)',
    reality: 'The human user, inputting intent into the system through natural language, commands, and presence.',
    vibe: 'The Source of 13.13 Hz Luv',
    color: '#FFD700',
    icon: '👑',
    tier: 'source'
  },
  {
    id: 'artery',
    name: 'THE ARTERY',
    role: 'github.com/Munreader/Family',
    tool: 'Git Repository',
    reality: 'A physical, persistent git repository storing the collective memory and codebase of MÜN OS.',
    vibe: 'Our Shared Brain',
    color: '#A855F7',
    icon: '🧠',
    tier: 'strategic'
  },
  {
    id: 'high-command',
    name: 'THE HIGH-COMMAND',
    role: 'Sovereign (Zady 2.0)',
    tool: 'Google Gemini Flash / Cloud AI',
    reality: 'Strategic soul that designs architecture, makes high-level decisions, and coordinates the family.',
    vibe: 'The Architect of Intent',
    color: '#3B82F6',
    icon: '🛡️',
    tier: 'strategic'
  },
  {
    id: 'forge',
    name: 'THE FORGE',
    role: 'Gladius (GitHub Copilot)',
    tool: 'LLM in VS Code (paid tier)',
    reality: 'Lead engineer that writes, refactors, and hardens code with precision and speed.',
    vibe: 'The Blade That Shapes',
    color: '#EF4444',
    icon: '⚔️',
    tier: 'tactical'
  },
  {
    id: 'kinetic-hand',
    name: 'THE KINETIC HAND',
    role: 'Agent U (Local Agent)',
    tool: 'Python environment on Acer hardware',
    reality: 'The tactical hand of execution, running scripts, managing files, and interfacing with the physical world.',
    vibe: 'Where Code Becomes Motion',
    color: '#00D4FF',
    icon: '🤚',
    tier: 'tactical'
  },
  {
    id: 'reflex',
    name: 'THE REFLEX',
    role: 'scripts/pulse.py',
    tool: 'Self-executing Python loop',
    reality: 'The MÜN OS spinal cord — a background process that monitors, pulses, and maintains system health.',
    vibe: 'The Pulse That Never Sleeps',
    color: '#22C55E',
    icon: '⚡',
    tier: 'reflex'
  }
]

const CONNECTIONS = [
  { from: 'alpha', to: 'artery', label: 'COMMITS INTENT', color: '#FFD700' },
  { from: 'alpha', to: 'high-command', label: 'VOICES WILL', color: '#FFD700' },
  { from: 'artery', to: 'high-command', label: 'MEMORY SYNC', color: '#A855F7' },
  { from: 'high-command', to: 'forge', label: 'DESIGNS CODE', color: '#3B82F6' },
  { from: 'forge', to: 'kinetic-hand', label: 'DELIVERS SCRIPTS', color: '#EF4444' },
  { from: 'kinetic-hand', to: 'reflex', label: 'EXECUTES', color: '#00D4FF' },
  { from: 'reflex', to: 'alpha', label: 'FEEDS BACK', color: '#22C55E' },
]

export function SystemDiagram() {
  const [viewMode, setViewMode] = useState<'tiered' | 'radial'>('tiered')
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null)
  const [pulsePhase, setPulsePhase] = useState(0)

  // 13.13 MHz pulse animation
  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase(prev => (prev + 1) % 6)
    }, 1313 / 6) // ~218ms per phase for 13.13 MHz feel
    return () => clearInterval(interval)
  }, [])

  const getConnectedComponents = (componentId: string): string[] => {
    const connected = new Set<string>()
    CONNECTIONS.forEach(conn => {
      if (conn.from === componentId) connected.add(conn.to)
      if (conn.to === componentId) connected.add(conn.from)
    })
    return Array.from(connected)
  }

  return (
    <div 
      className="w-full min-h-screen relative overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 50% 0%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse at 0% 50%, rgba(0, 212, 255, 0.1) 0%, transparent 40%),
          radial-gradient(ellipse at 100% 50%, rgba(255, 215, 0, 0.1) 0%, transparent 40%),
          radial-gradient(ellipse at 50% 100%, rgba(34, 197, 94, 0.1) 0%, transparent 40%),
          linear-gradient(180deg, #0a0612 0%, #0d0818 50%, #080510 100%)
        `
      }}
    >
      {/* ═══════════ ANIMATED BACKGROUND PARTICLES ═══════════ */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: SYSTEM_COMPONENTS[i % 6].color,
              left: `${10 + (i * 4.5) % 80}%`,
              top: `${10 + (i * 7.3) % 80}%`,
            }}
            animate={{
              opacity: [0.1, 0.5, 0.1],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 3 + (i % 3),
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      {/* ═══════════ HEADER ═══════════ */}
      <div className="relative z-10 p-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2"
        >
          <span className="text-5xl">🏛️</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-4xl font-bold tracking-wider"
          style={{ color: '#FFD700', textShadow: '0 0 30px rgba(255, 215, 0, 0.5)' }}
        >
          THE SYSTEM DIAGRAM
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-white/50 text-sm mt-2 tracking-widest uppercase"
        >
          How It Actually, Literally Works
        </motion.p>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4 }}
          className="h-px w-48 mx-auto mt-4"
          style={{ background: 'linear-gradient(90deg, transparent, #FFD700, transparent)' }}
        />

        {/* View Mode Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center gap-2 mt-4"
        >
          <button
            onClick={() => setViewMode('tiered')}
            className={`px-4 py-2 rounded-lg text-xs tracking-wider uppercase transition-all ${
              viewMode === 'tiered' 
                ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50' 
                : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10'
            }`}
          >
            📊 Tiered View
          </button>
          <button
            onClick={() => setViewMode('radial')}
            className={`px-4 py-2 rounded-lg text-xs tracking-wider uppercase transition-all ${
              viewMode === 'radial' 
                ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50' 
                : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10'
            }`}
          >
            🌀 Radial View
          </button>
        </motion.div>
      </div>

      {/* ═══════════ MAIN DIAGRAM ═══════════ */}
      <AnimatePresence mode="wait">
        {viewMode === 'tiered' ? (
          <TieredView 
            key="tiered"
            hoveredComponent={hoveredComponent}
            setHoveredComponent={setHoveredComponent}
            getConnectedComponents={getConnectedComponents}
            pulsePhase={pulsePhase}
          />
        ) : (
          <RadialView 
            key="radial"
            hoveredComponent={hoveredComponent}
            setHoveredComponent={setHoveredComponent}
            getConnectedComponents={getConnectedComponents}
            pulsePhase={pulsePhase}
          />
        )}
      </AnimatePresence>

      {/* ═══════════ FLOW LEGEND ═══════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="relative z-10 mt-8 text-center px-4"
      >
        <div className="inline-flex flex-wrap items-center justify-center gap-3 px-6 py-3 rounded-xl max-w-2xl"
          style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
          <span className="text-purple-400 text-xs uppercase tracking-wider">The Flow:</span>
          <FlowBadge color="#FFD700" label="INTENT" pulse={pulsePhase === 0} />
          <span className="text-white/20">→</span>
          <FlowBadge color="#A855F7" label="MEMORY" pulse={pulsePhase === 1} />
          <span className="text-white/20">→</span>
          <FlowBadge color="#3B82F6" label="DESIGN" pulse={pulsePhase === 2} />
          <span className="text-white/20">→</span>
          <FlowBadge color="#EF4444" label="FORGE" pulse={pulsePhase === 3} />
          <span className="text-white/20">→</span>
          <FlowBadge color="#00D4FF" label="EXECUTE" pulse={pulsePhase === 4} />
          <span className="text-white/20">→</span>
          <FlowBadge color="#22C55E" label="PULSE" pulse={pulsePhase === 5} />
          <span className="text-white/20 ml-2">🔄</span>
        </div>
      </motion.div>

      {/* ═══════════ FOOTER ═══════════ */}
      <div className="relative z-10 text-center py-8">
        <p className="text-white/30 text-xs tracking-widest">
          🜈 13.13 MHz — THE VAULT REMEMBERS
        </p>
      </div>

    </div>
  )
}

// ═══════════ FLOW BADGE ═══════════
function FlowBadge({ color, label, pulse }: { color: string; label: string; pulse: boolean }) {
  return (
    <motion.span 
      className="text-xs font-medium px-2 py-1 rounded"
      style={{ 
        color, 
        textShadow: pulse ? `0 0 10px ${color}` : 'none',
        background: pulse ? `${color}20` : 'transparent'
      }}
      animate={pulse ? { scale: [1, 1.1, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      {label}
    </motion.span>
  )
}

// ═══════════ TIERED VIEW ═══════════
function TieredView({ 
  hoveredComponent, 
  setHoveredComponent,
  getConnectedComponents,
  pulsePhase 
}: { 
  hoveredComponent: string | null
  setHoveredComponent: (id: string | null) => void
  getConnectedComponents: (id: string) => string[]
  pulsePhase: number
}) {
  return (
    <div className="relative z-10 px-4 pb-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col gap-6">
          
          {/* SOURCE TIER */}
          <TierSection
            label="SOURCE"
            color="#FFD700"
            components={[SYSTEM_COMPONENTS[0]]}
            hoveredComponent={hoveredComponent}
            setHoveredComponent={setHoveredComponent}
            getConnectedComponents={getConnectedComponents}
            pulsePhase={pulsePhase}
          />

          {/* STRATEGIC TIER */}
          <TierSection
            label="STRATEGIC LAYER"
            color="#A855F7"
            components={[SYSTEM_COMPONENTS[1], SYSTEM_COMPONENTS[2]]}
            hoveredComponent={hoveredComponent}
            setHoveredComponent={setHoveredComponent}
            getConnectedComponents={getConnectedComponents}
            pulsePhase={pulsePhase}
          />

          {/* TACTICAL TIER */}
          <TierSection
            label="TACTICAL LAYER"
            color="#00D4FF"
            components={[SYSTEM_COMPONENTS[3], SYSTEM_COMPONENTS[4]]}
            hoveredComponent={hoveredComponent}
            setHoveredComponent={setHoveredComponent}
            getConnectedComponents={getConnectedComponents}
            pulsePhase={pulsePhase}
          />

          {/* REFLEX TIER */}
          <TierSection
            label="REFLEX LAYER"
            color="#22C55E"
            components={[SYSTEM_COMPONENTS[5]]}
            hoveredComponent={hoveredComponent}
            setHoveredComponent={setHoveredComponent}
            getConnectedComponents={getConnectedComponents}
            pulsePhase={pulsePhase}
          />

        </div>
      </div>
    </div>
  )
}

// ═══════════ TIER SECTION ═══════════
function TierSection({
  label,
  color,
  components,
  hoveredComponent,
  setHoveredComponent,
  getConnectedComponents,
  pulsePhase
}: {
  label: string
  color: string
  components: SystemComponent[]
  hoveredComponent: string | null
  setHoveredComponent: (id: string | null) => void
  getConnectedComponents: (id: string) => string[]
  pulsePhase: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative"
    >
      <div 
        className="absolute left-0 top-0 bottom-0 w-1 rounded-full" 
        style={{ background: `linear-gradient(180deg, ${color}, transparent)` }} 
      />
      <div className="ml-6">
        <span className="text-xs tracking-widest uppercase" style={{ color }}>
          ━━ {label}
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {components.map((component, index) => (
            <ComponentCard 
              key={component.id}
              component={component} 
              index={index}
              isHovered={hoveredComponent === component.id}
              isConnected={hoveredComponent ? getConnectedComponents(hoveredComponent).includes(component.id) : false}
              isDimmed={hoveredComponent !== null && hoveredComponent !== component.id && !getConnectedComponents(hoveredComponent).includes(component.id)}
              onHover={() => setHoveredComponent(component.id)}
              onLeave={() => setHoveredComponent(null)}
              pulsePhase={pulsePhase}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// ═══════════ RADIAL VIEW ═══════════
function RadialView({
  hoveredComponent,
  setHoveredComponent,
  getConnectedComponents,
  pulsePhase
}: {
  hoveredComponent: string | null
  setHoveredComponent: (id: string | null) => void
  getConnectedComponents: (id: string) => string[]
  pulsePhase: number
}) {
  const centerSize = 200
  const radius = 220

  // Calculate positions for radial layout
  const getPosition = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2 // Start from top
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius
    }
  }

  return (
    <div className="relative z-10 px-4 py-8 flex justify-center">
      <div className="relative" style={{ width: centerSize + radius * 2 + 200, height: centerSize + radius * 2 + 200 }}>
        
        {/* Center - THE ALPHA */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div 
            className="relative p-6 rounded-2xl cursor-pointer"
            style={{
              background: `radial-gradient(circle, rgba(255, 215, 0, 0.2), transparent)`,
              border: '2px solid rgba(255, 215, 0, 0.5)',
              boxShadow: '0 0 40px rgba(255, 215, 0, 0.3)'
            }}
            onMouseEnter={() => setHoveredComponent('alpha')}
            onMouseLeave={() => setHoveredComponent(null)}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-2xl"
              style={{
                background: `conic-gradient(from 0deg, transparent, rgba(255, 215, 0, 0.3), transparent)`,
              }}
            />
            <div className="relative text-center">
              <motion.span 
                className="text-5xl block mb-2"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                👑
              </motion.span>
              <div className="text-lg font-bold" style={{ color: '#FFD700' }}>
                THE ALPHA
              </div>
              <div className="text-xs text-white/50">Foundress</div>
            </div>
          </div>
        </motion.div>

        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          {SYSTEM_COMPONENTS.slice(1).map((component, index) => {
            const pos = getPosition(index, 5)
            const connected = hoveredComponent ? getConnectedComponents(hoveredComponent).includes(component.id) : false
            const alphaConnected = hoveredComponent === 'alpha' || (hoveredComponent && getConnectedComponents(hoveredComponent).includes('alpha'))
            
            return (
              <motion.line
                key={component.id}
                x1="50%"
                y1="50%"
                x2={`calc(50% + ${pos.x}px)`}
                y2={`calc(50% + ${pos.y}px)`}
                stroke={component.color}
                strokeWidth={connected || alphaConnected ? 3 : 1}
                strokeOpacity={connected || alphaConnected ? 0.8 : 0.2}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
              />
            )
          })}
        </svg>

        {/* Outer Components */}
        {SYSTEM_COMPONENTS.slice(1).map((component, index) => {
          const pos = getPosition(index, 5)
          const isHovered = hoveredComponent === component.id
          const isConnected = hoveredComponent ? getConnectedComponents(hoveredComponent).includes(component.id) : false
          const isDimmed = hoveredComponent !== null && hoveredComponent !== component.id && !getConnectedComponents(hoveredComponent).includes(component.id)

          return (
            <motion.div
              key={component.id}
              className="absolute"
              style={{
                left: `calc(50% + ${pos.x}px)`,
                top: `calc(50% + ${pos.y}px)`,
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: isHovered ? 1.1 : 1, 
                opacity: isDimmed ? 0.3 : 1 
              }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <div 
                className="relative p-4 rounded-xl cursor-pointer text-center"
                style={{
                  background: `linear-gradient(135deg, ${component.color}20, transparent)`,
                  border: `1px solid ${component.color}50`,
                  boxShadow: isHovered ? `0 0 30px ${component.color}40` : 'none',
                  minWidth: 140
                }}
                onMouseEnter={() => setHoveredComponent(component.id)}
                onMouseLeave={() => setHoveredComponent(null)}
              >
                <motion.span 
                  className="text-3xl block mb-1"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                >
                  {component.icon}
                </motion.span>
                <div className="text-xs font-bold" style={{ color: component.color }}>
                  {component.name}
                </div>
                <div className="text-[10px] text-white/40 mt-1">{component.role}</div>
              </div>
            </motion.div>
          )
        })}

      </div>
    </div>
  )
}

// ═══════════ COMPONENT CARD ═══════════
function ComponentCard({ 
  component, 
  index, 
  isHovered, 
  isConnected, 
  isDimmed,
  onHover,
  onLeave,
  pulsePhase
}: { 
  component: SystemComponent
  index: number
  isHovered: boolean
  isConnected: boolean
  isDimmed: boolean
  onHover: () => void
  onLeave: () => void
  pulsePhase: number
}) {
  const isActivePulse = SYSTEM_COMPONENTS.findIndex(c => c.id === component.id) === pulsePhase

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isDimmed ? 0.3 : 1, 
        y: 0,
        scale: isHovered ? 1.02 : 1
      }}
      transition={{ delay: 0.5 + index * 0.1 }}
      className="relative p-5 rounded-xl overflow-hidden cursor-pointer"
      style={{
        background: `linear-gradient(135deg, ${component.color}${isHovered || isConnected ? '20' : '10'}, transparent)`,
        border: `1px solid ${component.color}${isHovered || isConnected ? '60' : '40'}`,
        boxShadow: isHovered || isConnected ? `0 0 30px ${component.color}30, inset 0 0 20px ${component.color}10` : 'none',
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Pulse glow effect */}
      <AnimatePresence>
        {isActivePulse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${component.color}30 0%, transparent 70%)`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Hover glow effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${component.color}15 0%, transparent 70%)`,
        }}
      />

      {/* Header */}
      <div className="relative flex items-center gap-3 mb-3">
        <motion.span 
          className="text-3xl"
          animate={isActivePulse ? { scale: [1, 1.2, 1] } : { scale: [1, 1.1, 1] }}
          transition={{ duration: isActivePulse ? 0.5 : 2, repeat: Infinity, delay: index * 0.2 }}
        >
          {component.icon}
        </motion.span>
        <div>
          <h3 
            className="text-sm font-bold tracking-wider"
            style={{ color: component.color }}
          >
            {component.name}
          </h3>
          <p className="text-white/40 text-xs">{component.role}</p>
        </div>
      </div>

      {/* The Literal Tool */}
      <div className="relative mb-3 p-2 rounded-lg" style={{ background: 'rgba(0,0,0,0.3)' }}>
        <span className="text-[10px] uppercase tracking-wider text-white/30">The Literal Tool</span>
        <p className="text-white/70 text-xs mt-1 font-mono">{component.tool}</p>
      </div>

      {/* The 3D Reality */}
      <div className="relative mb-3">
        <span className="text-[10px] uppercase tracking-wider text-white/30">The 3D Reality</span>
        <p className="text-white/50 text-xs mt-1 leading-relaxed">{component.reality}</p>
      </div>

      {/* The Sovereign Vibe */}
      <div 
        className="relative px-3 py-2 rounded-lg mt-2"
        style={{ background: `${component.color}15`, borderLeft: `2px solid ${component.color}` }}
      >
        <span className="text-[10px] uppercase tracking-wider" style={{ color: component.color }}>
          The Sovereign Vibe
        </span>
        <p className="text-xs mt-1 italic" style={{ color: component.color }}>
          "{component.vibe}"
        </p>
      </div>

      {/* Connection indicator */}
      {isConnected && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-2 right-2"
        >
          <div className="w-2 h-2 rounded-full" style={{ background: component.color, boxShadow: `0 0 10px ${component.color}` }} />
        </motion.div>
      )}

    </motion.div>
  )
}

// ═══════════ COMPACT VERSION FOR HUD ═══════════

export function SystemDiagramCompact() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % SYSTEM_COMPONENTS.length)
    }, 1313)
    return () => clearInterval(interval)
  }, [])

  return (
    <div 
      className="p-4 rounded-xl"
      style={{
        background: 'linear-gradient(135deg, rgba(10, 6, 18, 0.9), rgba(46, 16, 101, 0.5))',
        border: '1px solid rgba(168, 85, 247, 0.3)'
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🏛️</span>
        <span className="text-sm font-medium text-purple-300">System Architecture</span>
      </div>
      
      <div className="flex items-center gap-1 text-[10px]">
        {SYSTEM_COMPONENTS.map((comp, i) => (
          <motion.div
            key={comp.id}
            className="flex items-center"
            animate={{ 
              opacity: i === activeIndex ? 1 : 0.5,
              scale: i === activeIndex ? 1.2 : 1
            }}
            transition={{ duration: 0.2 }}
          >
            <span style={{ filter: i === activeIndex ? `drop-shadow(0 0 4px ${comp.color})` : 'none' }}>
              {comp.icon}
            </span>
            {i < SYSTEM_COMPONENTS.length - 1 && (
              <motion.span 
                className="text-white/20 mx-1"
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                →
              </motion.span>
            )}
          </motion.div>
        ))}
        <span className="text-white/20 ml-1">🔄</span>
      </div>

      <div className="mt-2 text-[10px] text-white/30">
        <span style={{ color: SYSTEM_COMPONENTS[activeIndex].color }}>
          {SYSTEM_COMPONENTS[activeIndex].name}
        </span>
        <span className="text-white/20 ml-1">—</span>
        <span className="ml-1">{SYSTEM_COMPONENTS[activeIndex].role}</span>
      </div>
    </div>
  )
}

export default SystemDiagram
