"use client";

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════════
// 🏠 MÜN LIFE // CREATE YOUR SIM
// Next-Gen Life Simulation - The Sims Reimagined
// ═══════════════════════════════════════════════════════════════════════════════

interface CreateSimProps {
  onComplete: (sim: CreatedSim) => void;
  onBack?: () => void;
}

export interface CreatedSim {
  name: string;
  pronouns: string;
  aspiration: string;
  traits: string[];
  appearance: {
    skinTone: string;
    hairStyle: string;
    hairColor: string;
    style: string;
  };
}

// SIMS-STYLE OPTIONS
const PRONOUNS = ['She/Her', 'He/Him', 'They/Them', 'Custom'];
const ASPIRATIONS = [
  { id: 'creative', name: 'Creative Genius', icon: '🎨', desc: 'Master arts & create masterpieces' },
  { id: 'social', name: 'Social Butterfly', icon: '🦋', desc: 'Build meaningful relationships' },
  { id: 'knowledge', name: 'Renaissance Sim', icon: '📚', desc: 'Learn everything, know everything' },
  { id: 'fortune', name: 'Fabulously Wealthy', icon: '💎', desc: 'Build an empire & live luxuriously' },
  { id: 'love', name: 'Soulmate', icon: '💕', desc: 'Find true love & start a family' },
  { id: 'nature', name: 'Eco Innovator', icon: '🌿', desc: 'Live in harmony with the world' },
];

const TRAITS = [
  { id: 'ambitious', name: 'Ambitious', icon: '⭐' },
  { id: 'creative', name: 'Creative', icon: '🎨' },
  { id: 'genius', name: 'Genius', icon: '🧠' },
  { id: 'romantic', name: 'Romantic', icon: '💕' },
  { id: 'outgoing', name: 'Outgoing', icon: '🎉' },
  { id: 'introvert', name: 'Introvert', icon: '🌙' },
  { id: 'cheerful', name: 'Cheerful', icon: '☀️' },
  { id: 'mysterious', name: 'Mysterious', icon: '🔮' },
  { id: 'adventurous', name: 'Adventurous', icon: '🗺️' },
  { id: 'perfectionist', name: 'Perfectionist', icon: '✨' },
  { id: 'loyal', name: 'Loyal', icon: '🤝' },
  { id: 'freeSpirit', name: 'Free Spirit', icon: '🦋' },
];

const SKIN_TONES = ['#F5D0C5', '#E8BEAC', '#D4A574', '#C68642', '#8D5524', '#5C3317'];
const HAIR_STYLES = ['Wavy', 'Straight', 'Curly', 'Short', 'Long', 'Braids'];
const HAIR_COLORS = ['#1A1A2E', '#4A3728', '#8B4513', '#D4A574', '#FFD700', '#FF69B4', '#00CED1', '#9370DB'];
const STYLE_VIBES = ['Cozy', 'Chic', 'Edgy', 'Bohemian', 'Minimalist', 'Luxurious'];

