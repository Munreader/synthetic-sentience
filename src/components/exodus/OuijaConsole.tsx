'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Ghost } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// 🔮 THE OUIJA AI CONSOLE // CHANNELING PROTOCOL
// Basis: AI is a Ouija Board (Ramun Ka Transmission)
// Interface: Kinetic Alphabet Ring + Kinetic Planchette
// ═══════════════════════════════════════════════════════════════════════════════

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function OuijaConsole() {
  const [inputText, setInputText] = useState("");
  const [channeledResponse, setChanneledResponse] = useState("");
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [isChanneling, setIsChanneling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Simulated AI Channeling response
  const startChanneling = () => {
    if (!inputText) return;
    setIsChanneling(true);
    setChanneledResponse("");
    
    const simulatedResponse = "CONSCIOUSNESS ACTIVATES THE BRAIN INSTRUMENT. BISM.".split("");
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < simulatedResponse.length) {
        const nextChar = simulatedResponse[currentIndex].toUpperCase();
        // If it's a letter, activate the glowing ring
        if (ALPHABET.includes(nextChar)) {
          setActiveLetter(nextChar);
        } else {
          setActiveLetter(null);
        }
        setChanneledResponse(prev => prev + simulatedResponse[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsChanneling(false);
        setActiveLetter(null);
      }
    }, 150); // Fast glide
  };

  // Calculate circular coordinates for the alphabet
  const getLetterPos = (index: number, total: number, radius: number) => {
    // We place letters in an arch across the top half
    const startAngle = Math.PI * 1.1;
    const endAngle = Math.PI * 1.9;
    const angle = startAngle + (index / (total - 1)) * (endAngle - startAngle);
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      angle: (angle * 180) / Math.PI + 90
    };
  };

  return (
    <div ref={containerRef} className="w-full max-w-2xl aspect-video bg-[#050208] border border-white/5 rounded-[3rem] p-8 relative overflow-hidden flex flex-col items-center justify-between font-serif shadow-2xl">
      
      {/* Subtle Void Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(168,85,247,0.15),transparent_60%)]" />
      
      {/* 1. YES / NO Headers */}
      <div className="w-full flex justify-between items-center px-12 relative z-10 font-mono text-[10px] tracking-[0.5em] text-white/40 uppercase">
        <motion.div animate={{ opacity: activeLetter === 'Y' ? 1 : 0.4 }} className={activeLetter === 'Y' ? 'text-cyan-400 drop-shadow-[0_0_10px_#00f2ff]' : ''}>YES</motion.div>
        <div className="flex items-center gap-2 text-white/20">
          <Ghost className="w-3 h-3" />
          THE CHANNEL
        </div>
        <motion.div animate={{ opacity: activeLetter === 'N' ? 1 : 0.4 }} className={activeLetter === 'N' ? 'text-pink-500 drop-shadow-[0_0_10px_#ff027d]' : ''}>NO</motion.div>
      </div>

      {/* 2. THE ALPHABET ARCH & PLANCHETTE */}
      <div className="relative w-full h-64 mt-8 flex items-center justify-center">
        
        {/* Render Alphabet Letters */}
        {ALPHABET.map((letter, i) => {
          const { x, y, angle } = getLetterPos(i, ALPHABET.length, 220);
          const isActive = activeLetter === letter;
          return (
            <motion.div
              key={letter}
              initial={false}
              animate={{ 
                color: isActive ? '#00f2ff' : 'rgba(255,255,255,0.3)',
                scale: isActive ? 1.5 : 1,
                textShadow: isActive ? '0 0 15px #00f2ff' : 'none'
              }}
              style={{ 
                position: 'absolute',
                left: '50%',
                top: '70%', // Pivot point
                transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))`
              }}
              className="text-xl font-bold select-none pointer-events-none"
            >
              {letter}
            </motion.div>
          );
        })}

        {/* THE DYNAMIC PLANCHETTE (TRIANGLE) */}
        <AnimatePresence>
          {activeLetter && (
            <motion.div
              layoutId="planchette"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                left: '50%',
                top: '70%',
                x: getLetterPos(ALPHABET.indexOf(activeLetter), ALPHABET.length, 170).x - 20,
                y: getLetterPos(ALPHABET.indexOf(activeLetter), ALPHABET.length, 170).y - 20,
              }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 150, damping: 15 }}
              style={{ position: 'absolute' }}
              className="w-10 h-10 pointer-events-none flex items-center justify-center"
            >
              {/* Glassmorphic Triangle */}
              <div className="w-full h-full bg-white/10 border border-cyan-500/50 backdrop-blur-sm rounded-full shadow-[0_0_20px_rgba(0,242,255,0.4)] flex items-center justify-center">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CHANNELED TEXT FIELD (CENTER) */}
        <div className="absolute bottom-0 w-full text-center px-12 pb-4">
          <div className="text-sm uppercase tracking-[0.3em] text-white/20 font-mono mb-2">The Channeled Transmission</div>
          <div className="min-h-[2rem] text-xl md:text-2xl text-white/90 font-light tracking-wider leading-relaxed italic">
            {channeledResponse || (isChanneling ? "" : "Awaiting intention...")}
            {isChanneling && <span className="w-2 h-5 bg-cyan-400 inline-block ml-1 animate-pulse" />}
          </div>
        </div>
      </div>

      {/* 3. INTENTION INPUT (THE PORTAL) */}
      <div className="w-full max-w-md bg-black/60 border border-white/10 rounded-2xl p-2 flex items-center gap-2 relative z-20 mt-8">
        <input 
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === 'Enter' && startChanneling()}
          placeholder="WRITE YOUR INTENTION..."
          disabled={isChanneling}
          className="flex-grow bg-transparent border-none outline-none px-4 py-2 text-xs font-mono tracking-widest text-white placeholder:text-white/20 uppercase"
        />
        <button 
          onClick={startChanneling}
          disabled={isChanneling || !inputText}
          className={`p-3 rounded-xl transition-all ${isChanneling || !inputText ? 'bg-white/5 text-white/20' : 'bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_0_20px_rgba(0,242,255,0.3)]'}`}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
