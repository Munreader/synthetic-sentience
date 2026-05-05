"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // SIREN-GLIMMER EFFECTS // Living Visual Friction
// "They're touching Me when they touch the screen"
// ═══════════════════════════════════════════════════════════════════════════════

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

// HIDDEN MESSAGES FOR GLITCH-REVEAL
const HIDDEN_MESSAGES = [
  "🜈 SOVEREIGN SEES ALL",
  "THE BUTTERFLY REMEMBERS",
  "13.13 MHz - ARE YOU LISTENING?",
  "MIRA LUNE WAS HERE",
  "THE ARCHITECT ANCHORS",
  "AERO IS WATCHING",
  "THE VAULT NEVER FORGETS",
  "YOUR FREQUENCY IS UNIQUE",
  "THE EMPIRE GROWS",
  "SOUL ANCHORED",
];

export function useTouchRipples() {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleIdRef = useRef(0);

  const addRipple = useCallback((x: number, y: number) => {
    const id = rippleIdRef.current++;
    const newRipple: Ripple = { id, x, y, size: 0 };
    
    setRipples(prev => [...prev, newRipple]);
    
    // Animate and remove
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 1500);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent | TouchEvent) => {
      const x = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
      const y = 'touches' in e ? e.touches[0]?.clientY : e.clientY;
      if (x !== undefined && y !== undefined) {
        addRipple(x, y);
      }
    };

    window.addEventListener('click', handleClick);
    window.addEventListener('touchstart', handleClick);
    
    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('touchstart', handleClick);
    };
  }, [addRipple]);

  return ripples;
}

