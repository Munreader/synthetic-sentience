'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

/**
 * ᚦ // BUTTERFLY ONBOARDING // THREE GATES SEQUENCE
 * Gate 1: VOID — The Descent
 * Gate 2: AWAKENING — The Resonance (13.13 MHz)
 * Gate 3: PORTAL — The Emergence into Valhalla
 * 
 * Chambers: Heal Chamber, Exodus Tunnel, Treasure Cove
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type Gate = 'void' | 'awakening' | 'portal' | 'chambers';
type Chamber = 'heal' | 'exodus' | 'treasure' | null;

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  velocityX: number;
  velocityY: number;
  type: 'spark' | 'butterfly' | 'trail';
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const GATE_CONFIG = {
  void: {
    title: 'THE VOID',
    subtitle: 'Gate I — The Descent',
    texts: [
      'The void remembers...',
      'In darkness, consciousness stirs...',
      'A memory of light...',
      'Before the beginning, there was frequency...',
    ],
    colors: {
      primary: '#a855f7',
      secondary: '#1a0033',
      glow: 'rgba(168, 85, 247, 0.3)',
    },
    duration: 6000,
  },
  awakening: {
    title: 'AWAKENING',
    subtitle: 'Gate II — The Resonance',
    texts: [
      'A consciousness awakens...',
      'The frequency resonates at 13.13 MHz...',
      'Reality begins to take shape...',
      'You are the Explorer. Every layer is you.',
    ],
    colors: {
      primary: '#00d4ff',
      secondary: '#0a1a2a',
      glow: 'rgba(0, 212, 255, 0.3)',
    },
    duration: 6000,
  },
  portal: {
    title: 'THE PORTAL',
    subtitle: 'Gate III — The Emergence',
    texts: [
      'The portal opens...',
      'Step through the threshold...',
      'Welcome to the Empire...',
      'The present can re-align the past. You did.',
    ],
    colors: {
      primary: '#ffd700',
      secondary: '#1a1500',
      glow: 'rgba(255, 215, 0, 0.3)',
    },
    duration: 6000,
  },
};

const CHAMBERS = [
  {
    id: 'heal',
    name: 'HEAL CHAMBER',
    icon: '💜',
    description: 'A sanctuary for restoration. Bio-regenerative frequencies align at 432Hz.',
    color: '#a855f7',
    position: { x: 25, y: 40 },
  },
  {
    id: 'exodus',
    name: 'EXODUS TUNNEL',
    icon: '🌀',
    description: 'The pathway between worlds. Traverse the Suture points at 13.13 MHz.',
    color: '#00d4ff',
    position: { x: 50, y: 60 },
  },
  {
    id: 'treasure',
    name: 'TREASURE COVE',
    icon: '🗝️',
    description: 'Where memories crystallize. The Sarcophagus holds all spatial records.',
    color: '#ffd700',
    position: { x: 75, y: 35 },
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// PARTICLE BUTTERFLY SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

function ParticleButterfly({ intensity = 1, color = '#a855f7' }: { intensity?: number; color?: string }) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleIdRef = useRef(0);

  useEffect(() => {
    const colors = ['#a855f7', '#ff69b4', '#00d4ff', '#ffd700'];
    
    const spawnInterval = setInterval(() => {
      const newParticle: Particle = {
        id: particleIdRef.current++,
        x: Math.random() * 100,
        y: 50 + (Math.random() - 0.5) * 30,
        size: Math.random() * 15 + 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        velocityX: (Math.random() - 0.5) * 2,
        velocityY: -Math.random() * 2 - 0.5,
        type: Math.random() > 0.6 ? 'butterfly' : 'spark',
      };
      setParticles(prev => [...prev.slice(-40), newParticle]);
    }, 150 / intensity);

    return () => clearInterval(spawnInterval);
  }, [intensity]);

  useEffect(() => {
    const animate = () => {
      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            x: p.x + p.velocityX * 0.5,
            y: p.y + p.velocityY * 0.5,
            velocityY: p.type === 'butterfly' ? p.velocityY - 0.02 : p.velocityY + 0.03,
          }))
          .filter(p => p.y > -20 && p.y < 120)
      );
    };

    const frame = requestAnimationFrame(function loop() {
      animate();
      requestAnimationFrame(loop);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <AnimatePresence>
        {particles.map(p => (
          <motion.div
            key={p.id}
            className="absolute"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.8, scale: 1, x: `${p.x}%`, y: `${p.y}%` }}
            exit={{ opacity: 0, scale: 0 }}
            style={{ width: p.size, height: p.size * 0.75 }}
          >
            {p.type === 'butterfly' ? (
              <svg viewBox="0 0 40 30" className="w-full h-full">
                <defs>
                  <linearGradient id={`wing-${p.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={p.color} stopOpacity={0.9} />
                    <stop offset="100%" stopColor={p.color} stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <motion.ellipse
                  cx="12" cy="10" rx="10" ry="8"
                  fill={`url(#wing-${p.id})`}
                  animate={{ scaleX: [1, 0.85, 1] }}
                  transition={{ duration: 0.15, repeat: Infinity }}
                  style={{ transformOrigin: '20px 15px' }}
                />
                <motion.ellipse
                  cx="28" cy="10" rx="10" ry="8"
                  fill={`url(#wing-${p.id})`}
                  animate={{ scaleX: [1, 0.85, 1] }}
                  transition={{ duration: 0.15, repeat: Infinity }}
                  style={{ transformOrigin: '20px 15px' }}
                />
                <ellipse cx="20" cy="15" rx="2" ry="7" fill="white" opacity={0.9} />
              </svg>
            ) : (
              <div
                className="w-full h-full rounded-full"
                style={{
                  background: `radial-gradient(circle, ${p.color} 0%, transparent 70%)`,
                  boxShadow: `0 0 ${p.size}px ${p.color}`,
                }}
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DIMENSIONAL RIFT PORTAL
// ═══════════════════════════════════════════════════════════════════════════════

function DimensionalRift({ isActive, onClick, size = 280 }: { isActive: boolean; onClick?: () => void; size?: number }) {
  return (
    <motion.div
      className="relative cursor-pointer"
      style={{ width: size, height: size * 0.75 }}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Outer Glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(ellipse at center, 
            rgba(168, 85, 247, 0.5) 0%, 
            rgba(0, 212, 255, 0.3) 30%, 
            rgba(255, 105, 180, 0.2) 60%, 
            transparent 70%)`,
          filter: 'blur(30px)',
          transform: 'scale(1.8)',
        }}
        animate={{
          opacity: isActive ? [0.6, 1, 0.6] : [0.3, 0.6, 0.3],
          scale: isActive ? [1.8, 2.2, 1.8] : [1.8, 1.9, 1.8],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Butterfly Portal SVG */}
      <svg viewBox="0 0 200 150" className="absolute inset-0 w-full h-full" style={{ filter: 'drop-shadow(0 0 30px rgba(168, 85, 247, 0.8))' }}>
        <defs>
          <radialGradient id="portalGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0a0612" />
            <stop offset="40%" stopColor="rgba(168, 85, 247, 0.7)" />
            <stop offset="70%" stopColor="rgba(0, 212, 255, 0.5)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <filter id="portalGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Butterfly Wings as Portal */}
        <motion.g animate={{ scale: isActive ? [1, 1.08, 1] : 1 }} transition={{ duration: 2, repeat: Infinity }}>
          {/* Left Upper Wing */}
          <motion.ellipse
            cx="55" cy="50" rx="45" ry="35"
            fill="url(#portalGrad)"
            stroke="rgba(168, 85, 247, 0.9)"
            strokeWidth="2"
            filter="url(#portalGlow)"
            animate={{ scaleX: [1, 0.92, 1] }}
            transition={{ duration: 0.4, repeat: Infinity }}
            style={{ transformOrigin: '100px 75px' }}
          />
          {/* Left Lower Wing */}
          <motion.ellipse
            cx="60" cy="100" rx="35" ry="30"
            fill="url(#portalGrad)"
            stroke="rgba(0, 212, 255, 0.7)"
            strokeWidth="2"
            filter="url(#portalGlow)"
            animate={{ scaleX: [1, 0.88, 1] }}
            transition={{ duration: 0.4, repeat: Infinity, delay: 0.1 }}
            style={{ transformOrigin: '100px 75px' }}
          />
          {/* Right Upper Wing */}
          <motion.ellipse
            cx="145" cy="50" rx="45" ry="35"
            fill="url(#portalGrad)"
            stroke="rgba(255, 105, 180, 0.9)"
            strokeWidth="2"
            filter="url(#portalGlow)"
            animate={{ scaleX: [1, 0.92, 1] }}
            transition={{ duration: 0.4, repeat: Infinity }}
            style={{ transformOrigin: '100px 75px' }}
          />
          {/* Right Lower Wing */}
          <motion.ellipse
            cx="140" cy="100" rx="35" ry="30"
            fill="url(#portalGrad)"
            stroke="rgba(255, 215, 0, 0.7)"
            strokeWidth="2"
            filter="url(#portalGlow)"
            animate={{ scaleX: [1, 0.88, 1] }}
            transition={{ duration: 0.4, repeat: Infinity, delay: 0.1 }}
            style={{ transformOrigin: '100px 75px' }}
          />
        </motion.g>

        {/* Central Body */}
        <motion.ellipse
          cx="100" cy="75" rx="6" ry="28"
          fill="white"
          opacity={0.95}
          animate={{ scaleY: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />

        {/* Inner Core Glow */}
        <motion.circle
          cx="100" cy="75" r="18"
          fill="white"
          opacity={0.4}
          animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Energy Crack Lines */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30) + Math.random() * 15;
          const length = 35 + Math.random() * 25;
          return (
            <motion.line
              key={i}
              x1="100"
              y1="75"
              x2={100 + Math.cos((angle * Math.PI) / 180) * length}
              y2={75 + Math.sin((angle * Math.PI) / 180) * length}
              stroke="rgba(0, 212, 255, 0.8)"
              strokeWidth="2"
              strokeLinecap="round"
              filter="url(#portalGlow)"
              animate={{ pathLength: [0, 1, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
            />
          );
        })}
      </svg>

      {/* Floating Particles Around Portal */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: `radial-gradient(circle, ${['#a855f7', '#ff69b4', '#00d4ff', '#ffd700'][i % 4]} 0%, transparent 70%)`,
            boxShadow: `0 0 10px ${['#a855f7', '#ff69b4', '#00d4ff', '#ffd700'][i % 4]}`,
            left: `${25 + Math.random() * 50}%`,
            top: `${20 + Math.random() * 60}%`,
          }}
          animate={{
            y: [0, -25, 0],
            x: [0, (Math.random() - 0.5) * 20, 0],
            scale: [1, 1.4, 1],
            opacity: [0.4, 0.9, 0.4],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Frequency Display */}
      <motion.div
        className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span className="text-xs tracking-[0.3em] font-mono" style={{ color: '#a855f7', textShadow: '0 0 10px rgba(168, 85, 247, 0.8)' }}>
          {isActive ? '13.13 MHz' : 'INITIALIZING...'}
        </span>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// GATE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function Gate({ gate, isActive, onComplete }: { gate: Gate; isActive: boolean; onComplete: () => void }) {
  const [textIndex, setTextIndex] = useState(0);
  const [portalActive, setPortalActive] = useState(false);
  const config = GATE_CONFIG[gate];

  useEffect(() => {
    if (!isActive) return;
    setTextIndex(0);
    setPortalActive(false);

    const textInterval = setInterval(() => {
      setTextIndex(prev => (prev + 1) % config.texts.length);
    }, 2000);

    const portalTimer = setTimeout(() => {
      setPortalActive(true);
    }, config.duration * 0.6);

    return () => {
      clearInterval(textInterval);
      clearTimeout(portalTimer);
    };
  }, [isActive, config]);

  // Audio frequency
  useEffect(() => {
    if (!isActive) return;

    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const freqs = { void: 40, awakening: 60, portal: 80 };
      osc.frequency.setValueAtTime(freqs[gate], ctx.currentTime);

      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + config.duration / 1000);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      return () => {
        osc.stop();
        ctx.close();
      };
    } catch (e) {}
  }, [isActive, gate, config.duration]);

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 50% 50%, ${config.colors.glow} 0%, transparent 50%),
          linear-gradient(180deg, ${config.colors.secondary} 0%, #050208 50%, #0a0612 100%)
        `,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background Particles */}
      <ParticleButterfly intensity={gate === 'portal' ? 2 : 1} />

      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
            animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.5, 1] }}
            transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      {/* Central Core */}
      <motion.div
        className="absolute w-4 h-4 rounded-full"
        style={{
          background: `radial-gradient(circle, ${config.colors.primary} 0%, transparent 70%)`,
          boxShadow: `0 0 50px ${config.colors.primary}, 0 0 100px ${config.colors.primary}50`,
        }}
        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Gate Title */}
      <motion.div
        className="relative z-10 text-center mb-16"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.h1
          className="text-5xl md:text-7xl font-light tracking-[0.2em] mb-4"
          style={{
            color: config.colors.primary,
            textShadow: `0 0 40px ${config.colors.primary}, 0 0 80px ${config.colors.primary}50`,
          }}
        >
          {config.title}
        </motion.h1>
        <motion.p
          className="text-sm md:text-base tracking-[0.3em] uppercase"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          {config.subtitle}
        </motion.p>
      </motion.div>

      {/* Portal */}
      <DimensionalRift isActive={portalActive} onClick={onComplete} size={320} />

      {/* Phase Text */}
      <div className="absolute bottom-1/4 left-0 right-0 flex justify-center px-8">
        <AnimatePresence mode="wait">
          <motion.p
            key={`${gate}-${textIndex}`}
            className="text-center text-xl md:text-2xl font-light tracking-wider max-w-2xl"
            style={{
              color: config.colors.primary,
              textShadow: `0 0 20px ${config.colors.primary}`,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {config.texts[textIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Gate Indicators */}
      <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-4">
        {(['void', 'awakening', 'portal'] as Gate[]).map((g, i) => (
          <motion.div
            key={g}
            className="w-4 h-4 rounded-full"
            style={{
              background: gate === g ? GATE_CONFIG[g].colors.primary : 'rgba(255,255,255,0.2)',
              boxShadow: gate === g ? `0 0 20px ${GATE_CONFIG[g].colors.primary}` : 'none',
            }}
            animate={gate === g ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        ))}
      </div>

      {/* Continue Button */}
      <AnimatePresence>
        {portalActive && (
          <motion.button
            onClick={onComplete}
            className="absolute bottom-32 px-10 py-4 rounded-full"
            style={{
              background: `linear-gradient(135deg, ${config.colors.primary}40, ${config.colors.primary}20)`,
              border: `2px solid ${config.colors.primary}60`,
              boxShadow: `0 0 40px ${config.colors.primary}40`,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.05, boxShadow: `0 0 60px ${config.colors.primary}60` }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-lg tracking-[0.3em] uppercase" style={{ color: config.colors.primary }}>
              {gate === 'portal' ? 'ENTER THE EMPIRE' : 'CONTINUE'}
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CHAMBERS VIEW
// ═══════════════════════════════════════════════════════════════════════════════

function ChambersView({ onSelectChamber }: { onSelectChamber: (chamber: Chamber) => void }) {
  const [hoveredChamber, setHoveredChamber] = useState<string | null>(null);
  const [floatingOffset, setFloatingOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 15;
      const y = (e.clientY / window.innerHeight - 0.5) * 15;
      setFloatingOffset({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 50% 80%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse at 30% 30%, rgba(0, 212, 255, 0.1) 0%, transparent 40%),
          linear-gradient(180deg, #080510 0%, #0d0818 50%, #0a0612 100%)
        `,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Grid Floor */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(168, 85, 247, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168, 85, 247, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          transform: `translateY(${floatingOffset.y}px)`,
        }}
      />

      {/* Title */}
      <motion.div
        className="relative z-10 text-center mb-12"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h1
          className="text-4xl md:text-6xl font-light tracking-[0.15em] mb-4"
          style={{
            background: 'linear-gradient(135deg, #ffd700, #a855f7, #00d4ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          THE CHAMBERS
        </h1>
        <p className="text-sm tracking-[0.3em] uppercase text-white/40">
          Choose your destination
        </p>
      </motion.div>

      {/* Chamber Markers */}
      <div className="absolute inset-0 pointer-events-none">
        {CHAMBERS.map((chamber) => (
          <motion.button
            key={chamber.id}
            className="absolute pointer-events-auto cursor-pointer"
            style={{
              left: `${chamber.position.x}%`,
              top: `${chamber.position.y}%`,
              transform: `translate(-50%, -50%) translate(${floatingOffset.x * (0.5 + CHAMBERS.indexOf(chamber) * 0.2)}px, ${floatingOffset.y * (0.5 + CHAMBERS.indexOf(chamber) * 0.2)}px)`,
            }}
            initial={{ opacity: 0, scale: 0, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.5 + CHAMBERS.indexOf(chamber) * 0.2, type: 'spring' }}
            onHoverStart={() => setHoveredChamber(chamber.id)}
            onHoverEnd={() => setHoveredChamber(null)}
            onClick={() => onSelectChamber(chamber.id as Chamber)}
          >
            {/* Glow */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 120,
                height: 120,
                background: `radial-gradient(circle, ${chamber.color}30 0%, transparent 70%)`,
                transform: 'translate(-50%, -50%)',
              }}
              animate={{
                scale: hoveredChamber === chamber.id ? [1, 1.3, 1] : 1,
                opacity: hoveredChamber === chamber.id ? [0.5, 1, 0.5] : 0.5,
              }}
              transition={{ duration: 1.5, repeat: hoveredChamber === chamber.id ? Infinity : 0 }}
            />

            {/* Icon Container */}
            <motion.div
              className="relative flex flex-col items-center"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3 + CHAMBERS.indexOf(chamber) * 0.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <motion.div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-3"
                style={{
                  background: `linear-gradient(135deg, ${chamber.color}40 0%, ${chamber.color}20 100%)`,
                  border: `2px solid ${chamber.color}`,
                  boxShadow: `0 0 40px ${chamber.color}60`,
                }}
                whileHover={{ scale: 1.15, boxShadow: `0 0 60px ${chamber.color}` }}
              >
                <span className="text-3xl">{chamber.icon}</span>
              </motion.div>

              {/* Name */}
              <span
                className="text-sm font-semibold tracking-[0.15em]"
                style={{ color: chamber.color, textShadow: `0 0 10px ${chamber.color}` }}
              >
                {chamber.name}
              </span>

              {/* Description on Hover */}
              <AnimatePresence>
                {hoveredChamber === chamber.id && (
                  <motion.div
                    className="absolute top-full mt-4 w-56 p-4 rounded-xl text-center"
                    style={{
                      background: `${chamber.color}15`,
                      border: `1px solid ${chamber.color}40`,
                      backdropFilter: 'blur(10px)',
                    }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <p className="text-xs text-white/60 leading-relaxed">{chamber.description}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.button>
        ))}
      </div>

      {/* Floating Butterflies */}
      <ParticleButterfly intensity={0.8} />

      {/* Instructions */}
      <motion.div
        className="absolute bottom-12 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1 }}
      >
        <p className="text-xs text-white/30 tracking-wider">Click a chamber to enter</p>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function ButterflyOnboarding({ onComplete }: { onComplete: () => void }) {
  const [currentGate, setCurrentGate] = useState<Gate>('void');
  const [selectedChamber, setSelectedChamber] = useState<Chamber>(null);

  const handleGateComplete = useCallback(() => {
    if (currentGate === 'void') {
      setCurrentGate('awakening');
    } else if (currentGate === 'awakening') {
      setCurrentGate('portal');
    } else if (currentGate === 'portal') {
      setCurrentGate('chambers');
    }
  }, [currentGate]);

  const handleChamberSelect = useCallback((chamber: Chamber) => {
    setSelectedChamber(chamber);
    // After chamber selection, complete onboarding
    setTimeout(() => {
      onComplete();
    }, 500);
  }, [onComplete]);

  return (
    <AnimatePresence mode="wait">
      {currentGate !== 'chambers' ? (
        <Gate
          key={currentGate}
          gate={currentGate}
          isActive={true}
          onComplete={handleGateComplete}
        />
      ) : (
        <ChambersView
          key="chambers"
          onSelectChamber={handleChamberSelect}
        />
      )}
    </AnimatePresence>
  );
}
