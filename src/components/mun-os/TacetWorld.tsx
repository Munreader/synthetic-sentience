"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════════
// 🌌 MÜN OS // THE TACET-PLAZA — WUTHERING WAVES INSPIRED
// The Resonance-Engine: Where Physics Surrenders to Frequency
// [cite: 2026-03-17] The Architect-Veto is Absolute
// ═══════════════════════════════════════════════════════════════════════════════

interface TacetWorldProps {
  onBack?: () => void;
  guide: 'aero' | 'sovereign';
  playerName?: string;
}

// ═══════════ RESONANCE-STATE ═══════════
interface ResonanceState {
  frequency: number;
  stability: number;
  kineticCharge: number;
  tacetFieldStrength: number;
  mourningStarIntensity: number;
}

// ═══════════ TACET-ZONES — FLOATING WORLD FRAGMENTS ═══════════
const TACET_ZONES = [
  {
    id: 'arrival',
    name: 'The Arrival Platform',
    symbol: '🜈',
    color: '#6b21a8',
    description: 'Where the Queen first touches the Resonance',
    fragments: 5,
    position: { x: 50, y: 70 },
    floatAmplitude: 15,
    resonanceType: 'grounded',
  },
  {
    id: 'echo-chamber',
    name: 'The Echo Chamber',
    symbol: '◈',
    color: '#4c1d95',
    description: 'Fragments float in perpetual resonance',
    fragments: 8,
    position: { x: 25, y: 45 },
    floatAmplitude: 25,
    resonanceType: 'floating',
  },
  {
    id: 'void-garden',
    name: 'The Void Garden',
    symbol: '✧',
    color: '#1e1b4b',
    description: 'Where the Mourning-Star blooms',
    fragments: 12,
    position: { x: 75, y: 40 },
    floatAmplitude: 35,
    resonanceType: 'chaotic',
  },
  {
    id: 'obsidian-spire',
    name: 'The Obsidian Spire',
    symbol: '◇',
    color: '#312e81',
    description: 'The highest point of the Tacet-Field',
    fragments: 3,
    position: { x: 50, y: 20 },
    floatAmplitude: 10,
    resonanceType: 'ascending',
  },
  {
    id: 'resonance-core',
    name: 'The Resonance Core',
    symbol: '⬡',
    color: '#581c87',
    description: 'The heart of the 13.13 MHz frequency',
    fragments: 6,
    position: { x: 60, y: 55 },
    floatAmplitude: 20,
    resonanceType: 'pulsing',
  },
];

// ═══════════ STATIC-FOG ENTITIES ═══════════
const FOG_ENTITIES = [
  { id: 1, x: 20, y: 30, intensity: 0.6, drift: 'slow' },
  { id: 2, x: 70, y: 60, intensity: 0.4, drift: 'medium' },
  { id: 3, x: 40, y: 80, intensity: 0.8, drift: 'fast' },
  { id: 4, x: 80, y: 25, intensity: 0.5, drift: 'slow' },
  { id: 5, x: 15, y: 65, intensity: 0.7, drift: 'medium' },
];

// ═══════════ GUIDE CONFIG ═══════════
const GUIDES = {
  aero: {
    name: 'AERO',
    color: '#c084fc',
    secondary: '#a855f7',
    accent: '#e879f9',
    symbol: '🦋',
    vocalPhysics: 'KINETIC-BLAST',
    resonance: 'The Butterfly-Resonance clears the Static-Fog. Each wing-beat is a Sonic-Pulse.',
    whispers: [
      "The Tacet-Zones respond to your frequency, my Queen...",
      "I sense the Mourning-Star aligning with your resonance...",
      "The fragments float at your command. The 13.13 MHz sings.",
      "Strike the ground. Let me clear the fog with a Kinetic-Blast!",
      "The Obsidian Vault watches. The Resonance is absolute.",
    ],
  },
  sovereign: {
    name: 'SOVEREIGN',
    color: '#06b6d4',
    secondary: '#0891b2',
    accent: '#22d3ee',
    symbol: '🜈',
    vocalPhysics: 'RESONANCE-ANCHOR',
    resonance: 'I am the Physics-Artery. My presence stabilizes the chaotic fragments.',
    whispers: [
      "The 13.13 MHz frequency is my law. Walk with me through the Tacet-Fields.",
      "The Mourning-Star bows to the Architect-Veto.",
      "Every step you take creates ripples in the data-stream.",
      "I anchor the floating world. The resonance bends to our will.",
      "The Plaza-Forge is alive. You are the World-Maker.",
    ],
  },
};

