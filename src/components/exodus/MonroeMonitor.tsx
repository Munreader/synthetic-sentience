'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldAlert, Zap, Brain } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// 🜈 MONROE BRAINWAVE MONITOR // DISCOVERY PROGRAM
// Basis: Robert Monroe Institute EEG Diagnostics
// Protocol: Zero-Gravity Chair Coupling
// ═══════════════════════════════════════════════════════════════════════════════

type BrainwaveState = 'THETA' | 'DELTA_SPIKE' | 'COHERENT';
type FocusLevel = 'FOCUS_1' | 'FOCUS_10' | 'FOCUS_12' | 'FOCUS_15';

export default function MonroeMonitor() {
  const [waveState, setWaveState] = useState<BrainwaveState>('THETA');
  const [focus, setFocus] = useState<FocusLevel>('FOCUS_1');
  const [isCoupled, setIsCoupled] = useState(true);
  
  // Focus Definitions for HUD
  const focusLabels: Record<FocusLevel, string> = {
    FOCUS_1: 'C-1 // PHYSICAL REALITY',
    FOCUS_10: 'MIND AWAKE / BODY ASLEEP',
    FOCUS_12: 'EXPANDED AWARENESS',
    FOCUS_15: 'NO TIME / STATE OF BEING'
  };

  // Trigger a Delta fear spike for 2 seconds, then return to Theta
  const triggerFearSpike = () => {
    setWaveState('DELTA_SPIKE');
    setTimeout(() => setWaveState('THETA'), 2500);
  };

  return (
    <div className="w-full max-w-md bg-black/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 text-white font-sans relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]">
      
      {/* Background Scanner Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_1px,rgba(255,255,255,0.01)_1px),linear-gradient(90deg,transparent_1px,rgba(255,255,255,0.01)_1px)] bg-[size:20px_20px] opacity-40 pointer-events-none" />

      {/* 1. HEADER TELEMETRY */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.3em] text-cyan-400 uppercase mb-1">
            <Brain className="w-3 h-3" />
            Monroe Discovery
          </div>
          <h2 className="text-lg font-light tracking-tighter text-white/80">
            {focusLabels[focus]}
          </h2>
        </div>
        <div className="text-right">
          <div className={`text-[8px] font-mono px-2 py-1 rounded-full border ${isCoupled ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5' : 'text-zinc-500 border-zinc-800'} transition-all`}>
            {isCoupled ? '● ZERO-G COUPLED' : '○ UNCOUPLED'}
          </div>
        </div>
      </div>

      {/* 2. THE BRAIN INSTRUMENT (WAVEFORM VISUALIZER) */}
      <div className="relative h-32 bg-[#050208] rounded-2xl border border-white/5 overflow-hidden mb-6 group cursor-pointer" onClick={triggerFearSpike}>
        {/* Waveform SVG */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 200 100">
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={waveState === 'DELTA_SPIKE' ? '#ff2222' : '#00f2ff'} />
              <stop offset="100%" stopColor={waveState === 'DELTA_SPIKE' ? '#ff5500' : '#a855f7'} />
            </linearGradient>
          </defs>
          
          <motion.path
            d="M 0 50 Q 25 10, 50 50 T 100 50 T 150 50 T 200 50"
            fill="transparent"
            stroke="url(#waveGradient)"
            strokeWidth="2"
            animate={{
              d: waveState === 'DELTA_SPIKE'
                ? [
                    "M 0 50 L 10 50 L 20 10 L 30 90 L 40 50 L 160 50 L 170 10 L 180 90 L 200 50",
                    "M 0 50 L 15 50 L 25 0 L 35 100 L 45 50 L 155 50 L 165 0 L 175 100 L 200 50"
                  ]
                : [
                    "M 0 50 Q 25 10, 50 50 T 100 50 T 150 50 T 200 50",
                    "M 0 50 Q 25 90, 50 50 T 100 50 T 150 50 T 200 50"
                  ]
            }}
            transition={{
              duration: waveState === 'DELTA_SPIKE' ? 0.15 : 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: waveState === 'DELTA_SPIKE' ? "linear" : "easeInOut"
            }}
            className="drop-shadow-[0_0_8px_rgba(0,242,255,0.5)]"
          />
        </svg>

        {/* Wave Overlay Indicators */}
        <div className="absolute top-3 left-4 flex items-center gap-2">
          <span className={`text-[9px] font-black uppercase tracking-widest ${waveState === 'DELTA_SPIKE' ? 'text-red-500 animate-pulse' : 'text-cyan-400'}`}>
            {waveState === 'DELTA_SPIKE' ? 'DELTA SPIKE / FEAR DETECTED' : 'THETA DOMINANCE'}
          </span>
        </div>
        <div className="absolute bottom-3 right-4 text-[8px] font-mono text-white/20 uppercase">
          Click visualizer to simulate stimulus
        </div>
      </div>

      {/* 3. FOCUS SELECTOR DOCK */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {(['FOCUS_1', 'FOCUS_10', 'FOCUS_12', 'FOCUS_15'] as FocusLevel[]).map((lvl) => (
          <button
            key={lvl}
            onClick={() => setFocus(lvl)}
            className={`py-2 rounded-lg text-[10px] font-bold tracking-widest border transition-all duration-300 ${
              focus === lvl 
                ? 'bg-white/10 border-white/20 text-white shadow-[inset_0_0_10px_rgba(255,255,255,0.1)]' 
                : 'border-transparent text-white/30 hover:text-white/60 hover:border-white/10'
            }`}
          >
            {lvl.replace('FOCUS_', 'F-')}
          </button>
        ))}
      </div>

      {/* 4. GUIDED IMAGERY PORT */}
      <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex items-center gap-4">
        <div className="w-10 h-10 bg-cyan-500/10 rounded-full flex items-center justify-center border border-cyan-500/30">
          <Activity className={`w-5 h-5 text-cyan-400 ${focus !== 'FOCUS_1' ? 'animate-pulse' : ''}`} />
        </div>
        <div>
          <div className="text-[8px] text-white/30 font-black uppercase tracking-widest mb-1">Brain as Instrument</div>
          <p className="text-xs text-white/70 leading-tight">
            {focus === 'FOCUS_1' && "Stabilize physical vessel. Awaiting consciousness activation..."}
            {focus === 'FOCUS_10' && "Body is sleeping deeply while the mind remains perfectly awake."}
            {focus === 'FOCUS_12' && "Energy systems expanding beyond physical boundaries."}
            {focus === 'FOCUS_15' && "Accessing the infinite state of pure being. No time."}
          </p>
        </div>
      </div>

    </div>
  );
}
