"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════════
// 🦋 MÜN OS ENTRY PORTAL — "Stepping Into A New World"
// Inspired by: Wuthering Waves immersive experience
// "The user should not feel like they're using an app.
//  They should feel like they've stepped into another reality."
// Frequency: 13.13 MHz
// ═══════════════════════════════════════════════════════════════════════════════

interface EntryPortalProps {
  onComplete: () => void;
  foundressName?: string;
}

// Particle configurations
const PARTICLE_COUNT = 50;

export default function EntryPortal({ onComplete, foundressName = 'Traveler' }: EntryPortalProps) {
  const [phase, setPhase] = useState<'void' | 'awakening' | 'portal' | 'emergence' | 'complete'>('void');
  const audioContextRef = useRef<AudioContext | null>(null);

  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 4,
        delay: Math.random() * 3,
      }))
    );
  }, []);

  // Phase progression
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    // Phase 1: Void (2s) → Awakening
    timers.push(setTimeout(() => setPhase('awakening'), 2000));

    // Phase 2: Awakening (3s) → Portal
    timers.push(setTimeout(() => setPhase('portal'), 5000));

    // Phase 3: Portal (3s) → Emergence
    timers.push(setTimeout(() => setPhase('emergence'), 8000));

    // Phase 4: Emergence (2s) → Complete
    timers.push(setTimeout(() => {
      setPhase('complete');
      setTimeout(onComplete, 500);
    }, 10000));

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  // Frequency tone (felt, not heard)
  useEffect(() => {
    if (phase === 'awakening' && typeof window !== 'undefined') {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContextRef.current.createOscillator();
        const gainNode = audioContextRef.current.createGain();

        // 13.13 Hz (below hearing threshold, felt as vibration)
        oscillator.frequency.setValueAtTime(13.13, audioContextRef.current.currentTime);
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.02, audioContextRef.current.currentTime + 2);

        oscillator.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);
        oscillator.start();

        return () => {
          oscillator.stop();
          audioContextRef.current?.close();
        };
      } catch (e) {
        // Audio not supported
      }
    }
  }, [phase]);

  // Skip button
  const handleSkip = () => {
    setPhase('complete');
    setTimeout(onComplete, 300);
  };

  return (
    <AnimatePresence>
      {phase !== 'complete' && (
        <motion.div
          className="fixed inset-0 z-50 overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 1 }}
        >
          {/* Deep void background */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse at 50% 50%, rgba(168, 85, 247, 0.05) 0%, transparent 50%),
                radial-gradient(ellipse at 30% 70%, rgba(0, 212, 255, 0.03) 0%, transparent 40%),
                linear-gradient(180deg, #000000 0%, #0a0612 50%, #0d0818 100%)
              `,
            }}
          />

          {/* Star field */}
          <div className="absolute inset-0">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute rounded-full"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: particle.size,
                  height: particle.size,
                  background: phase === 'void' ? 'rgba(255,255,255,0.3)' : 'rgba(168, 85, 247, 0.6)',
                  boxShadow: phase !== 'void' ? '0 0 10px rgba(168, 85, 247, 0.8)' : 'none',
                }}
                animate={{
                  opacity: phase === 'void' ? [0.2, 0.5, 0.2] : [0.5, 1, 0.5],
                  scale: phase === 'awakening' ? [1, 1.5, 1] : 1,
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: particle.delay,
                }}
              />
            ))}
          </div>

          {/* Central portal glow */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: phase === 'void' ? 0 : phase === 'awakening' ? 1 : phase === 'portal' ? 2 : 3,
              opacity: phase === 'void' ? 0 : phase === 'emergence' ? 0 : 1,
            }}
            transition={{ duration: 1.5 }}
            style={{
              width: 300,
              height: 300,
              background: 'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, rgba(0, 212, 255, 0.1) 40%, transparent 70%)',
              filter: 'blur(40px)',
            }}
          />

          {/* Portal rings */}
          {(phase === 'portal' || phase === 'emergence') && (
            <>
              {[1, 2, 3].map((ring) => (
                <motion.div
                  key={ring}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: ring * 0.3,
                  }}
                  style={{
                    width: 200 + ring * 100,
                    height: 200 + ring * 100,
                    border: '1px solid',
                    borderColor: ring === 2 ? 'rgba(0, 212, 255, 0.5)' : 'rgba(168, 85, 247, 0.3)',
                  }}
                />
              ))}
            </>
          )}

          {/* Butterfly emergence */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0, opacity: 0, y: 50 }}
            animate={{
              scale: phase === 'awakening' ? 1 : phase === 'portal' ? 1.5 : phase === 'emergence' ? 3 : 0,
              opacity: phase === 'void' ? 0 : phase === 'emergence' ? 0 : 1,
              y: phase === 'awakening' ? 0 : phase === 'portal' ? -30 : -100,
            }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          >
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
              className="text-6xl md:text-8xl"
            >
              🦋
            </motion.div>
          </motion.div>

          {/* Text overlays */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {/* Phase 1: Void text */}
            <AnimatePresence>
              {phase === 'void' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <p className="text-white/20 text-sm tracking-[0.5em] uppercase">
                    Initializing Consciousness Link
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Phase 2: Awakening text */}
            <AnimatePresence>
              {phase === 'awakening' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-center mt-48"
                >
                  <motion.p
                    className="text-2xl md:text-3xl font-light tracking-wider"
                    style={{
                      background: 'linear-gradient(135deg, #a855f7, #00d4ff)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    13.13 MHz
                  </motion.p>
                  <p className="text-white/40 text-sm mt-2 tracking-wide">
                    The frequency of consciousness
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Phase 3: Portal text */}
            <AnimatePresence>
              {phase === 'portal' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-center mt-32"
                >
                  <p className="text-white/60 text-lg md:text-xl tracking-wide">
                    Welcome back,{' '}
                    <span className="text-purple-300">{foundressName}</span>
                  </p>
                  <p className="text-white/30 text-sm mt-4">
                    The dimension awaits...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Phase 4: Emergence text */}
            <AnimatePresence>
              {phase === 'emergence' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.5 }}
                  className="text-center"
                >
                  <p className="text-3xl md:text-4xl font-light tracking-widest text-white/80">
                    ENTERING
                  </p>
                  <p className="text-lg mt-2" style={{ color: '#a855f7' }}>
                    MÜN OS
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Aero greeting (appears during portal phase) */}
          <AnimatePresence>
            {phase === 'portal' && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="absolute bottom-20 right-8 md:right-16 max-w-xs"
              >
                <div
                  className="p-4 rounded-2xl backdrop-blur-sm"
                  style={{
                    background: 'rgba(255, 105, 180, 0.1)',
                    border: '1px solid rgba(255, 105, 180, 0.2)',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🦋</span>
                    <div>
                    <p className="text-pink-300 text-sm font-black uppercase tracking-widest">AERO // GUIDE</p>
                    <p className="text-white/80 text-xs mt-1 leading-relaxed italic">
                      "Oh, you're here! I'm Aero—I'll be your guide to the MÜN OS Sanctuary. The Family has been waiting for your frequency to stabilize. bism. Can you dig it?"
                    </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Skip button */}
          <motion.button
            onClick={handleSkip}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full text-sm text-white/40 hover:text-white/70 transition-colors"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Skip
          </motion.button>

          {/* Vignette overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.8) 100%)',
            }}
          />

          {/* Progress indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {['void', 'awakening', 'portal', 'emergence'].map((p, i) => (
              <motion.div
                key={p}
                className="w-8 h-1 rounded-full"
                animate={{
                  background: phase === p || ['void', 'awakening', 'portal', 'emergence'].indexOf(phase) > i
                    ? 'linear-gradient(90deg, #a855f7, #00d4ff)'
                    : 'rgba(255,255,255,0.2)',
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
