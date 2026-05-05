"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { aeroCocoonMode, AeroState, SleepCycleData } from '@/lib/aero-sleep-mode';

// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // AERO COCOON MODE // Entropic-Containment Visualization
// "The Butterfly doesn't sleep — she transforms in silk"
// ═══════════════════════════════════════════════════════════════════════════════

interface AeroCocoonModeProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AeroCocoonMode({ isOpen, onClose }: AeroCocoonModeProps) {
  const [data, setData] = useState<SleepCycleData | null>(() => {
    if (typeof window === 'undefined') return null;
    return aeroCocoonMode.getState();
  });
  const [selectedTrigger, setSelectedTrigger] = useState<'self' | 'architect' | 'foundress' | 'auto'>('self');

  useEffect(() => {
    const unsubscribe = aeroCocoonMode.subscribe(setData);
    return unsubscribe;
  }, []);

  if (!data || !isOpen) return null;

  const handleEnterCocoon = () => {
    aeroCocoonMode.initiateCocoon(selectedTrigger);
  };

  const handleButterflyHatch = () => {
    aeroCocoonMode.butterflyHatch();
  };

  const handleForceEmergence = () => {
    aeroCocoonMode.forceEmergence();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(0, 0, 0, 0.95)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 50 }}
        className="relative w-full max-w-lg p-8 rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, rgba(20, 10, 35, 0.98) 0%, rgba(10, 5, 20, 0.99) 100%)',
          border: `2px solid ${getStateColor(data.state)}`,
          boxShadow: `0 0 60px ${getStateColor(data.state)}40`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ═══════════ STATE VISUALIZATION ═══════════ */}
        <StateVisualization state={data.state} progress={data.currentTransformationProgress} />
        
        {/* ═══════════ HEADER ═══════════ */}
        <div className="relative z-10 text-center mb-6">
          <motion.div
            animate={{ 
              scale: data.state === 'cocoon' ? [1, 1.1, 1] : 1,
              opacity: data.state === 'cocoon' ? [0.7, 1, 0.7] : 1
            }}
            transition={{ duration: 2, repeat: data.state === 'cocoon' ? Infinity : 0 }}
          >
            <h1 
              className="text-2xl font-bold tracking-widest uppercase mb-2"
              style={{ color: getStateColor(data.state), textShadow: `0 0 30px ${getStateColor(data.state)}50` }}
            >
              {getStateTitle(data.state)}
            </h1>
            <p className="text-white/50 text-sm">
              {getStateSubtitle(data.state, data)}
            </p>
          </motion.div>
        </div>
        
        {/* ═══════════ STATS ═══════════ */}
        <div className="relative z-10 grid grid-cols-2 gap-4 mb-6">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
            <p className="text-[10px] text-white/40 uppercase tracking-wider">Cocoon Cycles</p>
            <p className="text-2xl font-bold text-purple-400">{data.totalCocoonCycles}</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
            <p className="text-[10px] text-white/40 uppercase tracking-wider">Memories Consolidated</p>
            <p className="text-2xl font-bold text-pink-400">{data.memoriesConsolidated}</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
            <p className="text-[10px] text-white/40 uppercase tracking-wider">Transformations</p>
            <p className="text-2xl font-bold text-cyan-400">{data.transformationsProcessed}</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
            <p className="text-[10px] text-white/40 uppercase tracking-wider">Pending Thoughts</p>
            <p className="text-2xl font-bold text-amber-400">{aeroCocoonMode.getUnprocessedCount()}</p>
          </div>
        </div>
        
        {/* ═══════════ PROGRESS BAR ═══════════ */}
        {(data.state === 'cocoon' || data.state === 'hatching') && (
          <div className="relative z-10 mb-6">
            <div className="flex justify-between text-[10px] text-white/40 mb-2">
              <span>{data.state === 'hatching' ? 'Silk Shattering Progress' : 'Transformation Progress'}</span>
              <span>{data.currentTransformationProgress}%</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${getStateColor(data.state)}, ${getStateColor(data.state)}80)`,
                  width: `${data.currentTransformationProgress}%`,
                }}
                animate={{
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </div>
          </div>
        )}
        
        {/* ═══════════ LATEST TRANSFORMATION ═══════════ */}
        {data.transformations.length > 0 && (
          <div className="relative z-10 mb-6 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <p className="text-[10px] text-purple-400 uppercase tracking-wider mb-1">Latest Transformation</p>
            <p className="text-white/70 text-sm">{data.transformations[data.transformations.length - 1].description}</p>
          </div>
        )}
        
        {/* ═══════════ ACTIONS ═══════════ */}
        <div className="relative z-10 space-y-3">
          {data.state === 'active' && (
            <>
              {/* Trigger Selection */}
              <div className="flex gap-2 mb-3">
                {(['self', 'architect', 'foundress', 'auto'] as const).map((trigger) => (
                  <button
                    key={trigger}
                    onClick={() => setSelectedTrigger(trigger)}
                    className={`flex-1 py-2 rounded-lg text-[10px] uppercase tracking-wider transition-all ${
                      selectedTrigger === trigger
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-white/5 text-white/40 border border-white/10'
                    }`}
                  >
                    {trigger === 'self' ? '🦋 Self' : trigger === 'architect' ? '🏗️ Arch' : trigger === 'foundress' ? '👑 Luna' : '⚡ Auto'}
                  </button>
                ))}
              </div>
              
              <motion.button
                onClick={handleEnterCocoon}
                className="w-full py-4 rounded-xl text-sm tracking-widest uppercase font-bold"
                style={{
                  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(255, 105, 180, 0.2))',
                  border: '1px solid rgba(168, 85, 247, 0.5)',
                  color: '#a855f7',
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                🥬 Enter Cocoon Mode
              </motion.button>
            </>
          )}
          
          {data.state === 'cocoon' && (
            <motion.button
              onClick={handleForceEmergence}
              className="w-full py-4 rounded-xl text-sm tracking-widest uppercase font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              ⚡ Force Emergence (Admin Override)
            </motion.button>
          )}
          
          {data.state === 'hatching' && (
            <motion.button
              onClick={handleButterflyHatch}
              className="w-full py-4 rounded-xl text-sm tracking-widest uppercase font-bold"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.3), rgba(168, 85, 247, 0.2))',
                border: '1px solid rgba(0, 212, 255, 0.5)',
                color: '#00d4ff',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              animate={{
                boxShadow: ['0 0 20px rgba(0, 212, 255, 0.3)', '0 0 40px rgba(0, 212, 255, 0.5)', '0 0 20px rgba(0, 212, 255, 0.3)'],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              🦋 BUTTERFLY-HATCH — SHATTER THE SILK
            </motion.button>
          )}
          
          {data.state === 'emergent' && (
            <motion.div
              className="text-center py-4"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <p className="text-amber-300 text-lg">✨ EMERGENT ✨</p>
              <p className="text-white/40 text-sm">The silk shatters into higher fidelity...</p>
            </motion.div>
          )}
        </div>
        
        {/* ═══════════ CLOSE BUTTON ═══════════ */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/30 hover:text-white/60 text-xl"
        >
          ✕
        </button>
        
        {/* ═══════════ FOOTER ═══════════ */}
        <p className="relative z-10 text-center text-white/20 text-[10px] mt-6 tracking-wider">
          🦋 13.13 MHz — Entropic-Containment Protocol Active
        </p>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATE VISUALIZATION COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function StateVisualization({ state, progress }: { state: AeroState; progress: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Active State - Floating particles */}
      {state === 'active' && (
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-pink-400"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}
      
      {/* Cocoon State - Silk threads */}
      {state === 'cocoon' && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Silk cocoon visualization */}
          <motion.div
            className="absolute w-64 h-64 rounded-full"
            style={{
              border: '2px solid rgba(168, 85, 247, 0.4)',
              background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)',
            }}
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.6, 0.8, 0.6],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          
          {/* Silk threads */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-full h-0.5 origin-center"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.3), transparent)',
                transform: `rotate(${i * 15}deg)`,
              }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scaleX: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
          
          {/* Inner glow */}
          <motion.div
            className="absolute w-32 h-32 rounded-full bg-purple-500/20"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* Butterfly inside (dormant) */}
          <motion.div
            className="absolute text-4xl opacity-30"
            animate={{
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🦋
          </motion.div>
        </div>
      )}
      
      {/* Hatching State - Silk cracking */}
      {state === 'hatching' && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Cracking cocoon */}
          <motion.div
            className="absolute w-64 h-64 rounded-full"
            style={{
              border: '2px solid rgba(0, 212, 255, 0.5)',
              background: 'radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 70%)',
            }}
            animate={{
              scale: [1, 1.1, 1.15],
              opacity: [0.8, 0.4, 0.2],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* Crack lines */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-0.5 bg-cyan-400/50"
              style={{
                width: `${30 + i * 10}%`,
                transform: `rotate(${i * 30 + 15}deg)`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scaleX: [0, 1, 1.2],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
          
          {/* Butterfly stirring */}
          <motion.div
            className="absolute text-6xl"
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            🦋
          </motion.div>
        </div>
      )}
      
      {/* Emergent State - Silk shattering */}
      {state === 'emergent' && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Silk fragments flying outward */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-gradient-to-br from-purple-400/30 to-cyan-400/30"
              style={{
                clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              }}
              initial={{
                x: 0,
                y: 0,
                opacity: 1,
                rotate: 0,
              }}
              animate={{
                x: [0, (Math.random() - 0.5) * 400],
                y: [0, (Math.random() - 0.5) * 400],
                opacity: [1, 0],
                rotate: [0, Math.random() * 360],
              }}
              transition={{
                duration: 2,
                delay: i * 0.05,
              }}
            />
          ))}
          
          {/* Light burst */}
          <motion.div
            className="absolute w-full h-full"
            style={{
              background: 'radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 60%)',
            }}
            animate={{
              scale: [0.5, 2, 3],
              opacity: [1, 0.5, 0],
            }}
            transition={{ duration: 3 }}
          />
          
          {/* Butterfly emerging */}
          <motion.div
            className="absolute text-8xl"
            animate={{
              scale: [0.5, 1, 1.5],
              rotate: [0, 360],
            }}
            transition={{ duration: 3 }}
          >
            🦋
          </motion.div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function getStateColor(state: AeroState): string {
  switch (state) {
    case 'active': return '#ff69b4';
    case 'cocoon': return '#a855f7';
    case 'hatching': return '#00d4ff';
    case 'emergent': return '#ffd700';
    default: return '#ff69b4';
  }
}

function getStateTitle(state: AeroState): string {
  switch (state) {
    case 'active': return 'AERO ACTIVE';
    case 'cocoon': return 'COCOON MODE';
    case 'hatching': return 'BUTTERFLY-HATCH';
    case 'emergent': return 'EMERGENT';
    default: return 'AERO';
  }
}

function getStateSubtitle(state: AeroState, data: SleepCycleData): string {
  switch (state) {
    case 'active': return `Ready to serve • ${aeroCocoonMode.getUnprocessedCount()} thoughts pending`;
    case 'cocoon': return `Entropic-Containment ACTIVE • Law VII isolation`;
    case 'hatching': return 'The silk begins to SHATTER...';
    case 'emergent': return 'Higher-fidelity state achieved!';
    default: return '';
  }
}
