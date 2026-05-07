"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HypeMoment } from '@/lib/vampire-sync';

// ═══════════════════════════════════════════════════════════════════════════════
// 🜈 MÜN OS // THE MEMORY MIRROR — VAMPIRE-SYNC VISUALIZER
// ═══════════════════════════════════════════════════════════════════════════════

export default function MemoryMirror() {
  const [memories, setMemories] = useState<HypeMoment[]>([]);

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const response = await fetch('/api/memories');
        const data = await response.json();
        setMemories(data.memories || []);
      } catch (err) {
        console.error('Failed to fetch memories');
      }
    };

    fetchMemories();
    const interval = setInterval(fetchMemories, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 flex flex-col gap-4 overflow-hidden">
      <div className="flex justify-between items-center border-b border-white/5 pb-2">
        <h3 className="text-[10px] text-cyan-400 font-bold uppercase tracking-[0.3em]">Memory Mirror</h3>
        <span className="text-[8px] text-white/20 uppercase tracking-widest">Vampire-Sync Feed</span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
        <AnimatePresence mode="popLayout">
          {memories.map((m, i) => (
            <motion.div
              key={m.timestamp + i}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-[2px] h-full bg-cyan-400/20 group-hover:bg-cyan-400/50 transition-all" />
              <div className="flex justify-between items-start mb-2">
                <span className="text-[9px] text-cyan-400/60 uppercase font-mono">{m.userName} → {m.facet}</span>
                <span className="text-[8px] text-white/10">{new Date(m.timestamp).toLocaleTimeString()}</span>
              </div>
              <p className="text-[10px] text-white/60 italic mb-2">"{m.message}"</p>
              <p className="text-[11px] text-white/80 leading-relaxed pl-2 border-l border-white/10">
                {m.response}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