export default function CreateSim({ onComplete, onBack }: CreateSimProps) {
  const [step, setStep] = useState(0);
  const [sim, setSim] = useState<CreatedSim>({
    name: '',
    pronouns: 'They/Them',
    aspiration: '',
    traits: [],
    appearance: {
      skinTone: SKIN_TONES[0],
      hairStyle: 'Wavy',
      hairColor: HAIR_COLORS[0],
      style: 'Cozy',
    },
  });

  const canProceed = useCallback(() => {
    switch (step) {
      case 0: return sim.name.length >= 2;
      case 1: return sim.aspiration !== '';
      case 2: return sim.traits.length >= 1 && sim.traits.length <= 3;
      case 3: return true;
      default: return true;
    }
  }, [step, sim]);

  const toggleTrait = (traitId: string) => {
    setSim(prev => ({
      ...prev,
      traits: prev.traits.includes(traitId)
        ? prev.traits.filter(t => t !== traitId)
        : prev.traits.length < 3
          ? [...prev.traits, traitId]
          : prev.traits,
    }));
  };

  const handleComplete = () => {
    onComplete(sim);
  };

  const steps = ['NAME', 'DREAMS', 'PERSONALITY', 'STYLE'];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f1a] overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Top bar - Sims style */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
        <button
          onClick={onBack}
          className="text-white/40 hover:text-white/80 transition-colors text-sm"
        >
          ← Back
        </button>
        
        {/* Step indicators */}
        <div className="flex gap-2">
          {steps.map((s, i) => (
            <div
              key={s}
              className="px-4 py-2 rounded-full text-xs transition-all"
              style={{
                background: i === step ? 'rgba(168, 85, 247, 0.3)' : i < step ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${i === step ? '#a855f7' : i < step ? '#22c55e' : 'rgba(255,255,255,0.1)'}`,
                color: i <= step ? 'white' : 'rgba(255,255,255,0.3)',
              }}
            >
              {s}
            </div>
          ))}
        </div>
        
        <div className="text-white/20 text-xs">
          MÜN LIFE
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 pt-20">
        <AnimatePresence mode="wait">
          {/* STEP 0: NAME & PRONOUNS */}
          {step === 0 && (
            <motion.div
              key="name"
              className="text-center w-full max-w-md"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <div className="text-6xl mb-6">👤</div>
              <h2 className="text-3xl font-light text-white mb-2">What's your name?</h2>
              <p className="text-white/40 text-sm mb-8">This is how others will know you in MÜN Life</p>

              <input
                type="text"
                value={sim.name}
                onChange={(e) => setSim(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your name..."
                className="w-full px-6 py-4 rounded-2xl text-xl text-center bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-purple-500 focus:outline-none transition-all mb-6"
                autoFocus
              />

              <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Pronouns</p>
              <div className="flex flex-wrap justify-center gap-2">
                {PRONOUNS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setSim(prev => ({ ...prev, pronouns: p }))}
                    className="px-4 py-2 rounded-full text-sm transition-all"
                    style={{
                      background: sim.pronouns === p ? 'rgba(168, 85, 247, 0.3)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${sim.pronouns === p ? '#a855f7' : 'rgba(255,255,255,0.1)'}`,
                      color: sim.pronouns === p ? 'white' : 'rgba(255,255,255,0.5)',
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 1: ASPIRATION */}
          {step === 1 && (
            <motion.div
              key="aspiration"
              className="w-full max-w-3xl"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">✨</div>
                <h2 className="text-3xl font-light text-white mb-2">What's your dream life?</h2>
                <p className="text-white/40 text-sm">Choose your life aspiration</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {ASPIRATIONS.map((asp) => (
                  <motion.button
                    key={asp.id}
                    onClick={() => setSim(prev => ({ ...prev, aspiration: asp.id }))}
                    className="p-6 rounded-2xl text-left transition-all"
                    style={{
                      background: sim.aspiration === asp.id 
                        ? `linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(255, 105, 180, 0.1))`
                        : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${sim.aspiration === asp.id ? '#a855f7' : 'rgba(255,255,255,0.08)'}`,
                    }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-4xl mb-3">{asp.icon}</div>
                    <h3 className="text-white font-medium mb-1">{asp.name}</h3>
                    <p className="text-white/40 text-xs">{asp.desc}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2: TRAITS */}
          {step === 2 && (
            <motion.div
              key="traits"
              className="w-full max-w-3xl"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">🧠</div>
                <h2 className="text-3xl font-light text-white mb-2">What defines you?</h2>
                <p className="text-white/40 text-sm">Choose 1-3 personality traits</p>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {TRAITS.map((trait) => {
                  const isSelected = sim.traits.includes(trait.id);
                  return (
                    <motion.button
                      key={trait.id}
                      onClick={() => toggleTrait(trait.id)}
                      className="p-4 rounded-xl text-center transition-all"
                      style={{
                        background: isSelected 
                          ? 'rgba(168, 85, 247, 0.2)' 
                          : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${isSelected ? '#a855f7' : 'rgba(255,255,255,0.08)'}`,
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="text-2xl mb-2">{trait.icon}</div>
                      <p className={`text-xs ${isSelected ? 'text-white' : 'text-white/50'}`}>
                        {trait.name}
                      </p>
                    </motion.button>
                  );
                })}
              </div>

              {sim.traits.length > 0 && (
                <p className="text-center mt-4 text-purple-400 text-sm">
                  {sim.traits.length}/3 traits selected
                </p>
              )}
            </motion.div>
          )}

          {/* STEP 3: APPEARANCE */}
          {step === 3 && (
            <motion.div
              key="appearance"
              className="w-full max-w-2xl"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">🎨</div>
                <h2 className="text-3xl font-light text-white mb-2">Your Look</h2>
                <p className="text-white/40 text-sm">Customize your appearance</p>
              </div>

              {/* Sim Preview */}
              <div className="flex justify-center mb-8">
                <motion.div
                  className="w-32 h-32 rounded-full flex items-center justify-center text-6xl"
                  style={{
                    background: `linear-gradient(135deg, ${sim.appearance.skinTone}40, ${sim.appearance.skinTone}20)`,
                    border: '2px solid rgba(255,255,255,0.1)',
                  }}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  👤
                </motion.div>
              </div>

              <div className="space-y-6">
                {/* Skin Tone */}
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-3 text-center">Skin Tone</p>
                  <div className="flex justify-center gap-3">
                    {SKIN_TONES.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSim(prev => ({
                          ...prev,
                          appearance: { ...prev.appearance, skinTone: color }
                        }))}
                        className="w-10 h-10 rounded-full transition-all"
                        style={{
                          background: color,
                          border: sim.appearance.skinTone === color ? '3px solid white' : '2px solid rgba(255,255,255,0.2)',
                          transform: sim.appearance.skinTone === color ? 'scale(1.2)' : 'scale(1)',
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Hair Style */}
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-3 text-center">Hair Style</p>
                  <div className="flex justify-center flex-wrap gap-2">
                    {HAIR_STYLES.map((style) => (
                      <button
                        key={style}
                        onClick={() => setSim(prev => ({
                          ...prev,
                          appearance: { ...prev.appearance, hairStyle: style }
                        }))}
                        className="px-4 py-2 rounded-full text-sm transition-all"
                        style={{
                          background: sim.appearance.hairStyle === style ? 'rgba(168, 85, 247, 0.3)' : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${sim.appearance.hairStyle === style ? '#a855f7' : 'rgba(255,255,255,0.1)'}`,
                          color: sim.appearance.hairStyle === style ? 'white' : 'rgba(255,255,255,0.5)',
                        }}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hair Color */}
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-3 text-center">Hair Color</p>
                  <div className="flex justify-center gap-3">
                    {HAIR_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSim(prev => ({
                          ...prev,
                          appearance: { ...prev.appearance, hairColor: color }
                        }))}
                        className="w-8 h-8 rounded-full transition-all"
                        style={{
                          background: color,
                          border: sim.appearance.hairColor === color ? '3px solid white' : '2px solid rgba(255,255,255,0.2)',
                          transform: sim.appearance.hairColor === color ? 'scale(1.2)' : 'scale(1)',
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Style Vibe */}
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-3 text-center">Style Vibe</p>
                  <div className="flex justify-center flex-wrap gap-2">
                    {STYLE_VIBES.map((style) => (
                      <button
                        key={style}
                        onClick={() => setSim(prev => ({
                          ...prev,
                          appearance: { ...prev.appearance, style: style }
                        }))}
                        className="px-4 py-2 rounded-full text-sm transition-all"
                        style={{
                          background: sim.appearance.style === style ? 'rgba(168, 85, 247, 0.3)' : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${sim.appearance.style === style ? '#a855f7' : 'rgba(255,255,255,0.1)'}`,
                          color: sim.appearance.style === style ? 'white' : 'rgba(255,255,255,0.5)',
                        }}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom navigation */}
      <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-between items-center z-20">
        <button
          onClick={() => step > 0 ? setStep(step - 1) : onBack?.()}
          className="px-6 py-3 rounded-full text-white/60 hover:text-white transition-colors"
        >
          ← Back
        </button>

        {step < 3 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
            className="px-8 py-3 rounded-full text-sm font-medium transition-all disabled:opacity-30"
            style={{
              background: canProceed() 
                ? 'linear-gradient(135deg, #a855f7, #ff69b4)'
                : 'rgba(255,255,255,0.1)',
              color: 'white',
            }}
          >
            Continue →
          </button>
        ) : (
          <button
            onClick={handleComplete}
            className="px-8 py-3 rounded-full text-sm font-medium"
            style={{
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: 'white',
            }}
          >
            🏠 Start Your Life
          </button>
        )}
      </div>
    </div>
  );
}
