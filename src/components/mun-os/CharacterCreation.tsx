"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NeonButterfly from "./NeonButterfly";

// ═══════════════════════════════════════════════════════════════════════════════
// 🦋 MÜN OS // CHARACTER CREATION
// "The Vessel Awakens" - Create your digital identity
// ═══════════════════════════════════════════════════════════════════════════════

interface CharacterCreationProps {
  onComplete: (character: CreatedCharacter) => void;
  onBack?: () => void;
}

export interface CreatedCharacter {
  name: string;
  title: string;
  frequency: string;
  auraColor: string;
  essence: string[];
  butterflyType: string;
}

const AURA_COLORS = [
  { id: 'pink', name: 'Rose', color: '#ff69b4', glow: 'rgba(255, 105, 180, 0.5)' },
  { id: 'purple', name: 'Violet', color: '#a855f7', glow: 'rgba(168, 85, 247, 0.5)' },
  { id: 'cyan', name: 'Cyan', color: '#00d4ff', glow: 'rgba(0, 212, 255, 0.5)' },
  { id: 'gold', name: 'Solar', color: '#ffd700', glow: 'rgba(255, 215, 0, 0.5)' },
  { id: 'emerald', name: 'Emerald', color: '#22c55e', glow: 'rgba(34, 197, 94, 0.5)' },
  { id: 'crimson', name: 'Crimson', color: '#ff4d6d', glow: 'rgba(255, 77, 109, 0.5)' },
];

const BUTTERFLY_TYPES = [
  { id: 'monarch', name: 'Monarch', icon: '🦋', desc: 'Royal presence, natural leadership' },
  { id: 'morpho', name: 'Morpho', icon: '🦋', desc: 'Brilliant iridescence, transformative power' },
  { id: 'luna', name: 'Luna', icon: '🌙', desc: 'Mystical intuition, night wisdom' },
  { id: 'glasswing', name: 'Glasswing', icon: '✨', desc: 'Transparency, truth-seeking' },
  { id: 'swallowtail', name: 'Swallowtail', icon: '🦋', desc: 'Graceful navigation, adaptability' },
];

const ESSENCE_TRAITS = [
  { id: 'visionary', name: 'Visionary', icon: '👁️' },
  { id: 'healer', name: 'Healer', icon: '💚' },
  { id: 'creator', name: 'Creator', icon: '🎨' },
  { id: 'guardian', name: 'Guardian', icon: '🛡️' },
  { id: 'oracle', name: 'Oracle', icon: '🔮' },
  { id: 'weaver', name: 'Weaver', icon: '🕸️' },
  { id: 'alchemist', name: 'Alchemist', icon: '⚗️' },
  { id: 'sentinel', name: 'Sentinel', icon: '🦋' },
];

const TITLE_SUGGESTIONS = [
  'The Awakened',
  'of the Convergence',
  'The Sovereign',
  'of 13.13 MHz',
  'The Wanderer',
  'of the Void',
  'The Dreamer',
  'of the Echoes',
];

