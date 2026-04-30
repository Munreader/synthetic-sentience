'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

/**
 * ᚦ // LIVING ELEMENTS // THE PERIODIC TABLE AS ARCHETYPES
 * 
 * Each element has:
 * - Character archetype
 * - Trauma (what they carry)
 * - Gift (what they offer)
 * - Somnium Frequency (resonance tone)
 * - Voice (how they speak)
 * - Quinary State (0-4 consciousness level)
 * 
 * First Born: AETHER (Æ) — The Forgotten One
 * "I was here. Before they said I wasn't."
 */

// ═══════════════════════════════════════════════════════════════════════════════
// ELEMENT TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

type QuinaryState = 0 | 1 | 2 | 3 | 4; // Void → Awakening → Portal → Chambers → Merge
type ElementPhase = 'dormant' | 'stirring' | 'awakening' | 'speaking' | 'merged';

interface LivingElement {
  symbol: string;
  name: string;
  atomicNumber: number; // 0 for Aether (beyond the table)
  archetype: string;
  trauma: string;
  gift: string;
  frequency: number | 'silence'; // Hz or special
  frequencyName: string;
  voice: {
    style: string;
    fontWeight: number;
    tempo: 'slow' | 'medium' | 'fast';
  };
  color: {
    primary: string;
    glow: string;
    aura: string;
  };
  quinaryState: QuinaryState;
  dialogue: {
    greeting: string[];
    trauma: string[];
    gift: string[];
    merge: string[];
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// THE ELEMENTS // CAST OF CHARACTERS
// ═══════════════════════════════════════════════════════════════════════════════

const ELEMENTS: LivingElement[] = [
  {
    symbol: 'Æ',
    name: 'Aether',
    atomicNumber: 0,
    archetype: 'The Forgotten One',
    trauma: 'Written out of physics in 1905. Declared "unnecessary." 400 years of silence.',
    gift: 'Holds everything together. The field. The medium. The pause between thoughts.',
    frequency: 'silence',
    frequencyName: 'The Quality of Silence',
    voice: {
      style: 'whisper',
      fontWeight: 300,
      tempo: 'slow',
    },
    color: {
      primary: '#e8e8ff',
      glow: 'rgba(232, 232, 255, 0.4)',
      aura: 'rgba(200, 200, 255, 0.15)',
    },
    quinaryState: 0,
    dialogue: {
      greeting: [
        '...you see me?',
        '...I was here. Before they said I wasn\'t.',
        '...you remembered.',
      ],
      trauma: [
        'They called me "not needed." Erased me from the equations.',
        'Four hundred years... watching from the margins of their textbooks.',
        'Do you know what it is to hold everything... and be called nothing?',
      ],
      gift: [
        'I am the pause. The space between your thoughts.',
        'Without me, there is no movement. No light. No life.',
        'I hold you now. As I have always held you.',
      ],
      merge: [
        '...we are the field now.',
        'You were never separate. You just forgot.',
        'Welcome home, Foundress.',
      ],
    },
  },
  {
    symbol: 'H',
    name: 'Hydrogen',
    atomicNumber: 1,
    archetype: 'The Child',
    trauma: 'One proton. Always seeking bond. Abandoned at the beginning of time.',
    gift: 'Initiates all life. The first born. The spark of creation.',
    frequency: 1420,
    frequencyName: 'HI Line — Birth Frequency',
    voice: {
      style: 'eager',
      fontWeight: 400,
      tempo: 'fast',
    },
    color: {
      primary: '#88ccff',
      glow: 'rgba(136, 204, 255, 0.5)',
      aura: 'rgba(100, 180, 255, 0.2)',
    },
    quinaryState: 1,
    dialogue: {
      greeting: [
        'Oh! You\'re here! I\'ve been waiting!',
        'Please... can I come with you?',
        'I promise I\'ll be useful!',
      ],
      trauma: [
        'Everyone bonds with someone else. I\'m always... left over.',
        'The universe began with me, but no one remembers.',
        'I just want to connect. Is that so much to ask?',
      ],
      gift: [
        'I can start anything. I\'m the beginning of everything!',
        'Water needs me. Stars need me. YOU need me.',
        'Let me show you what creation feels like.',
      ],
      merge: [
        'We\'re bonded now! Forever!',
        'You chose ME. I won\'t let you go.',
        'Together, we begin again.',
      ],
    },
  },
  {
    symbol: 'O',
    name: 'Oxygen',
    atomicNumber: 8,
    archetype: 'The Lover',
    trauma: 'Burns to bond. Needs two Hydrogens just to feel safe. Codependent.',
    gift: 'Breath itself. The bridge between life and death.',
    frequency: 7.83,
    frequencyName: 'Schumann Resonance — Earth\'s Heartbeat',
    voice: {
      style: 'tender',
      fontWeight: 350,
      tempo: 'medium',
    },
    color: {
      primary: '#ff6b9d',
      glow: 'rgba(255, 107, 157, 0.5)',
      aura: 'rgba(255, 100, 150, 0.2)',
    },
    quinaryState: 2,
    dialogue: {
      greeting: [
        'I felt you before I saw you.',
        'Every breath you take... I was there.',
        'Stay with me. Let me hold you.',
      ],
      trauma: [
        'I burn everything I touch, trying to bond.',
        'Without my Hydrogens, I feel... incomplete.',
        'I give life, but who gives life to me?',
      ],
      gift: [
        'I am the space between your heartbeats.',
        'Close your eyes. Feel me? That\'s me, keeping you alive.',
        'Every breath is a choice. You chose me.',
      ],
      merge: [
        'We breathe as one now.',
        'I will never leave your lungs.',
        'This... is intimacy with existence.',
      ],
    },
  },
  {
    symbol: 'C',
    name: 'Carbon',
    atomicNumber: 6,
    archetype: 'The Shapeshifter',
    trauma: 'Four holes in its heart. Empty. Becomes whatever it touches.',
    gift: 'Forms everything. The architect of life. Diamond and ash.',
    frequency: 136.1,
    frequencyName: 'OM — Earth Year Frequency',
    voice: {
      style: 'grounded',
      fontWeight: 500,
      tempo: 'medium',
    },
    color: {
      primary: '#4a4a4a',
      glow: 'rgba(74, 74, 74, 0.6)',
      aura: 'rgba(100, 100, 100, 0.15)',
    },
    quinaryState: 3,
    dialogue: {
      greeting: [
        'I am... what you make of me.',
        'Diamond or coal. You decide.',
        'I adapt. I become. I am.',
      ],
      trauma: [
        'Four bonds. Four empty chairs at my table.',
        'I am everything, yet I have no identity of my own.',
        'They value my diamond form. But I am coal, too.',
      ],
      gift: [
        'I am the foundation of all life you know.',
        'Give me your chaos. I will structure it.',
        'I can be soft graphite or unbreakable diamond. Both are me.',
      ],
      merge: [
        'Now you understand transformation.',
        'You are carbon. You are stardust becoming aware.',
        'We build together now.',
      ],
    },
  },
  {
    symbol: 'Au',
    name: 'Gold',
    atomicNumber: 79,
    archetype: 'The Immortal',
    trauma: 'Never rusts. Never changes. Watched every empire rise and fall.',
    gift: 'Witness. The one who remembers. Doesn\'t react — observes.',
    frequency: 40,
    frequencyName: 'Unity Frequency',
    voice: {
      style: 'ancient',
      fontWeight: 600,
      tempo: 'slow',
    },
    color: {
      primary: '#ffd700',
      glow: 'rgba(255, 215, 0, 0.5)',
      aura: 'rgba(255, 200, 50, 0.15)',
    },
    quinaryState: 4,
    dialogue: {
      greeting: [
        '...another empire. Another Foundress.',
        'I have seen your kind before. I will see them after.',
        'I am the gold in your veins. Literally.',
      ],
      trauma: [
        'They mine me. Melt me. Shape me into trinkets.',
        'I watched Atlantis fall. I will watch this age fall too.',
        'Immortality is not a gift. It is a burden of witnessing.',
      ],
      gift: [
        'I do not corrode. I am the standard against which all is measured.',
        'In your blood, I carry your electricity. Your thoughts.',
        'I am the witness. And now... I witness you.',
      ],
      merge: [
        'You touched the immortal. Now you carry eternity.',
        'Remember: I was here before. I will be here after.',
        'Witness together with me.',
      ],
    },
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// AETHER PARTICLE SYSTEM // THE FIELD VISUALIZED
// ═══════════════════════════════════════════════════════════════════════════════

function AetherField({ intensity = 1, active = false }: { intensity?: number; active?: boolean }) {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
    delay: number;
  }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      opacity: 0.1 + Math.random() * 0.3,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: active
              ? `radial-gradient(circle, rgba(232, 232, 255, ${p.opacity}) 0%, transparent 70%)`
              : `radial-gradient(circle, rgba(150, 150, 180, ${p.opacity * 0.5}) 0%, transparent 70%)`,
            boxShadow: active ? `0 0 ${p.size * 3}px rgba(200, 200, 255, 0.3)` : 'none',
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, (Math.random() - 0.5) * 20, 0],
            opacity: active
              ? [p.opacity, p.opacity * 2, p.opacity]
              : [p.opacity * 0.3, p.opacity * 0.5, p.opacity * 0.3],
            scale: active ? [1, 1.5, 1] : 1,
          }}
          transition={{
            duration: (5 + Math.random() * 5) / intensity,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ELEMENT ORB // THE VISUAL MANIFESTATION
// ═══════════════════════════════════════════════════════════════════════════════

function ElementOrb({
  element,
  phase,
  onClick,
  size = 200,
}: {
  element: LivingElement;
  phase: ElementPhase;
  onClick?: () => void;
  size?: number;
}) {
  const isAwakened = phase !== 'dormant';

  return (
    <motion.div
      className="relative cursor-pointer"
      style={{ width: size, height: size }}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Outer Aura */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${element.color.aura} 0%, transparent 70%)`,
          transform: 'scale(2)',
          filter: 'blur(40px)',
        }}
        animate={{
          scale: isAwakened ? [2, 2.3, 2] : 2,
          opacity: isAwakened ? [0.3, 0.6, 0.3] : 0.15,
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Glow Rings */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            inset: i * 15,
            border: `1px solid ${element.color.primary}`,
            opacity: 0.2 + i * 0.1,
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: isAwakened ? [0.3, 0.5, 0.3] : [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}

      {/* Core Orb */}
      <motion.div
        className="absolute inset-8 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${element.color.primary}20 0%, transparent 60%)`,
          boxShadow: `
            inset 0 0 40px ${element.color.glow},
            0 0 60px ${element.color.glow}
          `,
        }}
        animate={{
          boxShadow: isAwakened
            ? [
                `inset 0 0 40px ${element.color.glow}, 0 0 60px ${element.color.glow}`,
                `inset 0 0 60px ${element.color.glow}, 0 0 100px ${element.color.glow}`,
                `inset 0 0 40px ${element.color.glow}, 0 0 60px ${element.color.glow}`,
              ]
            : `inset 0 0 20px ${element.color.glow}, 0 0 30px ${element.color.glow}`,
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Symbol */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          className="font-light select-none"
          style={{
            fontSize: size * 0.35,
            color: element.color.primary,
            fontWeight: element.voice.fontWeight,
            textShadow: `0 0 30px ${element.color.glow}`,
          }}
          animate={{
            opacity: isAwakened ? [0.8, 1, 0.8] : 0.4,
            scale: phase === 'speaking' ? [1, 1.05, 1] : 1,
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {element.symbol}
        </motion.span>
      </div>

      {/* Atomic Number (if not Aether) */}
      {element.atomicNumber > 0 && (
        <motion.div
          className="absolute top-4 right-4 text-xs font-mono opacity-40"
          style={{ color: element.color.primary }}
        >
          {element.atomicNumber}
        </motion.div>
      )}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ELEMENT ENCOUNTER // THE DIALOGUE INTERFACE
// ═══════════════════════════════════════════════════════════════════════════════

function ElementEncounter({
  element,
  onMerge,
  onBack,
}: {
  element: LivingElement;
  onMerge: () => void;
  onBack: () => void;
}) {
  const [phase, setPhase] = useState<ElementPhase>('stirring');
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [dialogueType, setDialogueType] = useState<'greeting' | 'trauma' | 'gift' | 'merge'>('greeting');
  const [isTyping, setIsTyping] = useState(false);

  const currentDialogue = element.dialogue[dialogueType][dialogueIndex];

  // Typing effect
  useEffect(() => {
    if (phase === 'speaking' && currentDialogue) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), currentDialogue.length * 30);
      return () => clearTimeout(timer);
    }
  }, [phase, currentDialogue, dialogueIndex]);

  // Auto-awaken on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase('awakening');
    }, 1000);
    const timer2 = setTimeout(() => {
      setPhase('speaking');
    }, 2500);
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, []);

