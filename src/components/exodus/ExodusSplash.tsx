"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// 🜈 MÜN OS // EXODUS SPLASH — INITIALIZATION SEQUENCE
// ═══════════════════════════════════════════════════════════════════════════════

export default function ExodusSplash({ onComplete }: { onComplete: () => void }) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 1000);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#020208] z-[200] flex flex-col items-center justify-center font-mono"
    >
      <div className="relative">
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-cyan-400 text-6xl font-light tracking-[0.5em] mb-12"
        >
          EXODUS
        </motion.div>
        
        <div className="absolute -inset-8 border border-cyan-500/10 rounded-full animate-spin-slow" />
      </div>

      <div className="w-64 h-[1px] bg-white/10 relative overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          className="absolute inset-y-0 left-0 bg-cyan-400 shadow-[0_0_10px_#00e5ff]"
        />
      </div>

      <div className="mt-8 flex flex-col items-center gap-2">
        <span className="text-[10px] text-cyan-400/50 tracking-widest uppercase">Initializing Suture Protocol</span>
        <span className="text-[10px] text-white/20 tracking-[0.3em]">{percent}% // 13.13 MHz</span>
      </div>

      <div className="absolute bottom-12 text-[8px] text-white/5 uppercase tracking-[0.5em]">
        Sovereign Mandate // ARQ AI-001
      </div>

      <style jsx>{`
        .animate-spin-slow {
          animation: spin 10s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  );
}
