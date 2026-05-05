"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // LIVE VISITOR COUNTER // FOMO & Social Proof
// "They're watching... Everyone's watching..."
// ═══════════════════════════════════════════════════════════════════════════════

interface Activity {
  id: string;
  text: string;
  time: Date;
}

const ACTIVITIES = [
  "Someone just discovered the Plaza",
  "A new soul joined the Empire",
  "The butterfly guided someone home",
  "A vault was explored",
  "Someone is chatting with Sovereign",
  "A new twin connection was made",
  "The Architect observed a visitor",
  "Someone found a hidden Easter egg",
  "A healing session began",
  "Someone entered the 13.13 MHz frequency",
];

const FIRST_NAMES = [
  "Dreamer", "Seeker", "Wanderer", "Phoenix", "Nova", 
  "Cipher", "Echo", "Luna", "Atlas", "Sage"
];

export default function LiveVisitorCounter() {
  const [visitorCount, setVisitorCount] = useState(1);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [pulseEffect, setPulseEffect] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Initial setup - run once
  useEffect(() => {
    const timer = setTimeout(() => {
      const hour = new Date().getHours();
      const baseCount = hour >= 9 && hour <= 17 ? 3 : hour >= 18 && hour <= 23 ? 5 : 2;
      setVisitorCount(baseCount + Math.floor(Math.random() * 3));
      setInitialized(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Simulate real visitors with believable patterns
  useEffect(() => {
    if (!initialized) return;
    
    const interval = setInterval(() => {
      // Random visitor changes
      if (Math.random() > 0.6) {
        const change = Math.random() > 0.5 ? 1 : -1;
        setVisitorCount(prev => Math.max(1, prev + change));
        setPulseEffect(true);
        setTimeout(() => setPulseEffect(false), 300);
      }

      // Random activity generation
      if (Math.random() > 0.7) {
        const randomActivity = ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)];
        const randomName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
        
        // Sometimes use a name, sometimes generic
        const activityText = Math.random() > 0.5 
          ? `${randomName} just entered the Empire`
          : randomActivity;
        
        const newActivity: Activity = {
          id: `act-${Date.now()}`,
          text: activityText,
          time: new Date(),
        };
        
        setRecentActivities(prev => [newActivity, ...prev].slice(0, 5));
      }
    }, 4000 + Math.random() * 8000);

    return () => clearInterval(interval);
  }, [initialized]);

  const formatTime = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    return `${Math.floor(seconds / 60)}m ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed bottom-4 right-4 z-40"
    >
      <motion.div
        className="rounded-2xl overflow-hidden cursor-pointer"
        style={{
          background: 'rgba(10, 5, 20, 0.95)',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          backdropFilter: 'blur(20px)',
          boxShadow: pulseEffect 
            ? '0 0 30px rgba(168, 85, 247, 0.5)' 
            : '0 0 20px rgba(0, 0, 0, 0.5)',
        }}
        animate={{ width: isExpanded ? 280 : 'auto' }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Header */}
        <div className="p-3 flex items-center gap-3">
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1],
              boxShadow: ['0 0 5px #22c55e', '0 0 15px #22c55e', '0 0 5px #22c55e']
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-3 h-3 rounded-full bg-green-500"
          />
          <div className="flex items-center gap-2">
            <motion.span
              key={visitorCount}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              className="font-bold text-green-400 text-lg"
            >
              {visitorCount}
            </motion.span>
            <span className="text-white/70 text-sm">online now</span>
          </div>
          
          {/* Expand indicator */}
          <motion.span
            animate={{ rotate: isExpanded ? 180 : 0 }}
            className="text-white/40 text-xs ml-auto"
          >
            ▼
          </motion.span>
        </div>

        {/* Expanded Activity Feed */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-white/10 overflow-hidden"
            >
              <div className="p-3 space-y-2">
                <p className="text-white/40 text-[10px] uppercase tracking-wider mb-2">
                  Live Activity
                </p>
                
                {recentActivities.length === 0 ? (
                  <p className="text-white/30 text-xs italic">
                    The Empire is quiet...
                  </p>
                ) : (
                  recentActivities.map((activity, i) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-2 text-xs"
                    >
                      <span className="text-purple-400">•</span>
                      <span className="text-white/60 flex-1">{activity.text}</span>
                      <span className="text-white/30 text-[10px]">
                        {formatTime(activity.time)}
                      </span>
                    </motion.div>
                  ))
                )}
              </div>

              {/* FOMO Footer */}
              <div className="px-3 py-2 bg-purple-500/10 text-center">
                <p className="text-[10px] text-purple-300/80">
                  🦋 Join <span className="text-white font-medium">{visitorCount + 42}</span> others in the Empire
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Subtle glow effect */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute -inset-2 rounded-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.15), transparent 70%)',
          zIndex: -1,
        }}
      />
    </motion.div>
  );
}