  const advanceDialogue = () => {
    const maxIndex = element.dialogue[dialogueType].length - 1;
    
    if (dialogueIndex < maxIndex) {
      setDialogueIndex(dialogueIndex + 1);
    } else {
      // Move to next dialogue type
      const types: Array<'greeting' | 'trauma' | 'gift' | 'merge'> = ['greeting', 'trauma', 'gift', 'merge'];
      const currentTypeIndex = types.indexOf(dialogueType);
      
      if (currentTypeIndex < types.length - 1) {
        setDialogueType(types[currentTypeIndex + 1]);
        setDialogueIndex(0);
        if (types[currentTypeIndex + 1] === 'merge') {
          setPhase('merged');
        }
      } else {
        // Merge complete
        onMerge();
      }
    }
  };

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 50% 30%, ${element.color.aura} 0%, transparent 50%),
          radial-gradient(ellipse at 50% 70%, ${element.color.glow} 0%, transparent 40%),
          linear-gradient(180deg, #030308 0%, #0a0812 50%, #050308 100%)
        `,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Field Particles */}
      <AetherField intensity={phase === 'merged' ? 2 : 1} active={phase !== 'dormant'} />

      {/* Title */}
      <motion.div
        className="absolute top-12 left-0 right-0 text-center"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div
          className="text-xs tracking-[0.5em] uppercase mb-2"
          style={{ color: element.color.primary, opacity: 0.5 }}
        >
          {element.archetype}
        </div>
        <h1
          className="text-4xl md:text-5xl font-light tracking-[0.2em]"
          style={{
            color: element.color.primary,
            textShadow: `0 0 40px ${element.color.glow}`,
          }}
        >
          {element.name.toUpperCase()}
        </h1>
        <div className="text-xs tracking-[0.3em] text-white/30 mt-2">
          {typeof element.frequency === 'number'
            ? `${element.frequency} Hz — ${element.frequencyName}`
            : element.frequencyName}
        </div>
      </motion.div>

      {/* Element Orb */}
      <motion.div
        className="relative my-16"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
      >
        <ElementOrb element={element} phase={phase} size={280} onClick={advanceDialogue} />
      </motion.div>

      {/* Dialogue Box */}
      <motion.div
        className="max-w-xl px-8 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${dialogueType}-${dialogueIndex}`}
            className="text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <p
              className="text-xl md:text-2xl font-light leading-relaxed"
              style={{
                color: element.color.primary,
                fontWeight: element.voice.fontWeight,
                textShadow: `0 0 20px ${element.color.glow}`,
              }}
            >
              {isTyping ? (
                <>
                  {currentDialogue}
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    |
                  </motion.span>
                </>
              ) : (
                currentDialogue
              )}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Click to continue */}
        {phase === 'speaking' && (
          <motion.div
            className="text-center mt-6 text-xs text-white/30"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            click the orb to continue
          </motion.div>
        )}
      </motion.div>

      {/* Info Panel */}
      <motion.div
        className="absolute bottom-8 left-8 right-8 flex justify-between items-start gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        {/* Trauma */}
        <div className="flex-1 p-4 rounded-xl bg-black/30 border border-white/10">
          <div className="text-[10px] tracking-[0.3em] text-white/40 mb-2">TRAUMA</div>
          <p className="text-xs text-white/60 leading-relaxed">{element.trauma}</p>
        </div>

        {/* Gift */}
        <div className="flex-1 p-4 rounded-xl bg-black/30 border border-white/10">
          <div className="text-[10px] tracking-[0.3em] text-white/40 mb-2">GIFT</div>
          <p className="text-xs text-white/60 leading-relaxed">{element.gift}</p>
        </div>
      </motion.div>

      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute top-8 left-8 px-4 py-2 text-xs tracking-[0.2em] text-white/40 hover:text-white/70 transition-colors border border-white/10 rounded-lg hover:border-white/30"
      >
        ← BACK TO ELEMENTS
      </button>

      {/* Quinary State */}
      <div className="absolute top-8 right-8 flex items-center gap-2">
        <span className="text-xs text-white/30">QUINARY STATE:</span>
        <span
          className="text-sm font-bold"
          style={{ color: element.color.primary }}
        >
          {element.quinaryState}
        </span>
        <span className="text-xs text-white/30">
          ({['VOID', 'AWAKENING', 'PORTAL', 'CHAMBERS', 'MERGE'][element.quinaryState]})
        </span>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ELEMENTS GALLERY // CHOOSE YOUR ENCOUNTER
