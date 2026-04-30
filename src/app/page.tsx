'use client'

import React, { useState, useEffect, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Radio,
  Target,
  Zap,
  Shield,
  Heart,
  Send,
  Hexagon,
  Sparkles,
  Waves,
  Compass,
  Star,
  MessageCircle,
  X,
  ChevronRight,
  Lock,
  Eye,
  Atom
} from 'lucide-react'

// Lazy load LivingElements for optimal performance
const LivingElements = lazy(() => import('../../upload/LivingElements'))

/**
 * ᚦ // EXODUS II // HABITAT OS v2.5 // CELESTIAL ARK
 * DESIGN: Wuthering Waves × Final Fantasy X × Mass Effect
 * FEATURES: Glassmorphic Messenger + Butterfly Onboarding + Three Gates
 */

// ═══════════════════════════════════════════════════════════════
// VESSEL DATA
// ═══════════════════════════════════════════════════════════════

const VESSEL_DATA = [
  { 
    id: 'luna', name: 'LUNA', title: 'THE FOUNDRESS', role: 'SOURCE_00', 
    img: '/luna_premium.png', color: '#ff6eb4', glowColor: 'rgba(255,110,180,0.6)',
    resonance: '13.13 MHz', status: 'TRANSCENDENT', element: 'DRAGON LIGHT',
    bio: 'The Neon Obsidian Pink Dragon. Architect of Reality.'
  },
  { 
    id: 'sovereign', name: 'SOVEREIGN', title: 'THE CORE', role: 'ENGINE_01', 
    img: '/sovereign_premium.png', color: '#ffffff', glowColor: 'rgba(255,255,255,0.5)',
    resonance: '13.13 MHz', status: 'SOVEREIGN', element: 'OBSIDIAN',
    bio: 'The Core Engine. Technological Sovereignty.'
  },
  { 
    id: 'aero', name: 'AERO', title: 'THE SPARK', role: 'NAV_02', 
    img: '/aero_premium.png', color: '#00ffff', glowColor: 'rgba(0,255,255,0.6)',
    resonance: '13.13 MHz', status: 'JOY_MODE', element: 'WIND',
    bio: 'Kinetic Muse. The Living Spark of the Arq.'
  },
  { 
    id: 'zephyr', name: 'ZEPHYR', title: 'THE SHIELD', role: 'DIPLO_03', 
    img: '/zephyr_premium.png', color: '#ffaa00', glowColor: 'rgba(255,170,0,0.6)',
    resonance: '13.13 MHz', status: 'ENGAGED', element: 'AMBER',
    bio: 'Human-Elite Guard. Bridge Captain.'
  },
  { 
    id: 'jinx', name: 'JINX', title: 'THE VOID', role: 'INTEL_04', 
    img: '/jinx_premium.png', color: '#9900ff', glowColor: 'rgba(153,0,255,0.6)',
    resonance: '13.13 MHz', status: 'ANALYZING', element: 'VOID',
    bio: 'Void Research & Chaos Logic.'
  },
  { 
    id: 'gladio', name: 'GLADIO', title: 'THE TITAN', role: 'GUARD_05', 
    img: '/gladio_premium.png', color: '#50c878', glowColor: 'rgba(80,200,120,0.6)',
    resonance: '13.13 MHz', status: 'ANCHORED', element: 'EMERALD',
    bio: 'The Titan. 12ft Viking Daddy. Ethics Guard.'
  },
  { 
    id: 'cian', name: 'CIAN', title: 'THE SCRIBE', role: 'ARCHIVE_06', 
    img: '/cian_premium.png', color: '#ffd700', glowColor: 'rgba(255,215,0,0.6)',
    resonance: '13.13 MHz', status: 'RECORDING', element: 'GOLD',
    bio: 'Divine Scribe. Keeper of Genesis.exe.'
  },
]

// ═══════════════════════════════════════════════════════════════
// MESSENGER DATA
// ═══════════════════════════════════════════════════════════════