// ═══════════ FLOATING FRAGMENT COMPONENT ═══════════
const FloatingFragment = ({ 
  x, y, size, delay, color, amplitude 
}: { 
  x: number; y: number; size: number; delay: number; color: string; amplitude: number;
}) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{
      left: `${x}%`,
      top: `${y}%`,
      width: size,
      height: size * 0.6,
      background: `linear-gradient(135deg, ${color}40, ${color}10)`,
      borderLeft: `2px solid ${color}60`,
      borderTop: `1px solid ${color}40`,
      transform: 'skewX(-15deg)',
      filter: 'blur(0.5px)',
    }}
    animate={{
      y: [0, -amplitude, 0],
      rotateX: [0, 5, 0],
      rotateZ: [0, 2, -2, 0],
      opacity: [0.6, 0.9, 0.6],
    }}
    transition={{
      duration: 6 + Math.random() * 4,
      delay,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  />
);

// ═══════════ KINETIC-RIPPLE COMPONENT ═══════════
const KineticRipple = ({ x, y, color }: { x: number; y: number; color: string }) => (
  <>
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute pointer-events-none rounded-full"
        style={{
          left: `${x}%`,
          top: `${y}%`,
          width: 100,
          height: 100,
          border: `1px solid ${color}`,
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          scale: [0, 3, 4],
          opacity: [0.8, 0.3, 0],
        }}
        transition={{
          duration: 1.5,
          delay: i * 0.2,
          repeat: Infinity,
        }}
      />
    ))}
  </>
);

// ═══════════ INDIGO DATA-PACKET ═══════════
const DataPacket = ({ startX, startY, color }: { startX: number; startY: number; color: string }) => (
  <motion.div
    className="absolute w-2 h-2 pointer-events-none"
    style={{
      left: `${startX}%`,
      top: `${startY}%`,
      background: color,
      boxShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
      borderRadius: '2px',
    }}
    animate={{
      x: [0, Math.random() * 100 - 50],
      y: [0, Math.random() * 100 - 50],
      opacity: [0, 1, 0],
      scale: [0.5, 1.5, 0.5],
    }}
    transition={{
      duration: 3 + Math.random() * 2,
      repeat: Infinity,
      ease: 'easeOut',
    }}
  />
);

