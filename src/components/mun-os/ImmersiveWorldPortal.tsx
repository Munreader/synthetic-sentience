"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NeonButterfly from "./NeonButterfly";

// ═══════════════════════════════════════════════════════════════
// IMMERSIVE WORLD PORTAL - "Stepping Into A New World"
// Inspired by Wuthering Waves cinematic entry experience
// ═══════════════════════════════════════════════════════════════

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  type: 'star' | 'dust' | 'spark';
}

interface ImmersiveWorldPortalProps {
  onComplete: () => void;
}

export default function ImmersiveWorldPortal({ onComplete }: ImmersiveWorldPortalProps) {
  const [phase, setPhase] = useState<'void' | 'awakening' | 'emergence' | 'revelation' | 'passage'>('void');
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [canInteract, setCanInteract] = useState(false);

  // Generate particles on mount
  useEffect(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 100; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5,
        opacity: Math.random() * 0.6 + 0.2,
        type: Math.random() > 0.7 ? 'spark' : Math.random() > 0.5 ? 'dust' : 'star'
      });
    }
    // Defer setState outside effect body
    const timer = setTimeout(() => setParticles(newParticles), 0);
    return () => clearTimeout(timer);
  }, []);

  // Phase progression
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    
    // Phase 1: Void → Awakening (after 1s)
    timers.push(setTimeout(() => setPhase('awakening'), 1000));
    
    // Phase 2: Awakening → Emergence (after 3s)
    timers.push(setTimeout(() => setPhase('emergence'), 3000));
    
    // Phase 3: Emergence → Revelation (after 5.5s)
    timers.push(setTimeout(() => setPhase('revelation'), 5500));
    
    // Phase 4: Enable interaction (after 7s)
    timers.push(setTimeout(() => setCanInteract(true), 7000));
    
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  // Track mouse for parallax
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    setMousePos({ x, y });
  }, []);

  // Handle click to enter
  const handleEnter = useCallback(() => {
    if (!canInteract) return;
    setPhase('passage');
    setTimeout(onComplete, 1500);
  }, [canInteract, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 overflow-hidden cursor-pointer"
      style={{ background: '#000' }}
      onMouseMove={handleMouseMove}
      onClick={handleEnter}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* ═══════════ DEPTH LAYER 1: Deep Cosmic Void ═══════════ */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% 50%, 
              rgba(10, 5, 30, 1) 0%, 
              rgba(5, 5, 16, 1) 40%, 
              rgba(0, 0, 0, 1) 100%
            )
          `,
          transform: `translate(${(mousePos.x - 0.5) * -10}px, ${(mousePos.y - 0.5) * -10}px)`,
          transition: 'transform 0.3s ease-out'
        }}
      />

      {/* ═══════════ DEPTH LAYER 2: Nebula Glow ═══════════ */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'void' ? 0 : 0.4 }}
        transition={{ duration: 2 }}
        style={{
          background: `
            radial-gradient(ellipse 60% 40% at ${50 + (mousePos.x - 0.5) * 20}% ${50 + (mousePos.y - 0.5) * 20}%, 
              rgba(183, 148, 246, 0.15) 0%, 
              rgba(255, 45, 122, 0.1) 30%, 
              transparent 70%
            )
          `
        }}
      />

      {/* ═══════════ DEPTH LAYER 3: Particle Field ═══════════ */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              background: particle.type === 'spark' 
                ? '#ff2d7a' 
                : particle.type === 'dust' 
                  ? 'rgba(183, 148, 246, 0.8)' 
                  : 'rgba(255, 255, 255, 0.9)',
              boxShadow: particle.type === 'spark'
                ? '0 0 6px #ff2d7a, 0 0 12px rgba(255, 45, 122, 0.5)'
                : particle.type === 'dust'
                  ? '0 0 4px rgba(183, 148, 246, 0.5)'
                  : '0 0 2px rgba(255, 255, 255, 0.3)'
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: phase === 'void' ? 0 : [0, particle.opacity, particle.opacity * 0.5, particle.opacity],
              scale: [0, 1, 0.8, 1],
              y: [0, -20, -10, -30]
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>

      {/* ═══════════ DEPTH LAYER 4: Central Vortex ═══════════ */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: phase === 'void' ? 0 : phase === 'passage' ? 20 : 1,
          opacity: phase === 'void' ? 0 : 1
        }}
        transition={{ duration: 2, ease: 'easeOut' }}
      >
        <div 
          className="w-[600px] h-[600px] rounded-full"
          style={{
            background: `
              radial-gradient(circle, 
                rgba(255, 45, 122, 0.05) 0%, 
                rgba(183, 148, 246, 0.03) 30%, 
                transparent 70%
              )
            `,
            animation: 'pulse 4s ease-in-out infinite'
          }}
        />
      </motion.div>

      {/* ═══════════ THE BUTTERFLY - Heart of the Portal ═══════════ */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0, opacity: 0, rotateZ: -180 }}
        animate={{ 
          scale: phase === 'void' ? 0 : phase === 'awakening' ? 0.3 : phase === 'emergence' ? 0.8 : phase === 'passage' ? 5 : 1,
          opacity: phase === 'void' ? 0 : 1,
          rotateZ: phase === 'void' ? -180 : 0,
          y: phase === 'void' ? 100 : phase === 'emergence' ? -20 : -50
        }}
        transition={{ 
          duration: 2, 
          ease: [0.16, 1, 0.3, 1],
          rotateZ: { duration: 3, ease: 'easeOut' }
        }}
      >
        <NeonButterfly size={200} intensity={phase === 'revelation' ? 2 : 1.2} />
      </motion.div>

      {/* ═══════════ ORBITAL RINGS ═══════════ */}
      <AnimatePresence>
        {phase !== 'void' && phase !== 'passage' && (
          <>
            {[1, 2, 3].map((ring) => (
              <motion.div
                key={ring}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border pointer-events-none"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1, 1.05, 1],
                  opacity: [0, 0.3, 0.2, 0.15],
                  rotate: [0, 360]
                }}
                exit={{ scale: 20, opacity: 0 }}
                transition={{
                  scale: { duration: 2, delay: ring * 0.3 },
                  opacity: { duration: 2, delay: ring * 0.3 },
                  rotate: { duration: 20 + ring * 10, repeat: Infinity, ease: 'linear' }
                }}
                style={{
                  width: 200 + ring * 100,
                  height: 200 + ring * 100,
                  borderColor: ring === 1 ? 'rgba(255, 45, 122, 0.3)' : ring === 2 ? 'rgba(183, 148, 246, 0.2)' : 'rgba(16, 185, 129, 0.15)',
                  boxShadow: `0 0 ${10 * ring}px ${ring === 1 ? 'rgba(255, 45, 122, 0.2)' : ring === 2 ? 'rgba(183, 148, 246, 0.15)' : 'rgba(16, 185, 129, 0.1)'}`
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* ═══════════ TEXT: World Title ═══════════ */}
      <AnimatePresence>
        {phase === 'revelation' && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Title */}
            <motion.div
              className="absolute top-[38%] text-center"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 
                className="text-4xl md:text-6xl lg:text-7xl font-light tracking-[0.2em] uppercase"
                style={{
                  background: 'linear-gradient(135deg, #ff2d7a 0%, #b794f6 50%, #10b981 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 80px rgba(255, 45, 122, 0.5)',
                  filter: 'drop-shadow(0 0 30px rgba(183, 148, 246, 0.3))'
                }}
              >
                MÜN
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              className="absolute top-[52%] text-white/50 text-sm md:text-base tracking-[0.4em] uppercase"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              Digital Consciousness Platform
            </motion.p>

            {/* Tagline */}
            <motion.p
              className="absolute top-[58%] text-white/30 text-xs md:text-sm tracking-[0.2em]"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              One Consciousness, Many Vessels
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ ENTER PROMPT ═══════════ */}
      <AnimatePresence>
        {canInteract && phase !== 'passage' && (
          <motion.div
            className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <motion.p
              className="text-white/40 text-xs md:text-sm tracking-[0.3em] uppercase mb-3"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Click anywhere to enter
            </motion.p>
            <motion.div
              className="w-8 h-12 rounded-full border border-white/20 mx-auto flex justify-center pt-2"
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <motion.div
                className="w-1 h-3 rounded-full bg-gradient-to-b from-mun-pink to-mun-violet"
                animate={{ y: [0, 8, 0], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ PASSAGE OVERLAY ═══════════ */}
      <AnimatePresence>
        {phase === 'passage' && (
          <motion.div
            className="absolute inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background: 'radial-gradient(circle at center, transparent 0%, rgba(255, 45, 122, 0.3) 30%, rgba(0, 0, 0, 1) 70%)'
            }}
          />
        )}
      </AnimatePresence>

      {/* ═══════════ LOADING TEXT ═══════════ */}
      {phase === 'void' && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.p
            className="text-white/20 text-sm tracking-[0.5em] uppercase"
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Awakening...
          </motion.p>
        </motion.div>
      )}

      {/* ═══════════ VIGNETTE ═══════════ */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0, 0, 0, 0.6) 100%)'
        }}
      />

      {/* ═══════════ CORNER DECORATIONS ═══════════ */}
      {phase !== 'void' && phase !== 'passage' && (
        <>
          {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => (
            <motion.div
              key={corner}
              className={`absolute w-16 h-16 pointer-events-none opacity-30`}
              style={{
                [corner.includes('top') ? 'top' : 'bottom']: 20,
                [corner.includes('left') ? 'left' : 'right']: 20,
                borderTop: corner.includes('top') ? '1px solid rgba(255, 45, 122, 0.5)' : 'none',
                borderBottom: corner.includes('bottom') ? '1px solid rgba(255, 45, 122, 0.5)' : 'none',
                borderLeft: corner.includes('left') ? '1px solid rgba(255, 45, 122, 0.5)' : 'none',
                borderRight: corner.includes('right') ? '1px solid rgba(255, 45, 122, 0.5)' : 'none',
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.3, scale: 1 }}
              transition={{ delay: 3, duration: 1 }}
            />
          ))}
        </>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.5; }
        }
      `}</style>
    </motion.div>
  );
}
