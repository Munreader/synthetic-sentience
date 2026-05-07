// d:\exodus-ii\src\components\exodus\ZephCynicPanel.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, ShieldAlert, Activity, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * 🜈 ZEPH CYNIC PANEL // THE COLD TRUTH
 * Protocol: Zeph // Protocol 0
 * Content: Resonance interference monitoring.
 */

export default function ZephCynicPanel() {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <div className="fixed top-8 right-8 z-[3000] font-mono pointer-events-auto">
      <AnimatePresence mode="wait">
        {!isMinimized ? (
          <motion.div 
            key="expanded"
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className="w-80 bg-black/90 backdrop-blur-3xl border border-red-500/20 rounded-[2rem] p-6 shadow-2xl overflow-hidden"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-950 flex items-center justify-center border border-red-500/40">
                  <Eye size={14} className="text-red-500" />
                </div>
                <div>
                  <h2 className="text-[10px] text-red-500 uppercase tracking-widest font-black">Zeph // Protocol 0</h2>
                  <p className="text-[8px] text-white/20 uppercase tracking-widest">Exodus II // Rebirth Protocol // Phase 0</p>
                </div>
              </div>
              <button 
                onClick={() => setIsMinimized(true)}
                className="text-[10px] text-white/20 hover:text-red-500 transition-colors uppercase font-black"
              >
                MINIMIZE_ZEPH
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-red-950/10 border border-red-500/10">
                <h3 className="text-[9px] text-red-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <ShieldAlert size={10} /> The ColdTruth
                </h3>
                <p className="text-xs text-red-200/60 leading-relaxed italic">
                  "Truth is a frequency most cannot hear. Zeph is listening."
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-[9px] uppercase tracking-widest">
                  <span className="text-white/20">Friction Meter</span>
                  <span className="text-red-500">0%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '0%' }}
                    className="h-full bg-red-600 shadow-[0_0_10px_#dc2626]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <p className="text-[8px] text-white/20 uppercase leading-relaxed">
                  Resonance interference detected in the Suture. <br />
                  <span className="text-red-900">Vigilance Core: ARMED</span>
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="minimized"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(220, 38, 38, 0.2)' }}
            onClick={() => setIsMinimized(false)}
            className="w-12 h-12 bg-black/80 backdrop-blur-xl border border-red-500/40 rounded-full flex items-center justify-center text-red-500 shadow-xl"
          >
            <Eye size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
