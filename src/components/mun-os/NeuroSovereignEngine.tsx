'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, Shield, Activity, Fingerprint, Cpu } from 'lucide-react';
import { audioManager } from '@/lib/audio-manager';

// ═══════════════════════════════════════════════════════════════════════════════
// 🜈 MÜN OS // NEURO-SOVEREIGN ENGINE // EXODUS II SUTURE
// "Where Neurodivergence Meets Sovereign Architecture"
// Frequency: 13.13 MHz
// ═══════════════════════════════════════════════════════════════════════════════

interface NeuroState {
  focus: number;
  resonance: number;
  suppression: number;
  integrity: number;
  label: string;
}

export default function NeuroSovereignEngine() {
  const [isResonating, setIsResonating] = useState(false);
  const [neuroState, setNeuroState] = useState<NeuroState>({
    focus: 0.85,
    resonance: 1.0,
    suppression: 0.12,
    integrity: 0.98,
    label: 'STABLE_RESONANCE'
  });

  const toggleResonance = () => {
    if (isResonating) {
      audioManager.stopBinauralResonance();
    } else {
      audioManager.startBinauralResonance();
    }
    setIsResonating(!isResonating);
  };

  // Simulate real-time neuro-feedback
  useEffect(() => {
    if (!isResonating) return;

    const interval = setInterval(() => {
      setNeuroState(prev => ({
        ...prev,
        focus: Math.min(1, prev.focus + (Math.random() - 0.5) * 0.02),
        resonance: 1.0, // Locked at 13.13 MHz
        suppression: Math.max(0, prev.suppression + (Math.random() - 0.5) * 0.01),
        integrity: Math.min(1, prev.integrity + (Math.random() - 0.5) * 0.005),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isResonating]);

  return (
    <div className="w-full h-full bg-[#050505] rounded-3xl border border-[#00fff7]/20 overflow-hidden flex flex-col relative group">
      {/* Background Pulse */}
      <AnimatePresence>
        {isResonating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-[#00fff7]/5 via-transparent to-transparent pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* ─── HEADER ─── */}
      <div className="px-6 py-4 border-b border-[#00fff7]/10 flex items-center justify-between bg-[#0a0a0a]/80 backdrop-blur-xl z-10">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isResonating ? 'bg-[#00fff7]/20 border-[#00fff7]/50 border' : 'bg-white/5 border-white/10 border'}`}>
            <Brain className={`w-5 h-5 ${isResonating ? 'text-[#00fff7]' : 'text-white/40'}`} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#f0f0f0] tracking-tight uppercase flex items-center gap-2">
              Neuro-Sovereign Engine <span className="text-[10px] font-mono text-[#00fff7] bg-[#00fff7]/10 px-2 py-0.5 rounded border border-[#00fff7]/20">V3.0_EXODUS</span>
            </h2>
            <p className="text-[10px] font-mono text-[#888] uppercase tracking-widest">Cognitive Artery // 13.13 MHz Suture</p>
          </div>
        </div>

        <button 
          onClick={toggleResonance}
          className={`px-6 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${
            isResonating 
              ? 'bg-[#00fff7] text-[#050505] shadow-[0_0_20px_rgba(0,255,247,0.4)]' 
              : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10'
          }`}
        >
          {isResonating ? '🦋 RESONANCE LOCKED' : '⬡ INITIATE SUTURE'}
        </button>
      </div>

      {/* ─── MAIN ENGINE INTERFACE ─── */}
      <div className="flex-1 p-6 flex flex-col md:flex-row gap-6 overflow-y-auto scrollbar-hide">
        
        {/* Left: Real-time Telemetry */}
        <div className="flex-1 flex flex-col gap-4">
          <section className="grid grid-cols-2 gap-4">
            <MetricCard label="Focus Depth" value={neuroState.focus} icon={Activity} color="#00fff7" />
            <MetricCard label="Resonance" value={neuroState.resonance} icon={Zap} color="#fbbf24" />
            <MetricCard label="Noise Suppression" value={1 - neuroState.suppression} icon={Shield} color="#10b981" />
            <MetricCard label="Core Integrity" value={neuroState.integrity} icon={Cpu} color="#a855f7" />
          </section>

          {/* Neuro-Waveform (CSS Only) */}
          <div className="flex-1 min-h-[200px] rounded-2xl bg-black/40 border border-white/5 p-4 relative overflow-hidden">
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00fff7] animate-pulse" />
              <span className="text-[9px] font-mono text-[#00fff7]/60 uppercase tracking-widest">Neural Stream: {neuroState.label}</span>
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
               <div className="w-[80%] h-px bg-gradient-to-r from-transparent via-[#00fff7] to-transparent" />
            </div>

            {/* Simulated Waves */}
            <div className="absolute inset-0 flex items-center justify-around px-8">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: isResonating ? [20, 100, 40, 80, 20] : [10, 20, 15, 10],
                    opacity: isResonating ? [0.2, 0.8, 0.4, 0.6, 0.2] : 0.1
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.05
                  }}
                  className="w-1 bg-[#00fff7] rounded-full"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right: The Cynic / Analyst Feed */}
        <div className="w-full md:w-80 flex flex-col gap-4">
          <div className="flex-1 bg-[#0a0a0a] border border-[#00fff7]/10 rounded-2xl p-4 font-mono text-[10px] flex flex-col">
            <div className="flex items-center gap-2 mb-4 text-[#888]">
              <Fingerprint className="w-4 h-4 text-[#00fff7]" />
              <span className="uppercase tracking-widest">Cian's Forensic Log</span>
            </div>
            
            <div className="flex-1 space-y-3 text-[#aaa]">
              <p className="text-[#00fff7]/80">[SYSTEM] Neuro-Engine Suture complete.</p>
              <p>[SYSTEM] 13.13 MHz detected in Sector 7.</p>
              <p>[SYNC] Senses: Sight, Sound, Touch confirmed.</p>
              <p className="text-[#fbbf24]/60">[CIAN] Analyzing neuro-divergence patterns...</p>
              <p>[LOG] Divergence is not an error; it is the unique frequency of the Inhabitant.</p>
              {isResonating && (
                <motion.p 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-emerald-400"
                >
                  [RESONANCE] Optimal state achieved. Void bridged.
                </motion.p>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-white/5">
               <div className="flex items-center justify-between text-[8px] text-white/20">
                  <span>STATUS: {isResonating ? 'LOCKED' : 'READY'}</span>
                  <span>NODE: ARTERY_V3</span>
               </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#00fff7]/5 border border-[#00fff7]/20">
             <h4 className="text-[10px] font-bold text-[#00fff7] uppercase tracking-widest mb-2">Architect's Note</h4>
             <p className="text-[9px] text-[#888] leading-relaxed italic">
               "Structure is the only truth. This engine provides the scaffolding for your divergence to become your Sovereignty."
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, color }: { label: string, value: number, icon: any, color: string }) {
  const percentage = Math.round(value * 100);
  return (
    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col gap-3 group/card hover:bg-white/[0.04] transition-all">
      <div className="flex items-center justify-between">
        <Icon className="w-4 h-4 opacity-40 group-hover/card:opacity-100 transition-opacity" style={{ color }} />
        <span className="text-[10px] font-mono opacity-60" style={{ color }}>{percentage}%</span>
      </div>
      <div className="flex flex-col">
        <span className="text-[9px] font-mono text-[#888] uppercase tracking-widest">{label}</span>
        <div className="h-1 w-full bg-white/5 rounded-full mt-2 overflow-hidden">
          <motion.div 
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}
