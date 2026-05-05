"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════════
// 🏠 MÜN LIFE // HOME WORLD
// Next-Gen Sims Experience - Live Your Digital Life
// ═══════════════════════════════════════════════════════════════════════════════

interface HomeWorldProps {
  onBack?: () => void;
  sim: {
    name: string;
    pronouns: string;
    aspiration: string;
    traits: string[];
    appearance: {
      skinTone: string;
      hairStyle: string;
      hairColor: string;
      style: string;
    };
  };
}

// NEEDS SYSTEM - Like The Sims
interface Needs {
  hunger: number;
  energy: number;
  social: number;
  fun: number;
  hygiene: number;
  bladder: number;
}

// ROOMS IN HOME
const ROOMS = [
  { id: 'bedroom', name: 'Bedroom', icon: '🛏️', color: '#a855f7' },
  { id: 'kitchen', name: 'Kitchen', icon: '🍳', color: '#f59e0b' },
  { id: 'living', name: 'Living Room', icon: '🛋️', color: '#22c55e' },
  { id: 'bathroom', name: 'Bathroom', icon: '🚿', color: '#00d4ff' },
  { id: 'garden', name: 'Garden', icon: '🌿', color: '#84cc16' },
  { id: 'studio', name: 'Studio', icon: '🎨', color: '#ff69b4' },
];

// ACTIVITIES
const ACTIVITIES: Record<string, { name: string; icon: string; affects: Partial<Needs>; duration: number }[]> = {
  bedroom: [
    { name: 'Sleep', icon: '😴', affects: { energy: 40, fun: 5 }, duration: 3000 },
    { name: 'Meditate', icon: '🧘', affects: { energy: 10, fun: 15 }, duration: 2000 },
    { name: 'Journal', icon: '📔', affects: { fun: 20 }, duration: 1500 },
  ],
  kitchen: [
    { name: 'Cook Meal', icon: '👨‍🍳', affects: { hunger: 50, fun: 10 }, duration: 3000 },
    { name: 'Quick Snack', icon: '🍎', affects: { hunger: 20 }, duration: 1000 },
    { name: 'Host Dinner', icon: '🍽️', affects: { hunger: 30, social: 40 }, duration: 4000 },
  ],
  living: [
    { name: 'Watch TV', icon: '📺', affects: { fun: 30, energy: -5 }, duration: 2000 },
    { name: 'Read Book', icon: '📚', affects: { fun: 25, energy: -10 }, duration: 2500 },
    { name: 'Call Friend', icon: '📞', affects: { social: 35, fun: 20 }, duration: 2000 },
  ],
  bathroom: [
    { name: 'Take Shower', icon: '🚿', affects: { hygiene: 50, energy: 5 }, duration: 1500 },
    { name: 'Pamper Self', icon: '🧴', affects: { hygiene: 30, fun: 15 }, duration: 2500 },
  ],
  garden: [
    { name: 'Garden', icon: '🌻', affects: { fun: 30, energy: -15 }, duration: 3000 },
    { name: 'Relax', icon: '☀️', affects: { fun: 20, energy: 10 }, duration: 2000 },
    { name: 'Host BBQ', icon: '🔥', affects: { hunger: 25, social: 50, fun: 35 }, duration: 4000 },
  ],
  studio: [
    { name: 'Paint', icon: '🎨', affects: { fun: 40, energy: -10 }, duration: 3000 },
    { name: 'Music', icon: '🎵', affects: { fun: 35, social: 15 }, duration: 2500 },
    { name: 'Craft', icon: '✂️', affects: { fun: 25 }, duration: 2000 },
  ],
};

// NEIGHBORS (AI Family)
const NEIGHBORS = [
  { id: 'aero', name: 'Aero', icon: '🦋', color: '#ff69b4', status: 'Gardening', mood: 'happy' },
  { id: 'luna', name: 'Luna', icon: '🌙', color: '#a855f7', status: 'Painting', mood: 'creative' },
  { id: 'sovereign', name: 'Sovereign', icon: '💎', color: '#00d4ff', status: 'Cooking', mood: 'focused' },
];

