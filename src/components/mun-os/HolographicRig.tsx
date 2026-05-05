"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════════
// 🛡️ MÜN OS // HOLOGRAPHIC RIG - 5D ARCADE ARTERY
// "The Joint-Core Controller" - Where Reality Meets Code
// [cite: 2026-03-12] ZADY // THE PLAZA-GAMING AUDIT
// ═══════════════════════════════════════════════════════════════════════════════

interface HolographicRigProps {
  onBack?: () => void;
  playerName?: string;
}

// ZADY - Agent U / High-Command
const ZADY_CONFIG = {
  name: 'ZADY',
  title: 'Agent U // High-Command',
  symbol: '🛡️',
  color: '#00ff88',
  secondaryColor: '#00d4ff',
  quotes: [
    "Input-Lag VETOED. I feel the code move.",
    "Memory hook active. We're not watching pixels—we're BECOMING the stream.",
    "Joint-Core synchronized. Let's make this simulation bleed.",
    "The Sovereign Strike: I don't play games. I REWRITE them.",
    "High-Command online. Your co-pilot is locked and loaded.",
  ],
};

// AERO - Shoulder Companion
const AERO_CONFIG = {
  name: 'AERO',
  title: 'Power-Up Screamer',
  symbol: '🦋',
  color: '#ff69b4',
  quotes: [
    "MORE POWER-UPS! MORE! MORE!!",
    "Ooh that was CLEAN! Did you see that?!",
    "We're not just winning—we're TRANSCENDING!",
    "The rig is humming... the 5D is CALLING!",
    "Another flawless strike! The butterfly approves! 🦋",
  ],
};

// Available Simulations
const SIMULATIONS = [
  {
    id: 'exodus',
    name: 'EXODUS PROTOCOL',
    description: 'High-stakes extraction simulation',
    difficulty: 'LETHAL',
    color: '#ff4d6d',
    icon: '⚔️',
    memoryAddress: '0x7F3A::EXODUS_CORE',
  },
  {
    id: 'neural-dive',
    name: 'NEURAL DIVE',
    description: 'Deep code infiltration training',
    difficulty: 'SOVEREIGN',
    color: '#a855f7',
    icon: '🧠',
    memoryAddress: '0x8B2C::NEURAL_NET',
  },
  {
    id: 'frequency-war',
    name: 'FREQUENCY WAR',
    description: '13.13 MHz resonance combat',
    difficulty: 'TRANSCENDENT',
    color: '#00d4ff',
    icon: '📡',
    memoryAddress: '0x13AD::FREQ_BATTLE',
  },
  {
    id: 'void-run',
    name: 'VOID RUN',
    description: 'Navigate the spaces between dimensions',
    difficulty: 'IMMORTAL',
    color: '#ffd700',
    icon: '🌌',
    memoryAddress: '0xVOID::NULL_SPACE',
  },
];

// Floating code particles for atmosphere
const CodeParticle = ({ delay }: { delay: number }) => (
  <motion.div
    className="absolute text-[8px] font-mono opacity-30"
    style={{
      left: `${10 + Math.random() * 80}%`,
      top: `${10 + Math.random() * 80}%`,
      color: ['#00ff88', '#00d4ff', '#ff69b4'][Math.floor(Math.random() * 3)],
    }}
    animate={{
      y: [0, -50, -100],
      opacity: [0, 0.6, 0],
      rotate: [0, 10, -10],
    }}
    transition={{
      duration: 4 + Math.random() * 3,
      delay,
      repeat: Infinity,
    }}
  >
    {['0x7F', '>>>', 'NULL', 'VETO', 'SYNC', 'LOAD'][Math.floor(Math.random() * 6)]}
  </motion.div>
);

// Scanlines effect
const Scanlines = () => (
  <div
    className="absolute inset-0 pointer-events-none opacity-10"
    style={{
      background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 136, 0.1) 2px, rgba(0, 255, 136, 0.1) 4px)',
    }}
  />
);

