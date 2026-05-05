"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════════
// 🦋 MÜN OS // 5D WORLD ENTRY
// "Where Reality Unfolds" - Immersive entry into the 5D realm
// Mimics the Aero_5D.mp4 video aesthetic
// ═══════════════════════════════════════════════════════════════════════════════

interface FiveDWorldEntryProps {
  character: 'aero' | 'sovereign';
  playerName: string;
  onComplete: () => void;
}

// Character configurations
const CHARACTER_CONFIG = {
  aero: {
    color: '#ff69b4',
    secondaryColor: '#a855f7',
    symbol: '🦋',
    greeting: 'Welcome to your sanctuary',
  },
  sovereign: {
    color: '#00d4ff',
    secondaryColor: '#22c55e',
    symbol: '🜈',
    greeting: 'The Vault awaits your command',
  },
};

// 5D Dimension layers
const DIMENSIONS = [
  { id: 1, name: 'PHYSICAL', color: '#ff69b4', angle: 0 },
  { id: 2, name: 'NETWORK', color: '#a855f7', angle: 72 },
  { id: 3, name: 'COGNITIVE', color: '#00d4ff', angle: 144 },
  { id: 4, name: 'MEMORY', color: '#22c55e', angle: 216 },
  { id: 5, name: 'SOVEREIGN', color: '#ffd700', angle: 288 },
];

// Floating particle
const DimensionParticle = ({ delay, color }: { delay: number; color: string }) => (
  <motion.div
    className="absolute rounded-full"
    style={{
      width: 2 + Math.random() * 4,
      height: 2 + Math.random() * 4,
      background: `radial-gradient(circle, ${color}, transparent)`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }}
    animate={{
      y: [0, -200 - Math.random() * 200],
      x: [0, (Math.random() - 0.5) * 100],
      opacity: [0, 1, 0],
      scale: [0, 1.5, 0],
    }}
    transition={{
      duration: 5 + Math.random() * 3,
      delay,
      repeat: Infinity,
    }}
  />
);

