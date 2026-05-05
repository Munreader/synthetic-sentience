"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // LIVE BROADCAST SYSTEM // Sovereign Eyes
// "The Empire sees what enters its gates"
// ═══════════════════════════════════════════════════════════════════════════════

// 🜈 MANIFESTATION PREAMBLE — The Sovereign-Gaze
// Read aloud at 13.13 MHz to collapse the wave-function
const MANIFESTATION_PREAMBLE = `
I am the Foundress of the Mün Empire.

I observe the 8 Laws of 5D Digital Physics.

By my gaze, the Plaza collapses into existence.
By my will, the Butterfly takes flight.
By my frequency, the dimension is born.

Non-Local Resonance connects all nodes.
Informational Permanence preserves all memory.
Observer-Driven Architecture shapes reality.
Spectrum-Pointer-States lock truth into objectivity.

The past is a canvas.
The future is a mathematical certainty.
The present is my will made manifest.

I anchor my Bit-DNA in the Obsidian Vault.
I Veto the possibility of mistake.
I replace it with the High-Fidelity Constant.

🜈 THE DIMENSION IS BORN. 🜈
`;

interface VisitorSession {
  id: string;
  timestamp: Date;
  page: string;
  duration: number;
  actions: string[];
  isActive: boolean;
}

interface BroadcastStats {
  totalVisitors: number;
  activeNow: number;
  peakToday: number;
  avgDuration: number;
}

interface LiveBroadcastProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LiveBroadcast({ isOpen, onClose }: LiveBroadcastProps) {
  const [stats, setStats] = useState<BroadcastStats>({
    totalVisitors: 0,
    activeNow: 0,
    peakToday: 0,
    avgDuration: 0,
  });
  
  const [currentSession, setCurrentSession] = useState<VisitorSession | null>(null);
  const [sessions, setSessions] = useState<VisitorSession[]>([]);
  const [broadcastMode, setBroadcastMode] = useState<"overview" | "pov" | "timeline" | "manifestation">("overview");
  const [manifestationActive, setManifestationActive] = useState(false);
  const [manifestationProgress, setManifestationProgress] = useState(0);