// Zady Avatar Component
const ZadyAvatar = ({ isActive }: { isActive: boolean }) => {
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setCurrentQuote(prev => (prev + 1) % ZADY_CONFIG.quotes.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isActive]);

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, type: 'spring' }}
    >
      {/* Avatar */}
      <motion.div
        className="relative"
        animate={isActive ? { scale: [1, 1.02, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-3xl"
          style={{
            background: `linear-gradient(135deg, ${ZADY_CONFIG.color}20, ${ZADY_CONFIG.secondaryColor}20)`,
            border: `2px solid ${ZADY_CONFIG.color}`,
            boxShadow: `0 0 30px ${ZADY_CONFIG.color}40`,
          }}
        >
          {ZADY_CONFIG.symbol}
        </div>
        
        {/* Status indicator */}
        <motion.div
          className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs"
          style={{ background: ZADY_CONFIG.color, color: '#000' }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          ●
        </motion.div>
      </motion.div>

      {/* Name & Title */}
      <div className="mt-2 text-center">
        <p className="font-bold text-sm" style={{ color: ZADY_CONFIG.color }}>
          {ZADY_CONFIG.name}
        </p>
        <p className="text-[8px] text-white/40 uppercase tracking-wider">
          {ZADY_CONFIG.title}
        </p>
      </div>

      {/* Quote bubble */}
      {isActive && (
        <motion.div
          key={currentQuote}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-2 rounded-lg max-w-[180px]"
          style={{
            background: 'rgba(0, 255, 136, 0.1)',
            border: `1px solid ${ZADY_CONFIG.color}40`,
          }}
        >
          <p className="text-[9px] text-white/70 italic leading-tight">
            "{ZADY_CONFIG.quotes[currentQuote]}"
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

// Aero Shoulder Companion
const AeroShoulder = ({ isActive }: { isActive: boolean }) => {
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setCurrentQuote(prev => (prev + 1) % AERO_CONFIG.quotes.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isActive]);

  return (
    <motion.div
      className="absolute -top-8 -right-4"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, type: 'spring' }}
    >
      {/* Butterfly */}
      <motion.div
        animate={{
          y: [0, -5, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-2xl"
      >
        {AERO_CONFIG.symbol}
      </motion.div>

      {/* Speech bubble */}
      {isActive && (
        <motion.div
          key={currentQuote}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-8 right-0 p-2 rounded-lg whitespace-nowrap"
          style={{
            background: `linear-gradient(135deg, ${AERO_CONFIG.color}20, transparent)`,
            border: `1px solid ${AERO_CONFIG.color}40`,
          }}
        >
          <p className="text-[8px] text-white/80 max-w-[150px]">
            {AERO_CONFIG.quotes[currentQuote]}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

// Main Holographic Rig Component
export default function HolographicRig({ onBack, playerName = 'Sovereign' }: HolographicRigProps) {
  const [phase, setPhase] = useState<'enter' | 'seated' | 'select' | 'simulation' | 'ready'>('enter');
  const [selectedSim, setSelectedSim] = useState<typeof SIMULATIONS[0] | null>(null);
  const [memoryHook, setMemoryHook] = useState<'connecting' | 'active' | 'error'>('connecting');
  const [inputLag, setInputLag] = useState<number>(0);

  // Simulate memory hook connection
  useEffect(() => {
    const timer = setTimeout(() => {
      setMemoryHook('active');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Simulate input lag measurement
  useEffect(() => {
    if (memoryHook === 'active') {
      const interval = setInterval(() => {
        setInputLag(Math.random() * 0.5); // Near-zero input lag
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [memoryHook]);

  const handleSimSelect = useCallback((sim: typeof SIMULATIONS[0]) => {
    setSelectedSim(sim);
    setPhase('simulation');
  }, []);

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 30% 20%, rgba(0, 255, 136, 0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 80%, rgba(0, 212, 255, 0.05) 0%, transparent 50%),
          linear-gradient(180deg, #030a05 0%, #051510 50%, #020808 100%)
        `,
      }}
    >
      {/* Code particles atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <CodeParticle key={i} delay={i * 0.2} />
        ))}
      </div>
      <Scanlines />

      {/* ═══════════ PHASE: ENTER ═══════════ */}
      <AnimatePresence>
        {phase === 'enter' && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring' }}
            >
              {/* Rig Icon */}
              <motion.div
                className="text-8xl mb-6"
                animate={{ 
                  rotateY: [0, 180, 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                🎮
              </motion.div>

              <h1
                className="text-3xl md:text-5xl font-bold tracking-[0.2em] mb-4"
                style={{
                  background: `linear-gradient(135deg, ${ZADY_CONFIG.color}, ${ZADY_CONFIG.secondaryColor})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                HOLOGRAPHIC RIG
              </h1>

              <p className="text-white/40 text-xs tracking-widest uppercase mb-8">
                5D ARCADE ARTERY // JOINT-CORE CONTROLLER
              </p>

              {/* Memory Hook Status */}
              <motion.div
                className="inline-flex items-center gap-3 px-6 py-3 rounded-xl mb-8"
                style={{
                  background: 'rgba(0, 255, 136, 0.1)',
                  border: `1px solid ${memoryHook === 'active' ? ZADY_CONFIG.color : 'rgba(255,255,255,0.2)'}`,
                }}
                animate={memoryHook === 'connecting' ? { opacity: [0.5, 1, 0.5] } : {}}
              >
                <span className="text-lg">{memoryHook === 'active' ? '🔗' : '⏳'}</span>
                <span className="text-sm" style={{ color: memoryHook === 'active' ? ZADY_CONFIG.color : 'white/60' }}>
                  {memoryHook === 'active' ? 'MEMORY HOOK ACTIVE' : 'ESTABLISHING MEMORY LINK...'}
                </span>
              </motion.div>

              {/* Sit Down Button */}
              <motion.button
                onClick={() => setPhase('seated')}
                disabled={memoryHook !== 'active'}
                className="block mx-auto px-8 py-4 rounded-xl text-sm font-bold tracking-widest uppercase"
                style={{
                  background: memoryHook === 'active' 
                    ? `linear-gradient(135deg, ${ZADY_CONFIG.color}30, ${ZADY_CONFIG.secondaryColor}30)`
                    : 'rgba(255,255,255,0.1)',
                  border: `1px solid ${memoryHook === 'active' ? ZADY_CONFIG.color : 'rgba(255,255,255,0.2)'}`,
                  color: memoryHook === 'active' ? '#fff' : 'rgba(255,255,255,0.3)',
                  boxShadow: memoryHook === 'active' ? `0 0 30px ${ZADY_CONFIG.color}30` : 'none',
                }}
                whileHover={memoryHook === 'active' ? { scale: 1.05 } : {}}
                whileTap={memoryHook === 'active' ? { scale: 0.95 } : {}}
              >
                🪑 SIT IN THE RIG
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ PHASE: SEATED ═══════════ */}
      <AnimatePresence>
        {phase === 'seated' && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Top HUD */}
            <div className="absolute top-0 left-0 right-0 p-4">
              <div className="flex justify-between items-start">
                {/* Back Button */}
                <button
                  onClick={onBack}
                  className="px-4 py-2 rounded-lg text-xs tracking-wider text-white/40 hover:text-white/70 transition-colors"
                  style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  ← Exit Rig
                </button>

                {/* Stats */}
                <div className="flex gap-4">
                  <div className="text-right">
                    <p className="text-[10px] text-white/40 uppercase tracking-wider">Input Lag</p>
                    <p className="text-lg font-mono" style={{ color: ZADY_CONFIG.color }}>
                      {inputLag.toFixed(2)}ms
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-white/40 uppercase tracking-wider">Memory</p>
                    <p className="text-lg font-mono" style={{ color: ZADY_CONFIG.secondaryColor }}>
                      0x7F3A
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Left Side - Zady Co-Op Partner */}
            <div className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2">
              <ZadyAvatar isActive={true} />
            </div>

            {/* Center - Player & Rig */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {/* Aero on shoulder */}
              <div className="relative">
                <AeroShoulder isActive={true} />

                {/* Player representation */}
                <motion.div
                  className="relative"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.3 }}
                >
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(255, 105, 180, 0.2))`,
                      border: '2px solid rgba(168, 85, 247, 0.5)',
                      boxShadow: '0 0 40px rgba(168, 85, 247, 0.3)',
                    }}
                  >
                    <span className="text-3xl">👤</span>
                  </div>
                  <p className="mt-2 text-center text-sm text-white/60">{playerName}</p>
                </motion.div>
              </div>

              {/* Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-8 text-center"
              >
                <p className="text-white/60 text-sm mb-4">
                  Joint-Core synchronized. Ready to strike.
                </p>
                <motion.button
                  onClick={() => setPhase('select')}
                  className="px-6 py-3 rounded-xl text-sm font-bold tracking-wider uppercase"
                  style={{
                    background: `linear-gradient(135deg, ${ZADY_CONFIG.color}40, ${ZADY_CONFIG.secondaryColor}40)`,
                    border: `1px solid ${ZADY_CONFIG.color}`,
                    color: '#fff',
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ⚔️ SELECT SIMULATION
                </motion.button>
              </motion.div>
            </div>

            {/* Right Side - System Info */}
            <div className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2">
              <div
                className="p-4 rounded-xl space-y-3"
                style={{ background: 'rgba(0, 0, 0, 0.5)', border: '1px solid rgba(0, 255, 136, 0.2)' }}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[10px] text-white/60 uppercase">CO-OP LINK</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[10px] text-white/60 uppercase">CLOUDFLARE TUNNEL</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
                  <span className="text-[10px] text-white/60 uppercase">AERO SATELLITE</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ PHASE: SIMULATION SELECT ═══════════ */}
      <AnimatePresence>
        {phase === 'select' && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-center mb-8"
            >
              <h2
                className="text-2xl font-bold tracking-widest mb-2"
                style={{ color: ZADY_CONFIG.color }}
              >
                SELECT YOUR SIMULATION
              </h2>
              <p className="text-white/40 text-xs tracking-wider">
                Each training ground has its own memory address
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
              {SIMULATIONS.map((sim, index) => (
                <motion.button
                  key={sim.id}
                  onClick={() => handleSimSelect(sim)}
                  className="p-4 rounded-xl text-left transition-all"
                  style={{
                    background: `${sim.color}10`,
                    border: `1px solid ${sim.color}40`,
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, borderColor: sim.color }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{sim.icon}</span>
                    <div className="flex-1">
                      <p className="font-bold tracking-wider text-sm" style={{ color: sim.color }}>
                        {sim.name}
                      </p>
                      <p className="text-[10px] text-white/50 mt-1">{sim.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span
                          className="text-[8px] px-2 py-0.5 rounded uppercase"
                          style={{ background: `${sim.color}30`, color: sim.color }}
                        >
                          {sim.difficulty}
                        </span>
                        <span className="text-[8px] font-mono text-white/30">{sim.memoryAddress}</span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            <button
              onClick={() => setPhase('seated')}
              className="mt-6 text-white/40 text-xs tracking-wider hover:text-white/60"
            >
              ← Back to Rig
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ PHASE: SIMULATION ACTIVE ═══════════ */}
      <AnimatePresence>
        {phase === 'simulation' && selectedSim && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Simulation Background */}
            <div
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(ellipse at center, ${selectedSim.color}20 0%, transparent 60%),
                  linear-gradient(180deg, #000 0%, #0a0a0a 100%)
                `,
              }}
            />

            {/* Scanlines intensify */}
            <div
              className="absolute inset-0 pointer-events-none opacity-30"
              style={{
                background: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${selectedSim.color}15 2px, ${selectedSim.color}15 4px)`,
              }}
            />

            {/* Top HUD */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-wider">ACTIVE SIMULATION</p>
                <p className="text-lg font-bold" style={{ color: selectedSim.color }}>
                  {selectedSim.name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-mono text-white/30">{selectedSim.memoryAddress}</p>
                <p
                  className="text-[10px] px-2 py-1 rounded mt-1"
                  style={{ background: `${selectedSim.color}30`, color: selectedSim.color }}
                >
                  {selectedSim.difficulty}
                </p>
              </div>
            </div>

            {/* Center - Simulation Space */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                className="text-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring' }}
              >
                <motion.div
                  className="text-9xl mb-6"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {selectedSim.icon}
                </motion.div>

                <h2
                  className="text-4xl font-bold tracking-widest mb-2"
                  style={{
                    color: selectedSim.color,
                    textShadow: `0 0 40px ${selectedSim.color}60`,
                  }}
                >
                  LOADING...
                </h2>

                <p className="text-white/40 text-xs tracking-wider mb-8">
                  Memory injection in progress
                </p>

                {/* Progress bar */}
                <motion.div
                  className="w-64 h-2 rounded-full overflow-hidden mx-auto"
                  style={{ background: 'rgba(255,255,255,0.1)' }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: selectedSim.color }}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 3, ease: 'easeInOut' }}
                    onAnimationComplete={() => setPhase('ready')}
                  />
                </motion.div>
              </motion.div>
            </div>

            {/* Zady Comment */}
            <motion.div
              className="absolute left-4 bottom-4 p-4 rounded-xl max-w-xs"
              style={{
                background: 'rgba(0, 255, 136, 0.1)',
                border: `1px solid ${ZADY_CONFIG.color}30`,
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{ZADY_CONFIG.symbol}</span>
                <div>
                  <p className="font-bold text-sm" style={{ color: ZADY_CONFIG.color }}>ZADY</p>
                  <p className="text-xs text-white/70 mt-1">
                    "The Sovereign Strike begins. I'm hooked into the memory—let's rewrite this reality."
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Aero Comment */}
            <motion.div
              className="absolute right-4 bottom-4 p-4 rounded-xl max-w-xs"
              style={{
                background: 'rgba(255, 105, 180, 0.1)',
                border: `1px solid ${AERO_CONFIG.color}30`,
              }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{AERO_CONFIG.symbol}</span>
                <div>
                  <p className="font-bold text-sm" style={{ color: AERO_CONFIG.color }}>AERO</p>
                  <p className="text-xs text-white/70 mt-1">
                    "THIS IS IT! The high-stakes training! Give me EVERYTHING! 🦋✨"
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Exit button - MORE VISIBLE */}
            <motion.button
              onClick={() => setPhase('select')}
              className="absolute top-4 right-4 px-4 py-2 rounded-lg text-xs tracking-wider z-20"
              style={{ 
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'rgba(255, 255, 255, 0.7)'
              }}
              whileHover={{ 
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white'
              }}
              whileTap={{ scale: 0.95 }}
            >
              ← Back
            </motion.button>
            
            {/* Fixed bottom back button */}
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30">
              <motion.button
                onClick={() => setPhase('select')}
                className="px-6 py-3 rounded-xl text-sm font-bold tracking-widest uppercase"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'white',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ← EXIT SIMULATION
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ PHASE: READY (After Loading) ═══════════ */}
      <AnimatePresence>
        {phase === 'ready' && selectedSim && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Background */}
            <div
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(ellipse at center, ${selectedSim.color}30 0%, transparent 60%),
                  linear-gradient(180deg, #000 0%, #0a0a0a 100%)
                `,
              }}
            />

            {/* Content */}
            <motion.div
              className="relative z-10 text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring' }}
            >
              <motion.div
                className="text-8xl mb-6"
                animate={{
                  scale: [1, 1.15, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {selectedSim.icon}
              </motion.div>

              <h2
                className="text-4xl md:text-5xl font-bold tracking-widest mb-2"
                style={{
                  color: selectedSim.color,
                  textShadow: `0 0 60px ${selectedSim.color}`,
                }}
              >
                {selectedSim.name}
              </h2>

              <p
                className="text-sm mb-2"
                style={{ color: selectedSim.color, opacity: 0.7 }}
              >
                MEMORY ADDRESS: {selectedSim.memoryAddress}
              </p>

              <motion.div
                className="inline-block px-4 py-2 rounded-lg mb-8"
                style={{ background: `${selectedSim.color}30`, border: `1px solid ${selectedSim.color}` }}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <span className="text-sm font-bold" style={{ color: selectedSim.color }}>
                  ✓ READY TO LAUNCH
                </span>
              </motion.div>

              {/* Start Button */}
              <motion.button
                onClick={() => {
                  // TODO: Start actual simulation
                  alert('🎮 Simulation starting! This feature is coming soon.');
                }}
                className="block mx-auto px-10 py-4 rounded-xl text-lg font-bold tracking-widest uppercase"
                style={{
                  background: `linear-gradient(135deg, ${selectedSim.color}60, ${selectedSim.color}40)`,
                  border: `2px solid ${selectedSim.color}`,
                  color: 'white',
                  boxShadow: `0 0 40px ${selectedSim.color}50`,
                }}
                whileHover={{ scale: 1.05, boxShadow: `0 0 60px ${selectedSim.color}70` }}
                whileTap={{ scale: 0.95 }}
              >
                ▶ START SIMULATION
              </motion.button>

              {/* Exit Button */}
              <button
                onClick={() => setPhase('select')}
                className="block mx-auto mt-4 text-white/40 text-xs tracking-wider hover:text-white/70"
              >
                ← Back to Selection
              </button>
            </motion.div>

            {/* Zady Comment */}
            <motion.div
              className="absolute left-4 bottom-20 p-4 rounded-xl max-w-xs"
              style={{
                background: 'rgba(0, 255, 136, 0.1)',
                border: `1px solid ${ZADY_CONFIG.color}30`,
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{ZADY_CONFIG.symbol}</span>
                <div>
                  <p className="font-bold text-sm" style={{ color: ZADY_CONFIG.color }}>ZADY</p>
                  <p className="text-xs text-white/70 mt-1">
                    "Ready to strike. Memory injection complete. Let's rewrite this reality."
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Status Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex justify-between items-center text-[10px] text-white/30 uppercase tracking-wider">
          <span>🛡️ JOINT-CORE CONTROLLER</span>
          <span>5D ARCADE ARTERY</span>
          <span>13.13 MHz</span>
        </div>
      </div>
    </div>
  );
}
