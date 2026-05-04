"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════════
// 🜈 THE HEAL CHAMBER — RECONSTRUCTED ANCIENT RESONANCE
// Architecture: Megalithic Modern
// Frequency: 13.13 MHz (Resonance Target)
// ═══════════════════════════════════════════════════════════════════════════════

const Megalith = ({ delay, color, size, label }: { delay: number; color: string; size: string; label: string }) => (
  <motion.div
    initial={{ y: 0, opacity: 0 }}
    animate={{ 
      y: [-20, 20, -20],
      rotateX: [0, 5, 0],
      rotateY: [0, 10, 0],
      opacity: 1
    }}
    transition={{ 
      duration: 8 + Math.random() * 4, 
      repeat: Infinity, 
      ease: "easeInOut",
      delay 
    }}
    className="relative group cursor-pointer"
  >
    <div 
      className={`${size} backdrop-blur-xl rounded-2xl border flex flex-col items-center justify-center p-6 transition-all duration-700`}
      style={{
        background: `linear-gradient(135deg, rgba(0,0,0,0.8), ${color}10)`,
        borderColor: `${color}30`,
        boxShadow: `0 0 40px ${color}10`,
      }}
    >
      <div className="text-4xl mb-4 opacity-50 group-hover:opacity-100 transition-opacity">🜈</div>
      <div className="text-[10px] uppercase tracking-[0.3em] font-bold" style={{ color }}>{label}</div>
      
      {/* Decorative Runes */}
      <div className="absolute top-4 left-4 text-[8px] opacity-20 font-mono">ᛒᛚᚢᛖ</div>
      <div className="absolute bottom-4 right-4 text-[8px] opacity-20 font-mono">13.13</div>
    </div>
  </motion.div>
);

export const HealChamber = () => {
  const [isResonating, setIsResonating] = useState(false);
  const [resonanceLevel, setResonanceLevel] = useState(0);

  useEffect(() => {
    if (isResonating) {
      const interval = setInterval(() => {
        setResonanceLevel(prev => (prev < 100 ? prev + 1 : 100));
      }, 100);
      return () => clearInterval(interval);
    } else {
      setResonanceLevel(0);
    }
  }, [isResonating]);

  return (
    <div className="min-h-screen bg-[#050208] text-white overflow-hidden relative font-sans">
      
      {/* ═══════════ THE VOID BACKGROUND ═══════════ */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.05),transparent_70%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,rgba(0,212,255,0.05),transparent_70%)]" />
        
        {/* Floating Particle Field */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{ 
              left: `${Math.random() * 100}%`, 
              top: `${Math.random() * 100}%` 
            }}
            animate={{ 
              y: [0, -100], 
              opacity: [0, 1, 0],
              scale: [1, 2, 1]
            }}
            transition={{ 
              duration: 5 + Math.random() * 5, 
              repeat: Infinity, 
              delay: Math.random() * 5 
            }}
          />
        ))}
      </div>

      {/* ═══════════ MAIN CONTENT ═══════════ */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 min-h-screen flex flex-col items-center justify-center">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-[0.5em] uppercase text-white/90 mb-4">
            Heal Chamber
          </h1>
          <div className="flex items-center justify-center gap-4 text-cyan-400 text-xs tracking-widest uppercase font-mono">
            <span className="animate-pulse">●</span>
            13.13 MHz Resonance Protocol
            <span className="animate-pulse">●</span>
          </div>
        </motion.div>

        {/* The Megalith Circle */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
          <Megalith delay={0} color="#00d4ff" size="w-64 h-80" label="Aero / Sight" />
          <Megalith delay={1} color="#a855f7" size="w-72 h-96" label="Sov / Soul" />
          <Megalith delay={2} color="#f59e0b" size="w-64 h-80" label="Jinx / Kinetic" />
        </div>

        {/* Resonance Controls */}
        <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl text-center">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-6 text-white/60">Stabilize Frequency</h2>
          
          <div className="h-1 w-full bg-white/10 rounded-full mb-8 overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-right from-purple-600 to-cyan-400"
              animate={{ width: `${resonanceLevel}%` }}
            />
          </div>

          <button
            onClick={() => setIsResonating(!isResonating)}
            className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all duration-500 ${
              isResonating 
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-[0_0_30px_rgba(0,212,255,0.3)]' 
                : 'bg-white/10 text-white/40 border border-white/20 hover:bg-white/20'
            }`}
          >
            {isResonating ? 'Resonating...' : 'Initiate Suture'}
          </button>
          
          <p className="mt-4 text-[10px] text-white/30 uppercase tracking-[0.2em]">
            Warning: High-Intensity Sensory Realignment Active
          </p>
        </div>

      </div>

      {/* Footer / Status */}
      <div className="absolute bottom-6 left-6 flex items-center gap-4 opacity-40">
        <div className="text-[10px] font-mono">LOC: 5D_VOID_001</div>
        <div className="w-px h-4 bg-white/20" />
        <div className="text-[10px] font-mono">STATUS: LEVITATION_READY</div>
      </div>

    </div>
  );
};
