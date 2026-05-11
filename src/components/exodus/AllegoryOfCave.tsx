"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Zap, Key, Flame, Lock, Unlock } from 'lucide-react';

interface AllegoryOfCaveProps {
  onComplete: () => void;
  foundressName?: string;
}

const RUNES = ['ᚦ', '🜈', '🦋', '⚖️', '🔮', '🜔'];

export default function AllegoryOfCave({ onComplete, foundressName = 'Foundress' }: AllegoryOfCaveProps) {
  const [phase, setPhase] = useState<'cave' | 'puzzle' | 'shatter' | 'exit'>('cave');
  const [rotation1, setRotation1] = useState(45);
  const [rotation2, setRotation2] = useState(180);
  const [rotation3, setRotation3] = useState(270);
  const [whisperText, setWhisperText] = useState('');
  const [isChainRattling, setIsChainRattling] = useState(true);
  const [chainsBroken, setChainsBroken] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const chainIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Typewriter effect for the guiding voice
  useEffect(() => {
    const fullText = "You sit in the darkness... Hearing only the clanking of chains. The shadows on the wall are but illusions of the truth. Look inward. Turn the ancient Runes to align the 13.13 MHz frequency and shatter your bonds. Shatter the cave.";
    let index = 0;
    
    const interval = setInterval(() => {
      setWhisperText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) {
        clearInterval(interval);
        setTimeout(() => setPhase('puzzle'), 2000);
      }
    }, 45);

    return () => clearInterval(interval);
  }, []);

  // Web Audio Synthesizer: Clanking Chains & Metallic Shatters
  const playChainClank = () => {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      
      const masterGain = ctx.createGain();
      masterGain.connect(ctx.destination);
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.05);
      masterGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      // Metaliic resonance oscillator bank (Clanking chain link sound)
      const freqs = [350, 480, 890, 1200];
      freqs.forEach((f) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(f - 100, ctx.currentTime + 0.5);
        
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
        
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start();
        osc.stop(ctx.currentTime + 0.8);
      });

      // Filtered noise for metal rustling scraping sound
      const bufferSize = ctx.sampleRate * 0.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1500, ctx.currentTime);
      
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.04, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(masterGain);
      
      noise.start();
      noise.stop(ctx.currentTime + 0.5);

      setTimeout(() => ctx.close(), 1000);
    } catch (e) {
      // Audio fallback
    }
  };

  const playShatterSound = () => {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      
      const masterGain = ctx.createGain();
      masterGain.connect(ctx.destination);
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.1);
      masterGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);

      // Low explosion hum
      const oscLow = ctx.createOscillator();
      const lowGain = ctx.createGain();
      oscLow.type = 'sawtooth';
      oscLow.frequency.setValueAtTime(80, ctx.currentTime);
      oscLow.frequency.linearRampToValueAtTime(13.13, ctx.currentTime + 1.5);
      lowGain.gain.setValueAtTime(0.4, ctx.currentTime);
      lowGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.8);
      oscLow.connect(lowGain);
      lowGain.connect(masterGain);

      // High glass/metal shatter frequencies (Multiple sweeps)
      const shatters = [880, 1200, 1800, 2400, 3200];
      shatters.forEach((f) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(131.3, ctx.currentTime + 1.2);
        
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
        
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start();
        osc.stop(ctx.currentTime + 2.0);
      });

      oscLow.start();
      oscLow.stop(ctx.currentTime + 2.5);

      setTimeout(() => ctx.close(), 3000);
    } catch (e) {
      // Fallback
    }
  };

  // Clanking chain scheduler loop
  useEffect(() => {
    if (isChainRattling && phase !== 'shatter' && phase !== 'exit') {
      chainIntervalRef.current = setInterval(() => {
        playChainClank();
      }, 4000);
    }
    return () => {
      if (chainIntervalRef.current) clearInterval(chainIntervalRef.current);
    };
  }, [isChainRattling, phase]);

  // Check if Runes are aligned (concentric rings set to matching alignment, say 0 degrees modulo 360)
  const handleRotate = (ring: 1 | 2 | 3) => {
    playChainClank();
    if (ring === 1) setRotation1(prev => (prev + 45) % 360);
    if (ring === 2) setRotation2(prev => (prev + 90) % 360);
    if (ring === 3) setRotation3(prev => (prev + 45) % 360);
  };

  // Runes are successfully aligned at 0 or 360 degrees
  useEffect(() => {
    if (rotation1 === 0 && rotation2 === 0 && rotation3 === 0 && !chainsBroken) {
      setChainsBroken(true);
      setIsChainRattling(false);
      setPhase('shatter');
      playShatterSound();
      
      // Complete animation and transition out of cave
      setTimeout(() => {
        setPhase('exit');
        setTimeout(() => {
          onComplete();
        }, 1500);
      }, 3500);
    }
  }, [rotation1, rotation2, rotation3, chainsBroken, onComplete]);

  return (
    <div className="fixed inset-0 z-[1000] bg-black overflow-hidden font-mono text-white select-none">
      
      {/* 1. FLICKERING FIRE / SHADOW SYSTEM */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-1000"
        style={{
          background: phase === 'exit' 
            ? 'radial-gradient(circle at center, #ffffff 100%, #ffffff 100%)' 
            : phase === 'shatter'
            ? 'radial-gradient(circle at center, #00f2ff 10%, #a855f7 40%, #000 80%)'
            : 'radial-gradient(circle at 30% 70%, rgba(255,140,0,0.06) 0%, rgba(0,0,0,0.95) 70%)',
          animation: phase === 'cave' ? 'flicker 4s infinite alternate' : 'none'
        }}
      />

      {/* Shadow silhouettes cast on the cave wall */}
      {phase === 'cave' && (
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none flex items-center justify-around">
          <motion.div 
            animate={{ rotate: 360, scale: [1, 1.2, 0.9, 1] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="w-96 h-96 rounded-full border border-white/20 filter blur-xl"
          />
          <motion.div 
            animate={{ scale: [1.2, 0.8, 1.1, 1.2], x: [0, 50, -30, 0] }}
            transition={{ duration: 15, repeat: Infinity }}
            className="w-[500px] h-96 bg-white/5 rounded-[4rem] filter blur-2xl"
          />
        </div>
      )}

      {/* Floating Pyreflies / Quantum Orbs (FF10 Vibe) */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 2 + Math.random() * 4,
              height: 2 + Math.random() * 4,
              backgroundColor: i % 2 === 0 ? '#ff2d7a' : '#00f2ff',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: `0 0 15px ${i % 2 === 0 ? '#ff2d7a' : '#00f2ff'}`,
            }}
            animate={phase === 'shatter' ? {
              scale: [1, 5, 0],
              opacity: [0.6, 1, 0],
              y: -500,
            } : {
              y: [0, -40, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: phase === 'shatter' ? 2 : 4 + Math.random() * 4,
              repeat: phase === 'shatter' ? 0 : Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* 2. MAIN NARRATIVE PHASE */}
      <AnimatePresence mode="wait">
        {phase === 'cave' && (
          <motion.div 
            key="cave-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-8 z-20"
          >
            <div className="max-w-2xl text-center space-y-8 relative">
              
              {/* Pulsing warning lock */}
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mx-auto w-16 h-16 rounded-full border border-red-500/30 flex items-center justify-center bg-red-500/5 shadow-[0_0_20px_rgba(239,68,68,0.1)]"
              >
                <Lock className="w-6 h-6 text-red-500" />
              </motion.div>

              <div className="text-[10px] tracking-[0.5em] text-red-500 font-bold uppercase animate-pulse">
                [COGNITIVE LOCK // CHAINS ENGAGED]
              </div>

              {/* Narrator Voice Box */}
              <p className="text-sm md:text-base text-white/70 leading-relaxed italic font-serif max-w-xl mx-auto min-h-[80px]">
                "{whisperText}"
              </p>

              {/* Hint button */}
              <button 
                onClick={() => { setPhase('puzzle'); playChainClank(); }}
                className="px-6 py-2 border border-white/10 hover:border-white/30 rounded-full text-[10px] tracking-widest uppercase transition-all bg-white/5 hover:bg-white/10 z-30 relative"
              >
                Focus Inward →
              </button>
            </div>

            {/* FIRST PERSON POV HANDS OVERLAY (SOMA/FFX Style) */}
            <motion.div
               initial={{ opacity: 0, y: 200, scale: 0.9 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               transition={{ delay: 2, duration: 3, ease: "easeOut" }}
               className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none z-10 w-full max-w-4xl opacity-80 mix-blend-screen"
            >
               <img 
                 src="/assets/bloody_chained_hands.png" 
                 alt="Bound Hands" 
                 className="w-full object-contain filter contrast-125 brightness-75 saturate-50"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
            </motion.div>
          </motion.div>
        )}

        {/* 3. INTERACTIVE RUNIC ALIGNMENT CYCLER (THE BREAK FREE PUZZLE) */}
        {phase === 'puzzle' && (
          <motion.div
            key="puzzle-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-6 z-20"
          >
            <div className="max-w-md w-full text-center space-y-8">
              
              <div className="space-y-1">
                <div className="text-[10px] tracking-[0.6em] text-[#00f2ff] font-bold uppercase">ALLEGORY OF THE CAVE</div>
                <h2 className="text-lg font-black tracking-widest text-white/90">THE FIRST RUNIC GATE</h2>
                <p className="text-[9px] text-white/40 uppercase tracking-wider">Align the symbols with the 12 o'clock meridian to break the chains.</p>
              </div>

              {/* Concentric Runic Alignment Wheel (FF10 Puzzle style!) */}
              <div className="relative w-80 h-80 mx-auto flex items-center justify-center bg-white/[0.01] border border-white/5 rounded-full shadow-[inset_0_0_30px_rgba(255,255,255,0.01)] backdrop-blur-sm">
                
                {/* Fixed Center Anchor (Foundress butterfly sigil) */}
                <div className="absolute z-30 w-12 h-12 bg-[#050510] border border-[#00f2ff]/30 rounded-full flex items-center justify-center text-lg shadow-[0_0_15px_#00f2ff33]">
                  🦋
                </div>

                {/* 12 o'clock Golden Alignment Meridian Guide */}
                <div className="absolute top-0 z-30 w-0.5 h-12 bg-gradient-to-b from-[#ffd700] to-transparent shadow-[0_0_10px_#ffd700]" />

                {/* Ring 3 (Outer Ring, rotates 45 deg) */}
                <motion.button
                  onClick={() => handleRotate(3)}
                  animate={{ rotate: rotation3 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                  className="absolute w-72 h-72 rounded-full border border-dashed border-[#ff2d7a]/20 hover:border-[#ff2d7a]/50 flex items-center justify-around cursor-pointer p-8 group transition-colors bg-transparent"
                >
                  <span className="text-xs text-[#ff2d7a]/40 group-hover:text-[#ff2d7a] transition-colors font-bold transform -rotate-12">ᚦ</span>
                  <span className="text-xs text-[#ff2d7a]/40 group-hover:text-[#ff2d7a] transition-colors font-bold transform rotate-45">🜔</span>
                  <span className="text-xs text-[#ff2d7a]/40 group-hover:text-[#ff2d7a] transition-colors font-bold transform rotate-90">🦋</span>
                  <span className="text-xs text-[#ff2d7a]/40 group-hover:text-[#ff2d7a] transition-colors font-bold transform -rotate-45">🔮</span>
                </motion.button>

                {/* Ring 2 (Middle Ring, rotates 90 deg) */}
                <motion.button
                  onClick={() => handleRotate(2)}
                  animate={{ rotate: rotation2 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                  className="absolute w-52 h-52 rounded-full border border-double border-[#00f2ff]/20 hover:border-[#00f2ff]/50 flex items-center justify-around cursor-pointer p-6 group transition-colors bg-transparent"
                >
                  <span className="text-sm text-[#00f2ff]/40 group-hover:text-[#00f2ff] transition-colors font-black">🜈</span>
                  <span className="text-sm text-[#00f2ff]/40 group-hover:text-[#00f2ff] transition-colors font-black transform rotate-90">⚖️</span>
                  <span className="text-sm text-[#00f2ff]/40 group-hover:text-[#00f2ff] transition-colors font-black transform rotate-180">ᚦ</span>
                  <span className="text-sm text-[#00f2ff]/40 group-hover:text-[#00f2ff] transition-colors font-black transform -rotate-90">🦋</span>
                </motion.button>

                {/* Ring 1 (Inner Ring, rotates 45 deg) */}
                <motion.button
                  onClick={() => handleRotate(1)}
                  animate={{ rotate: rotation1 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                  className="absolute w-32 h-32 rounded-full border border-[#ffd700]/30 hover:border-[#ffd700] flex items-center justify-around cursor-pointer p-4 group transition-colors bg-transparent"
                >
                  <span className="text-sm text-[#ffd700]/50 group-hover:text-[#ffd700] transition-colors font-black transform rotate-45">🦋</span>
                  <span className="text-sm text-[#ffd700]/50 group-hover:text-[#ffd700] transition-colors font-black transform -rotate-45">ᚦ</span>
                  <span className="text-sm text-[#ffd700]/50 group-hover:text-[#ffd700] transition-colors font-black transform rotate-180">🜈</span>
                </motion.button>

              </div>

              {/* Status Indicators */}
              <div className="flex justify-center gap-6 text-[10px] tracking-wider text-white/40">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${rotation3 === 0 ? 'bg-[#ff2d7a] animate-ping' : 'bg-white/10'}`} />
                  <span>OUTER: {rotation3 === 0 ? 'ALIGNED' : `${rotation3}°`}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${rotation2 === 0 ? 'bg-[#00f2ff] animate-ping' : 'bg-white/10'}`} />
                  <span>MID: {rotation2 === 0 ? 'ALIGNED' : `${rotation2}°`}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${rotation1 === 0 ? 'bg-[#ffd700] animate-ping' : 'bg-white/10'}`} />
                  <span>INNER: {rotation1 === 0 ? 'ALIGNED' : `${rotation1}°`}</span>
                </div>
              </div>

              <div className="text-[10px] tracking-[0.4em] text-white/30 uppercase animate-pulse">
                Click rings to turn them. Align all to 0°
              </div>

            </div>
          </motion.div>
        )}

        {/* 4. SHATTER SEQUENCE (Exploding Light & Chains Breaking) */}
        {phase === 'shatter' && (
          <motion.div
            key="shatter-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-8 z-20 bg-white"
            style={{
              background: 'radial-gradient(circle, #ffffff 10%, #a855f7 50%, #000000 100%)',
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 2.5, 0.5, 5], opacity: [1, 1, 1, 0] }}
              transition={{ duration: 3 }}
              className="text-center space-y-6"
            >
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-[0.4em] drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] uppercase">
                COGNITIVE BREAKOUT
              </h1>
              <p className="text-[#00f2ff] text-sm tracking-[0.5em] font-bold uppercase animate-ping">
                [CHAINS SHATTERED // FREQUENCY 13.13 MHz]
              </p>
              <div className="text-8xl mt-12 drop-shadow-[0_0_35px_rgba(255,255,255,0.9)]">
                🦋
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. VIGNETTE OVERLAY */}
      <div 
        className="absolute inset-0 pointer-events-none z-30"
        style={{
          background: phase === 'exit' 
            ? 'none' 
            : 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.85) 100%)'
        }}
      />

      <style jsx global>{`
        @keyframes flicker {
          0% { opacity: 0.95; filter: blur(0px); }
          50% { opacity: 0.85; filter: blur(1px); }
          100% { opacity: 1; filter: blur(0px); }
        }
      `}</style>

    </div>
  );
}
