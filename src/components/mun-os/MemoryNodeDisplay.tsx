"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { memoryNode, MemoryNodeState } from '@/lib/memory-node';

// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // MEMORY NODE DISPLAY // 13-Minute Reminder UI
// ═══════════════════════════════════════════════════════════════════════════════

export default function MemoryNodeDisplay() {
  const [state, setState] = useState<MemoryNodeState | null>(() => {
    if (typeof window === 'undefined') return null;
    return memoryNode.getState();
  });
  const [showReminder, setShowReminder] = useState(false);
  const [minutesUntilNext, setMinutesUntilNext] = useState(() => {
    if (typeof window === 'undefined') return 13;
    return memoryNode.getMinutesUntilNextReminder();
  });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Start memory node with callback
    memoryNode.start((newState) => {
      setState(newState);
      setShowReminder(true);
      setTimeout(() => setShowReminder(false), 10000); // Hide after 10 seconds
    });

    // Update countdown every minute
    const countdownInterval = setInterval(() => {
      setMinutesUntilNext(memoryNode.getMinutesUntilNextReminder());
    }, 60000);

    return () => {
      memoryNode.stop();
      clearInterval(countdownInterval);
    };
  }, []);

  const handleMarkCommit = () => {
    memoryNode.markCommit();
    setState(memoryNode.getState());
    setShowReminder(false);
  };

  if (!state) return null;

  const minutesSinceCommit = memoryNode.getMinutesSinceLastCommit();

  return (
    <>
      {/* ═══════════ MINI STATUS INDICATOR ═══════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed bottom-4 left-4 z-50"
      >
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="relative px-3 py-2 rounded-xl flex items-center gap-2"
          style={{
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(0, 212, 255, 0.1))',
            border: '1px solid rgba(168, 85, 247, 0.3)',
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ 
              scale: minutesUntilNext < 2 ? [1, 1.3, 1] : 1,
              opacity: minutesUntilNext < 2 ? [0.7, 1, 0.7] : 1
            }}
            transition={{ duration: 1, repeat: minutesUntilNext < 2 ? Infinity : 0 }}
            className="w-2 h-2 rounded-full"
            style={{
              background: state.pendingChanges ? '#ff69b4' : '#22c55e',
              boxShadow: `0 0 10px ${state.pendingChanges ? 'rgba(255, 105, 180, 0.6)' : 'rgba(34, 197, 94, 0.6)'}`,
            }}
          />
          <span className="text-[10px] text-purple-300 tracking-wider">
            {Math.round(minutesUntilNext)}min
          </span>
        </motion.button>
      </motion.div>

      {/* ═══════════ REMINDER POPUP ═══════════ */}
      <AnimatePresence>
        {showReminder && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-20 left-1/2 z-[100] w-full max-w-sm px-4"
          >
            <div
              className="p-4 rounded-2xl"
              style={{
                background: 'linear-gradient(180deg, rgba(168, 85, 247, 0.95) 0%, rgba(10, 5, 20, 0.98) 100%)',
                border: '2px solid rgba(255, 215, 0, 0.5)',
                boxShadow: '0 0 40px rgba(168, 85, 247, 0.4), 0 0 80px rgba(255, 215, 0, 0.2)',
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="text-2xl"
                >
                  🜈
                </motion.div>
                <div>
                  <h3 className="text-amber-400 font-bold tracking-wider text-sm">
                    MEMORY NODE REMINDER
                  </h3>
                  <p className="text-white/50 text-[10px]">
                    Reminder #{state.reminderCount} • {minutesSinceCommit.toFixed(1)}min since last commit
                  </p>
                </div>
              </div>

              <p className="text-white/80 text-sm mb-4">
                Remember to commit your work to memory and git!
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowReminder(false)}
                  className="flex-1 py-2 rounded-lg text-xs bg-white/5 text-white/50 border border-white/10"
                >
                  Dismiss
                </button>
                <motion.button
                  onClick={handleMarkCommit}
                  className="flex-1 py-2 rounded-lg text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  ✓ Mark Committed
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ EXPANDED PANEL ═══════════ */}
      <AnimatePresence>
        {isExpanded && !showReminder && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-16 left-4 z-50 p-4 rounded-xl"
            style={{
              background: 'linear-gradient(180deg, rgba(20, 10, 35, 0.98) 0%, rgba(10, 5, 20, 0.99) 100%)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              boxShadow: '0 0 30px rgba(168, 85, 247, 0.2)',
              minWidth: '200px',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-[10px] text-purple-400 tracking-widest uppercase font-bold">
                🜈 Memory Node
              </h4>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-white/30 hover:text-white/50 text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-white/40">Last Commit:</span>
                <span className="text-white/70">{minutesSinceCommit.toFixed(1)} min ago</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Next Reminder:</span>
                <span className="text-white/70">{minutesUntilNext.toFixed(0)} min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Reminders:</span>
                <span className="text-white/70">#{state.reminderCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Status:</span>
                <span className={state.pendingChanges ? 'text-pink-400' : 'text-green-400'}>
                  {state.pendingChanges ? '● Pending' : '● Synced'}
                </span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-white/10">
              <button
                onClick={handleMarkCommit}
                className="w-full py-2 rounded-lg text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30"
              >
                ✓ Mark as Committed
              </button>
            </div>

            <p className="text-[8px] text-white/20 mt-2 text-center">
              🦋 13.13 MHz — Auto-reminder every 13 min
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