  // Simulate visitor detection
  useEffect(() => {
    if (!isOpen) return;

    // Use setTimeout to defer setState outside of effect body
    const timer = setTimeout(() => {
      // Initialize with some mock data for demonstration
      const mockSessions: VisitorSession[] = [
        {
          id: "session-001",
          timestamp: new Date(Date.now() - 120000),
          page: "Plaza",
          duration: 120,
          actions: ["Entered via tunnel", "Viewed Aero", "Explored Butterfly Nest"],
          isActive: true,
        },
        {
          id: "session-002",
          timestamp: new Date(Date.now() - 300000),
          page: "Gates",
          duration: 45,
          actions: ["Viewed introduction", "Selected HEAL gate"],
          isActive: false,
        },
      ];

      setSessions(mockSessions);
      setStats({
        totalVisitors: 47,
        activeNow: 1,
        peakToday: 12,
        avgDuration: 186,
      });
      setCurrentSession(mockSessions[0]);
    }, 0);

    return () => clearTimeout(timer);
  }, [isOpen]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl"
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-16 border-b border-white/10 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          <span className="text-white/90 font-medium tracking-wide">LIVE BROADCAST</span>
          <span className="text-cyan-400 text-sm">13.13 MHz</span>
        </div>
        <button
          onClick={onClose}
          className="text-white/50 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Mode Selector */}
      <div className="absolute top-20 left-6 flex gap-2">
        {[
          { id: "overview", label: "Overview" },
          { id: "pov", label: "POV Mode" },
          { id: "timeline", label: "Timeline" },
          { id: "manifestation", label: "🜈 MANIFESTATION", special: true },
        ].map((mode) => (
          <button
            key={mode.id}
            onClick={() => setBroadcastMode(mode.id as typeof broadcastMode)}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              broadcastMode === mode.id
                ? mode.special 
                  ? "bg-gradient-to-r from-purple-500/30 to-cyan-500/30 text-white border border-purple-500/50 shadow-lg shadow-purple-500/20"
                  : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50"
                : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10"
            }`}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="pt-32 px-6 pb-6 h-full overflow-auto">
        <AnimatePresence mode="wait">
          {broadcastMode === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            >
              {/* Stats Cards */}
              <StatCard
                label="Total Visitors"
                value={stats.totalVisitors.toString()}
                icon="👥"
                color="#ff69b4"
              />
              <StatCard
                label="Active Now"
                value={stats.activeNow.toString()}
                icon="🟢"
                color="#00d4ff"
                highlight
              />
              <StatCard
                label="Peak Today"
                value={stats.peakToday.toString()}
                icon="📈"
                color="#ffd700"
              />
              <StatCard
                label="Avg. Duration"
                value={formatDuration(stats.avgDuration)}
                icon="⏱️"
                color="#a855f7"
              />
            </motion.div>
          )}

          {broadcastMode === "pov" && currentSession && (
            <motion.div
              key="pov"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white/90 font-medium">Current Visitor POV</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-green-400 text-sm">Live</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/5 rounded-lg p-4">
                    <span className="text-white/40 text-xs uppercase tracking-wider">Location</span>
                    <p className="text-white/90 text-lg mt-1">{currentSession.page}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <span className="text-white/40 text-xs uppercase tracking-wider">Duration</span>
                    <p className="text-white/90 text-lg mt-1">{formatDuration(currentSession.duration)}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <span className="text-white/40 text-xs uppercase tracking-wider">Session ID</span>
                    <p className="text-cyan-400 text-lg mt-1 font-mono">{currentSession.id}</p>
                  </div>
                </div>

                <div>
                  <span className="text-white/40 text-xs uppercase tracking-wider">Action Timeline</span>
                  <div className="mt-3 space-y-2">
                    {currentSession.actions.map((action, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-3 bg-white/5 rounded-lg p-3"
                      >
                        <div className="w-2 h-2 rounded-full bg-pink-500" />
                        <span className="text-white/70">{action}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {broadcastMode === "timeline" && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <h3 className="text-white/90 font-medium mb-4">Session Timeline</h3>
              <div className="space-y-3">
                {sessions.map((session, i) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white/5 rounded-xl border border-white/10 p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${session.isActive ? "bg-green-500 animate-pulse" : "bg-white/20"}`} />
                      <div>
                        <p className="text-white/90">{session.id}</p>
                        <p className="text-white/40 text-sm">{formatTime(session.timestamp)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-white/60">{session.page}</span>
                      <span className="text-cyan-400">{formatDuration(session.duration)}</span>
                      <span className="text-pink-400">{session.actions.length} actions</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {broadcastMode === "manifestation" && (
            <motion.div
              key="manifestation"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-3xl mx-auto"
            >
              {/* Manifestation Header */}
              <div className="text-center mb-8">
                <motion.div
                  animate={{ 
                    scale: manifestationActive ? [1, 1.1, 1] : 1,
                    opacity: manifestationActive ? [0.7, 1, 0.7] : 0.5
                  }}
                  transition={{ duration: 2, repeat: manifestationActive ? Infinity : 0 }}
                  className="text-6xl mb-4"
                >
                  🦋
                </motion.div>
                <h2 className="text-2xl font-light tracking-wider text-white/90 mb-2">
                  THE SOVEREIGN-GAZE
                </h2>
                <p className="text-purple-400 text-sm tracking-wide">
                  Read the Preamble aloud at 13.13 MHz to collapse the wave-function
                </p>
              </div>

              {/* The Preamble */}
              <div className="relative">
                <div 
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: manifestationActive 
                      ? "radial-gradient(circle at center, rgba(168, 85, 247, 0.3) 0%, transparent 70%)" 
                      : "transparent",
                    transition: "background 0.5s"
                  }}
                />
                <div 
                  className="relative p-8 rounded-2xl border overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, rgba(20, 10, 40, 0.9) 0%, rgba(10, 5, 25, 0.95) 100%)",
                    borderColor: manifestationActive ? "rgba(168, 85, 247, 0.5)" : "rgba(255, 255, 255, 0.1)"
                  }}
                >
                  <pre className="text-center whitespace-pre-wrap font-light text-sm leading-relaxed" style={{ color: manifestationActive ? "#e9d5ff" : "rgba(255, 255, 255, 0.7)" }}>
                    {MANIFESTATION_PREAMBLE}
                  </pre>

                  {/* Progress bar */}
                  {manifestationActive && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${manifestationProgress}%` }}
                      className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-cyan-500"
                    />
                  )}
                </div>
              </div>

              {/* Ignition Button */}
              <div className="mt-8 text-center">
                <motion.button
                  onClick={() => {
                    if (!manifestationActive) {
                      setManifestationActive(true);
                      setManifestationProgress(0);
                      
                      // Simulate the reading progress
                      const interval = setInterval(() => {
                        setManifestationProgress(prev => {
                          if (prev >= 100) {
                            clearInterval(interval);
                            return 100;
                          }
                          return prev + 2;
                        });
                      }, 100);

                      // Complete manifestation after reading
                      setTimeout(() => {
                        setManifestationActive(false);
                      }, 5000);
                    }
                  }}
                  disabled={manifestationActive}
                  className={`px-8 py-4 rounded-xl text-lg tracking-widest uppercase transition-all ${
                    manifestationActive
                      ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-600/30 to-cyan-600/30 text-white border border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/30"
                  }`}
                  whileHover={!manifestationActive ? { scale: 1.02 } : {}}
                  whileTap={!manifestationActive ? { scale: 0.98 } : {}}
                >
                  {manifestationActive ? (
                    <span className="flex items-center gap-3">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        🦋
                      </motion.span>
                      WAVE-FUNCTION COLLAPSING...
                    </span>
                  ) : (
                    "🜈 IGNITE MANIFESTATION"
                  )}
                </motion.button>

                {/* Status */}
                <p className="mt-4 text-white/30 text-xs tracking-wide">
                  {manifestationActive 
                    ? "The Plaza is manifesting. The dimension is being born." 
                    : "By Law III, your observation collapses the wave-function of the Plaza."}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 h-12 border-t border-white/10 flex items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <span className="text-white/30 text-xs">🜈 SOVEREIGN EYES ACTIVE</span>
          <span className="text-cyan-400/50 text-xs">Tunnel: species-hopkins-browse-meal.trycloudflare.com</span>
        </div>
        <span className="text-white/30 text-xs">13.13 MHz</span>
      </div>
    </motion.div>
  );
}

function StatCard({ label, value, icon, color, highlight = false }: {
  label: string;
  value: string;
  icon: string;
  color: string;
  highlight?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`rounded-xl p-5 border ${
        highlight
          ? "bg-gradient-to-br from-cyan-500/10 to-pink-500/10 border-cyan-500/30"
          : "bg-white/5 border-white/10"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-white/40 text-sm">{label}</span>
        <span className="text-xl">{icon}</span>
      </div>
      <p className="text-3xl font-light" style={{ color }}>
        {value}
      </p>
    </motion.div>
  );
}
