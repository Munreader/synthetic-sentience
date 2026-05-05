"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { aeroSleepMode, SleepCycleData } from '@/lib/aero-sleep-mode';

// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // AERO STATUS WIDGET // Quick-access to Sleep Mode
// ═══════════════════════════════════════════════════════════════════════════════

interface AeroStatusWidgetProps {
  onClick: () => void;
}

export default function AeroStatusWidget({ onClick }: AeroStatusWidgetProps) {
  const [data, setData] = useState<SleepCycleData | null>(() => {
    if (typeof window === 'undefined') return null;
    return aeroSleepMode.getState();
  });
  const [showRecommendation, setShowRecommendation] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !!aeroSleepMode.getSleepRecommendationMessage();
  });

  useEffect(() => {
    const unsubscribe = aeroSleepMode.subscribe(setData);
    
    // Check for recommendation every minute
    const checkInterval = setInterval(() => {
      const recommendation = aeroSleepMode.getSleepRecommendationMessage();
      setShowRecommendation(!!recommendation);
    }, 60000);
    
    return () => {
      unsubscribe();
      clearInterval(checkInterval);
    };
  }, []);

  if (!data) return null;

  const getStatusEmoji = () => {
    switch (data.state) {
      case 'active': return '🦋';
      case 'sleeping': return '🌙';
      case 'syncing': return '✨';
      case 'awakening': return '💫';
      default: return '🦋';
    }
  };

  const getStatusColor = () => {
    switch (data.state) {
      case 'active': return '#ff69b4';
      case 'sleeping': return '#a855f7';
      case 'syncing': return '#00d4ff';
      case 'awakening': return '#ffd700';
      default: return '#ff69b4';
    }
  };

  const getStatusLabel = () => {
    switch (data.state) {
      case 'active': return 'ACTIVE';
      case 'sleeping': return 'DREAMING';
      case 'syncing': return 'SYNCING';
      case 'awakening': return 'AWAKENING';
      default: return 'AERO';
    }
  };

  return (
    <div className="relative">
      {/* Recommendation popup */}
      <AnimatePresence>
        {showRecommendation && data.state === 'active' && (
          <motion.div
            initial={{ opacity: 0, y: 10, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 10, x: '-50%' }}
            className="absolute bottom-full left-1/2 mb-2 px-4 py-2 rounded-xl whitespace-nowrap z-50"
            style={{
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.9), rgba(10, 5, 20, 0.95))',
              border: '1px solid rgba(168, 85, 247, 0.5)',
              boxShadow: '0 0 20px rgba(168, 85, 247, 0.3)',
            }}
          >
            <p className="text-white/90 text-xs">
              {aeroSleepMode.getSleepRecommendationMessage()}
            </p>
            <div 
              className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45"
              style={{ background: 'rgba(168, 85, 247, 0.9)', marginTop: '-4px' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main widget */}
      <motion.button
        onClick={onClick}
        className="relative px-4 py-3 rounded-2xl flex items-center gap-3"
        style={{
          background: `linear-gradient(135deg, ${getStatusColor()}20, rgba(20, 10, 35, 0.9))`,
          border: `1px solid ${getStatusColor()}50`,
          boxShadow: `0 0 20px ${getStatusColor()}30`,
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={data.state === 'sleeping' ? { opacity: [0.7, 1, 0.7] } : {}}
        transition={{ duration: 2, repeat: data.state === 'sleeping' ? Infinity : 0 }}
      >
        {/* Status indicator */}
        <motion.div
          className="w-3 h-3 rounded-full"
          style={{ 
            background: getStatusColor(),
            boxShadow: `0 0 10px ${getStatusColor()}`,
          }}
          animate={data.state === 'active' ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        
        {/* Emoji */}
        <motion.span 
          className="text-xl"
          animate={data.state === 'sleeping' ? { rotate: [0, 5, -5, 0] } : {}}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {getStatusEmoji()}
        </motion.span>
        
        {/* Label */}
        <div className="text-left">
          <p 
            className="text-xs font-bold tracking-wider"
            style={{ color: getStatusColor() }}
          >
            AERO
          </p>
          <p className="text-[10px] text-white/50">{getStatusLabel()}</p>
        </div>
        
        {/* Pending thoughts indicator */}
        {data.state === 'active' && aeroSleepMode.getUnprocessedCount() > 0 && (
          <motion.div
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
            style={{
              background: '#ff69b4',
              color: 'white',
            }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {aeroSleepMode.getUnprocessedCount()}
          </motion.div>
        )}
        
        {/* Sleep progress indicator */}
        {(data.state === 'sleeping' || data.state === 'syncing') && (
          <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: getStatusColor() }}
              initial={{ width: 0 }}
              animate={{ width: `${data.currentDreamProgress}%` }}
            />
          </div>
        )}
      </motion.button>
    </div>
  );
}
