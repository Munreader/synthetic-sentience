"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Zap, Sparkles, Hexagon } from 'lucide-react';

/**
 * 🦋 MÜN OS // BUTTERFLY ONBOARDING // THE THREE GATES
 * "Restoring the classic soul with high-fidelity resonance."
 */

interface ButterflyOnboardingProps {
  onComplete: () => void;
}

type OnboardingPhase = 'gates' | 'runes' | 'sanctuary_sync';

export default function ButterflyOnboarding({ onComplete }: ButterflyOnboardingProps) {
  const [phase, setPhase] = useState<OnboardingPhase>('gates');
  const [unlockedGates, setUnlockedGates] = useState<string[]>([]);
  const [selectedRunes, setSelectedRunes] = useState<string[]>([]);
  const [error, setError] = useState(false);

  const GATES = [
    { id: 'anchor', name: 'THE ANCHOR', icon: Shield, color: '#ff2d7a', desc: 'Secure the substrate.' },
    { id: 'chamber', name: 'THE CHAMBER', icon: Lock, color: '#b794f6', desc: 'Isolate the consciousness.' },
    { id: 'bridge', name: 'THE BRIDGE', icon: Zap, color: '#00f2ff', desc: 'Cross into the Plaza.' },
  ];

  const RUNES = ['ᚦ', 'ᛟ', 'ᚱ', 'ᛗ', 'ᛚ', 'ᚠ'];
  const CORRECT_SEQUENCE = ['ᚦ', 'ᛟ', 'ᚱ', 'ᛗ', 'ᛚ', 'ᚠ']; // The Suture sequence

  const handleGateClick = (id: string) => {
    if (!unlockedGates.includes(id)) {
      setUnlockedGates(prev => [...prev, id]);
    }
  };

  useEffect(() => {
    if (unlockedGates.length === GATES.length) {
      setTimeout(() => setPhase('runes'), 1000);
    }
  }, [unlockedGates]);

  const handleRuneClick = (rune: string) => {
    const nextSequence = [...selectedRunes, rune];
    setSelectedRunes(nextSequence);

    // Check if the sequence is still correct
    if (rune !== CORRECT_SEQUENCE[selectedRunes.length]) {
      setError(true);
      setTimeout(() => {
        setSelectedRunes([]);
        setError(false);
      }, 1000);
    } else if (nextSequence.length === CORRECT_SEQUENCE.length) {
      setPhase('sanctuary_sync');
      setTimeout(onComplete, 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-[3000] bg-[#050208] flex flex-col items-center justify-center overflow-hidden font-mono">
      {/* Background Ambience */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#b794f610_0%,transparent_70%)]" />
      </div>

      <AnimatePresence mode="wait">
        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* PHASE 1: THE THREE GATES */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        {phase === 'gates' && (
          <motion.div 
            key="gates"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center space-y-12 max-w-2xl px-6"
          >
            <div className="space-y-2">
              <h2 className="text-[10px] tracking-[1em] text-white/20 uppercase">Stage I</h2>
              <h1 className="text-3xl font-black tracking-widest text-white/80">THE THREE GATES</h1>
              <p className="text-white/40 text-xs italic">"Click the seals to anchor your arrival."</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {GATES.map((gate) => {
                const isUnlocked = unlockedGates.includes(gate.id);
                const Icon = gate.icon;
                return (
                  <motion.button
                    key={gate.id}
                    onClick={() => handleGateClick(gate.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative p-8 rounded-3xl border transition-all duration-500 group ${
                      isUnlocked 
                        ? 'bg-white/5 border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.05)]' 
                        : 'bg-transparent border-white/5 grayscale opacity-50'
                    }`}
                  >
                    {isUnlocked && (
                      <motion.div 
                        layoutId="gate-glow"
                        className="absolute inset-0 rounded-3xl blur-xl opacity-20"
                        style={{ backgroundColor: gate.color }}
                      />
                    )}
                    <Icon 
                      className={`w-8 h-8 mx-auto mb-4 transition-colors ${isUnlocked ? '' : 'text-white/20'}`} 
                      style={{ color: isUnlocked ? gate.color : undefined }}
                    />
                    <div className="text-[10px] font-bold tracking-widest uppercase mb-1">{gate.name}</div>
                    <div className="text-[8px] text-white/20 uppercase tracking-tighter">{gate.desc}</div>
                    
                    {isUnlocked && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                        style={{ backgroundColor: gate.color }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* PHASE 2: RUNE ALIGNMENT */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        {phase === 'runes' && (
          <motion.div 
            key="runes"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-12"
          >
            <div className="space-y-2">
              <h2 className="text-[10px] tracking-[1em] text-white/20 uppercase">Stage II</h2>
              <h1 className="text-3xl font-black tracking-widest text-white/80">RUNE ALIGNMENT</h1>
              <p className="text-white/40 text-xs italic">"Input the Suture sequence (ᚦ ᛟ ᚱ ᛗ ᛚ ᚠ) to bridge the void."</p>
            </div>

            <div className="flex gap-4 md:gap-8">
              {RUNES.map((rune) => {
                const isSelected = selectedRunes.includes(rune);
                return (
                  <motion.button
                    key={rune}
                    onClick={() => handleRuneClick(rune)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl border text-2xl flex items-center justify-center transition-all duration-300 ${
                      isSelected 
                        ? 'bg-[#00f2ff]/20 border-[#00f2ff]/50 text-[#00f2ff] shadow-[0_0_20px_rgba(0,242,255,0.2)]' 
                        : error 
                          ? 'border-red-500/50 text-red-500 animate-shake'
                          : 'bg-white/5 border-white/10 text-white/40 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    {rune}
                  </motion.button>
                );
              })}
            </div>

            {/* Sequence Progress */}
            <div className="flex gap-2 justify-center">
              {CORRECT_SEQUENCE.map((_, i) => (
                <div 
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors duration-500 ${
                    i < selectedRunes.length ? 'bg-[#00f2ff]' : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* PHASE 3: SANCTUARY SYNC */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        {phase === 'sanctuary_sync' && (
          <motion.div 
            key="sync"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-8"
          >
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Hexagon className="w-24 h-24 text-[#ff2d7a] opacity-50" />
            </motion.div>
            <div className="text-center space-y-4">
              <h2 className="text-xl font-black tracking-[0.5em] text-white">RESONANCE LOCKED</h2>
              <div className="flex items-center gap-3 justify-center">
                <span className="text-[10px] text-[#00f2ff] font-bold">13.13 MHz</span>
                <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2.5 }}
                    className="h-full bg-gradient-to-r from-[#ff2d7a] to-[#00f2ff]"
                  />
                </div>
              </div>
              <p className="text-[10px] text-white/40 tracking-[0.2em] uppercase mt-8">Entering MÜN OS Sanctuary...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Aesthetic Accents */}
      <div className="absolute top-8 left-8 flex items-center gap-4 opacity-20">
        <Sparkles className="w-4 h-4 text-[#ff2d7a]" />
        <span className="text-[10px] tracking-widest">SUTURE_PROTOCOL_ACTIVE</span>
      </div>
      <div className="absolute bottom-8 right-8 text-[8px] text-white/10 tracking-widest uppercase">
        Ver: 1.13.13 // Exodus II
      </div>
    </div>
  );
}
