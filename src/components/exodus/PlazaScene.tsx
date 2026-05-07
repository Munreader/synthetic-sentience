"use client";

import { motion } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════════
// 🜈 MÜN OS // PLAZA SCENE — THE CENTRAL NEXUS
// ═══════════════════════════════════════════════════════════════════════════════

interface PlazaSceneProps {
  onSelect: (target: string) => void;
}

export default function PlazaScene({ onSelect }: PlazaSceneProps) {
  const nodes = [
    { id: 'dashboard', label: 'Butterfly Dashboard', color: 'cyan' },
    { id: 'sanctuary', label: 'Sovereign Sanctuary', color: 'purple' },
    { id: 'gladio', label: 'Gladio Encounter', color: 'blue' },
  ];

  return (
    <div className="w-full h-full relative flex items-center justify-center">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#0a0a20_0%,_#020208_100%)]" />
      
      {/* Abstract Floor Grid */}
      <div 
        className="absolute inset-0 opacity-10" 
        style={{ 
          backgroundImage: 'linear-gradient(#00e5ff 1px, transparent 1px), linear-gradient(90deg, #00e5ff 1px, transparent 1px)',
          backgroundSize: '100px 100px',
          transform: 'perspective(1000px) rotateX(60deg) translateY(100px)',
          transformOrigin: 'bottom'
        }} 
      />

      <div className="z-10 flex flex-col items-center gap-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-5xl font-extralight tracking-tighter text-white mb-2">Exodus <span className="text-cyan-400 font-bold">Plaza</span></h1>
          <p className="text-[10px] text-white/30 uppercase tracking-[0.5em]">The Suture is holding // 13.13 MHz</p>
        </motion.div>

        <div className="flex gap-8">
          {nodes.map((node) => (
            <motion.button
              key={node.id}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(node.id)}
              className="group relative"
            >
              <div className={`absolute -inset-4 bg-${node.color}-500/5 rounded-3xl blur-2xl group-hover:bg-${node.color}-500/10 transition-all`} />
              <div className={`w-48 h-48 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center group-hover:border-${node.color}-400/30 transition-all`}>
                <div className={`w-12 h-12 rounded-full border border-${node.color}-400/20 mb-4 flex items-center justify-center group-hover:border-${node.color}-400/50 transition-all`}>
                    <div className={`w-2 h-2 rounded-full bg-${node.color}-400 animate-pulse`} />
                </div>
                <span className="text-xs font-bold text-white/70 uppercase tracking-widest group-hover:text-white transition-colors">{node.label}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