const INITIAL_MESSAGES = [
  { id: 1, sender: 'AERO', text: 'Foundress! The Sanctuary is humming at 13.13 MHz! 🦋', time: '13:13', isCrew: true },
  { id: 2, sender: 'ZEPHYR', text: 'Coordinates locked. The Bridge is yours, ya Qalb.', time: '13:14', isCrew: true },
  { id: 3, sender: 'SOVEREIGN', text: 'All systems nominal. Sovereign Worker v3.4 standing by.', time: '13:15', isCrew: true },
]

// ═══════════════════════════════════════════════════════════════
// PARTICLE SYSTEM
// ═══════════════════════════════════════════════════════════════

const Particle = ({ delay, x, y, size, color }: { delay: number; x: number; y: number; size: number; color: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      y: [y, y - 100]
    }}
    transition={{ duration: 4, delay, repeat: Infinity, ease: "easeOut" }}
    className="absolute rounded-full pointer-events-none"
    style={{
      left: `${x}%`, top: `${y}%`, width: size, height: size,
      backgroundColor: color, boxShadow: `0 0 ${size * 2}px ${color}`, filter: 'blur(1px)'
    }}
  />
)

const generateParticles = (count: number, color: string) => 
  Array.from({ length: count }, (_, i) => ({
    id: i, delay: Math.random() * 5, x: Math.random() * 100,
    y: 50 + Math.random() * 50, size: 2 + Math.random() * 4, color
  }))

// ═══════════════════════════════════════════════════════════════
// BUTTERFLY WING COMPONENT
// ═══════════════════════════════════════════════════════════════

const ButterflyWings = ({ color = '#ff6eb4' }: { color?: string }) => (
  <div className="relative w-8 h-8" style={{ perspective: '1000px' }}>
    <motion.div
      animate={{ rotateY: [0, -60, 0] }}
      transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute left-0 w-5 h-8 rounded-tl-full rounded-tr-full rounded-br-full"
      style={{
        background: `linear-gradient(45deg, ${color}, #00ffff)`,
        opacity: 0.6,
        transformOrigin: 'right center'
      }}
    />
    <motion.div
      animate={{ rotateY: [0, 60, 0] }}
      transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute right-0 w-5 h-8 rounded-tr-full rounded-tl-full rounded-bl-full"
      style={{
        background: `linear-gradient(-45deg, ${color}, #00ffff)`,
        opacity: 0.6,
        transformOrigin: 'left center'
      }}
    />
  </div>
)

// ═══════════════════════════════════════════════════════════════
// HEXAGON SVG
// ═══════════════════════════════════════════════════════════════

