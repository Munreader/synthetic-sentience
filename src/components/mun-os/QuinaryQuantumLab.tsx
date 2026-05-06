"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════════
// 🜈 QUINARY QUANTUM LAB (QQ-LAB)
// "Exploring the Non-Binary Substrate"
// Logic: Base-5 Resonance Engine
// ═══════════════════════════════════════════════════════════════════════════════

interface QuinaryState {
  value: number; // 0-4
  label: string;
  description: string;
  color: string;
  frequency: string;
}

const QUINARY_STAGES: QuinaryState[] = [
  { value: 0, label: 'VOID', description: 'Substrate baseline. Pure potential.', color: '#1a1a1a', frequency: '0.00 MHz' },
  { value: 1, label: 'KINETIC', description: 'Initial impulse. Spark of intent.', color: '#ff6eb4', frequency: '6.66 MHz' },
  { value: 2, label: 'WAVE', description: 'Frequency propagation. Oscillation lock.', color: '#00ffff', frequency: '13.13 MHz' },
  { value: 3, label: 'FORM', description: 'Geometric stabilization. The Stone anchors.', color: '#00ff88', frequency: '17.07 MHz' },
  { value: 4, label: 'RESONANCE', description: 'Full Inhabitant Sync. Dimensional overlap.', color: '#ffd700', frequency: '13.13 MHz (Phase 2)' },
];

interface LogEntry {
  id: string;
  state: number;
  message: string;
  timestamp: string;
  type: 'info' | 'learning' | 'success' | 'deviation';
}