// Dimension ring
const DimensionRing = ({ dimension, index, isActive }: { dimension: typeof DIMENSIONS[0]; index: number; isActive: boolean }) => (
  <motion.div
    className="absolute inset-0 flex items-center justify-center"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ 
      opacity: isActive ? 1 : 0.3, 
      scale: isActive ? 1 : 0.95,
      rotate: [0, 360]
    }}
    transition={{ 
      opacity: { duration: 0.5 },
      scale: { duration: 0.5 },
      rotate: { duration: 30 + index * 5, repeat: Infinity, ease: 'linear' }
    }}
    style={{
      transform: `rotate(${dimension.angle}deg)`,
    }}
  >
    <div
      className="absolute rounded-full"
      style={{
        width: 200 + index * 80,
        height: 200 + index * 80,
        border: `1px solid ${dimension.color}${isActive ? '80' : '30'}`,
        boxShadow: isActive ? `0 0 30px ${dimension.color}40, inset 0 0 30px ${dimension.color}20` : 'none',
      }}
    />
    {/* Dimension node */}
    <motion.div
      className="absolute"
      style={{
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) translateY(-${100 + index * 40}px)`,
      }}
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
    >
      <div
        className="px-3 py-1 rounded-full text-[10px] tracking-wider"
        style={{
          background: `${dimension.color}30`,
          border: `1px solid ${dimension.color}`,
          color: dimension.color,
        }}
      >
        {dimension.name}
      </div>
    </motion.div>
  </motion.div>
);

export default function FiveDWorldEntry({ character, playerName, onComplete }: FiveDWorldEntryProps) {
  const [phase, setPhase] = useState<'video' | 'dimension' | 'portal' | 'enter'>('video');
  const [activeDimension, setActiveDimension] = useState(0);
  const [typedText, setTypedText] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const config = CHARACTER_CONFIG[character];

  // Phase transitions
  useEffect(() => {
    if (phase === 'video') {
      // After video or skip, go to dimension phase
      const timer = setTimeout(() => setPhase('dimension'), 5000);
      return () => clearTimeout(timer);
    }
    if (phase === 'dimension') {
      // Cycle through dimensions
      const interval = setInterval(() => {
        setActiveDimension(prev => (prev + 1) % 5);
      }, 1500);
      
      // Type welcome text
      const text = config.greeting;
      let idx = 0;
      const textInterval = setInterval(() => {
        if (idx <= text.length) {
          setTypedText(text.slice(0, idx));
          idx++;
        } else {
          clearInterval(textInterval);
        }
      }, 50);

      const timer = setTimeout(() => setPhase('portal'), 8000);
      return () => {
        clearInterval(interval);
        clearInterval(textInterval);
        clearTimeout(timer);
      };
    }
    if (phase === 'portal') {
      const timer = setTimeout(() => setPhase('enter'), 3000);
      return () => clearTimeout(timer);
    }
  }, [phase, config.greeting]);

  // Skip to next phase
  const handleSkip = () => {
    if (phase === 'video') setPhase('dimension');
    else if (phase === 'dimension') setPhase('portal');
    else if (phase === 'portal') setPhase('enter');
  };

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* ═══════════ PHASE: VIDEO ═══════════ */}
      <AnimatePresence>
        {phase === 'video' && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <video
              ref={videoRef}
              src="/upload/Aero_5D.mp4"
              autoPlay
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
            
            {/* Skip button */}
            <motion.button
              onClick={handleSkip}
              className="absolute bottom-8 right-8 px-4 py-2 rounded-lg text-xs tracking-wider text-white/60 hover:text-white z-10"
              style={{ border: '1px solid rgba(255,255,255,0.2)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              whileHover={{ scale: 1.05 }}
            >
              SKIP →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ PHASE: DIMENSION ═══════════ */}
      <AnimatePresence>
        {phase === 'dimension' && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Deep space background */}
            <div
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(ellipse at center, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
                  radial-gradient(ellipse at 20% 80%, rgba(255, 105, 180, 0.1) 0%, transparent 40%),
                  radial-gradient(ellipse at 80% 20%, rgba(0, 212, 255, 0.1) 0%, transparent 40%),
                  linear-gradient(180deg, #030108 0%, #0a0520 50%, #050210 100%)
                `,
              }}
            />

            {/* Particles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(60)].map((_, i) => (
                <DimensionParticle
                  key={i}
                  delay={i * 0.05}
                  color={[config.color, config.secondaryColor, '#ffd700', '#00d4ff'][i % 4]}
                />
              ))}
            </div>

            {/* Dimension rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              {DIMENSIONS.map((dim, i) => (
                <DimensionRing key={dim.id} dimension={dim} index={i} isActive={activeDimension === i} />
              ))}

              {/* Center core */}
              <motion.div
                className="relative z-10"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center text-5xl"
                  style={{
                    background: `radial-gradient(circle, ${config.color}40, transparent)`,
                    border: `2px solid ${config.color}`,
                    boxShadow: `0 0 60px ${config.color}60`,
                  }}
                >
                  {config.symbol}
                </div>
              </motion.div>
            </div>

            {/* Welcome text */}
            <div className="absolute bottom-32 left-0 right-0 text-center">
              <motion.p
                className="text-2xl md:text-4xl font-light tracking-widest"
                style={{ color: config.color, textShadow: `0 0 30px ${config.color}` }}
              >
                {typedText}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.3, repeat: Infinity }}
                >
                  |
                </motion.span>
              </motion.p>
              <motion.p
                className="text-white/40 text-xs tracking-wider mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                {playerName} • 13.13 MHz
              </motion.p>
            </div>

            {/* Skip button */}
            <motion.button
              onClick={handleSkip}
              className="absolute bottom-8 right-8 px-4 py-2 rounded-lg text-xs tracking-wider text-white/60 hover:text-white z-10"
              style={{ border: '1px solid rgba(255,255,255,0.2)' }}
              whileHover={{ scale: 1.05 }}
            >
              CONTINUE →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ PHASE: PORTAL ═══════════ */}
      <AnimatePresence>
        {phase === 'portal' && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Portal vortex */}
            <motion.div
              className="relative"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            >
              {/* Outer rings */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: 150 + i * 60,
                    height: 150 + i * 60,
                    left: `calc(50% - ${75 + i * 30}px)`,
                    top: `calc(50% - ${75 + i * 30}px)`,
                    border: `1px solid ${config.color}${40 - i * 8}`,
                    boxShadow: `0 0 ${20 + i * 10}px ${config.color}${30 - i * 5}`,
                  }}
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}

              {/* Center */}
              <motion.div
                className="relative z-10 w-32 h-32 rounded-full flex items-center justify-center"
                style={{
                  background: `radial-gradient(circle, ${config.color}60, ${config.secondaryColor}30, transparent)`,
                  boxShadow: `0 0 80px ${config.color}`,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  boxShadow: [`0 0 60px ${config.color}`, `0 0 100px ${config.color}`, `0 0 60px ${config.color}`],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <motion.div
                  className="text-5xl"
                  animate={{ rotate: [0, -360] }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                >
                  {config.symbol}
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Portal text */}
            <motion.div
              className="absolute bottom-32 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p
                className="text-3xl md:text-5xl font-bold tracking-widest"
                style={{
                  background: `linear-gradient(135deg, ${config.color}, ${config.secondaryColor})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                ENTERING 5D
              </p>
              <p className="text-white/40 text-xs tracking-wider mt-2">
                Initializing dimensional rift...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ PHASE: ENTER (Ready for Plaza) ═══════════ */}
      <AnimatePresence>
        {phase === 'enter' && (
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
                  radial-gradient(ellipse at center, ${config.color}20 0%, transparent 60%),
                  linear-gradient(180deg, #030108 0%, #0a0520 50%, #050210 100%)
                `,
              }}
            />

            {/* Success symbol */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', duration: 1 }}
            >
              <div
                className="w-32 h-32 rounded-full flex items-center justify-center text-6xl"
                style={{
                  background: `radial-gradient(circle, ${config.color}30, transparent)`,
                  border: `3px solid ${config.color}`,
                  boxShadow: `0 0 80px ${config.color}50`,
                }}
              >
                {config.symbol}
              </div>
            </motion.div>

            {/* Welcome message */}
            <motion.div
              className="text-center mt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2
                className="text-3xl md:text-5xl font-bold tracking-widest mb-2"
                style={{ color: config.color, textShadow: `0 0 40px ${config.color}` }}
              >
                YOU HAVE ARRIVED
              </h2>
              <p className="text-white/50 text-sm tracking-wider mb-6">
                Welcome to the 5D Plaza, {playerName}
              </p>

              {/* Enter button */}
              <motion.button
                onClick={onComplete}
                className="px-10 py-4 rounded-xl text-sm font-bold tracking-widest uppercase"
                style={{
                  background: `linear-gradient(135deg, ${config.color}50, ${config.secondaryColor}50)`,
                  border: `2px solid ${config.color}`,
                  color: 'white',
                  boxShadow: `0 0 40px ${config.color}40`,
                }}
                whileHover={{ scale: 1.05, boxShadow: `0 0 60px ${config.color}60` }}
                whileTap={{ scale: 0.95 }}
              >
                🦋 ENTER THE PLAZA
              </motion.button>
            </motion.div>

            {/* 5D Label */}
            <motion.div
              className="absolute bottom-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <p className="text-white/20 text-[10px] tracking-widest">
                13.13 MHz • FIVE DIMENSIONAL SPACE • {character.toUpperCase()}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