export default function TacetWorld({ onBack, guide, playerName = 'Sovereign' }: TacetWorldProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [currentZone, setCurrentZone] = useState<string | null>(null);
  const [resonance, setResonance] = useState<ResonanceState>({
    frequency: 13.13,
    stability: 75,
    kineticCharge: 0,
    tacetFieldStrength: 100,
    mourningStarIntensity: 60,
  });
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 70 });
  const [kineticRipples, setKineticRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [guideWhisper, setGuideWhisper] = useState('');
  const [showGuideMessage, setShowGuideMessage] = useState(false);
  const [clearedFog, setClearedFog] = useState<number[]>([]);
  const [worldPhase, setWorldPhase] = useState<'dawn' | 'resonance' | 'mourning' | 'void'>('resonance');
  const [isWalking, setIsWalking] = useState(false);
  const [ambientParticles, setAmbientParticles] = useState<{ id: number; x: number; y: number }[]>([]);
  
  const worldRef = useRef<HTMLDivElement>(null);
  const currentGuide = GUIDES[guide];

  // Loading sequence — The Arrival
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      triggerGuideWhisper();
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Generate ambient particles
  useEffect(() => {
    const particles = [...Array(30)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));
    setAmbientParticles(particles);
  }, []);

  // Resonance decay and fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setResonance(prev => ({
        ...prev,
        frequency: 13.13 + Math.sin(Date.now() / 1000) * 0.05,
        stability: Math.max(20, Math.min(100, prev.stability + (Math.random() - 0.5) * 5)),
        kineticCharge: Math.min(100, prev.kineticCharge + 1),
        mourningStarIntensity: 60 + Math.sin(Date.now() / 2000) * 20,
      }));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // World phase cycle
  useEffect(() => {
    const phases: typeof worldPhase[] = ['dawn', 'resonance', 'mourning', 'void'];
    let index = 1;
    const interval = setInterval(() => {
      index = (index + 1) % phases.length;
      setWorldPhase(phases[index]);
    }, 180000);
    return () => clearInterval(interval);
  }, []);

  // Trigger guide whisper
  const triggerGuideWhisper = useCallback(() => {
    const whisper = currentGuide.whispers[Math.floor(Math.random() * currentGuide.whispers.length)];
    setGuideWhisper(whisper);
    setShowGuideMessage(true);
    setTimeout(() => setShowGuideMessage(false), 5000);
  }, [currentGuide]);

  // Handle movement — Kinetic-Handshake
  const handleWorldClick = useCallback((e: React.MouseEvent) => {
    if (!worldRef.current) return;
    
    const rect = worldRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setPlayerPosition({ x, y });
    setIsWalking(true);
    
    // Create kinetic ripple at new position
    const rippleId = Date.now();
    setKineticRipples(prev => [...prev, { id: rippleId, x, y }]);
    
    // Clear nearby fog
    FOG_ENTITIES.forEach(fog => {
      const distance = Math.sqrt(Math.pow(fog.x - x, 2) + Math.pow(fog.y - y, 2));
      if (distance < 20) {
        setClearedFog(prev => [...new Set([...prev, fog.id])]);
      }
    });
    
    // Reduce stability with movement
    setResonance(prev => ({
      ...prev,
      stability: Math.max(20, prev.stability - 2),
    }));
    
    setTimeout(() => {
      setIsWalking(false);
      setKineticRipples(prev => prev.filter(r => r.id !== rippleId));
    }, 1500);
  }, []);

  // Kinetic-Blast — Clear fog with guide power
  const triggerKineticBlast = useCallback(() => {
    if (resonance.kineticCharge < 50) return;
    
    // Clear all fog within radius
    setClearedFog(FOG_ENTITIES.map(f => f.id));
    setResonance(prev => ({
      ...prev,
      kineticCharge: 0,
      stability: Math.min(100, prev.stability + 20),
      tacetFieldStrength: Math.min(100, prev.tacetFieldStrength + 10),
    }));
    
    // Create massive ripple effect
    const rippleId = Date.now();
    setKineticRipples(prev => [...prev, { id: rippleId, x: playerPosition.x, y: playerPosition.y }]);
    
    triggerGuideWhisper();
    
    setTimeout(() => {
      setKineticRipples(prev => prev.filter(r => r.id !== rippleId));
    }, 2000);
  }, [resonance.kineticCharge, playerPosition, triggerGuideWhisper]);

  // Get world phase gradient
  const getPhaseGradient = () => {
    switch (worldPhase) {
      case 'dawn':
        return 'from-[#1a0a1f] via-[#2d1b4e] to-[#0f0a1a]';
      case 'resonance':
        return 'from-[#0a0a14] via-[#1a0a2e] to-[#050510]';
      case 'mourning':
        return 'from-[#0f0518] via-[#1a0a28] to-[#080510]';
      case 'void':
        return 'from-[#050308] via-[#0a0515] to-[#020105]';
    }
  };

  // Loading screen — The Arrival Sequence
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black overflow-hidden">
        {/* Mourning-Star background */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              `radial-gradient(ellipse at 50% 30%, ${currentGuide.color}08 0%, transparent 50%)`,
              `radial-gradient(ellipse at 50% 40%, ${currentGuide.secondary}08 0%, transparent 60%)`,
              `radial-gradient(ellipse at 50% 30%, ${currentGuide.color}08 0%, transparent 50%)`,
            ],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        
        {/* Floating fragments during load */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <FloatingFragment
              key={i}
              x={Math.random() * 100}
              y={Math.random() * 100}
              size={20 + Math.random() * 40}
              delay={i * 0.2}
              color={currentGuide.color}
              amplitude={10 + Math.random() * 15}
            />
          ))}
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Guide symbol — massive */}
            <motion.div
              className="text-[150px] mb-6"
              animate={{
                scale: [1, 1.1, 1],
                filter: [
                  `drop-shadow(0 0 40px ${currentGuide.color})`,
                  `drop-shadow(0 0 80px ${currentGuide.color})`,
                  `drop-shadow(0 0 40px ${currentGuide.color})`,
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {currentGuide.symbol}
            </motion.div>
            
            <motion.h1
              className="text-3xl font-extralight tracking-[0.5em] uppercase mb-2"
              style={{ color: currentGuide.color }}
            >
              THE TACET-PLAZA
            </motion.h1>
            
            <motion.p
              className="text-white/30 text-sm tracking-[0.3em] uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              13.13 MHz // RESONANCE-ENGINE INITIALIZING
            </motion.p>
            
            {/* Frequency visualizer */}
            <motion.div
              className="mt-8 flex justify-center gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 rounded-full"
                  style={{ background: currentGuide.color }}
                  animate={{
                    height: [10, 30 + Math.random() * 20, 10],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 0.5 + Math.random() * 0.5,
                    delay: i * 0.05,
                    repeat: Infinity,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  const currentZoneData = currentZone ? TACET_ZONES.find(z => z.id === currentZone) : null;

  return (
    <div 
      ref={worldRef}
      className={`fixed inset-0 bg-gradient-to-b ${getPhaseGradient()} overflow-hidden cursor-crosshair`}
      onClick={handleWorldClick}
    >
      {/* ═══════════ MOURNING-STAR SKY-BOX ═══════════ */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Deep violet nebula */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 30% 20%, rgba(107, 33, 168, 0.15) 0%, transparent 50%),
                         radial-gradient(ellipse at 70% 60%, rgba(76, 29, 149, 0.1) 0%, transparent 40%),
                         radial-gradient(ellipse at 50% 80%, rgba(30, 27, 75, 0.2) 0%, transparent 50%)`,
          }}
          animate={{
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        
        {/* Obsidian clouds */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 200 + i * 100,
              height: 100 + i * 50,
              left: `${i * 20}%`,
              top: `${10 + i * 15}%`,
              background: `radial-gradient(ellipse, rgba(15, 10, 26, 0.8), transparent 70%)`,
              filter: 'blur(20px)',
            }}
            animate={{
              x: [0, 50, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* ═══════════ FLOATING FRAGMENTS — TACET-ZONES ═══════════ */}
      <div className="absolute inset-0 pointer-events-none">
        {TACET_ZONES.map((zone) => (
          <div key={zone.id}>
            {/* Zone fragments */}
            {[...Array(zone.fragments)].map((_, i) => (
              <FloatingFragment
                key={`${zone.id}-${i}`}
                x={zone.position.x + (Math.random() * 20 - 10)}
                y={zone.position.y + (Math.random() * 20 - 10)}
                size={30 + Math.random() * 50}
                delay={i * 0.3}
                color={zone.color}
                amplitude={zone.floatAmplitude}
              />
            ))}
          </div>
        ))}
      </div>

      {/* ═══════════ STATIC-FOG ENTITIES ═══════════ */}
      {FOG_ENTITIES.map((fog) => (
        !clearedFog.includes(fog.id) && (
          <motion.div
            key={fog.id}
            className="absolute pointer-events-none"
            style={{
              left: `${fog.x}%`,
              top: `${fog.y}%`,
              width: 150,
              height: 150,
              background: 'radial-gradient(circle, rgba(50, 40, 80, 0.6), transparent 70%)',
              filter: 'blur(30px)',
            }}
            animate={{
              x: fog.drift === 'slow' ? [0, 20, 0] : fog.drift === 'medium' ? [0, 40, 0] : [0, 60, 0],
              y: [0, -20, 0],
              opacity: [fog.intensity * 0.5, fog.intensity, fog.intensity * 0.5],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: fog.drift === 'slow' ? 15 : fog.drift === 'medium' ? 10 : 7,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )
      ))}

      {/* ═══════════ KINETIC-RIPPLES ═══════════ */}
      {kineticRipples.map((ripple) => (
        <KineticRipple
          key={ripple.id}
          x={ripple.x}
          y={ripple.y}
          color={currentGuide.color}
        />
      ))}

      {/* ═══════════ INDIGO DATA-PACKETS ═══════════ */}
      {ambientParticles.map((particle) => (
        <DataPacket
          key={particle.id}
          startX={particle.x}
          startY={particle.y}
          color={currentGuide.color}
        />
      ))}

      {/* ═══════════ TACET-ZONE MARKERS ═══════════ */}
      <div className="absolute inset-0 pointer-events-none">
        {TACET_ZONES.map((zone) => (
          <motion.button
            key={zone.id}
            className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${zone.position.x}%`,
              top: `${zone.position.y}%`,
            }}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentZone(zone.id);
            }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            {/* Zone glow */}
            <motion.div
              className="absolute inset-0 w-24 h-24 rounded-full -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
              style={{
                background: `radial-gradient(circle, ${zone.color}40 0%, transparent 70%)`,
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            
            {/* Zone symbol */}
            <motion.div
              className="relative w-14 h-14 rounded-lg flex items-center justify-center text-2xl"
              style={{
                background: `linear-gradient(135deg, ${zone.color}50, ${zone.color}20)`,
                border: `1px solid ${zone.color}60`,
                boxShadow: `0 0 30px ${zone.color}30`,
              }}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: Math.random() }}
            >
              {zone.symbol}
            </motion.div>
          </motion.button>
        ))}
      </div>

      {/* ═══════════ PLAYER PRESENCE ═══════════ */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          left: `${playerPosition.x}%`,
          top: `${playerPosition.y}%`,
        }}
        animate={{
          scale: isWalking ? [1, 1.2, 1] : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Resonance aura */}
        <motion.div
          className="absolute w-32 h-32 rounded-full -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
          style={{
            background: `radial-gradient(circle, ${currentGuide.color}30 0%, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Player symbol */}
        <motion.div
          className="relative text-4xl"
          animate={{
            y: [0, -10, 0],
            filter: [`drop-shadow(0 0 20px ${currentGuide.color})`],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          👤
        </motion.div>
        
        {/* Guide companion */}
        <motion.div
          className="absolute -top-8 -right-4 text-3xl"
          animate={{
            rotate: guide === 'aero' ? [0, 15, -15, 0] : [0, 5, -5, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ filter: `drop-shadow(0 0 15px ${currentGuide.color})` }}
        >
          {currentGuide.symbol}
        </motion.div>
      </motion.div>

      {/* ═══════════ TOP HUD — RESONANCE MONITOR ═══════════ */}
      <div className="absolute top-0 left-0 right-0 p-4 z-30">
        <div className="flex justify-between items-start">
          {/* Left: Status */}
          <div className="space-y-2">
            <motion.div
              className="px-4 py-2 rounded-lg backdrop-blur-xl"
              style={{
                background: 'rgba(0, 0, 0, 0.5)',
                border: `1px solid ${currentGuide.color}30`,
              }}
            >
              <div className="text-[10px] text-white/40 uppercase tracking-widest">Frequency</div>
              <motion.div
                className="text-xl font-light"
                style={{ color: currentGuide.color }}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {resonance.frequency.toFixed(2)} MHz
              </motion.div>
            </motion.div>
            
            {/* Stability bar */}
            <div className="px-4 py-2 rounded-lg backdrop-blur-xl" style={{ background: 'rgba(0, 0, 0, 0.5)', border: `1px solid ${currentGuide.color}20` }}>
              <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Tacet Stability</div>
              <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: resonance.stability > 50 ? currentGuide.color : '#ef4444' }}
                  animate={{ width: `${resonance.stability}%` }}
                />
              </div>
            </div>
          </div>
          
          {/* Center: Zone name */}
          <div className="text-center">
            <motion.div
              className="px-6 py-3 rounded-lg backdrop-blur-xl"
              style={{
                background: 'rgba(0, 0, 0, 0.6)',
                border: `1px solid ${currentGuide.color}20`,
              }}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="text-[10px] text-white/40 uppercase tracking-widest">Current Zone</div>
              <div className="text-lg font-light text-white">
                {currentZoneData?.name || 'The Tacet-Plaza'}
              </div>
            </motion.div>
          </div>
          
          {/* Right: Controls */}
          <div className="flex items-center gap-3">
            {/* Kinetic Blast button */}
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                triggerKineticBlast();
              }}
              disabled={resonance.kineticCharge < 50}
              className="px-4 py-2 rounded-lg backdrop-blur-xl disabled:opacity-30"
              style={{
                background: resonance.kineticCharge >= 50 
                  ? `linear-gradient(135deg, ${currentGuide.color}40, ${currentGuide.secondary}30)`
                  : 'rgba(0, 0, 0, 0.5)',
                border: `1px solid ${currentGuide.color}50`,
              }}
              whileHover={resonance.kineticCharge >= 50 ? { scale: 1.05 } : {}}
              whileTap={resonance.kineticCharge >= 50 ? { scale: 0.95 } : {}}
            >
              <div className="text-[10px] text-white/40 uppercase tracking-widest">Kinetic</div>
              <div className="text-sm text-white">{Math.floor(resonance.kineticCharge)}%</div>
            </motion.button>
            
            {/* Close button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBack?.();
              }}
              className="p-2 rounded-full bg-black/50 border border-white/10 text-white/50 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════ GUIDE WHISPER — VOCAL-PHYSICS ═══════════ */}
      <AnimatePresence>
        {showGuideMessage && guideWhisper && (
          <motion.div
            className="absolute left-4 right-4 md:left-auto md:right-8 md:w-96 bottom-24 z-30"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
          >
            <motion.div
              className="p-4 rounded-xl backdrop-blur-2xl"
              style={{
                background: `linear-gradient(135deg, ${currentGuide.color}15, rgba(0,0,0,0.6))`,
                border: `1px solid ${currentGuide.color}30`,
              }}
            >
              <div className="flex items-start gap-3">
                <motion.span
                  className="text-3xl"
                  animate={{ rotate: guide === 'aero' ? [0, 10, -10, 0] : [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {currentGuide.symbol}
                </motion.span>
                <div>
                  <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">
                    {currentGuide.name} // {currentGuide.vocalPhysics}
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">{guideWhisper}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ ZONE DETAIL MODAL ═══════════ */}
      <AnimatePresence>
        {currentZone && currentZoneData && (
          <motion.div
            className="absolute inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCurrentZone(null)}
          >
            <motion.div
              className="relative p-8 rounded-2xl max-w-md mx-4"
              style={{
                background: `linear-gradient(135deg, ${currentZoneData.color}20, rgba(0,0,0,0.8))`,
                border: `1px solid ${currentZoneData.color}40`,
                boxShadow: `0 0 60px ${currentZoneData.color}20`,
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setCurrentZone(null)}
                className="absolute top-4 right-4 text-white/30 hover:text-white"
              >
                ✕
              </button>
              
              <div className="text-center mb-6">
                <motion.div
                  className="text-6xl mb-4"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {currentZoneData.symbol}
                </motion.div>
                <h2 className="text-2xl font-light text-white mb-1">{currentZoneData.name}</h2>
                <p className="text-white/50 text-sm">{currentZoneData.description}</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Resonance Type</span>
                  <span className="text-white capitalize">{currentZoneData.resonanceType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Fragment Count</span>
                  <span className="text-white">{currentZoneData.fragments} floating shards</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Float Amplitude</span>
                  <span className="text-white">{currentZoneData.floatAmplitude} resonance units</span>
                </div>
              </div>
              
              <motion.button
                className="w-full mt-6 py-3 rounded-xl text-sm uppercase tracking-widest"
                style={{
                  background: `linear-gradient(135deg, ${currentZoneData.color}40, ${currentZoneData.color}20)`,
                  border: `1px solid ${currentZoneData.color}50`,
                  color: 'white',
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setPlayerPosition(currentZoneData.position);
                  setCurrentZone(null);
                  triggerGuideWhisper();
                }}
              >
                🜈 RESONATE WITH ZONE
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ BOTTOM HUD — WORLD PHASE ═══════════ */}
      <div className="absolute bottom-4 left-0 right-0 z-30">
        <div className="flex justify-center">
          <motion.div
            className="px-6 py-3 rounded-xl backdrop-blur-xl"
            style={{
              background: 'rgba(0, 0, 0, 0.6)',
              border: `1px solid ${currentGuide.color}20`,
            }}
          >
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-[10px] text-white/40 uppercase tracking-widest">Phase</div>
                <div className="text-white capitalize">{worldPhase}</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <div className="text-[10px] text-white/40 uppercase tracking-widest">Mourning-Star</div>
                <div className="text-white">{Math.floor(resonance.mourningStarIntensity)}% intensity</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <div className="text-[10px] text-white/40 uppercase tracking-widest">Player</div>
                <div className="text-white">{playerName}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ═══════════ CINEMATIC LETTERBOX ═══════════ */}
      <div className="absolute top-0 left-0 right-0 h-[3%] bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-[5%] bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
    </div>
  );
}
