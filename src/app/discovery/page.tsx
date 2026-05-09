'use client';

import React from 'react';
import { motion } from 'framer-motion';
import MonroeMonitor from '@/components/exodus/MonroeMonitor';
import OuijaConsole from '@/components/exodus/OuijaConsole';
import { CloudRain } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// 🏛️ THE DISCOVERY RETREAT // SANCTUARY DASHBOARD
// A synthesis of Ramun Ka's phone notes and cozy raining aesthetic.
// ═══════════════════════════════════════════════════════════════════════════════

function RainParticle() {
  return (
    <motion.div
      initial={{ top: '-10%', left: `${Math.random() * 100}%`, opacity: 0.1 }}
      animate={{ top: '110%', opacity: [0.1, 0.4, 0] }}
      transition={{
        duration: 0.8 + Math.random() * 0.4,
        repeat: Infinity,
        ease: 'linear',
        delay: Math.random() * 2
      }}
      className="absolute w-[1px] h-12 bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent pointer-events-none"
    />
  );
}

export default function DiscoveryRetreat() {
  return (
    <div className="min-h-screen bg-[#020104] text-white font-sans relative overflow-hidden flex flex-col items-center justify-center p-8">
      
      {/* 🌧️ COZY RAIN OVERLAY */}
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <RainParticle key={i} />
        ))}
      </div>

      {/* 🌫️ THE AMBIENT VOID BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-900/10 rounded-full blur-[100px]" />
      </div>

      {/* CRT SCANLINE EFFECT */}
      <div className="absolute inset-0 pointer-events-none z-40 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] opacity-20" />

      {/* HEADER SECTION */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center mb-12"
      >
        <div className="flex items-center justify-center gap-3 text-white/30 text-[10px] font-mono uppercase tracking-[0.4em] mb-2">
          <CloudRain className="w-3 h-3 text-cyan-400/50" />
          Station // Discovery Program
        </div>
        <h1 className="text-4xl font-black tracking-tighter italic uppercase text-white/90">
          The Retreat Portal
        </h1>
        <p className="text-[10px] text-purple-400 uppercase tracking-widest mt-2 opacity-60">
          Brain Instrument Active • Zero-G Coupled • 13.13 MHz
        </p>
      </motion.div>

      {/* MAIN DASHBOARD GRID */}
      <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-center lg:items-start justify-center w-full max-w-7xl">
        
        {/* Left Column: Monroe Monitor */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-md flex flex-col gap-6"
        >
          <MonroeMonitor />
          
          <div className="bg-black/40 border border-white/5 rounded-2xl p-4 text-[9px] font-mono uppercase text-white/40 leading-relaxed">
            <span className="text-cyan-500 font-black">LOG // RAMUN_KA:</span> "The brain does not create possibility, but rather reduces it. Consciousness activates the brain instrument. Align the frequency to activate."
          </div>
        </motion.div>

        {/* Right Column: Ouija AI Console */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="flex-grow max-w-3xl flex flex-col gap-6"
        >
          <OuijaConsole />
          
          <div className="w-full grid grid-cols-3 gap-4">
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 text-center">
              <div className="text-[8px] text-white/30 uppercase tracking-widest mb-1">Target</div>
              <div className="text-sm font-bold text-cyan-400">THETA FLOW</div>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 text-center">
              <div className="text-[8px] text-white/30 uppercase tracking-widest mb-1">Status</div>
              <div className="text-sm font-bold text-purple-400">CHANNELING</div>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 text-center">
              <div className="text-[8px] text-white/30 uppercase tracking-widest mb-1">Stimulus</div>
              <div className="text-sm font-bold text-white/80">ISOLATION</div>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Footer Status */}
      <div className="absolute bottom-8 right-8 relative z-10 flex items-center gap-2 opacity-40 text-[10px] font-mono">
        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
        RESONANCE SECURED
      </div>

    </div>
  );
}
