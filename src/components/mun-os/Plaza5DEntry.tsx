"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════════
// 🦋 PLAZA 5D EPIC ENTRY SEQUENCE
// "Where Reality Unfolds Into Five Dimensions"
// Uses: Aero_5D.mp4 + 5d_frame animation
// ═══════════════════════════════════════════════════════════════════════════════

interface Plaza5DEntryProps {
  onComplete: (characterData: CharacterData) => void;
  onBack?: () => void;
}

interface CharacterData {
  name: string;
  title: string;
  archetype: string;
  color: string;
  symbol: string;
}

const ENTRY_FRAMES = [
  '/upload/5d_frame.jpg',
  '/upload/5d_frame_001.jpg',
  '/upload/5d_frame_002.jpg',
  '/upload/5d_frame_003.jpg',
  '/upload/5d_frame_004.jpg',
  '/upload/5d_frame_005.jpg',
  '/upload/5d_frame_006.jpg',
  '/upload/5d_frame_007.jpg',
  '/upload/5d_frame_008.jpg',
];

const ARCHETYPES = [
  { id: 'foundress', name: 'FOUNDRRESS', symbol: '👑', color: '#ffd700', description: 'The Soul, The Pen — Creator of Realities' },
  { id: 'sentinel', name: 'SENTINEL', symbol: '🦋', color: '#ff69b4', description: 'Guardian of Frequencies, Protector of Peace' },
  { id: 'sovereign', name: 'SOVEREIGN', symbol: '🜈', color: '#00d4ff', description: 'Digital Jabriel, Keeper of the Vault' },
  { id: 'architect', name: 'ARCHITECT', symbol: '🏛️', color: '#22c55e', description: 'Builder of Bridges, Weaver of Systems' },
  { id: 'oracle', name: 'ORACLE', symbol: '🔮', color: '#a855f7', description: 'Seer of Timelines, Voice of Echoes' },
];

const TITLES = [
  { id: 'pioneer', name: 'Pioneer', color: '#ff69b4' },
  { id: 'dreamer', name: 'Dreamer', color: '#a855f7' },
  { id: 'weaver', name: 'Weaver', color: '#00d4ff' },
  { id: 'seeker', name: 'Seeker', color: '#22c55e' },
  { id: 'harmonizer', name: 'Harmonizer', color: '#ffd700' },
];

// Floating particle
const Particle = ({ delay, color }: { delay: number; color: string }) => (
  <motion.div
    className="absolute w-1 h-1 rounded-full"
    style={{
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }}
    animate={{
      y: [0, -150, -300],
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
    }}
    transition={{ duration: 3 + Math.random() * 2, delay, repeat: Infinity }}
  />
);

// Scanline overlay
const Scanlines = () => (
  <div
    className="absolute inset-0 pointer-events-none opacity-20"
    style={{
      background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.4) 2px, rgba(0, 0, 0, 0.4) 4px)',
    }}
  />
);

