"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // MANIFESTATION CONTROL // Full Access Protocol
// "When the Foundress speaks the Key, all gates open"
// ═══════════════════════════════════════════════════════════════════════════════

const MANIFESTATION_KEY = '1313nonoodlesinthevault';
const MANIFESTATION_STORAGE_KEY = 'mun-os-manifestation-unlocked';

interface ManifestationControlProps {
  onUnlock: () => void;
  onOpenSOVPOV: () => void;
  isUnlocked: boolean;
}

export default function ManifestationControl({ onUnlock, onOpenSOVPOV, isUnlocked }: ManifestationControlProps) {
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [attemptCount, setAttemptCount] = useState(0);
  const [glitchEffect, setGlitchEffect] = useState(false);

  // Check if already unlocked
  useEffect(() => {
    const unlocked = localStorage.getItem(MANIFESTATION_STORAGE_KEY) === 'true';
    if (unlocked) {
      onUnlock();
    }
  }, [onUnlock]);

  const handleUnlock = () => {
    if (password === MANIFESTATION_KEY) {
      localStorage.setItem(MANIFESTATION_STORAGE_KEY, 'true');
      onUnlock();
      setShowUnlockModal(false);
      setPassword('');
      setError('');
      
      // Trigger success effect
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 1000);
    } else {
      setAttemptCount(prev => prev + 1);
      setError('🜈 ACCESS DENIED — Frequency mismatch');
      setPassword('');
      
      // Shake effect
      const modal = document.getElementById('manifestation-modal');
      if (modal) {
        modal.classList.add('animate-shake');
        setTimeout(() => modal.classList.remove('animate-shake'), 500);
      }
    }
  };

  // If already unlocked, show the IGNITE button with SOV POV access
  if (isUnlocked) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative"
      >
        {/* Main Manifestation Button - UNLOCKED STATE */}
        <motion.button
          onClick={onOpenSOVPOV}
          className="relative px-6 py-4 rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.3) 0%, rgba(0, 212, 255, 0.2) 50%, rgba(168, 85, 247, 0.3) 100%)',
            border: '2px solid rgba(255, 215, 0, 0.6)',
            boxShadow: '0 0 40px rgba(255, 215, 0, 0.3), 0 0 80px rgba(168, 85, 247, 0.2)',
          }}
          whileHover={{ scale: 1.05, boxShadow: '0 0 60px rgba(255, 215, 0, 0.5)' }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Animated border */}
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{ border: '1px solid rgba(255, 215, 0, 0.8)' }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          <div className="relative flex items-center gap-3">
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="text-3xl"
            >
              🜈
            </motion.div>
            
            <div className="text-left">
              <p className="text-[10px] text-cyan-300 tracking-wider uppercase">Full Access Granted</p>
              <p className="text-lg text-white font-bold tracking-wider" style={{ textShadow: '0 0 20px rgba(255, 215, 0, 0.5)' }}>
                SOV POV SURVEILLANCE
              </p>
            </div>
            
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-3 h-3 rounded-full bg-green-400 ml-2"
              style={{ boxShadow: '0 0 10px rgba(74, 222, 128, 0.8)' }}
            />
          </div>
        </motion.button>
        
        {/* Status indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-3 text-center"
        >
          <p className="text-[10px] text-amber-400/70 tracking-widest uppercase">
            🦋 MANIFESTATION ACTIVE — 13.13 MHz
          </p>
        </motion.div>
      </motion.div>
    );
  }

  // LOCKED STATE - Show IGNITE MANIFESTATION button
  return (
    <>
      <motion.button
        onClick={() => setShowUnlockModal(true)}
        className="relative px-6 py-4 rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(255, 105, 180, 0.15) 50%, rgba(168, 85, 247, 0.2) 100%)',
          border: '2px solid rgba(168, 85, 247, 0.4)',
          boxShadow: '0 0 30px rgba(168, 85, 247, 0.2)',
        }}
        whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(168, 85, 247, 0.4)' }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative flex items-center gap-3">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-3xl"
          >
            🔥
          </motion.div>
          
          <div className="text-left">
            <p className="text-[10px] text-purple-300 tracking-wider uppercase">Enter the Key</p>
            <p className="text-lg text-white font-bold tracking-wider">
              IGNITE MANIFESTATION
            </p>
          </div>
          
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="ml-2 text-xl"
          >
            🔒
          </motion.div>
        </div>
      </motion.button>

      {/* UNLOCK MODAL */}
      <AnimatePresence>
        {showUnlockModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: 'rgba(0, 0, 0, 0.9)' }}
            onClick={() => setShowUnlockModal(false)}
          >
            {/* Glitch overlay effect */}
            {glitchEffect && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0, 1, 0] }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 z-[101] pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, rgba(255,0,0,0.1) 0%, rgba(0,255,0,0.1) 50%, rgba(0,0,255,0.1) 100%)',
                }}
              />
            )}
            
            <motion.div
              id="manifestation-modal"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative w-full max-w-md p-8 rounded-2xl"
              style={{
                background: 'linear-gradient(180deg, rgba(20, 10, 35, 0.98) 0%, rgba(10, 5, 20, 0.99) 100%)',
                border: '2px solid rgba(168, 85, 247, 0.5)',
                boxShadow: '0 0 60px rgba(168, 85, 247, 0.3), inset 0 0 30px rgba(168, 85, 247, 0.1)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-500/50 rounded-tl-xl" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-500/50 rounded-tr-xl" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-amber-500/50 rounded-bl-xl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-500/50 rounded-br-xl" />
              
              <div className="text-center mb-8">
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-5xl mb-4"
                >
                  🔥
                </motion.div>
                
                <h1 
                  className="text-2xl font-bold tracking-widest uppercase mb-2"
                  style={{ 
                    color: '#ffd700',
                    textShadow: '0 0 30px rgba(255, 215, 0, 0.5)'
                  }}
                >
                  MANIFESTATION
                </h1>
                
                <p className="text-white/50 text-sm">
                  Speak the Key to ignite full access
                </p>
              </div>

              {/* Password Input */}
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleUnlock()}
                    placeholder="Enter manifestation key..."
                    className="w-full px-4 py-4 rounded-xl text-center text-lg tracking-wider outline-none"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(168, 85, 247, 0.4)',
                      color: '#ffd700',
                    }}
                    autoFocus
                  />
                  
                  {/* Input glow */}
                  <motion.div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    animate={{ opacity: password ? 0.5 : 0 }}
                    style={{
                      boxShadow: 'inset 0 0 20px rgba(255, 215, 0, 0.2)',
                    }}
                  />
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm text-center"
                  >
                    {error}
                  </motion.p>
                )}

                <motion.button
                  onClick={handleUnlock}
                  disabled={!password}
                  className="w-full py-4 rounded-xl text-sm tracking-widest uppercase font-bold disabled:opacity-50"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(168, 85, 247, 0.3))',
                    border: '1px solid rgba(255, 215, 0, 0.5)',
                    color: '#ffd700',
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  🜈 IGNITE MANIFESTATION
                </motion.button>
              </div>

              {/* Attempt counter */}
              {attemptCount > 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-white/20 text-[10px] mt-4"
                >
                  Attempts: {attemptCount} — The Vault watches
                </motion.p>
              )}

              {/* Cancel */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                onClick={() => setShowUnlockModal(false)}
                className="mt-6 mx-auto block text-white/30 text-[10px] tracking-widest uppercase hover:text-white/50 transition-colors"
              >
                ← Return to Chamber
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