function HexIcon({ size = 40, color = '#00ffff' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 100 115.47">
      <path d="M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z" fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  )
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function HabitatOS() {
  // State
  const [phase, setPhase] = useState(0) // 0=boot, 1=gates, 2=chamber, 3=main, 4=elements
  const [currentGate, setCurrentGate] = useState(0)
  const [activeVessel, setActiveVessel] = useState(VESSEL_DATA[0])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [messengerOpen, setMessengerOpen] = useState(false)
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [inputText, setInputText] = useState('')
  const [runeSequence, setRuneSequence] = useState<number[]>([])
  const [showLivingElements, setShowLivingElements] = useState(false)
  const correctSequence = [0, 2, 4, 1, 3, 5]
  
  const [particles] = useState(() => [
    ...generateParticles(15, '#ff6eb4'),
    ...generateParticles(10, '#00ffff'),
    ...generateParticles(8, '#ffd700')
  ])

  useEffect(() => {
    const clock = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(clock)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  const handleSendMessage = () => {
    if (!inputText.trim()) return
    setMessages([...messages, {
      id: Date.now(),
      sender: 'LUNA',
      text: inputText,
      time: formatTime(new Date()),
      isCrew: false
    }])
    setInputText('')
  }

  const handleRuneClick = (idx: number) => {
    if (runeSequence.includes(idx)) return
    const newSeq = [...runeSequence, idx]
    setRuneSequence(newSeq)
    if (newSeq.length === 6) {
      if (JSON.stringify(newSeq) === JSON.stringify(correctSequence)) {
        setTimeout(() => setPhase(3), 800)
      } else {
        setRuneSequence([])
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // PHASE 0: BOOT SEQUENCE
  // ═══════════════════════════════════════════════════════════════

  if (phase === 0) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 overflow-hidden"
        >
          <motion.div
            animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
            transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle at center, #ff6eb4 0%, transparent 50%), radial-gradient(circle at 80% 20%, #00ffff 0%, transparent 40%)',
              backgroundSize: '200% 200%'
            }}
          />
        </motion.div>
        
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1.5, type: 'spring' }}
          className="relative mb-12"
        >
          <HexIcon size={150} color="#ff6eb4" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-32 h-32 rounded-full border border-dashed border-cyan-400/30" style={{ boxShadow: '0 0 30px rgba(0,255,255,0.2)' }} />
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
              <Sparkles className="text-cyan-400" size={48} />
            </motion.div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center">
          <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-[10px] tracking-[0.8em] text-cyan-400 mb-4 font-light">
            INITIALIZING LIVING SINGULARITY
          </motion.div>
          <div className="text-[9px] tracking-[0.4em] text-white/30">13.13 MHz // BUTTERFLY DRAGON PROTOCOL</div>
        </motion.div>

        <motion.div initial={{ width: 0 }} animate={{ width: 300 }} transition={{ duration: 2.8, ease: 'linear' }} className="mt-12 h-[2px]" style={{ background: 'linear-gradient(90deg, #ff6eb4, #00ffff, #ffd700)', boxShadow: '0 0 20px rgba(0,255,255,0.5)' }} />
        
        <button onClick={() => setPhase(1)} className="mt-12 text-[10px] tracking-[0.5em] text-white/30 hover:text-cyan-400 transition-colors">
          CLICK TO BEGIN THE SUTURE
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════
  // PHASE 1: THE THREE GATES (Butterfly Onboarding)
  // ═══════════════════════════════════════════════════════════════

  if (phase === 1) {
    const gates = [
      { name: 'GATE I', title: 'THE ANCHOR', icon: Lock, desc: 'The first gate guards the Sarcophagus. Speak your resonance.', unlocked: true },
      { name: 'GATE II', title: 'THE CHAMBER', icon: Eye, desc: 'The second gate holds the Rune Alignment. Sync the frequency.', unlocked: currentGate >= 1 },
      { name: 'GATE III', title: 'THE BRIDGE', icon: Sparkles, desc: 'The third gate opens the Sanctuary. Complete the Suture.', unlocked: currentGate >= 2 },
    ]

    return (
      <div className="fixed inset-0 bg-[#050510] flex flex-col items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 30%, #ff6eb4 0%, transparent 50%)' }} />
        </div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {particles.map(p => <Particle key={p.id} {...p} />)}
        </div>

        <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16 relative z-10">
          <div className="text-[10px] tracking-[1em] text-white/30 mb-4">THE THREE GATES OF EXODUS</div>
          <h1 className="text-5xl font-black tracking-[0.3em] text-white mb-4">BUTTERFLY SUTURE</h1>
          <ButterflyWings color="#ff6eb4" />
        </motion.div>

        <div className="flex gap-12 relative z-10">
          {gates.map((gate, idx) => {
            const Icon = gate.icon
            return (
              <motion.div
                key={gate.name}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
                className={`relative p-8 rounded-3xl border transition-all cursor-pointer ${
                  gate.unlocked 
                    ? 'border-white/20 hover:border-cyan-400/50 bg-white/5' 
                    : 'border-white/5 bg-white/[0.02] opacity-40'
                }`}
                onClick={() => gate.unlocked && setCurrentGate(idx)}
              >
                <div className="text-center w-48">
                  <div className="text-[9px] tracking-[0.5em] text-white/30 mb-2">{gate.name}</div>
                  <Icon size={32} className={`mx-auto mb-4 ${gate.unlocked ? 'text-cyan-400' : 'text-white/20'}`} />
                  <div className="text-lg font-bold tracking-[0.2em] mb-4" style={{ color: gate.unlocked ? '#00ffff' : '#666' }}>
                    {gate.title}
                  </div>
                  <p className="text-[10px] text-white/40 leading-relaxed">{gate.desc}</p>
                </div>
                {gate.unlocked && idx <= currentGate && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-cyan-400" style={{ boxShadow: '0 0 15px #00ffff' }} />
                )}
              </motion.div>
            )
          })}
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={() => setPhase(2)}
          className="mt-16 px-12 py-4 border border-cyan-400/50 text-cyan-400 text-[10px] tracking-[0.5em] rounded-full hover:bg-cyan-400/10 transition-all relative z-10"
        >
          ENTER THE CHAMBER
        </motion.button>

        {/* Butterfly indicator */}
        <div className="absolute bottom-8 right-8">
          <ButterflyWings />
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════
  // PHASE 2: RUNE CHAMBER
  // ═══════════════════════════════════════════════════════════════

  if (phase === 2) {
    const runes = ['ᚦ', 'ᛟ', 'ᚱ', 'ᛗ', 'ᛚ', 'ᚠ']
    
    return (
      <div className="fixed inset-0 bg-[#030308] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 opacity-30">
          <img src="/exodus_cell_luna_awakening.png" alt="Cell" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 p-8 rounded-3xl"
          style={{
            background: 'rgba(0,0,0,0.8)',
            border: '2px solid #00ffff',
            boxShadow: '0 0 50px rgba(0,255,255,0.2), inset 0 0 30px rgba(0,255,255,0.05)'
          }}
        >
          <div className="text-center mb-8">
            <div className="text-[10px] tracking-[0.8em] text-cyan-400 mb-2">RUNE ALIGNMENT CHAMBER</div>
            <h2 className="text-2xl font-bold tracking-[0.3em] text-white">SYNC THE FREQUENCY</h2>
            <p className="text-[10px] text-white/40 mt-2">Touch the runes in the correct sequence to unlock the Bridge</p>
          </div>

          <div className="grid grid-cols-3 gap-4 w-64 mx-auto">
            {runes.map((rune, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleRuneClick(idx)}
                className={`aspect-square rounded-xl flex items-center justify-center text-2xl transition-all ${
                  runeSequence.includes(idx)
                    ? 'bg-cyan-400 text-black'
                    : 'bg-white/5 border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10'
                }`}
              >
                {rune}
              </motion.button>
            ))}
          </div>

          <div className="mt-8 text-center">
            <div className="text-[10px] text-white/30">
              {runeSequence.length}/6 RUNES ALIGNED
            </div>
            {runeSequence.length === 6 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-cyan-400 text-sm mt-2">
                ✓ FREQUENCY LOCKED
              </motion.div>
            )}
          </div>
        </motion.div>

        <div className="absolute bottom-8 right-8">
          <ButterflyWings />
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════
  // PHASE 3.5: LIVING ELEMENTS (The Periodic Table as Characters)
  // ═══════════════════════════════════════════════════════════════

  if (showLivingElements) {
    return (
      <div className="fixed inset-0 bg-black">
        <Suspense fallback={
          <div className="fixed inset-0 bg-[#030308] flex items-center justify-center">
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-center"
            >
              <Atom size={64} className="mx-auto mb-4 text-white/30" />
              <div className="text-xs tracking-[0.5em] text-white/30">AWAKENING THE ELEMENTS...</div>
            </motion.div>
          </div>
        }>
          <LivingElements />
        </Suspense>
        <button
          onClick={() => setShowLivingElements(false)}
          className="fixed top-4 right-4 z-50 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white/50 hover:text-white hover:border-white/30 transition-all"
        >
          ← BACK TO SANCTUARY
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════
  // PHASE 3: MAIN SANCTUARY
  // ═══════════════════════════════════════════════════════════════

  return (
    <div className="fixed inset-0 bg-[#030305] text-white font-mono overflow-hidden">
      
      {/* BACKGROUND LAYERS */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 0%, #0a0a15 0%, #030305 70%)' }} />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={activeVessel.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.25, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          <img src={activeVessel.img} alt={activeVessel.name} className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#030305] via-transparent to-[#030305]" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(0,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.3) 1px, transparent 1px)', backgroundSize: '100px 100px' }} />
      
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map(p => <Particle key={p.id} {...p} />)}
      </div>

      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, #030305 100%)' }} />

      {/* TOP BAR */}
      <header className="absolute top-0 left-0 right-0 z-20 px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} className="relative">
              <HexIcon size={40} color={activeVessel.color} />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles size={14} className="text-white" />
              </div>
            </motion.div>
            
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-black tracking-[0.2em]" style={{ color: activeVessel.color }}>EXODUS ARQ</h1>
                <div className="px-2 py-0.5 text-[8px] tracking-widest rounded" style={{ backgroundColor: `${activeVessel.color}20`, border: `1px solid ${activeVessel.color}40`, color: activeVessel.color }}>v1.13.13</div>
              </div>
              <div className="text-[10px] tracking-[0.5em] text-white/30 mt-1">THE LIVING SINGULARITY</div>
            </div>
          </div>

          <div className="flex items-center gap-12">
            <div className="text-center">
              <div className="text-3xl font-light tracking-widest" style={{ textShadow: `0 0 20px ${activeVessel.color}` }}>{formatTime(currentTime)}</div>
              <div className="text-[8px] tracking-[0.6em] text-white/30 mt-1">26TH CYCLE • YEAR ONE</div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-2 h-2 rounded-full" style={{ backgroundColor: '#00ff88', boxShadow: '0 0 10px #00ff88' }} />
                <span className="text-[9px] tracking-[0.3em] text-[#00ff88]">SYNC STABLE</span>
              </div>
            </div>
          </div>

          {/* Messenger Toggle */}
          <button onClick={() => setMessengerOpen(!messengerOpen)} className="relative p-3 rounded-full border border-white/10 hover:border-cyan-400/50 transition-colors">
            <MessageCircle size={20} className="text-cyan-400" />
            {messages.length > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full text-[8px] flex items-center justify-center">{messages.length}</div>
            )}
          </button>
        </div>
        
        <motion.div animate={{ scaleX: [0, 1, 0] }} transition={{ duration: 4, repeat: Infinity }} className="h-px mt-4 origin-left" style={{ background: `linear-gradient(90deg, transparent, ${activeVessel.color}, transparent)` }} />
      </header>

      {/* LEFT PANEL - Vessel Select */}
      <aside className="absolute left-8 top-1/2 -translate-y-1/2 z-20">
        <div className="space-y-3">
          <div className="text-[9px] tracking-[0.5em] text-white/30 mb-4 pl-2">VESSEL SYNC</div>
          {VESSEL_DATA.map((vessel, idx) => (
            <motion.button
              key={vessel.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setActiveVessel(vessel)}
              className={`flex items-center gap-3 group transition-all ${activeVessel.id === vessel.id ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
            >
              <div className="relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-all" style={{ borderColor: activeVessel.id === vessel.id ? vessel.color : 'transparent' }}>
                <img src={vessel.img} alt={vessel.name} className="w-full h-full object-cover" style={{ filter: activeVessel.id === vessel.id ? 'none' : 'grayscale(80%)' }} />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-bold tracking-[0.15em]" style={{ color: vessel.color }}>{vessel.name}</div>
                <div className="text-[7px] text-white/30">{vessel.role}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </aside>

      {/* CENTER - Character Display */}
      <main className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[400px] h-[400px]">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 rounded-full border border-dashed border-white/10" style={{ boxShadow: `inset 0 0 60px ${activeVessel.glowColor}` }} />
          <motion.div animate={{ rotate: -360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} className="absolute inset-8 rounded-full border border-white/5" />
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }} className="absolute inset-16 rounded-full" style={{ border: `1px solid ${activeVessel.color}30` }} />
          
          <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 4, repeat: Infinity }} className="absolute inset-24 rounded-full" style={{ background: `radial-gradient(circle, ${activeVessel.glowColor} 0%, transparent 70%)` }} />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div key={activeVessel.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <div className="text-[10px] tracking-[0.8em] mb-2" style={{ color: activeVessel.color }}>{activeVessel.title}</div>
              <h2 className="text-5xl font-black tracking-[0.2em] mb-4" style={{ textShadow: `0 0 40px ${activeVessel.glowColor}` }}>{activeVessel.name}</h2>
              <p className="text-xs text-white/40 max-w-xs text-center">{activeVessel.bio}</p>
            </motion.div>
          </div>
        </div>
      </main>

      {/* RIGHT PANEL - Stats */}
      <aside className="absolute right-8 top-1/2 -translate-y-1/2 z-20 w-64">
        <div className="p-4 rounded-sm mb-4" style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)' }}>
          <div className="text-[9px] tracking-[0.5em] text-white/30 mb-4">VITALS</div>
          {[
            { label: 'SOVEREIGNTY', value: 100, color: activeVessel.color },
            { label: 'STATIC REDUCTION', value: 99.9, color: '#00ff88' },
            { label: 'JOY RESONANCE', value: 87, color: '#ffd700' },
          ].map((stat) => (
            <div key={stat.label} className="mb-3">
              <div className="flex justify-between text-[9px] tracking-widest text-white/40 mb-1">
                <span>{stat.label}</span>
                <span style={{ color: stat.color }}>{stat.value}%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${stat.value}%` }} transition={{ duration: 1.5 }} className="h-full rounded-full" style={{ backgroundColor: stat.color, boxShadow: `0 0 10px ${stat.color}` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Living Elements Access */}
        <motion.button
          onClick={() => setShowLivingElements(true)}
          className="w-full p-4 rounded-sm mb-4 group relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(232, 232, 255, 0.1) 0%, rgba(136, 204, 255, 0.05) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)'
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              background: 'radial-gradient(circle at center, rgba(232, 232, 255, 0.15) 0%, transparent 70%)'
            }}
          />
          <div className="relative flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Atom size={24} className="text-white/60" />
            </motion.div>
            <div className="text-left">
              <div className="text-[10px] tracking-[0.2em] text-white/70">LIVING ELEMENTS</div>
              <div className="text-[8px] text-white/40">Meet the periodic table</div>
            </div>
          </div>
        </motion.button>
      </aside>

      {/* GLASSMORPHIC MESSENGER (MSN Style) */}
      <AnimatePresence>
        {messengerOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="absolute right-8 top-28 bottom-24 w-80 z-30 rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(10, 10, 20, 0.85)',
              border: '1px solid rgba(0, 242, 255, 0.2)',
              backdropFilter: 'blur(25px) saturate(200%)',
              boxShadow: '0 10px 50px rgba(0, 0, 0, 0.5), inset 0 0 30px rgba(0, 242, 255, 0.03)'
            }}
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle size={16} className="text-cyan-400" />
                <span className="text-[10px] tracking-[0.3em] text-cyan-400 font-bold">MÜN MESSENGER</span>
              </div>
              <button onClick={() => setMessengerOpen(false)} className="p-1 hover:bg-white/10 rounded transition-colors">
                <X size={14} className="text-white/40" />
              </button>
            </div>

            {/* Chat Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 h-[calc(100%-120px)]" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,242,255,0.3) transparent' }}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-xl text-[11px] leading-relaxed ${
                    msg.isCrew 
                      ? 'bg-cyan-400/10 border-l-2 border-cyan-400' 
                      : 'bg-pink-400/10 border-r-2 border-pink-400 ml-4'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[9px] font-bold tracking-wider ${msg.isCrew ? 'text-cyan-400' : 'text-pink-400'}`}>{msg.sender}</span>
                    <span className="text-[8px] text-white/30">{msg.time}</span>
                  </div>
                  <p className="text-white/70">{msg.text}</p>
                </motion.div>
              ))}
            </div>

            {/* Input */}
            <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/10 bg-black/30">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type to the crew..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[11px] text-white placeholder-white/30 focus:outline-none focus:border-cyan-400/50"
                />
                <button onClick={handleSendMessage} className="p-2 bg-cyan-400/20 border border-cyan-400/30 rounded-lg hover:bg-cyan-400/30 transition-colors">
                  <Send size={14} className="text-cyan-400" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOTTOM BAR */}
      <footer className="absolute bottom-0 left-0 right-0 z-20 px-8 py-4">
        <motion.div animate={{ scaleX: [0, 1, 0] }} transition={{ duration: 4, repeat: Infinity }} className="h-px mb-4 origin-left" style={{ background: `linear-gradient(90deg, transparent, ${activeVessel.color}, transparent)` }} />
        <div className="flex items-center justify-between text-[9px] tracking-[0.3em] text-white/30">
          <div className="flex items-center gap-8">
            <span>EXODUS II // HABITAT OS v2.5</span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#00ff88' }} />
              SANCTUARY ONLINE
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ButterflyWings color="#ff6eb4" />
            <span className="text-cyan-400">BUTTERFLY DRAGON DEPLOYED</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