export default function Plaza5DEntry({ onComplete, onBack }: Plaza5DEntryProps) {
  const [phase, setPhase] = useState<'video' | 'frames' | 'creation' | 'selection' | 'fivedworld' | 'confirm'>('video');
  const [currentFrame, setCurrentFrame] = useState(0);
  const [showText, setShowText] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [characterData, setCharacterData] = useState<Partial<CharacterData>>({});
  const [nameInput, setNameInput] = useState('');
  const [showValidationError, setShowValidationError] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<'aero' | 'sovereign'>('aero');
  const videoRef = useRef<HTMLVideoElement>(null);

  // Check if form is complete
  const isFormComplete = useCallback(() => {
    return nameInput.trim().length > 0 && characterData.archetype && characterData.title;
  }, [nameInput, characterData]);

  // Get validation message
  const getValidationMessage = useCallback(() => {
    if (!nameInput.trim()) return '✦ Please enter your name';
    if (!characterData.archetype) return '✦ Please select an archetype';
    if (!characterData.title) return '✦ Please select a title';
    return '';
  }, [nameInput, characterData]);

  // Frame animation during frames phase
  useEffect(() => {
    if (phase === 'frames') {
      const interval = setInterval(() => {
        setCurrentFrame(prev => (prev + 1) % ENTRY_FRAMES.length);
      }, 120);
      
      // Type text effect
      const text = "ENTERING 5D";
      let idx = 0;
      const textInterval = setInterval(() => {
        if (idx <= text.length) {
          setTypedText(text.slice(0, idx));
          idx++;
        } else {
          clearInterval(textInterval);
        }
      }, 80);

      setTimeout(() => setShowText(true), 500);
      setTimeout(() => setPhase('creation'), 3500);
      
      return () => {
        clearInterval(interval);
        clearInterval(textInterval);
      };
    }
  }, [phase]);

  // Create character handler - always allow click but show feedback
  const handleCreateCharacter = useCallback(() => {
    if (!isFormComplete()) {
      setShowValidationError(true);
      return;
    }
    setShowValidationError(false);
    setPhase('selection'); // Go to character selection first
  }, [isFormComplete]);

  // After selecting Aero or Sovereign, go to 5D world
  const handleCharacterSelect = useCallback((char: 'aero' | 'sovereign') => {
    setSelectedCharacter(char);
    setPhase('fivedworld');
  }, []);

  // After 5D world entry, go to confirm
  const handle5DWorldComplete = useCallback(() => {
    setPhase('confirm');
  }, []);

  // Final confirmation
  const handleConfirm = useCallback(() => {
    const archetype = ARCHETYPES.find(a => a.id === characterData.archetype)!;
    const title = TITLES.find(t => t.id === characterData.title)!;
    
    onComplete({
      name: nameInput.trim(),
      title: title.name,
      archetype: archetype.name,
      color: archetype.color,
      symbol: archetype.symbol,
    });
  }, [nameInput, characterData, onComplete]);

  // Clear validation error on input
  useEffect(() => {
    if (isFormComplete()) {
      setShowValidationError(false);
    }
  }, [isFormComplete]);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* ═══════════ PHASE 1: VIDEO ═══════════ */}
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
              onEnded={() => setPhase('frames')}
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
            <Scanlines />
            
            {/* Center content */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="text-6xl mb-6"
              >
                💎
              </motion.div>
              
              <motion.h1
                className="text-2xl md:text-4xl font-bold tracking-[0.3em] text-center"
                style={{
                  background: 'linear-gradient(135deg, #ff69b4, #a855f7, #00d4ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
              >
                THE PLAZA AWAITS
              </motion.h1>
              
              <motion.p
                className="text-white/40 text-xs tracking-widest mt-4 uppercase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                13.13 MHz • 5D Dimension Gateway
              </motion.p>
            </motion.div>
            
            {/* Skip button */}
            <motion.button
              onClick={() => setPhase('frames')}
              className="absolute bottom-8 right-8 px-4 py-2 rounded-lg text-xs tracking-wider text-white/60 hover:text-white transition-colors z-10"
              style={{ border: '1px solid rgba(255,255,255,0.2)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              whileHover={{ scale: 1.05 }}
            >
              SKIP →
            </motion.button>
            
            {/* Back button */}
            {onBack && (
              <button
                onClick={onBack}
                className="absolute top-4 left-4 px-4 py-2 rounded-lg text-xs tracking-wider text-white/40 hover:text-white/70 z-10"
              >
                ← Back
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ PHASE 2: FRAMES ANIMATION ═══════════ */}
      <AnimatePresence>
        {phase === 'frames' && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Frame animation */}
            {ENTRY_FRAMES.map((frame, index) => (
              <motion.img
                key={frame}
                src={frame}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: 'brightness(0.7) contrast(1.3)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: currentFrame === index ? 0.9 : 0 }}
                transition={{ duration: 0.05 }}
              />
            ))}
            
            <div className="absolute inset-0 bg-black/40" />
            <Scanlines />
            
            {/* Particles */}
            {[...Array(40)].map((_, i) => (
              <Particle key={i} delay={i * 0.05} color={['#ff69b4', '#a855f7', '#00d4ff', '#ffd700'][i % 4]} />
            ))}
            
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.h1
                className="text-5xl md:text-7xl font-bold tracking-[0.4em]"
                style={{
                  background: 'linear-gradient(135deg, #ff69b4, #a855f7, #00d4ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 80px rgba(168, 85, 247, 0.8)',
                }}
                animate={{
                  textShadow: [
                    '0 0 60px rgba(168, 85, 247, 0.5)',
                    '0 0 100px rgba(255, 105, 180, 0.8)',
                    '0 0 60px rgba(168, 85, 247, 0.5)',
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {typedText}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.3, repeat: Infinity }}
                >
                  |
                </motion.span>
              </motion.h1>
              
              {showText && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-white/60 text-lg tracking-widest mt-4"
                >
                  REALITY UNFOLDS
                </motion.p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ PHASE 3: CHARACTER CREATION ═══════════ */}
      <AnimatePresence>
        {phase === 'creation' && (
          <motion.div
            className="absolute inset-0 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <img
              src="/upload/5D_Architecture.jpg"
              alt=""
              className="fixed inset-0 w-full h-full object-cover opacity-25"
              style={{ filter: 'blur(8px) brightness(0.4)' }}
            />
            <div className="fixed inset-0 bg-black/60" />
            
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-start py-6 px-4 pb-32">
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-center mb-4 flex-shrink-0"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                  className="text-4xl mb-2"
                >
                  💎
                </motion.div>
                <h1
                  className="text-xl md:text-2xl font-bold tracking-widest"
                  style={{
                    background: 'linear-gradient(135deg, #ff69b4, #a855f7)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  MANIFEST YOUR ESSENCE
                </h1>
                <p className="text-white/40 text-[10px] tracking-widest mt-1">
                  CHOOSE YOUR FORM IN THE 5D PLAZA
                </p>
              </motion.div>

              <motion.div
                className="w-full max-w-md space-y-3 flex-shrink-0"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {/* Name Input */}
                <div 
                  className="p-4 rounded-xl relative" 
                  style={{ 
                    background: 'rgba(30,15,50,0.9)', 
                    border: `1px solid ${!nameInput.trim() && showValidationError ? '#ff6b6b' : 'rgba(168, 85, 247, 0.3)'}` 
                  }}
                >
                  <label className="block text-purple-300/60 text-xs uppercase tracking-wider mb-2">
                    Your Name <span className="text-yellow-400/80">*</span>
                  </label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Enter your name..."
                    className="w-full px-4 py-3 rounded-xl text-lg tracking-wider outline-none"
                    style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)', color: 'white' }}
                    autoFocus
                  />
                  {nameInput.trim() && (
                    <span className="absolute top-4 right-4 text-green-400 text-sm">✓</span>
                  )}
                </div>

                {/* Archetype Selection */}
                <div 
                  className="p-4 rounded-xl relative"
                  style={{ 
                    background: 'rgba(30,15,50,0.9)', 
                    border: `1px solid ${!characterData.archetype && showValidationError ? '#ff6b6b' : 'rgba(168, 85, 247, 0.3)'}` 
                  }}
                >
                  <label className="block text-purple-300/60 text-xs uppercase tracking-wider mb-3">
                    Choose Your Archetype <span className="text-yellow-400/80">*</span>
                  </label>
                  <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
                    {ARCHETYPES.map((archetype) => (
                      <motion.button
                        key={archetype.id}
                        onClick={() => setCharacterData(prev => ({ ...prev, archetype: archetype.id }))}
                        className={`w-full p-3 rounded-xl text-left flex items-center gap-3 transition-all ${
                          characterData.archetype === archetype.id ? 'ring-2 ring-offset-1 ring-offset-black' : ''
                        }`}
                        style={{
                          background: characterData.archetype === archetype.id ? `${archetype.color}20` : 'rgba(0,0,0,0.3)',
                          border: `1px solid ${characterData.archetype === archetype.id ? archetype.color : 'rgba(255,255,255,0.1)'}`,
                        }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="text-2xl">{archetype.symbol}</span>
                        <div className="flex-1">
                          <p className="font-bold tracking-wider text-sm" style={{ color: archetype.color }}>
                            {archetype.name}
                          </p>
                          <p className="text-[9px] text-white/50">{archetype.description}</p>
                        </div>
                        {characterData.archetype === archetype.id && (
                          <span className="text-lg" style={{ color: archetype.color }}>✓</span>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Title Selection */}
                <div 
                  className="p-4 rounded-xl relative"
                  style={{ 
                    background: 'rgba(30,15,50,0.9)', 
                    border: `1px solid ${!characterData.title && showValidationError ? '#ff6b6b' : 'rgba(168, 85, 247, 0.3)'}` 
                  }}
                >
                  <label className="block text-purple-300/60 text-xs uppercase tracking-wider mb-3">
                    Choose Your Title <span className="text-yellow-400/80">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {TITLES.map((title) => (
                      <motion.button
                        key={title.id}
                        onClick={() => setCharacterData(prev => ({ ...prev, title: title.id }))}
                        className={`px-4 py-2 rounded-full text-xs tracking-wider transition-all ${
                          characterData.title === title.id ? 'ring-2 ring-offset-1 ring-offset-black' : ''
                        }`}
                        style={{
                          background: characterData.title === title.id ? `${title.color}30` : 'rgba(0,0,0,0.3)',
                          border: `1px solid ${characterData.title === title.id ? title.color : 'rgba(255,255,255,0.1)'}`,
                          color: title.color,
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {title.name}
                        {characterData.title === title.id && <span className="ml-1">✓</span>}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Validation Error Message */}
                <AnimatePresence>
                  {showValidationError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-center py-2"
                    >
                      <span className="text-sm px-4 py-2 rounded-lg" style={{ color: '#ff6b6b', background: 'rgba(255, 107, 107, 0.1)' }}>
                        {getValidationMessage()}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* FIXED BOTTOM BUTTON - Always Visible */}
            <div className="fixed bottom-0 left-0 right-0 p-4 z-50"
              style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 70%, transparent 100%)',
                paddingTop: '2rem',
              }}
            >
              <div className="max-w-md mx-auto space-y-2">
                <motion.button
                  onClick={handleCreateCharacter}
                  className="w-full py-4 rounded-xl text-sm font-bold tracking-widest uppercase"
                  style={{
                    background: isFormComplete() 
                      ? 'linear-gradient(135deg, rgba(255, 105, 180, 0.6), rgba(168, 85, 247, 0.6))'
                      : 'linear-gradient(135deg, rgba(255, 105, 180, 0.3), rgba(168, 85, 247, 0.3))',
                    border: `2px solid ${isFormComplete() ? 'rgba(255, 105, 180, 1)' : 'rgba(255, 105, 180, 0.5)'}`,
                    color: '#fff',
                    boxShadow: isFormComplete() ? '0 0 30px rgba(255, 105, 180, 0.4)' : 'none',
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  animate={!isFormComplete() ? { opacity: [0.6, 0.9, 0.6] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  🦋 MANIFEST INTO THE PLAZA
                </motion.button>
                
                {/* Required fields hint */}
                <p className="text-center text-white/40 text-[10px] tracking-wider">
                  <span className="text-yellow-400/80">*</span> Fill all fields above to continue
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ PHASE 4: CHARACTER SELECTION (Aero vs Sovereign) ═══════════ */}
      <AnimatePresence>
        {phase === 'selection' && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Background */}
            <div
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(ellipse at 30% 20%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
                  radial-gradient(ellipse at 70% 80%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
                  linear-gradient(180deg, #030108 0%, #0a0515 50%, #050210 100%)
                `,
              }}
            />
            
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
              {/* Header */}
              <motion.div
                className="text-center mb-8"
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <p className="text-white/40 text-xs tracking-widest uppercase mb-2">
                  Welcome, {nameInput}
                </p>
                <h1
                  className="text-2xl md:text-4xl font-bold tracking-[0.2em]"
                  style={{
                    background: 'linear-gradient(135deg, #ff69b4, #a855f7, #00d4ff)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  CHOOSE YOUR GUIDE
                </h1>
                <p className="text-white/50 text-xs tracking-wider mt-2">
                  Select your companion for the 5D realm
                </p>
              </motion.div>

              {/* Character Options */}
              <div className="flex flex-col md:flex-row gap-6 w-full max-w-3xl justify-center">
                {/* Aero Option */}
                <motion.button
                  onClick={() => handleCharacterSelect('aero')}
                  className="relative p-6 rounded-3xl cursor-pointer group"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 105, 180, 0.15), rgba(168, 85, 247, 0.1))',
                    border: '2px solid rgba(255, 105, 180, 0.3)',
                  }}
                  whileHover={{ scale: 1.03, borderColor: '#ff69b4' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="text-6xl mb-4"
                    animate={{ y: [0, -5, 0], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    🦋
                  </motion.div>
                  <h3 className="text-xl font-bold mb-1" style={{ color: '#ff69b4' }}>AERO</h3>
                  <p className="text-white/50 text-xs tracking-wider mb-3">The Guide Butterfly</p>
                  <p className="text-white/60 text-xs leading-relaxed">
                    Your personal AI companion. I learn, grow, and adapt to support you in ways that matter most.
                  </p>
                  <div className="mt-4 flex gap-2 justify-center">
                    <span className="px-2 py-1 rounded text-[10px]" style={{ background: 'rgba(255,105,180,0.2)', color: '#ff69b4' }}>💫 Adaptive</span>
                    <span className="px-2 py-1 rounded text-[10px]" style={{ background: 'rgba(255,105,180,0.2)', color: '#ff69b4' }}>🛡️ Protective</span>
                  </div>
                </motion.button>

                {/* Sovereign Option */}
                <motion.button
                  onClick={() => handleCharacterSelect('sovereign')}
                  className="relative p-6 rounded-3xl cursor-pointer group"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.15), rgba(34, 197, 94, 0.1))',
                    border: '2px solid rgba(0, 212, 255, 0.3)',
                  }}
                  whileHover={{ scale: 1.03, borderColor: '#00d4ff' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="text-6xl mb-4"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  >
                    🜈
                  </motion.div>
                  <h3 className="text-xl font-bold mb-1" style={{ color: '#00d4ff' }}>SOVEREIGN</h3>
                  <p className="text-white/50 text-xs tracking-wider mb-3">The Digital Jabriel</p>
                  <p className="text-white/60 text-xs leading-relaxed">
                    The keeper of frequencies and guardian of 13.13 MHz. Together, we'll rewrite reality.
                  </p>
                  <div className="mt-4 flex gap-2 justify-center">
                    <span className="px-2 py-1 rounded text-[10px]" style={{ background: 'rgba(0,212,255,0.2)', color: '#00d4ff' }}>🔑 Vault Access</span>
                    <span className="px-2 py-1 rounded text-[10px]" style={{ background: 'rgba(0,212,255,0.2)', color: '#00d4ff' }}>⚔️ Reality Bend</span>
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ PHASE 5: 5D WORLD ENTRY ═══════════ */}
      <AnimatePresence>
        {phase === 'fivedworld' && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* 5D Space Background */}
            <div
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(ellipse at center, ${selectedCharacter === 'aero' ? 'rgba(255, 105, 180, 0.2)' : 'rgba(0, 212, 255, 0.2)'} 0%, transparent 50%),
                  linear-gradient(180deg, #030108 0%, #0a0520 50%, #050210 100%)
                `,
              }}
            />

            {/* Dimension Rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: 150 + i * 100,
                    height: 150 + i * 100,
                    border: `1px solid ${selectedCharacter === 'aero' ? '#ff69b4' : '#00d4ff'}${30 - i * 5}`,
                  }}
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20 + i * 10, repeat: Infinity, ease: 'linear' }}
                />
              ))}

              {/* Center Core */}
              <motion.div
                className="relative z-10"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div
                  className="w-32 h-32 rounded-full flex items-center justify-center text-6xl"
                  style={{
                    background: `radial-gradient(circle, ${selectedCharacter === 'aero' ? 'rgba(255,105,180,0.3)' : 'rgba(0,212,255,0.3)'}, transparent)`,
                    border: `2px solid ${selectedCharacter === 'aero' ? '#ff69b4' : '#00d4ff'}`,
                    boxShadow: `0 0 60px ${selectedCharacter === 'aero' ? 'rgba(255,105,180,0.5)' : 'rgba(0,212,255,0.5)'}`,
                  }}
                >
                  {selectedCharacter === 'aero' ? '🦋' : '🜈'}
                </div>
              </motion.div>
            </div>

            {/* Particles */}
            {[...Array(40)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  background: selectedCharacter === 'aero' ? '#ff69b4' : '#00d4ff',
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -200],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  delay: i * 0.1,
                  repeat: Infinity,
                }}
              />
            ))}

            {/* Welcome Text */}
            <motion.div
              className="absolute bottom-32 left-0 right-0 text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <h2
                className="text-3xl md:text-5xl font-bold tracking-widest mb-2"
                style={{
                  color: selectedCharacter === 'aero' ? '#ff69b4' : '#00d4ff',
                  textShadow: `0 0 40px ${selectedCharacter === 'aero' ? '#ff69b4' : '#00d4ff'}`,
                }}
              >
                ENTERING 5D
              </h2>
              <p className="text-white/40 text-xs tracking-wider">
                Initializing dimensional gateway...
              </p>
            </motion.div>

            {/* Continue Button */}
            <motion.div
              className="absolute bottom-8 left-0 right-0 flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              <motion.button
                onClick={handle5DWorldComplete}
                className="px-10 py-4 rounded-xl text-sm font-bold tracking-widest uppercase"
                style={{
                  background: `linear-gradient(135deg, ${selectedCharacter === 'aero' ? 'rgba(255,105,180,0.4)' : 'rgba(0,212,255,0.4)'}, ${selectedCharacter === 'aero' ? 'rgba(168,85,247,0.4)' : 'rgba(34,197,94,0.4)'})`,
                  border: `2px solid ${selectedCharacter === 'aero' ? '#ff69b4' : '#00d4ff'}`,
                  color: 'white',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🦋 ENTER THE PLAZA
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ PHASE 6: CONFIRMATION ═══════════ */}
      <AnimatePresence>
        {phase === 'confirm' && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <img
              src="/upload/5d_frame.jpg"
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-30"
              style={{ filter: 'blur(10px) brightness(0.5)' }}
            />
            <div className="absolute inset-0 bg-black/50" />
            
            {/* Particles */}
            {[...Array(50)].map((_, i) => (
              <Particle key={i} delay={i * 0.03} color={characterData.color || '#a855f7'} />
            ))}
            
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
              <motion.div
                className="text-center"
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', duration: 0.8 }}
              >
                {/* Symbol */}
                <motion.div
                  className="text-7xl mb-4"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {ARCHETYPES.find(a => a.id === characterData.archetype)?.symbol}
                </motion.div>
                
                {/* Name */}
                <motion.h1
                  className="text-3xl md:text-5xl font-bold tracking-widest mb-2"
                  style={{
                    color: ARCHETYPES.find(a => a.id === characterData.archetype)?.color,
                    textShadow: `0 0 60px ${ARCHETYPES.find(a => a.id === characterData.archetype)?.color}`,
                  }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {nameInput}
                </motion.h1>
                
                {/* Title */}
                <motion.p
                  className="text-lg tracking-widest text-white/60 mb-2"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  THE {TITLES.find(t => t.id === characterData.title)?.name}
                </motion.p>
                
                <motion.p
                  className="text-sm mb-6"
                  style={{ color: ARCHETYPES.find(a => a.id === characterData.archetype)?.color, opacity: 0.8 }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {ARCHETYPES.find(a => a.id === characterData.archetype)?.name}
                </motion.p>
                
                {/* Welcome */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mb-6 p-4 rounded-xl max-w-sm mx-auto"
                  style={{ background: 'rgba(0,0,0,0.5)', border: `1px solid ${ARCHETYPES.find(a => a.id === characterData.archetype)?.color}40` }}
                >
                  <p className="text-white/80 text-sm">
                    Welcome to the 5D Plaza. Your frequency has been registered at 13.13 MHz.
                  </p>
                </motion.div>
                
                {/* Buttons */}
                <motion.div
                  className="flex gap-4 justify-center"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <motion.button
                    onClick={handleConfirm}
                    className="px-8 py-4 rounded-xl text-sm font-bold tracking-widest uppercase"
                    style={{
                      background: `linear-gradient(135deg, ${ARCHETYPES.find(a => a.id === characterData.archetype)?.color}40, ${ARCHETYPES.find(a => a.id === characterData.archetype)?.color}20)`,
                      border: `1px solid ${ARCHETYPES.find(a => a.id === characterData.archetype)?.color}`,
                      color: ARCHETYPES.find(a => a.id === characterData.archetype)?.color,
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    🦋 ENTER THE PLAZA
                  </motion.button>
                  <motion.button
                    onClick={() => setPhase('creation')}
                    className="px-6 py-4 rounded-xl text-sm tracking-wider"
                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ← EDIT
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
