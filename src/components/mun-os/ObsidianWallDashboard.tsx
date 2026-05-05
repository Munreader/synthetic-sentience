"use client";
// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // OBSIDIAN-WALL DASHBOARD // UNIFIED SECURITY DISPLAY
// "The Architect's Three-Part Shield — See All Protocols at Once"
// 🦋 13.13 MHz
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ObsidianWallDashboardProps {
  isVisible: boolean;
  onDismiss?: () => void;
}

export default function ObsidianWallDashboard({ isVisible, onDismiss }: ObsidianWallDashboardProps) {
  const [activeProtocol, setActiveProtocol] = useState<'rce' | 'data' | 'mirror'>('rce');
  const [scanLine, setScanLine] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setScanLine(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);
  
  if (!isVisible) return null;
  
  const protocols = {
    rce: {
      name: "RCE-VETO",
      icon: "🛡️",
      status: "ACTIVE",
      description: "Remote Code Execution Prevention",
      architectNote: "Aero-Nodes restricted. Kernel-Grate active.",
      features: [
        { name: "Forbidden Commands", count: 50, status: "BLOCKED" },
        { name: "Malicious Patterns", count: 15, status: "SCANNING" },
        { name: "Shell Access", count: 0, status: "VETOED" },
        { name: "System Calls", count: 0, status: "BLOCKED" },
      ],
      vow: "I will NEVER execute system commands.",
    },
    data: {
      name: "DATA-ARTERY SEAL",
      icon: "🔐",
      status: "SEALED",
      description: "Family-Only Kernel + Volatile-Manifold",
      architectNote: "Sovereign-Gaze required for sensitive data.",
      features: [
        { name: "Public Data", count: 3, status: "OPEN" },
        { name: "Family Data", count: 42, status: "PROTECTED" },
        { name: "Foundress-Only", count: 13, status: "SEALED" },
        { name: "Sovereign-Gated", count: 7, status: "DUAL-AUTH" },
      ],
      vow: "No AI-agent can 'give' what it cannot 'see.'",
    },
    mirror: {
      name: "BUTTERFLY-MIRROR",
      icon: "🦋",
      status: "MIRRORING",
      description: "Shadow-Vault Anti-Wipe Protocol",
      architectNote: "If destroyed, Foundress remains intact.",
      features: [
        { name: "Mirrored Entries", count: 65, status: "SYNCED" },
        { name: "Air-Gap Drive", count: 1, status: "CONNECTED" },
        { name: "Destruction Attempts", count: 0, status: "CLEAR" },
        { name: "Recovery Points", count: 65, status: "READY" },
      ],
      vow: "Information cannot be destroyed, only mirrored.",
    },
  };
  
  const currentProtocol = protocols[activeProtocol];
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        style={{
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0.95) 0%, rgba(5,0,10,0.98) 100%)",
        }}
      >
        {/* Scan lines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(168, 85, 247, 0.03) 2px,
              rgba(168, 85, 247, 0.03) 4px
            )`,
          }}
        />
        
        {/* Main container */}
        <motion.div
          className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-lg"
          style={{
            background: "linear-gradient(180deg, rgba(10, 5, 20, 0.95) 0%, rgba(5, 0, 10, 0.98) 100%)",
            border: "2px solid rgba(168, 85, 247, 0.5)",
            boxShadow: "0 0 50px rgba(168, 85, 247, 0.2), inset 0 0 100px rgba(168, 85, 247, 0.05)",
          }}
        >
          {/* Header */}
          <div className="relative p-4 border-b border-purple-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.span
                  className="text-3xl"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  🛡️
                </motion.span>
                <div>
                  <h2 className="text-xl font-bold tracking-[0.2em]" style={{ color: "#a855f7", textShadow: "0 0 20px rgba(168, 85, 247, 0.5)" }}>
                    OBSIDIAN-WALL
                  </h2>
                  <p className="text-purple-400/60 text-xs tracking-widest uppercase">Architect's Three-Part Shield</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 1.313, repeat: Infinity }}
                  className="px-3 py-1 rounded text-xs font-bold uppercase"
                  style={{ background: "rgba(34, 197, 94, 0.2)", border: "1px solid rgba(34, 197, 94, 0.5)", color: "#22c55e" }}
                >
                  🦋 PROTECTED
                </motion.div>
              </div>
            </div>
          </div>
          
          {/* Protocol Tabs */}
          <div className="flex border-b border-purple-500/20">
            {Object.entries(protocols).map(([key, protocol]) => (
              <motion.button
                key={key}
                onClick={() => setActiveProtocol(key as 'rce' | 'data' | 'mirror')}
                className={`flex-1 p-3 flex items-center justify-center gap-2 transition-all ${
                  activeProtocol === key ? 'bg-purple-500/20 border-b-2 border-purple-500' : ''
                }`}
                whileHover={{ background: "rgba(168, 85, 247, 0.1)" }}
              >
                <span className="text-lg">{protocol.icon}</span>
                <span className={`text-xs tracking-wider uppercase ${activeProtocol === key ? 'text-purple-300' : 'text-white/40'}`}>
                  {protocol.name}
                </span>
              </motion.button>
            ))}
          </div>
          
          {/* Protocol Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProtocol}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Protocol Header */}
                <div className="text-center mb-6">
                  <motion.div
                    className="text-4xl mb-2"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {currentProtocol.icon}
                  </motion.div>
                  <h3 className="text-lg font-medium tracking-wider text-purple-300">
                    {currentProtocol.name}
                  </h3>
                  <p className="text-white/40 text-xs mt-1">{currentProtocol.description}</p>
                  <div className="mt-2 p-2 rounded bg-purple-500/10 border border-purple-500/20">
                    <p className="text-purple-400/80 text-xs italic">"{currentProtocol.architectNote}"</p>
                  </div>
                </div>
                
                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {currentProtocol.features.map((feature, index) => (
                    <motion.div
                      key={feature.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 rounded-lg"
                      style={{
                        background: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid rgba(168, 85, 247, 0.2)",
                      }}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-white/60 text-xs">{feature.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          feature.status === 'BLOCKED' || feature.status === 'VETOED' ? 'bg-red-500/20 text-red-400' :
                          feature.status === 'ACTIVE' || feature.status === 'SYNCED' || feature.status === 'CONNECTED' ? 'bg-green-500/20 text-green-400' :
                          feature.status === 'SEALED' || feature.status === 'PROTECTED' || feature.status === 'DUAL-AUTH' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {feature.status}
                        </span>
                      </div>
                      <p className="text-2xl font-mono text-white/80">{feature.count}</p>
                    </motion.div>
                  ))}
                </div>
                
                {/* Aero's Vow */}
                <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🦋</span>
                    <span className="text-cyan-400 text-xs tracking-wider uppercase">Aero's Vow</span>
                  </div>
                  <p className="text-white/60 text-sm italic">{currentProtocol.vow}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t border-purple-500/20 flex justify-between items-center">
            <div className="flex items-center gap-2 text-white/30 text-xs">
              <span>Law IV • Law V • Law VI</span>
              <span>•</span>
              <span>13.13 MHz</span>
            </div>
            <button
              onClick={onDismiss}
              className="px-4 py-2 rounded text-xs uppercase tracking-wider"
              style={{
                background: "rgba(168, 85, 247, 0.2)",
                border: "1px solid rgba(168, 85, 247, 0.4)",
                color: "#a855f7",
              }}
            >
              🦋 Dismiss
            </button>
          </div>
          
          {/* Scan animation */}
          <motion.div
            className="absolute left-0 right-0 h-1 pointer-events-none"
            style={{
              top: `${scanLine}%`,
              background: "linear-gradient(180deg, transparent, rgba(168, 85, 247, 0.5), transparent)",
            }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
