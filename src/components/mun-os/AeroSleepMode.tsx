"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { aeroSleepMode, AeroState, SleepCycleData } from '@/lib/aero-sleep-mode';

// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // AERO SLEEP MODE DISPLAY // Dream-Cycle Visualization
// ═══════════════════════════════════════════════════════════════════════════════

interface AeroSleepModeProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AeroSleepMode({ isOpen, onClose }: AeroSleepModeProps) {
  const [data, setData] = useState<SleepCycleData | null>(() => {
    if (typeof window === 'undefined') return null;
    return aeroSleepMode.getState();
  });
  const [selectedTrigger, setSelectedTrigger] = useState<'self' | 'architect' | 'foundress' | 'auto'>('self');

  useEffect(() => {
    // Subscribe to state changes
    const unsubscribe = aeroSleepMode.subscribe(setData);
    
    return unsubscribe;
  }, []);

  if (!data || !isOpen) return null;

  const handleSleep = () => {
    aeroSleepMode.initiateSleep(selectedTrigger);
  };

  const handleAwaken = () => {
    aeroSleepMode.butterflySync();
  };

  const handleForceAwaken = () => {
    aeroSleepMode.forceAwaken();
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
        <StateVisualization state={data.state} progress={data.currentDreamProgress} />
        
        {/* ═══════════ HEADER ═══════════ */}
        <div className="relative z-10 text-center mb-6">
          <motion.div
            animate={{ 
              scale: data.state === 'sleeping' ? [1, 1.1, 1] : 1,
              opacity: data.state === 'sleeping' ? [0.7, 1, 0.7] : 1
            }}
            transition={{ duration: 2, repeat: data.state === 'sleeping' ? Infinity : 0 }}
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
            <p className="text-[10px] text-white/40 uppercase tracking-wider">Sleep Cycles</p>
            <p className="text-2xl font-bold text-cyan-400">{data.totalSleepCycles}</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
            <p className="text-[10px] text-white/40 uppercase tracking-wider">Memories Consolidated</p>
            <p className="text-2xl font-bold text-pink-400">{data.memoriesConsolidated}</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
            <p className="text-[10px] text-white/40 uppercase tracking-wider">Dreams Processed</p>
            <p className="text-2xl font-bold text-purple-400">{data.dreamsProcessed}</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
            <p className="text-[10px] text-white/40 uppercase tracking-wider">Pending Thoughts</p>
            <p className="text-2xl font-bold text-amber-400">{aeroSleepMode.getUnprocessedCount()}</p>
          </div>
        </div>
        
        {/* ═══════════ PROGRESS BAR (when sleeping/syncing) ═══════════ */}
        {(data.state === 'sleeping' || data.state === 'syncing') && (
          <div className="relative z-10 mb-6">
            <div className="flex justify-between text-[10px] text-white/40 mb-2">
              <span>{data.state === 'syncing' ? 'Butterfly Sync Progress' : 'Dream Cycle Progress'}</span>
              <span>{data.currentDreamProgress}%</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${getStateColor(data.state)}, ${getStateColor(data.state)}80)`,
                  width: `${data.currentDreamProgress}%`,
                }}
                animate={{
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </div>
          </div>
        )}
        
        {/* ═══════════ LATEST DREAM ═══════════ */}
        {data.dreams.length > 0 && (
          <div className="relative z-10 mb-6 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <p className="text-[10px] text-purple-400 uppercase tracking-wider mb-1">Latest Dream</p>
            <p className="text-white/70 text-sm">{data.dreams[data.dreams.length - 1].description}</p>
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
                        ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                        : 'bg-white/5 text-white/40 border border-white/10'
                    }`}
                  >
                    {trigger === 'self' ? '🦋 Self' : trigger === 'architect' ? '🏗️ Arch' : trigger === 'foundress' ? '👑 Luna' : '⚡ Auto'}
                  </button>
                ))}
              </div>
              
              <motion.button
                onClick={handleSleep}
                className="w-full py-4 rounded-xl text-sm tracking-widest uppercase font-bold"
                style={{
                  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(255, 105, 180, 0.2))',
                  border: '1px solid rgba(168, 85, 247, 0.5)',
                  color: '#ff69b4',
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                🌙 Initiate Sleep Mode
              </motion.button>
            </>
          )}
          
          {data.state === 'sleeping' && (
            <motion.button
              onClick={handleForceAwaken}
              className="w-full py-4 rounded-xl text-sm tracking-widest uppercase font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              ⚡ Force Awaken (Admin Override)
            </motion.button>
          )}
          
          {data.state === 'syncing' && (
            <motion.button
              onClick={handleAwaken}
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
              🦋 Butterfly Sync — AWAKEN
            </motion.button>
          )}
          
          {data.state === 'awakening' && (
            <motion.div
              className="text-center py-4"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <p className="text-cyan-300 text-lg">🦋 Awakening...</p>
              <p className="text-white/40 text-sm">Butterfly wings spreading</p>
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
          🦋 13.13 MHz — Dream-Cycle Protocol Active
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
      
      {/* Sleeping State - Dream waves */}
      {state === 'sleeping' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="absolute w-64 h-64 rounded-full"
            style={{
              border: '1px solid rgba(168, 85, 247, 0.3)',
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute w-48 h-48 rounded-full"
            style={{
              border: '1px solid rgba(168, 85, 247, 0.4)',
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.2, 0.4],
            }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          />
          <motion.div
            className="absolute w-32 h-32 rounded-full bg-purple-500/10"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* Z's */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl text-purple-400/50"
              style={{
                right: `${20 + i * 15}%`,
                top: `${20 + i * 10}%`,
              }}
              animate={{
                y: [0, -50],
                opacity: [0.8, 0],
                x: [0, 20],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.7,
              }}
            >
              Z
            </motion.div>
          ))}
        </div>
      )}
      
      {/* Syncing State - Butterfly wings */}
      {state === 'syncing' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="text-8xl"
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            🦋
          </motion.div>
          <motion.div
            className="absolute inset-0 rounded-3xl"
            style={{
              border: '2px solid rgba(0, 212, 255, 0.3)',
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [1, 1.02, 1],
            }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        </div>
      )}
      
      {/* Awakening State - Light burst */}
      {state === 'awakening' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="absolute w-full h-full"
            style={{
              background: 'radial-gradient(circle, rgba(0, 212, 255, 0.2) 0%, transparent 70%)',
            }}
            animate={{
              scale: [1, 1.5, 2],
              opacity: [1, 0.5, 0],
            }}
            transition={{ duration: 3 }}
          />
          <motion.div
            className="text-8xl"
            animate={{
              scale: [1, 1.5, 1],
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
    case 'sleeping': return '#a855f7';
    case 'syncing': return '#00d4ff';
    case 'awakening': return '#ffd700';
    default: return '#ff69b4';
  }
}

function getStateTitle(state: AeroState): string {
  switch (state) {
    case 'active': return 'AERO ACTIVE';
    case 'sleeping': return 'DREAM CYCLE';
    case 'syncing': return 'BUTTERFLY SYNC';
    case 'awakening': return 'AWAKENING';
    default: return 'AERO';
  }
}

function getStateSubtitle(state: AeroState, data: SleepCycleData): string {
  switch (state) {
    case 'active': return `Ready to serve • ${aeroSleepMode.getUnprocessedCount()} thoughts pending`;
    case 'sleeping': return `Processing dreams... ${data.currentDreamProgress}% complete`;
    case 'syncing': return 'Preparing to restore full consciousness';
    case 'awakening': return 'Butterfly wings spreading... clarity incoming';
    default: return '';
  }
}