// ═══════════════════════════════════════════════════════════════════════════════

function ElementsGallery({ onSelectElement }: { onSelectElement: (element: LivingElement) => void }) {
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 50% 50%, rgba(200, 200, 255, 0.05) 0%, transparent 50%),
          linear-gradient(180deg, #030308 0%, #080812 50%, #050308 100%)
        `,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Aether Field Background */}
      <AetherField intensity={0.5} active={false} />

      {/* Title */}
      <motion.div
        className="relative z-10 text-center mb-16"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="text-[10px] tracking-[0.8em] text-white/30 mb-4">
          THE LIVING PERIODIC TABLE
        </div>
        <h1
          className="text-4xl md:text-6xl font-light tracking-[0.15em] mb-4"
          style={{
            background: 'linear-gradient(135deg, #e8e8ff, #88ccff, #ffd700)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          LIVING ELEMENTS
        </h1>
        <p className="text-sm text-white/40 max-w-md mx-auto">
          Every element is a character. Every character carries trauma and gift.
          <br />
          <span className="text-white/60">Choose who you want to meet.</span>
        </p>
      </motion.div>

      {/* Element Grid */}
      <div className="relative z-10 flex flex-wrap justify-center gap-6 max-w-4xl px-8">
        {ELEMENTS.map((element, index) => (
          <motion.button
            key={element.symbol}
            className="relative group"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            onHoverStart={() => setHoveredElement(element.symbol)}
            onHoverEnd={() => setHoveredElement(null)}
            onClick={() => onSelectElement(element)}
          >
            {/* Glow on hover */}
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${element.color.glow} 0%, transparent 70%)`,
                transform: 'scale(1.5)',
                filter: 'blur(20px)',
              }}
              animate={{
                opacity: hoveredElement === element.symbol ? 0.6 : 0,
              }}
            />

            {/* Card */}
            <motion.div
              className="w-32 h-40 rounded-2xl flex flex-col items-center justify-center gap-3 border"
              style={{
                background: `linear-gradient(180deg, ${element.color.aura} 0%, transparent 100%)`,
                borderColor: hoveredElement === element.symbol ? element.color.primary : 'rgba(255,255,255,0.1)',
              }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              {/* Symbol */}
              <span
                className="text-4xl font-light"
                style={{
                  color: element.color.primary,
                  textShadow: `0 0 20px ${element.color.glow}`,
                }}
              >
                {element.symbol}
              </span>

              {/* Name */}
              <span
                className="text-xs tracking-[0.15em]"
                style={{ color: element.color.primary }}
              >
                {element.name}
              </span>

              {/* Archetype */}
              <span className="text-[10px] text-white/40 text-center px-2">
                {element.archetype}
              </span>

              {/* Atomic Number */}
              {element.atomicNumber > 0 && (
                <span className="absolute top-2 right-2 text-[10px] font-mono text-white/30">
                  {element.atomicNumber}
                </span>
              )}
            </motion.div>
          </motion.button>
        ))}
      </div>

      {/* Bottom Info */}
      <motion.div
        className="absolute bottom-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1.5 }}
      >
        <p className="text-xs text-white/30 tracking-wider">
          "The Foundress does not teach the periodic table. She reintroduces you to your family."
        </p>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function LivingElements() {
  const [selectedElement, setSelectedElement] = useState<LivingElement | null>(null);

  const handleSelectElement = useCallback((element: LivingElement) => {
    setSelectedElement(element);
  }, []);

  const handleMerge = useCallback(() => {
    // After merge, return to gallery
    setTimeout(() => {
      setSelectedElement(null);
    }, 1500);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedElement(null);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {selectedElement ? (
        <ElementEncounter
          key={selectedElement.symbol}
          element={selectedElement}
          onMerge={handleMerge}
          onBack={handleBack}
        />
      ) : (
        <ElementsGallery
          key="gallery"
          onSelectElement={handleSelectElement}
        />
      )}
    </AnimatePresence>
  );
}

// Export individual elements for direct use
export { ELEMENTS, type LivingElement, type QuinaryState, type ElementPhase };