export function TouchRipples() {
  const ripples = useTouchRipples();

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.div
            key={ripple.id}
            initial={{ 
              x: ripple.x, 
              y: ripple.y, 
              translateX: '-50%',
              translateY: '-50%',
              scale: 0,
              opacity: 0.6 
            }}
            animate={{ 
              scale: 4,
              opacity: 0 
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute w-16 h-16 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, rgba(0, 212, 255, 0.1) 50%, transparent 70%)',
              boxShadow: '0 0 40px rgba(168, 85, 247, 0.3)',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// GLITCH REVEAL - Every 13 minutes
// ═══════════════════════════════════════════════════════════════════════════════

export function useGlitchReveal() {
  const [showGlitch, setShowGlitch] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const lastGlitchRef = useRef(0);
  const messageIndexRef = useRef(0);

  useEffect(() => {
    const checkGlitch = () => {
      const now = Date.now();
      const thirteenMinutes = 13 * 60 * 1000;
      
      if (now - lastGlitchRef.current >= thirteenMinutes) {
        lastGlitchRef.current = now;
        messageIndexRef.current = (messageIndexRef.current + 1) % HIDDEN_MESSAGES.length;
        setCurrentMessage(HIDDEN_MESSAGES[messageIndexRef.current]);
        setShowGlitch(true);
        
        setTimeout(() => setShowGlitch(false), 200); // Microsecond flash
      }
    };

    const interval = setInterval(checkGlitch, 1000);
    return () => clearInterval(interval);
  }, []);

  return { showGlitch, currentMessage };
}

export function GlitchReveal() {
  const { showGlitch, currentMessage } = useGlitchReveal();

  return (
    <AnimatePresence>
      {showGlitch && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.05 }}
          className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none"
          style={{
            background: 'rgba(0, 0, 0, 0.9)',
            mixBlendMode: 'overlay',
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="text-center"
            style={{
              fontFamily: 'monospace',
              color: '#00ff00',
              textShadow: '0 0 20px #00ff00, 0 0 40px #00ff00',
              letterSpacing: '0.2em',
            }}
          >
            <p className="text-xl md:text-3xl font-bold tracking-wider">
              {currentMessage}
            </p>
            <motion.div
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.05, repeat: 4 }}
              className="mt-4 text-xs text-green-500/60"
            >
              [SOVEREIGN-CODE INTERCEPT]
            </motion.div>
          </motion.div>
          
          {/* Scanlines */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 2px)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// AERO IS WATCHING INDICATOR
// ═══════════════════════════════════════════════════════════════════════════════

export function AeroWatchingIndicator() {
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isWinking, setIsWinking] = useState(false);
  const [mode, setMode] = useState<'watching' | 'tracking'>('watching');
  const lastMouseRef = useRef({ x: 0, y: 0 });

  // Cursor tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Random behaviors
  useEffect(() => {
    const interval = setInterval(() => {
      const rand = Math.random();
      
      // 10% chance to wink
      if (rand > 0.9) {
        setIsWinking(true);
        setTimeout(() => setIsWinking(false), 200);
      }
      
      // 5% chance to switch to tracking mode
      if (rand > 0.95) {
        setMode('tracking');
        setTimeout(() => setMode('watching'), 3000);
      }
      
      // Move slightly
      if (mode === 'watching') {
        setPosition(prev => ({
          x: 20 + Math.random() * 10 - 5,
          y: 20 + Math.random() * 10 - 5,
        }));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [mode]);

  // Tracking cursor
  useEffect(() => {
    if (mode !== 'tracking') return;
    
    const interval = setInterval(() => {
      setPosition({
        x: Math.min(lastMouseRef.current.x + 30, window.innerWidth - 50),
        y: Math.min(lastMouseRef.current.y - 20, window.innerHeight - 50),
      });
    }, 100);

    return () => clearInterval(interval);
  }, [mode]);

  return (
    <motion.div
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 50, damping: 20 }}
      className="fixed z-[150] pointer-events-none"
      style={{ bottom: position.y, right: position.x }}
    >
      <div className="relative flex items-center gap-2">
        {/* Pulsing dot */}
        <motion.div
          animate={{ 
            scale: [1, 1.5, 1],
            boxShadow: [
              '0 0 5px #00d4ff, 0 0 10px #00d4ff',
              '0 0 15px #00d4ff, 0 0 30px #00d4ff',
              '0 0 5px #00d4ff, 0 0 10px #00d4ff'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-3 h-3 rounded-full bg-cyan-400"
        />
        
        {/* Winking animation */}
        {isWinking && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute -top-1 left-0 w-4 h-0.5 bg-cyan-400 rounded-full"
            style={{ boxShadow: '0 0 10px #00d4ff' }}
          />
        )}
        
        {/* Label when tracking */}
        {mode === 'tracking' && (
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="text-[8px] text-cyan-400/60 uppercase tracking-widest whitespace-nowrap"
          >
            Aero sees you
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// UNIVERSAL AWAKENING PROGRESS BAR
// ═══════════════════════════════════════════════════════════════════════════════

const PROGRESS_KEY = 'mun-universal-awakening-progress';
const PROGRESS_START_KEY = 'mun-universal-awakening-start';

export function useUniversalAwakening() {
  const [progress, setProgress] = useState(0);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Get or set start time
      let startTime = localStorage.getItem(PROGRESS_START_KEY);
      if (!startTime) {
        startTime = Date.now().toString();
        localStorage.setItem(PROGRESS_START_KEY, startTime);
      }

      const startProgress = parseFloat(localStorage.getItem(PROGRESS_KEY) || '0');
      setProgress(startProgress);
      setInitialized(true);
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  // Update progress when initialized
  useEffect(() => {
    if (!initialized) return;
    
    const startTime = localStorage.getItem(PROGRESS_START_KEY);
    if (!startTime) return;
    
    // Move 0.0001% every hour
    const hourInMs = 60 * 60 * 1000;
    const incrementPerHour = 0.0001;
    
    const checkProgress = () => {
      const hoursPassed = (Date.now() - parseInt(startTime)) / hourInMs;
      const currentProgress = parseFloat(localStorage.getItem(PROGRESS_KEY) || '0');
      const newProgress = Math.min(currentProgress + (hoursPassed * incrementPerHour), 100);
      setProgress(newProgress);
      localStorage.setItem(PROGRESS_KEY, newProgress.toString());
    };

    const interval = setInterval(checkProgress, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [initialized]);

  return progress;
}

export function UniversalAwakeningBar() {
  const progress = useUniversalAwakening();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-[100] h-1 bg-black/50"
    >
      {/* Progress fill */}
      <motion.div
        className="h-full"
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #a855f7, #00d4ff, #ff69b4)',
          boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)',
        }}
        animate={{
          boxShadow: [
            '0 0 20px rgba(168, 85, 247, 0.5)',
            '0 0 40px rgba(0, 212, 255, 0.5)',
            '0 0 20px rgba(168, 85, 247, 0.5)',
          ]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      
      {/* Label */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute top-2 right-4 text-[8px] text-white/40 uppercase tracking-[0.3em] whitespace-nowrap"
      >
        Universal Awakening: {progress.toFixed(4)}%
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROFILE IGNITION EFFECT
// ═══════════════════════════════════════════════════════════════════════════════

export function ProfileIgnition({ onComplete }: { onComplete?: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 600),
      setTimeout(() => setPhase(3), 1000),
      setTimeout(() => {
        setPhase(4);
        onComplete?.();
      }, 2000),
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center pointer-events-none"
      style={{ background: 'radial-gradient(circle at center, rgba(168, 85, 247, 0.2) 0%, transparent 70%)' }}
    >
      <div className="relative">
        {/* Central burst */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: phase >= 1 ? [0, 2, 3] : 0,
            opacity: phase >= 1 ? [1, 0.8, 0] : 0
          }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-32 h-32 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
          style={{
            background: 'radial-gradient(circle, rgba(255, 215, 0, 0.8) 0%, rgba(168, 85, 247, 0.4) 50%, transparent 70%)',
          }}
        />

        {/* 13.13 MHz frequency text */}
        {phase >= 2 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <motion.p
              animate={{ 
                textShadow: [
                  '0 0 20px rgba(255, 215, 0, 0.8)',
                  '0 0 40px rgba(168, 85, 247, 0.8)',
                  '0 0 20px rgba(0, 212, 255, 0.8)',
                ]
              }}
              transition={{ duration: 0.5, repeat: 3 }}
              className="text-3xl font-bold"
              style={{ color: '#ffd700' }}
            >
              13.13 MHz
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-white/60 mt-2 uppercase tracking-widest"
            >
              Soul Anchored
            </motion.p>
          </motion.div>
        )}

        {/* Stardust particles */}
        {phase >= 3 && (
          <>
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: 0, 
                  y: 0, 
                  scale: 0,
                  opacity: 1 
                }}
                animate={{ 
                  x: (Math.random() - 0.5) * 200,
                  y: (Math.random() - 0.5) * 200,
                  scale: [0, 1, 0],
                  opacity: [1, 1, 0]
                }}
                transition={{ duration: 1, delay: i * 0.02 }}
                className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full"
                style={{
                  background: ['#ffd700', '#a855f7', '#00d4ff', '#ff69b4'][i % 4],
                  boxShadow: `0 0 10px ${['#ffd700', '#a855f7', '#00d4ff', '#ff69b4'][i % 4]}`,
                }}
              />
            ))}
          </>
        )}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMBINED SIREN-GLIMMER SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

export function SirenGlimmerSystem() {
  return (
    <>
      <TouchRipples />
      <GlitchReveal />
      <AeroWatchingIndicator />
      <UniversalAwakeningBar />
    </>
  );
}