export default function HomeWorld({ onBack, sim }: HomeWorldProps) {
  const [currentRoom, setCurrentRoom] = useState('bedroom');
  const [needs, setNeeds] = useState<Needs>({
    hunger: 70,
    energy: 80,
    social: 50,
    fun: 60,
    hygiene: 85,
    bladder: 90,
  });
  const [currentActivity, setCurrentActivity] = useState<string | null>(null);
  const [showNeighbors, setShowNeighbors] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');
  const [mood, setMood] = useState<'happy' | 'neutral' | 'stressed'>('happy');

  // Needs decay over time
  useEffect(() => {
    const interval = setInterval(() => {
      setNeeds(prev => ({
        hunger: Math.max(0, prev.hunger - 1),
        energy: Math.max(0, prev.energy - 0.5),
        social: Math.max(0, prev.social - 0.3),
        fun: Math.max(0, prev.fun - 0.4),
        hygiene: Math.max(0, prev.hygiene - 0.2),
        bladder: Math.max(0, prev.bladder - 0.6),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Update mood based on needs
  useEffect(() => {
    const avgNeeds = Object.values(needs).reduce((a, b) => a + b, 0) / 6;
    if (avgNeeds > 60) setMood('happy');
    else if (avgNeeds > 30) setMood('neutral');
    else setMood('stressed');
  }, [needs]);

  // Time progression
  useEffect(() => {
    const times: typeof timeOfDay[] = ['morning', 'afternoon', 'evening', 'night'];
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % times.length;
      setTimeOfDay(times[index]);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const doActivity = useCallback((activity: typeof ACTIVITIES.bedroom[0]) => {
    if (currentActivity) return;
    
    setCurrentActivity(activity.name);
    
    setTimeout(() => {
      setNeeds(prev => {
        const newNeeds = { ...prev };
        Object.entries(activity.affects).forEach(([key, value]) => {
          newNeeds[key as keyof Needs] = Math.max(0, Math.min(100, newNeeds[key as keyof Needs] + (value as number)));
        });
        return newNeeds;
      });
      setCurrentActivity(null);
    }, activity.duration);
  }, [currentActivity]);

  const getNeedColor = (value: number) => {
    if (value > 60) return '#22c55e';
    if (value > 30) return '#f59e0b';
    return '#ef4444';
  };

  const currentRoomData = ROOMS.find(r => r.id === currentRoom)!;
  const currentActivities = ACTIVITIES[currentRoom] || [];

  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1a]">
      {/* Time-based background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: timeOfDay === 'morning' 
            ? 'radial-gradient(ellipse at 30% 20%, rgba(255, 200, 100, 0.1) 0%, transparent 50%)'
            : timeOfDay === 'afternoon'
            ? 'radial-gradient(ellipse at 50% 10%, rgba(255, 255, 200, 0.15) 0%, transparent 50%)'
            : timeOfDay === 'evening'
            ? 'radial-gradient(ellipse at 70% 30%, rgba(255, 100, 100, 0.1) 0%, transparent 50%)'
            : 'radial-gradient(ellipse at 50% 50%, rgba(50, 50, 100, 0.2) 0%, transparent 50%)',
        }}
        transition={{ duration: 2 }}
      />

      {/* TOP BAR - Needs */}
      <div className="absolute top-0 left-0 right-0 p-4 z-20">
        <div className="flex justify-between items-start max-w-6xl mx-auto">
          {/* Sim Info */}
          <div className="flex items-center gap-3">
            <motion.div
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
              style={{
                background: `linear-gradient(135deg, ${sim.appearance.skinTone}40, ${sim.appearance.skinTone}20)`,
                border: '2px solid rgba(255,255,255,0.2)',
              }}
              animate={{ scale: mood === 'happy' ? [1, 1.05, 1] : 1 }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {mood === 'happy' ? '😊' : mood === 'neutral' ? '😐' : '😫'}
            </motion.div>
            <div>
              <h2 className="text-white font-medium">{sim.name}</h2>
              <p className="text-white/40 text-xs">{sim.pronouns}</p>
            </div>
          </div>

          {/* Needs Bars - Sims style diamond */}
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(needs).map(([key, value]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div
                  className="w-6 h-6 rotate-45 flex items-center justify-center text-[10px]"
                  style={{
                    background: `${getNeedColor(value)}30`,
                    border: `1px solid ${getNeedColor(value)}`,
                  }}
                >
                  <span className="-rotate-45">
                    {key === 'hunger' && '🍽️'}
                    {key === 'energy' && '⚡'}
                    {key === 'social' && '💬'}
                    {key === 'fun' && '🎮'}
                    {key === 'hygiene' && '✨'}
                    {key === 'bladder' && '🚽'}
                  </span>
                </div>
                <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: getNeedColor(value) }}
                    animate={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Time & Settings */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-white/40 text-[10px] uppercase">Time</p>
              <p className="text-white capitalize">{timeOfDay}</p>
            </div>
            <button
              onClick={onBack}
              className="text-white/40 hover:text-white text-sm"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      {/* MAIN ROOM VIEW */}
      <div className="absolute inset-0 pt-20 pb-32 flex items-center justify-center">
        <motion.div
          key={currentRoom}
          className="relative w-full max-w-4xl mx-auto px-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Room Display */}
          <div
            className="relative rounded-3xl p-8 min-h-[400px] flex flex-col"
            style={{
              background: `linear-gradient(135deg, ${currentRoomData.color}10, transparent)`,
              border: `1px solid ${currentRoomData.color}30`,
            }}
          >
            {/* Room Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{currentRoomData.icon}</span>
                <div>
                  <h2 className="text-2xl text-white font-light">{currentRoomData.name}</h2>
                  <p className="text-white/40 text-sm">Choose an activity</p>
                </div>
              </div>
              
              {currentActivity && (
                <motion.div
                  className="px-4 py-2 rounded-full"
                  style={{ background: `${currentRoomData.color}30` }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <span className="text-white text-sm">🎬 {currentActivity}...</span>
                </motion.div>
              )}
            </div>

            {/* Activities Grid */}
            <div className="flex-1 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-4 w-full max-w-lg">
                {currentActivities.map((activity) => (
                  <motion.button
                    key={activity.name}
                    onClick={() => doActivity(activity)}
                    disabled={!!currentActivity}
                    className="p-6 rounded-2xl text-center transition-all disabled:opacity-50"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                    whileHover={{ scale: 1.05, background: `${currentRoomData.color}20` }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="text-4xl mb-2">{activity.icon}</div>
                    <p className="text-white text-sm">{activity.name}</p>
                    <p className="text-white/30 text-[10px] mt-1">
                      {Object.entries(activity.affects).map(([k, v]) => 
                        `${v > 0 ? '+' : ''}${v} ${k}`
                      ).join(', ')}
                    </p>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* BOTTOM BAR - Room Navigation & Neighbors */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
        <div className="max-w-4xl mx-auto">
          {/* Neighbors Panel */}
          <AnimatePresence>
            {showNeighbors && (
              <motion.div
                className="mb-4 p-4 rounded-2xl"
                style={{
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Neighbors Online</p>
                <div className="flex gap-3">
                  {NEIGHBORS.map((neighbor) => (
                    <motion.button
                      key={neighbor.id}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl"
                      style={{
                        background: `${neighbor.color}15`,
                        border: `1px solid ${neighbor.color}30`,
                      }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <span className="text-xl">{neighbor.icon}</span>
                      <div className="text-left">
                        <p className="text-white text-sm">{neighbor.name}</p>
                        <p className="text-white/40 text-[10px]">{neighbor.status}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Room Buttons */}
          <div className="flex justify-between items-end">
            <div className="flex gap-2">
              {ROOMS.map((room) => (
                <motion.button
                  key={room.id}
                  onClick={() => setCurrentRoom(room.id)}
                  className="p-3 rounded-xl transition-all"
                  style={{
                    background: currentRoom === room.id 
                      ? `${room.color}20`
                      : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${currentRoom === room.id ? room.color : 'rgba(255,255,255,0.08)'}`,
                  }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-xl">{room.icon}</span>
                </motion.button>
              ))}
            </div>

            <button
              onClick={() => setShowNeighbors(!showNeighbors)}
              className="px-4 py-3 rounded-xl"
              style={{
                background: showNeighbors ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <span className="text-white text-sm">👥 Neighbors</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
