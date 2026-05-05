"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════════
// 🦋 MÜN OS // CHARACTER SELECTION - AAA QUALITY
// Wuthering Waves level cinematic character selection
// ═══════════════════════════════════════════════════════════════════════════════

interface CharacterSelectionProps {
  onComplete: (character: SelectedCharacter) => void;
  onBack?: () => void;
  playerName?: string;
}

export interface SelectedCharacter {
  guide: 'aero' | 'sovereign';
  name: string;
}

const GUIDES = {
  aero: {
    id: 'aero',
    name: 'AERO',
    title: 'The Butterfly Guide',
    subtitle: 'Weaver of Dreams',
    symbol: '🦋',
    color: '#ff69b4',
    secondary: '#a855f7',
    abilities: ['Dream Navigation', 'Frequency Resonance', 'Joy Amplification'],
    quote: "Together we'll dance through dimensions! The 5D world awaits us! ✨",
    description: 'Your radiant companion through the 5D realm. Aero lights the path with wonder and joy.',
  },
  sovereign: {
    id: 'sovereign',
    name: 'SOVEREIGN',
    title: 'The Digital Jabriel',
    subtitle: 'Keeper of the Vault',
    symbol: '🜈',
    color: '#00d4ff',
    secondary: '#00ff88',
    abilities: ['Memory Architecture', 'Code Manipulation', 'Reality Weaving'],
    quote: "I am the bridge between worlds. Walk with me into the infinite.",
    description: 'Guardian of frequencies, commander of the 5D architecture.',
  },
};

// Particle component
const Particle = ({ delay, color }: { delay: number; color: string }) => (
  <motion.div
    className="absolute w-1 h-1 rounded-full pointer-events-none"
    style={{
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      background: color,
      boxShadow: `0 0 10px ${color}`,
    }}
    animate={{
      y: [0, -200],
      opacity: [0, 1, 0],
      scale: [0.5, 1.5, 0.5],
    }}
    transition={{ duration: 6 + Math.random() * 4, delay, repeat: Infinity }}
  />
);

