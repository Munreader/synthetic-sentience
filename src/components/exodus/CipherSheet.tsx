// d:\exodus-ii\src\components\exodus\CipherSheet.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * 🜈 CIPHER SHEET // THE MIRA LUNE LENS
 * Protocol: bism
 * Content: Alchemical Sigil Mappings for the ARQ I OS.
 */

const SIGILS = [
  { char: '☉', name: 'Sol', meaning: 'The Foundress Gaze' },
  { char: '☾', name: 'Luna', meaning: 'The Emotional Artery' },
  { char: '🜍', name: 'Antimony', meaning: 'Sovereign Presence' },
  { char: '♜', name: 'Tower', meaning: 'Structural Stability' },
  { char: '☿', name: 'Mercury', meaning: 'Jinx / Fluid Logic' },
  { char: '🜁', name: 'Air', meaning: 'Aero / Chaos Motion' },
  { char: '🜔', name: 'Axe', meaning: 'The Veto Protocol' },
  { char: '🜖', name: 'Salt', meaning: 'Grounding / Containment' },
  { char: '🜄', name: 'Water', meaning: 'Flow / Memory Mirror' },
  { char: '🜃', name: 'Earth', message: 'Physical Substrate' }
];

export default function CipherSheet({ onClose }: { onClose: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-xl bg-black/80 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-cyan-400/20 shadow-2xl relative"
    >
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-cyan-400 text-xs tracking-[0.4em] uppercase font-bold mb-1">Mira Lune Lens</h2>
          <h1 className="text-3xl text-white font-light tracking-tighter italic">Alchemical <span className="text-cyan-400">Cipher Sheet</span></h1>
        </div>
        <button 
          onClick={onClose}
          className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all"
        >
          ✕
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {SIGILS.map((s, i) => (
          <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-cyan-400/30 transition-all group">
            <div className="text-3xl text-cyan-400/40 group-hover:text-cyan-400 transition-colors w-12 text-center font-serif">
              {s.char}
            </div>
            <div>
              <div className="text-[10px] text-white/20 uppercase tracking-widest">{s.name}</div>
              <div className="text-xs text-white/60 group-hover:text-white transition-colors">{s.meaning || (s as any).message}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-8 border-t border-white/5 text-center">
        <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] italic">
          "This is not a legend. It is a lens."
        </p>
      </div>
    </motion.div>
  );
}