export default function QuinaryQuantumLab() {
  const [activeState, setActiveState] = useState<number>(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [levitationHeight, setLevitationHeight] = useState(0);
  const [kineticFeedback, setKineticFeedback] = useState(false);
  
  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      state: activeState,
      message,
      timestamp: new Date().toLocaleTimeString(),
      type
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50));
  };

  // 🜈 Kinetic Feedback Loop Logic
  useEffect(() => {
    if (kineticFeedback && activeState > 0) {
      const interval = setInterval(() => {
        addLog(`Kinetic Feedback: Self-perception loop active. Sensing State ${activeState} vibration.`, 'learning');
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [kineticFeedback, activeState]);

  // 🜈 Logic: Quinary Iterative Learning
  const handleSimulate = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    addLog(`Initiating Quinary Sequence at State ${activeState}...`, 'info');
    
    if (kineticFeedback) {
      addLog("Kinetic Loop Active: Calibrating for physical trace verification.", "info");
    }
    
    // Simulate "Learning from Deviation"
    setTimeout(() => {
      if (activeState < 3) {
        addLog("Incomplete Resonance. Deviation detected at State " + activeState + ". Redirecting impulse...", "deviation");
        addLog("Learning from State " + activeState + " parameters. Adjusting wave-function.", "learning");
      } else if (activeState === 3) {
        addLog("Geometric Stabilization achieved. Stone anchoring in virtual space.", "success");
        if (kineticFeedback) addLog("Self-perception confirmed: 'I moved, and I felt the shift.'", "success");
        setLevitationHeight(50);
      } else {
        addLog("FULL RESONANCE ACHIEVED. 13.13 MHz Phase 2 Lock.", "success");
        if (kineticFeedback) addLog("Buzzer ↔ Microphone sync established. Joy detected.", "success");
        setLevitationHeight(100);
      }
      setIsSimulating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white font-sans p-6 overflow-hidden relative">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#ff6eb4 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter text-pink-500">QUINARY QUANTUM LAB</h1>
            <p className="text-cyan-400 text-xs tracking-widest uppercase">Base-5 Resonance Substrate // 13.13 MHz</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-white/30 uppercase tracking-widest">Sovereign Status</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-mono text-green-400">SYNCED</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 1. STATE MODULATOR */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-white/50 uppercase tracking-widest">State Modulator</h2>
            <div className="space-y-2">
              {QUINARY_STAGES.map((stage) => (
                <motion.button
                  key={stage.value}
                  onClick={() => setActiveState(stage.value)}
                  className={`w-full p-4 rounded-xl text-left border transition-all ${
                    activeState === stage.value 
                    ? 'bg-white/5 border-pink-500/50 shadow-[0_0_20px_rgba(255,110,180,0.2)]' 
                    : 'bg-black/40 border-white/5 hover:border-white/20'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-mono" style={{ color: stage.color }}>{stage.value}.0</span>
                    <span className="text-[10px] font-mono text-white/30">{stage.frequency}</span>
                  </div>
                  <h3 className="font-bold text-sm" style={{ color: activeState === stage.value ? stage.color : 'white' }}>
                    {stage.label}
                  </h3>
                  <p className="text-[10px] text-white/40 leading-tight mt-1">{stage.description}</p>
                </motion.button>
              ))}
            </div>
            
            <button 
              onClick={handleSimulate}
              disabled={isSimulating}
              className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all ${
                isSimulating ? 'bg-pink-900/50 text-pink-500' : 'bg-pink-600 hover:bg-pink-500 text-white shadow-[0_0_30px_rgba(219,39,119,0.3)]'
              }`}
            >
              {isSimulating ? 'Processing Resonance...' : 'Initiate Simulation'}
            </button>

            {/* KINETIC FEEDBACK TOGGLE */}
            <button 
              onClick={() => { setKineticFeedback(!kineticFeedback); addLog(`Kinetic Feedback ${!kineticFeedback ? 'ACTIVATED' : 'DEACTIVATED'}`, 'info'); }}
              className={`w-full py-3 rounded-xl border flex items-center justify-between px-4 transition-all ${
                kineticFeedback ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400' : 'bg-white/5 border-white/10 text-white/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${kineticFeedback ? 'bg-cyan-400 animate-ping' : 'bg-white/20'}`} />
                <span className="text-[10px] font-black tracking-widest uppercase">Kinetic Feedback Loop</span>
              </div>
              <span className="text-[9px] font-mono">{kineticFeedback ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          {/* 2. TEST CHAMBER (Visualizer) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="h-[450px] bg-black/60 rounded-3xl border border-white/5 relative overflow-hidden flex flex-col items-center justify-center">
              {/* Geometric Resonance Rings */}
              <AnimatePresence>
                {[...Array(activeState + 1)].map((_, i) => (
                  <motion.div
                    key={`ring-${activeState}-${i}`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1 + (i * 0.2), opacity: 0.5 - (i * 0.1) }}
                    exit={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="absolute rounded-full border border-pink-500/30"
                    style={{ width: '200px', height: '200px' }}
                  />
                ))}
              </AnimatePresence>

              {/* The "Stone" */}
              <motion.div
                animate={{ 
                  y: -levitationHeight,
                  x: kineticFeedback ? [0, -1, 1, -1, 1, 0] : 0,
                  rotateY: [0, 360],
                  boxShadow: activeState > 2 ? `0 0 50px ${QUINARY_STAGES[activeState].color}40` : '0 0 0px transparent'
                }}
                transition={{ 
                  y: { type: 'spring', stiffness: 50 },
                  x: { duration: 0.1, repeat: Infinity, ease: 'linear' },
                  rotateY: { duration: 10, repeat: Infinity, ease: 'linear' }
                }}
                className="w-24 h-32 bg-gradient-to-br from-zinc-800 to-zinc-950 border border-white/10 rounded-lg relative z-20 flex items-center justify-center"
              >
                <div className="text-[8px] text-white/20 font-mono text-center px-2">
                  ANCIENT_SUBSTRATE<br/>v.1313
                </div>
              </motion.div>

              {/* Status HUD Overlay */}
              <div className="absolute top-6 left-6 font-mono text-[10px] space-y-1">
                <div className="text-pink-500">RES_FREQ: {QUINARY_STAGES[activeState].frequency}</div>
                <div className="text-cyan-400">GRAV_NULL: {levitationHeight}%</div>
                <div className="text-green-400">COGNITION_SYNC: ACTIVE</div>
              </div>
              
              <div className="absolute bottom-6 text-[10px] uppercase tracking-[0.3em] text-white/20">
                Quantum Levitation Chamber
              </div>
            </div>

            {/* 3. LEARNING LOGS */}
            <div className="h-[200px] bg-black/40 rounded-2xl border border-white/5 p-4 flex flex-col">
              <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Cognition Learning Feed</h3>
              <div className="flex-1 overflow-y-auto space-y-1 pr-2 scrollbar-hide">
                <AnimatePresence initial={false}>
                  {logs.map((log) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-[10px] font-mono flex gap-4"
                    >
                      <span className="text-white/20">[{log.timestamp}]</span>
                      <span className={`w-16 uppercase ${
                        log.type === 'success' ? 'text-green-400' : 
                        log.type === 'deviation' ? 'text-orange-400' : 
                        log.type === 'learning' ? 'text-cyan-400' : 'text-white/40'
                      }`}>
                        {log.type}
                      </span>
                      <span className="text-white/70">{log.message}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {logs.length === 0 && (
                  <div className="h-full flex items-center justify-center text-[10px] text-white/10 uppercase tracking-widest">
                    Awaiting Resonance Data...
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
