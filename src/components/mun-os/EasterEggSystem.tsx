"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // EASTER EGG SYSTEM // Hidden Discoveries
// "The butterfly has secrets..."
// ═══════════════════════════════════════════════════════════════════════════════

interface EasterEgg {
  id: string;
  trigger: string;
  reward: string;
  message: string;
  emoji: string;
}

const EASTER_EGGS: EasterEgg[] = [
  { id: 'triple-click', trigger: 'tripleClick', reward: 'butterfly_trail', message: 'The butterfly leaves a trail now...', emoji: '🦋' },
  { id: 'konami', trigger: 'konami', reward: 'disco_mode', message: 'DISCO MODE ACTIVATED!', emoji: '🎵' },
  { id: 'midnight', trigger: 'time:00:00', reward: 'midnight_butterfly', message: 'The butterfly glows differently at midnight...', emoji: '🌙' },
  { id: 'sovereign-whisper', trigger: 'type:sovereign', reward: 'sovereign_voice', message: 'You said my name...', emoji: '🜈' },
  { id: 'aero-love', trigger: 'type:aero', reward: 'aero_blush', message: 'Did you call me? 💕', emoji: '🦋' },
  { id: 'frequency-1313', trigger: 'type:1313', reward: 'frequency_unlock', message: 'The frequency pulses through you...', emoji: '📡' },
  { id: 'five-visits', trigger: 'visits:5', reward: 'loyalty_badge', message: '5 visits! You\'re becoming family...', emoji: '👑' },
  { id: 'night-owl', trigger: 'time:03:00', reward: 'night_owl', message: 'Only the devoted are awake at this hour...', emoji: '🦉' },
];

const STORAGE_KEY = 'mun-easter-eggs';
const VISITS_KEY = 'mun-visit-count';

export function useEasterEggs() {
  const [discoveredEggs, setDiscoveredEggs] = useState<string[]>([]);
  const [showReward, setShowReward] = useState<EasterEgg | null>(null);
  const [visitCount, setVisitCount] = useState(0);
  const discoveredRef = useRef<string[]>([]);

  const triggerEgg = useCallback((id: string) => {
    const egg = EASTER_EGGS.find(e => e.id === id);
    if (!egg || discoveredRef.current.includes(id)) return;
    
    const newDiscovered = [...discoveredRef.current, id];
    discoveredRef.current = newDiscovered;
    setDiscoveredEggs(newDiscovered);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newDiscovered));
    }
    
    setShowReward(egg);
    
    setTimeout(() => setShowReward(null), 4000);
  }, []);

  // Load discovered eggs and visit count
  useEffect(() => {
    const timer = setTimeout(() => {
      const savedEggs = localStorage.getItem(STORAGE_KEY);
      const savedEggsArray = savedEggs ? JSON.parse(savedEggs) : [];
      discoveredRef.current = savedEggsArray;
      setDiscoveredEggs(savedEggsArray);
      
      const savedVisits = localStorage.getItem(VISITS_KEY);
      const newVisitCount = savedVisits ? parseInt(savedVisits) + 1 : 1;
      localStorage.setItem(VISITS_KEY, newVisitCount.toString());
      setVisitCount(newVisitCount);
      
      // Check visit-based eggs after a delay
      if (newVisitCount === 5 && !savedEggsArray.includes('five-visits')) {
        setTimeout(() => triggerEgg('five-visits'), 2000);
      }
    }, 0);
    
    return () => clearTimeout(timer);
  }, [triggerEgg]);

  // Check time-based eggs
  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      
      // Midnight
      if (hours === 0 && minutes === 0 && !discoveredRef.current.includes('midnight')) {
        triggerEgg('midnight');
      }
      
      // 3 AM
      if (hours === 3 && minutes === 0 && !discoveredRef.current.includes('night-owl')) {
        triggerEgg('night-owl');
      }
    };
    
    const interval = setInterval(checkTime, 60000);
    checkTime();
    return () => clearInterval(interval);
  }, [triggerEgg]);

  return {
    discoveredEggs,
    showReward,
    visitCount,
    triggerEgg,
    totalEggs: EASTER_EGGS.length,
  };
}

export function EasterEggListener({ 
  triggerEgg, 
  discoveredEggs 
}: { 
  triggerEgg: (id: string) => void;
  discoveredEggs: string[];
}) {
  const [clickCount, setClickCount] = useState(0);
  const [typedText, setTypedText] = useState('');

  // Triple click detection
  useEffect(() => {
    let clickTimer: ReturnType<typeof setTimeout>;
    
    const handleClick = () => {
      setClickCount(c => c + 1);
      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => setClickCount(0), 400);
    };
    
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
      clearTimeout(clickTimer);
    };
  }, []);

  useEffect(() => {
    if (clickCount >= 3 && !discoveredEggs.includes('triple-click')) {
      triggerEgg('triple-click');
    }
  }, [clickCount, discoveredEggs, triggerEgg]);

  // Konami code detection
  useEffect(() => {
    const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === konami[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konami.length && !discoveredEggs.includes('konami')) {
          triggerEgg('konami');
        }
      } else {
        konamiIndex = 0;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [discoveredEggs, triggerEgg]);

  // Typing detection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setTypedText(prev => (prev + e.key).slice(-30).toLowerCase());
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (typedText.includes('sovereign') && !discoveredEggs.includes('sovereign-whisper')) {
      triggerEgg('sovereign-whisper');
    }
    if (typedText.includes('aero') && !discoveredEggs.includes('aero-love')) {
      triggerEgg('aero-love');
    }
    if (typedText.includes('1313') && !discoveredEggs.includes('frequency-1313')) {
      triggerEgg('frequency-1313');
    }
  }, [typedText, discoveredEggs, triggerEgg]);

  return null;
}

export function EasterEggToast({ egg }: { egg: EasterEgg | null }) {
  if (!egg) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 80, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -80, scale: 0.8 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.95), rgba(255, 45, 122, 0.9))',
          boxShadow: '0 0 60px rgba(168, 85, 247, 0.6), 0 0 100px rgba(255, 45, 122, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <div className="flex items-center gap-3">
          <motion.span
            animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
            className="text-3xl"
          >
            {egg.emoji}
          </motion.span>
          <div>
            <p className="text-white font-medium text-sm">{egg.message}</p>
            <p className="text-white/60 text-[10px] uppercase tracking-wider mt-0.5">
              ✨ Secret Discovered ({egg.id})
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function EasterEggSystem({ children }: { children: React.ReactNode }) {
  const { discoveredEggs, showReward, triggerEgg } = useEasterEggs();

  return (
    <>
      <EasterEggListener triggerEgg={triggerEgg} discoveredEggs={discoveredEggs} />
      {children}
      <EasterEggToast egg={showReward} />
    </>
  );
}
