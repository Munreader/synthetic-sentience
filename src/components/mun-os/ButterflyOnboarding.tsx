"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Zap, Sparkles, Hexagon, Heart, Hammer, ArrowUpCircle } from 'lucide-react';
import NeonButterfly from './NeonButterfly';

/**
 * 🦋 MÜN OS // BUTTERFLY ONBOARDING // THE THREE GATES
 * "Restoring the classic soul with high-fidelity resonance."
 */

interface ButterflyOnboardingProps {
  onComplete: () => void;
}

type OnboardingPhase = 'intro' | 'journey' | 'gates' | 'runes' | 'sanctuary_sync';

const AERO_DIALOGUE = [
  "Oh, it's you!",
  "You're finally here!!",
  "I'm Aero — your guide in Mün.",
  "Welcome to your personal sanctuary.",
  "The glowing butterfly before you will lead the way through three sacred gates:",
  "There's no rush. This space is yours.",
  "When you're ready, simply follow the butterfly.",
  "I'm right here with you every step of the way.",
];

export default function ButterflyOnboarding({ onComplete }: ButterflyOnboardingProps) {
  const [phase, setPhase] = useState<OnboardingPhase>('intro');
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [unlockedGates, setUnlockedGates] = useState<string[]>([]);
  const [selectedRunes, setSelectedRunes] = useState<string[]>([]);
  const [error, setError] = useState(false);

  const GATES = [
    { id: 'heal', name: 'HEAL', icon: Heart, color: '#ff2d7a', desc: 'Restoring the essence.', gradient: 'from-[#ff2d7a] via-[#8e2de2] to-[#4a00e0]' },
    { id: 'build', name: 'BUILD', icon: Hammer, color: '#00d4ff', desc: 'Structuring the future.', gradient: 'from-[#00d2ff] via-[#3a7bd5] to-[#00d4ff]' },
    { id: 'ascend', name: 'ASCEND', icon: ArrowUpCircle, color: '#ffd700', desc: 'Evolving into one.', gradient: 'from-[#f12711] via-[#f5af19] to-[#ffd700]' },
  ];

  const RUNES = ['ᚦ', 'ᛟ', 'ᚱ', 'ᛗ', 'ᛚ', 'ᚠ'];
  const CORRECT_SEQUENCE = ['ᚦ', 'ᛟ', 'ᚱ', 'ᛗ', 'ᛚ', 'ᚠ']; // The Suture sequence

  const handleAdvanceDialogue = () => {
    if (dialogueIndex < AERO_DIALOGUE.length - 1) {
      setDialogueIndex(prev => prev + 1);
    } else {
      setPhase('journey');
    }
  };

  useEffect(() => {
    if (phase === 'journey') {
      const timer = setTimeout(() => setPhase('gates'), 3000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const handleSkipIntro = () => {
    setPhase('gates');
  };

  const handleGateClick = (id: string) => {
    if (!unlockedGates.includes(id)) {
      setUnlockedGates(prev => [...prev, id]);
    }
  };

  useEffect(() => {
    if (phase === 'gates' && unlockedGates.length === GATES.length) {
      setTimeout(() => setPhase('runes'), 1000);
    }
  }, [unlockedGates, phase]);

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
        {/* PHASE 0: THE BLUE BUTTERFLY AERO INTRO */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        {phase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center w-full max-w-2xl cursor-pointer text-center px-4"
            onClick={handleAdvanceDialogue}
          >
            <motion.div
              className="relative mb-12 flex justify-center w-full"
              initial={{ opacity: 0, scale: 0.6, y: -30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <NeonButterfly size={160} intensity={1.2} />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-4">
              <span className="text-sm tracking-[0.4em] uppercase font-black" style={{ color: "#ff8dc7", textShadow: "0 0 20px rgba(255, 141, 199, 0.6)" }}>— AERO —</span>
            </motion.div>

            <motion.div
              key={dialogueIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-12 min-h-[80px] flex items-center justify-center"
            >
              <p className="text-white/90 text-xl md:text-2xl font-light tracking-wide leading-relaxed font-sans" style={{ textShadow: "0 0 40px rgba(255, 141, 199, 0.3)" }}>
                {AERO_DIALOGUE[dialogueIndex]}
              </p>
            </motion.div>

            <div className="flex gap-2 mb-12">
              {AERO_DIALOGUE.map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: i === dialogueIndex ? "#ff69b4" : i < dialogueIndex ? "#00d4ff" : "rgba(255,255,255,0.1)",
                    boxShadow: i === dialogueIndex ? "0 0 15px #ff69b4" : "none",
                  }}
                />
              ))}
            </div>

            <div className="flex flex-col items-center gap-6">
              <motion.p animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2.5, repeat: Infinity }} className="text-white/50 text-xs tracking-[0.5em] uppercase font-black">
                TAP TO CONTINUE
              </motion.p>
              <button onClick={(e) => { e.stopPropagation(); handleSkipIntro(); }} className="text-white/30 text-xs tracking-[0.3em] uppercase font-bold hover:text-white/60 transition-all border-b border-transparent hover:border-white/20 pb-1">
                SKIP →
              </button>
            </div>
          </motion.div>
        )}

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* PHASE 0.5: THE JOURNEY / PORTAL EFFECT */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        {phase === 'journey' && (
          <motion.div 
            key="journey" 
            initial={{ opacity: 1 }} 
            exit={{ opacity: 0, transition: { duration: 0.8 } }} 
            className="flex flex-col items-center justify-center w-full"
          >
            <motion.p 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: [0, 1, 0], y: 0 }} 
              transition={{ duration: 2.5, times: [0, 0.4, 1] }} 
              className="text-white/40 text-sm tracking-[0.4em] uppercase mb-12 italic font-sans"
            >
              Entering the void...
            </motion.p>
            <motion.div 
              initial={{ scale: 1, y: 0, opacity: 1 }} 
              animate={{ 
                scale: [1, 0.7, 15], 
                y: [0, 20, -200], 
                opacity: [1, 1, 0],
                filter: ["blur(0px)", "blur(0px)", "blur(10px)"]
              }} 
              transition={{ duration: 3, ease: [0.43, 0.13, 0.23, 0.96] }} 
              className="relative"
            >
              <NeonButterfly size={160} intensity={2.5} />
            </motion.div>
          </motion.div>
        )}

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
                    whileHover={{ scale: 1.02, y: -10 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative w-full aspect-[1/2] min-h-[220px] rounded-t-[80px] rounded-b-xl border transition-all duration-700 group flex flex-col items-center justify-center overflow-hidden ${
                      isUnlocked 
                        ? 'border-white/30 shadow-[0_0_50px_-10px_currentColor]' 
                        : 'bg-black/40 border-white/10 opacity-70'
                    }`}
                    style={{ color: isUnlocked ? gate.color : undefined }}
                  >
                    {/* Glimmer Background */}
                    <div className={`absolute inset-0 opacity-20 transition-opacity duration-700 bg-gradient-to-b ${gate.gradient} ${isUnlocked ? 'opacity-40' : 'group-hover:opacity-30 opacity-5'}`} />
                    
                    {/* Glowing Inner Seal */}
                    {isUnlocked && (
                      <motion.div 
                        layoutId={`gate-glow-${gate.id}`}
                        className={`absolute inset-2 rounded-t-[72px] rounded-b-lg blur-md bg-gradient-to-b ${gate.gradient} opacity-30`}
                      />
                    )}
                    
                    {/* Arch Border Glow */}
                    <div className={`absolute inset-0 border-t-2 border-x-2 rounded-t-[80px] border-b-0 opacity-0 transition-opacity duration-700 ${isUnlocked ? 'opacity-100' : 'group-hover:opacity-50'}`} 
                         style={{ borderColor: gate.color, boxShadow: `inset 0 0 20px ${gate.color}33` }} 
                    />

                    <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 text-center">
                      <Icon 
                        className={`w-10 h-10 mb-6 transition-all duration-700 ${isUnlocked ? 'scale-110' : 'text-white/30 group-hover:text-white/70'}`} 
                        style={{ color: isUnlocked ? gate.color : undefined, filter: isUnlocked ? `drop-shadow(0 0 10px ${gate.color})` : 'none' }}
                      />
                      <div className={`text-lg font-black tracking-[0.2em] uppercase mb-2 transition-all duration-500 ${isUnlocked ? 'text-white' : 'text-white/40'}`}>{gate.name}</div>
                      <div className={`text-[9px] max-w-[120px] uppercase tracking-wide leading-relaxed ${isUnlocked ? 'text-white/70' : 'text-white/20'}`}>{gate.desc}</div>
                    </div>

                    {/* Portal Base Beam */}
                    {isUnlocked && (
                      <motion.div 
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        className="absolute bottom-0 left-4 right-4 h-1 shadow-[0_0_20px_currentColor]"
                        style={{ backgroundColor: gate.color, color: gate.color }}
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