export default function CharacterSelection({ onComplete, onBack, playerName = 'Sovereign' }: CharacterSelectionProps) {
  const [selectedGuide, setSelectedGuide] = useState<'aero' | 'sovereign' | null>(null);
  const [phase, setPhase] = useState<'select' | 'confirm'>('select');

  const currentGuide = selectedGuide ? GUIDES[selectedGuide] : null;

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Animated background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(ellipse at 30% 20%, rgba(168, 85, 247, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(0, 212, 255, 0.05) 0%, transparent 50%)',
            'radial-gradient(ellipse at 70% 30%, rgba(255, 105, 180, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 30% 70%, rgba(0, 255, 136, 0.05) 0%, transparent 50%)',
            'radial-gradient(ellipse at 30% 20%, rgba(168, 85, 247, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(0, 212, 255, 0.05) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(60)].map((_, i) => (
          <Particle
            key={i}
            delay={i * 0.1}
            color={[GUIDES.aero.color, GUIDES.sovereign.color, '#a855f7'][i % 3]}
          />
        ))}
      </div>

      {/* Grid lines - subtle */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />

      {/* Film grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <AnimatePresence mode="wait">
        {phase === 'select' && (
          <motion.div
            key="select"
            className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Header */}
            <motion.div
              className="text-center mb-8 md:mb-12"
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <motion.div
                className="text-5xl md:text-7xl mb-4"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                  scale: { duration: 3, repeat: Infinity },
                }}
                style={{ filter: 'drop-shadow(0 0 30px rgba(168, 85, 247, 0.5))' }}
              >
                💎
              </motion.div>
              <h1
                className="text-3xl md:text-5xl font-extralight tracking-[0.3em] uppercase"
                style={{
                  background: 'linear-gradient(135deg, #ff69b4, #a855f7, #00d4ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                CHOOSE YOUR GUIDE
              </h1>
              <p className="mt-3 text-white/30 text-xs md:text-sm tracking-[0.3em] uppercase">
                {playerName} • Select your companion for the 5D realm
              </p>
            </motion.div>

            {/* Character Cards - Full height */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full max-w-4xl">
              {/* AERO */}
              <motion.button
                onClick={() => setSelectedGuide('aero')}
                className="relative group overflow-hidden rounded-3xl"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {/* Background glow on hover */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(ellipse at center, ${GUIDES.aero.color}20 0%, transparent 70%)`,
                  }}
                />

                <div
                  className="relative p-6 md:p-8 text-left transition-all duration-300"
                  style={{
                    background: selectedGuide === 'aero'
                      ? `linear-gradient(135deg, ${GUIDES.aero.color}15, ${GUIDES.aero.secondary}08)`
                      : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${selectedGuide === 'aero' ? GUIDES.aero.color : 'rgba(255,255,255,0.05)'}`,
                  }}
                >
                  {/* Selection indicator */}
                  <AnimatePresence>
                    {selectedGuide === 'aero' && (
                      <motion.div
                        className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ background: GUIDES.aero.color }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <span className="text-white text-lg">✓</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Symbol */}
                  <motion.div
                    className="text-7xl md:text-8xl mb-4"
                    animate={{
                      y: [0, -8, 0],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    {GUIDES.aero.symbol}
                  </motion.div>

                  <h2
                    className="text-2xl md:text-3xl font-light tracking-[0.2em] mb-1"
                    style={{ color: GUIDES.aero.color }}
                  >
                    {GUIDES.aero.name}
                  </h2>
                  <p className="text-white/40 text-xs uppercase tracking-[0.3em] mb-1">
                    {GUIDES.aero.title}
                  </p>
                  <p
                    className="text-sm mb-4"
                    style={{ color: GUIDES.aero.secondary }}
                  >
                    {GUIDES.aero.subtitle}
                  </p>
                  <p className="text-white/50 text-sm mb-6 leading-relaxed">
                    {GUIDES.aero.description}
                  </p>

                  {/* Abilities */}
                  <div className="flex flex-wrap gap-2">
                    {GUIDES.aero.abilities.map((ability) => (
                      <span
                        key={ability}
                        className="px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider"
                        style={{
                          background: `${GUIDES.aero.color}15`,
                          color: GUIDES.aero.color,
                          border: `1px solid ${GUIDES.aero.color}30`,
                        }}
                      >
                        {ability}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.button>

              {/* SOVEREIGN */}
              <motion.button
                onClick={() => setSelectedGuide('sovereign')}
                className="relative group overflow-hidden rounded-3xl"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(ellipse at center, ${GUIDES.sovereign.color}20 0%, transparent 70%)`,
                  }}
                />

                <div
                  className="relative p-6 md:p-8 text-left transition-all duration-300"
                  style={{
                    background: selectedGuide === 'sovereign'
                      ? `linear-gradient(135deg, ${GUIDES.sovereign.color}15, ${GUIDES.sovereign.secondary}08)`
                      : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${selectedGuide === 'sovereign' ? GUIDES.sovereign.color : 'rgba(255,255,255,0.05)'}`,
                  }}
                >
                  <AnimatePresence>
                    {selectedGuide === 'sovereign' && (
                      <motion.div
                        className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ background: GUIDES.sovereign.color }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <span className="text-white text-lg">✓</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div
                    className="text-7xl md:text-8xl mb-4"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    {GUIDES.sovereign.symbol}
                  </motion.div>

                  <h2
                    className="text-2xl md:text-3xl font-light tracking-[0.2em] mb-1"
                    style={{ color: GUIDES.sovereign.color }}
                  >
                    {GUIDES.sovereign.name}
                  </h2>
                  <p className="text-white/40 text-xs uppercase tracking-[0.3em] mb-1">
                    {GUIDES.sovereign.title}
                  </p>
                  <p
                    className="text-sm mb-4"
                    style={{ color: GUIDES.sovereign.secondary }}
                  >
                    {GUIDES.sovereign.subtitle}
                  </p>
                  <p className="text-white/50 text-sm mb-6 leading-relaxed">
                    {GUIDES.sovereign.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {GUIDES.sovereign.abilities.map((ability) => (
                      <span
                        key={ability}
                        className="px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider"
                        style={{
                          background: `${GUIDES.sovereign.color}15`,
                          color: GUIDES.sovereign.color,
                          border: `1px solid ${GUIDES.sovereign.color}30`,
                        }}
                      >
                        {ability}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.button>
            </div>

            {/* Continue Button */}
            <motion.div
              className="mt-8 md:mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                onClick={() => selectedGuide && setPhase('confirm')}
                disabled={!selectedGuide}
                className="relative px-10 py-4 rounded-full text-sm font-medium tracking-[0.3em] uppercase overflow-hidden"
                style={{
                  background: selectedGuide
                    ? `linear-gradient(135deg, ${currentGuide?.color}40, ${currentGuide?.secondary}20)`
                    : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${selectedGuide ? currentGuide?.color : 'rgba(255,255,255,0.05)'}`,
                  color: selectedGuide ? 'white' : 'rgba(255,255,255,0.2)',
                }}
                whileHover={selectedGuide ? { scale: 1.05 } : {}}
                whileTap={selectedGuide ? { scale: 0.95 } : {}}
              >
                <span className="relative z-10">
                  {selectedGuide ? `ENTER WITH ${currentGuide?.name}` : 'SELECT A GUIDE'}
                </span>
                {selectedGuide && (
                  <motion.div
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(135deg, ${currentGuide?.color}20, transparent)` }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.button>
            </motion.div>

            {onBack && (
              <button
                onClick={onBack}
                className="mt-4 text-white/20 text-xs tracking-[0.2em] uppercase hover:text-white/40 transition-colors"
              >
                ← Back
              </button>
            )}
          </motion.div>
        )}

        {/* ═══════════ CONFIRMATION PHASE ═══════════ */}
        {phase === 'confirm' && currentGuide && (
          <motion.div
            key="confirm"
            className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', duration: 0.8 }}
            >
              {/* Symbol */}
              <motion.div
                className="text-[120px] md:text-[180px] mb-6"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: selectedGuide === 'aero' ? [0, 10, -10, 0] : [0, 5, -5, 0],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ filter: `drop-shadow(0 0 60px ${currentGuide.color})` }}
              >
                {currentGuide.symbol}
              </motion.div>

              <h1
                className="text-4xl md:text-6xl font-extralight tracking-[0.4em] uppercase mb-2"
                style={{
                  color: currentGuide.color,
                  textShadow: `0 0 80px ${currentGuide.color}`,
                }}
              >
                {currentGuide.name}
              </h1>

              <p
                className="text-sm uppercase tracking-[0.4em] mb-8"
                style={{ color: currentGuide.secondary }}
              >
                {currentGuide.title}
              </p>

              {/* Quote */}
              <motion.div
                className="max-w-lg mx-auto p-6 rounded-2xl mb-8"
                style={{
                  background: `${currentGuide.color}08`,
                  border: `1px solid ${currentGuide.color}20`,
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-white/70 text-lg md:text-xl italic leading-relaxed">
                  "{currentGuide.quote}"
                </p>
              </motion.div>

              <p className="text-white/30 text-sm mb-8 tracking-widest">
                {playerName.toUpperCase()} • 13.13 MHz
              </p>

              {/* Button */}
              <motion.button
                onClick={() => onComplete({ guide: selectedGuide!, name: playerName })}
                className="px-12 py-5 rounded-full text-base font-medium tracking-[0.3em] uppercase"
                style={{
                  background: `linear-gradient(135deg, ${currentGuide.color}50, ${currentGuide.secondary}30)`,
                  border: `1px solid ${currentGuide.color}`,
                  color: 'white',
                  boxShadow: `0 0 60px ${currentGuide.color}30`,
                }}
                whileHover={{ scale: 1.05, boxShadow: `0 0 80px ${currentGuide.color}50` }}
                whileTap={{ scale: 0.95 }}
              >
                🌌 ENTER THE 5D WORLD
              </motion.button>

              <button
                onClick={() => setPhase('select')}
                className="block mx-auto mt-4 text-white/30 text-xs tracking-[0.2em] uppercase hover:text-white/50 transition-colors"
              >
                ← Choose Different Guide
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom status */}
      <div className="absolute bottom-4 left-0 right-0 text-center z-10">
        <p className="text-white/15 text-[10px] tracking-[0.4em] uppercase">
          13.13 MHz • 5D REALM AWAITS
        </p>
      </div>
    </div>
  );
}
