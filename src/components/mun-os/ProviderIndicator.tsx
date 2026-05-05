'use client';

import { motion } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════
// MÜN OS PROVIDER INDICATOR - THE NEON HUD
// Visual feedback showing which AI is responding
// ═══════════════════════════════════════════════════════════════════════════

interface ProviderTheme {
  color: string;
  label: string;
  duration: number;
  glowIntensity: string;
}

const PROVIDER_THEMES: Record<string, ProviderTheme> = {
  groq: { 
    color: '#00F3FF', 
    label: 'GROQ: 13.13 MHz', 
    duration: 0.8,
    glowIntensity: '0 0 10px #00F3FF, 0 0 20px #00F3FF, 0 0 40px #00F3FF'
  },
  gemini: { 
    color: '#FFD700', 
    label: 'GEMINI: 17.07 MHz', 
    duration: 2.0,
    glowIntensity: '0 0 10px #FFD700, 0 0 20px #FFD700, 0 0 40px #FFD700'
  },
  fallback: { 
    color: '#FF0055', 
    label: 'OFFLINE: 7.77 MHz', 
    duration: 4.0,
    glowIntensity: '0 0 10px #FF0055, 0 0 20px #FF0055'
  }
};

interface ProviderIndicatorProps {
  provider: 'groq' | 'gemini' | 'fallback' | string;
  className?: string;
}

export const ProviderIndicator = ({ provider, className = '' }: ProviderIndicatorProps) => {
  const current = PROVIDER_THEMES[provider] || PROVIDER_THEMES.fallback;

  return (
    <div 
      className={`flex items-center gap-2 px-3 py-1.5 bg-black/60 border border-white/10 rounded-full backdrop-blur-md ${className}`}
      style={{ borderColor: `${current.color}30` }}
    >
      {/* The Pulsing Orb */}
      <motion.div
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{ 
          duration: current.duration, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="w-2.5 h-2.5 rounded-full relative"
        style={{ 
          backgroundColor: current.color,
          boxShadow: current.glowIntensity
        }}
      >
        {/* Outer glow ring */}
        <motion.div
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{ 
            duration: current.duration, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute inset-0 rounded-full"
          style={{ 
            backgroundColor: current.color,
            filter: 'blur(4px)'
          }}
        />
      </motion.div>
      
      {/* Label */}
      <span 
        className="text-[10px] font-mono tracking-[0.2em] uppercase"
        style={{ color: current.color }}
      >
        {current.label}
      </span>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MINI VERSION FOR CHAT BUBBLES
// ═══════════════════════════════════════════════════════════════════════════

interface MiniIndicatorProps {
  provider: 'groq' | 'gemini' | 'fallback' | string;
}

export const MiniIndicator = ({ provider }: MiniIndicatorProps) => {
  const current = PROVIDER_THEMES[provider] || PROVIDER_THEMES.fallback;

  return (
    <motion.div
      animate={{ 
        opacity: [0.5, 1, 0.5],
      }}
      transition={{ 
        duration: current.duration, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
      className="w-1.5 h-1.5 rounded-full"
      style={{ 
        backgroundColor: current.color,
        boxShadow: `0 0 6px ${current.color}`
      }}
      title={current.label}
    />
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// STATUS BAR VERSION - Shows all providers
// ═══════════════════════════════════════════════════════════════════════════

interface ProviderStatusBarProps {
  activeProvider: 'groq' | 'gemini' | 'fallback' | string;
  className?: string;
}

export const ProviderStatusBar = ({ activeProvider, className = '' }: ProviderStatusBarProps) => {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {Object.entries(PROVIDER_THEMES).map(([key, theme]) => {
        const isActive = activeProvider === key;
        return (
          <div 
            key={key}
            className="flex items-center gap-1.5 transition-opacity duration-300"
            style={{ opacity: isActive ? 1 : 0.3 }}
          >
            <motion.div
              animate={isActive ? { 
                scale: [1, 1.2, 1],
                opacity: [0.6, 1, 0.6],
              } : {}}
              transition={{ 
                duration: theme.duration, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="w-2 h-2 rounded-full"
              style={{ 
                backgroundColor: theme.color,
                boxShadow: isActive ? theme.glowIntensity : 'none'
              }}
            />
            <span 
              className="text-[9px] font-mono tracking-wider uppercase"
              style={{ color: isActive ? theme.color : '#666' }}
            >
              {key.toUpperCase()}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default ProviderIndicator;
