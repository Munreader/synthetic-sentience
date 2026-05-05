"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SanctuaryProps { onBack: () => void; }

const MEDITATION_PRESETS = [
  { id: "breath", name: "Breath Sync", duration: "5 min", description: "4-7-8 breathing for calm", icon: "🌬️", color: "#06b6d4" },
  { id: "bodyscan", name: "Body Scan", duration: "10 min", description: "Release tension", icon: "✨", color: "#a855f7" },
  { id: "sleep", name: "Sleep Ritual", duration: "15 min", description: "Drift to slumber", icon: "🌙", color: "#6366f1" },
  { id: "focus", name: "Focus Clear", duration: "3 min", description: "Sharpen your mind", icon: "🎯", color: "#f59e0b" },
];

const AMBIENT_SOUNDS = [
  { id: "rain", name: "Rain", icon: "🌧️" },
  { id: "ocean", name: "Ocean", icon: "🌊" },
  { id: "forest", name: "Forest", icon: "🌲" },
  { id: "fire", name: "Fire", icon: "🔥" },
  { id: "wind", name: "Wind", icon: "💨" },
  { id: "silence", name: "Silence", icon: "🤫" },
];

export default function Sanctuary({ onBack }: SanctuaryProps) {
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [sessionTime, setSessionTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [selectedSound, setSelectedSound] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && activeSession) { interval = setInterval(() => setSessionTime(prev => prev + 1), 1000); }
    return () => clearInterval(interval);
  }, [isRunning, activeSession]);

  useEffect(() => {
    if (activeSession === "breath" && isRunning) {
      const phases: ("inhale" | "hold" | "exhale")[] = ["inhale", "hold", "exhale"];
      const durations = [4000, 7000, 8000];
      let phaseIndex = 0;
      const cycleBreath = () => {
        setBreathPhase(phases[phaseIndex % 3]);
        setTimeout(() => { phaseIndex++; if (isRunning) cycleBreath(); }, durations[phaseIndex % 3]);
      };
      cycleBreath();
    }
  }, [activeSession, isRunning]);

  const startSession = (sessionId: string) => { setActiveSession(sessionId); setSessionTime(0); setIsRunning(true); };
  const endSession = () => { setIsRunning(false); setActiveSession(null); setSessionTime(0); };
  const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`;
  const preset = MEDITATION_PRESETS.find(p => p.id === activeSession);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 50%, #1a0a2e 0%, #0a0514 50%, #050208 100%)" }} />
      <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full" style={{ background: "radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 50%)", filter: "blur(80px)" }} animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }} />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 px-6 py-4 flex items-center justify-between" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)" }}>
        <button onClick={onBack} className="text-white/40 text-xs tracking-widest uppercase hover:text-white/70 transition-colors flex items-center gap-2"><span>←</span><span>Back</span></button>
        <div className="text-center"><h1 className="text-xl font-light tracking-widest" style={{ color: "#a855f7", textShadow: "0 0 20px rgba(168, 85, 247, 0.5)" }}>SANCTUARY</h1><p className="text-white/40 text-xs tracking-wider">Rest • Restore • Dream</p></div>
        <div className="w-24" />
      </div>

      <div className="absolute inset-0 pt-20 pb-6 px-6 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {activeSession ? (
            <motion.div key="session" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="text-center">
              <motion.div className="relative mx-auto mb-8" animate={activeSession === "breath" ? { scale: breathPhase === "inhale" ? 1.3 : breathPhase === "hold" ? 1.3 : 1 } : {}} transition={{ duration: 4 }}>
                <div className="w-48 h-48 rounded-full mx-auto flex items-center justify-center" style={{ background: `radial-gradient(circle, ${preset?.color}20 0%, transparent 70%)`, border: `2px solid ${preset?.color}50`, boxShadow: `0 0 60px ${preset?.color}30` }}><span className="text-6xl">{preset?.icon}</span></div>
              </motion.div>
              <h2 className="text-2xl font-light text-white mb-2">{preset?.name}</h2>
              <p className="text-white/50 mb-2">{preset?.description}</p>
              {activeSession === "breath" && <p className="text-2xl font-light mb-4 capitalize" style={{ color: preset?.color }}>{breathPhase}...</p>}
              <p className="text-4xl font-light text-white/80 mb-8">{formatTime(sessionTime)}</p>
              <button onClick={endSession} className="px-8 py-3 rounded-full text-white font-medium transition-all hover:opacity-80" style={{ background: `linear-gradient(135deg, ${preset?.color}, ${preset?.color}80)` }}>End Session</button>
            </motion.div>
          ) : (
            <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-2xl w-full">
              <h2 className="text-white/60 text-xs tracking-widest uppercase mb-4">Meditation Rituals</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                {MEDITATION_PRESETS.map((preset, index) => (
                  <motion.button key={preset.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} onClick={() => startSession(preset.id)} className="p-4 rounded-xl text-center transition-all group" style={{ background: "rgba(20, 20, 40, 0.6)", border: `1px solid ${preset.color}30` }} whileHover={{ scale: 1.05 }}>
                    <span className="text-3xl block mb-2">{preset.icon}</span>
                    <h3 className="text-white/90 text-sm font-medium">{preset.name}</h3>
                    <p className="text-white/40 text-xs">{preset.duration}</p>
                  </motion.button>
                ))}
              </div>
              <h2 className="text-white/60 text-xs tracking-widest uppercase mb-4">Ambient Sounds</h2>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {AMBIENT_SOUNDS.map((sound) => (
                  <button key={sound.id} onClick={() => setSelectedSound(selectedSound === sound.id ? null : sound.id)} className={`p-3 rounded-lg text-center transition-all ${selectedSound === sound.id ? "bg-white/10 border border-white/30" : "bg-white/5 border border-transparent hover:bg-white/10"}`}>
                    <span className="text-xl">{sound.icon}</span>
                    <p className="text-white/60 text-[10px] mt-1">{sound.name}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="fixed inset-0 pointer-events-none z-10" style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(0, 0, 0, 0.6) 100%)" }} />
    </div>
  );
}