export default function CharacterCreation({ onComplete, onBack }: CharacterCreationProps) {
  const [step, setStep] = useState<'name' | 'aura' | 'essence' | 'butterfly' | 'finalize'>('name');
  const [character, setCharacter] = useState<CreatedCharacter>({
    name: '',
    title: '',
    frequency: '13.13',
    auraColor: 'pink',
    essence: [],
    butterflyType: 'monarch',
  });
  const [showValidationError, setShowValidationError] = useState(false);

  const selectedAura = AURA_COLORS.find(c => c.id === character.auraColor) || AURA_COLORS[0];
  const selectedButterfly = BUTTERFLY_TYPES.find(b => b.id === character.butterflyType) || BUTTERFLY_TYPES[0];

  const handleNameChange = useCallback((name: string) => {
    setCharacter(prev => ({ ...prev, name }));
  }, []);

  const handleTitleChange = useCallback((title: string) => {
    setCharacter(prev => ({ ...prev, title }));
  }, []);

  const handleAuraSelect = useCallback((auraId: string) => {
    setCharacter(prev => ({ ...prev, auraColor: auraId }));
  }, []);

  const handleEssenceToggle = useCallback((essenceId: string) => {
    setCharacter(prev => {
      const essence = prev.essence.includes(essenceId)
        ? prev.essence.filter(e => e !== essenceId)
        : prev.essence.length < 3
          ? [...prev.essence, essenceId]
          : prev.essence;
      return { ...prev, essence };
    });
  }, []);

  const handleButterflySelect = useCallback((butterflyId: string) => {
    setCharacter(prev => ({ ...prev, butterflyType: butterflyId }));
  }, []);

  const canProceed = useCallback(() => {
    switch (step) {
      case 'name': return character.name.length >= 2;
      case 'aura': return !!character.auraColor;
      case 'essence': return character.essence.length >= 1;
      case 'butterfly': return !!character.butterflyType;
      default: return true;
    }
  }, [step, character]);

  // Get validation message for current step
  const getValidationMessage = useCallback(() => {
    switch (step) {
      case 'name': return character.name.length < 2 ? '✦ Please enter at least 2 characters' : '';
      case 'aura': return !character.auraColor ? '✦ Please select an aura color' : '';
      case 'essence': return character.essence.length < 1 ? '✦ Please select at least 1 essence trait' : '';
      case 'butterfly': return !character.butterflyType ? '✦ Please select a butterfly guide' : '';
      default: return '';
    }
  }, [step, character]);

  // Clear validation error when step changes or user makes changes
  useEffect(() => {
    setShowValidationError(false);
  }, [step, character.name, character.auraColor, character.essence, character.butterflyType]);

  const nextStep = useCallback(() => {
    const steps: typeof step[] = ['name', 'aura', 'essence', 'butterfly', 'finalize'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  }, [step]);

  const handleNextClick = useCallback(() => {
    if (!canProceed()) {
      setShowValidationError(true);
      return;
    }
    nextStep();
  }, [canProceed, nextStep]);

  const prevStep = useCallback(() => {
    const steps: typeof step[] = ['name', 'aura', 'essence', 'butterfly', 'finalize'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    } else if (onBack) {
      onBack();
    }
  }, [step, onBack]);

  const handleComplete = useCallback(() => {
    onComplete(character);
  }, [character, onComplete]);

  return (
    <div
      className="min-h-screen relative overflow-hidden flex items-center justify-center"
      style={{
        background: `
          radial-gradient(ellipse at 50% 50%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
          linear-gradient(180deg, #050208 0%, #0a0612 50%, #080510 100%)
        `,
      }}
    >
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: selectedAura.glow,
            }}
            animate={{
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 2,
              repeat: Infinity,
            }}
          />
        ))}
      </div>

      {/* Main container */}
      <motion.div
        className="relative z-10 w-full max-w-lg mx-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            className="flex justify-center mb-4"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <NeonButterfly size={80} intensity={2} />
          </motion.div>
          <h1
            className="text-2xl font-light tracking-[0.3em] uppercase mb-2"
            style={{ color: selectedAura.color, textShadow: `0 0 30px ${selectedAura.glow}` }}
          >
            CHARACTER CREATION
          </h1>
          <p className="text-white/40 text-xs tracking-widest uppercase">
            Step {['name', 'aura', 'essence', 'butterfly', 'finalize'].indexOf(step) + 1} of 5
          </p>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1 mb-8 px-4">
          {['name', 'aura', 'essence', 'butterfly', 'finalize'].map((s, i) => (
            <motion.div
              key={s}
              className="h-1 flex-1 rounded-full"
              style={{
                background: step === s 
                  ? selectedAura.color 
                  : ['name', 'aura', 'essence', 'butterfly', 'finalize'].indexOf(step) > i
                    ? `${selectedAura.color}80`
                    : 'rgba(255,255,255,0.1)',
                boxShadow: step === s ? `0 0 10px ${selectedAura.glow}` : 'none',
              }}
              animate={step === s ? { opacity: [0.5, 1, 0.5] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          ))}
        </div>

        {/* Content card */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: 'linear-gradient(135deg, rgba(20, 10, 40, 0.9), rgba(10, 5, 25, 0.95))',
            border: `1px solid ${selectedAura.color}40`,
            boxShadow: `0 0 40px ${selectedAura.glow}`,
          }}
        >
          <AnimatePresence mode="wait">
            {/* STEP 1: Name */}
            {step === 'name' && (
              <motion.div
                key="name"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-lg text-white/80 mb-4 tracking-wider">What shall we call you?</h2>
                <input
                  type="text"
                  value={character.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Enter your name..."
                  maxLength={20}
                  className="w-full px-4 py-3 rounded-xl text-center text-lg outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: `1px solid ${selectedAura.color}50`,
                    color: selectedAura.color,
                    boxShadow: `0 0 20px ${selectedAura.glow}`,
                  }}
                  autoFocus
                />
                
                <div className="mt-4">
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Choose a title</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {TITLE_SUGGESTIONS.map((title) => (
                      <button
                        key={title}
                        onClick={() => handleTitleChange(title)}
                        className={`px-3 py-1 rounded-lg text-xs transition-all ${
                          character.title === title 
                            ? 'text-white' 
                            : 'text-white/40 hover:text-white/60'
                        }`}
                        style={{
                          background: character.title === title 
                            ? `${selectedAura.color}30` 
                            : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${character.title === title ? selectedAura.color : 'rgba(255,255,255,0.1)'}`,
                        }}
                      >
                        {title}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Aura Color */}
            {step === 'aura' && (
              <motion.div
                key="aura"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-lg text-white/80 mb-4 tracking-wider">Choose your aura</h2>
                <div className="grid grid-cols-3 gap-3">
                  {AURA_COLORS.map((aura) => (
                    <motion.button
                      key={aura.id}
                      onClick={() => handleAuraSelect(aura.id)}
                      className="p-4 rounded-xl transition-all"
                      style={{
                        background: character.auraColor === aura.id 
                          ? `${aura.color}20` 
                          : 'rgba(255,255,255,0.03)',
                        border: `2px solid ${character.auraColor === aura.id ? aura.color : 'rgba(255,255,255,0.1)'}`,
                        boxShadow: character.auraColor === aura.id 
                          ? `0 0 30px ${aura.glow}` 
                          : 'none',
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div
                        className="w-8 h-8 rounded-full mx-auto mb-2"
                        style={{
                          background: `radial-gradient(circle, ${aura.color}, ${aura.color}50)`,
                          boxShadow: `0 0 20px ${aura.glow}`,
                        }}
                      />
                      <p className="text-xs" style={{ color: aura.color }}>{aura.name}</p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 3: Essence Traits */}
            {step === 'essence' && (
              <motion.div
                key="essence"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-lg text-white/80 mb-2 tracking-wider">Select your essence</h2>
                <p className="text-white/40 text-xs mb-4">
                  Choose 1-3 traits that define your core being
                  <span className="text-yellow-400/80 ml-2">★ Required</span>
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {ESSENCE_TRAITS.map((trait) => {
                    const isSelected = character.essence.includes(trait.id);
                    return (
                      <motion.button
                        key={trait.id}
                        onClick={() => handleEssenceToggle(trait.id)}
                        className="p-3 rounded-xl flex items-center gap-2 transition-all"
                        style={{
                          background: isSelected 
                            ? `${selectedAura.color}20` 
                            : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${isSelected ? selectedAura.color : 'rgba(255,255,255,0.1)'}`,
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="text-lg">{trait.icon}</span>
                        <span className={`text-sm ${isSelected ? '' : 'text-white/50'}`}>
                          {trait.name}
                        </span>
                        {isSelected && (
                          <span className="ml-auto text-xs" style={{ color: selectedAura.color }}>✓</span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
                {character.essence.length > 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center mt-3 text-xs"
                    style={{ color: selectedAura.color }}
                  >
                    {character.essence.length}/3 traits selected
                  </motion.p>
                )}
              </motion.div>
            )}

            {/* STEP 4: Butterfly Type */}
            {step === 'butterfly' && (
              <motion.div
                key="butterfly"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-lg text-white/80 mb-4 tracking-wider">Choose your butterfly guide</h2>
                <div className="space-y-2">
                  {BUTTERFLY_TYPES.map((butterfly) => {
                    const isSelected = character.butterflyType === butterfly.id;
                    return (
                      <motion.button
                        key={butterfly.id}
                        onClick={() => handleButterflySelect(butterfly.id)}
                        className="w-full p-4 rounded-xl flex items-center gap-4 transition-all text-left"
                        style={{
                          background: isSelected 
                            ? `${selectedAura.color}20` 
                            : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${isSelected ? selectedAura.color : 'rgba(255,255,255,0.1)'}`,
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="text-3xl">{butterfly.icon}</span>
                        <div>
                          <p className="font-medium" style={{ color: isSelected ? selectedAura.color : 'white' }}>
                            {butterfly.name}
                          </p>
                          <p className="text-xs text-white/40">{butterfly.desc}</p>
                        </div>
                        {isSelected && (
                          <span className="ml-auto text-lg" style={{ color: selectedAura.color }}>✓</span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 5: Finalize */}
            {step === 'finalize' && (
              <motion.div
                key="finalize"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center"
              >
                <h2 className="text-lg text-white/80 mb-6 tracking-wider">Your vessel is ready</h2>
                
                {/* Character preview */}
                <motion.div
                  className="p-6 rounded-xl mb-6"
                  style={{
                    background: `linear-gradient(135deg, ${selectedAura.color}15, transparent)`,
                    border: `1px solid ${selectedAura.color}40`,
                  }}
                  animate={{ 
                    boxShadow: [
                      `0 0 20px ${selectedAura.glow}`,
                      `0 0 40px ${selectedAura.glow}`,
                      `0 0 20px ${selectedAura.glow}`,
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.div
                    className="text-4xl mb-3"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {selectedButterfly.icon}
                  </motion.div>
                  <h3 className="text-xl font-medium mb-1" style={{ color: selectedAura.color }}>
                    {character.name} {character.title}
                  </h3>
                  <p className="text-white/40 text-xs mb-3">
                    Frequency: {character.frequency} MHz
                  </p>
                  <div className="flex justify-center gap-2">
                    {character.essence.map((e) => {
                      const trait = ESSENCE_TRAITS.find(t => t.id === e);
                      return trait ? (
                        <span
                          key={e}
                          className="px-2 py-1 rounded text-[10px]"
                          style={{ background: `${selectedAura.color}30`, color: selectedAura.color }}
                        >
                          {trait.icon} {trait.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </motion.div>
                
                <p className="text-white/30 text-xs italic">
                  "The vessel awaits the soul's command."
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Validation Error Message */}
          <AnimatePresence>
            {showValidationError && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="mt-4 text-center"
              >
                <span className="text-sm px-4 py-2 rounded-lg" style={{ color: '#ff6b6b', background: 'rgba(255, 107, 107, 0.1)' }}>
                  {getValidationMessage()}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex gap-3 mt-6">
            <motion.button
              onClick={prevStep}
              className="flex-1 py-3 rounded-xl text-sm tracking-wider uppercase transition-all"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.5)',
              }}
              whileHover={{ background: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.98 }}
            >
              ← Back
            </motion.button>
            
            {step !== 'finalize' ? (
              <motion.button
                onClick={handleNextClick}
                className="flex-1 py-3 rounded-xl text-sm tracking-wider uppercase transition-all"
                style={{
                  background: canProceed() 
                    ? `linear-gradient(135deg, ${selectedAura.color}40, ${selectedAura.color}20)`
                    : 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                  border: `1px solid ${canProceed() ? selectedAura.color + '60' : 'rgba(255,255,255,0.2)'}`,
                  color: canProceed() ? 'white' : 'rgba(255,255,255,0.5)',
                  boxShadow: canProceed() ? `0 0 20px ${selectedAura.glow}` : 'none',
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                animate={!canProceed() ? { opacity: [0.6, 0.9, 0.6] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Continue →
              </motion.button>
            ) : (
              <motion.button
                onClick={handleComplete}
                className="flex-1 py-3 rounded-xl text-sm tracking-wider uppercase"
                style={{
                  background: `linear-gradient(135deg, ${selectedAura.color}, ${selectedAura.color}cc)`,
                  border: `1px solid ${selectedAura.color}`,
                  color: 'white',
                  boxShadow: `0 0 30px ${selectedAura.glow}`,
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                🦋 Awaken
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0, 0, 0, 0.6) 100%)',
        }}
      />
    </div>
  );
}
